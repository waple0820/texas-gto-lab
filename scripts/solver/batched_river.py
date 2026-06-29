#!/usr/bin/env python3
"""Vectorized river CFR+ batched over many boards/rivers at once (torch).

The flop solver is Python-recursion-bound: per iteration it loops over 46 river
cards, recursing the river betting subtree for each. The torch port (flop_torch)
only got ~1.3x because it kept that per-node Python recursion — kernel-launch
overhead dominates with small per-node tensors.

This is the foundation of the fix: solve B river games SIMULTANEOUSLY with a
leading batch dimension. The betting-tree STRUCTURE is shared (same multiraise
tree); only the numeric tensors carry the B batch — reach (B,n), regret/strat
per node (B,n,A), and the per-board showdown sign matrix (B,n,n). The recursion
is over the ~15 tree nodes (cheap, in Python), but every node's work is a single
batched tensor op over (B, n[, A]) — so B=46 rivers (or B=many boards) run in one
GPU pass with large tensors instead of 46 tiny recursive passes.

Validation (validate locally): parity — batched torch (CPU float64) matches the
numpy RiverSolver exploitability on each of B boards solved together, vs solving
them one at a time.

Run:
  python3 scripts/solver/batched_river.py --self-test
  python3 scripts/solver/batched_river.py --device cuda --boards 46 --iterations 800
"""

from __future__ import annotations

import argparse
import time

import numpy as np
import torch

from river_cfr import Node, OOP, IP, all_combos, conflict_mask, parse_board, _combo_key, build_range
from multiraise_tree import build_multiraise_river

np.seterr(over="ignore", invalid="ignore", divide="ignore")


def index_nodes(root):
    out = []

    def walk(n):
        if n.kind == "decision":
            n.index = len(out)
            out.append(n)
        for c in n.children:
            walk(c)

    walk(root)
    return out


class BatchedRiverSolver:
    """Solve B full-range river games in parallel. Each board b has its own sign
    matrix sign[b] (n,n, OOP perspective). Both players share the combo set, so
    valid (n,n) is shared. CFR+ with batched tensor ops."""

    def __init__(self, sign, valid, pot, stack, bet_sizes, device="cpu", dtype=torch.float64):
        self.device = torch.device(device)
        self.dtype = dtype
        self.B, self.n, _ = sign.shape
        self.pot = float(pot)
        self.sign = torch.as_tensor(sign, device=self.device, dtype=dtype)     # (B,n,n)
        self.valid = torch.as_tensor(valid, device=self.device, dtype=dtype)   # (n,n)
        self.root = build_multiraise_river(pot, stack, bet_sizes)
        self.nodes = index_nodes(self.root)
        self.regret = [torch.zeros((self.B, self.n, len(nd.actions)), device=self.device, dtype=dtype)
                       for nd in self.nodes]
        self.strat_sum = [torch.zeros_like(r) for r in self.regret]
        # uniform full-range reach per board
        self.reach0 = torch.ones((self.B, self.n), device=self.device, dtype=dtype) / self.n

    def _strategy(self, idx):
        reg = self.regret[idx].clamp_min(0.0)
        tot = reg.sum(dim=2, keepdim=True)
        k = reg.shape[2]
        return torch.where(tot > 1e-12, reg / tot.clamp_min(1e-12), torch.full_like(reg, 1.0 / k))

    # --- terminals (OOP perspective, zero-sum shifted by pot/2) ---
    def _showdown(self, reach_opp, player, invested):
        amount = self.pot / 2.0 + invested
        if player == OOP:                       # util_oop[b,i] = sum_j sign[b,i,j] reach_ip[b,j]
            return torch.einsum("bij,bj->bi", self.sign, reach_opp) * amount
        return -torch.einsum("bi,bij->bj", reach_opp, self.sign) * amount

    def _fold(self, node, reach_opp, player):
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return torch.einsum("ij,bj->bi", self.valid, reach_opp) * g
        return torch.einsum("bi,ij->bj", reach_opp, self.valid) * (-g)

    def _terminal(self, node, reach_opp, player):
        if node.kind == "showdown":
            return self._showdown(reach_opp, player, node.invested)
        return self._fold(node, reach_opp, player)

    def _cfr(self, node, reach_oop, reach_ip):
        if node.kind != "decision":
            return self._terminal(node, reach_ip, OOP), self._terminal(node, reach_oop, IP)
        idx = node.index
        strat = self._strategy(idx)             # (B,n,A)
        player = node.player
        own = reach_oop if player == OOP else reach_ip
        uo = torch.zeros((self.B, self.n), device=self.device, dtype=self.dtype)
        ui = torch.zeros((self.B, self.n), device=self.device, dtype=self.dtype)
        ca = torch.zeros((self.B, self.n, len(node.actions)), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(child, reach_oop * strat[:, :, a], reach_ip)
                uo = uo + strat[:, :, a] * cuo
                ui = ui + cui
                ca[:, :, a] = cuo
            else:
                cuo, cui = self._cfr(child, reach_oop, reach_ip * strat[:, :, a])
                uo = uo + cuo
                ui = ui + strat[:, :, a] * cui
                ca[:, :, a] = cui
        node_val = (strat * ca).sum(dim=2, keepdim=True)
        self.regret[idx] = (self.regret[idx] + (ca - node_val)).clamp_min(0.0)
        self.strat_sum[idx] = self.strat_sum[idx] + own.unsqueeze(2) * strat
        return uo, ui

    def average_strategy(self):
        out = []
        for s in self.strat_sum:
            tot = s.sum(dim=2, keepdim=True)
            k = s.shape[2]
            out.append(torch.where(tot > 1e-12, s / tot.clamp_min(1e-12), torch.full_like(s, 1.0 / k)))
        return out

    # --- exact best response per board ---
    def _br(self, node, reach_opp, br_player, avg):
        if node.kind != "decision":
            return self._terminal(node, reach_opp, br_player)
        idx = node.index
        if node.player == br_player:
            vals = [self._br(c, reach_opp, br_player, avg) for c in node.children]
            return torch.stack(vals, dim=2).max(dim=2).values
        strat = avg[idx]
        total = torch.zeros((self.B, self.n), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._br(child, reach_opp * strat[:, :, a], br_player, avg)
        return total

    @torch.no_grad()
    def exploitability(self, avg=None):
        if avg is None:
            avg = self.average_strategy()
        bo = self._br(self.root, self.reach0.clone(), OOP, avg)
        bi = self._br(self.root, self.reach0.clone(), IP, avg)
        vo = (self.reach0 * bo).sum(dim=1)
        vi = (self.reach0 * bi).sum(dim=1)
        return ((vo + vi) / self.pot)          # (B,) per-board exploitability frac

    @torch.no_grad()
    def solve(self, iterations):
        for _ in range(iterations):
            self._cfr(self.root, self.reach0.clone(), self.reach0.clone())
        return self.exploitability()


def _signs_for_boards(boards, combos):
    valid = conflict_mask(combos, combos)
    signs = []
    for board in boards:
        st = np.array([_combo_key(tuple(c), tuple(board)) for c in combos], dtype=np.int64)
        signs.append((np.sign(st[:, None] - st[None, :]) * valid).astype(np.float64))
    return np.stack(signs, axis=0), valid


def _self_test():
    import river_cfr
    # a few random 5-card boards, reduced combo set for speed
    rng = np.random.default_rng(3)
    boards = []
    while len(boards) < 4:
        b = tuple(int(c) for c in rng.choice(52, size=5, replace=False))
        boards.append(b)
    pot, stack, bets = 10.0, 40.0, [0.66]
    # shared reduced combo set valid for all boards (avoid board-card collisions)
    used = set().union(*[set(b) for b in boards])
    deck = [c for c in range(52) if c not in used]
    from itertools import combinations
    combos = [(a, b) for a, b in combinations(deck, 2)][:120]
    sign, valid = _signs_for_boards(boards, combos)

    # batched solve
    bs = BatchedRiverSolver(sign, valid, pot, stack, bets, device="cpu")
    bs.solve(800)
    batched_expl = bs.exploitability().cpu().numpy()

    # per-board numpy reference (same tree via multiraise solve)
    from multiraise_tree import build_multiraise_river
    ref = []
    for k, board in enumerate(boards):
        w = np.ones(len(combos))
        ro = build_range(list(board), combos, w.copy())
        ri = build_range(list(board), combos, w.copy())
        tree = build_multiraise_river(pot, stack, bets)
        solver = river_cfr.RiverSolver(list(board), ro, ri, pot, stack, bets, tree=tree)
        solver.solve(800, log_every=0)
        ref.append(solver.exploitability(solver.average_strategy())["exploitability_pot_frac"])
    ref = np.array(ref)
    diff = np.abs(batched_expl - ref)
    ok = bool((diff < 5e-3).all()) and bool((batched_expl < 0.05).all())
    print("batched vs numpy per-board exploitability:")
    for k in range(len(boards)):
        print(f"  board {k}: batched={batched_expl[k]*100:.4f}%  numpy={ref[k]*100:.4f}%  d={diff[k]*100:.4f}pp")
    print(f"[{'PASS' if ok else 'FAIL'}] batched_river parity (max d={diff.max()*100:.4f}pp)")
    print("batched_river self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--device", default="cpu")
    p.add_argument("--boards", type=int, default=46)
    p.add_argument("--iterations", type=int, default=800)
    p.add_argument("--combos", type=int, default=400)
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        return _self_test()
    # benchmark mirrors the real flop use: a fixed flop+turn (4 cards) and the
    # river enumerated over the remaining deck (B = up to 46 rivers), all sharing
    # one combo set (combos exclude the 4-card board).
    rng = np.random.default_rng(7)
    turn_board = [int(c) for c in rng.choice(52, size=4, replace=False)]
    river_deck = [c for c in range(52) if c not in set(turn_board)]
    rivers = river_deck[:args.boards]
    boards = [tuple(turn_board) + (r,) for r in rivers]
    from itertools import combinations
    combos = [(a, b) for a, b in combinations(river_deck, 2)][:args.combos]
    # drop combos that collide with any river is unnecessary here — conflict_mask
    # per-board would, but for a benchmark the shared combo set is fine.
    sign, valid = _signs_for_boards(boards, combos)
    dev = args.device if (args.device != "cuda" or torch.cuda.is_available()) else "cpu"
    bs = BatchedRiverSolver(sign, valid, 10.0, 40.0, [0.66], device=dev)
    t0 = time.time()
    expl = bs.solve(args.iterations)
    dt = time.time() - t0
    print(f"device={dev} B={args.boards} combos={len(combos)} iters={args.iterations} "
          f"mean_expl={float(expl.mean())*100:.4f}% in {dt:.1f}s "
          f"({dt/args.iterations*1000:.1f} ms/iter for all {args.boards} boards)")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
