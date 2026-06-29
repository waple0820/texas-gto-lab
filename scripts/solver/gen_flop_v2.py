#!/usr/bin/env python3
"""Flop dataset generation on the vectorized GPU solver (deep-SPR, trustworthy).

v1's flop targets were shallow-only (the CPU solver couldn't converge deep), so the
model wrongly checked ~94% at the SPR the app plays. flop_vectorized converges deep
in seconds, so this generates trustworthy targets across the real stack range.

Per board: random flop, random stack (SPR variety), solve with FlopVectorizedSolver
(deterministic, enumerated, GPU), extract the exact OPEN (check/bet-mid) and FACING
(fold/call/jam) strategies, pair with the street_flop feature vector. Same feature
contract + 3-output model as the gated flop artifact, so it drops into train_distill.

Sequential per board on the GPU (~25-30s/board incl. sign precompute). Run on the
5090 host:
  python3 scripts/solver/gen_flop_v2.py 150 artifacts/flop-dataset-v2.npz
"""

from __future__ import annotations

import os
import sys
import time

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import torch  # noqa: E402

from river_cfr import all_combos, conflict_mask, card_text  # noqa: E402
from flop_vectorized import FlopVectorizedSolver  # noqa: E402
from gen_solved_dataset import (  # noqa: E402
    FEATURE_NAMES, FEATURE_INDEX, EQUITY_BUCKET_NAMES, MADE_BY_CATEGORY, POSITION_SIGNALS,
    rank_of, board_texture, equity_histogram, made_category, blocker_features,
)
from gen_turn_dataset import draw_strength  # noqa: E402

np.seterr(over="ignore", invalid="ignore", divide="ignore")

POT = 6.0
FLOP_BET = 0.66
TURN_BETS = [0.66]
RIVER_BETS = [0.75]
STACKS = [15.0, 30.0, 50.0, 80.0]   # SPR 2.5 / 5 / 8.3 / 13.3
N_COMBOS = 140
ITERATIONS = 700
EQUITY_RUNOUTS = 120

OPEN_ACTIONS = ["check", "bet-mid"]
FACING_ACTIONS = ["fold", "call", "jam"]
N_OUT = 3


def flop_equities(flop, combos, valid, rng, n_runouts=EQUITY_RUNOUTS):
    from river_cfr import _combo_key
    ca = np.array(combos); n = len(combos)
    deck = [c for c in range(52) if c not in set(flop)]
    num = np.zeros(n); den = np.zeros(n)
    for _ in range(n_runouts):
        t, r = (int(x) for x in rng.choice(deck, size=2, replace=False))
        b5 = tuple(flop) + (t, r)
        st = np.array([_combo_key(tuple(c), b5) for c in combos], dtype=np.int64)
        nc = (~((ca[:, 0] == t) | (ca[:, 1] == t) | (ca[:, 0] == r) | (ca[:, 1] == r))).astype(np.float64)
        w = valid * np.outer(nc, nc)
        gt = (st[:, None] > st[None, :]).astype(np.float64)
        eq = (st[:, None] == st[None, :]).astype(np.float64)
        num += (w * (gt + 0.5 * eq)).sum(axis=1); den += w.sum(axis=1)
    return num / np.maximum(den, 1e-9)


def flop_features(combos, board, equities, hist, wet, paired, mono, conn, stack, pos_signal, facing, pot_odds):
    n = len(combos)
    X = np.zeros((n, len(FEATURE_NAMES)), dtype=np.float32)
    hist_mean = float(sum(((i + 0.5) / 10) * v for i, v in enumerate(hist)))
    adv_aggr = 0.0 if facing else 0.05
    advantage = float(np.clip(0.5 + (hist_mean - 0.5) * 0.72 + adv_aggr - wet * 0.045, 0.18, 0.82))
    cov = float(np.clip(0.22 + hist.std() * 1.6 + (1 - wet) * 0.22, 0.08, 1))
    spr = stack / POT if POT > 0 else stack
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
        row[FEATURE_INDEX["spr_norm"]] = np.clip(spr / 20, 0, 1)
        row[FEATURE_INDEX["street_flop"]] = 1.0
        row[FEATURE_INDEX["position_signal"]] = pos_signal
        row[FEATURE_INDEX["made_strength"]] = cat
        row[FEATURE_INDEX["draw_strength"]] = draw_strength(combo, board)
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
        if facing:
            row[FEATURE_INDEX["pot_odds"]] = pot_odds
            row[FEATURE_INDEX["to_call_flag"]] = 1.0
            row[FEATURE_INDEX["facing_bet"]] = 1.0
        else:
            row[FEATURE_INDEX["context_aggressor"]] = 1.0
            row[FEATURE_INDEX["free_check"]] = 1.0
    return X


def gen_one(seed, device):
    rng = np.random.default_rng(seed)
    board = [int(c) for c in rng.choice(52, size=3, replace=False)]
    stack = float(rng.choice(STACKS))
    full = all_combos(board)
    keep = np.sort(rng.choice(len(full), size=min(N_COMBOS, len(full)), replace=False))
    combos = [full[i] for i in keep]
    valid = conflict_mask(combos, combos)
    s = FlopVectorizedSolver(board, combos, POT, stack, [FLOP_BET], TURN_BETS, RIVER_BETS, device=device)
    s.solve(ITERATIONS)
    expl = s.exploitability()["exploitability_pot_frac"]

    root = s.root
    open_avg = s._avg(s.flop_ss[root.index], 1).cpu().numpy()      # (n, 2) check/bet
    facing_node = root.children[1]                                  # IP faces the bet
    facing_avg = s._avg(s.flop_ss[facing_node.index], 1).cpu().numpy()  # (n, 3) fold/call/jam
    open_dist = np.zeros((len(combos), N_OUT), dtype=np.float32); open_dist[:, :open_avg.shape[1]] = open_avg
    facing_dist = np.zeros((len(combos), N_OUT), dtype=np.float32); facing_dist[:, :facing_avg.shape[1]] = facing_avg

    eq = flop_equities(board, combos, valid, rng)
    hist = equity_histogram(eq)
    wet, pa, mo, co = board_texture(board)
    pos = float(rng.choice(POSITION_SIGNALS))
    bet = POT * FLOP_BET
    pot_odds = bet / (POT + 2 * bet)
    Xo = flop_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=False, pot_odds=0.0)
    Xf = flop_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=True, pot_odds=pot_odds)
    X = np.concatenate([Xo, Xf], axis=0)
    Y = np.concatenate([open_dist, facing_dist], axis=0)
    return X, Y, float(expl)


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 150
    out = sys.argv[2] if len(sys.argv) > 2 else "artifacts/flop-dataset-v2.npz"
    device = sys.argv[3] if len(sys.argv) > 3 else ("cuda" if torch.cuda.is_available() else "cpu")
    Xs, Ys, expls = [], [], []
    started = time.time()
    for i in range(n):
        X, Y, expl = gen_one(20260901 + i, device)
        Xs.append(X); Ys.append(Y); expls.append(expl)
        if (i + 1) % 5 == 0 or i == n - 1:
            print(f"{i+1}/{n} boards  mean_expl={np.mean(expls)*100:.2f}%  elapsed={time.time()-started:.0f}s", flush=True)
    X = np.concatenate(Xs); Y = np.concatenate(Ys)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    np.savez_compressed(out, X=X, Y=Y, feature_names=np.array(FEATURE_NAMES),
                        action_names=np.array(OPEN_ACTIONS), facing_actions=np.array(FACING_ACTIONS))
    is_f = X[:, FEATURE_INDEX["facing_bet"]] > 0.5
    print(f"DONE X={X.shape} Y={Y.shape} mean_expl={np.mean(expls)*100:.2f}% in {time.time()-started:.0f}s", flush=True)
    print(f"  mean open   {OPEN_ACTIONS}: {np.round(Y[~is_f].mean(0), 3)}")
    print(f"  mean facing {FACING_ACTIONS}: {np.round(Y[is_f].mean(0), 3)}")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
