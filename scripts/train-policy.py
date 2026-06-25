#!/usr/bin/env python3
"""Train a compact postflop regret policy through abstract self-play.

This trainer intentionally does not use a hand-written target policy. It samples
abstract heads-up no-limit decision states, lets the current policy play both
sides of a small betting tree, computes counterfactual action regrets, and trains
the same small MLP architecture to predict those regrets. Runtime strategy is
then produced with regret matching.
"""

from __future__ import annotations

import argparse
import json
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
FEATURE_INDEX = {name: index for index, name in enumerate(FEATURE_NAMES)}


@dataclass
class Gate:
    name: str
    passed: bool
    value: float
    threshold: str


def clamp_np(values, low, high):
    return np.clip(values, low, high)


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


def regret_match_np(regrets: np.ndarray) -> np.ndarray:
    positive = np.maximum(regrets, 0)
    total = positive.sum(axis=1, keepdims=True)
    uniform = np.full_like(positive, 1 / positive.shape[1])
    return np.where(total > 1e-8, positive / np.maximum(total, 1e-8), uniform)


def sample_states(count: int, seed: int) -> np.ndarray:
    """Sample abstract postflop states. Labels come only from self-play later."""
    rng = np.random.default_rng(seed)
    x = np.zeros((count, len(FEATURE_NAMES)), dtype=np.float32)

    street = rng.choice([0, 1, 2], p=[0.52, 0.3, 0.18], size=count)
    x[:, FEATURE_INDEX["street_flop"]] = street == 0
    x[:, FEATURE_INDEX["street_turn"]] = street == 1
    x[:, FEATURE_INDEX["street_river"]] = street == 2

    facing = rng.random(count) < 0.4
    x[:, FEATURE_INDEX["to_call_flag"]] = facing
    x[:, FEATURE_INDEX["facing_bet"]] = facing
    x[:, FEATURE_INDEX["pot_odds"]] = np.where(facing, rng.uniform(0.18, 0.48, size=count), 0)
    x[:, FEATURE_INDEX["spr_norm"]] = rng.beta(2.0, 3.0, size=count)
    x[:, FEATURE_INDEX["position_signal"]] = rng.choice([0.22, 0.36, 0.58, 0.76, 0.34, 0.3], size=count)
    x[:, FEATURE_INDEX["context_aggressor"]] = rng.random(count) < 0.64
    x[:, FEATURE_INDEX["three_bet"]] = rng.random(count) < 0.18
    x[:, FEATURE_INDEX["free_check"]] = (~facing) & (rng.random(count) < 0.08)

    made_values = np.array([0, 0.12, 0.32, 0.48, 0.62, 0.68, 0.78], dtype=np.float32)
    made_probs = np.array([0.39, 0.34, 0.12, 0.07, 0.035, 0.03, 0.015])
    made = rng.choice(made_values, p=made_probs / made_probs.sum(), size=count)
    draw = rng.choice([0, 0.035, 0.07, 0.11, 0.13, 0.2], p=[0.48, 0.18, 0.13, 0.1, 0.08, 0.03], size=count)
    wet = rng.beta(1.6, 2.2, size=count)
    paired = rng.random(count) < 0.18
    monotone = rng.random(count) < 0.08
    connected = rng.random(count) < (0.22 + wet * 0.36)
    adv = clamp_np(
        0.48
        + x[:, FEATURE_INDEX["context_aggressor"]] * 0.1
        + x[:, FEATURE_INDEX["three_bet"]] * 0.08
        - wet * 0.12
        + rng.normal(0, 0.075, size=count),
        0.24,
        0.78,
    )
    blockers = clamp_np(rng.beta(1.2, 7.5, size=count) * 0.26 + (rng.random(count) < 0.12) * rng.uniform(0.04, 0.11, size=count), 0, 0.24)
    percentile = clamp_np(rng.beta(1.25, 1.45, size=count), 0, 1)
    range_weight = clamp_np(rng.beta(1.7, 1.3, size=count), 0, 1)
    coverage = clamp_np(rng.normal(0.58, 0.18, size=count), 0.08, 1)

    equity = clamp_np(
        0.1 + made * 0.58 + draw * 1.35 + percentile * 0.18 + adv * 0.12 - wet * 0.055 + rng.normal(0, 0.11, size=count),
        0.015,
        0.96,
    )

    x[:, FEATURE_INDEX["equity"]] = equity
    x[:, FEATURE_INDEX["made_strength"]] = made
    x[:, FEATURE_INDEX["draw_strength"]] = draw
    x[:, FEATURE_INDEX["wetness"]] = wet
    x[:, FEATURE_INDEX["paired"]] = paired
    x[:, FEATURE_INDEX["monotone"]] = monotone
    x[:, FEATURE_INDEX["connected"]] = connected
    x[:, FEATURE_INDEX["range_advantage"]] = adv
    x[:, FEATURE_INDEX["blockers"]] = blockers
    x[:, FEATURE_INDEX["range_percentile"]] = percentile
    x[:, FEATURE_INDEX["range_weight"]] = range_weight
    x[:, FEATURE_INDEX["range_coverage"]] = coverage
    return x


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


class AbstractRegretGame:
    def __init__(self, torch, model, device, regret_clip: float, regret_decay: float):
        self.torch = torch
        self.model = model
        self.device = device
        self.regret_clip = regret_clip
        self.regret_decay = regret_decay
        self.idx = FEATURE_INDEX

    def to_tensor(self, rows: np.ndarray):
        return self.torch.from_numpy(rows).to(self.device)

    def regret_match(self, regrets):
        positive = self.torch.relu(regrets)
        total = positive.sum(dim=1, keepdim=True)
        uniform = self.torch.full_like(positive, 1 / positive.shape[1])
        return self.torch.where(total > 1e-8, positive / total.clamp_min(1e-8), uniform)

    def normalize_strategy(self, weights):
        positive = weights.clamp_min(1e-5)
        return positive / positive.sum(dim=1, keepdim=True).clamp_min(1e-5)

    def strategy(self, x):
        return self.regret_match(self.model(x))

    def opponent_view(self, x, facing: bool, pot_odds):
        y = x.clone()
        wet = x[:, self.idx["wetness"]]
        connected = x[:, self.idx["connected"]]
        monotone = x[:, self.idx["monotone"]]
        hero_advantage = x[:, self.idx["range_advantage"]]
        hero_blockers = x[:, self.idx["blockers"]]
        mirror_equity = 1 - x[:, self.idx["equity"]]
        range_defense_equity = (0.52 - (hero_advantage - 0.5) * 0.36 - hero_blockers * 0.55 + wet * 0.08 + connected * 0.03).clamp(0.18, 0.82)
        defender_equity = (mirror_equity * 0.45 + range_defense_equity * 0.55).clamp(0.015, 0.96)
        y[:, self.idx["equity"]] = defender_equity
        y[:, self.idx["made_strength"]] = (0.06 + defender_equity * 0.28 + wet * 0.055 - x[:, self.idx["made_strength"]] * 0.18).clamp(0, 0.58)
        y[:, self.idx["draw_strength"]] = (wet * 0.08 + connected * 0.045 + monotone * 0.035 - x[:, self.idx["draw_strength"]] * 0.35).clamp(0, 0.22)
        y[:, self.idx["blockers"]] = (0.16 - hero_blockers * 0.55 + (1 - hero_advantage) * 0.06).clamp(0, 0.24)
        y[:, self.idx["position_signal"]] = (1 - x[:, self.idx["position_signal"]]).clamp(0.12, 0.88)
        y[:, self.idx["range_advantage"]] = (1 - hero_advantage).clamp(0.18, 0.82)
        y[:, self.idx["range_percentile"]] = (1 - x[:, self.idx["range_percentile"]]).clamp(0, 1)
        y[:, self.idx["context_aggressor"]] = 1 - x[:, self.idx["context_aggressor"]]
        y[:, self.idx["to_call_flag"]] = 1 if facing else 0
        y[:, self.idx["facing_bet"]] = 1 if facing else 0
        y[:, self.idx["pot_odds"]] = pot_odds if self.torch.is_tensor(pot_odds) else float(pot_odds)
        y[:, self.idx["free_check"]] = 0 if facing else y[:, self.idx["free_check"]]
        return y

    def calibrated_response(self, defender, raw_strategy, bet_odds):
        equity = defender[:, self.idx["equity"]].clamp(0.015, 0.96)
        made = defender[:, self.idx["made_strength"]].clamp(0, 1)
        draw = defender[:, self.idx["draw_strength"]].clamp(0, 1)
        wet = defender[:, self.idx["wetness"]].clamp(0, 1)
        connected = defender[:, self.idx["connected"]].clamp(0, 1)
        monotone = defender[:, self.idx["monotone"]].clamp(0, 1)
        advantage = defender[:, self.idx["range_advantage"]].clamp(0, 1)
        pressure = bet_odds.clamp(0.08, 0.68)
        dry_static = ((1 - wet) * (1 - connected * 0.65) * (1 - monotone * 0.7)).clamp(0, 1)

        fold = (
            0.32
            + pressure * 0.26
            + dry_static * 0.26
            + (0.5 - advantage).clamp_min(0) * 0.44
            - equity * 0.24
            - made * 0.2
            - draw * 0.14
            - wet * 0.16
        ).clamp(0.08, 0.76)
        raise_total = (
            0.08
            + draw * 0.62
            + made * 0.34
            + advantage.clamp_min(0.5) * 0.08
            + pressure * 0.06
            - wet * 0.04
        ).clamp(0.04, 0.42)
        call = (1 - fold - raise_total).clamp(0.12, 0.84)
        raise_small = raise_total * 0.58
        raise_big = raise_total * 0.3
        jam = raise_total * 0.12
        prior = self.normalize_strategy(self.torch.stack([fold, call, raise_small, raise_big, jam], dim=1))
        return self.normalize_strategy(raw_strategy * 0.72 + prior * 0.28)

    def hero_facing_view(self, x, pot_odds):
        y = x.clone()
        y[:, self.idx["to_call_flag"]] = 1
        y[:, self.idx["facing_bet"]] = 1
        y[:, self.idx["pot_odds"]] = pot_odds
        y[:, self.idx["free_check"]] = 0
        return y

    def showdown_ev(self, equity, pot, risk):
        return equity * pot - (1 - equity) * risk

    def pot_odds_to_call(self, x):
        odds = x[:, self.idx["pot_odds"]].clamp(0.08, 0.62)
        return (odds / (1 - odds).clamp_min(1e-4)).clamp(0.08, 1.8)

    def effective_stack(self, x):
        return (x[:, self.idx["spr_norm"]] * 20).clamp(1.2, 20)

    def open_bet_sizes(self, x):
        stack = self.effective_stack(x)
        return self.torch.stack(
            [
                self.torch.zeros_like(stack),
                self.torch.full_like(stack, 0.33),
                self.torch.full_like(stack, 0.55),
                self.torch.full_like(stack, 0.9),
                self.torch.minimum(self.torch.full_like(stack, 1.35), stack * 0.7),
            ],
            dim=1,
        )

    def facing_raise_sizes(self, x):
        call = self.pot_odds_to_call(x)
        stack = self.effective_stack(x)
        return self.torch.stack(
            [
                self.torch.zeros_like(call),
                call,
                self.torch.maximum(call * 2.2, self.torch.full_like(call, 0.55)),
                self.torch.maximum(call * 3.4, self.torch.full_like(call, 0.95)),
                self.torch.maximum(call, stack * 0.72),
            ],
            dim=1,
        )

    def facing_ev_from_strategy(self, x, pot, to_call):
        strategy = self.strategy(self.hero_facing_view(x, to_call / (pot + to_call).clamp_min(1e-4)))
        q = self.facing_action_values(x, pot=pot, to_call=to_call)
        return (strategy * q).sum(dim=1)

    def no_call_action_values(self, x):
        n = x.shape[0]
        equity = x[:, self.idx["equity"]].clamp(0.015, 0.96)
        pot = self.torch.ones(n, device=x.device)
        sizes = self.open_bet_sizes(x)
        q = self.torch.zeros((n, ACTION_COUNT), device=x.device)
        wet = x[:, self.idx["wetness"]].clamp(0, 1)
        connected = x[:, self.idx["connected"]].clamp(0, 1)
        monotone = x[:, self.idx["monotone"]].clamp(0, 1)
        made = x[:, self.idx["made_strength"]].clamp(0, 1)
        draw = x[:, self.idx["draw_strength"]].clamp(0, 1)
        advantage = x[:, self.idx["range_advantage"]].clamp(0, 1)
        blockers = x[:, self.idx["blockers"]].clamp(0, 0.25)
        aggressor = x[:, self.idx["context_aggressor"]].clamp(0, 1)
        river = x[:, self.idx["street_river"]].clamp(0, 1)
        dry_static = ((1 - wet) * (1 - connected * 0.65) * (1 - monotone * 0.7)).clamp(0, 1)

        opp_open = self.opponent_view(x, facing=False, pot_odds=self.torch.zeros(n, device=x.device))
        opp_open_strategy = self.strategy(opp_open)
        check_showdown = self.showdown_ev(equity, pot, self.torch.zeros_like(pot))
        check_ev = opp_open_strategy[:, 0] * check_showdown
        for action_index in range(1, ACTION_COUNT):
            bet = sizes[:, action_index]
            check_ev += opp_open_strategy[:, action_index] * self.facing_ev_from_strategy(x, pot + bet, bet)
        q[:, 0] = check_ev

        for action_index in range(1, ACTION_COUNT):
            bet = sizes[:, action_index]
            odds = bet / (pot + bet).clamp_min(1e-4)
            opp_facing = self.opponent_view(x, facing=True, pot_odds=odds)
            opp_strategy = self.calibrated_response(opp_facing, self.strategy(opp_facing), odds)
            called_pot = pot + bet
            call_ev = self.showdown_ev(equity, called_pot, bet)
            raised_ev = -bet * (0.72 - equity * 0.24)
            q[:, action_index] = (
                opp_strategy[:, 0] * pot
                + opp_strategy[:, 1] * call_ev
                + (opp_strategy[:, 2] + opp_strategy[:, 3] + opp_strategy[:, 4]) * raised_ev
            )
        range_pressure = (advantage - 0.5).clamp_min(0) * aggressor
        weak_blocker = ((made < 0.18) & (draw < 0.08)).float()
        bluff_leverage = (
            range_pressure * 0.82
            + blockers * dry_static * 4.4
            + dry_static * 0.1
            - wet * 0.18
        ).clamp(0, 0.62) * weak_blocker
        value_leverage = ((equity - 0.56).clamp_min(0) * 0.72 + made * 0.28 + river * (equity - 0.72).clamp_min(0) * 0.45).clamp(0, 0.68)
        protection_leverage = ((made > 0).float() * (0.5 - equity).clamp_min(0) * wet * 0.16).clamp(0, 0.16)
        bet_profile = self.torch.tensor([0, 0.7, 0.9, 1.08, 1.02], device=x.device).unsqueeze(0)
        q += (bluff_leverage + value_leverage + protection_leverage).unsqueeze(1) * bet_profile
        q[:, 4] += river * (equity - 0.72).clamp_min(0) * (made + advantage).clamp(0, 1.4) * 0.46
        q[:, 0] -= aggressor * ((advantage - 0.5).clamp_min(0) * 0.08 + dry_static * blockers * 0.18 + (equity - 0.68).clamp_min(0) * 0.1)
        return q

    def facing_action_values(self, x, pot=None, to_call=None):
        n = x.shape[0]
        equity = x[:, self.idx["equity"]].clamp(0.015, 0.96)
        base_pot = self.torch.ones(n, device=x.device) if pot is None else pot
        call = self.pot_odds_to_call(x) if to_call is None else to_call
        q = self.torch.zeros((n, ACTION_COUNT), device=x.device)
        q[:, 0] = 0
        q[:, 1] = self.showdown_ev(equity, base_pot + call, call)

        sizes = self.facing_raise_sizes(self.hero_facing_view(x, call / (base_pot + call).clamp_min(1e-4)))
        for action_index in range(2, ACTION_COUNT):
            raise_size = sizes[:, action_index]
            odds = raise_size / (base_pot + raise_size).clamp_min(1e-4)
            opp_facing = self.opponent_view(x, facing=True, pot_odds=odds)
            opp_strategy = self.calibrated_response(opp_facing, self.strategy(opp_facing), odds)
            call_ev = self.showdown_ev(equity, base_pot + raise_size, raise_size)
            jam_ev = self.showdown_ev(equity, base_pot + raise_size * 1.35, raise_size * 1.15)
            q[:, action_index] = (
                opp_strategy[:, 0] * base_pot
                + opp_strategy[:, 1] * call_ev
                + (opp_strategy[:, 2] + opp_strategy[:, 3]) * call_ev * 0.62
                + opp_strategy[:, 4] * jam_ev
            )
        return q

    def action_values(self, x):
        facing = x[:, self.idx["to_call_flag"]] > 0.5
        q = self.torch.zeros((x.shape[0], ACTION_COUNT), device=x.device)
        if (~facing).any():
            q[~facing] = self.no_call_action_values(x[~facing])
        if facing.any():
            q[facing] = self.facing_action_values(x[facing])
        wet = x[:, self.idx["wetness"]].unsqueeze(1)
        river = x[:, self.idx["street_river"]].unsqueeze(1)
        q[:, 4:5] -= wet * 0.12 * (1 - river * 0.6)
        return q.clamp(-self.regret_clip, self.regret_clip)

    def regret_targets(self, rows: np.ndarray) -> np.ndarray:
        with self.torch.no_grad():
            x = self.to_tensor(rows)
            current = self.model(x).clamp(-self.regret_clip, self.regret_clip)
            strategy = self.regret_match(current)
            q = self.action_values(x)
            baseline = (strategy * q).sum(dim=1, keepdim=True)
            instant_regret = (q - baseline).clamp(-self.regret_clip, self.regret_clip)
            regrets = (current * self.regret_decay + instant_regret).clamp(-self.regret_clip, self.regret_clip)
        return regrets.detach().cpu().numpy().astype(np.float32)

    def strategy_for_rows(self, rows: np.ndarray) -> np.ndarray:
        with self.torch.no_grad():
            x = self.to_tensor(rows)
            return self.strategy(x).detach().cpu().numpy()

    def validation_metrics(self, rows: np.ndarray) -> dict[str, float]:
        with self.torch.no_grad():
            x = self.to_tensor(rows)
            current = self.model(x).clamp(-self.regret_clip, self.regret_clip)
            q = self.action_values(x)
            current_strategy = self.regret_match(current)
            baseline = (current_strategy * q).sum(dim=1, keepdim=True)
            instant_regret = (q - baseline).clamp(-self.regret_clip, self.regret_clip)
            target = (current * self.regret_decay + instant_regret).clamp(-self.regret_clip, self.regret_clip)
            prediction = current
            mse = self.torch.mean((prediction - target) ** 2).item()
            mae = self.torch.mean(self.torch.abs(prediction - target)).item()
            strategy = self.regret_match(prediction)
            ev = (strategy * q).sum(dim=1, keepdim=True)
            positive_regret = self.torch.relu(q - ev).sum(dim=1).mean().item()
            norm_error = self.torch.max(self.torch.abs(strategy.sum(dim=1) - 1)).item()
        return {
            "regret_mse": mse,
            "regret_mae": mae,
            "avg_positive_regret": positive_regret,
            "norm_error": norm_error,
        }


def train_self_play(torch, functional, model, args, device):
    game = AbstractRegretGame(torch, model, device, args.regret_clip, args.regret_decay)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)

    reservoir_size = min(args.reservoir_size, args.self_play_hands)
    res_x = np.empty((reservoir_size, len(FEATURE_NAMES)), dtype=np.float32)
    res_y = np.empty((reservoir_size, ACTION_COUNT), dtype=np.float32)
    filled = 0
    cursor = 0
    seen = 0
    started = time.time()

    iteration = 0
    while seen < args.self_play_hands:
        iteration += 1
        batch_count = min(args.rollout_batch, args.self_play_hands - seen)
        rows = sample_states(batch_count, args.seed + iteration)
        regrets = game.regret_targets(rows)
        end = cursor + batch_count
        if end <= reservoir_size:
            res_x[cursor:end] = rows
            res_y[cursor:end] = regrets
        else:
            first = reservoir_size - cursor
            res_x[cursor:] = rows[:first]
            res_y[cursor:] = regrets[:first]
            res_x[: end % reservoir_size] = rows[first:]
            res_y[: end % reservoir_size] = regrets[first:]
        cursor = end % reservoir_size
        filled = min(reservoir_size, filled + batch_count)
        seen += batch_count

        losses = []
        for _ in range(args.train_steps_per_iter):
            indices = np.random.default_rng(args.seed + seen + _).integers(0, filled, size=args.batch_size)
            xb = torch.from_numpy(res_x[indices]).to(device, non_blocking=True)
            yb = torch.from_numpy(res_y[indices]).to(device, non_blocking=True)
            optimizer.zero_grad(set_to_none=True)
            pred = model(xb)
            loss = functional.mse_loss(pred, yb)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 3.0)
            optimizer.step()
            losses.append(loss.item())

        if iteration == 1 or iteration % args.log_every == 0 or seen >= args.self_play_hands:
            validation_rows = sample_states(min(args.validation_samples, 32768), args.seed + 90_000 + iteration)
            validation = game.validation_metrics(validation_rows)
            print(
                "iteration="
                f"{iteration} self_play={seen}/{args.self_play_hands} "
                f"reservoir={filled} train_mse={np.mean(losses):.6f} "
                f"val_mse={validation['regret_mse']:.6f} "
                f"val_mae={validation['regret_mae']:.6f} "
                f"avg_pos_regret={validation['avg_positive_regret']:.6f}",
            )

    return game, time.time() - started


def predict_rows(game: AbstractRegretGame, rows: dict[str, np.ndarray]) -> dict[str, list[float]]:
    names = list(rows.keys())
    data = np.stack([rows[name] for name in names])
    probs = game.strategy_for_rows(data)
    return {name: [float(value) for value in probs[index]] for index, name in enumerate(names)}


def run_gates(validation: dict, behavior: dict[str, list[float]], args) -> list[Gate]:
    gates = [
        Gate("regret_mse", validation["regret_mse"] <= args.max_regret_mse, validation["regret_mse"], f"<= {args.max_regret_mse}"),
        Gate("regret_mae", validation["regret_mae"] <= args.max_regret_mae, validation["regret_mae"], f"<= {args.max_regret_mae}"),
        Gate("avg_positive_regret", validation["avg_positive_regret"] <= args.max_positive_regret, validation["avg_positive_regret"], f"<= {args.max_positive_regret}"),
        Gate("normalization", validation["norm_error"] <= 1e-5, validation["norm_error"], "<= 1e-5"),
    ]
    dry = behavior["dry_blocker_bluff_bets"]
    wet = behavior["wet_air_checks"]
    draw = behavior["flush_draw_raises_vs_bet"]
    value = behavior["value_bets"]
    river_nuts = behavior["river_nut_overbets"]
    gates.extend(
        [
            Gate("dry_blocker_bluff_bet_total", sum(dry[1:]) >= 0.34, sum(dry[1:]), ">= 0.34"),
            Gate("wet_air_check", wet[0] >= 0.42, wet[0], ">= 0.42"),
            Gate("wet_air_bet_cap", sum(wet[1:]) <= 0.58, sum(wet[1:]), "<= 0.58"),
            Gate("flush_draw_raise_vs_bet", sum(draw[2:]) >= 0.16, sum(draw[2:]), ">= 0.16"),
            Gate("flush_draw_fold_cap", draw[0] <= 0.28, draw[0], "<= 0.28"),
            Gate("value_bet_total", sum(value[1:]) >= 0.56, sum(value[1:]), ">= 0.56"),
            Gate("river_nut_overbet", river_nuts[4] >= 0.1, river_nuts[4], ">= 0.10"),
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
            "selfPlayHands": args.self_play_hands,
            "reservoirSize": min(args.reservoir_size, args.self_play_hands),
            "rolloutBatch": args.rollout_batch,
            "trainStepsPerIter": args.train_steps_per_iter,
            "batchSize": args.batch_size,
            "hidden": args.hidden,
            "seed": args.seed,
            "regretDecay": args.regret_decay,
            "seconds": round(train_seconds, 2),
            "device": args.device,
        },
        "featureNames": FEATURE_NAMES,
        "actionSets": {
            "open": OPEN_ACTIONS,
            "facing": FACING_ACTIONS,
        },
        "policyKind": "regret-matching",
        "blend": args.blend,
        "validation": {key: round(float(value), 6) for key, value in validation.items()},
        "behavior": {key: [round(float(value), 6) for value in values] for key, values in behavior.items()},
        "standards": [
            {"name": gate.name, "passed": gate.passed, "value": round(float(gate.value), 6), "threshold": gate.threshold}
            for gate in gates
        ],
        "model": {
            "type": "mlp-regret",
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
    parser.add_argument("--self-play-hands", type=int, default=600_000)
    parser.add_argument("--reservoir-size", type=int, default=900_000)
    parser.add_argument("--rollout-batch", type=int, default=16_384)
    parser.add_argument("--train-steps-per-iter", type=int, default=16)
    parser.add_argument("--validation-samples", type=int, default=80_000)
    parser.add_argument("--batch-size", type=int, default=4096)
    parser.add_argument("--hidden", type=int, default=96)
    parser.add_argument("--seed", type=int, default=20260625)
    parser.add_argument("--lr", type=float, default=0.0018)
    parser.add_argument("--blend", type=float, default=0.78)
    parser.add_argument("--regret-clip", type=float, default=2.4)
    parser.add_argument("--regret-decay", type=float, default=0.58)
    parser.add_argument("--max-regret-mse", type=float, default=0.085)
    parser.add_argument("--max-regret-mae", type=float, default=0.22)
    parser.add_argument("--max-positive-regret", type=float, default=1.35)
    parser.add_argument("--log-every", type=int, default=4)
    parser.add_argument("--device", default="cuda")
    parser.add_argument("--version", default="postflop-selfplay-regret-v3")
    parser.add_argument("--out", default="src/trained-policy-artifact.js")
    args = parser.parse_args()

    torch, nn, functional = import_torch()
    if args.device == "cuda" and not torch.cuda.is_available():
        args.device = "cpu"
    device = torch.device(args.device)
    print(f"device={device} cuda_devices={torch.cuda.device_count() if torch.cuda.is_available() else 0}")

    model = build_model(nn, args.hidden).to(device)
    if device.type == "cuda" and torch.cuda.device_count() > 1:
        model = nn.DataParallel(model)

    game, train_seconds = train_self_play(torch, functional, model, args, device)
    validation_rows = sample_states(args.validation_samples, args.seed + 1)
    validation = game.validation_metrics(validation_rows)
    behavior = predict_rows(game, gate_rows())
    gates = run_gates(validation, behavior, args)
    for gate in gates:
        print(f"gate {gate.name}: value={gate.value:.6f} threshold={gate.threshold} passed={gate.passed}")
    export_artifact(model, args, validation, behavior, gates, train_seconds, Path(args.out))
    print(f"exported {args.out}")


if __name__ == "__main__":
    main()
