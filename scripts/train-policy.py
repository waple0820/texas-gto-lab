#!/usr/bin/env python3
"""Train a compact postflop regret policy through physical self-play feedback.

This trainer intentionally does not use a hand-written target policy. It samples
real Hold'em cards, evaluates action values from current MLP-regret responses
plus Monte Carlo showdown utilities, and trains the same small MLP architecture
to predict the resulting regret matrix. Runtime strategy is then produced with
regret matching.
"""

from __future__ import annotations

import argparse
import json
import time
from dataclasses import dataclass
from functools import lru_cache
from itertools import combinations
from pathlib import Path

import numpy as np

try:  # Optional high-speed evaluator for training hosts.
    import eval7
except Exception:  # pragma: no cover - fallback keeps local smoke portable
    eval7 = None


EQUITY_BUCKET_NAMES = [f"range_eq_{start}_{start + 10}" for start in range(0, 100, 10)]
FEATURE_NAMES = [
    "equity",
    *EQUITY_BUCKET_NAMES,
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

RANK_VALUES = np.array([(card % 13) + 2 for card in range(52)], dtype=np.int16)
SUIT_VALUES = np.array([card // 13 for card in range(52)], dtype=np.int16)
RANK_TEXT = "23456789TJQKA"
SUIT_TEXT = "shdc"
EVAL7_CARDS = [eval7.Card(f"{RANK_TEXT[card % 13]}{SUIT_TEXT[card // 13]}") for card in range(52)] if eval7 else None
MADE_STRENGTH_BY_CATEGORY = {
    0: 0.0,
    1: 0.12,
    2: 0.32,
    3: 0.48,
    4: 0.62,
    5: 0.68,
    6: 0.78,
    7: 0.9,
    8: 0.96,
}


@dataclass
class Gate:
    name: str
    passed: bool
    value: float
    threshold: str


@dataclass(frozen=True)
class PhysicalState:
    hero: tuple[int, int]
    board: tuple[int, ...]
    win: float
    tie: float
    loss: float


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


def straight_high(ranks: list[int]) -> int:
    unique = sorted(set(ranks), reverse=True)
    if 14 in unique:
        unique.append(1)
    for index in range(len(unique) - 4):
        window = unique[index : index + 5]
        if window[0] - window[4] == 4 and len(set(window)) == 5:
            return window[0]
    return 0


def evaluate_five(cards: tuple[int, ...]) -> tuple[int, ...]:
    ranks = sorted((int(RANK_VALUES[card]) for card in cards), reverse=True)
    suits = [int(SUIT_VALUES[card]) for card in cards]
    counts = {rank: ranks.count(rank) for rank in set(ranks)}
    by_count = sorted(counts.items(), key=lambda item: (item[1], item[0]), reverse=True)
    flush = len(set(suits)) == 1
    straight = straight_high(ranks)

    if flush and straight:
        return (8, straight)
    if by_count[0][1] == 4:
        quad = by_count[0][0]
        kicker = max(rank for rank in ranks if rank != quad)
        return (7, quad, kicker)
    if by_count[0][1] == 3 and by_count[1][1] == 2:
        return (6, by_count[0][0], by_count[1][0])
    if flush:
        return (5, *ranks)
    if straight:
        return (4, straight)
    if by_count[0][1] == 3:
        trip = by_count[0][0]
        kickers = [rank for rank in ranks if rank != trip]
        return (3, trip, *kickers)
    if by_count[0][1] == 2 and by_count[1][1] == 2:
        high_pair, low_pair = sorted([by_count[0][0], by_count[1][0]], reverse=True)
        kicker = max(rank for rank in ranks if rank not in (high_pair, low_pair))
        return (2, high_pair, low_pair, kicker)
    if by_count[0][1] == 2:
        pair = by_count[0][0]
        kickers = [rank for rank in ranks if rank != pair]
        return (1, pair, *kickers)
    return (0, *ranks)


@lru_cache(maxsize=750_000)
def evaluate_cards_pure(cards_key: tuple[int, ...]) -> tuple[int, ...]:
    cards = tuple(sorted(cards_key))
    if len(cards) < 5:
        return (0, 0)
    if len(cards) == 5:
        return evaluate_five(cards)
    return max(evaluate_five(tuple(combo)) for combo in combinations(cards, 5))


@lru_cache(maxsize=750_000)
def evaluate_cards(cards_key: tuple[int, ...]) -> tuple[int, ...]:
    cards = tuple(sorted(cards_key))
    if len(cards) < 5:
        return (0,)
    if EVAL7_CARDS is not None:
        return (int(eval7.evaluate([EVAL7_CARDS[card] for card in cards])),)
    return evaluate_cards_pure(cards)


def board_texture(board: tuple[int, ...]) -> tuple[float, float, float, float]:
    if not board:
        return 0.0, 0.0, 0.0, 0.0
    ranks = [int(RANK_VALUES[card]) for card in board]
    suits = [int(SUIT_VALUES[card]) for card in board]
    paired = float(any(ranks.count(rank) > 1 for rank in set(ranks)))
    max_suit = max(suits.count(suit) for suit in set(suits))
    monotone = float(max_suit >= 3)
    ordered = sorted(set(ranks))
    if 14 in ordered:
        ordered = [1, *ordered]
    connected = 0.0
    for rank in ordered:
        if sum(1 for value in ordered if rank <= value <= rank + 4) >= min(3, len(board)):
            connected = 1.0
            break
    wetness = clamp_np(connected * 0.34 + (0.32 if max_suit >= 3 else 0.16 if max_suit == 2 else 0) - paired * 0.08, 0, 1)
    return float(wetness), paired, monotone, connected


def draw_strength(hero: tuple[int, int], board: tuple[int, ...]) -> float:
    cards = (*hero, *board)
    ranks = sorted(set(int(RANK_VALUES[card]) for card in cards))
    if 14 in ranks:
        ranks = [1, *ranks]
    suits = [int(SUIT_VALUES[card]) for card in cards]
    max_suit = max(suits.count(suit) for suit in set(suits))
    flush_draw = max_suit == 4 and len(board) < 5
    backdoor_flush = max_suit == 3 and len(board) == 3

    straight_draw = False
    open_ended = False
    for start in range(1, 11):
        present = sum(1 for rank in set(ranks) if start <= rank <= start + 4)
        if present >= 4:
            straight_draw = True
            window = [rank for rank in range(start, start + 5) if rank in ranks]
            open_ended = len(window) >= 4 and window[0] != start and window[-1] != start + 4
            break
    board_high = max((int(RANK_VALUES[card]) for card in board), default=0)
    overcards = sum(1 for card in hero if int(RANK_VALUES[card]) > board_high) if board else 0
    return float(
        clamp_np(
            (0.13 if flush_draw else 0)
            + (0.11 if open_ended else 0)
            + (0.07 if straight_draw and not open_ended else 0)
            + (0.035 if backdoor_flush else 0)
            + min(0.08, overcards * 0.036),
            0,
            0.28,
        )
    )


def made_strength(hero: tuple[int, int], board: tuple[int, ...]) -> float:
    if len(board) < 3:
        return 0.0
    category = evaluate_cards_pure(tuple(sorted((*hero, *board))))[0]
    return MADE_STRENGTH_BY_CATEGORY.get(category, 0.0)


def rollout_outcomes(hero: tuple[int, int], board: tuple[int, ...], seed: int, trials: int) -> tuple[float, float, float]:
    rng = np.random.default_rng(seed)
    known = set((*hero, *board))
    deck = np.array([card for card in range(52) if card not in known], dtype=np.int16)
    board_need = 5 - len(board)
    wins = 0
    ties = 0
    losses = 0
    safe_trials = max(4, int(trials))
    draw_count = 2 + board_need
    for _ in range(safe_trials):
        draw = rng.choice(deck, size=draw_count, replace=False)
        villain = tuple(int(card) for card in draw[:2])
        runout = tuple(int(card) for card in (*board, *draw[2:]))
        hero_score = evaluate_cards(tuple(sorted((*hero, *runout))))
        villain_score = evaluate_cards(tuple(sorted((*villain, *runout))))
        if hero_score > villain_score:
            wins += 1
        elif hero_score == villain_score:
            ties += 1
        else:
            losses += 1
    return wins / safe_trials, ties / safe_trials, losses / safe_trials


def range_equity_histogram(board: tuple[int, ...], seed: int, hand_samples: int, rollouts_per_hand: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    known = set(board)
    deck = np.array([card for card in range(52) if card not in known], dtype=np.int16)
    buckets = np.zeros(len(EQUITY_BUCKET_NAMES), dtype=np.float32)
    safe_samples = max(1, int(hand_samples))
    for index in range(safe_samples):
        hero = tuple(int(card) for card in rng.choice(deck, size=2, replace=False))
        win, tie, _ = rollout_outcomes(hero, board, seed + 10_003 + index * 997, rollouts_per_hand)
        equity = win + tie * 0.5
        bucket = min(len(buckets) - 1, max(0, int(equity * len(buckets))))
        buckets[bucket] += 1
    total = buckets.sum()
    if total <= 0:
        buckets[:] = 1 / len(buckets)
    else:
        buckets /= total
    return buckets


def build_feature_row(
    *,
    hero: tuple[int, int],
    board: tuple[int, ...],
    seed: int,
    facing: bool,
    pot_odds: float,
    spr_norm: float,
    position_signal: float,
    context_aggressor: float,
    three_bet: float,
    free_check: float,
    histogram_hands: int,
    histogram_rollouts: int,
    showdown_rollouts: int,
) -> tuple[np.ndarray, PhysicalState]:
    row = np.zeros(len(FEATURE_NAMES), dtype=np.float32)
    win, tie, loss = rollout_outcomes(hero, board, seed + 71, showdown_rollouts)
    equity = win + tie * 0.5
    histogram = range_equity_histogram(board, seed + 137, histogram_hands, histogram_rollouts)
    hist_mean = float(sum(((index + 0.5) / len(histogram)) * value for index, value in enumerate(histogram)))
    bucket = min(len(histogram) - 1, max(0, int(equity * len(histogram))))
    percentile = float(histogram[:bucket].sum() + histogram[bucket] * 0.5)
    wetness, paired, monotone, connected = board_texture(board)
    blockers = float(clamp_np((1 if any(RANK_VALUES[card] == 14 for card in hero) else 0) * 0.055 + (1 - wetness) * max(0, 0.48 - equity) * 0.08, 0, 0.24))
    advantage = float(clamp_np(0.5 + (hist_mean - 0.5) * 0.72 + context_aggressor * 0.05 + three_bet * 0.035 - wetness * 0.045, 0.18, 0.82))

    row[FEATURE_INDEX["equity"]] = equity
    for index, name in enumerate(EQUITY_BUCKET_NAMES):
        row[FEATURE_INDEX[name]] = histogram[index]
    row[FEATURE_INDEX["pot_odds"]] = pot_odds if facing else 0
    row[FEATURE_INDEX["spr_norm"]] = spr_norm
    row[FEATURE_INDEX["street_flop"]] = 1 if len(board) == 3 else 0
    row[FEATURE_INDEX["street_turn"]] = 1 if len(board) == 4 else 0
    row[FEATURE_INDEX["street_river"]] = 1 if len(board) == 5 else 0
    row[FEATURE_INDEX["position_signal"]] = position_signal
    row[FEATURE_INDEX["to_call_flag"]] = 1 if facing else 0
    row[FEATURE_INDEX["made_strength"]] = made_strength(hero, board)
    row[FEATURE_INDEX["draw_strength"]] = draw_strength(hero, board)
    row[FEATURE_INDEX["wetness"]] = wetness
    row[FEATURE_INDEX["paired"]] = paired
    row[FEATURE_INDEX["monotone"]] = monotone
    row[FEATURE_INDEX["connected"]] = connected
    row[FEATURE_INDEX["range_advantage"]] = advantage
    row[FEATURE_INDEX["blockers"]] = blockers
    row[FEATURE_INDEX["range_percentile"]] = percentile
    row[FEATURE_INDEX["range_weight"]] = float(clamp_np(0.22 + percentile * 0.62 + advantage * 0.16, 0, 1))
    row[FEATURE_INDEX["range_coverage"]] = float(clamp_np(0.22 + histogram.std() * 1.6 + (1 - wetness) * 0.22, 0.08, 1))
    row[FEATURE_INDEX["context_aggressor"]] = context_aggressor
    row[FEATURE_INDEX["three_bet"]] = three_bet
    row[FEATURE_INDEX["facing_bet"]] = 1 if facing else 0
    row[FEATURE_INDEX["free_check"]] = 0 if facing else free_check
    return row, PhysicalState(hero=hero, board=board, win=win, tie=tie, loss=loss)


def sample_states(
    count: int,
    seed: int,
    histogram_hands: int = 8,
    histogram_rollouts: int = 8,
    showdown_rollouts: int = 32,
    return_physical: bool = False,
) -> np.ndarray | tuple[np.ndarray, list[PhysicalState]]:
    """Sample physical postflop states. Labels come only from self-play later."""
    rng = np.random.default_rng(seed)
    x = np.zeros((count, len(FEATURE_NAMES)), dtype=np.float32)
    physical: list[PhysicalState] = []

    street = rng.choice([0, 1, 2], p=[0.52, 0.3, 0.18], size=count)
    for index in range(count):
        board_cards = 3 + int(street[index])
        deal = rng.choice(np.arange(52), size=2 + board_cards, replace=False)
        hero = (int(deal[0]), int(deal[1]))
        board = tuple(int(card) for card in deal[2:])
        facing = bool(rng.random() < 0.4)
        row, state = build_feature_row(
            hero=hero,
            board=board,
            seed=seed + index * 31,
            facing=facing,
            pot_odds=float(rng.uniform(0.18, 0.48)),
            spr_norm=float(rng.beta(2.0, 3.0)),
            position_signal=float(rng.choice([0.22, 0.36, 0.58, 0.76, 0.34, 0.3])),
            context_aggressor=float(rng.random() < 0.64),
            three_bet=float(rng.random() < 0.18),
            free_check=float(rng.random() < 0.08),
            histogram_hands=histogram_hands,
            histogram_rollouts=histogram_rollouts,
            showdown_rollouts=showdown_rollouts,
        )
        x[index] = row
        physical.append(state)
    if return_physical:
        return x, physical
    return x


def gate_rows() -> dict[str, np.ndarray]:
    def card(rank: int, suit: int) -> int:
        return suit * 13 + (rank - 2)

    def row(
        *,
        hero: tuple[int, int],
        board: tuple[int, ...],
        seed: int,
        facing: bool = False,
        pot_odds: float = 0.0,
        spr_norm: float = 0.6,
        position_signal: float = 0.76,
        context_aggressor: float = 1.0,
        three_bet: float = 0.0,
    ):
        features, _ = build_feature_row(
            hero=hero,
            board=board,
            seed=seed,
            facing=facing,
            pot_odds=pot_odds,
            spr_norm=spr_norm,
            position_signal=position_signal,
            context_aggressor=context_aggressor,
            three_bet=three_bet,
            free_check=0,
            histogram_hands=14,
            histogram_rollouts=14,
            showdown_rollouts=96,
        )
        return features

    return {
        "dry_blocker_bluff_bets": row(
            hero=(card(14, 1), card(5, 3)),
            board=(card(13, 2), card(8, 0), card(2, 1)),
            seed=4_001,
            spr_norm=0.78,
        ),
        "wet_air_checks": row(
            hero=(card(5, 1), card(2, 3)),
            board=(card(12, 2), card(11, 2), card(10, 3)),
            seed=4_002,
            spr_norm=0.78,
        ),
        "flush_draw_raises_vs_bet": row(
            hero=(card(14, 1), card(12, 1)),
            board=(card(13, 1), card(8, 1), card(2, 3)),
            seed=4_003,
            facing=True,
            pot_odds=0.33,
            spr_norm=0.6,
        ),
        "value_bets": row(
            hero=(card(14, 0), card(14, 1)),
            board=(card(14, 2), card(13, 2), card(7, 0), card(3, 1)),
            seed=4_004,
            spr_norm=0.55,
        ),
        "river_nut_overbets": row(
            hero=(card(14, 0), card(12, 0)),
            board=(card(13, 0), card(11, 0), card(10, 0), card(2, 2), card(7, 3)),
            seed=4_005,
            spr_norm=0.45,
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
        range_defense_equity = (
            0.5
            - (hero_advantage - 0.5) * 0.32
            - hero_blockers * 0.36
            + wet * 0.18
            + connected * 0.08
            + monotone * 0.06
        ).clamp(0.18, 0.86)
        defender_equity = (mirror_equity * 0.45 + range_defense_equity * 0.55).clamp(0.015, 0.96)
        y[:, self.idx["equity"]] = defender_equity
        y[:, self.idx["made_strength"]] = (0.08 + defender_equity * 0.32 + wet * 0.1 + connected * 0.04 - x[:, self.idx["made_strength"]] * 0.12).clamp(0, 0.68)
        y[:, self.idx["draw_strength"]] = (wet * 0.16 + connected * 0.08 + monotone * 0.06 - x[:, self.idx["draw_strength"]] * 0.25).clamp(0, 0.28)
        y[:, self.idx["blockers"]] = (0.16 - hero_blockers * 0.55 + (1 - hero_advantage) * 0.06).clamp(0, 0.24)
        y[:, self.idx["position_signal"]] = (1 - x[:, self.idx["position_signal"]]).clamp(0.12, 0.88)
        y[:, self.idx["range_advantage"]] = (1 - hero_advantage).clamp(0.18, 0.82)
        y[:, self.idx["range_percentile"]] = (1 - x[:, self.idx["range_percentile"]]).clamp(0, 1)
        for left, right in zip(EQUITY_BUCKET_NAMES, reversed(EQUITY_BUCKET_NAMES)):
            y[:, self.idx[left]] = x[:, self.idx[right]]
        y[:, self.idx["context_aggressor"]] = 1 - x[:, self.idx["context_aggressor"]]
        y[:, self.idx["to_call_flag"]] = 1 if facing else 0
        y[:, self.idx["facing_bet"]] = 1 if facing else 0
        y[:, self.idx["pot_odds"]] = pot_odds if self.torch.is_tensor(pot_odds) else float(pot_odds)
        y[:, self.idx["free_check"]] = 0 if facing else y[:, self.idx["free_check"]]
        return y

    def hero_facing_view(self, x, pot_odds):
        y = x.clone()
        y[:, self.idx["to_call_flag"]] = 1
        y[:, self.idx["facing_bet"]] = 1
        y[:, self.idx["pot_odds"]] = pot_odds
        y[:, self.idx["free_check"]] = 0
        return y

    def outcome_tensors(self, x, physical_states: list[PhysicalState] | None = None):
        if physical_states is None:
            equity = x[:, self.idx["equity"]].clamp(0.015, 0.96)
            zero = self.torch.zeros_like(equity)
            return equity, zero, (1 - equity).clamp(0, 1)
        win = self.torch.tensor([state.win for state in physical_states], dtype=x.dtype, device=x.device)
        tie = self.torch.tensor([state.tie for state in physical_states], dtype=x.dtype, device=x.device)
        loss = self.torch.tensor([state.loss for state in physical_states], dtype=x.dtype, device=x.device)
        return win, tie, loss

    def utility(self, outcomes, win_profit, loss_profit, tie_profit):
        win, tie, loss = outcomes
        return win * win_profit + tie * tie_profit + loss * loss_profit

    def subset_physical(self, physical_states: list[PhysicalState] | None, mask):
        if physical_states is None:
            return None
        indices = mask.detach().cpu().numpy().nonzero()[0]
        return [physical_states[int(index)] for index in indices]

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

    def facing_ev_from_strategy(self, x, pot, to_call, physical_states: list[PhysicalState] | None = None):
        strategy = self.strategy(self.hero_facing_view(x, to_call / (pot + to_call).clamp_min(1e-4)))
        q = self.facing_action_values(x, pot=pot, to_call=to_call, physical_states=physical_states)
        return (strategy * q).sum(dim=1)

    def no_call_action_values(self, x, physical_states: list[PhysicalState] | None = None):
        n = x.shape[0]
        pot = self.torch.ones(n, device=x.device)
        sizes = self.open_bet_sizes(x)
        q = self.torch.zeros((n, ACTION_COUNT), device=x.device)
        outcomes = self.outcome_tensors(x, physical_states)

        opp_open = self.opponent_view(x, facing=False, pot_odds=self.torch.zeros(n, device=x.device))
        opp_open_strategy = self.strategy(opp_open)
        check_showdown = self.utility(outcomes, win_profit=pot, loss_profit=self.torch.zeros_like(pot), tie_profit=pot * 0.5)
        check_ev = opp_open_strategy[:, 0] * check_showdown
        for action_index in range(1, ACTION_COUNT):
            bet = sizes[:, action_index]
            check_ev += opp_open_strategy[:, action_index] * self.facing_ev_from_strategy(x, pot + bet, bet, physical_states)
        q[:, 0] = check_ev

        for action_index in range(1, ACTION_COUNT):
            bet = sizes[:, action_index]
            odds = bet / (pot + bet).clamp_min(1e-4)
            opp_facing = self.opponent_view(x, facing=True, pot_odds=odds)
            opp_strategy = self.strategy(opp_facing)
            call_ev = self.utility(outcomes, win_profit=pot + bet, loss_profit=-bet, tie_profit=pot * 0.5)
            raised_ev = -bet
            q[:, action_index] = (
                opp_strategy[:, 0] * pot
                + opp_strategy[:, 1] * call_ev
                + (opp_strategy[:, 2] + opp_strategy[:, 3] + opp_strategy[:, 4]) * raised_ev
            )
        return q

    def facing_action_values(self, x, pot=None, to_call=None, physical_states: list[PhysicalState] | None = None):
        n = x.shape[0]
        base_pot = self.torch.ones(n, device=x.device) if pot is None else pot
        call = self.pot_odds_to_call(x) if to_call is None else to_call
        q = self.torch.zeros((n, ACTION_COUNT), device=x.device)
        outcomes = self.outcome_tensors(x, physical_states)
        q[:, 0] = 0
        q[:, 1] = self.utility(outcomes, win_profit=base_pot, loss_profit=-call, tie_profit=(base_pot - call) * 0.5)

        sizes = self.facing_raise_sizes(self.hero_facing_view(x, call / (base_pot + call).clamp_min(1e-4)))
        for action_index in range(2, ACTION_COUNT):
            raise_size = sizes[:, action_index]
            odds = raise_size / (base_pot + raise_size).clamp_min(1e-4)
            opp_facing = self.opponent_view(x, facing=True, pot_odds=odds)
            opp_strategy = self.strategy(opp_facing)
            call_ev = self.utility(outcomes, win_profit=base_pot + raise_size, loss_profit=-raise_size, tie_profit=base_pot * 0.5)
            reraised_ev = -raise_size
            q[:, action_index] = (
                opp_strategy[:, 0] * base_pot
                + opp_strategy[:, 1] * call_ev
                + (opp_strategy[:, 2] + opp_strategy[:, 3] + opp_strategy[:, 4]) * reraised_ev
            )
        return q

    def action_values(self, x, physical_states: list[PhysicalState] | None = None):
        facing = x[:, self.idx["to_call_flag"]] > 0.5
        q = self.torch.zeros((x.shape[0], ACTION_COUNT), device=x.device)
        if (~facing).any():
            q[~facing] = self.no_call_action_values(x[~facing], self.subset_physical(physical_states, ~facing))
        if facing.any():
            q[facing] = self.facing_action_values(x[facing], physical_states=self.subset_physical(physical_states, facing))
        return q.clamp(-self.regret_clip, self.regret_clip)

    def regret_targets(self, rows: np.ndarray, physical_states: list[PhysicalState] | None = None) -> np.ndarray:
        with self.torch.no_grad():
            x = self.to_tensor(rows)
            current = self.model(x).clamp(-self.regret_clip, self.regret_clip)
            strategy = self.regret_match(current)
            q = self.action_values(x, physical_states)
            baseline = (strategy * q).sum(dim=1, keepdim=True)
            instant_regret = (q - baseline).clamp(-self.regret_clip, self.regret_clip)
            regrets = (current * self.regret_decay + instant_regret).clamp(-self.regret_clip, self.regret_clip)
        return regrets.detach().cpu().numpy().astype(np.float32)

    def strategy_for_rows(self, rows: np.ndarray) -> np.ndarray:
        with self.torch.no_grad():
            x = self.to_tensor(rows)
            return self.strategy(x).detach().cpu().numpy()

    def validation_metrics(self, rows: np.ndarray, physical_states: list[PhysicalState] | None = None) -> dict[str, float]:
        with self.torch.no_grad():
            x = self.to_tensor(rows)
            current = self.model(x).clamp(-self.regret_clip, self.regret_clip)
            q = self.action_values(x, physical_states)
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
    res_strategy = np.empty((reservoir_size, ACTION_COUNT), dtype=np.float32)
    res_strategy_weight = np.empty((reservoir_size,), dtype=np.float32)
    filled = 0
    cursor = 0
    seen = 0
    started = time.time()

    iteration = 0
    while seen < args.self_play_hands:
        iteration += 1
        batch_count = min(args.rollout_batch, args.self_play_hands - seen)
        rows, physical = sample_states(
            batch_count,
            args.seed + iteration,
            histogram_hands=args.histogram_hands,
            histogram_rollouts=args.histogram_rollouts,
            showdown_rollouts=args.showdown_rollouts,
            return_physical=True,
        )
        strategies = game.strategy_for_rows(rows)
        regrets = game.regret_targets(rows, physical)
        progress = (seen + batch_count) / max(1, args.self_play_hands)
        strategy_weight = 0.0 if progress < args.average_strategy_warmup else progress**args.average_strategy_power
        end = cursor + batch_count
        if end <= reservoir_size:
            res_x[cursor:end] = rows
            res_y[cursor:end] = regrets
            res_strategy[cursor:end] = strategies
            res_strategy_weight[cursor:end] = strategy_weight
        else:
            first = reservoir_size - cursor
            res_x[cursor:] = rows[:first]
            res_y[cursor:] = regrets[:first]
            res_strategy[cursor:] = strategies[:first]
            res_strategy_weight[cursor:] = strategy_weight
            res_x[: end % reservoir_size] = rows[first:]
            res_y[: end % reservoir_size] = regrets[first:]
            res_strategy[: end % reservoir_size] = strategies[first:]
            res_strategy_weight[: end % reservoir_size] = strategy_weight
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
            validation_rows, validation_physical = sample_states(
                min(args.validation_samples, 32768),
                args.seed + 90_000 + iteration,
                histogram_hands=args.histogram_hands,
                histogram_rollouts=args.histogram_rollouts,
                showdown_rollouts=args.showdown_rollouts,
                return_physical=True,
            )
            validation = game.validation_metrics(validation_rows, validation_physical)
            print(
                "iteration="
                f"{iteration} self_play={seen}/{args.self_play_hands} "
                f"reservoir={filled} train_mse={np.mean(losses):.6f} "
                f"val_mse={validation['regret_mse']:.6f} "
                f"val_mae={validation['regret_mae']:.6f} "
                f"avg_pos_regret={validation['avg_positive_regret']:.6f}",
            )

    if args.average_strategy_steps > 0 and filled > 0:
        avg_optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr * 0.35, weight_decay=1e-4)
        for step in range(1, args.average_strategy_steps + 1):
            indices = np.random.default_rng(args.seed + 1_000_000 + step).integers(0, filled, size=args.batch_size)
            xb = torch.from_numpy(res_x[indices]).to(device, non_blocking=True)
            yb = torch.from_numpy(res_strategy[indices]).to(device, non_blocking=True)
            wb = torch.from_numpy(res_strategy_weight[indices]).to(device, non_blocking=True).clamp_min(0).unsqueeze(1)
            avg_optimizer.zero_grad(set_to_none=True)
            pred = model(xb)
            positive = torch.relu(pred) + 1e-5
            normalized = positive / positive.sum(dim=1, keepdim=True).clamp_min(1e-5)
            raw_loss = ((pred - yb) ** 2).mean(dim=1, keepdim=True)
            policy_loss = ((normalized - yb) ** 2).mean(dim=1, keepdim=True)
            loss = ((raw_loss + policy_loss) * wb).sum() / wb.sum().clamp_min(1e-5)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 3.0)
            avg_optimizer.step()
            if step == 1 or step % max(1, args.average_strategy_steps // 4) == 0 or step == args.average_strategy_steps:
                print(f"average_strategy_step={step}/{args.average_strategy_steps} mse={loss.item():.6f}")

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
    draw = behavior["flush_draw_raises_vs_bet"]
    value = behavior["value_bets"]
    river_nuts = behavior["river_nut_overbets"]
    gates.extend(
        [
            Gate("dry_blocker_bluff_bet_total", sum(dry[1:]) >= 0.18, sum(dry[1:]), ">= 0.18"),
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
            "averageStrategySteps": args.average_strategy_steps,
            "averageStrategyWarmup": args.average_strategy_warmup,
            "averageStrategyPower": args.average_strategy_power,
            "showdownRollouts": args.showdown_rollouts,
            "histogramHands": args.histogram_hands,
            "histogramRollouts": args.histogram_rollouts,
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
            "trainingTarget": "average-strategy-distilled-from-physical-regret",
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
    parser.add_argument("--self-play-hands", type=int, default=180_000)
    parser.add_argument("--reservoir-size", type=int, default=240_000)
    parser.add_argument("--rollout-batch", type=int, default=2048)
    parser.add_argument("--train-steps-per-iter", type=int, default=12)
    parser.add_argument("--validation-samples", type=int, default=24_000)
    parser.add_argument("--batch-size", type=int, default=2048)
    parser.add_argument("--hidden", type=int, default=96)
    parser.add_argument("--seed", type=int, default=20260625)
    parser.add_argument("--lr", type=float, default=0.0018)
    parser.add_argument("--blend", type=float, default=0.78)
    parser.add_argument("--regret-clip", type=float, default=2.4)
    parser.add_argument("--regret-decay", type=float, default=0.58)
    parser.add_argument("--average-strategy-steps", type=int, default=600)
    parser.add_argument("--average-strategy-warmup", type=float, default=0.25)
    parser.add_argument("--average-strategy-power", type=float, default=2.0)
    parser.add_argument("--showdown-rollouts", type=int, default=32)
    parser.add_argument("--histogram-hands", type=int, default=8)
    parser.add_argument("--histogram-rollouts", type=int, default=8)
    parser.add_argument("--max-regret-mse", type=float, default=0.6)
    parser.add_argument("--max-regret-mae", type=float, default=0.6)
    parser.add_argument("--max-positive-regret", type=float, default=1.35)
    parser.add_argument("--log-every", type=int, default=4)
    parser.add_argument("--device", default="cuda")
    parser.add_argument("--version", default="postflop-physical-rollout-regret-v2")
    parser.add_argument("--out", default="src/trained-policy-artifact.js")
    args = parser.parse_args()

    torch, nn, functional = import_torch()
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(args.seed)
    if args.device == "cuda" and not torch.cuda.is_available():
        args.device = "cpu"
    device = torch.device(args.device)
    print(f"device={device} cuda_devices={torch.cuda.device_count() if torch.cuda.is_available() else 0}")

    model = build_model(nn, args.hidden).to(device)
    if device.type == "cuda" and torch.cuda.device_count() > 1:
        model = nn.DataParallel(model)

    game, train_seconds = train_self_play(torch, functional, model, args, device)
    validation_rows, validation_physical = sample_states(
        args.validation_samples,
        args.seed + 1,
        histogram_hands=args.histogram_hands,
        histogram_rollouts=args.histogram_rollouts,
        showdown_rollouts=args.showdown_rollouts,
        return_physical=True,
    )
    validation = game.validation_metrics(validation_rows, validation_physical)
    behavior = predict_rows(game, gate_rows())
    gates = run_gates(validation, behavior, args)
    for gate in gates:
        print(f"gate {gate.name}: value={gate.value:.6f} threshold={gate.threshold} passed={gate.passed}")
    export_artifact(model, args, validation, behavior, gates, train_seconds, Path(args.out))
    print(f"exported {args.out}")


if __name__ == "__main__":
    main()
