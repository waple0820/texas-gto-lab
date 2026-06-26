#!/usr/bin/env python3
"""GPU-capable torch port of the two-street turn->river CFR(+) solver.

The numpy turn solver (turn_cfr.py) is exact but CPU-bound, so local validation
caps at small ranges. This reuses turn_cfr's exact tree + sign/runout precompute
and runs the CFR/best-response in torch, so **full-range** turn spots (every
combo) solve on the dual-5090 host while staying byte-faithful to the numpy
logic.

Validation strategy (respecting "validate locally"):
  - parity: torch (CPU, float64) matches turn_cfr exploitability on a small case;
  - convergence at full range is exercised on the GPU host (exploitability -> low).

Run:
  python3 scripts/solver/turn_torch.py --self-test                       # local CPU
  python3 scripts/solver/turn_torch.py --device cuda --max-combos 0 \
      --iterations 800 --board "Kh 9d 4s 2c"                             # full-range GPU
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import numpy as np
import torch

from turn_cfr import TurnSolver, OOP, IP, _top_combos
from river_cfr import all_combos, parse_board, card_text

np.seterr(over="ignore", invalid="ignore", divide="ignore")


class TorchTurnSolver:
    """Wrap a numpy TurnSolver's exact precompute, run CFR+/BR in torch."""

    def __init__(self, base: TurnSolver, device="cpu", dtype=torch.float64):
        self.device = torch.device(device)
        self.dtype = dtype
        self.n = base.n
        self.pot = base.pot
        self.nodes = base.nodes
        self.root = base.root
        self.river_chance_weight = base.river_chance_weight

        self.valid = torch.tensor(base.valid, device=self.device, dtype=dtype)
        self.avg_sign = torch.tensor(base.avg_sign, device=self.device, dtype=dtype)
        self.sign_by_card = {c: torch.tensor(s, device=self.device, dtype=dtype)
                             for c, s in base.sign_by_card.items()}
        self.notcontain = {c: torch.tensor(nc, device=self.device, dtype=dtype)
                           for c, nc in base.notcontain.items()}
        self.reach_oop0 = torch.tensor(base.reach_oop0, device=self.device, dtype=dtype)
        self.reach_ip0 = torch.tensor(base.reach_ip0, device=self.device, dtype=dtype)

        self.regret = [torch.zeros((self.n, len(nd.actions)), device=self.device, dtype=dtype)
                       for nd in self.nodes]
        self.strat_sum = [torch.zeros_like(r) for r in self.regret]

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

    def _sign_for(self, node):
        return self.sign_by_card[node.river_card] if node.sign_kind == "river" else self.avg_sign

    def _terminal(self, node, reach_opp, player):
        base = getattr(node, "base", 0.0)  # turn-street chips in the river pot
        if node.kind == "showdown":
            sign = self._sign_for(node)
            amount = self.pot / 2.0 + base + node.invested
            if player == OOP:
                return (sign @ reach_opp) * amount
            return -(reach_opp @ sign) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + base + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + base + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _cfr(self, node, reach_oop, reach_ip):
        if node.kind == "fold" or node.kind == "showdown":
            return self._terminal(node, reach_ip, OOP), self._terminal(node, reach_oop, IP)
        if node.kind == "chance":
            uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                nc = self.notcontain[r]
                cuo, cui = self._cfr(child, reach_oop * nc * w, reach_ip * nc * w)
                uo = uo + cuo * nc
                ui = ui + cui * nc
            return uo, ui
        idx = node.index
        player = node.player
        strat = self._strategy(idx)
        own_reach = reach_oop if player == OOP else reach_ip
        k = len(node.actions)
        uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        child_acting = torch.zeros((self.n, k), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(child, reach_oop * strat[:, a], reach_ip)
                uo = uo + strat[:, a] * cuo
                ui = ui + cui
                child_acting[:, a] = cuo
            else:
                cuo, cui = self._cfr(child, reach_oop, reach_ip * strat[:, a])
                uo = uo + cuo
                ui = ui + strat[:, a] * cui
                child_acting[:, a] = cui
        node_val = (strat * child_acting).sum(dim=1, keepdim=True)
        self.regret[idx] = (self.regret[idx] + (child_acting - node_val)).clamp_min(0.0)
        self.strat_sum[idx] = self.strat_sum[idx] + own_reach.unsqueeze(1) * strat
        return uo, ui

    def _br(self, node, reach_opp, br_player, avg):
        if node.kind == "fold" or node.kind == "showdown":
            return self._terminal(node, reach_opp, br_player)
        if node.kind == "chance":
            total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                nc = self.notcontain[r]
                total = total + self._br(child, reach_opp * nc * w, br_player, avg) * nc
            return total
        idx = node.index
        if node.player == br_player:
            vals = [self._br(child, reach_opp, br_player, avg) for child in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = avg[idx]
        total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
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


def _build(board_text, pot, stack, tb, rb, max_combos):
    board = parse_board(board_text)
    combos = all_combos(board)
    if max_combos:
        combos = _top_combos(board, combos, max_combos)
    reach = np.ones(len(combos))
    base = TurnSolver(board, combos, reach.copy(), reach.copy(), pot, stack, tb, rb)
    return board, combos, base


def _self_test():
    import turn_cfr

    ok = True
    board_text, pot, stack, tb, rb, maxc = "Kh 9d 4s 2c", 10.0, 15.0, [0.75], [0.75], 90
    board, combos, base = _build(board_text, pot, stack, tb, rb, maxc)
    t = TorchTurnSolver(base, device="cpu", dtype=torch.float64)
    t_expl = t.solve(250, log_every=0)["final"]["exploitability_pot_frac"]

    reach = np.ones(len(combos))
    base2 = turn_cfr.TurnSolver(board, combos, reach.copy(), reach.copy(), pot, stack, tb, rb)
    n_expl = base2.solve(250, log_every=0)["final"]["exploitability_pot_frac"]

    match = abs(t_expl - n_expl) < 1e-3
    ok = ok and match
    print(f"[{'PASS' if match else 'FAIL'}] torch vs numpy turn parity: "
          f"torch={t_expl*100:.4f}% numpy={n_expl*100:.4f}% (|d|<0.1%)")
    conv = t_expl < 0.03
    ok = ok and conv
    print(f"[{'PASS' if conv else 'FAIL'}] turn convergence: {t_expl*100:.4f}% pot (threshold 3%)")
    print("turn_torch self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--board", default="Kh 9d 4s 2c")
    parser.add_argument("--pot", type=float, default=10.0)
    parser.add_argument("--stack", type=float, default=15.0)
    parser.add_argument("--turn-bets", default="0.75")
    parser.add_argument("--river-bets", default="0.75")
    parser.add_argument("--iterations", type=int, default=600)
    parser.add_argument("--log-every", type=int, default=100)
    parser.add_argument("--max-combos", type=int, default=160, help="0 = full range")
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
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]

    board, combos, base = _build(args.board, args.pot, args.stack, tb, rb, args.max_combos)
    print(f"device={device} dtype={args.dtype} board={[card_text(c) for c in board]} "
          f"combos={len(combos)} pot={args.pot} stack={args.stack} turn_bets={tb} river_bets={rb}")
    solver = TorchTurnSolver(base, device=device, dtype=dtype)
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
            "pot": args.pot, "stack": args.stack, "turn_bets": tb, "river_bets": rb,
            "combos": len(combos), "iterations": args.iterations, "seconds": round(elapsed, 2),
            "final": final, "history": result["history"],
        }, indent=2))
        print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
