#!/usr/bin/env python3
"""Turn dataset v2 — FULL-RANGE GPU targets (kills the subsample bias).

The v1 generator (gen_turn_dataset.py) solves each board on an N_COMBOS=80 random
SUBSAMPLE because the numpy TurnSolver is O(combos^2)x46-river. A strategy tuned to
80 combos is much more exploitable against the full range — the deployed turn model
measured ~25% pot deep-SPR despite ~3% targets, the classic subsample-bias gap.

This uses TurnBatchedSolver (GPU, river enumeration batched) which solves the FULL
~1128-combo range to ~2% pot in ~30s, so the targets are true full-range GTO. Same
feature contract + same artifact action sets as v1: the multiraise facing
[fold,call,raise-small,raise-big,jam] is COLLAPSED to [fold,call,raise] (sum the
raises) so the runtime/artifact format is unchanged — only the target QUALITY rises.

Run (one process per GPU):
  CUDA_VISIBLE_DEVICES=0 python3 gen_turn_v2.py 60 artifacts/turn-v2-a.npz 20260801
  CUDA_VISIBLE_DEVICES=1 python3 gen_turn_v2.py 60 artifacts/turn-v2-b.npz 20260901
then merge the npz shards.
"""

from __future__ import annotations

import os

for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ.setdefault(_v, "2")

import sys
import time

import numpy as np
import torch

from river_cfr import all_combos, conflict_mask
from turn_batched import TurnBatchedSolver
from gen_turn_dataset import (
    POT, TURN_BETS, RIVER_BETS, STACKS, OPEN_ACTIONS, FACING_ACTIONS,
    random_turn_board, turn_equities, equity_histogram, board_texture, turn_features,
)
from gen_solved_dataset import FEATURE_NAMES, FEATURE_INDEX, POSITION_SIGNALS

ITERATIONS = 700  # full-range converges to ~2% pot by here (vs v1's 480 on 80 combos)
# Full multiraise facing set (matches the river model + multiraise_tree.FACING_LABELS),
# replacing v1's collapsed [fold,call,raise]. The model's 5 outputs ARE this set in
# the facing context (open uses them as [check,bet-small..bet-over]).
FACING_ACTIONS_5 = ["fold", "call", "raise-small", "raise-big", "jam"]
# Facing action -> fixed output slot. The multiraise tree PRUNES raise options that
# don't fit (big bets / shallow stacks), so a facing node may carry only a subset
# (e.g. [fold,call,jam]); we place each by NAME into the fixed 5-slot vector.
FACING_SLOTS = {"fold": 0, "call": 1, "raise-small": 2, "raise-big": 3, "jam": 4}


def _avg(strat_sum: torch.Tensor) -> np.ndarray:
    tot = strat_sum.sum(dim=1, keepdim=True)
    a = strat_sum.shape[1]
    out = torch.where(tot > 1e-12, strat_sum / tot.clamp_min(1e-12),
                      torch.full_like(strat_sum, 1.0 / a))
    return out.cpu().numpy()


def gen_one(seed, device="cuda"):
    rng = np.random.default_rng(seed)
    board = list(random_turn_board(rng))
    stack = float(rng.choice(STACKS))
    combos = all_combos(board)                       # FULL range, no subsample
    valid = conflict_mask(combos, combos)

    solver = TurnBatchedSolver(board, combos, POT, stack, TURN_BETS, RIVER_BETS, device=device)
    solver.solve(ITERATIONS)
    root = solver.root

    open_avg = _avg(solver.turn_strat_sum[root.index])        # (n, 5) check + 4 bets

    eq = turn_equities(board, combos, valid)
    hist = equity_histogram(eq)
    wet, pa, mo, co = board_texture(board)
    pos = float(rng.choice(POSITION_SIGNALS))

    Xo = turn_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos, facing=False, pot_odds=0.0)
    blocks_X = [Xo]
    blocks_Y = [open_avg.astype(np.float32)]

    # Facing node at every turn bet size (free from one solve). Keep the FULL
    # multiraise facing set [fold, call, raise-small, raise-big, jam] — the same
    # 5-action abstraction the river model uses — so the runtime can pick a sized
    # raise instead of only jam (reviewer #2: better facing action abstraction).
    for i, frac in enumerate(TURN_BETS):
        facing_node = root.children[1 + i]
        f = _avg(solver.turn_strat_sum[facing_node.index])    # (n, A), A = #actions here
        facing5 = np.zeros((len(combos), 5), dtype=np.float32)
        for j, act in enumerate(facing_node.actions):
            slot = FACING_SLOTS.get(act)
            if slot is not None:
                facing5[:, slot] = f[:, j]                    # map by name into fixed slots
        bet = POT * frac
        pot_odds = bet / (POT + 2 * bet)
        blocks_X.append(turn_features(combos, board, eq, hist, wet, pa, mo, co, stack, pos,
                                      facing=True, pot_odds=pot_odds))
        blocks_Y.append(facing5)

    X = np.concatenate(blocks_X, axis=0)
    Y = np.concatenate(blocks_Y, axis=0)
    expl = float(solver.exploitability()["exploitability_pot_frac"])
    return X, Y, expl


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 60
    out = sys.argv[2] if len(sys.argv) > 2 else "artifacts/turn-v2.npz"
    seed0 = int(sys.argv[3]) if len(sys.argv) > 3 else 20260801
    device = "cuda" if torch.cuda.is_available() else "cpu"
    Xs, Ys, expls = [], [], []
    started = time.time()
    for k in range(n):
        X, Y, expl = gen_one(seed0 + k, device)
        Xs.append(X); Ys.append(Y); expls.append(expl)
        if (k + 1) % 5 == 0 or k + 1 == n:
            print(f"{k+1}/{n} boards  mean_expl={np.mean(expls)*100:.2f}% pot  "
                  f"elapsed={time.time()-started:.0f}s", flush=True)
    X = np.concatenate(Xs); Y = np.concatenate(Ys)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    np.savez_compressed(out, X=X, Y=Y, feature_names=np.array(FEATURE_NAMES),
                        action_names=np.array(OPEN_ACTIONS),
                        facing_actions=np.array(FACING_ACTIONS_5))
    is_facing = X[:, FEATURE_INDEX["facing_bet"]] > 0.5
    print(f"DONE X={X.shape} Y={Y.shape} mean_expl={np.mean(expls)*100:.2f}% in {time.time()-started:.0f}s")
    print(f"  mean open   {OPEN_ACTIONS}: {np.round(Y[~is_facing].mean(0), 3)}")
    print(f"  mean facing {FACING_ACTIONS_5}: {np.round(Y[is_facing].mean(0), 3)}")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
