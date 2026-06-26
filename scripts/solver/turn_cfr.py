#!/usr/bin/env python3
"""Exact heads-up turn->river two-street CFR(+) solver with exploitability.

Stage 2 of the GTO solver track (see docs/GTO_SOLVER.md). This extends the
river subgame solver to a genuine **two-street** game:

  - The turn board is 4 cards. Players bet on the turn.
  - When the turn action continues without a fold (check/check, bet/call), a
    real **chance node** deals the river card, and a full **river betting
    subgame** is played for every possible river card.
  - If the turn goes all-in, the remaining board is run out and the showdown
    uses the exact 2-card runout equity (average over all rivers).

It is a real equilibrium of the two-street game under the chosen (compact)
betting abstraction, and the distance to GTO is again the **exact**
best-response exploitability (fraction of pot / mbb-per-pot), now computed over
the full two-street tree including the river chance node.

The river chance is handled rigorously: from a player's own perspective the
river is uniform over the 46 cards unseen to that player (52 - 4 turn board -
2 own), and card-removal/blockers are masked per river card so impossible
holdings never contribute.

Run:
  python3 scripts/solver/turn_cfr.py --iterations 400 --max-combos 160
  python3 scripts/solver/turn_cfr.py --self-test
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import numpy as np

from river_cfr import (
    Node,
    OOP,
    IP,
    all_combos,
    build_tree,
    card_int,
    card_text,
    conflict_mask,
    parse_board,
    _combo_key,
)

np.seterr(over="ignore", invalid="ignore", divide="ignore")


# ----------------------------------------------------------------------------
# Two-street tree: reuse the single-street betting shape, then splice in the
# river chance node for turn showdowns that still have stack behind.
# ----------------------------------------------------------------------------


def _tag_river_terminals(node: Node, river_card: int, base: float):
    """Mark every terminal in a river subtree with the dealt river card and the
    `base` chips each player already put in on the turn. The river pot is
    turn_pot + 2*base, so terminal payoffs must add `base` (see _showdown_util /
    _fold_util) — otherwise turn bets are not rewarded at the river showdown."""
    if node.kind == "showdown":
        node.sign_kind = "river"
        node.river_card = river_card
        node.base = base
    elif node.kind == "fold":
        node.base = base
    for child in node.children:
        _tag_river_terminals(child, river_card, base)


def build_two_street(pot: float, stack: float, turn_bets: list[float],
                     river_bets: list[float], river_cards: list[int]) -> Node:
    """Turn betting shape with each non-all-in showdown spliced into a river
    chance node, and each all-in showdown turned into a runout showdown."""

    def splice(node: Node):
        new_children = []
        for child in node.children:
            if child.kind == "showdown":
                invested = child.invested
                if invested >= stack - 1e-9:
                    # turn all-in -> run it out (exact 2-card equity)
                    child.sign_kind = "runout"
                    new_children.append(child)
                else:
                    river_pot = pot + 2.0 * invested
                    river_stack = stack - invested
                    chance = Node(kind="chance")
                    chance.river_cards = list(river_cards)
                    chance.children = []
                    for r in river_cards:
                        sub = build_tree(river_pot, river_stack, river_bets)
                        _tag_river_terminals(sub, r, invested)
                        chance.children.append(sub)
                    new_children.append(chance)
            else:
                if child.kind == "decision":
                    splice(child)
                new_children.append(child)
        node.children = new_children

    root = build_tree(pot, stack, turn_bets)
    splice(root)
    return root


def index_decisions(root: Node) -> list[Node]:
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
# Solver
# ----------------------------------------------------------------------------


class TurnSolver:
    def __init__(self, turn_board: list[int], combos, reach_oop: np.ndarray,
                 reach_ip: np.ndarray, pot: float, stack: float,
                 turn_bets: list[float], river_bets: list[float]):
        self.board = turn_board
        self.combos = combos
        self.n = len(combos)
        self.pot = pot
        self.stack = stack
        self.reach_oop0 = reach_oop / max(reach_oop.sum(), 1e-12)
        self.reach_ip0 = reach_ip / max(reach_ip.sum(), 1e-12)
        self.valid = conflict_mask(combos, combos)  # symmetric, same combo set

        used = set(turn_board)
        self.river_cards = [c for c in range(52) if c not in used]

        # per-river-card sign matrix + "combo does not contain r" mask
        combo_arr = np.array(combos)
        self.sign_by_card: dict[int, np.ndarray] = {}
        self.notcontain: dict[int, np.ndarray] = {}
        sum_sign = np.zeros((self.n, self.n), dtype=np.float64)
        for r in self.river_cards:
            board5 = tuple(turn_board) + (r,)
            strength = np.array([_combo_key(tuple(c), board5) for c in combos], dtype=np.int64)
            nc = ~((combo_arr[:, 0] == r) | (combo_arr[:, 1] == r))  # combo doesn't use r
            ncf = nc.astype(np.float64)
            pair_ok = self.valid * np.outer(ncf, ncf)
            sign = np.sign(strength[:, None] - strength[None, :]) * pair_ok
            self.sign_by_card[r] = sign.astype(np.float32)
            self.notcontain[r] = ncf
            sum_sign += sign
        # exact all-in runout equity matrix: river uniform over 44 cards unseen
        # to BOTH players (52 - 4 board - 2 - 2). Blocked entries already zeroed.
        self.avg_sign = (sum_sign / 44.0).astype(np.float32)

        self.river_chance_weight = 1.0 / 46.0  # river unseen to one player

        self.root = build_two_street(pot, stack, turn_bets, river_bets, self.river_cards)
        self.nodes = index_decisions(self.root)
        self.regret = [np.zeros((self.n, len(nd.actions)), dtype=np.float64) for nd in self.nodes]
        self.strat_sum = [np.zeros((self.n, len(nd.actions)), dtype=np.float64) for nd in self.nodes]

    # --- strategies ---
    def _strategy(self, idx: int) -> np.ndarray:
        regret = np.maximum(self.regret[idx], 0.0)
        total = regret.sum(axis=1, keepdims=True)
        k = regret.shape[1]
        return np.where(total > 1e-12, regret / np.maximum(total, 1e-12), 1.0 / k)

    def average_strategy(self) -> list[np.ndarray]:
        out = []
        for s in self.strat_sum:
            total = s.sum(axis=1, keepdims=True)
            k = s.shape[1]
            out.append(np.where(total > 1e-12, s / np.maximum(total, 1e-12), 1.0 / k))
        return out

    # --- terminal payoffs (OOP perspective, zero-sum shifted by pot/2) ---
    def _sign_for(self, node: Node) -> np.ndarray:
        if node.sign_kind == "river":
            return self.sign_by_card[node.river_card]
        return self.avg_sign

    def _showdown_util(self, node: Node, reach_opp: np.ndarray, player: int) -> np.ndarray:
        sign = self._sign_for(node)
        base = getattr(node, "base", 0.0)  # turn-street chips folded into the river pot
        amount = self.pot / 2.0 + base + node.invested
        if player == OOP:
            return (sign @ reach_opp) * amount
        return -(reach_opp @ sign) * amount

    def _fold_util(self, node: Node, reach_opp: np.ndarray, player: int) -> np.ndarray:
        base = getattr(node, "base", 0.0)
        if node.folder == IP:
            g = self.pot / 2.0 + base + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + base + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _terminal(self, node: Node, reach_opp: np.ndarray, player: int) -> np.ndarray:
        if node.kind == "showdown":
            return self._showdown_util(node, reach_opp, player)
        return self._fold_util(node, reach_opp, player)

    # --- CFR ---
    def _cfr(self, node: Node, reach_oop: np.ndarray, reach_ip: np.ndarray):
        if node.kind == "fold" or node.kind == "showdown":
            return self._terminal(node, reach_ip, OOP), self._terminal(node, reach_oop, IP)

        if node.kind == "chance":
            uo = np.zeros(self.n)
            ui = np.zeros(self.n)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                nc = self.notcontain[r]
                cr_oop = reach_oop * nc * w
                cr_ip = reach_ip * nc * w
                cuo, cui = self._cfr(child, cr_oop, cr_ip)
                uo += cuo * nc
                ui += cui * nc
            return uo, ui

        # decision
        idx = node.index
        player = node.player
        strat = self._strategy(idx)
        own_reach = reach_oop if player == OOP else reach_ip
        k = len(node.actions)
        uo = np.zeros(self.n)
        ui = np.zeros(self.n)
        child_acting = np.zeros((self.n, k))
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(child, reach_oop * strat[:, a], reach_ip)
                uo += strat[:, a] * cuo
                ui += cui
                child_acting[:, a] = cuo
            else:
                cuo, cui = self._cfr(child, reach_oop, reach_ip * strat[:, a])
                uo += cuo
                ui += strat[:, a] * cui
                child_acting[:, a] = cui
        node_val = (strat * child_acting).sum(axis=1, keepdims=True)
        self.regret[idx] = np.maximum(self.regret[idx] + (child_acting - node_val), 0.0)
        self.strat_sum[idx] += own_reach[:, None] * strat
        return uo, ui

    # --- best response / exploitability ---
    def _br(self, node: Node, reach_opp: np.ndarray, br_player: int, avg) -> np.ndarray:
        if node.kind == "fold" or node.kind == "showdown":
            return self._terminal(node, reach_opp, br_player)
        if node.kind == "chance":
            total = np.zeros(self.n)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                nc = self.notcontain[r]
                total += self._br(child, reach_opp * nc * w, br_player, avg) * nc
            return total
        idx = node.index
        if node.player == br_player:
            vals = [self._br(child, reach_opp, br_player, avg) for child in node.children]
            return np.max(np.stack(vals, axis=1), axis=1)
        strat = avg[idx]
        total = np.zeros(self.n)
        for a, child in enumerate(node.children):
            total += self._br(child, reach_opp * strat[:, a], br_player, avg)
        return total

    def exploitability(self, avg) -> dict:
        br_oop = float((self.reach_oop0 * self._br(self.root, self.reach_ip0.copy(), OOP, avg)).sum())
        br_ip = float((self.reach_ip0 * self._br(self.root, self.reach_oop0.copy(), IP, avg)).sum())
        expl = br_oop + br_ip
        return {
            "br_oop": br_oop,
            "br_ip": br_ip,
            "exploitability_pot_frac": expl / self.pot,
            "exploitability_mbb": expl / self.pot * 1000.0,
        }

    def solve(self, iterations: int, log_every: int = 0) -> dict:
        history = []
        for t in range(1, iterations + 1):
            self._cfr(self.root, self.reach_oop0.copy(), self.reach_ip0.copy())
            if log_every and (t == 1 or t % log_every == 0 or t == iterations):
                m = self.exploitability(self.average_strategy())
                m["iteration"] = t
                history.append(m)
                print(f"iter={t:5d} exploitability={m['exploitability_pot_frac']*100:7.4f}% pot "
                      f"({m['exploitability_mbb']:8.2f} mbb/pot)")
        final = self.exploitability(self.average_strategy())
        return {"history": history, "final": final}


# ----------------------------------------------------------------------------
# CLI
# ----------------------------------------------------------------------------


def _top_combos(turn_board, combos, max_combos):
    """Rank combos by all-in runout equity vs the full field; keep the strongest
    `max_combos` for a tractable validation range (both players share it)."""
    used = set(turn_board)
    river_cards = [c for c in range(52) if c not in used]
    combo_arr = np.array(combos)
    valid = conflict_mask(combos, combos)
    sum_sign = np.zeros((len(combos), len(combos)))
    for r in river_cards:
        board5 = tuple(turn_board) + (r,)
        strength = np.array([_combo_key(tuple(c), board5) for c in combos], dtype=np.int64)
        nc = (~((combo_arr[:, 0] == r) | (combo_arr[:, 1] == r))).astype(np.float64)
        sign = np.sign(strength[:, None] - strength[None, :]) * valid * np.outer(nc, nc)
        sum_sign += sign
    equity = sum_sign.sum(axis=1)
    order = np.argsort(-equity)
    keep = order[:max_combos] if max_combos and max_combos < len(combos) else order
    keep = np.sort(keep)
    return [combos[i] for i in keep]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--board", default="Kh 9d 4s 2c", help="4-card turn board")
    parser.add_argument("--pot", type=float, default=10.0)
    parser.add_argument("--stack", type=float, default=15.0)
    parser.add_argument("--turn-bets", default="0.75")
    parser.add_argument("--river-bets", default="0.75")
    parser.add_argument("--iterations", type=int, default=400)
    parser.add_argument("--log-every", type=int, default=50)
    parser.add_argument("--max-combos", type=int, default=160,
                        help="cap combos per player for tractable local validation (0 = full)")
    parser.add_argument("--out", default="")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return _self_test()

    board = parse_board(args.board)
    assert len(board) == 4, "turn board must be 4 cards"
    turn_bets = [float(x) for x in args.turn_bets.split(",") if x]
    river_bets = [float(x) for x in args.river_bets.split(",") if x]

    combos = all_combos(board)
    if args.max_combos:
        combos = _top_combos(board, combos, args.max_combos)
    reach = np.ones(len(combos))
    print(f"board={[card_text(c) for c in board]} combos={len(combos)} pot={args.pot} "
          f"stack={args.stack} turn_bets={turn_bets} river_bets={river_bets}")
    solver = TurnSolver(board, combos, reach.copy(), reach.copy(), args.pot, args.stack,
                        turn_bets, river_bets)
    started = time.time()
    result = solver.solve(args.iterations, log_every=args.log_every)
    elapsed = time.time() - started
    final = result["final"]
    print(f"\nFINAL exploitability = {final['exploitability_pot_frac']*100:.4f}% of pot "
          f"({final['exploitability_mbb']:.2f} mbb/pot)  in {elapsed:.1f}s")

    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps({
            "board": [card_text(c) for c in board], "pot": args.pot, "stack": args.stack,
            "turn_bets": turn_bets, "river_bets": river_bets, "combos": len(combos),
            "iterations": args.iterations, "final": final, "history": result["history"],
        }, indent=2))
        print(f"wrote {out}")
    return 0


def _self_test() -> int:
    cases = [
        ("Kh 9d 4s 2c", 10.0, 15.0, [0.75], [0.75], 500, 120, 0.02),
        ("As Ks Qh 7d", 8.0, 12.0, [1.0], [0.75], 500, 120, 0.02),
    ]
    ok = True
    for board_text, pot, stack, tb, rb, iters, maxc, threshold in cases:
        board = parse_board(board_text)
        combos = _top_combos(board, all_combos(board), maxc)
        reach = np.ones(len(combos))
        solver = TurnSolver(board, combos, reach.copy(), reach.copy(), pot, stack, tb, rb)
        result = solver.solve(iters, log_every=0)
        expl = result["final"]["exploitability_pot_frac"]
        passed = expl < threshold
        ok = ok and passed
        print(f"[{'PASS' if passed else 'FAIL'}] board={board_text} combos={len(combos)} "
              f"iters={iters} exploitability={expl*100:.4f}% pot (threshold {threshold*100:.2f}%)")
    if not ok:
        print("turn_cfr self-test FAILED")
        return 1
    print("turn_cfr self-test passed")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
