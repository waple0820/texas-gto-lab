#!/usr/bin/env python3
"""GPU two-street turn solver with the river enumeration BATCHED (torch).

Integration step toward the batched flop solver: it proves the pattern of a
single-reach betting layer (turn) wrapping the batched-over-rivers river core
(batched_river). The turn betting recursion carries a single reach (n,); at each
river-entry point the 46 rivers are solved as ONE batched pass over (B,n[,A])
tensors (shared river betting structure, per-river sign matrices), instead of the
numpy turn solver's 46-way Python loop.

Same game as turn_cfr (exact, river-enumerated), so it is parity-checkable:
batched torch (CPU float64) must match turn_cfr exploitability. Then GPU gives the
speedup that lets deep games converge — the foundation the flop solver reuses.

Run:
  python3 scripts/solver/turn_batched.py --self-test
  python3 scripts/solver/turn_batched.py --device cuda --board "Kh 9d 4s 2c" --iterations 600
"""

from __future__ import annotations

import argparse
import time

import numpy as np
import torch

from river_cfr import Node, OOP, IP, all_combos, conflict_mask, parse_board, card_text, _combo_key
from multiraise_tree import build_multiraise_betting

np.seterr(over="ignore", invalid="ignore", divide="ignore")


def _tag_street(node, street):
    if node.kind == "decision" and getattr(node, "street", None) is None:
        node.street = street
    for c in node.children:
        _tag_street(c, street)


def _index(nodes_root):
    out = []

    def walk(n):
        if n.kind == "decision":
            n.index = len(out)
            out.append(n)
        for c in n.children:
            walk(c)

    walk(nodes_root)
    return out


class TurnBatchedSolver:
    """Turn betting (single reach) wrapping the batched river core (B rivers)."""

    def __init__(self, turn_board, combos, pot, stack, turn_bets, river_bets,
                 raise_mults=(2.0, 4.0), device="cpu", dtype=torch.float64):
        self.device = torch.device(device)
        self.dtype = dtype
        self.board = turn_board
        self.combos = combos
        self.n = len(combos)
        self.pot = float(pot)
        self.stack = float(stack)
        self.river_bets = river_bets
        self.raise_mults = raise_mults
        self.combo_arr = np.array(combos)
        self.deck = [c for c in range(52) if c not in set(turn_board)]
        self.B = len(self.deck)
        self.w = 1.0 / 46.0
        valid_np = conflict_mask(combos, combos)
        self.valid = torch.as_tensor(valid_np, device=self.device, dtype=dtype)
        # per-river sign (B,n,n) and notcontain (B,n)
        signs = np.zeros((self.B, self.n, self.n), dtype=np.float64)
        nc = np.zeros((self.B, self.n), dtype=np.float64)
        for bi, r in enumerate(self.deck):
            b5 = tuple(turn_board) + (r,)
            st = np.array([_combo_key(tuple(c), b5) for c in combos], dtype=np.int64)
            ncr = (~((self.combo_arr[:, 0] == r) | (self.combo_arr[:, 1] == r))).astype(np.float64)
            pair = valid_np * np.outer(ncr, ncr)
            signs[bi] = np.sign(st[:, None] - st[None, :]) * pair
            nc[bi] = ncr
        self.sign = torch.as_tensor(signs, device=self.device, dtype=dtype)          # (B,n,n)
        self.nc = torch.as_tensor(nc, device=self.device, dtype=dtype)               # (B,n)
        self.avg_sign = (self.sign.sum(0) / 44.0)                                     # (n,n) runout

        # ---- build turn betting tree; river continue -> a river betting subtree ----
        self._river_entries = []  # list of (entry_id, river_betting_root, base_inv)

        def make_turn_continue(turn_inv):
            sub = build_multiraise_betting(pot + 2.0 * turn_inv, stack - turn_inv,
                                           river_bets, raise_mults,
                                           lambda inv: Node(kind="showdown", invested=float(inv)),
                                           lambda inv: Node(kind="showdown", invested=float(inv)))
            _tag_street(sub, "river")
            eid = len(self._river_entries)
            self._river_entries.append((eid, sub, float(turn_inv)))
            marker = Node(kind="river_entry")
            marker.entry_id = eid
            marker.base = float(turn_inv)
            return marker

        def make_turn_allin(turn_inv):
            nd = Node(kind="runout", invested=float(turn_inv))
            return nd

        self.root = build_multiraise_betting(pot, stack, turn_bets, raise_mults,
                                             make_turn_continue, make_turn_allin)
        _tag_street(self.root, "turn")
        self.turn_nodes = _index(self.root)
        self.turn_regret = [torch.zeros((self.n, len(nd.actions)), device=self.device, dtype=dtype)
                            for nd in self.turn_nodes]
        self.turn_strat_sum = [torch.zeros_like(r) for r in self.turn_regret]

        # river betting nodes per entry (batched over B rivers): (B,n,A)
        self.river_nodes = []
        self.river_regret = []
        self.river_strat_sum = []
        for eid, sub, base in self._river_entries:
            nodes = _index(sub)
            self.river_nodes.append(nodes)
            self.river_regret.append([torch.zeros((self.B, self.n, len(nd.actions)), device=self.device, dtype=dtype)
                                      for nd in nodes])
            self.river_strat_sum.append([torch.zeros_like(r) for r in self.river_regret[-1]])

        self.reach0 = torch.ones(self.n, device=self.device, dtype=dtype) / self.n

    # ---------- river betting (batched over B rivers) ----------
    def _river_strategy(self, eid, idx):
        reg = self.river_regret[eid][idx].clamp_min(0.0)
        tot = reg.sum(dim=2, keepdim=True)
        k = reg.shape[2]
        return torch.where(tot > 1e-12, reg / tot.clamp_min(1e-12), torch.full_like(reg, 1.0 / k))

    def _river_terminal(self, node, reach_opp_B, player, base):
        # reach_opp_B: (B,n); returns (B,n) util for `player`
        if node.kind == "showdown":
            amount = self.pot / 2.0 + base + node.invested
            if player == OOP:
                return torch.einsum("bij,bj->bi", self.sign, reach_opp_B) * amount
            return -torch.einsum("bi,bij->bj", reach_opp_B, self.sign) * amount
        # fold
        if node.folder == IP:
            g = self.pot / 2.0 + base + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + base + node.fold_invested_oop)
        if player == OOP:
            return torch.einsum("ij,bj->bi", self.valid, reach_opp_B) * g
        return torch.einsum("bi,ij->bj", reach_opp_B, self.valid) * (-g)

    def _river_cfr(self, eid, node, reach_oop_B, reach_ip_B, base, train):
        if node.kind != "decision":
            return (self._river_terminal(node, reach_ip_B, OOP, base),
                    self._river_terminal(node, reach_oop_B, IP, base))
        idx = node.index
        strat = self._river_strategy(eid, idx)               # (B,n,A)
        player = node.player
        own = reach_oop_B if player == OOP else reach_ip_B
        uo = torch.zeros((self.B, self.n), device=self.device, dtype=self.dtype)
        ui = torch.zeros((self.B, self.n), device=self.device, dtype=self.dtype)
        ca = torch.zeros((self.B, self.n, len(node.actions)), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._river_cfr(eid, child, reach_oop_B * strat[:, :, a], reach_ip_B, base, train)
                uo = uo + strat[:, :, a] * cuo
                ui = ui + cui
                ca[:, :, a] = cuo
            else:
                cuo, cui = self._river_cfr(eid, child, reach_oop_B, reach_ip_B * strat[:, :, a], base, train)
                uo = uo + cuo
                ui = ui + strat[:, :, a] * cui
                ca[:, :, a] = cui
        if train:
            node_val = (strat * ca).sum(dim=2, keepdim=True)
            self.river_regret[eid][idx] = (self.river_regret[eid][idx] + (ca - node_val)).clamp_min(0.0)
            self.river_strat_sum[eid][idx] = self.river_strat_sum[eid][idx] + own.unsqueeze(2) * strat
        return uo, ui

    def _enter_river(self, eid, base, reach_oop, reach_ip, train):
        # broadcast single reach to B rivers, masked by notcontain and chance weight
        ro_B = reach_oop.unsqueeze(0) * self.nc * self.w     # (B,n)
        ri_B = reach_ip.unsqueeze(0) * self.nc * self.w
        sub_root = self._river_entries[eid][1]
        uo_B, ui_B = self._river_cfr(eid, sub_root, ro_B, ri_B, base, train)
        # aggregate back to single reach space (sum over rivers, masked)
        uo = (uo_B * self.nc).sum(0)
        ui = (ui_B * self.nc).sum(0)
        return uo, ui

    # ---------- turn betting (single reach) ----------
    def _turn_strategy(self, idx):
        reg = self.turn_regret[idx].clamp_min(0.0)
        tot = reg.sum(dim=1, keepdim=True)
        k = reg.shape[1]
        return torch.where(tot > 1e-12, reg / tot.clamp_min(1e-12), torch.full_like(reg, 1.0 / k))

    def _runout_terminal(self, node, reach_opp, player):
        amount = self.pot / 2.0 + node.invested
        if player == OOP:
            return (self.avg_sign @ reach_opp) * amount
        return -(reach_opp @ self.avg_sign) * amount

    def _turn_terminal(self, node, reach_opp, player):
        if node.kind == "runout":
            return self._runout_terminal(node, reach_opp, player)
        # turn fold
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _turn_cfr(self, node, reach_oop, reach_ip, train):
        if node.kind == "river_entry":
            return self._enter_river(node.entry_id, node.base, reach_oop, reach_ip, train)
        if node.kind in ("runout", "fold", "showdown"):
            return self._turn_terminal(node, reach_ip, OOP), self._turn_terminal(node, reach_oop, IP)
        idx = node.index
        strat = self._turn_strategy(idx)
        player = node.player
        own = reach_oop if player == OOP else reach_ip
        uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ca = torch.zeros((self.n, len(node.actions)), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._turn_cfr(child, reach_oop * strat[:, a], reach_ip, train)
                uo = uo + strat[:, a] * cuo
                ui = ui + cui
                ca[:, a] = cuo
            else:
                cuo, cui = self._turn_cfr(child, reach_oop, reach_ip * strat[:, a], train)
                uo = uo + cuo
                ui = ui + strat[:, a] * cui
                ca[:, a] = cui
        if train:
            node_val = (strat * ca).sum(dim=1, keepdim=True)
            self.turn_regret[idx] = (self.turn_regret[idx] + (ca - node_val)).clamp_min(0.0)
            self.turn_strat_sum[idx] = self.turn_strat_sum[idx] + own.unsqueeze(1) * strat
        return uo, ui

    @torch.no_grad()
    def step(self):
        self._turn_cfr(self.root, self.reach0.clone(), self.reach0.clone(), True)

    # ---------- exact best response ----------
    def _turn_avg(self, idx):
        s = self.turn_strat_sum[idx]
        tot = s.sum(dim=1, keepdim=True)
        k = s.shape[1]
        return torch.where(tot > 1e-12, s / tot.clamp_min(1e-12), torch.full_like(s, 1.0 / k))

    def _river_avg(self, eid, idx):
        s = self.river_strat_sum[eid][idx]
        tot = s.sum(dim=2, keepdim=True)
        k = s.shape[2]
        return torch.where(tot > 1e-12, s / tot.clamp_min(1e-12), torch.full_like(s, 1.0 / k))

    def _river_br(self, eid, node, reach_opp_B, br_player, base):
        if node.kind != "decision":
            return self._river_terminal(node, reach_opp_B, br_player, base)
        idx = node.index
        if node.player == br_player:
            vals = [self._river_br(eid, c, reach_opp_B, br_player, base) for c in node.children]
            return torch.stack(vals, dim=2).max(dim=2).values
        strat = self._river_avg(eid, idx)
        total = torch.zeros((self.B, self.n), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._river_br(eid, child, reach_opp_B * strat[:, :, a], br_player, base)
        return total

    def _turn_br(self, node, reach_opp, br_player):
        if node.kind == "river_entry":
            eid, base = node.entry_id, node.base
            ro_B = reach_opp.unsqueeze(0) * self.nc * self.w
            sub_root = self._river_entries[eid][1]
            u_B = self._river_br(eid, sub_root, ro_B, br_player, base)
            return (u_B * self.nc).sum(0)
        if node.kind in ("runout", "fold", "showdown"):
            return self._turn_terminal(node, reach_opp, br_player)
        idx = node.index
        if node.player == br_player:
            vals = [self._turn_br(c, reach_opp, br_player) for c in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = self._turn_avg(idx)
        total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._turn_br(child, reach_opp * strat[:, a], br_player)
        return total

    @torch.no_grad()
    def exploitability(self):
        bo = self._turn_br(self.root, self.reach0.clone(), OOP)
        bi = self._turn_br(self.root, self.reach0.clone(), IP)
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


def _reduced_combos(board, k, seed=3):
    full = all_combos(board)
    rng = np.random.default_rng(seed)
    keep = np.sort(rng.choice(len(full), size=min(k, len(full)), replace=False))
    return [full[i] for i in keep]


def _self_test():
    import turn_cfr
    board = parse_board("Kh 9d 4s 2c")
    combos = _reduced_combos(board, 60, seed=11)
    pot, stack, tb, rb = 10.0, 40.0, [0.66], [0.75]
    # batched torch
    bs = TurnBatchedSolver(board, combos, pot, stack, tb, rb, device="cpu")
    bs.solve(600)
    e_batched = bs.exploitability()["exploitability_pot_frac"]
    # numpy reference (turn_cfr exact)
    reach = np.ones(len(combos))
    ref = turn_cfr.TurnSolver(board, combos, reach.copy(), reach.copy(), pot, stack, tb, rb)
    ref.solve(600, log_every=0)
    e_ref = ref.exploitability(ref.average_strategy())["exploitability_pot_frac"]
    d = abs(e_batched - e_ref)
    ok = d < 6e-3 and e_batched < 0.1
    print(f"batched={e_batched*100:.4f}%  turn_cfr={e_ref*100:.4f}%  d={d*100:.4f}pp")
    print(f"[{'PASS' if ok else 'FAIL'}] turn_batched parity")
    print("turn_batched self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--board", default="Kh 9d 4s 2c")
    p.add_argument("--pot", type=float, default=10.0)
    p.add_argument("--stack", type=float, default=40.0)
    p.add_argument("--turn-bets", default="0.66")
    p.add_argument("--river-bets", default="0.75")
    p.add_argument("--iterations", type=int, default=600)
    p.add_argument("--expl-every", type=int, default=200)
    p.add_argument("--max-combos", type=int, default=0)
    p.add_argument("--device", default="cpu")
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        return _self_test()
    board = parse_board(args.board)
    combos = _reduced_combos(board, args.max_combos) if args.max_combos else all_combos(board)
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]
    dev = args.device if (args.device != "cuda" or torch.cuda.is_available()) else "cpu"
    bs = TurnBatchedSolver(board, combos, args.pot, args.stack, tb, rb, device=dev)
    print(f"board={[card_text(c) for c in board]} combos={bs.n} B={bs.B} device={dev}", flush=True)
    t0 = time.time()
    bs.solve(args.iterations, expl_every=args.expl_every)
    print(f"FINAL in {time.time()-t0:.1f}s", flush=True)
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
