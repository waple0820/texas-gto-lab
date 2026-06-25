#!/usr/bin/env python3
"""Parallel facing-dataset generation (thread-pinned per worker).

Mirrors parallel_gen.py for the facing dataset: solves many river boards with the
multi-raise tree across CPU workers and saves the merged (features, GTO facing
distribution) dataset.

Run from the repo root:
  python3 scripts/solver/parallel_facing.py 140 10
"""

import os
for _v in ("OMP_NUM_THREADS", "OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    os.environ[_v] = "1"

import sys
import numpy as np
import multiprocessing as mp

sys.path.insert(0, os.path.dirname(__file__))
from gen_facing_dataset import gen_board, FEATURE_NAMES
from multiraise_tree import FACING_LABELS

np.seterr(over="ignore", invalid="ignore", divide="ignore")


def _one(seed):
    return gen_board(seed)


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 140
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    seeds = [20260626 + i for i in range(n)]
    Xs, Ys, done = [], [], 0
    with mp.Pool(workers) as p:
        for res in p.imap_unordered(_one, seeds):
            done += 1
            if res is not None:
                Xs.append(res[0]); Ys.append(res[1])
            if done % 20 == 0 or done == n:
                print(f"{done}/{n} boards", flush=True)
    X = np.concatenate(Xs); Y = np.concatenate(Ys)
    os.makedirs("artifacts", exist_ok=True)
    np.savez_compressed("artifacts/solved-river-facing-dataset.npz", X=X, Y=Y,
                        feature_names=np.array(FEATURE_NAMES), action_names=np.array(FACING_LABELS))
    print("DONE", X.shape, Y.shape, flush=True)
