#!/usr/bin/env python3
"""Combine the open + facing river datasets into the unified training set.

The unified river model (distilled-policy-artifact.js) has 5 outputs read as the
OPEN set when facing_bet=0 and the FACING set when facing_bet=1. Training data is
just the open rows concatenated with the facing rows (both 37 features, 5-wide Y).
The stored action_names are the OPEN set; the facing set is passed to train_distill
via --facing-actions.

Run:
  python3 scripts/solver/combine_river.py \
    artifacts/solved-river-dataset.npz artifacts/solved-river-facing-dataset.npz \
    artifacts/solved-river-combined.npz
"""

from __future__ import annotations

import sys

import numpy as np


def main():
    open_path = sys.argv[1] if len(sys.argv) > 1 else "artifacts/solved-river-dataset.npz"
    facing_path = sys.argv[2] if len(sys.argv) > 2 else "artifacts/solved-river-facing-dataset.npz"
    out = sys.argv[3] if len(sys.argv) > 3 else "artifacts/solved-river-combined.npz"

    do = np.load(open_path, allow_pickle=True)
    df = np.load(facing_path, allow_pickle=True)
    Xo, Yo = do["X"].astype(np.float32), do["Y"].astype(np.float32)
    Xf, Yf = df["X"].astype(np.float32), df["Y"].astype(np.float32)
    assert Xo.shape[1] == Xf.shape[1], "feature width mismatch"
    assert Yo.shape[1] == Yf.shape[1], "action width mismatch"

    X = np.concatenate([Xo, Xf], axis=0)
    Y = np.concatenate([Yo, Yf], axis=0)
    np.savez_compressed(out, X=X, Y=Y,
                        feature_names=do["feature_names"],
                        action_names=do["action_names"])
    print(f"open {Xo.shape} + facing {Xf.shape} -> {X.shape} (ratio 1:{Xf.shape[0]/max(1,Xo.shape[0]):.1f}) wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
