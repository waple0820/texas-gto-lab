#!/usr/bin/env python3
"""Distill solved GTO strategies into an MLP that generalizes to unseen spots.

Trains on the (features -> GTO open distribution) dataset from
gen_solved_dataset.py and exports a JS artifact in the same contract as
src/trained-policy-artifact.js (mlp-softmax path), so the runtime can consume it.

Unlike the existing self-play artifact (trained against a hand-crafted opponent
model), the targets here are exact CFR equilibrium strategies, so the network is
behavior-cloning real GTO. It currently covers the OPEN (no-call) decision; the
exported artifact is versioned distill-open and is consumed for open nodes only.

Run:
  python3 scripts/solver/train_distill.py --data artifacts/solved-river-dataset.npz \
      --out src/distilled-policy-artifact.js
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import numpy as np


def import_torch():
    import torch
    import torch.nn as nn
    return torch, nn


def build_model(nn, n_feat, hidden, n_actions):
    return nn.Sequential(
        nn.Linear(n_feat, hidden), nn.ReLU(),
        nn.Linear(hidden, hidden), nn.ReLU(),
        nn.Linear(hidden, n_actions),
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="artifacts/solved-river-dataset.npz")
    parser.add_argument("--out", default="src/distilled-policy-artifact.js")
    parser.add_argument("--hidden", type=int, default=128)
    parser.add_argument("--epochs", type=int, default=400)
    parser.add_argument("--batch-size", type=int, default=4096)
    parser.add_argument("--lr", type=float, default=2e-3)
    parser.add_argument("--val-frac", type=float, default=0.1)
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--seed", type=int, default=20260626)
    parser.add_argument("--version", default="distill-open-river-v1")
    parser.add_argument("--max-kl", type=float, default=0.06, help="export gate: val KL <= this")
    args = parser.parse_args()

    torch, nn = import_torch()
    device = torch.device(args.device if (args.device != "cuda" or torch.cuda.is_available()) else "cpu")
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)

    data = np.load(args.data, allow_pickle=True)
    X = data["X"].astype(np.float32)
    Y = data["Y"].astype(np.float32)
    feature_names = [str(s) for s in data["feature_names"]]
    action_names = [str(s) for s in data["action_names"]]
    Y = Y / np.clip(Y.sum(axis=1, keepdims=True), 1e-9, None)
    print(f"data X={X.shape} Y={Y.shape} features={len(feature_names)} actions={action_names}")

    rng = np.random.default_rng(args.seed)
    idx = rng.permutation(len(X))
    n_val = max(1, int(len(X) * args.val_frac))
    val_idx, tr_idx = idx[:n_val], idx[n_val:]
    Xt = torch.tensor(X[tr_idx], device=device)
    Yt = torch.tensor(Y[tr_idx], device=device)
    Xv = torch.tensor(X[val_idx], device=device)
    Yv = torch.tensor(Y[val_idx], device=device)

    model = build_model(nn, X.shape[1], args.hidden, Y.shape[1]).to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)

    def kl(pred_logits, target):
        logp = torch.log_softmax(pred_logits, dim=1)
        return (target * (torch.log(target.clamp_min(1e-9)) - logp)).sum(dim=1).mean()

    started = time.time()
    n = len(Xt)
    for epoch in range(1, args.epochs + 1):
        perm = torch.randperm(n, device=device)
        model.train()
        for s in range(0, n, args.batch_size):
            b = perm[s:s + args.batch_size]
            opt.zero_grad(set_to_none=True)
            loss = kl(model(Xt[b]), Yt[b])
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 3.0)
            opt.step()
        if epoch == 1 or epoch % max(1, args.epochs // 8) == 0 or epoch == args.epochs:
            model.eval()
            with torch.no_grad():
                vkl = kl(model(Xv), Yv).item()
                pred = torch.softmax(model(Xv), dim=1).mean(dim=0).cpu().numpy()
            print(f"epoch {epoch:4d} val_kl={vkl:.5f} mean_pred={np.round(pred,3)} "
                  f"mean_tgt={np.round(Yv.mean(dim=0).cpu().numpy(),3)}")

    model.eval()
    with torch.no_grad():
        val_kl = kl(model(Xv), Yv).item()
    passed = val_kl <= args.max_kl

    linears = [m for m in model if m.__class__.__name__ == "Linear"]
    layers = [{
        "weights": [[round(float(v), 6) for v in row] for row in lin.weight.detach().cpu().numpy()],
        "bias": [round(float(v), 6) for v in lin.bias.detach().cpu().numpy()],
    } for lin in linears]

    artifact = {
        "enabled": True, "passed": bool(passed), "version": args.version,
        "trainedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "policyKind": "softmax-distill", "blend": 1.0,
        "appliesTo": "open",
        "featureNames": feature_names,
        "actionSets": {"open": action_names, "facing": ["fold", "call", "raise-small", "raise-big", "jam"]},
        "validation": {"val_kl": round(val_kl, 6), "rows": int(len(X))},
        "model": {"type": "mlp-softmax", "activation": "relu", "layers": layers},
    }
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(f"export const distilledPolicyArtifact = {json.dumps(artifact, separators=(',', ':'))};\n")
    print(f"\nval_kl={val_kl:.5f} passed={passed} -> wrote {out} ({out.stat().st_size/1024:.0f} KB) "
          f"in {time.time()-started:.1f}s")
    return 0 if passed else 1


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
