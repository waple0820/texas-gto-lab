#!/usr/bin/env python3
"""Does the distilled GTO policy generalize to UNSEEN boards?

Trains the distillation MLP on the dataset, then solves a set of held-out boards
(never in training) and compares the model's predicted open distribution to the
exact CFR solved distribution. Reports KL and total-variation distance. If the
held-out error is close to the in-sample error, the network generalizes — i.e. it
plays near-GTO on boards it has never seen, the whole point of distillation.

Run:
  python3 scripts/solver/eval_generalization.py --data artifacts/solved-river-dataset.npz
"""

from __future__ import annotations

import argparse
import os

os.environ.setdefault("OMP_NUM_THREADS", "4")
import numpy as np
import torch
import torch.nn as nn

import sys
sys.path.insert(0, os.path.dirname(__file__))
from parallel_gen import gen_one  # solves a board -> (features, GTO open dist)


def build_model(n_feat, hidden, n_actions):
    return nn.Sequential(
        nn.Linear(n_feat, hidden), nn.ReLU(),
        nn.Linear(hidden, hidden), nn.ReLU(),
        nn.Linear(hidden, n_actions),
    )


def kl_rows(pred_logits, target):
    logp = torch.log_softmax(pred_logits, dim=1)
    return (target * (torch.log(target.clamp_min(1e-9)) - logp)).sum(dim=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="artifacts/solved-river-dataset.npz")
    ap.add_argument("--hidden", type=int, default=128)
    ap.add_argument("--epochs", type=int, default=300)
    ap.add_argument("--heldout-boards", type=int, default=12)
    ap.add_argument("--seed", type=int, default=20260626)
    args = ap.parse_args()

    torch.manual_seed(args.seed)
    data = np.load(args.data, allow_pickle=True)
    X = data["X"].astype(np.float32)
    Y = data["Y"].astype(np.float32)
    Y = Y / np.clip(Y.sum(1, keepdims=True), 1e-9, None)

    rng = np.random.default_rng(args.seed)
    idx = rng.permutation(len(X))
    nval = int(len(X) * 0.1)
    vi, ti = idx[:nval], idx[nval:]
    Xt, Yt = torch.tensor(X[ti]), torch.tensor(Y[ti])
    Xv, Yv = torch.tensor(X[vi]), torch.tensor(Y[vi])

    model = build_model(X.shape[1], args.hidden, Y.shape[1])
    opt = torch.optim.AdamW(model.parameters(), lr=2e-3, weight_decay=1e-4)
    n = len(Xt)
    for ep in range(args.epochs):
        perm = torch.randperm(n)
        model.train()
        for s in range(0, n, 4096):
            b = perm[s:s + 4096]
            opt.zero_grad(set_to_none=True)
            loss = kl_rows(model(Xt[b]), Yt[b]).mean()
            loss.backward()
            opt.step()
    model.eval()
    with torch.no_grad():
        insample_kl = kl_rows(model(Xv), Yv).mean().item()

    # held-out BOARDS: seeds far from the training range [seed .. seed+139]
    held_seeds = [args.seed + 5_000_000 + i for i in range(args.heldout_boards)]
    Hx, Hy = [], []
    for sd in held_seeds:
        x, y = gen_one(sd)
        Hx.append(x); Hy.append(y)
    Hx = torch.tensor(np.concatenate(Hx))
    Hy = torch.tensor(np.concatenate(Hy).astype(np.float32))
    Hy = Hy / Hy.sum(1, keepdim=True).clamp_min(1e-9)
    with torch.no_grad():
        pred = torch.softmax(model(Hx), dim=1)
        held_kl = kl_rows(model(Hx), Hy).mean().item()
        held_tv = (0.5 * (pred - Hy).abs().sum(1)).mean().item()
        # baseline: predict the global mean distribution for every combo
        mean_dist = Hy.mean(0, keepdim=True).expand_as(Hy)
        base_tv = (0.5 * (mean_dist - Hy).abs().sum(1)).mean().item()

    print(f"in-sample (held-out rows, same boards)  val_kl = {insample_kl:.4f}")
    print(f"held-out BOARDS ({args.heldout_boards} unseen)       kl = {held_kl:.4f}  "
          f"TV = {held_tv:.4f}")
    print(f"  baseline (predict mean dist)            TV = {base_tv:.4f}")
    print(f"  -> model TV is {(1-held_tv/base_tv)*100:.1f}% better than the mean baseline")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
