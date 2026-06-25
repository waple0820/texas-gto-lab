#!/usr/bin/env python3
"""Train and export a lightweight postflop policy artifact.

This is not a full no-limit Hold'em tree solver. It distills a range-role
postflop target into a tiny neural policy that can run inside the existing
browser/server strategy engine on a 2G2C machine.
"""

from __future__ import annotations

import argparse
import json
import math
import time
from dataclasses import dataclass
from pathlib import Path

import numpy as np


FEATURE_NAMES = [
    "equity",
    "pot_odds",
    "spr_norm",
    "street_flop",
    "street_turn",
    "street_river",
    "position_signal",
    "to_call_flag",
    "made_strength",
    "draw_strength",
    "wetness",
    "paired",
    "monotone",
    "connected",
    "range_advantage",
    "blockers",
    "range_percentile",
    "range_weight",
    "range_coverage",
    "context_aggressor",
    "three_bet",
    "facing_bet",
    "free_check",
]

OPEN_ACTIONS = ["check", "bet-small", "bet-mid", "bet-big", "bet-over"]
FACING_ACTIONS = ["fold", "call", "raise-small", "raise-big", "jam"]
ACTION_COUNT = 5


@dataclass
class Gate:
    name: str
    passed: bool
    value: float
    threshold: str


def clamp(values, low, high):
    return np.clip(values, low, high)


def normalize(rows):
    rows = np.maximum(rows, 0.0001)
    return rows / rows.sum(axis=1, keepdims=True)


def target_policy(x: np.ndarray) -> np.ndarray:
    f = {name: x[:, index] for index, name in enumerate(FEATURE_NAMES)}
    facing = f["to_call_flag"] > 0.5
    target = np.zeros((x.shape[0], ACTION_COUNT), dtype=np.float32)

    equity = f["equity"]
    pot_odds = f["pot_odds"]
    spr = f["spr_norm"]
    made = f["made_strength"]
    draw = f["draw_strength"]
    wet = f["wetness"]
    adv = f["range_advantage"]
    blockers = f["blockers"]
    percentile = f["range_percentile"]
    position = f["position_signal"]
    paired = f["paired"]
    monotone = f["monotone"]
    connected = f["connected"]
    aggressor = f["context_aggressor"]
    three_bet = f["three_bet"]

    open_rows = ~facing
    if open_rows.any():
        low_showdown = (equity < 0.42) & (made < 0.18)
        range_target = clamp(
            0.34
            + adv * 0.36
            + aggressor * 0.08
            + three_bet * 0.08
            + (position - 0.5) * 0.08
            + paired * 0.035
            - connected * 0.06
            - monotone * 0.08
            + (wet < 0.22) * 0.055
            - (wet > 0.52) * 0.08,
            0.18,
            0.78,
        )
        value = clamp((equity - 0.48) * 1.25 + made * 0.34 + np.maximum(0, percentile - 0.62) * 0.18, 0, 0.86)
        bluff = clamp(
            draw * 1.18
            + blockers * 0.95
            + np.maximum(0, adv - 0.48) * np.where(low_showdown, 0.58, 0.24)
            + range_target * np.where(low_showdown, 0.22, 0.08)
            + aggressor * 0.035
            + (position - 0.5) * 0.06
            + wet * 0.035,
            0.02,
            0.46,
        )
        protection = clamp(np.where((made > 0) & (equity < 0.55), 0.07 + range_target * 0.1, 0), 0, 0.2)
        big_seed = clamp((equity - 0.63) * 1.05 + made * 0.16 + draw * 0.45 + np.maximum(0, blockers - 0.08) * 0.8 + wet * 0.055, 0.015, 0.5)
        over = clamp(
            f["street_turn"] * ((equity - 0.76) * 0.35 + np.maximum(0, made - 0.62) * 0.28)
            + f["street_river"] * ((equity - 0.7) * 0.78 + np.maximum(0, made - 0.62) * 0.72 + np.maximum(0, adv - 0.62) * 0.44),
            0.002,
            0.32,
        )
        remaining = clamp(range_target * 0.34 + value * 0.52 + bluff * 0.82 + protection - over * 0.66, 0.035, 0.9)
        mid_share = clamp(0.27 + wet * 0.34 + f["street_turn"] * 0.08, 0.22, 0.62)
        big_share = clamp(0.15 + big_seed * 0.72 + f["street_river"] * 0.08, 0.08, 0.5)
        small = clamp(remaining * (1 - mid_share) - big_seed * 0.18, 0.025, 0.72)
        mid = clamp(remaining * mid_share, 0.02, 0.56)
        big = clamp(big_seed * 0.52 + remaining * big_share, 0.015, 0.48)
        check = clamp(1 - small - mid - big - over, 0.04, 0.92)
        open_target = normalize(np.stack([check, small, mid, big, over], axis=1))
        target[open_rows] = open_target[open_rows]

    if facing.any():
        edge = equity - pot_odds
        blocker_bluff = clamp((blockers + np.maximum(0, adv - 0.5) * 0.34) * (1 - made * 0.75), 0, 0.18)
        catcher = clamp((percentile - 0.42) * 0.18 + (made >= 0.12) * 0.08, 0, 0.18)
        pressure = f["three_bet"] * 0.07 + (wet > 0.52) * 0.03
        raise_ = clamp((equity - 0.57) * 1.25 + draw * 1.05 + blocker_bluff + made * 0.24 + (position - 0.5) * 0.06, 0.015, 0.72)
        call = clamp((edge + 0.16 - pressure) * 1.35 + catcher + made * 0.1 + draw * 0.32, 0.035, 0.9)
        fold = clamp(1 - call - raise_, 0.02, 0.92)
        weak_no_draw = (equity < pot_odds - 0.08) & (draw < 0.045)
        fold = np.where(weak_no_draw, fold + 0.18, fold)
        raise_ = np.where(weak_no_draw, raise_ * np.where(blockers > 0.07, 0.82, 0.55), raise_)
        low_spr_pressure = (spr < 0.13) & (equity > 0.52)
        raise_ = np.where(low_spr_pressure, raise_ + 0.18, raise_)
        call = np.where(low_spr_pressure, call - 0.08, call)
        jam = clamp((spr < 0.13) * 0.08 + (equity - 0.68) * 0.7 + np.maximum(0, made - 0.62) * 0.55, 0.002, 0.36)
        big_raise = clamp(raise_ * (0.28 + draw * 0.75 + np.maximum(0, made - 0.32) * 0.45), 0.006, 0.44)
        small_raise = clamp(raise_ - big_raise * 0.72 - jam * 0.5, 0.008, 0.62)
        facing_target = normalize(np.stack([fold, call, small_raise, big_raise, jam], axis=1))
        target[facing] = facing_target[facing]

    return target


def generate_samples(count: int, seed: int) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    x = np.zeros((count, len(FEATURE_NAMES)), dtype=np.float32)

    street = rng.integers(0, 3, size=count)
    x[:, FEATURE_NAMES.index("street_flop")] = street == 0
    x[:, FEATURE_NAMES.index("street_turn")] = street == 1
    x[:, FEATURE_NAMES.index("street_river")] = street == 2

    facing = rng.random(count) < 0.38
    x[:, FEATURE_NAMES.index("to_call_flag")] = facing
    x[:, FEATURE_NAMES.index("facing_bet")] = facing
    x[:, FEATURE_NAMES.index("pot_odds")] = np.where(facing, rng.uniform(0.18, 0.46, size=count), 0)
    x[:, FEATURE_NAMES.index("spr_norm")] = rng.beta(2.0, 3.0, size=count)
    x[:, FEATURE_NAMES.index("position_signal")] = rng.choice([0.22, 0.36, 0.58, 0.76, 0.34, 0.3], size=count)
    x[:, FEATURE_NAMES.index("context_aggressor")] = rng.random(count) < 0.68
    x[:, FEATURE_NAMES.index("three_bet")] = rng.random(count) < 0.18
    x[:, FEATURE_NAMES.index("free_check")] = (~facing) & (rng.random(count) < 0.08)

    made_values = np.array([0, 0.12, 0.32, 0.48, 0.62, 0.68, 0.78], dtype=np.float32)
    made_probs = np.array([0.39, 0.34, 0.12, 0.07, 0.035, 0.03, 0.015])
    made = rng.choice(made_values, p=made_probs / made_probs.sum(), size=count)
    draw = rng.choice([0, 0.035, 0.07, 0.11, 0.13, 0.2], p=[0.48, 0.18, 0.13, 0.1, 0.08, 0.03], size=count)
    wet = rng.beta(1.6, 2.2, size=count)
    paired = rng.random(count) < 0.18
    monotone = rng.random(count) < 0.08
    connected = rng.random(count) < (0.22 + wet * 0.36)
    adv = clamp(0.46 + x[:, FEATURE_NAMES.index("context_aggressor")] * 0.1 + x[:, FEATURE_NAMES.index("three_bet")] * 0.08 - wet * 0.12 + rng.normal(0, 0.075, size=count), 0.24, 0.78)
    blockers = clamp(rng.beta(1.2, 7.5, size=count) * 0.26 + (rng.random(count) < 0.12) * rng.uniform(0.04, 0.11, size=count), 0, 0.24)
    percentile = clamp(rng.beta(1.25, 1.45, size=count), 0, 1)
    range_weight = clamp(rng.beta(1.7, 1.3, size=count), 0, 1)
    coverage = clamp(rng.normal(0.58, 0.18, size=count), 0.08, 1)
    equity = clamp(0.12 + made * 0.62 + draw * 1.45 + percentile * 0.2 + adv * 0.1 - wet * 0.06 + rng.normal(0, 0.105, size=count), 0.015, 0.96)

    x[:, FEATURE_NAMES.index("equity")] = equity
    x[:, FEATURE_NAMES.index("made_strength")] = made
    x[:, FEATURE_NAMES.index("draw_strength")] = draw
    x[:, FEATURE_NAMES.index("wetness")] = wet
    x[:, FEATURE_NAMES.index("paired")] = paired
    x[:, FEATURE_NAMES.index("monotone")] = monotone
    x[:, FEATURE_NAMES.index("connected")] = connected
    x[:, FEATURE_NAMES.index("range_advantage")] = adv
    x[:, FEATURE_NAMES.index("blockers")] = blockers
    x[:, FEATURE_NAMES.index("range_percentile")] = percentile
    x[:, FEATURE_NAMES.index("range_weight")] = range_weight
    x[:, FEATURE_NAMES.index("range_coverage")] = coverage
    return x, target_policy(x)


def gate_rows() -> dict[str, np.ndarray]:
    def row(**values):
        data = {name: 0.0 for name in FEATURE_NAMES}
        data.update(values)
        return np.array([data[name] for name in FEATURE_NAMES], dtype=np.float32)

    return {
        "dry_blocker_bluff_bets": row(
            equity=0.35,
            spr_norm=0.78,
            street_flop=1,
            position_signal=0.76,
            made_strength=0,
            draw_strength=0.02,
            wetness=0.1,
            range_advantage=0.67,
            blockers=0.1,
            range_percentile=0.37,
            range_weight=0.2,
            range_coverage=0.76,
            context_aggressor=1,
        ),
        "wet_air_checks": row(
            equity=0.08,
            spr_norm=0.78,
            street_flop=1,
            position_signal=0.76,
            wetness=0.68,
            connected=1,
            range_advantage=0.5,
            context_aggressor=1,
        ),
        "flush_draw_raises_vs_bet": row(
            equity=0.65,
            pot_odds=0.33,
            spr_norm=0.6,
            street_flop=1,
            position_signal=0.76,
            to_call_flag=1,
            draw_strength=0.13,
            wetness=0.24,
            range_advantage=0.59,
            blockers=0.09,
            range_percentile=0.83,
            range_weight=0.8,
            range_coverage=0.69,
            facing_bet=1,
        ),
        "value_bets": row(
            equity=0.74,
            spr_norm=0.55,
            street_turn=1,
            position_signal=0.76,
            made_strength=0.48,
            wetness=0.34,
            range_advantage=0.58,
            range_percentile=0.9,
            range_weight=1,
            range_coverage=0.5,
            context_aggressor=1,
        ),
        "river_nut_overbets": row(
            equity=0.86,
            spr_norm=0.45,
            street_river=1,
            position_signal=0.76,
            made_strength=0.78,
            wetness=0.18,
            range_advantage=0.72,
            range_percentile=0.96,
            range_weight=1,
            range_coverage=0.38,
            context_aggressor=1,
        ),
    }


def import_torch():
    try:
        import torch
        import torch.nn as nn
        import torch.nn.functional as functional
    except Exception as exc:  # pragma: no cover - exercised on training hosts
        raise SystemExit("PyTorch is required. Install it in the training venv before running this script.") from exc
    return torch, nn, functional


def build_model(nn, hidden: int):
    return nn.Sequential(
        nn.Linear(len(FEATURE_NAMES), hidden),
        nn.ReLU(),
        nn.Linear(hidden, hidden),
        nn.ReLU(),
        nn.Linear(hidden, ACTION_COUNT),
    )


def evaluate_model(torch, functional, model, x_val, y_val):
    model.eval()
    with torch.no_grad():
        logits = model(torch.from_numpy(x_val).to(next(model.parameters()).device))
        target = torch.from_numpy(y_val).to(logits.device)
        probs = torch.softmax(logits, dim=1)
        kl = functional.kl_div(torch.log(probs + 1e-8), target, reduction="batchmean").item()
        mae = torch.mean(torch.abs(probs - target)).item()
        norm_error = torch.max(torch.abs(probs.sum(dim=1) - 1)).item()
    return {"kl": kl, "mae": mae, "norm_error": norm_error}


def predict_rows(torch, model, rows: dict[str, np.ndarray]) -> dict[str, list[float]]:
    device = next(model.parameters()).device
    names = list(rows.keys())
    data = np.stack([rows[name] for name in names])
    model.eval()
    with torch.no_grad():
        probs = torch.softmax(model(torch.from_numpy(data).to(device)), dim=1).detach().cpu().numpy()
    return {name: [float(value) for value in probs[index]] for index, name in enumerate(names)}


def run_gates(validation: dict, behavior: dict[str, list[float]], max_kl: float, max_mae: float) -> list[Gate]:
    gates = [
        Gate("validation_kl", validation["kl"] <= max_kl, validation["kl"], f"<= {max_kl}"),
        Gate("validation_mae", validation["mae"] <= max_mae, validation["mae"], f"<= {max_mae}"),
        Gate("normalization", validation["norm_error"] <= 1e-5, validation["norm_error"], "<= 1e-5"),
    ]
    dry = behavior["dry_blocker_bluff_bets"]
    wet = behavior["wet_air_checks"]
    draw = behavior["flush_draw_raises_vs_bet"]
    value = behavior["value_bets"]
    river_nuts = behavior["river_nut_overbets"]
    gates.extend(
        [
            Gate("dry_blocker_bluff_bet_total", sum(dry[1:]) >= 0.42, sum(dry[1:]), ">= 0.42"),
            Gate("wet_air_check", wet[0] >= 0.5, wet[0], ">= 0.50"),
            Gate("wet_air_bet_cap", sum(wet[1:]) <= 0.5, sum(wet[1:]), "<= 0.50"),
            Gate("flush_draw_raise_vs_bet", sum(draw[2:]) >= 0.18, sum(draw[2:]), ">= 0.18"),
            Gate("flush_draw_fold_cap", draw[0] <= 0.2, draw[0], "<= 0.20"),
            Gate("value_bet_total", sum(value[1:]) >= 0.62, sum(value[1:]), ">= 0.62"),
            Gate("value_big_plus_over", value[3] + value[4] >= 0.14, value[3] + value[4], ">= 0.14"),
            Gate("river_nut_overbet", river_nuts[4] >= 0.18, river_nuts[4], ">= 0.18"),
        ]
    )
    return gates


def rounded_matrix(array):
    return [[round(float(value), 6) for value in row] for row in array]


def export_artifact(model, args, validation, behavior, gates, train_seconds, out_path: Path):
    base_model = model.module if hasattr(model, "module") else model
    linear_layers = [layer for layer in base_model if layer.__class__.__name__ == "Linear"]
    layers = []
    for layer in linear_layers:
        layers.append(
            {
                "weights": rounded_matrix(layer.weight.detach().cpu().numpy()),
                "bias": [round(float(value), 6) for value in layer.bias.detach().cpu().numpy()],
            }
        )

    artifact = {
        "enabled": True,
        "passed": all(gate.passed for gate in gates),
        "version": args.version,
        "artifactId": f"{args.version}-{int(time.time())}",
        "trainedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "training": {
            "samples": args.samples,
            "validationSamples": args.validation_samples,
            "epochs": args.epochs,
            "batchSize": args.batch_size,
            "hidden": args.hidden,
            "seed": args.seed,
            "seconds": round(train_seconds, 2),
            "device": args.device,
        },
        "featureNames": FEATURE_NAMES,
        "actionSets": {
            "open": OPEN_ACTIONS,
            "facing": FACING_ACTIONS,
        },
        "blend": args.blend,
        "validation": {key: round(float(value), 6) for key, value in validation.items()},
        "behavior": {key: [round(float(value), 6) for value in values] for key, values in behavior.items()},
        "standards": [
            {"name": gate.name, "passed": gate.passed, "value": round(float(gate.value), 6), "threshold": gate.threshold}
            for gate in gates
        ],
        "model": {
            "type": "mlp-softmax",
            "activation": "relu",
            "layers": layers,
        },
    }
    if not artifact["passed"]:
        raise SystemExit("Training standards failed; refusing to export artifact.")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(artifact, ensure_ascii=False, separators=(",", ":"))
    out_path.write_text(f"export const trainedPolicyArtifact = {payload};\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=420_000)
    parser.add_argument("--validation-samples", type=int, default=80_000)
    parser.add_argument("--epochs", type=int, default=6)
    parser.add_argument("--batch-size", type=int, default=4096)
    parser.add_argument("--hidden", type=int, default=48)
    parser.add_argument("--seed", type=int, default=20260625)
    parser.add_argument("--lr", type=float, default=0.0025)
    parser.add_argument("--blend", type=float, default=0.72)
    parser.add_argument("--max-kl", type=float, default=0.012)
    parser.add_argument("--max-mae", type=float, default=0.028)
    parser.add_argument("--device", default="cuda")
    parser.add_argument("--version", default="postflop-size-aware-mlp-v2")
    parser.add_argument("--out", default="src/trained-policy-artifact.js")
    args = parser.parse_args()

    torch, nn, functional = import_torch()
    if args.device == "cuda" and not torch.cuda.is_available():
        args.device = "cpu"
    device = torch.device(args.device)
    print(f"device={device} cuda_devices={torch.cuda.device_count() if torch.cuda.is_available() else 0}")

    x_train, y_train = generate_samples(args.samples, args.seed)
    x_val, y_val = generate_samples(args.validation_samples, args.seed + 1)

    model = build_model(nn, args.hidden).to(device)
    if device.type == "cuda" and torch.cuda.device_count() > 1:
        model = nn.DataParallel(model)

    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    dataset = torch.utils.data.TensorDataset(torch.from_numpy(x_train), torch.from_numpy(y_train))
    loader = torch.utils.data.DataLoader(dataset, batch_size=args.batch_size, shuffle=True, num_workers=2, pin_memory=device.type == "cuda")

    started = time.time()
    for epoch in range(args.epochs):
        model.train()
        total = 0.0
        batches = 0
        for xb, yb in loader:
            xb = xb.to(device, non_blocking=True)
            yb = yb.to(device, non_blocking=True)
            optimizer.zero_grad(set_to_none=True)
            logits = model(xb)
            loss = functional.kl_div(functional.log_softmax(logits, dim=1), yb, reduction="batchmean")
            loss.backward()
            optimizer.step()
            total += loss.item()
            batches += 1
        validation = evaluate_model(torch, functional, model, x_val, y_val)
        print(f"epoch={epoch + 1} train_kl={total / max(1, batches):.6f} val_kl={validation['kl']:.6f} val_mae={validation['mae']:.6f}")

    validation = evaluate_model(torch, functional, model, x_val, y_val)
    behavior = predict_rows(torch, model, gate_rows())
    gates = run_gates(validation, behavior, args.max_kl, args.max_mae)
    for gate in gates:
        print(f"gate {gate.name}: value={gate.value:.6f} threshold={gate.threshold} passed={gate.passed}")
    export_artifact(model, args, validation, behavior, gates, time.time() - started, Path(args.out))
    print(f"exported {args.out}")


if __name__ == "__main__":
    main()
