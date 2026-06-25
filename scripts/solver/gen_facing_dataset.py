#!/usr/bin/env python3
"""Generate a (features -> GTO facing distribution) dataset.

Companion to gen_solved_dataset.py (which covers OPEN decisions). This solves
many river boards with the multi-raise tree and records, for each combo at the
"facing a bet" node, the runtime feature vector (facing context: facing_bet=1,
to_call_flag=1, pot_odds set) paired with the exact solved facing distribution
[fold, call, raise-small, raise-big, jam].

Combined with the open dataset, one network is trained whose 5 outputs are read
as the open set when facing_bet=0 and the facing set when facing_bet=1 — the same
context-switch the trained-policy runtime already uses.

Run:
  python3 scripts/solver/gen_facing_dataset.py --boards 40 --out artifacts/solved-river-facing-dataset.npz
"""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import numpy as np

from gen_solved_dataset import (
    FEATURE_NAMES, FEATURE_INDEX, EQUITY_BUCKET_NAMES, MADE_BY_CATEGORY, POSITION_SIGNALS,
    rank_of, board_texture, exact_equities, equity_histogram, made_category, random_board,
)
from river_cfr import all_combos
from multiraise_tree import solve_multiraise, FACING_LABELS

np.seterr(over="ignore", invalid="ignore", divide="ignore")

POT, STACK, BET_FRAC = 10.0, 40.0, 0.66


def facing_features(combos, board, equities, hist, wet, paired, mono, conn, pos_signal, pot_odds):
    n = len(combos)
    X = np.zeros((n, len(FEATURE_NAMES)), dtype=np.float32)
    hist_mean = float(sum(((i + 0.5) / 10) * v for i, v in enumerate(hist)))
    # defender (context_aggressor = 0)
    advantage = float(np.clip(0.5 + (hist_mean - 0.5) * 0.72 - wet * 0.045, 0.18, 0.82))
    cov = float(np.clip(0.22 + hist.std() * 1.6 + (1 - wet) * 0.22, 0.08, 1))
    spr = STACK / POT if POT > 0 else STACK
    order = np.argsort(np.argsort(equities))
    percentile = order / max(1, n - 1)
    for i, combo in enumerate(combos):
        eqi = equities[i]
        cat = MADE_BY_CATEGORY.get(made_category(combo, board), 0.0)
        has_ace = 1.0 if any(rank_of(c) == 14 for c in combo) else 0.0
        blockers = float(np.clip(has_ace * 0.055 + (1 - wet) * max(0.0, 0.48 - eqi) * 0.08, 0, 0.24))
        row = X[i]
        row[FEATURE_INDEX["equity"]] = eqi
        for k, name in enumerate(EQUITY_BUCKET_NAMES):
            row[FEATURE_INDEX[name]] = hist[k]
        row[FEATURE_INDEX["pot_odds"]] = pot_odds
        row[FEATURE_INDEX["spr_norm"]] = np.clip(spr / 20, 0, 1)
        row[FEATURE_INDEX["street_river"]] = 1.0
        row[FEATURE_INDEX["position_signal"]] = pos_signal
        row[FEATURE_INDEX["to_call_flag"]] = 1.0
        row[FEATURE_INDEX["made_strength"]] = cat
        row[FEATURE_INDEX["wetness"]] = wet
        row[FEATURE_INDEX["paired"]] = paired
        row[FEATURE_INDEX["monotone"]] = mono
        row[FEATURE_INDEX["connected"]] = conn
        row[FEATURE_INDEX["range_advantage"]] = advantage
        row[FEATURE_INDEX["blockers"]] = blockers
        row[FEATURE_INDEX["range_percentile"]] = percentile[i]
        row[FEATURE_INDEX["range_weight"]] = float(np.clip(0.22 + percentile[i] * 0.62 + advantage * 0.16, 0, 1))
        row[FEATURE_INDEX["range_coverage"]] = cov
        row[FEATURE_INDEX["facing_bet"]] = 1.0
    return X


def find_facing_node(solver):
    for nd in solver.nodes:
        if list(nd.actions) == FACING_LABELS:
            return nd
    return None


def gen_board(seed):
    rng = np.random.default_rng(seed)
    board = list(random_board(rng))
    solver, _ = solve_multiraise(board, POT, STACK, [BET_FRAC], 1500)
    node = find_facing_node(solver)
    if node is None:
        return None
    facing_strat = solver.average_strategy()[node.index]  # [n, 5]
    combos = all_combos(board)
    eq = exact_equities(solver.ro.strength.astype(np.int64), solver.valid)
    hist = equity_histogram(eq)
    wet, pa, mo, co = board_texture(board)
    pos = float(rng.choice(POSITION_SIGNALS))
    bet = POT * BET_FRAC
    pot_odds = bet / (POT + 2 * bet)
    X = facing_features(combos, board, eq, hist, wet, pa, mo, co, pos, pot_odds)
    return X, facing_strat.astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--boards", type=int, default=12)
    ap.add_argument("--seed", type=int, default=20260626)
    ap.add_argument("--out", default="artifacts/solved-river-facing-dataset.npz")
    args = ap.parse_args()

    Xs, Ys = [], []
    started = time.time()
    for b in range(args.boards):
        res = gen_board(args.seed + b)
        if res is None:
            continue
        Xs.append(res[0]); Ys.append(res[1])
        if b == 0 or (b + 1) % 5 == 0 or b == args.boards - 1:
            print(f"board {b + 1}/{args.boards} mean_facing={np.round(res[1].mean(axis=0), 3)}")
    X = np.concatenate(Xs); Y = np.concatenate(Ys)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(out, X=X, Y=Y, feature_names=np.array(FEATURE_NAMES),
                        action_names=np.array(FACING_LABELS))
    print(f"\nwrote {out}: X={X.shape} Y={Y.shape} in {time.time()-started:.1f}s")
    print(f"  overall mean GTO facing dist {FACING_LABELS}: {np.round(Y.mean(axis=0), 3)}")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
