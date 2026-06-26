#!/usr/bin/env python3
"""Generate a (features -> GTO strategy) dataset by solving many river boards.

Exact per-combo solved tables don't transfer between boards, so generalizing GTO
beyond exact-match spots means distilling the solver into a learned function. This
script produces the training data for that: it solves many random river boards
with the artifact's bet-size buckets and, for each combo, records the runtime
feature vector paired with the exact solved OPEN distribution
[check, bet-small, bet-mid, bet-big, bet-over].

Features use the same FEATURE_NAMES contract as src/trained-policy-runtime.js, so
a model trained on this data drops straight into the existing artifact pipeline.

Run:
  python3 scripts/solver/gen_solved_dataset.py --boards 60 --out artifacts/solved-river-dataset.npz
"""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import numpy as np

from river_cfr import RiverSolver, build_range, all_combos, card_text, _combo_key

np.seterr(over="ignore", invalid="ignore", divide="ignore")

# Bet buckets aligned to the artifact's open action set.
BET_SIZES = [0.33, 0.66, 1.0, 1.5]  # -> bet-small, bet-mid, bet-big, bet-over

EQUITY_BUCKET_NAMES = [f"range_eq_{s}_{s + 10}" for s in range(0, 100, 10)]
FEATURE_NAMES = [
    "equity", *EQUITY_BUCKET_NAMES, "pot_odds", "spr_norm",
    "street_flop", "street_turn", "street_river", "position_signal", "to_call_flag",
    "made_strength", "draw_strength", "wetness", "paired", "monotone", "connected",
    "range_advantage", "blockers", "range_percentile", "range_weight", "range_coverage",
    "context_aggressor", "three_bet", "facing_bet", "free_check",
    # granular blockers (river GTO bluff/call selection is blocker-driven); a
    # blocker-feature ablation cut held-out TV from 0.125 to 0.105 (-15.5%).
    "flush_blocker", "nut_flush_blocker", "top_blocker", "board_pair_blocker",
]
FEATURE_INDEX = {name: i for i, name in enumerate(FEATURE_NAMES)}

MADE_BY_CATEGORY = {0: 0.0, 1: 0.12, 2: 0.32, 3: 0.48, 4: 0.62, 5: 0.68, 6: 0.78, 7: 0.9, 8: 0.96}
POSITION_SIGNALS = [0.3, 0.34, 0.58, 0.76]  # BB, SB, CO, BTN-ish for OOP variety


def rank_of(c):
    return (c % 13) + 2


def suit_of(c):
    return c // 13


def board_texture(board):
    ranks = [rank_of(c) for c in board]
    suits = [suit_of(c) for c in board]
    paired = float(any(ranks.count(r) > 1 for r in set(ranks)))
    max_suit = max(suits.count(s) for s in set(suits))
    monotone = float(max_suit >= 3)
    ordered = sorted(set(ranks))
    if 14 in ordered:
        ordered = [1, *ordered]
    connected = 0.0
    for r in ordered:
        if sum(1 for v in ordered if r <= v <= r + 4) >= min(3, len(board)):
            connected = 1.0
            break
    wetness = float(np.clip(connected * 0.34 + (0.32 if max_suit >= 3 else 0.16 if max_suit == 2 else 0)
                            - paired * 0.08, 0, 1))
    return wetness, paired, monotone, connected


def exact_equities(strength, valid):
    gt = (strength[:, None] > strength[None, :]).astype(np.float64)
    eq = (strength[:, None] == strength[None, :]).astype(np.float64)
    num = (valid * (gt + 0.5 * eq)).sum(axis=1)
    den = valid.sum(axis=1)
    return num / np.maximum(den, 1e-9)


def equity_histogram(equities):
    buckets = np.zeros(10)
    idx = np.clip((equities * 10).astype(int), 0, 9)
    for b in idx:
        buckets[b] += 1
    total = buckets.sum()
    return buckets / total if total > 0 else np.full(10, 0.1)


def made_category(combo, board):
    from river_cfr import eval7
    return eval7((*combo, *board))[0]


def blocker_features(combo, board):
    """Granular blockers from the hero combo + board. Kept simple so the JS
    runtime (src/distilled-policy.js) can reproduce them exactly for parity:
    flush_blocker (holds a card of a 3+ suit), nut_flush_blocker (holds the ace of
    it), top_blocker (holds a card matching the highest board rank),
    board_pair_blocker (board has a paired rank and hero holds that rank)."""
    suits = [c // 13 for c in board]
    ranks = [c % 13 + 2 for c in board]
    suit_counts = {s: suits.count(s) for s in set(suits)}
    flush_suit = next((s for s, n in suit_counts.items() if n >= 3), None)
    fl = 1.0 if flush_suit is not None and any(c // 13 == flush_suit for c in combo) else 0.0
    nutfl = 1.0 if flush_suit is not None and any(c // 13 == flush_suit and c % 13 + 2 == 14 for c in combo) else 0.0
    top_rank = max(ranks)
    top = 1.0 if any(c % 13 + 2 == top_rank for c in combo) else 0.0
    paired_ranks = {r for r in set(ranks) if ranks.count(r) >= 2}
    pblk = 1.0 if paired_ranks and any(c % 13 + 2 in paired_ranks for c in combo) else 0.0
    return fl, nutfl, top, pblk


def build_features(combos, board, equities, hist, wet, paired, mono, conn, pot, stack, pos_signal):
    n = len(combos)
    X = np.zeros((n, len(FEATURE_NAMES)), dtype=np.float32)
    hist_mean = float(sum(((i + 0.5) / 10) * v for i, v in enumerate(hist)))
    advantage = float(np.clip(0.5 + (hist_mean - 0.5) * 0.72 + 0.05 - wet * 0.045, 0.18, 0.82))
    cov = float(np.clip(0.22 + hist.std() * 1.6 + (1 - wet) * 0.22, 0.08, 1))
    spr = stack / pot if pot > 0 else stack
    order = np.argsort(np.argsort(equities))  # rank
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
        row[FEATURE_INDEX["spr_norm"]] = np.clip(spr / 20, 0, 1)
        row[FEATURE_INDEX["street_river"]] = 1.0
        row[FEATURE_INDEX["position_signal"]] = pos_signal
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
        fl, nutfl, top, pblk = blocker_features(combo, board)
        row[FEATURE_INDEX["flush_blocker"]] = fl
        row[FEATURE_INDEX["nut_flush_blocker"]] = nutfl
        row[FEATURE_INDEX["top_blocker"]] = top
        row[FEATURE_INDEX["board_pair_blocker"]] = pblk
        row[FEATURE_INDEX["context_aggressor"]] = 1.0
        row[FEATURE_INDEX["free_check"]] = 1.0
    return X


def random_board(rng):
    return tuple(int(c) for c in rng.choice(52, size=5, replace=False))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--boards", type=int, default=40)
    parser.add_argument("--pot", type=float, default=10.0)
    parser.add_argument("--stack", type=float, default=20.0)
    parser.add_argument("--iterations", type=int, default=1200)
    parser.add_argument("--seed", type=int, default=20260626)
    parser.add_argument("--out", default="artifacts/solved-river-dataset.npz")
    args = parser.parse_args()

    rng = np.random.default_rng(args.seed)
    Xs, Ys = [], []
    started = time.time()
    for b in range(args.boards):
        board = list(random_board(rng))
        combos = all_combos(board)
        weights = np.ones(len(combos))
        ro = build_range(board, combos, weights.copy())
        ri = build_range(board, combos, weights.copy())
        solver = RiverSolver(board, ro, ri, args.pot, args.stack, BET_SIZES)
        result = solver.solve(args.iterations, log_every=0)
        avg = solver.average_strategy()
        open_dist = avg[0]  # root OOP open [n, 5]

        strength = ro.strength.astype(np.int64)
        valid = solver.valid
        equities = exact_equities(strength, valid)
        hist = equity_histogram(equities)
        wet, paired, mono, conn = board_texture(board)
        pos_signal = float(rng.choice(POSITION_SIGNALS))
        X = build_features(combos, board, equities, hist, wet, paired, mono, conn,
                           args.pot, args.stack, pos_signal)
        Xs.append(X)
        Ys.append(open_dist.astype(np.float32))
        if b == 0 or (b + 1) % 5 == 0 or b == args.boards - 1:
            print(f"board {b + 1}/{args.boards} {[card_text(c) for c in board]} "
                  f"expl={result['final']['exploitability_pot_frac']*100:.2f}% "
                  f"mean_dist={np.round(open_dist.mean(axis=0), 3)}")

    X = np.concatenate(Xs, axis=0)
    Y = np.concatenate(Ys, axis=0)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(out, X=X, Y=Y, feature_names=np.array(FEATURE_NAMES),
                        action_names=np.array(["check", "bet-small", "bet-mid", "bet-big", "bet-over"]))
    print(f"\nwrote {out}: X={X.shape} Y={Y.shape} in {time.time()-started:.1f}s")
    print(f"  overall mean GTO open dist: {np.round(Y.mean(axis=0), 3)}")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
