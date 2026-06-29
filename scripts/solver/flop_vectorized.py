#!/usr/bin/env python3
"""Fully-vectorized, ENUMERATED GPU flop solver — the tree-vectorization rewrite.

The turn-sampled solvers need 10^5+ iters at deep SPR (sampling variance, ~1/sqrt(T))
and are per-iteration Python/CPU bound. This rewrites the flop solve as a
DETERMINISTIC, fully-enumerated, hierarchically-batched CFR+:

  - turns AND rivers are ENUMERATED (no sampling) -> deterministic CFR+ converges
    in HUNDREDS of iters, not 10^5;
  - reach/strategy/utility carry hierarchical batch dims — flop (n,), turn (T,n),
    river (T,R,n) — so every public-tree node's work is ONE batched tensor op over
    all T*R runouts at once (the public betting tree recursion is shared, walked
    once per iteration, never per-board);
  - all per-(turn,river) sign matrices are precomputed ONCE as a (T,R,n,n) tensor
    on the device — the CPU sign-precompute is off the per-iteration path.

Result: each iteration is pure GPU tensor algebra over the whole enumerated game.
Deep-SPR flops converge to single digits in a few hundred iters / seconds.

Validation (local): converges toward 0 under the SAME enumerated tree's exact best
response; parity-comparable to the numpy flop solver's trend.

Run:
  python3 scripts/solver/flop_vectorized.py --self-test
  python3 scripts/solver/flop_vectorized.py --device cuda --board "Kh 9d 4s" --stack 80 \
      --max-combos 160 --iterations 400
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


class FlopVectorizedSolver:
    def __init__(self, flop_board, combos, pot, stack, flop_bets, turn_bets, river_bets,
                 raise_mults=(), device="cpu", dtype=torch.float32):
        self.device = torch.device(device)
        self.dtype = dtype
        self.flop = flop_board
        self.combos = combos
        self.n = len(combos)
        self.pot = float(pot)
        self.stack = float(stack)
        ca = np.array(combos)
        valid_np = conflict_mask(combos, combos)
        self.valid = torch.as_tensor(valid_np, device=self.device, dtype=dtype)

        deck = [c for c in range(52) if c not in set(flop_board)]
        self.turns = deck
        self.T = len(deck)
        self.R = len(deck) - 1
        # ---- precompute ALL (turn,river) signs once: (T,R,n,n), masks, runout avgs ----
        T, R, n = self.T, self.R, self.n
        sign = np.zeros((T, R, n, n), dtype=np.float32)
        nc_river = np.zeros((T, R, n), dtype=np.float32)
        nc_turn = np.zeros((T, n), dtype=np.float32)
        turn_runout = np.zeros((T, n, n), dtype=np.float32)   # avg over rivers (turn all-in)
        for ti, t in enumerate(deck):
            nct = (~((ca[:, 0] == t) | (ca[:, 1] == t))).astype(np.float32)
            nc_turn[ti] = nct
            rivers = [r for r in deck if r != t]
            acc = np.zeros((n, n), dtype=np.float32)
            for ri, r in enumerate(rivers):
                b5 = tuple(flop_board) + (t, r)
                st = np.array([_combo_key(tuple(cc), b5) for cc in combos], dtype=np.int64)
                ncr = (~((ca[:, 0] == r) | (ca[:, 1] == r))).astype(np.float32) * nct
                s = np.sign(st[:, None] - st[None, :]).astype(np.float32) * (valid_np * np.outer(ncr, ncr))
                sign[ti, ri] = s
                nc_river[ti, ri] = ncr
                acc += s
            turn_runout[ti] = acc / 44.0
        self.sign = torch.as_tensor(sign, device=self.device, dtype=dtype)            # (T,R,n,n)
        self.nc_river = torch.as_tensor(nc_river, device=self.device, dtype=dtype)    # (T,R,n)
        self.nc_turn = torch.as_tensor(nc_turn, device=self.device, dtype=dtype)      # (T,n)
        self.turn_runout = torch.as_tensor(turn_runout, device=self.device, dtype=dtype)  # (T,n,n)
        self.flop_runout = self.turn_runout.mean(0)                                   # (n,n)
        self.w_turn = 1.0 / self.T
        self.w_river = 1.0 / self.R

        # ---- betting trees (shared structure) ----
        self._turn_entries = []   # flop_inv list

        def flop_continue(flop_inv):
            m = Node(kind="turn_entry"); m.flop_inv = float(flop_inv)
            self._turn_entries.append(float(flop_inv)); m.entry_id = len(self._turn_entries) - 1
            return m

        self.root = build_multiraise_betting(pot, stack, flop_bets, raise_mults, flop_continue,
                                             lambda inv: Node(kind="runout3", invested=float(inv)))
        _tag(self.root, "flop")
        self.flop_nodes = _index(self.root)
        self.flop_reg = [torch.zeros((n, len(nd.actions)), device=self.device, dtype=dtype) for nd in self.flop_nodes]
        self.flop_ss = [torch.zeros_like(r) for r in self.flop_reg]

        # one turn tree per flop entry; river tree per turn-continue
        self._turn_trees = []
        for flop_inv in self._turn_entries:
            tpot, tstack = pot + 2.0 * flop_inv, stack - flop_inv
            river_entries = []

            def turn_continue(turn_inv, _tp=tpot, _ts=tstack, _re=river_entries, _fi=flop_inv):
                sub = build_multiraise_betting(_tp + 2.0 * turn_inv, _ts - turn_inv, river_bets,
                                               raise_mults, _showdown, _showdown)
                _tag(sub, "river")
                m = Node(kind="river_entry"); m.base = float(_fi + turn_inv); m.rid = len(_re)
                _re.append((sub, _index(sub))); return m

            turn_root = build_multiraise_betting(tpot, tstack, turn_bets, raise_mults, turn_continue,
                                                 lambda inv, _fi=flop_inv: Node(kind="runout2", invested=float(_fi + inv)))
            _tag(turn_root, "turn")
            turn_nodes = _index(turn_root)
            # regrets: turn nodes (T,n,A); river nodes (T,R,n,A) per river-entry
            treg = [torch.zeros((T, n, len(nd.actions)), device=self.device, dtype=dtype) for nd in turn_nodes]
            tss = [torch.zeros_like(r) for r in treg]
            rreg, rss = [], []
            for sub, rnodes in river_entries:
                rreg.append([torch.zeros((T, R, n, len(rn.actions)), device=self.device, dtype=dtype) for rn in rnodes])
                rss.append([torch.zeros_like(r) for r in rreg[-1]])
            self._turn_trees.append({"root": turn_root, "nodes": turn_nodes, "river_entries": river_entries,
                                     "treg": treg, "tss": tss, "rreg": rreg, "rss": rss})

        self.reach0 = torch.ones(n, device=self.device, dtype=dtype) / n

    # ---------- river betting: batched over (T,R) ----------
    def _strat(self, reg, dim):
        pos = reg.clamp_min(0.0)
        tot = pos.sum(dim=dim, keepdim=True)
        k = reg.shape[dim]
        return torch.where(tot > 1e-12, pos / tot.clamp_min(1e-12), torch.full_like(pos, 1.0 / k))

    def _river_term(self, node, reach_opp, player, base):   # reach_opp (T,R,n) -> (T,R,n)
        if node.kind == "showdown":
            amount = self.pot / 2.0 + base + node.invested
            if player == OOP:
                return torch.einsum("trij,trj->tri", self.sign, reach_opp) * amount
            return -torch.einsum("tri,trij->trj", reach_opp, self.sign) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + base + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + base + node.fold_invested_oop)
        if player == OOP:
            return torch.einsum("ij,trj->tri", self.valid, reach_opp) * g
        return torch.einsum("tri,ij->trj", reach_opp, self.valid) * (-g)

    def _river_cfr(self, node, reg, ss, ro, ri, base, train):
        if node.kind != "decision":
            return self._river_term(node, ri, OOP, base), self._river_term(node, ro, IP, base)
        idx = node.index
        strat = self._strat(reg[idx], 3)                  # (T,R,n,A)
        player = node.player
        own = ro if player == OOP else ri
        uo = torch.zeros_like(ro); ui = torch.zeros_like(ri)
        ca = torch.zeros_like(reg[idx])
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._river_cfr(child, reg, ss, ro * strat[..., a], ri, base, train)
                uo = uo + strat[..., a] * cuo; ui = ui + cui; ca[..., a] = cuo
            else:
                cuo, cui = self._river_cfr(child, reg, ss, ro, ri * strat[..., a], base, train)
                uo = uo + cuo; ui = ui + strat[..., a] * cui; ca[..., a] = cui
        if train:
            nodev = (strat * ca).sum(dim=3, keepdim=True)
            reg[idx] = (reg[idx] + (ca - nodev)).clamp_min(0.0)
            ss[idx] = ss[idx] + own.unsqueeze(3) * strat
        return uo, ui

    # ---------- turn betting: batched over T ----------
    def _turn_term(self, node, reach_opp, player):  # reach_opp (T,n)
        if node.kind == "runout2":
            amount = self.pot / 2.0 + node.invested
            if player == OOP:
                return torch.einsum("tij,tj->ti", self.turn_runout, reach_opp) * amount
            return -torch.einsum("ti,tij->tj", reach_opp, self.turn_runout) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return torch.einsum("ij,tj->ti", self.valid, reach_opp) * g
        return torch.einsum("ti,ij->tj", reach_opp, self.valid) * (-g)

    def _turn_cfr(self, tt, node, ro, ri, train):  # ro,ri (T,n)
        if node.kind == "river_entry":
            rid, base = node.rid, node.base
            sub, _ = tt["river_entries"][rid]
            ro_TR = ro.unsqueeze(1) * self.nc_river * self.w_river   # (T,R,n)
            ri_TR = ri.unsqueeze(1) * self.nc_river * self.w_river
            uo, ui = self._river_cfr(sub, tt["rreg"][rid], tt["rss"][rid], ro_TR, ri_TR, base, train)
            return (uo * self.nc_river).sum(1), (ui * self.nc_river).sum(1)   # back to (T,n)
        if node.kind in ("runout2", "fold", "showdown"):
            return self._turn_term(node, ri, OOP), self._turn_term(node, ro, IP)
        idx = node.index
        strat = self._strat(tt["treg"][idx], 2)            # (T,n,A)
        player = node.player
        own = ro if player == OOP else ri
        uo = torch.zeros_like(ro); ui = torch.zeros_like(ri)
        ca = torch.zeros_like(tt["treg"][idx])
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._turn_cfr(tt, child, ro * strat[..., a], ri, train)
                uo = uo + strat[..., a] * cuo; ui = ui + cui; ca[..., a] = cuo
            else:
                cuo, cui = self._turn_cfr(tt, child, ro, ri * strat[..., a], train)
                uo = uo + cuo; ui = ui + strat[..., a] * cui; ca[..., a] = cui
        if train:
            nodev = (strat * ca).sum(dim=2, keepdim=True)
            tt["treg"][idx] = (tt["treg"][idx] + (ca - nodev)).clamp_min(0.0)
            tt["tss"][idx] = tt["tss"][idx] + own.unsqueeze(2) * strat
        return uo, ui

    # ---------- flop betting: single reach (n,) ----------
    def _flop_term(self, node, reach_opp, player):
        if node.kind == "runout3":
            amount = self.pot / 2.0 + node.invested
            if player == OOP:
                return (self.flop_runout @ reach_opp) * amount
            return -(reach_opp @ self.flop_runout) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _flop_cfr(self, node, ro, ri, train):
        if node.kind == "turn_entry":
            tt = self._turn_trees[node.entry_id]
            ro_T = ro.unsqueeze(0) * self.nc_turn * self.w_turn     # (T,n)
            ri_T = ri.unsqueeze(0) * self.nc_turn * self.w_turn
            uo_T, ui_T = self._turn_cfr(tt, tt["root"], ro_T, ri_T, train)
            return (uo_T * self.nc_turn).sum(0), (ui_T * self.nc_turn).sum(0)   # (n,)
        if node.kind in ("runout3", "fold", "showdown"):
            return self._flop_term(node, ri, OOP), self._flop_term(node, ro, IP)
        idx = node.index
        strat = self._strat(self.flop_reg[idx], 1)        # (n,A)
        player = node.player
        own = ro if player == OOP else ri
        uo = torch.zeros_like(ro); ui = torch.zeros_like(ri)
        ca = torch.zeros_like(self.flop_reg[idx])
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._flop_cfr(child, ro * strat[:, a], ri, train)
                uo = uo + strat[:, a] * cuo; ui = ui + cui; ca[:, a] = cuo
            else:
                cuo, cui = self._flop_cfr(child, ro, ri * strat[:, a], train)
                uo = uo + cuo; ui = ui + strat[:, a] * cui; ca[:, a] = cui
        if train:
            nodev = (strat * ca).sum(dim=1, keepdim=True)
            self.flop_reg[idx] = (self.flop_reg[idx] + (ca - nodev)).clamp_min(0.0)
            self.flop_ss[idx] = self.flop_ss[idx] + own.unsqueeze(1) * strat
        return uo, ui

    @torch.no_grad()
    def step(self):
        self._flop_cfr(self.root, self.reach0.clone(), self.reach0.clone(), True)

    # ---------- exact best response on the SAME enumerated tree ----------
    def _avg(self, ss, dim):
        tot = ss.sum(dim=dim, keepdim=True)
        k = ss.shape[dim]
        return torch.where(tot > 1e-12, ss / tot.clamp_min(1e-12), torch.full_like(ss, 1.0 / k))

    def _river_br(self, node, ss, reach_opp, brp, base):
        if node.kind != "decision":
            return self._river_term(node, reach_opp, brp, base)
        idx = node.index
        if node.player == brp:
            vals = [self._river_br(c, ss, reach_opp, brp, base) for c in node.children]
            return torch.stack(vals, dim=3).max(dim=3).values
        strat = self._avg(ss[idx], 3)
        total = torch.zeros_like(reach_opp)
        for a, child in enumerate(node.children):
            total = total + self._river_br(child, ss, reach_opp * strat[..., a], brp, base)
        return total

    def _turn_br(self, tt, node, reach_opp, brp):
        if node.kind == "river_entry":
            sub, _ = tt["river_entries"][node.rid]
            r_TR = reach_opp.unsqueeze(1) * self.nc_river * self.w_river
            u = self._river_br(sub, tt["rss"][node.rid], r_TR, brp, node.base)
            return (u * self.nc_river).sum(1)
        if node.kind in ("runout2", "fold", "showdown"):
            return self._turn_term(node, reach_opp, brp)
        idx = node.index
        if node.player == brp:
            vals = [self._turn_br(tt, c, reach_opp, brp) for c in node.children]
            return torch.stack(vals, dim=2).max(dim=2).values
        strat = self._avg(tt["tss"][idx], 2)
        total = torch.zeros_like(reach_opp)
        for a, child in enumerate(node.children):
            total = total + self._turn_br(tt, child, reach_opp * strat[..., a], brp)
        return total

    def _flop_br(self, node, reach_opp, brp):
        if node.kind == "turn_entry":
            tt = self._turn_trees[node.entry_id]
            r_T = reach_opp.unsqueeze(0) * self.nc_turn * self.w_turn
            u = self._turn_br(tt, tt["root"], r_T, brp)
            return (u * self.nc_turn).sum(0)
        if node.kind in ("runout3", "fold", "showdown"):
            return self._flop_term(node, reach_opp, brp)
        idx = node.index
        if node.player == brp:
            vals = [self._flop_br(c, reach_opp, brp) for c in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = self._avg(self.flop_ss[idx], 1)
        total = torch.zeros_like(reach_opp)
        for a, child in enumerate(node.children):
            total = total + self._flop_br(child, reach_opp * strat[:, a], brp)
        return total

    @torch.no_grad()
    def exploitability(self):
        bo = self._flop_br(self.root, self.reach0.clone(), OOP)
        bi = self._flop_br(self.root, self.reach0.clone(), IP)
        expl = float((self.reach0 * bo).sum() + (self.reach0 * bi).sum())
        return {"exploitability_pot_frac": expl / self.pot}

    @torch.no_grad()
    def solve(self, iterations, expl_every=0):
        for it in range(1, iterations + 1):
            self.step()
            if expl_every and (it % expl_every == 0 or it == iterations):
                e = self.exploitability()["exploitability_pot_frac"]
                print(f"iter={it:5d} exploitability={e*100:7.4f}% pot", flush=True)
        return self.exploitability()

    def flop_open_strategy(self):
        return self._avg(self.flop_ss[self.root.index], 1)


def _reduced(board, k, seed=3):
    full = all_combos(board)
    rng = np.random.default_rng(seed)
    keep = np.sort(rng.choice(len(full), size=min(k, len(full)), replace=False))
    return [full[i] for i in keep]


def _self_test():
    board = parse_board("Kh 9d 4s")
    combos = _reduced(board, 40, seed=11)
    s = FlopVectorizedSolver(board, combos, 6.0, 12.0, [0.66], [0.66], [0.75], device="cpu")
    e0 = s.exploitability()["exploitability_pot_frac"]
    s.solve(150)
    e1 = s.exploitability()["exploitability_pot_frac"]
    s.solve(150)
    e2 = s.exploitability()["exploitability_pot_frac"]
    ok = e1 < e0 * 0.5 and e2 < e1 and e2 < 0.12
    print(f"flop_vectorized (enumerated, deterministic): start={e0*100:.1f}% -> 150it={e1*100:.2f}% -> 300it={e2*100:.2f}% pot")
    print(f"[{'PASS' if ok else 'FAIL'}] converges fast (deterministic CFR+, exact BR)")
    print("flop_vectorized self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--board", default="Kh 9d 4s")
    p.add_argument("--pot", type=float, default=6.0)
    p.add_argument("--stack", type=float, default=80.0)
    p.add_argument("--flop-bets", default="0.66")
    p.add_argument("--turn-bets", default="0.66")
    p.add_argument("--river-bets", default="0.75")
    p.add_argument("--raise-mults", default="")
    p.add_argument("--iterations", type=int, default=400)
    p.add_argument("--expl-every", type=int, default=100)
    p.add_argument("--max-combos", type=int, default=120)
    p.add_argument("--device", default="cpu")
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        return _self_test()
    board = parse_board(args.board)
    combos = _reduced(board, args.max_combos) if args.max_combos else all_combos(board)
    fb = [float(x) for x in args.flop_bets.split(",") if x]
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]
    rm = tuple(float(x) for x in args.raise_mults.split(",") if x)
    dev = args.device if (args.device != "cuda" or torch.cuda.is_available()) else "cpu"
    s = FlopVectorizedSolver(board, combos, args.pot, args.stack, fb, tb, rb, raise_mults=rm, device=dev)
    print(f"board={[card_text(c) for c in board]} combos={s.n} T={s.T} R={s.R} SPR={args.stack/args.pot:.1f} device={dev}", flush=True)
    t0 = time.time()
    s.solve(args.iterations, expl_every=args.expl_every)
    print(f"FINAL in {time.time()-t0:.1f}s  mean flop open={np.round(s.flop_open_strategy().mean(0).cpu().numpy(),3)}", flush=True)
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
