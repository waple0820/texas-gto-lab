#!/usr/bin/env python3
"""GPU-capable torch port of the exact river CFR(+) solver.

Stage 3 of the GTO solver track (see docs/GTO_SOLVER.md). The numpy solvers are
exact but CPU-bound, which caps them at small validation ranges. This torch port
runs the identical vectorized CFR+ on CUDA so **full-range** river spots (every
combo, ~1081) solve in seconds on the dual-5090 host, producing real, usable GTO
strategies — while staying byte-for-byte faithful to the numpy logic (validated
locally on CPU against river_cfr).

Same exact guarantees as river_cfr.py:
  - deterministic river showdowns (no Monte Carlo), exact blocker handling;
  - CFR+ regret matching;
  - exact best-response exploitability (fraction of pot / mbb-per-pot).

Run:
  python3 scripts/solver/solver_torch.py --self-test                 # local CPU validation
  python3 scripts/solver/solver_torch.py --device cuda --iterations 2000 \
      --board "Kh 9d 4s 2c 7h" --oop-frac 1.0 --ip-frac 1.0          # full-range GPU solve
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import numpy as np
import torch

from river_cfr import (
    OOP,
    IP,
    all_combos,
    build_tree,
    card_int,
    card_text,
    conflict_mask,
    index_nodes,
    parse_board,
    _combo_key,
)


class TorchRiverSolver:
    def __init__(self, board, combos, reach_oop, reach_ip, pot, stack, bet_sizes,
                 device="cpu", dtype=torch.float64):
        self.device = torch.device(device)
        self.dtype = dtype
        self.pot = float(pot)
        self.combos = combos
        self.no = len(combos)
        self.ni = len(combos)

        board_t = tuple(board)
        strength = np.array([_combo_key(tuple(c), board_t) for c in combos], dtype=np.int64)
        valid = conflict_mask(combos, combos)
        sign = np.sign(strength[:, None] - strength[None, :]) * valid

        self.valid = torch.tensor(valid, device=self.device, dtype=dtype)
        self.sign = torch.tensor(sign, device=self.device, dtype=dtype)
        self.reach_oop0 = self._norm(torch.tensor(reach_oop, device=self.device, dtype=dtype))
        self.reach_ip0 = self._norm(torch.tensor(reach_ip, device=self.device, dtype=dtype))

        self.root = build_tree(pot, stack, bet_sizes)
        self.nodes = index_nodes(self.root)
        self.regret = [torch.zeros((self._n(nd.player), len(nd.actions)), device=self.device, dtype=dtype)
                       for nd in self.nodes]
        self.strat_sum = [torch.zeros_like(r) for r in self.regret]

    def _n(self, player):
        return self.no if player == OOP else self.ni

    @staticmethod
    def _norm(v):
        return v / v.sum().clamp_min(1e-12)

    def _strategy(self, idx):
        regret = self.regret[idx].clamp_min(0.0)
        total = regret.sum(dim=1, keepdim=True)
        k = regret.shape[1]
        return torch.where(total > 1e-12, regret / total.clamp_min(1e-12),
                           torch.full_like(regret, 1.0 / k))

    def average_strategy(self):
        out = []
        for s in self.strat_sum:
            total = s.sum(dim=1, keepdim=True)
            k = s.shape[1]
            out.append(torch.where(total > 1e-12, s / total.clamp_min(1e-12),
                                   torch.full_like(s, 1.0 / k)))
        return out

    # terminals, OOP-perspective zero-sum shifted by pot/2
    def _terminal(self, node, reach_opp, player):
        if node.kind == "showdown":
            amount = self.pot / 2.0 + node.invested
            if player == OOP:
                return (self.sign @ reach_opp) * amount
            return -(reach_opp @ self.sign) * amount
        # fold
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _cfr(self, node, reach_oop, reach_ip):
        if node.kind != "decision":
            return self._terminal(node, reach_ip, OOP), self._terminal(node, reach_oop, IP)
        idx = node.index
        player = node.player
        strat = self._strategy(idx)
        own_reach = reach_oop if player == OOP else reach_ip
        k = len(node.actions)
        uo = torch.zeros(self.no, device=self.device, dtype=self.dtype)
        ui = torch.zeros(self.ni, device=self.device, dtype=self.dtype)
        child_acting = torch.zeros((self._n(player), k), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(reach_oop=reach_oop * strat[:, a], reach_ip=reach_ip, node=child)
                uo = uo + strat[:, a] * cuo
                ui = ui + cui
                child_acting[:, a] = cuo
            else:
                cuo, cui = self._cfr(reach_oop=reach_oop, reach_ip=reach_ip * strat[:, a], node=child)
                uo = uo + cuo
                ui = ui + strat[:, a] * cui
                child_acting[:, a] = cui
        node_val = (strat * child_acting).sum(dim=1, keepdim=True)
        self.regret[idx] = (self.regret[idx] + (child_acting - node_val)).clamp_min(0.0)
        self.strat_sum[idx] = self.strat_sum[idx] + own_reach.unsqueeze(1) * strat
        return uo, ui

    def _br(self, node, reach_opp, br_player, avg):
        if node.kind != "decision":
            return self._terminal(node, reach_opp, br_player)
        idx = node.index
        if node.player == br_player:
            vals = [self._br(child, reach_opp, br_player, avg) for child in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = avg[idx]
        total = torch.zeros(self._n(br_player), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._br(child, reach_opp * strat[:, a], br_player, avg)
        return total

    def exploitability(self, avg):
        br_oop = float((self.reach_oop0 * self._br(self.root, self.reach_ip0.clone(), OOP, avg)).sum())
        br_ip = float((self.reach_ip0 * self._br(self.root, self.reach_oop0.clone(), IP, avg)).sum())
        expl = br_oop + br_ip
        return {"br_oop": br_oop, "br_ip": br_ip,
                "exploitability_pot_frac": expl / self.pot,
                "exploitability_mbb": expl / self.pot * 1000.0}

    @torch.no_grad()
    def solve(self, iterations, log_every=0):
        history = []
        for t in range(1, iterations + 1):
            self._cfr(self.root, self.reach_oop0.clone(), self.reach_ip0.clone())
            if log_every and (t == 1 or t % log_every == 0 or t == iterations):
                m = self.exploitability(self.average_strategy())
                m["iteration"] = t
                history.append(m)
                print(f"iter={t:5d} exploitability={m['exploitability_pot_frac']*100:7.4f}% pot "
                      f"({m['exploitability_mbb']:8.2f} mbb/pot)")
        final = self.exploitability(self.average_strategy())
        return {"history": history, "final": final}


def _make_ranges(board, oop_frac, ip_frac):
    combos = all_combos(board)
    board_t = tuple(board)
    strengths = np.array([_combo_key(tuple(c), board_t) for c in combos])
    order = np.argsort(-strengths)

    def weights(frac):
        w = np.zeros(len(combos))
        w[order[:max(1, int(len(combos) * frac))]] = 1.0
        return w

    return combos, weights(oop_frac), weights(ip_frac)


def _self_test():
    """Validate the torch port matches the numpy solver and converges full-range."""
    import river_cfr

    ok = True
    # 1) correctness: torch (cpu, float64) matches numpy river_cfr on a fixed case
    board = parse_board("Kh 9d 4s 2c 7h")
    combos, wo, wi = _make_ranges(board, 0.25, 0.25)
    t = TorchRiverSolver(board, combos, wo.copy(), wi.copy(), 10.0, 20.0, [0.5, 1.0],
                         device="cpu", dtype=torch.float64)
    t_final = t.solve(800, log_every=0)["final"]["exploitability_pot_frac"]

    rng_o = river_cfr.build_range(board, combos, wo.copy())
    rng_i = river_cfr.build_range(board, combos, wi.copy())
    n = river_cfr.RiverSolver(board, rng_o, rng_i, 10.0, 20.0, [0.5, 1.0])
    n_final = n.solve(800, log_every=0)["final"]["exploitability_pot_frac"]

    match = abs(t_final - n_final) < 1e-3
    ok = ok and match
    print(f"[{'PASS' if match else 'FAIL'}] torch vs numpy parity: "
          f"torch={t_final*100:.4f}% numpy={n_final*100:.4f}% (|d|<0.1%)")

    # 2) convergence: full-range river drives exploitability low
    combos, wo, wi = _make_ranges(board, 1.0, 1.0)
    full = TorchRiverSolver(board, combos, wo.copy(), wi.copy(), 10.0, 20.0, [0.5, 1.0],
                            device="cpu", dtype=torch.float64)
    f_expl = full.solve(1500, log_every=0)["final"]["exploitability_pot_frac"]
    conv = f_expl < 0.006
    ok = ok and conv
    print(f"[{'PASS' if conv else 'FAIL'}] full-range river convergence: "
          f"{f_expl*100:.4f}% pot (threshold 0.6%)")

    print("solver_torch self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--board", default="Kh 9d 4s 2c 7h")
    parser.add_argument("--pot", type=float, default=10.0)
    parser.add_argument("--stack", type=float, default=20.0)
    parser.add_argument("--bet-sizes", default="0.5,1.0")
    parser.add_argument("--iterations", type=int, default=1500)
    parser.add_argument("--log-every", type=int, default=200)
    parser.add_argument("--oop-frac", type=float, default=1.0)
    parser.add_argument("--ip-frac", type=float, default=1.0)
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--dtype", default="float32", choices=["float32", "float64"])
    parser.add_argument("--out", default="")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return _self_test()

    device = args.device
    if device == "cuda" and not torch.cuda.is_available():
        print("cuda requested but unavailable; falling back to cpu")
        device = "cpu"
    dtype = torch.float64 if args.dtype == "float64" else torch.float32

    board = parse_board(args.board)
    assert len(board) == 5
    bet_sizes = [float(x) for x in args.bet_sizes.split(",") if x]
    combos, wo, wi = _make_ranges(board, args.oop_frac, args.ip_frac)
    print(f"device={device} dtype={args.dtype} board={[card_text(c) for c in board]} "
          f"combos={len(combos)} pot={args.pot} stack={args.stack} bets={bet_sizes}")
    solver = TorchRiverSolver(board, combos, wo.copy(), wi.copy(), args.pot, args.stack,
                              bet_sizes, device=device, dtype=dtype)
    started = time.time()
    result = solver.solve(args.iterations, log_every=args.log_every)
    elapsed = time.time() - started
    final = result["final"]
    print(f"\nFINAL exploitability = {final['exploitability_pot_frac']*100:.4f}% of pot "
          f"({final['exploitability_mbb']:.2f} mbb/pot)  in {elapsed:.1f}s on {device}")
    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps({
            "board": [card_text(c) for c in board], "device": device, "dtype": args.dtype,
            "pot": args.pot, "stack": args.stack, "bet_sizes": bet_sizes, "combos": len(combos),
            "iterations": args.iterations, "seconds": round(elapsed, 2), "final": final,
            "history": result["history"],
        }, indent=2))
        print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
