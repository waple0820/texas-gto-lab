#!/usr/bin/env python3
"""Generalization of the unified open+facing distilled model on unseen boards.

Trains on the combined dataset, then on held-out boards (never trained on)
compares the model's predicted distribution to exact GTO for BOTH the open
decision and the facing decision. Reports total-variation distance per context.

Run:
  python3 scripts/solver/eval_unified.py --data artifacts/solved-river-combined.npz
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
import gen_solved_dataset as gsd
import gen_facing_dataset as gfd


def build_model(n_feat, hidden, n_actions):
    return nn.Sequential(nn.Linear(n_feat, hidden), nn.ReLU(),
                         nn.Linear(hidden, hidden), nn.ReLU(), nn.Linear(hidden, n_actions))


def kl_rows(logits, target):
    logp = torch.log_softmax(logits, dim=1)
    return (target * (torch.log(target.clamp_min(1e-9)) - logp)).sum(dim=1)


def open_board(seed):
    rng = np.random.default_rng(seed)
    board = list(gsd.random_board(rng))
    combos = gsd.all_combos(board)
    w = np.ones(len(combos))
    ro = gsd.build_range(board, combos, w.copy()); ri = gsd.build_range(board, combos, w.copy())
    s = gsd.RiverSolver(board, ro, ri, 10.0, 20.0, gsd.BET_SIZES)
    s.solve(1200)
    eq = gsd.exact_equities(ro.strength.astype(np.int64), s.valid)
    hist = gsd.equity_histogram(eq)
    wet, pa, mo, co = gsd.board_texture(board)
    X = gsd.build_features(combos, board, eq, hist, wet, pa, mo, co, 10.0, 20.0, 0.3)
    return X.astype(np.float32), s.average_strategy()[0].astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="artifacts/solved-river-combined.npz")
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

    def tv_on(gen_fn, label):
        Hx, Hy = [], []
        for i in range(args.heldout_boards):
            r = gen_fn(args.seed + 5_000_000 + i)
            if r is None:
                continue
            Hx.append(r[0]); Hy.append(r[1])
        Hx = torch.tensor(np.concatenate(Hx)); Hy = torch.tensor(np.concatenate(Hy).astype(np.float32))
        Hy = Hy / Hy.sum(1, keepdim=True).clamp_min(1e-9)
        with torch.no_grad():
            pred = torch.softmax(model(Hx), dim=1)
            tv = (0.5 * (pred - Hy).abs().sum(1)).mean().item()
            base = (0.5 * (Hy.mean(0, keepdim=True).expand_as(Hy) - Hy).abs().sum(1)).mean().item()
        print(f"  {label:7s} held-out TV={tv:.4f}  (mean baseline {base:.4f}, "
              f"{(1-tv/base)*100:.0f}% better)")

    print(f"unified model held-out generalization ({args.heldout_boards} unseen boards):")
    tv_on(open_board, "open")
    tv_on(gfd.gen_board, "facing")
    return 0


if __name__ == "__main__":
    sys.exit(main() or 0)
