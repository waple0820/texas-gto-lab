#!/usr/bin/env python3
"""Multi-raise river betting tree → 5-action facing decisions for distillation.

The core build_tree offers a single all-in raise (facing set [fold, call,
raise]). To distill FACING decisions onto the artifact's action set
[fold, call, raise-small, raise-big, jam], we need a tree with multiple raise
sizes. This builds that tree in isolation (no change to the validated build_tree)
and solves it by feeding the tree into RiverSolver(..., tree=...).

Shape (OOP first; raises bounded to one re-raise then jam, to cap depth):
  OOP: check | bet(size)
    OOP check -> IP: check(showdown) | bet -> OOP faces bet
    OOP bet -> IP faces bet
  faces bet -> [fold, call, raise-small, raise-big, jam]
    raise-small/big -> bettor faces re-raise: [fold, call, jam]
      jam -> raiser faces all-in: [fold, call]
    jam -> bettor faces all-in: [fold, call]

Run:
  python3 scripts/solver/multiraise_tree.py --self-test
"""

from __future__ import annotations

import argparse

import numpy as np

from river_cfr import Node, OOP, IP, RiverSolver, build_range, all_combos, parse_board, card_text

np.seterr(over="ignore", invalid="ignore", divide="ignore")

OPEN_LABELS = ["check", "bet-small", "bet-mid", "bet-big", "bet-over"]
FACING_LABELS = ["fold", "call", "raise-small", "raise-big", "jam"]


def build_multiraise_betting(pot, stack, bet_sizes, raise_mults, make_continue, make_allin):
    """One OOP-first betting round with the 5-action facing set (one re-raise then
    jam). Terminals are produced by callbacks so the same round serves any street:
      make_continue(invested) -> terminal/subtree when both match with stack behind
                                  (check/check, call, re-raise call)
      make_allin(invested)    -> terminal/subtree when the line is all-in
    For the river both callbacks return a showdown; for the turn, make_continue
    returns the next-street subgame and make_allin a runout.
    """
    def fold(folder, inv_oop, inv_ip):
        return Node(kind="fold", folder=folder, fold_invested_oop=float(inv_oop), fold_invested_ip=float(inv_ip))

    def inv_pair(a, a_inv, b_inv):
        return (a_inv, b_inv) if a == OOP else (b_inv, a_inv)

    def faces_allin(responder, allin_inv, responder_inv):
        opp = 1 - responder
        io, ii = inv_pair(opp, allin_inv, responder_inv)
        return Node(kind="decision", player=responder, actions=["fold", "call"],
                    children=[fold(responder, io, ii), make_allin(allin_inv)])

    def faces_reraise(responder, raise_to, responder_inv):
        opp = 1 - responder
        io, ii = inv_pair(opp, raise_to, responder_inv)
        children = [fold(responder, io, ii), make_continue(raise_to)]
        actions = ["fold", "call"]
        if raise_to < stack - 1e-9:
            actions.append("jam")
            children.append(faces_allin(opp, stack, raise_to))
        return Node(kind="decision", player=responder, actions=actions, children=children)

    def faces_bet(actor, bet, prior_inv):
        bettor = 1 - actor
        inv_bettor = prior_inv + bet
        inv_caller = prior_inv
        io, ii = inv_pair(bettor, inv_bettor, inv_caller)
        children = [fold(actor, io, ii), make_continue(inv_bettor)]
        actions = ["fold", "call"]
        raise_tos = []
        for mult in raise_mults:
            r = min(stack, inv_bettor + mult * bet)
            if r > inv_bettor + 1e-9 and r < stack - 1e-9 and (not raise_tos or r > raise_tos[-1] + 1e-9):
                raise_tos.append(r)
        for i, r in enumerate(raise_tos[:2]):
            actions.append(["raise-small", "raise-big"][i])
            children.append(faces_reraise(bettor, r, inv_bettor))
        actions.append("jam")
        children.append(faces_allin(bettor, stack, inv_bettor))
        return Node(kind="decision", player=actor, actions=actions, children=children)

    def opener(player):
        children = [make_continue(0.0)] if player == IP else [_ip_after_check()]
        # OOP opener: check -> IP decision; IP opener (after OOP check): check -> continue
        actions = ["check"]
        for frac in bet_sizes:
            actions.append(f"bet{frac:g}")
            children.append(faces_bet(1 - player, pot * frac, 0.0))  # opponent faces the bet
        node = Node(kind="decision", player=player, actions=actions, children=children)
        node.pot_ctx = pot
        node.to_call_ctx = 0.0
        return node

    def _ip_after_check():
        return opener(IP)

    root = opener(OOP)
    return root


def build_multiraise_river(pot, stack, bet_sizes, raise_mults=(2.0, 4.0)):
    def showdown(inv):
        return Node(kind="showdown", invested=float(inv))

    return build_multiraise_betting(pot, stack, bet_sizes, raise_mults, showdown, showdown)


def solve_multiraise(board, pot, stack, bet_sizes, iterations, raise_mults=(2.0, 4.0)):
    combos = all_combos(board)
    w = np.ones(len(combos))
    ro = build_range(board, combos, w.copy())
    ri = build_range(board, combos, w.copy())
    tree = build_multiraise_river(pot, stack, bet_sizes, raise_mults)
    solver = RiverSolver(board, ro, ri, pot, stack, bet_sizes, tree=tree)
    result = solver.solve(iterations, log_every=0)
    return solver, result


def _self_test():
    ok = True
    cases = [
        ("Kh 9d 4s 2c 7h", 10.0, 40.0, [0.66], 2500, 0.012),
        ("As Ks Qh 7d 2c", 8.0, 32.0, [0.75], 2500, 0.012),
    ]
    for board_text, pot, stack, bets, iters, thr in cases:
        board = parse_board(board_text)
        solver, result = solve_multiraise(board, pot, stack, bets, iters)
        expl = result["final"]["exploitability_pot_frac"]
        # locate a facing node and confirm it has the 5-action set
        facing = next((nd for nd in solver.nodes if list(nd.actions)[:2] == ["fold", "call"]
                       and len(nd.actions) == 5), None)
        passed = expl < thr and facing is not None
        ok = ok and passed
        print(f"[{'PASS' if passed else 'FAIL'}] {board_text} stack={stack} "
              f"exploitability={expl*100:.4f}% pot (thr {thr*100:.1f}%) "
              f"facing5={'yes' if facing else 'NO'} nodes={len(solver.nodes)}")
    print("multiraise self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--board", default="Kh 9d 4s 2c 7h")
    parser.add_argument("--pot", type=float, default=10.0)
    parser.add_argument("--stack", type=float, default=40.0)
    parser.add_argument("--bet-sizes", default="0.66")
    parser.add_argument("--iterations", type=int, default=3000)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return _self_test()
    board = parse_board(args.board)
    bets = [float(x) for x in args.bet_sizes.split(",") if x]
    solver, result = solve_multiraise(board, args.pot, args.stack, bets, args.iterations)
    print(f"board={[card_text(c) for c in board]} nodes={len(solver.nodes)} "
          f"exploitability={result['final']['exploitability_pot_frac']*100:.4f}% pot")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
