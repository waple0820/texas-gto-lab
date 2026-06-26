#!/usr/bin/env python3
"""Generate a (features -> GTO flop strategy) dataset via the three-street flop
solver (flop_mccfr.FlopSolver, turn-sampled / river-exact).

Flop counterpart of gen_turn_dataset.py. Each board is solved ONCE and yields:
  - OPEN  (root, OOP): 5 actions [check, bet-small, bet-mid, bet-big, bet-over]
  - FACING (IP faces a 0.66-pot flop bet): 3 actions [fold, call, raise(all-in)]

The flop is the hardest street (3 streets to run out) and the solver is
Python-recursion-bound (the GPU port gives only ~1.3x — see flop_torch.py), so
generation runs on the host's 32 CPU cores. Targets are mediocre vs the turn
(~6-11% vs 2.6%); draw_strength (backdoors are live on the flop) is the key
feature, as it was for the turn.

Features use the same FEATURE_NAMES contract with street_flop=1. Facing's 3-action
target is padded to 5 ([fold, call, raise, 0, 0]) so one 5-output model covers
both contexts; the runtime reads outputs[0:3] for facing.

Run (parallel, e.g. on the 32-core host):
  python3 scripts/solver/gen_flop_dataset.py 300 30 artifacts/flop-dataset.npz
"""

from __future__ import annotations

import os

for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ[_v] = "1"

import sys
import time
import multiprocessing as mp

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from river_cfr import all_combos, conflict_mask, _combo_key, card_text
from flop_mccfr import FlopSolver
from gen_solved_dataset import (
    FEATURE_NAMES, FEATURE_INDEX, EQUITY_BUCKET_NAMES, MADE_BY_CATEGORY, POSITION_SIGNALS,
    rank_of, board_texture, equity_histogram, made_category, blocker_features,
)
from gen_turn_dataset import draw_strength

np.seterr(over="ignore", invalid="ignore", divide="ignore")

# Single c-bet size keeps the 3-street tree tractable (multi-size flop trees
# converge far too slowly — 66% at 400 iters). The check-vs-bet decision and the
# facing response are the high-value flop choices; c-bet sizing is deferred. The
# model has 3 outputs: open reads [check, bet-mid], facing reads [fold, call, raise].
POT = 6.0
FLOP_BETS = [0.66]
TURN_BETS = [0.66]
RIVER_BETS = [0.75]
FACING_BET_FRAC = 0.66
N_COMBOS = 60
ITERATIONS = 4000
STACKS = [10.0, 12.0, 15.0]
EQUITY_RUNOUTS = 150       # sampled turn+river runouts for the all-in equity feature

OPEN_ACTIONS = ["check", "bet-mid"]
FACING_ACTIONS = ["fold", "call", "raise"]
N_OUT = 3                  # model width = max(len(open), len(facing))


def random_flop_board(rng):
    return tuple(int(c) for c in rng.choice(52, size=3, replace=False))


def flop_equities(flop, combos, valid, rng, n_runouts=EQUITY_RUNOUTS):
    """All-in equity per combo over sampled turn+river runouts (win + 0.5 tie),
    with card-removal — matches the engine's MC flop equity in expectation."""
    ca = np.array(combos)
    n = len(combos)
    deck = [c for c in range(52) if c not in set(flop)]
    num = np.zeros(n)
    den = np.zeros(n)
    for _ in range(n_runouts):
        t, r = (int(x) for x in rng.choice(deck, size=2, replace=False))
        board5 = tuple(flop) + (t, r)
        st = np.array([_combo_key(tuple(c), board5) for c in combos], dtype=np.int64)
        nc = (~((ca[:, 0] == t) | (ca[:, 1] == t) | (ca[:, 0] == r) | (ca[:, 1] == r))).astype(np.float64)
        w = valid * np.outer(nc, nc)
        gt = (st[:, None] > st[None, :]).astype(np.float64)
        eq = (st[:, None] == st[None, :]).astype(np.float64)
        num += (w * (gt + 0.5 * eq)).sum(axis=1)
        den += w.sum(axis=1)
    return num / np.maximum(den, 1e-9)


def flop_features(combos, board, equities, hist, wet, paired, mono, conn, stack,
                  pos_signal, facing, pot_odds):
    """Mirror gen_turn_dataset.turn_features but street_flop=1."""
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


def gen_one(seed):
    rng = np.random.default_rng(seed)
    board = list(random_flop_board(rng))
    stack = float(rng.choice(STACKS))
    full = all_combos(board)
    keep = np.sort(rng.choice(len(full), size=min(N_COMBOS, len(full)), replace=False))
    combos = [full[i] for i in keep]
    valid = conflict_mask(combos, combos)
    reach = np.ones(len(combos))
    solver = FlopSolver(board, combos, reach.copy(), POT, stack, FLOP_BETS, TURN_BETS, RIVER_BETS, seed=seed)
    res = solver.solve(ITERATIONS, expl_every=0)

    avg_open = solver._avg((solver.root.index,), len(solver.root.actions))  # [n, 2] check/bet
    facing_node = solver.root.children[1 + FLOP_BETS.index(FACING_BET_FRAC)]  # ip_after_bet(0.66)
    avg_face = solver._avg((facing_node.index,), len(facing_node.actions))   # [n, 3] fold/call/raise
    open_dist = np.zeros((len(combos), N_OUT), dtype=np.float32)
    open_dist[:, :avg_open.shape[1]] = avg_open                              # [check, bet-mid, 0]
    facing_dist = np.zeros((len(combos), N_OUT), dtype=np.float32)
    facing_dist[:, :avg_face.shape[1]] = avg_face                            # [fold, call, raise]

    eq = flop_equities(board, combos, valid, rng)
    hist = equity_histogram(eq)
    wet, pa, mo, co = board_texture(board)
    pos = float(rng.choice(POSITION_SIGNALS))
    bet = POT * FACING_BET_FRAC
    pot_odds = bet / (POT + 2 * bet)

    Xo = flop_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=False, pot_odds=0.0)
    Xf = flop_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=True, pot_odds=pot_odds)
    X = np.concatenate([Xo, Xf], axis=0)
    Y = np.concatenate([open_dist, facing_dist], axis=0)
    return X, Y, float(res["final"]["exploitability_pot_frac"])


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else max(1, (os.cpu_count() or 4) - 2)
    out = sys.argv[3] if len(sys.argv) > 3 else "artifacts/flop-dataset.npz"
    seeds = [20260801 + i for i in range(n)]
    Xs, Ys, expls, done = [], [], [], 0
    started = time.time()
    with mp.Pool(workers) as p:
        for X, Y, expl in p.imap_unordered(gen_one, seeds):
            Xs.append(X); Ys.append(Y); expls.append(expl); done += 1
            if done % 10 == 0 or done == n:
                print(f"{done}/{n} boards  mean_expl={np.mean(expls)*100:.2f}% pot  "
                      f"elapsed={time.time()-started:.0f}s", flush=True)
    X = np.concatenate(Xs); Y = np.concatenate(Ys)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    np.savez_compressed(out, X=X, Y=Y, feature_names=np.array(FEATURE_NAMES),
                        action_names=np.array(OPEN_ACTIONS),
                        facing_actions=np.array(FACING_ACTIONS))
    is_facing = X[:, FEATURE_INDEX["facing_bet"]] > 0.5
    print(f"DONE X={X.shape} Y={Y.shape} mean_expl={np.mean(expls)*100:.2f}% in {time.time()-started:.0f}s")
    print(f"  mean open   {OPEN_ACTIONS}: {np.round(Y[~is_facing].mean(0), 3)}")
    print(f"  mean facing {FACING_ACTIONS}+pad: {np.round(Y[is_facing].mean(0), 3)}")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
