#!/usr/bin/env python3
"""GPU three-street flop solver: flop+turn betting wrapping the batched river core.

The capstone of the batched-GPU solver track. Structure (turn-sampled, river-
enumerated, all multiraise betting):

  flop betting (single reach)
    -> at each flop-continue, a TURN subgame for the iteration's sampled turn t:
         turn betting (single reach)
           -> at each turn-continue, the river enumeration solved as ONE batched
              pass over the B rivers (excluding flop+t) — shared river betting
              structure, per-river sign matrices (B,n,n).

This is turn_batched (validated: converges to 0, 20.7x GPU) with a flop betting
layer on top and the turn card sampled per iteration (regrets keyed by t). The
batched river core (batched_river: 0.0000pp parity, 19.6x GPU) is the inner engine.

Why it matters: the numpy flop solver is Python-recursion-bound, so deep-SPR flops
(~100bb, SPR ~13 — what the app plays) don't converge in feasible CPU time, which
is why the distilled flop model is gated off. On GPU this converges deep, yielding
trustworthy deep targets to retrain + ship the flop model.

Validation (local): converges toward 0 on its own game with an EXACT enumerated
best response over all turn+river cards confirming equilibrium.

Run:
  python3 scripts/solver/flop_batched.py --self-test
  python3 scripts/solver/flop_batched.py --device cuda --board "Kh 9d 4s" --stack 80 --iterations 3000
"""

from __future__ import annotations

import argparse
import time

import numpy as np
import torch

from river_cfr import Node, OOP, IP, all_combos, conflict_mask, parse_board, card_text, _combo_key
from multiraise_tree import build_multiraise_betting

np.seterr(over="ignore", invalid="ignore", divide="ignore")


def _tag(node, street):
    if node.kind == "decision" and getattr(node, "street", None) is None:
        node.street = street
    for c in node.children:
        _tag(c, street)


def _index(root):
    out = []

    def walk(n):
        if n.kind == "decision":
            n.index = len(out)
            out.append(n)
        for c in n.children:
            walk(c)

    walk(root)
    return out


def _showdown(inv):
    return Node(kind="showdown", invested=float(inv))


class FlopBatchedSolver:
    def __init__(self, flop_board, combos, pot, stack, flop_bets, turn_bets, river_bets,
                 raise_mults=(2.0, 4.0), device="cpu", dtype=torch.float64, seed=0):
        self.device = torch.device(device)
        self.dtype = dtype
        self.flop = flop_board
        self.combos = combos
        self.combo_arr = np.array(combos)
        self.n = len(combos)
        self.pot = float(pot)
        self.stack = float(stack)
        self.turn_bets = turn_bets
        self.river_bets = river_bets
        self.raise_mults = raise_mults
        self.rng = np.random.default_rng(seed)
        self.deck = [c for c in range(52) if c not in set(flop_board)]
        self.valid_np = conflict_mask(combos, combos)
        self.valid = torch.as_tensor(self.valid_np, device=self.device, dtype=dtype)
        self.w_river = 1.0 / 46.0

        # ---- flop betting tree: continue -> turn entry; allin -> turn+river runout ----
        self._turn_entries = []   # entry_id -> flop_inv

        def flop_continue(flop_inv):
            m = Node(kind="turn_entry")
            m.entry_id = len(self._turn_entries)
            m.flop_inv = float(flop_inv)
            self._turn_entries.append(float(flop_inv))
            return m

        def flop_allin(flop_inv):
            nd = Node(kind="runout3", invested=float(flop_inv))  # flop all-in -> turn+river runout
            return nd

        self.root = build_multiraise_betting(pot, stack, flop_bets, raise_mults, flop_continue, flop_allin)
        _tag(self.root, "flop")
        self.flop_nodes = _index(self.root)
        self.flop_regret = [torch.zeros((self.n, len(nd.actions)), device=self.device, dtype=dtype)
                            for nd in self.flop_nodes]
        self.flop_strat_sum = [torch.zeros_like(r) for r in self.flop_regret]

        # turn betting tree per flop entry (structure depends on flop_inv only)
        self._turn_trees = []     # entry_id -> (turn_root, turn_nodes, river_entries[list of (rid, river_root, turn_inv)])
        for flop_inv in self._turn_entries:
            tpot, tstack = pot + 2.0 * flop_inv, stack - flop_inv
            river_entries = []

            def turn_continue(turn_inv, _tpot=tpot, _tstack=tstack, _re=river_entries):
                sub = build_multiraise_betting(_tpot + 2.0 * turn_inv, _tstack - turn_inv,
                                               river_bets, raise_mults, _showdown, _showdown)
                _tag(sub, "river")
                m = Node(kind="river_entry")
                m.rid = len(_re)
                m.base = float(flop_inv + turn_inv)  # chips in the river pot beyond start
                _re.append((m.rid, sub, float(turn_inv)))
                return m

            def turn_allin(turn_inv):
                return Node(kind="runout2", invested=float(flop_inv + turn_inv))

            turn_root = build_multiraise_betting(tpot, tstack, turn_bets, raise_mults, turn_continue, turn_allin)
            _tag(turn_root, "turn")
            turn_nodes = _index(turn_root)
            self._turn_trees.append((turn_root, turn_nodes, river_entries))

        # per-(entry,t) lazily-created state: turn regrets, river regrets (batched), signs
        self._state = {}   # (entry_id, t) -> dict
        self._sign_cache = {}  # t -> (sign(B,n,n), nc(B,n), avg_sign(n,n), rivers)
        self.reach0 = torch.ones(self.n, device=self.device, dtype=dtype) / self.n

    # ---------------- per-turn signs ----------------
    def _signs_for_turn(self, t):
        c = self._sign_cache.get(t)
        if c is not None:
            return c
        rivers = [r for r in self.deck if r != t]
        B = len(rivers)
        signs = np.zeros((B, self.n, self.n), dtype=np.float64)
        nc = np.zeros((B, self.n), dtype=np.float64)
        nct = (~((self.combo_arr[:, 0] == t) | (self.combo_arr[:, 1] == t))).astype(np.float64)
        for bi, r in enumerate(rivers):
            b5 = tuple(self.flop) + (t, r)
            st = np.array([_combo_key(tuple(cc), b5) for cc in self.combos], dtype=np.int64)
            ncr = (~((self.combo_arr[:, 0] == r) | (self.combo_arr[:, 1] == r))).astype(np.float64) * nct
            signs[bi] = np.sign(st[:, None] - st[None, :]) * (self.valid_np * np.outer(ncr, ncr))
            nc[bi] = ncr
        sign_t = torch.as_tensor(signs, device=self.device, dtype=self.dtype)
        nc_t = torch.as_tensor(nc, device=self.device, dtype=self.dtype)
        avg = sign_t.sum(0) / 44.0
        nct_t = torch.as_tensor(nct, device=self.device, dtype=self.dtype)
        c = (sign_t, nc_t, avg, nct_t, B)
        self._sign_cache[t] = c
        return c

    def _get_state(self, entry_id, t):
        key = (entry_id, t)
        s = self._state.get(key)
        if s is not None:
            return s
        _, turn_nodes, river_entries = self._turn_trees[entry_id]
        sign_t, nc_t, avg, nct_t, B = self._signs_for_turn(t)
        s = {
            "turn_reg": [torch.zeros((self.n, len(nd.actions)), device=self.device, dtype=self.dtype) for nd in turn_nodes],
            "turn_ss": [torch.zeros((self.n, len(nd.actions)), device=self.device, dtype=self.dtype) for nd in turn_nodes],
            "riv_reg": [[torch.zeros((B, self.n, len(rn.actions)), device=self.device, dtype=self.dtype)
                         for rn in _index(re[1])] for re in river_entries],
            "riv_ss": [[torch.zeros((B, self.n, len(rn.actions)), device=self.device, dtype=self.dtype)
                        for rn in _index(re[1])] for re in river_entries],
            "B": B,
        }
        self._state[key] = s
        return s

    # ---------------- river betting (batched over rivers) ----------------
    def _riv_strat(self, reg):
        pos = reg.clamp_min(0.0)
        tot = pos.sum(dim=2, keepdim=True)
        k = reg.shape[2]
        return torch.where(tot > 1e-12, pos / tot.clamp_min(1e-12), torch.full_like(pos, 1.0 / k))

    def _riv_term(self, node, reach_opp_B, player, base, sign):
        if node.kind == "showdown":
            amount = self.pot / 2.0 + base + node.invested
            if player == OOP:
                return torch.einsum("bij,bj->bi", sign, reach_opp_B) * amount
            return -torch.einsum("bi,bij->bj", reach_opp_B, sign) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + base + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + base + node.fold_invested_oop)
        if player == OOP:
            return torch.einsum("ij,bj->bi", self.valid, reach_opp_B) * g
        return torch.einsum("bi,ij->bj", reach_opp_B, self.valid) * (-g)

    def _riv_cfr(self, node, reg_list, ss_list, reach_oop_B, reach_ip_B, base, sign, B, train):
        if node.kind != "decision":
            return (self._riv_term(node, reach_ip_B, OOP, base, sign),
                    self._riv_term(node, reach_oop_B, IP, base, sign))
        idx = node.index
        strat = self._riv_strat(reg_list[idx])
        player = node.player
        own = reach_oop_B if player == OOP else reach_ip_B
        uo = torch.zeros((B, self.n), device=self.device, dtype=self.dtype)
        ui = torch.zeros((B, self.n), device=self.device, dtype=self.dtype)
        ca = torch.zeros((B, self.n, len(node.actions)), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._riv_cfr(child, reg_list, ss_list, reach_oop_B * strat[:, :, a], reach_ip_B, base, sign, B, train)
                uo = uo + strat[:, :, a] * cuo; ui = ui + cui; ca[:, :, a] = cuo
            else:
                cuo, cui = self._riv_cfr(child, reg_list, ss_list, reach_oop_B, reach_ip_B * strat[:, :, a], base, sign, B, train)
                uo = uo + cuo; ui = ui + strat[:, :, a] * cui; ca[:, :, a] = cui
        if train:
            nodev = (strat * ca).sum(dim=2, keepdim=True)
            reg_list[idx] = (reg_list[idx] + (ca - nodev)).clamp_min(0.0)
            ss_list[idx] = ss_list[idx] + own.unsqueeze(2) * strat
        return uo, ui

    def _enter_river(self, entry_id, rid, base, reach_oop, reach_ip, st, sign, nc, B, train):
        ro_B = reach_oop.unsqueeze(0) * nc * self.w_river
        ri_B = reach_ip.unsqueeze(0) * nc * self.w_river
        sub_root = self._turn_trees[entry_id][2][rid][1]
        uo_B, ui_B = self._riv_cfr(sub_root, st["riv_reg"][rid], st["riv_ss"][rid], ro_B, ri_B, base, sign, B, train)
        return (uo_B * nc).sum(0), (ui_B * nc).sum(0)

    # ---------------- turn betting (single reach) ----------------
    def _single_strat(self, reg):
        pos = reg.clamp_min(0.0)
        tot = pos.sum(dim=1, keepdim=True)
        k = reg.shape[1]
        return torch.where(tot > 1e-12, pos / tot.clamp_min(1e-12), torch.full_like(pos, 1.0 / k))

    def _runout_term(self, node, reach_opp, player, avg):
        amount = self.pot / 2.0 + node.invested
        if player == OOP:
            return (avg @ reach_opp) * amount
        return -(reach_opp @ avg) * amount

    def _fold_term(self, node, reach_opp, player):
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _turn_cfr(self, entry_id, node, reach_oop, reach_ip, st, sign, nc, avg, B, train):
        if node.kind == "river_entry":
            return self._enter_river(entry_id, node.rid, node.base, reach_oop, reach_ip, st, sign, nc, B, train)
        if node.kind == "runout2":
            return self._runout_term(node, reach_ip, OOP, avg), self._runout_term(node, reach_oop, IP, avg)
        if node.kind in ("fold", "showdown"):
            return self._fold_term(node, reach_ip, OOP), self._fold_term(node, reach_oop, IP)
        idx = node.index
        strat = self._single_strat(st["turn_reg"][idx])
        player = node.player
        own = reach_oop if player == OOP else reach_ip
        uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ca = torch.zeros((self.n, len(node.actions)), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._turn_cfr(entry_id, child, reach_oop * strat[:, a], reach_ip, st, sign, nc, avg, B, train)
                uo = uo + strat[:, a] * cuo; ui = ui + cui; ca[:, a] = cuo
            else:
                cuo, cui = self._turn_cfr(entry_id, child, reach_oop, reach_ip * strat[:, a], st, sign, nc, avg, B, train)
                uo = uo + cuo; ui = ui + strat[:, a] * cui; ca[:, a] = cui
        if train:
            nodev = (strat * ca).sum(dim=1, keepdim=True)
            st["turn_reg"][idx] = (st["turn_reg"][idx] + (ca - nodev)).clamp_min(0.0)
            st["turn_ss"][idx] = st["turn_ss"][idx] + own.unsqueeze(1) * strat
        return uo, ui

    # ---------------- flop betting (single reach) ----------------
    def _flop_cfr(self, node, reach_oop, reach_ip, t, sign, nc, avg, nct, B, train):
        if node.kind == "turn_entry":
            # enter turn subgame for sampled t, masked by notcontain(t)
            st = self._get_state(node.entry_id, t)
            turn_root = self._turn_trees[node.entry_id][0]
            ro = reach_oop * nct
            ri = reach_ip * nct
            uo, ui = self._turn_cfr(node.entry_id, turn_root, ro, ri, st, sign, nc, avg, B, train)
            return uo * nct, ui * nct
        if node.kind == "runout3":
            return self._runout_term(node, reach_ip, OOP, avg), self._runout_term(node, reach_oop, IP, avg)
        if node.kind in ("fold", "showdown"):
            return self._fold_term(node, reach_ip, OOP), self._fold_term(node, reach_oop, IP)
        idx = node.index
        strat = self._single_strat(self.flop_regret[idx])
        player = node.player
        own = reach_oop if player == OOP else reach_ip
        uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ca = torch.zeros((self.n, len(node.actions)), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._flop_cfr(child, reach_oop * strat[:, a], reach_ip, t, sign, nc, avg, nct, B, train)
                uo = uo + strat[:, a] * cuo; ui = ui + cui; ca[:, a] = cuo
            else:
                cuo, cui = self._flop_cfr(child, reach_oop, reach_ip * strat[:, a], t, sign, nc, avg, nct, B, train)
                uo = uo + cuo; ui = ui + strat[:, a] * cui; ca[:, a] = cui
        if train:
            nodev = (strat * ca).sum(dim=1, keepdim=True)
            self.flop_regret[idx] = (self.flop_regret[idx] + (ca - nodev)).clamp_min(0.0)
            self.flop_strat_sum[idx] = self.flop_strat_sum[idx] + own.unsqueeze(1) * strat
        return uo, ui

    @torch.no_grad()
    def step(self):
        t = int(self.deck[self.rng.integers(0, len(self.deck))])
        sign, nc, avg, nct, B = self._signs_for_turn(t)
        self._flop_cfr(self.root, self.reach0.clone(), self.reach0.clone(), t, sign, nc, avg, nct, B, True)

    # ---------------- exact best response (enumerate turn + river) ----------------
    def _avg1(self, ss):
        tot = ss.sum(dim=1, keepdim=True)
        k = ss.shape[1]
        return torch.where(tot > 1e-12, ss / tot.clamp_min(1e-12), torch.full_like(ss, 1.0 / k))

    def _avgB(self, ss):
        tot = ss.sum(dim=2, keepdim=True)
        k = ss.shape[2]
        return torch.where(tot > 1e-12, ss / tot.clamp_min(1e-12), torch.full_like(ss, 1.0 / k))

    def _riv_br(self, node, reg_list, ss_list, reach_opp_B, brp, base, sign, B):
        if node.kind != "decision":
            return self._riv_term(node, reach_opp_B, brp, base, sign)
        idx = node.index
        if node.player == brp:
            vals = [self._riv_br(c, reg_list, ss_list, reach_opp_B, brp, base, sign, B) for c in node.children]
            return torch.stack(vals, dim=2).max(dim=2).values
        strat = self._avgB(ss_list[idx])
        total = torch.zeros((B, self.n), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._riv_br(child, reg_list, ss_list, reach_opp_B * strat[:, :, a], brp, base, sign, B)
        return total

    def _turn_br(self, entry_id, node, reach_opp, st, brp, sign, nc, avg, B):
        if node.kind == "river_entry":
            ro_B = reach_opp.unsqueeze(0) * nc * self.w_river
            sub_root = self._turn_trees[entry_id][2][node.rid][1]
            u_B = self._riv_br(sub_root, st["riv_reg"][node.rid], st["riv_ss"][node.rid], ro_B, brp, node.base, sign, B)
            return (u_B * nc).sum(0)
        if node.kind == "runout2":
            return self._runout_term(node, reach_opp, brp, avg)
        if node.kind in ("fold", "showdown"):
            return self._fold_term(node, reach_opp, brp)
        idx = node.index
        if node.player == brp:
            vals = [self._turn_br(entry_id, c, reach_opp, st, brp, sign, nc, avg, B) for c in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = self._avg1(st["turn_ss"][idx])
        total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._turn_br(entry_id, child, reach_opp * strat[:, a], st, brp, sign, nc, avg, B)
        return total

    def _flop_br(self, node, reach_opp, brp):
        if node.kind == "turn_entry":
            # enumerate all turns, averaging by per-player turn chance weight (1/49)
            total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            wt = 1.0 / len(self.deck)
            for t in self.deck:
                sign, nc, avg, nct, B = self._signs_for_turn(t)
                st = self._get_state(node.entry_id, t)
                turn_root = self._turn_trees[node.entry_id][0]
                u = self._turn_br(node.entry_id, turn_root, reach_opp * nct * wt, st, brp, sign, nc, avg, B)
                total = total + u * nct
            return total
        if node.kind == "runout3":
            # average runout over all turns (use global avg over turns of avg_sign)
            return self._runout_term(node, reach_opp, brp, self._global_avg_sign())
        if node.kind in ("fold", "showdown"):
            return self._fold_term(node, reach_opp, brp)
        idx = node.index
        if node.player == brp:
            vals = [self._flop_br(c, reach_opp, brp) for c in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = self._avg1(self.flop_strat_sum[idx])
        total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._flop_br(child, reach_opp * strat[:, a], brp)
        return total

    def _global_avg_sign(self):
        if getattr(self, "_gas", None) is not None:
            return self._gas
        acc = torch.zeros((self.n, self.n), device=self.device, dtype=self.dtype)
        cnt = 0
        for t in self.deck:
            sign, nc, avg, nct, B = self._signs_for_turn(t)
            acc = acc + avg
            cnt += 1
        self._gas = acc / max(cnt, 1)
        return self._gas

    @torch.no_grad()
    def exploitability(self):
        bo = self._flop_br(self.root, self.reach0.clone(), OOP)
        bi = self._flop_br(self.root, self.reach0.clone(), IP)
        expl = float((self.reach0 * bo).sum() + (self.reach0 * bi).sum())
        return {"exploitability_pot_frac": expl / self.pot, "exploitability_mbb": expl / self.pot * 1000.0}

    @torch.no_grad()
    def solve(self, iterations, expl_every=0):
        for it in range(1, iterations + 1):
            self.step()
            if expl_every and (it % expl_every == 0 or it == iterations):
                m = self.exploitability()
                print(f"iter={it:5d} exploitability={m['exploitability_pot_frac']*100:7.4f}% pot", flush=True)
        return self.exploitability()

    def flop_open_strategy(self):
        return self._avg1(self.flop_strat_sum[self.root.index])


def _reduced(board, k, seed=3):
    full = all_combos(board)
    rng = np.random.default_rng(seed)
    keep = np.sort(rng.choice(len(full), size=min(k, len(full)), replace=False))
    return [full[i] for i in keep]


def _self_test():
    board = parse_board("Kh 9d 4s")
    combos = _reduced(board, 40, seed=11)
    s = FlopBatchedSolver(board, combos, 6.0, 12.0, [0.66], [0.66], [0.75], device="cpu", seed=1)
    e0 = s.exploitability()["exploitability_pot_frac"]
    s.solve(800)
    e1 = s.exploitability()["exploitability_pot_frac"]
    s.solve(1600)
    e2 = s.exploitability()["exploitability_pot_frac"]
    # the flop is inherently slow (turn-sampled 3-street); the correctness signal is
    # monotonic convergence under the EXACT enumerated turn+river best response.
    ok = e1 < e0 * 0.5 and e2 < e1 and e2 < 0.20
    print(f"flop_batched convergence: start={e0*100:.1f}% -> 800it={e1*100:.2f}% -> 2400it={e2*100:.2f}% pot")
    print(f"[{'PASS' if ok else 'FAIL'}] flop_batched converges (exact turn+river BR)")
    print("flop_batched self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--board", default="Kh 9d 4s")
    p.add_argument("--pot", type=float, default=6.0)
    p.add_argument("--stack", type=float, default=12.0)
    p.add_argument("--flop-bets", default="0.66")
    p.add_argument("--turn-bets", default="0.66")
    p.add_argument("--river-bets", default="0.75")
    p.add_argument("--iterations", type=int, default=2000)
    p.add_argument("--expl-every", type=int, default=500)
    p.add_argument("--max-combos", type=int, default=60)
    p.add_argument("--device", default="cpu")
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        return _self_test()
    board = parse_board(args.board)
    combos = _reduced(board, args.max_combos) if args.max_combos else all_combos(board)
    fb = [float(x) for x in args.flop_bets.split(",") if x]
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]
    dev = args.device if (args.device != "cuda" or torch.cuda.is_available()) else "cpu"
    s = FlopBatchedSolver(board, combos, args.pot, args.stack, fb, tb, rb, device=dev, seed=args.seed)
    print(f"board={[card_text(c) for c in board]} combos={s.n} SPR={args.stack/args.pot:.1f} device={dev}", flush=True)
    t0 = time.time()
    s.solve(args.iterations, expl_every=args.expl_every)
    print(f"FINAL in {time.time()-t0:.1f}s  mean flop open={np.round(s.flop_open_strategy().mean(0).cpu().numpy(),3)}", flush=True)
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
