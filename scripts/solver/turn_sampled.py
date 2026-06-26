#!/usr/bin/env python3
"""Turn solver via river-sampled MCCFR — tractable turn GTO for distillation.

Full-range enumerated turn solving (turn_cfr) is too slow to generate a dataset
(48-way river enumeration per node, minutes per board). This samples the river
card each iteration instead: the tree is turn betting -> river betting on the
sampled 5-card board (multiraise on both streets, 5-action open + facing), so each
iteration is a cheap single-board pass. Turn nodes accumulate regret keyed by node
(averaged over sampled rivers); river nodes are keyed by (node, river card).

Cross-street pots are handled: river terminals carry `base` = turn-street
investment, so amount = pot/2 + base + invested (see the turn_cfr fix). Showdowns
use the sampled river's sign matrix.

Distance to GTO is an exact enumerated best response over all river cards.

Run:
  python3 scripts/solver/turn_sampled.py --self-test
  python3 scripts/solver/turn_sampled.py --board "Kh 9d 4s 2c" --iterations 4000
"""

from __future__ import annotations

import argparse

import numpy as np

from river_cfr import Node, OOP, IP, all_combos, conflict_mask, parse_board, card_text, _combo_key
from multiraise_tree import build_multiraise_betting, FACING_LABELS

np.seterr(over="ignore", invalid="ignore", divide="ignore")


def _tag_street(node, street):
    if node.kind == "decision" and getattr(node, "street", None) is None:
        node.street = street
    for c in node.children:
        _tag_street(c, street)


def _tag_base(node, base):
    if node.kind in ("showdown", "fold"):
        node.base = base
    for c in node.children:
        _tag_base(c, base)


def build_turn_tree(pot, stack, turn_bets, river_bets, raise_mults=(2.0, 4.0)):
    def showdown(inv):
        return Node(kind="showdown", invested=float(inv))

    def river_subgame(turn_inv):
        sub = build_multiraise_betting(pot + 2.0 * turn_inv, stack - turn_inv,
                                       river_bets, raise_mults, showdown, showdown)
        _tag_street(sub, "river")
        _tag_base(sub, turn_inv)  # river pot = turn_pot + 2*turn_inv
        return sub

    root = build_multiraise_betting(pot, stack, turn_bets, raise_mults, river_subgame, showdown)
    _tag_street(root, "turn")
    return root


def index_decisions(root):
    out = []

    def walk(n):
        if n.kind == "decision":
            n.index = len(out)
            out.append(n)
        for c in n.children:
            walk(c)

    walk(root)
    return out


class TurnSampledSolver:
    def __init__(self, turn_board, combos, reach, pot, stack, turn_bets, river_bets,
                 raise_mults=(2.0, 4.0), seed=0):
        self.board = turn_board
        self.combos = combos
        self.combo_arr = np.array(combos)
        self.n = len(combos)
        self.pot = pot
        self.reach0 = reach / max(reach.sum(), 1e-12)
        self.valid = conflict_mask(combos, combos)
        self.rng = np.random.default_rng(seed)
        self.deck = [c for c in range(52) if c not in set(turn_board)]
        self.river_chance_weight = 1.0 / 46.0
        self.root = build_turn_tree(pot, stack, turn_bets, river_bets, raise_mults)
        self.nodes = index_decisions(self.root)
        self.regret = {}
        self.strat_sum = {}
        self._sign = {}
        self._nc = {}

    def _notcontain(self, r):
        nc = self._nc.get(r)
        if nc is None:
            nc = (~((self.combo_arr[:, 0] == r) | (self.combo_arr[:, 1] == r))).astype(np.float64)
            self._nc[r] = nc
        return nc

    def _sign_for(self, r):
        s = self._sign.get(r)
        if s is None:
            board5 = tuple(self.board) + (r,)
            strength = np.array([_combo_key(tuple(c), board5) for c in self.combos], dtype=np.int64)
            s = (np.sign(strength[:, None] - strength[None, :]) * self.valid).astype(np.float32)
            self._sign[r] = s
        return s

    def _key(self, node, r):
        return (node.index,) if node.street == "turn" else (node.index, r)

    def _terminal(self, node, reach_opp, player, sign):
        base = getattr(node, "base", 0.0)
        if node.kind == "showdown":
            amount = self.pot / 2.0 + base + node.invested
            if player == OOP:
                return (sign @ reach_opp) * amount
            return -(reach_opp @ sign) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + base + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + base + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _cfr(self, node, reach_oop, reach_ip, r, sign):
        if node.kind != "decision":
            return self._terminal(node, reach_ip, OOP, sign), self._terminal(node, reach_oop, IP, sign)
        key = self._key(node, r)
        k = len(node.actions)
        reg = self.regret.get(key)
        if reg is None:
            reg = np.zeros((self.n, k))
            self.regret[key] = reg
            self.strat_sum[key] = np.zeros((self.n, k))
        pos = np.maximum(reg, 0.0)
        tot = pos.sum(axis=1, keepdims=True)
        strat = np.where(tot > 1e-12, pos / np.maximum(tot, 1e-12), 1.0 / k)
        player = node.player
        own = reach_oop if player == OOP else reach_ip
        uo = np.zeros(self.n)
        ui = np.zeros(self.n)
        ca = np.zeros((self.n, k))
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(child, reach_oop * strat[:, a], reach_ip, r, sign)
                uo += strat[:, a] * cuo
                ui += cui
                ca[:, a] = cuo
            else:
                cuo, cui = self._cfr(child, reach_oop, reach_ip * strat[:, a], r, sign)
                uo += cuo
                ui += strat[:, a] * cui
                ca[:, a] = cui
        node_val = (strat * ca).sum(axis=1, keepdims=True)
        self.regret[key] = np.maximum(reg + (ca - node_val), 0.0)
        self.strat_sum[key] += own[:, None] * strat
        return uo, ui

    def step(self):
        r = self.deck[self.rng.integers(0, len(self.deck))]
        nc = self._notcontain(r)
        reach = self.reach0 * nc
        self._cfr(self.root, reach.copy(), reach.copy(), r, self._sign_for(r))

    def average_strategy(self):
        out = {}
        for key, s in self.strat_sum.items():
            tot = s.sum(axis=1, keepdims=True)
            k = s.shape[1]
            out[key] = np.where(tot > 1e-12, s / np.maximum(tot, 1e-12), 1.0 / k)
        return out

    def _avg(self, avg, key, k):
        return avg.get(key, np.full((self.n, k), 1.0 / k))

    def _br(self, node, reach_opp, br_player, r, sign, avg):
        if node.kind != "decision":
            return self._terminal(node, reach_opp, br_player, sign)
        key = self._key(node, r)
        k = len(node.actions)
        if node.player == br_player:
            vals = [self._br(c, reach_opp, br_player, r, sign, avg) for c in node.children]
            return np.max(np.stack(vals, axis=1), axis=1)
        strat = self._avg(avg, key, k)
        total = np.zeros(self.n)
        for a, child in enumerate(node.children):
            total += self._br(child, reach_opp * strat[:, a], br_player, r, sign, avg)
        return total

    def exploitability(self, avg=None):
        if avg is None:
            avg = self.average_strategy()
        w = self.river_chance_weight
        bo = np.zeros(self.n)
        bi = np.zeros(self.n)
        for r in self.deck:
            nc = self._notcontain(r)
            sign = self._sign_for(r)
            base = self.reach0 * nc * w
            bo += self._br(self.root, base.copy(), OOP, r, sign, avg) * nc
            bi += self._br(self.root, base.copy(), IP, r, sign, avg) * nc
        vo = float((self.reach0 * bo).sum())
        vi = float((self.reach0 * bi).sum())
        expl = vo + vi
        return {"exploitability_pot_frac": expl / self.pot, "exploitability_mbb": expl / self.pot * 1000.0}

    def solve(self, iterations, expl_every=0):
        history = []
        for it in range(1, iterations + 1):
            self.step()
            if expl_every and (it % expl_every == 0 or it == iterations):
                m = self.exploitability()
                m["iteration"] = it
                history.append(m)
                print(f"iter={it:6d} exploitability={m['exploitability_pot_frac']*100:7.4f}% pot")
        return {"history": history, "final": self.exploitability()}

    def turn_open_strategy(self):
        return self.average_strategy()[(self.root.index,)]

    def turn_facing_node(self):
        for nd in self.nodes:
            if nd.street == "turn" and list(nd.actions) == FACING_LABELS:
                return nd
        return None


def _build(board_text, pot, stack, tb, rb, max_combos, seed):
    board = parse_board(board_text)
    combos = all_combos(board)
    if max_combos and max_combos < len(combos):
        # rank by all-in runout equity (avg over rivers) for a tractable validation range
        rng = np.random.default_rng(3)
        deck = [c for c in range(52) if c not in set(board)]
        ca = np.array(combos)
        valid = conflict_mask(combos, combos)
        acc = np.zeros((len(combos), len(combos)))
        for _ in range(40):
            r = deck[rng.integers(0, len(deck))]
            b5 = tuple(board) + (r,)
            st = np.array([_combo_key(tuple(c), b5) for c in combos], dtype=np.int64)
            nc = (~((ca[:, 0] == r) | (ca[:, 1] == r))).astype(np.float64)
            acc += np.sign(st[:, None] - st[None, :]) * valid * np.outer(nc, nc)
        keep = np.sort(np.argsort(-acc.sum(1))[:max_combos])
        combos = [combos[i] for i in keep]
    reach = np.ones(len(combos))
    return board, TurnSampledSolver(board, combos, reach, pot, stack, tb, rb, seed=seed)


def _self_test():
    board, solver = _build("Kh 9d 4s 2c", 10.0, 40.0, [0.66], [0.75], 40, seed=11)
    start = solver.exploitability()["exploitability_pot_frac"]
    mid = solver.solve(500, expl_every=0)["final"]["exploitability_pot_frac"]
    end = solver.solve(700, expl_every=0)["final"]["exploitability_pot_frac"]
    facing = solver.turn_facing_node()
    ok = end < start * 0.5 and end < mid and end < 0.2 and facing is not None
    print(f"[{'PASS' if ok else 'FAIL'}] turn-sampled convergence: start={start*100:.1f}% "
          f"-> 500it={mid*100:.1f}% -> 1200it={end*100:.1f}% pot; open5={list(solver.root.actions)==['check','bet0.66']or len(solver.root.actions)==5}; "
          f"facing5={'yes' if facing else 'NO'}")
    print("turn_sampled self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--board", default="Kh 9d 4s 2c")
    p.add_argument("--pot", type=float, default=10.0)
    p.add_argument("--stack", type=float, default=40.0)
    p.add_argument("--turn-bets", default="0.33,0.66,1.0,1.5")
    p.add_argument("--river-bets", default="0.75")
    p.add_argument("--iterations", type=int, default=4000)
    p.add_argument("--expl-every", type=int, default=1000)
    p.add_argument("--max-combos", type=int, default=80)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        return _self_test()
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]
    board, solver = _build(args.board, args.pot, args.stack, tb, rb, args.max_combos, args.seed)
    print(f"board={[card_text(c) for c in board]} combos={solver.n} nodes={len(solver.nodes)} "
          f"turn_open_actions={solver.root.actions}")
    result = solver.solve(args.iterations, expl_every=args.expl_every)
    print(f"FINAL exploitability={result['final']['exploitability_pot_frac']*100:.4f}% pot")
    print(f"mean turn open dist={np.round(solver.turn_open_strategy().mean(0), 3)}")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
