#!/usr/bin/env python3
"""Held-out generalization of the distilled FLOP model on unseen flop boards.

Trains on the flop dataset, then on held-out boards compares the model's
distribution to exact GTO for the open decision (2 actions: check/bet-mid) and
the facing decision (3 actions: fold/call/raise), read from the 3 model outputs.
Mirrors eval_turn.

Run:
  python3 scripts/solver/eval_flop.py --data artifacts/flop-dataset.npz
"""

from __future__ import annotations

import argparse
import os

os.environ.setdefault("OMP_NUM_THREADS", "4")
import sys

import numpy as np
import torch
import torch.nn as nn

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_flop_dataset as gfd


def build_model(n_feat, hidden, n_actions):
    return nn.Sequential(nn.Linear(n_feat, hidden), nn.ReLU(),
                         nn.Linear(hidden, hidden), nn.ReLU(), nn.Linear(hidden, n_actions))


def kl_rows(logits, target):
    logp = torch.log_softmax(logits, dim=1)
    return (target * (torch.log(target.clamp_min(1e-9)) - logp)).sum(dim=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="artifacts/flop-dataset.npz")
    ap.add_argument("--hidden", type=int, default=160)
    ap.add_argument("--epochs", type=int, default=300)
    ap.add_argument("--heldout-boards", type=int, default=8)
    ap.add_argument("--seed", type=int, default=20260626)
    args = ap.parse_args()

    torch.manual_seed(args.seed)
    d = np.load(args.data, allow_pickle=True)
    X = d["X"].astype(np.float32); Y = d["Y"].astype(np.float32)
    Y = Y / np.clip(Y.sum(1, keepdims=True), 1e-9, None)
    Xt, Yt = torch.tensor(X), torch.tensor(Y)
    model = build_model(X.shape[1], args.hidden, Y.shape[1])
    opt = torch.optim.AdamW(model.parameters(), lr=2e-3, weight_decay=1e-4)
    n = len(Xt)
    for ep in range(args.epochs):
        perm = torch.randperm(n)
        for s in range(0, n, 8192):
            b = perm[s:s + 8192]
            opt.zero_grad(set_to_none=True)
            kl_rows(model(Xt[b]), Yt[b]).mean().backward()
            opt.step()
    model.eval()

    fac_idx = gfd.FEATURE_INDEX["facing_bet"]
    n_open = len(gfd.OPEN_ACTIONS)     # 2
    n_facing = len(gfd.FACING_ACTIONS)  # 3

    Hopen_x, Hopen_y, Hfac_x, Hfac_y = [], [], [], []
    for i in range(args.heldout_boards):
        X1, Y1, _ = gfd.gen_one(args.seed + 9_000_000 + i)
        is_fac = X1[:, fac_idx] > 0.5
        Hopen_x.append(X1[~is_fac]); Hopen_y.append(Y1[~is_fac])
        Hfac_x.append(X1[is_fac]); Hfac_y.append(Y1[is_fac])

    def tv(Hx_list, Hy_list, k):
        Hx = torch.tensor(np.concatenate(Hx_list))
        Hy = torch.tensor(np.concatenate(Hy_list).astype(np.float32))[:, :k]
        Hy = Hy / Hy.sum(1, keepdim=True).clamp_min(1e-9)
        with torch.no_grad():
            p = torch.softmax(model(Hx), dim=1)[:, :k]
            p = p / p.sum(1, keepdim=True).clamp_min(1e-9)
        t = (0.5 * (p - Hy).abs().sum(1)).mean().item()
        base = (0.5 * (Hy.mean(0, keepdim=True).expand_as(Hy) - Hy).abs().sum(1)).mean().item()
        return t, base

    print(f"flop model held-out generalization ({args.heldout_boards} unseen boards):")
    for label, (t, base) in (("open", tv(Hopen_x, Hopen_y, n_open)),
                             ("facing", tv(Hfac_x, Hfac_y, n_facing))):
        print(f"  {label:7s} held-out TV={t:.4f}  (mean baseline {base:.4f}, "
              f"{(1-t/base)*100:.0f}% better)")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
