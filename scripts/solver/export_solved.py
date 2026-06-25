#!/usr/bin/env python3
"""Solve river spots exactly and export their GTO strategies as a JS artifact.

This is the bridge in the other direction: the solver writes
`src/solved-river-artifact.js`, which the strategy engine consults at runtime
(via src/solved-policy.js) to play the exact equilibrium on solved spots instead
of the heuristic. Re-running engine_exploitability.py then shows exploitability
collapse on those spots — the product moving toward GTO.

Run:
  python3 scripts/solver/export_solved.py
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from river_cfr import RiverSolver, build_range, all_combos, parse_board, card_text, _combo_key

np.seterr(over="ignore", invalid="ignore", divide="ignore")

ROOT = Path(__file__).resolve().parents[2]


def combo_key(a: int, b: int) -> str:
    return "".join(sorted([card_text(a), card_text(b)]))


def solve_spot(board_text, pot, stack, bet_sizes, iterations):
    board = parse_board(board_text)
    combos = all_combos(board)
    weights = np.ones(len(combos))
    ro = build_range(board, combos, weights.copy())
    ri = build_range(board, combos, weights.copy())
    solver = RiverSolver(board, ro, ri, pot, stack, bet_sizes)
    result = solver.solve(iterations, log_every=0)
    avg = solver.average_strategy()
    nodes = []
    for node in solver.nodes:
        strat = avg[node.index]  # [n_combos x n_actions]
        table = {}
        for i, (a, b) in enumerate(combos):
            table[combo_key(a, b)] = [round(float(x), 4) for x in strat[i]]
        nodes.append({
            "player": int(node.player),
            "toCall": round(float(getattr(node, "to_call_ctx", 0.0)), 3),
            "pot": round(float(getattr(node, "pot_ctx", pot)), 3),
            "actions": list(node.actions),
            "strategy": table,
        })
    return {
        "board": [card_text(c) for c in board],
        "pot": pot, "stack": stack, "betSizes": bet_sizes,
        "posOOP": "BB", "posIP": "BTN",
        "exploitability": round(result["final"]["exploitability_pot_frac"], 6),
        "nodes": nodes,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=2500)
    parser.add_argument("--out", default=str(ROOT / "src" / "solved-river-artifact.js"))
    args = parser.parse_args()

    # Canonical solved spots. Extend this list to widen GTO coverage.
    specs = [
        ("Qc Jd 9s 4h 2c", 10.0, 20.0, [0.75]),
    ]
    spots = []
    for board_text, pot, stack, bets in specs:
        spot = solve_spot(board_text, pot, stack, bets, args.iterations)
        spots.append(spot)
        print(f"solved {board_text}: exploitability={spot['exploitability']*100:.3f}% pot, "
              f"{len(spot['nodes'])} nodes")

    artifact = {
        "version": "solved-river-v1",
        "policyKind": "exact-cfr-river",
        "spots": spots,
    }
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(artifact, ensure_ascii=False, separators=(",", ":"))
    out.write_text(f"export const solvedRiverArtifact = {payload};\n", encoding="utf-8")
    size_kb = out.stat().st_size / 1024
    print(f"wrote {out} ({size_kb:.0f} KB)")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
