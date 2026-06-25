#!/usr/bin/env python3
"""Exact heads-up river subgame CFR(+) solver with measurable exploitability.

This is the GTO measurement foundation for Texas GTO Lab. Unlike the heuristic
strategy engine, this solver computes a genuine Nash equilibrium for a fully
specified river subgame and measures how far the current strategy is from GTO
using an *exact* best-response calculation.

Key properties:
  - River = full information board (5 cards). No Monte Carlo: every showdown is
    deterministic, so equities are exact.
  - Each player's only private information is its 2 hole cards, so an information
    set is just a (hole-card combo) at each public decision node.
  - Card-removal / blockers are handled exactly via a per-combo conflict mask.
  - Strategy is solved with CFR+ (regret matching plus regret flooring) and the
    distance to GTO is reported as exploitability = (BR_oop + BR_ip), expressed
    as a fraction of the pot and in milli-big-blinds (mbb) per pot.

The betting abstraction is intentionally a compact-but-real river tree:
  OOP: check | bet(size in `bet_sizes`)
    after OOP check -> IP: check(showdown) | bet(size)
      after IP bet -> OOP: fold | call(showdown) | raise(all-in)
        after raise -> IP: fold | call(showdown)
    after OOP bet -> IP: fold | call(showdown) | raise(all-in)
      after raise -> OOP: fold | call(showdown)

Run:
  python3 scripts/solver/river_cfr.py --iterations 1000
"""

from __future__ import annotations

import argparse
import json
import time
from dataclasses import dataclass, field
from functools import lru_cache
from itertools import combinations
from pathlib import Path

import numpy as np

# macOS Accelerate BLAS emits spurious FP RuntimeWarnings inside float64 matmul
# (the results are correct). Silence them so solver logs stay readable.
np.seterr(over="ignore", invalid="ignore", divide="ignore")

RANK_TEXT = "23456789TJQKA"
SUIT_TEXT = "shdc"


def card_int(text: str) -> int:
    rank = RANK_TEXT.index(text[0])
    suit = SUIT_TEXT.index(text[1])
    return suit * 13 + rank


def card_text(card: int) -> str:
    return f"{RANK_TEXT[card % 13]}{SUIT_TEXT[card // 13]}"


def rank_of(card: int) -> int:
    return (card % 13) + 2


def suit_of(card: int) -> int:
    return card // 13


def _straight_high(ranks: list[int]) -> int:
    unique = sorted(set(ranks), reverse=True)
    if 14 in unique:
        unique = unique + [1]
    run = 1
    for i in range(1, len(unique)):
        if unique[i] == unique[i - 1] - 1:
            run += 1
            if run >= 5:
                return unique[i] + 4
        else:
            run = 1
    return 0


def _eval5(cards: tuple[int, ...]) -> tuple:
    ranks = sorted((rank_of(c) for c in cards), reverse=True)
    suits = [suit_of(c) for c in cards]
    counts: dict[int, int] = {}
    for r in ranks:
        counts[r] = counts.get(r, 0) + 1
    by_count = sorted(counts.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
    flush = len(set(suits)) == 1
    straight = _straight_high(ranks)
    if flush and straight:
        return (8, straight)
    if by_count[0][1] == 4:
        quad = by_count[0][0]
        kicker = max(r for r in ranks if r != quad)
        return (7, quad, kicker)
    if by_count[0][1] == 3 and by_count[1][1] >= 2:
        return (6, by_count[0][0], by_count[1][0])
    if flush:
        return (5, *ranks)
    if straight:
        return (4, straight)
    if by_count[0][1] == 3:
        trip = by_count[0][0]
        kick = [r for r in ranks if r != trip][:2]
        return (3, trip, *kick)
    if by_count[0][1] == 2 and by_count[1][1] == 2:
        hi, lo = sorted((by_count[0][0], by_count[1][0]), reverse=True)
        kick = max(r for r in ranks if r not in (hi, lo))
        return (2, hi, lo, kick)
    if by_count[0][1] == 2:
        pair = by_count[0][0]
        kick = [r for r in ranks if r != pair][:3]
        return (1, pair, *kick)
    return (0, *ranks)


@lru_cache(maxsize=200_000)
def eval7(cards: tuple[int, ...]) -> tuple:
    return max(_eval5(c) for c in combinations(sorted(cards), 5))


# ----------------------------------------------------------------------------
# Betting tree
# ----------------------------------------------------------------------------

OOP, IP = 0, 1


@dataclass
class Node:
    """A public decision node. `player` acts; `actions` lead to children."""

    kind: str  # "decision" | "showdown" | "fold"
    player: int = -1
    actions: list[str] = field(default_factory=list)
    children: list["Node"] = field(default_factory=list)
    invested: float = 0.0  # chips each player has in beyond starting pot at showdown
    folder: int = -1  # for fold nodes
    fold_invested_oop: float = 0.0
    fold_invested_ip: float = 0.0
    index: int = -1  # decision-node index (assigned later)


def build_tree(pot: float, stack: float, bet_sizes: list[float]) -> Node:
    """Build the compact river tree described in the module docstring.

    `bet_sizes` are pot fractions for the first bet/lead. Raises go all-in.
    All chip amounts are absolute (same units as `pot`).
    """

    def showdown(inv: float) -> Node:
        return Node(kind="showdown", invested=inv)

    def fold(folder: int, inv_oop: float, inv_ip: float) -> Node:
        return Node(kind="fold", folder=folder, fold_invested_oop=inv_oop, fold_invested_ip=inv_ip)

    def facing_bet(actor: int, bet: float, prior_inv: float) -> Node:
        """`actor` faces a bet of `bet` (chips) on top of `prior_inv` already in."""
        # raise goes all-in
        call_node = showdown(prior_inv + bet)
        fold_node = fold(actor, prior_inv + bet if actor == IP else prior_inv,
                         prior_inv + bet if actor == OOP else prior_inv) if False else None
        # invested-by-each at the bet: bettor has prior_inv+bet, caller has prior_inv (until acts)
        bettor = 1 - actor
        inv_bettor = prior_inv + bet
        inv_caller = prior_inv
        fold_node = Node(
            kind="fold", folder=actor,
            fold_invested_oop=inv_bettor if bettor == OOP else inv_caller,
            fold_invested_ip=inv_bettor if bettor == IP else inv_caller,
        )
        allin = stack
        raise_call = showdown(allin)
        raise_fold = Node(
            kind="fold", folder=bettor,
            fold_invested_oop=allin if actor == OOP else inv_bettor,
            fold_invested_ip=allin if actor == IP else inv_bettor,
        )
        raise_node = Node(kind="decision", player=bettor, actions=["fold", "call"],
                          children=[raise_fold, raise_call])
        node = Node(kind="decision", player=actor, actions=["fold", "call", "raise"],
                    children=[fold_node, showdown(inv_bettor), raise_node])
        return node

    # IP after OOP checks
    def ip_after_check() -> Node:
        children = [showdown(0.0)]  # IP checks back
        actions = ["check"]
        for frac in bet_sizes:
            bet = pot * frac
            actions.append(f"bet{frac:g}")
            children.append(facing_bet(OOP, bet, 0.0))
        return Node(kind="decision", player=IP, actions=actions, children=children)

    # IP after OOP bets
    def ip_after_bet(bet: float) -> Node:
        return facing_bet(IP, bet, 0.0)

    # root: OOP checks or bets
    children = [ip_after_check()]
    actions = ["check"]
    for frac in bet_sizes:
        bet = pot * frac
        actions.append(f"bet{frac:g}")
        children.append(ip_after_bet(bet))
    root = Node(kind="decision", player=OOP, actions=actions, children=children)
    return root


def index_nodes(root: Node) -> list[Node]:
    decisions: list[Node] = []

    def walk(node: Node):
        if node.kind == "decision":
            node.index = len(decisions)
            decisions.append(node)
            for child in node.children:
                walk(child)

    walk(root)
    return decisions


# ----------------------------------------------------------------------------
# Ranges
# ----------------------------------------------------------------------------


@dataclass
class Range:
    combos: list[tuple[int, int]]
    reach: np.ndarray  # prior probability weight per combo (sums to 1)
    strength: np.ndarray  # comparable hand value per combo (higher = better)


def all_combos(board: list[int]) -> list[tuple[int, int]]:
    used = set(board)
    deck = [c for c in range(52) if c not in used]
    return [(a, b) for a, b in combinations(deck, 2)]


def build_range(board: list[int], combos: list[tuple[int, int]], weights: np.ndarray) -> Range:
    board_t = tuple(board)
    strength = np.array([_combo_key(c, board_t) for c in combos], dtype=np.int64)
    reach = weights / max(weights.sum(), 1e-12)
    return Range(combos=combos, reach=reach, strength=strength)


@lru_cache(maxsize=400_000)
def _combo_key_cached(combo: tuple[int, int], board: tuple[int, ...]) -> int:
    key = eval7((*combo, *board))
    # pack tuple into a single sortable int: category then up to 5 tiebreakers
    packed = key[0]
    for v in key[1:6]:
        packed = packed * 16 + v
    packed = packed * (16 ** (6 - len(key)))
    return packed


def _combo_key(combo: tuple[int, int], board: tuple[int, ...]) -> int:
    return _combo_key_cached(combo, board)


def conflict_mask(combos_a: list[tuple[int, int]], combos_b: list[tuple[int, int]]) -> np.ndarray:
    """mask[i,j] = 1 if combo a_i and b_j share no card (a valid simultaneous deal)."""
    a = np.array(combos_a)
    b = np.array(combos_b)
    a0 = a[:, 0][:, None]
    a1 = a[:, 1][:, None]
    b0 = b[:, 0][None, :]
    b1 = b[:, 1][None, :]
    conflict = (a0 == b0) | (a0 == b1) | (a1 == b0) | (a1 == b1)
    return (~conflict).astype(np.float64)


# ----------------------------------------------------------------------------
# CFR
# ----------------------------------------------------------------------------


class RiverSolver:
    def __init__(self, board: list[int], range_oop: Range, range_ip: Range,
                 pot: float, stack: float, bet_sizes: list[float]):
        self.board = board
        self.pot = pot
        self.stack = stack
        self.ro = range_oop
        self.ri = range_ip
        self.no = len(range_oop.combos)
        self.ni = len(range_ip.combos)
        # valid[i,j] = 1 if oop combo i and ip combo j can coexist
        self.valid = conflict_mask(range_oop.combos, range_ip.combos)
        # showdown sign matrix from OOP perspective: +1 oop wins, 0 tie, -1 lose
        so = range_oop.strength[:, None]
        si = range_ip.strength[None, :]
        self.sign = np.sign(so - si).astype(np.float64) * self.valid
        self.root = build_tree(pot, stack, bet_sizes)
        self.nodes = index_nodes(self.root)
        n_nodes = len(self.nodes)
        # per decision node: regret + strategy-sum sized [combos_for_player, n_actions]
        self.regret = [np.zeros((self._n_for(node.player), len(node.actions))) for node in self.nodes]
        self.strat_sum = [np.zeros((self._n_for(node.player), len(node.actions))) for node in self.nodes]

    def _n_for(self, player: int) -> int:
        return self.no if player == OOP else self.ni

    def _strategy(self, idx: int) -> np.ndarray:
        regret = np.maximum(self.regret[idx], 0.0)
        total = regret.sum(axis=1, keepdims=True)
        n_actions = regret.shape[1]
        strat = np.where(total > 1e-12, regret / np.maximum(total, 1e-12), 1.0 / n_actions)
        return strat

    # --- terminal payoffs (OOP perspective, zero-sum shifted by pot/2) ---
    def _showdown_util_oop(self, reach_ip: np.ndarray, invested: float) -> np.ndarray:
        amount = self.pot / 2.0 + invested
        # util_oop[i] = sum_j reach_ip[j] * sign[i,j] * amount
        return (self.sign @ reach_ip) * amount

    def _showdown_util_ip(self, reach_oop: np.ndarray, invested: float) -> np.ndarray:
        amount = self.pot / 2.0 + invested
        # util_ip[j] = sum_i reach_oop[i] * (-sign[i,j]) * amount
        return -(reach_oop @ self.sign) * amount

    def _fold_util(self, node: Node, reach_opp: np.ndarray, player: int):
        """Return util for the requested player at a fold terminal."""
        # OOP net = +pot/2 + fold_invested_ip if IP folded, else -fold_invested_oop ... shifted.
        if node.folder == IP:
            g_oop_scalar = self.pot / 2.0 + node.fold_invested_ip
        else:  # OOP folded
            g_oop_scalar = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            # util_oop[i] = sum_j reach_ip[j]*valid[i,j]*g_oop_scalar
            return (self.valid @ reach_opp) * g_oop_scalar
        else:
            # util_ip[j] = sum_i reach_oop[i]*valid[i,j]*(-g_oop_scalar)
            return (reach_opp @ self.valid) * (-g_oop_scalar)

    def _terminal_util(self, node: Node, reach_opp: np.ndarray, player: int) -> np.ndarray:
        if node.kind == "showdown":
            if player == OOP:
                return self._showdown_util_oop(reach_opp, node.invested)
            return self._showdown_util_ip(reach_opp, node.invested)
        return self._fold_util(node, reach_opp, player)

    def _cfr(self, node: Node, reach_oop: np.ndarray, reach_ip: np.ndarray):
        """Vectorized CFR. Returns (util_oop[no], util_ip[ni]) counterfactual values."""
        if node.kind != "decision":
            uo = self._terminal_util(node, reach_ip, OOP)
            ui = self._terminal_util(node, reach_oop, IP)
            return uo, ui

        idx = node.index
        player = node.player
        strat = self._strategy(idx)  # [n_player, n_actions]
        own_reach = reach_oop if player == OOP else reach_ip
        n_actions = len(node.actions)

        util_oop = np.zeros(self.no)
        util_ip = np.zeros(self.ni)
        child_util_acting = np.zeros((self._n_for(player), n_actions))

        for a, child in enumerate(node.children):
            if player == OOP:
                cr_oop = reach_oop * strat[:, a]
                cr_ip = reach_ip
            else:
                cr_oop = reach_oop
                cr_ip = reach_ip * strat[:, a]
            cuo, cui = self._cfr(child, cr_oop, cr_ip)
            util_oop += cuo if player != OOP else strat[:, a] * cuo
            util_ip += cui if player != IP else strat[:, a] * cui
            child_util_acting[:, a] = cuo if player == OOP else cui

        # node value for acting player
        node_val = (strat * child_util_acting).sum(axis=1, keepdims=True)
        regret = child_util_acting - node_val
        # CFR+: floor cumulative regret at 0
        self.regret[idx] = np.maximum(self.regret[idx] + regret, 0.0)
        self.strat_sum[idx] += own_reach[:, None] * strat
        return util_oop, util_ip

    def average_strategy(self) -> list[np.ndarray]:
        out = []
        for s in self.strat_sum:
            total = s.sum(axis=1, keepdims=True)
            n_actions = s.shape[1]
            out.append(np.where(total > 1e-12, s / np.maximum(total, 1e-12), 1.0 / n_actions))
        return out

    # --- best response / exploitability ---
    def _br(self, node: Node, reach_opp: np.ndarray, br_player: int, avg: list[np.ndarray]) -> np.ndarray:
        """Counterfactual value vector for br_player's combos under exact best response
        against the opponent playing fixed `avg` strategy."""
        if node.kind != "decision":
            return self._terminal_util(node, reach_opp, br_player)

        idx = node.index
        if node.player == br_player:
            vals = []
            for child in node.children:
                vals.append(self._br(child, reach_opp, br_player, avg))
            # best response: pick max over actions per combo
            return np.max(np.stack(vals, axis=1), axis=1)
        else:
            strat = avg[idx]  # opponent fixed strategy [n_opp, n_actions]
            total = np.zeros(self._n_for(br_player))
            for a, child in enumerate(node.children):
                child_reach = reach_opp * strat[:, a]
                total += self._br(child, child_reach, br_player, avg)
            return total

    def exploitability(self, avg: list[np.ndarray]) -> dict:
        # BR value for OOP best-responding vs IP avg
        br_oop_vec = self._br(self.root, self.ri.reach.copy(), OOP, avg)
        br_oop = float((self.ro.reach * br_oop_vec).sum())
        br_ip_vec = self._br(self.root, self.ro.reach.copy(), IP, avg)
        br_ip = float((self.ri.reach * br_ip_vec).sum())
        expl = br_oop + br_ip  # >= 0, -> 0 at equilibrium (zero-sum shifted)
        return {
            "br_oop": br_oop,
            "br_ip": br_ip,
            "exploitability_chips": expl,
            "exploitability_pot_frac": expl / self.pot,
            "exploitability_mbb": expl / self.pot * 1000.0,  # if pot measured in bb
        }

    def solve(self, iterations: int, log_every: int = 0) -> dict:
        history = []
        for t in range(1, iterations + 1):
            self._cfr(self.root, self.ro.reach.copy(), self.ri.reach.copy())
            if log_every and (t == 1 or t % log_every == 0 or t == iterations):
                avg = self.average_strategy()
                metric = self.exploitability(avg)
                metric["iteration"] = t
                history.append(metric)
                print(
                    f"iter={t:5d} exploitability={metric['exploitability_pot_frac']*100:7.4f}% pot "
                    f"({metric['exploitability_mbb']:8.2f} mbb/pot)"
                )
        avg = self.average_strategy()
        final = self.exploitability(avg)
        return {"history": history, "final": final, "avg": avg}


# ----------------------------------------------------------------------------
# CLI / demo
# ----------------------------------------------------------------------------


def parse_board(text: str) -> list[int]:
    parts = text.replace(",", " ").split()
    return [card_int(p) for p in parts]


def run_self_test() -> int:
    """Deterministic convergence guard for local validation.

    Solves a fixed river subgame and asserts CFR+ drives exploitability well
    below 1% of pot. Returns a process exit code (0 = pass).
    """
    cases = [
        ("Kh 9d 4s 2c 7h", 10.0, 20.0, [0.5, 1.0], 1500, 0.006),
        ("As Ks Qh 7d 2c", 6.0, 12.0, [0.75], 1500, 0.006),
    ]
    ok = True
    for board_text, pot, stack, bets, iters, threshold in cases:
        board = parse_board(board_text)
        combos = all_combos(board)
        weights = np.ones(len(combos))
        rng_oop = build_range(board, combos, weights.copy())
        rng_ip = build_range(board, combos, weights.copy())
        solver = RiverSolver(board, rng_oop, rng_ip, pot, stack, bets)
        result = solver.solve(iters, log_every=0)
        expl = result["final"]["exploitability_pot_frac"]
        passed = expl < threshold
        ok = ok and passed
        status = "PASS" if passed else "FAIL"
        print(f"[{status}] board={board_text} iters={iters} "
              f"exploitability={expl*100:.4f}% pot (threshold {threshold*100:.3f}%)")
    if not ok:
        print("river_cfr self-test FAILED")
        return 1
    print("river_cfr self-test passed")
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--board", default="Kh 9d 4s 2c 7h", help="5-card river board")
    parser.add_argument("--pot", type=float, default=10.0)
    parser.add_argument("--stack", type=float, default=20.0)
    parser.add_argument("--bet-sizes", default="0.5,1.0", help="comma list of pot fractions")
    parser.add_argument("--iterations", type=int, default=500)
    parser.add_argument("--log-every", type=int, default=50)
    parser.add_argument("--oop-frac", type=float, default=1.0, help="OOP range width (top fraction of combos)")
    parser.add_argument("--ip-frac", type=float, default=1.0, help="IP range width")
    parser.add_argument("--out", default="")
    parser.add_argument("--self-test", action="store_true",
                        help="assert the solver converges below a threshold and exit")
    args = parser.parse_args()

    if args.self_test:
        return run_self_test()

    board = parse_board(args.board)
    assert len(board) == 5, "river board must be 5 cards"
    bet_sizes = [float(x) for x in args.bet_sizes.split(",") if x]

    combos = all_combos(board)
    board_t = tuple(board)
    strengths = np.array([_combo_key(c, board_t) for c in combos])
    order = np.argsort(-strengths)

    def top_fraction_weights(frac: float) -> np.ndarray:
        w = np.zeros(len(combos))
        keep = max(1, int(len(combos) * frac))
        w[order[:keep]] = 1.0
        return w

    range_oop = build_range(board, combos, top_fraction_weights(args.oop_frac))
    range_ip = build_range(board, combos, top_fraction_weights(args.ip_frac))

    print(f"board={[card_text(c) for c in board]} combos={len(combos)} pot={args.pot} stack={args.stack} "
          f"bets={bet_sizes}")
    solver = RiverSolver(board, range_oop, range_ip, args.pot, args.stack, bet_sizes)
    started = time.time()
    result = solver.solve(args.iterations, log_every=args.log_every)
    elapsed = time.time() - started
    final = result["final"]
    print(f"\nFINAL exploitability = {final['exploitability_pot_frac']*100:.4f}% of pot "
          f"({final['exploitability_mbb']:.2f} mbb/pot)  in {elapsed:.1f}s")
    print(f"  BR_oop={final['br_oop']:.4f}  BR_ip={final['br_ip']:.4f} chips")

    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "board": [card_text(c) for c in board],
            "pot": args.pot, "stack": args.stack, "bet_sizes": bet_sizes,
            "iterations": args.iterations, "final": final,
            "history": result["history"],
        }
        out.write_text(json.dumps(payload, indent=2))
        print(f"wrote {out}")


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
