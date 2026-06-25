#!/usr/bin/env python3
"""Heads-up flop->turn->river three-street solver (turn-sampled, river-exact).

Stage 4 of the GTO solver track. Full three-street enumeration is ~10^5 tree
nodes, intractable to materialize. Sampling BOTH the turn and river converges far
too slowly: the river information sets are keyed by (turn, river), so ~2300 of
them each get visited about once and never train.

So this solver samples only the **turn** card and enumerates the **river**
exactly (reusing the two-street turn solver). Each iteration:

  - sample one turn card t (the post-flop deck), mask combos that contain it;
  - run vectorized CFR+ over flop betting -> turn betting -> river chance
    (every river card enumerated) -> river betting -> showdown, exactly as the
    turn solver does, but with the flop betting wrapped on top;
  - information sets: flop nodes keyed by node; turn/river nodes keyed by
    (node, turn) and (node, turn, river).

Because the river is enumerated, every turn-card subgame is solved well per
visit, so a turn infoset is trained every time its card is sampled (~iters/49),
which converges in thousands of iterations rather than millions.

Distance to GTO is an **exact enumerated best response** over all turn/river
cards (per-player chance weights, exact blocker masks) — the same method
validated in the river/turn solvers. The falling exploitability is the
correctness signal.

Run:
  python3 scripts/solver/flop_mccfr.py --iterations 4000 --max-combos 60
  python3 scripts/solver/flop_mccfr.py --self-test
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import numpy as np

from river_cfr import Node, OOP, IP, build_tree, card_text, conflict_mask, parse_board, _combo_key
from turn_cfr import build_two_street

np.seterr(over="ignore", invalid="ignore", divide="ignore")


# ----------------------------------------------------------------------------
# Tree: flop betting wraps the two-street turn subgame (turn betting + river
# chance + river betting). The turn card is sampled; the river is enumerated.
# ----------------------------------------------------------------------------


def _tag_flop(node: Node):
    if node.kind == "decision" and getattr(node, "street", None) is None:
        node.street = "flop"
    for child in node.children:
        _tag_flop(child)


def _tag_subgame(node: Node):
    # turn/river decisions inside the two-street subgame
    if node.kind == "decision" and getattr(node, "street", None) is None:
        node.street = "sub"
    for child in node.children:
        _tag_subgame(child)


def build_flop_tree(pot, stack, flop_bets, turn_bets, river_bets, river_cards):
    def turn_subgame(p, s):
        root = build_two_street(p, s, turn_bets, river_bets, river_cards)
        _tag_subgame(root)
        return root

    root = build_tree(pot, stack, flop_bets)
    _tag_flop(root)

    def splice(node):
        new_children = []
        for child in node.children:
            if child.kind == "showdown":
                if child.invested >= stack - 1e-9:
                    child.sign_kind = "runout"  # flop all-in -> turn+river runout
                    new_children.append(child)
                else:
                    new_children.append(turn_subgame(pot + 2.0 * child.invested, stack - child.invested))
            elif child.kind == "decision" and getattr(child, "street", None) == "flop":
                splice(child)
                new_children.append(child)
            else:
                new_children.append(child)
        node.children = new_children

    splice(root)
    return root


def index_decisions(root: Node):
    decisions = []

    def walk(node):
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


class FlopSolver:
    def __init__(self, flop_board, combos, reach, pot, stack,
                 flop_bets, turn_bets, river_bets, seed=0):
        self.flop = flop_board
        self.combos = combos
        self.combo_arr = np.array(combos)
        self.n = len(combos)
        self.pot = pot
        self.stack = stack
        self.reach0 = reach / max(reach.sum(), 1e-12)
        self.valid = conflict_mask(combos, combos)
        self.rng = np.random.default_rng(seed)
        self.deck = [c for c in range(52) if c not in set(flop_board)]
        self.river_chance_weight = 1.0 / 46.0

        self.root = build_flop_tree(pot, stack, flop_bets, turn_bets, river_bets, self.deck)
        self.nodes = index_decisions(self.root)

        self.regret = {}
        self.strat_sum = {}
        self._nc = {}
        self._per_turn = {}  # t -> (sign_by_river dict, avg_sign)

    def _notcontain(self, card):
        nc = self._nc.get(card)
        if nc is None:
            nc = (~((self.combo_arr[:, 0] == card) | (self.combo_arr[:, 1] == card))).astype(np.float64)
            self._nc[card] = nc
        return nc

    def _turn_data(self, t):
        data = self._per_turn.get(t)
        if data is not None:
            return data
        sign_by_river = {}
        sum_sign = np.zeros((self.n, self.n), dtype=np.float64)
        nct = self._notcontain(t)
        for r in self.deck:
            if r == t:
                continue
            board5 = tuple(self.flop) + (t, r)
            strength = np.array([_combo_key(tuple(c), board5) for c in self.combos], dtype=np.int64)
            ncr = self._notcontain(r)
            pair_ok = self.valid * np.outer(nct * ncr, nct * ncr)
            sign = (np.sign(strength[:, None] - strength[None, :]) * pair_ok).astype(np.float32)
            sign_by_river[r] = sign
            sum_sign += sign
        avg_sign = (sum_sign / 44.0).astype(np.float32)  # river uniform over 44 (52-3-1-2-2)
        data = (sign_by_river, avg_sign)
        self._per_turn[t] = data
        return data

    # --- terminals (OOP perspective, zero-sum shifted by pot/2) ---
    def _sign_for(self, node, sign_by_river, avg_sign):
        if getattr(node, "sign_kind", None) == "river":
            return sign_by_river[node.river_card]
        return avg_sign

    def _terminal(self, node, reach_opp, player, sign_by_river, avg_sign):
        if node.kind == "showdown":
            sign = self._sign_for(node, sign_by_river, avg_sign)
            amount = self.pot / 2.0 + node.invested
            if player == OOP:
                return (sign @ reach_opp) * amount
            return -(reach_opp @ sign) * amount
        if node.folder == IP:
            g = self.pot / 2.0 + node.fold_invested_ip
        else:
            g = -(self.pot / 2.0 + node.fold_invested_oop)
        if player == OOP:
            return (self.valid @ reach_opp) * g
        return (reach_opp @ self.valid) * (-g)

    def _key(self, node, t):
        return (node.index,) if node.street == "flop" else (node.index, t)

    def _cfr(self, node, reach_oop, reach_ip, t, sign_by_river, avg_sign):
        if node.kind == "fold" or node.kind == "showdown":
            return (self._terminal(node, reach_ip, OOP, sign_by_river, avg_sign),
                    self._terminal(node, reach_oop, IP, sign_by_river, avg_sign))
        if node.kind == "chance":
            uo = np.zeros(self.n)
            ui = np.zeros(self.n)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                if r == t:
                    continue
                nc = self._notcontain(r)
                cuo, cui = self._cfr(child, reach_oop * nc * w, reach_ip * nc * w, t, sign_by_river, avg_sign)
                uo += cuo * nc
                ui += cui * nc
            return uo, ui

        key = self._key(node, t)
        k = len(node.actions)
        reg = self.regret.get(key)
        if reg is None:
            reg = np.zeros((self.n, k))
            self.regret[key] = reg
            self.strat_sum[key] = np.zeros((self.n, k))
        positive = np.maximum(reg, 0.0)
        total = positive.sum(axis=1, keepdims=True)
        strat = np.where(total > 1e-12, positive / np.maximum(total, 1e-12), 1.0 / k)

        player = node.player
        own_reach = reach_oop if player == OOP else reach_ip
        uo = np.zeros(self.n)
        ui = np.zeros(self.n)
        child_acting = np.zeros((self.n, k))
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(child, reach_oop * strat[:, a], reach_ip, t, sign_by_river, avg_sign)
                uo += strat[:, a] * cuo
                ui += cui
                child_acting[:, a] = cuo
            else:
                cuo, cui = self._cfr(child, reach_oop, reach_ip * strat[:, a], t, sign_by_river, avg_sign)
                uo += cuo
                ui += strat[:, a] * cui
                child_acting[:, a] = cui
        node_val = (strat * child_acting).sum(axis=1, keepdims=True)
        self.regret[key] = np.maximum(reg + (child_acting - node_val), 0.0)
        self.strat_sum[key] += own_reach[:, None] * strat
        return uo, ui

    def step(self):
        t = self.deck[self.rng.integers(0, len(self.deck))]
        sign_by_river, avg_sign = self._turn_data(t)
        nct = self._notcontain(t)
        reach = self.reach0 * nct
        # turn sampled uniformly over 49 post-flop cards; per-player it is 1/47,
        # but a constant chance scale cancels in regret matching and BR ratios.
        self._cfr(self.root, reach.copy(), reach.copy(), t, sign_by_river, avg_sign)

    # --- exact enumerated best response ---
    def _avg(self, key, k):
        s = self.strat_sum.get(key)
        if s is None:
            return np.full((self.n, k), 1.0 / k)
        total = s.sum(axis=1, keepdims=True)
        return np.where(total > 1e-12, s / np.maximum(total, 1e-12), 1.0 / k)

    def _br(self, node, reach_opp, br_player, t, sign_by_river, avg_sign):
        if node.kind == "fold" or node.kind == "showdown":
            return self._terminal(node, reach_opp, br_player, sign_by_river, avg_sign)
        if node.kind == "chance":
            total = np.zeros(self.n)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                if r == t:
                    continue
                nc = self._notcontain(r)
                total += self._br(child, reach_opp * nc * w, br_player, t, sign_by_river, avg_sign) * nc
            return total
        key = self._key(node, t)
        k = len(node.actions)
        if node.player == br_player:
            vals = [self._br(child, reach_opp, br_player, t, sign_by_river, avg_sign) for child in node.children]
            return np.max(np.stack(vals, axis=1), axis=1)
        strat = self._avg(key, k)
        total = np.zeros(self.n)
        for a, child in enumerate(node.children):
            total += self._br(child, reach_opp * strat[:, a], br_player, t, sign_by_river, avg_sign)
        return total

    def exploitability(self):
        wt = 1.0 / 47.0
        br_oop = np.zeros(self.n)
        br_ip = np.zeros(self.n)
        for t in self.deck:
            sign_by_river, avg_sign = self._turn_data(t)
            nct = self._notcontain(t)
            base = self.reach0 * nct * wt
            br_oop += self._br(self.root, base.copy(), OOP, t, sign_by_river, avg_sign) * nct
            br_ip += self._br(self.root, base.copy(), IP, t, sign_by_river, avg_sign) * nct
        v_oop = float((self.reach0 * br_oop).sum())
        v_ip = float((self.reach0 * br_ip).sum())
        expl = v_oop + v_ip
        return {"br_oop": v_oop, "br_ip": v_ip,
                "exploitability_pot_frac": expl / self.pot,
                "exploitability_mbb": expl / self.pot * 1000.0}

    def solve(self, iterations, expl_every=0):
        history = []
        for it in range(1, iterations + 1):
            self.step()
            if expl_every and (it % expl_every == 0 or it == iterations):
                m = self.exploitability()
                m["iteration"] = it
                history.append(m)
                print(f"iter={it:6d} exploitability={m['exploitability_pot_frac']*100:7.4f}% pot "
                      f"({m['exploitability_mbb']:8.2f} mbb/pot)")
        return {"history": history, "final": self.exploitability()}


# ----------------------------------------------------------------------------
# CLI
# ----------------------------------------------------------------------------


def _top_combos(flop, combos, max_combos):
    rng = np.random.default_rng(7)
    deck = [c for c in range(52) if c not in set(flop)]
    combo_arr = np.array(combos)
    valid = conflict_mask(combos, combos)
    acc = np.zeros((len(combos), len(combos)))
    for _ in range(60):
        idx = rng.choice(len(deck), size=2, replace=False)
        t, r = deck[idx[0]], deck[idx[1]]
        board5 = tuple(flop) + (t, r)
        strength = np.array([_combo_key(tuple(c), board5) for c in combos], dtype=np.int64)
        nc = (~((combo_arr[:, 0] == t) | (combo_arr[:, 1] == t) |
                (combo_arr[:, 0] == r) | (combo_arr[:, 1] == r))).astype(np.float64)
        acc += np.sign(strength[:, None] - strength[None, :]) * valid * np.outer(nc, nc)
    order = np.argsort(-acc.sum(axis=1))
    keep = np.sort(order[:max_combos]) if max_combos and max_combos < len(combos) else np.arange(len(combos))
    return [combos[i] for i in keep]


def _build(board_text, pot, stack, fb, tb, rb, max_combos, seed):
    flop = parse_board(board_text)
    used = set(flop)
    combos = [(a, b) for a in range(52) if a not in used for b in range(a + 1, 52) if b not in used]
    if max_combos:
        combos = _top_combos(flop, combos, max_combos)
    reach = np.ones(len(combos))
    return flop, FlopSolver(flop, combos, reach, pot, stack, fb, tb, rb, seed=seed)


def _self_test():
    # Turn-sampled MCCFR converges more slowly than the exact-enumeration solvers,
    # and the per-iteration cost is tree-bound (river is enumerated), so this guard
    # asserts a clear downward exploitability trend rather than full convergence,
    # keeping local validation to ~25s. Full convergence is a longer/GPU solve.
    flop, solver = _build("Kh 9d 4s", 6.0, 10.0, [0.75], [0.75], [0.75], 30, seed=11)
    start = solver.exploitability()["exploitability_pot_frac"]
    mid = solver.solve(400, expl_every=0)["final"]["exploitability_pot_frac"]
    end = solver.solve(500, expl_every=0)["final"]["exploitability_pot_frac"]
    ok = end < start * 0.6 and end < mid and end < 0.25
    print(f"[{'PASS' if ok else 'FAIL'}] flop MCCFR convergence: start={start*100:.2f}% "
          f"-> 400it={mid*100:.2f}% -> 900it={end*100:.2f}% pot (want monotone down, end < 0.6*start, <25%)")
    print("flop_mccfr self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--board", default="Kh 9d 4s")
    parser.add_argument("--pot", type=float, default=6.0)
    parser.add_argument("--stack", type=float, default=10.0)
    parser.add_argument("--flop-bets", default="0.75")
    parser.add_argument("--turn-bets", default="0.75")
    parser.add_argument("--river-bets", default="0.75")
    parser.add_argument("--iterations", type=int, default=4000)
    parser.add_argument("--expl-every", type=int, default=1000)
    parser.add_argument("--max-combos", type=int, default=60, help="0 = full range")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--out", default="")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        return _self_test()

    fb = [float(x) for x in args.flop_bets.split(",") if x]
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]
    flop, solver = _build(args.board, args.pot, args.stack, fb, tb, rb, args.max_combos, args.seed)
    print(f"flop={[card_text(c) for c in flop]} combos={solver.n} pot={args.pot} stack={args.stack} "
          f"bets f={fb} t={tb} r={rb}")
    started = time.time()
    result = solver.solve(args.iterations, expl_every=args.expl_every)
    elapsed = time.time() - started
    final = result["final"]
    print(f"\nFINAL exploitability = {final['exploitability_pot_frac']*100:.4f}% of pot "
          f"({final['exploitability_mbb']:.2f} mbb/pot)  in {elapsed:.1f}s")
    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps({
            "flop": [card_text(c) for c in flop], "pot": args.pot, "stack": args.stack,
            "flop_bets": fb, "turn_bets": tb, "river_bets": rb, "combos": solver.n,
            "iterations": args.iterations, "seconds": round(elapsed, 2), "final": final,
            "history": result["history"],
        }, indent=2))
        print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
