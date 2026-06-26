#!/usr/bin/env python3
"""Generate a (features -> GTO turn strategy) dataset via the exact enumerated
two-street turn solver (turn_cfr.TurnSolver).

The river distillation (gen_solved_dataset / gen_facing_dataset) covers the river;
this is its turn counterpart. Each board is solved ONCE and yields both contexts:
  - OPEN  (root, OOP to act): 5 actions [check, bet-small, bet-mid, bet-big, bet-over]
  - FACING (IP faces a 0.66-pot turn bet): 3 actions [fold, call, raise(all-in)]

Targets come from the enumerated solver (river fully enumerated, no sampling), so
they are river-quality (~3-4% exploitability at ~450 iters), unlike the sampled
turn solver (~12% variance floor).

Tractability: turn CFR is O(combos^2) with 46-way river enumeration per node, so
the full ~1128-combo range is infeasible (~1 hr/board). We solve a REPRESENTATIVE
uniform-random subsample of combos (unbiased, so dataset all-in equities match the
engine's full-range runtime equities in expectation) and randomize the stack per
board for SPR variety. Features use the same FEATURE_NAMES contract as the river
datasets, with street_turn=1.

Facing has only 3 real actions; its target is padded to 5 as [fold, call, raise, 0, 0]
so a single 5-output model covers both contexts (the facing flag distinguishes them,
exactly as the river unified model). The runtime reads outputs[0:3] for turn facing.

Run (parallel):
  python3 scripts/solver/gen_turn_dataset.py 300 28 artifacts/turn-dataset.npz
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

from river_cfr import all_combos, conflict_mask, build_range, _combo_key, card_text
from turn_cfr import TurnSolver
from gen_solved_dataset import (
    FEATURE_NAMES, FEATURE_INDEX, EQUITY_BUCKET_NAMES, MADE_BY_CATEGORY, POSITION_SIGNALS,
    rank_of, board_texture, equity_histogram, made_category, blocker_features,
)

np.seterr(over="ignore", invalid="ignore", divide="ignore")

POT = 10.0
TURN_BETS = [0.33, 0.66, 1.0, 1.5]
RIVER_BETS = [0.75]
FACING_BET_FRAC = 0.66          # the facing node we record (IP faces a 0.66-pot bet)
N_COMBOS = 80                   # uniform-random subsample per board (tractable, ~3-4% expl)
ITERATIONS = 480
STACKS = [20.0, 30.0, 40.0, 60.0]

OPEN_ACTIONS = ["check", "bet-small", "bet-mid", "bet-big", "bet-over"]
FACING_ACTIONS = ["fold", "call", "raise"]


def random_turn_board(rng):
    return tuple(int(c) for c in rng.choice(52, size=4, replace=False))


def turn_equities(board, combos, valid):
    """Exact all-in runout equity per combo: average over all river cards of the
    (win + 0.5*tie) fraction vs the field, with card-removal both ways."""
    ca = np.array(combos)
    n = len(combos)
    deck = [c for c in range(52) if c not in set(board)]
    num = np.zeros(n)
    den = np.zeros(n)
    for r in deck:
        b5 = tuple(board) + (r,)
        st = np.array([_combo_key(tuple(c), b5) for c in combos], dtype=np.int64)
        nc = (~((ca[:, 0] == r) | (ca[:, 1] == r))).astype(np.float64)
        w = valid * np.outer(nc, nc)
        gt = (st[:, None] > st[None, :]).astype(np.float64)
        eq = (st[:, None] == st[None, :]).astype(np.float64)
        num += (w * (gt + 0.5 * eq)).sum(axis=1)
        den += w.sum(axis=1)
    return num / np.maximum(den, 1e-9)


def draw_strength(combo, board):
    """Reproduce poker-core.analyzeDraws + trained-policy-runtime.drawStrength
    exactly (card c: suit=c//13, rank=c%13+2). Turn draws are live and drive
    open betting (semi-bluff draws / value+protection made hands), so the turn
    open model needs this signal that raw equity doesn't separate."""
    cards = list(combo) + list(board)
    suit_counts = {}
    for c in cards:
        suit_counts[c // 13] = suit_counts.get(c // 13, 0) + 1
    max_suit = max(suit_counts.values()) if suit_counts else 0
    vals = sorted({(c % 13) + 2 for c in cards})
    if 14 in vals:
        vals = [1] + vals
    valset = set(vals)
    straight_draw = False
    open_ended = False
    for low in range(1, 11):
        window = [low, low + 1, low + 2, low + 3, low + 4]
        hits = [r for r in window if r in valset]
        if len(hits) >= 4:
            straight_draw = True
            missing = next((r for r in window if r not in valset), None)
            if missing == low or missing == low + 4:
                open_ended = True
    board_high = max((c % 13) + 2 for c in board) if board else 0
    overcards = sum(1 for c in combo if (c % 13) + 2 > board_high)
    flush_draw = len(board) >= 3 and max_suit == 4
    backdoor_flush = len(board) == 3 and max_suit == 3
    ds = ((0.13 if flush_draw else 0.0)
          + (0.11 if open_ended else 0.0)
          + (0.07 if (straight_draw and not open_ended) else 0.0)
          + (0.035 if backdoor_flush else 0.0)
          + min(0.08, overcards * 0.036))
    return float(np.clip(ds, 0.0, 0.28))


def turn_features(combos, board, equities, hist, wet, paired, mono, conn, stack,
                  pos_signal, facing, pot_odds):
    """Mirror gen_solved_dataset.build_features but with street_turn=1 and a
    facing/open context toggle (matching gfd.facing_features for facing)."""
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
        row[FEATURE_INDEX["street_turn"]] = 1.0
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
    board = list(random_turn_board(rng))
    stack = float(rng.choice(STACKS))
    full = all_combos(board)
    keep = np.sort(rng.choice(len(full), size=min(N_COMBOS, len(full)), replace=False))
    combos = [full[i] for i in keep]
    valid = conflict_mask(combos, combos)
    reach = np.ones(len(combos))
    ro = build_range(board, combos, reach.copy())
    ri = build_range(board, combos, reach.copy())
    solver = TurnSolver(board, combos, ro.reach.copy(), ri.reach.copy(), POT, stack, TURN_BETS, RIVER_BETS)
    res = solver.solve(ITERATIONS, log_every=0)
    avg = solver.average_strategy()

    open_dist = avg[solver.root.index]                      # [n, 5]
    facing_node = solver.root.children[1 + TURN_BETS.index(FACING_BET_FRAC)]  # ip_after_bet(0.66)
    facing_raw = avg[facing_node.index]                     # [n, 3] = fold/call/raise
    facing_dist = np.zeros((len(combos), 5), dtype=np.float32)
    facing_dist[:, :3] = facing_raw                         # pad to 5: [fold, call, raise, 0, 0]

    eq = turn_equities(board, combos, valid)
    hist = equity_histogram(eq)
    wet, pa, mo, co = board_texture(board)
    pos = float(rng.choice(POSITION_SIGNALS))
    bet = POT * FACING_BET_FRAC
    pot_odds = bet / (POT + 2 * bet)

    Xo = turn_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=False, pot_odds=0.0)
    Xf = turn_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=True, pot_odds=pot_odds)
    X = np.concatenate([Xo, Xf], axis=0)
    Y = np.concatenate([open_dist.astype(np.float32), facing_dist], axis=0)
    return X, Y, float(res["final"]["exploitability_pot_frac"])


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else max(1, (os.cpu_count() or 4) - 2)
    out = sys.argv[3] if len(sys.argv) > 3 else "artifacts/turn-dataset.npz"
    seeds = [20260701 + i for i in range(n)]
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
    print(f"  mean open dist   {OPEN_ACTIONS}: {np.round(Y[~is_facing].mean(0), 3)}")
    print(f"  mean facing dist {FACING_ACTIONS}+pad: {np.round(Y[is_facing].mean(0), 3)}")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
