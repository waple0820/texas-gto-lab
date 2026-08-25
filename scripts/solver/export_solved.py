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
            table[combo_key(a, b)] = [round(float(x), 3) for x in strat[i]]
        node_pot = round(float(getattr(node, "pot_ctx", pot)), 3)
        node_to_call = round(float(getattr(node, "to_call_ctx", 0.0)), 3)
        # Acting player's remaining stack at this node. In this heads-up tree
        # both players start with `stack` behind and contributions since the
        # root are symmetric around toCall, so invested = (growth - toCall)/2.
        # Recorded HERE (where the tree builder guarantees the identity) so the
        # runtime never has to reconstruct it from geometry assumptions.
        invested = max(0.0, (node_pot - pot - node_to_call) / 2.0)
        nodes.append({
            "player": int(node.player),
            "toCall": node_to_call,
            "pot": node_pot,
            "stack": round(stack - invested, 3),
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

    # Canonical solved spots spanning common river textures. Extend to widen
    # exact-GTO coverage in the product.
    #
    # Each board is solved at TWO stack depths: 20bb behind (SPR 2, short) and
    # 90bb behind (SPR 9 — what the app's 100bb games actually reach with a
    # ~10bb river pot). The runtime lookup picks the depth tier nearest the
    # live effective stack and rejects stacks outside its band, so one tier's
    # equilibrium is never served at a foreign depth.
    boards = [
        "Qc Jd 9s 4h 2c",  # two-broadway, semi-wet
        "As Kd 7c 3h 2s",  # ace-high dry
        "Ah Kh Qh 5d 2c",  # three-flush board
        "Td 9d 8c 7h 2s",  # connected / straighty
        "8s 8d Kc 4h 4s",  # double-paired
    ]
    specs = [(board, 10.0, stack, [0.75]) for board in boards for stack in (20.0, 90.0)]
    spots = []
    for board_text, pot, stack, bets in specs:
        spot = solve_spot(board_text, pot, stack, bets, args.iterations)
        spots.append(spot)
        print(f"solved {board_text}: exploitability={spot['exploitability']*100:.3f}% pot, "
              f"{len(spot['nodes'])} nodes")

    artifact = {
        "version": "solved-river-v2-depths",
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
