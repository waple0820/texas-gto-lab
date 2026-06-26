#!/usr/bin/env python3
"""GPU-capable torch port of the three-street flop->turn->river solver.

The numpy FlopSolver (flop_mccfr.py) is exact (turn-sampled, river-exact) but
CPU-bound, and it caches sign matrices for every turn card (O(49*48*n^2)), which
caps it at small ranges. This port:

  - reuses FlopSolver's exact tree, betting shape, and CPU hand-strength eval;
  - computes each sampled turn's per-river sign matrices ON THE FLY (one turn in
    memory at a time, ~48*n^2) instead of caching all 49 — so larger ranges fit;
  - runs CFR+/best-response in torch, so the matmul-heavy inner loop runs on the
    dual-5090 host while staying byte-faithful to the numpy logic.

Validation (respecting "validate locally"):
  - parity: torch (CPU, float64) matches flop_mccfr exploitability on a small
    case (--self-test);
  - speed + lower-exploitability at larger ranges is exercised on the GPU host.

Run:
  python3 scripts/solver/flop_torch.py --self-test                      # local CPU parity
  python3 scripts/solver/flop_torch.py --device cuda --max-combos 200 \
      --iterations 3000 --board "Kh 9d 4s"                              # GPU
"""

from __future__ import annotations

import argparse
import time

import numpy as np
import torch

from flop_mccfr import FlopSolver, _top_combos
from river_cfr import OOP, IP, all_combos, parse_board, card_text, _combo_key

np.seterr(over="ignore", invalid="ignore", divide="ignore")


class TorchFlopSolver:
    def __init__(self, base: FlopSolver, device="cpu", dtype=torch.float64):
        self.base = base
        self.device = torch.device(device)
        self.dtype = dtype
        self.n = base.n
        self.pot = base.pot
        self.flop = base.flop
        self.combos = base.combos
        self.nodes = base.nodes
        self.root = base.root
        self.deck = base.deck
        self.river_chance_weight = base.river_chance_weight
        self.rng = np.random.default_rng(0)

        self.valid_np = base.valid
        self.valid = torch.tensor(base.valid, device=self.device, dtype=dtype)
        self.reach0 = torch.tensor(base.reach0, device=self.device, dtype=dtype)
        self.regret = {}      # key -> tensor[n, k]
        self.strat_sum = {}   # key -> tensor[n, k]
        self._nc_t = {}       # card -> notcontain tensor[n]

    def _nc(self, card):
        t = self._nc_t.get(card)
        if t is None:
            t = torch.tensor(self.base._notcontain(card), device=self.device, dtype=self.dtype)
            self._nc_t[card] = t
        return t

    # Per-turn sign data, computed fresh (bounded memory). Strength eval is CPU
    # (_combo_key is lru-cached); the sign matrices are built on the GPU.
    def _turn_data(self, t):
        nct_np = self.base._notcontain(t)
        nct_g = torch.tensor(nct_np, device=self.device, dtype=self.dtype)
        sign_by_river = {}
        sum_sign = torch.zeros((self.n, self.n), device=self.device, dtype=self.dtype)
        for r in self.deck:
            if r == t:
                continue
            board5 = tuple(self.flop) + (t, r)
            strength = np.array([_combo_key(tuple(c), board5) for c in self.combos], dtype=np.int64)
            st = torch.tensor(strength, device=self.device)
            ncr = self._nc(r)
            ncc = nct_g * ncr
            pair_ok = self.valid * torch.outer(ncc, ncc)
            sign = torch.sign((st[:, None] - st[None, :]).to(self.dtype)) * pair_ok
            sign_by_river[r] = sign
            sum_sign = sum_sign + sign
        avg_sign = sum_sign / 44.0
        return sign_by_river, avg_sign, nct_g

    def _strategy(self, key, k):
        reg = self.regret.get(key)
        if reg is None:
            reg = torch.zeros((self.n, k), device=self.device, dtype=self.dtype)
            self.regret[key] = reg
            self.strat_sum[key] = torch.zeros((self.n, k), device=self.device, dtype=self.dtype)
        pos = reg.clamp_min(0.0)
        total = pos.sum(dim=1, keepdim=True)
        return torch.where(total > 1e-12, pos / total.clamp_min(1e-12),
                           torch.full_like(pos, 1.0 / k))

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
            uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                if r == t:
                    continue
                nc = self._nc(r)
                cuo, cui = self._cfr(child, reach_oop * nc * w, reach_ip * nc * w, t, sign_by_river, avg_sign)
                uo = uo + cuo * nc
                ui = ui + cui * nc
            return uo, ui
        key = self._key(node, t)
        k = len(node.actions)
        strat = self._strategy(key, k)
        player = node.player
        own_reach = reach_oop if player == OOP else reach_ip
        uo = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        ui = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        child_acting = torch.zeros((self.n, k), device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            if player == OOP:
                cuo, cui = self._cfr(child, reach_oop * strat[:, a], reach_ip, t, sign_by_river, avg_sign)
                uo = uo + strat[:, a] * cuo
                ui = ui + cui
                child_acting[:, a] = cuo
            else:
                cuo, cui = self._cfr(child, reach_oop, reach_ip * strat[:, a], t, sign_by_river, avg_sign)
                uo = uo + cuo
                ui = ui + strat[:, a] * cui
                child_acting[:, a] = cui
        node_val = (strat * child_acting).sum(dim=1, keepdim=True)
        self.regret[key] = (self.regret[key] + (child_acting - node_val)).clamp_min(0.0)
        self.strat_sum[key] = self.strat_sum[key] + own_reach.unsqueeze(1) * strat
        return uo, ui

    @torch.no_grad()
    def step(self):
        t = self.deck[self.rng.integers(0, len(self.deck))]
        sign_by_river, avg_sign, nct = self._turn_data(t)
        reach = self.reach0 * nct
        self._cfr(self.root, reach.clone(), reach.clone(), t, sign_by_river, avg_sign)

    def _avg(self, key, k):
        s = self.strat_sum.get(key)
        if s is None:
            return torch.full((self.n, k), 1.0 / k, device=self.device, dtype=self.dtype)
        total = s.sum(dim=1, keepdim=True)
        return torch.where(total > 1e-12, s / total.clamp_min(1e-12),
                           torch.full_like(s, 1.0 / k))

    def _br(self, node, reach_opp, br_player, t, sign_by_river, avg_sign):
        if node.kind == "fold" or node.kind == "showdown":
            return self._terminal(node, reach_opp, br_player, sign_by_river, avg_sign)
        if node.kind == "chance":
            total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
            w = self.river_chance_weight
            for r, child in zip(node.river_cards, node.children):
                if r == t:
                    continue
                nc = self._nc(r)
                total = total + self._br(child, reach_opp * nc * w, br_player, t, sign_by_river, avg_sign) * nc
            return total
        key = self._key(node, t)
        k = len(node.actions)
        if node.player == br_player:
            vals = [self._br(child, reach_opp, br_player, t, sign_by_river, avg_sign) for child in node.children]
            return torch.stack(vals, dim=1).max(dim=1).values
        strat = self._avg(key, k)
        total = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        for a, child in enumerate(node.children):
            total = total + self._br(child, reach_opp * strat[:, a], br_player, t, sign_by_river, avg_sign)
        return total

    @torch.no_grad()
    def exploitability(self):
        wt = 1.0 / 47.0
        br_oop = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        br_ip = torch.zeros(self.n, device=self.device, dtype=self.dtype)
        for t in self.deck:
            sign_by_river, avg_sign, nct = self._turn_data(t)
            base = self.reach0 * nct * wt
            br_oop = br_oop + self._br(self.root, base.clone(), OOP, t, sign_by_river, avg_sign) * nct
            br_ip = br_ip + self._br(self.root, base.clone(), IP, t, sign_by_river, avg_sign) * nct
        v_oop = float((self.reach0 * br_oop).sum())
        v_ip = float((self.reach0 * br_ip).sum())
        expl = v_oop + v_ip
        return {"br_oop": v_oop, "br_ip": v_ip,
                "exploitability_pot_frac": expl / self.pot,
                "exploitability_mbb": expl / self.pot * 1000.0}

    @torch.no_grad()
    def solve(self, iterations, expl_every=0):
        history = []
        for it in range(1, iterations + 1):
            self.step()
            if expl_every and (it % expl_every == 0 or it == iterations):
                m = self.exploitability()
                m["iteration"] = it
                history.append(m)
                print(f"iter={it:6d} exploitability={m['exploitability_pot_frac']*100:7.4f}% pot "
                      f"({m['exploitability_mbb']:8.2f} mbb/pot)", flush=True)
        return {"history": history, "final": self.exploitability()}


def _build(board_text, pot, stack, fb, tb, rb, max_combos, seed):
    flop = parse_board(board_text)
    combos = all_combos(flop)
    if max_combos:
        combos = _top_combos(flop, combos, max_combos)
    reach = np.ones(len(combos))
    base = FlopSolver(flop, combos, reach.copy(), pot, stack, fb, tb, rb, seed=seed)
    return flop, base


def _self_test():
    """Parity: torch (CPU, float64) vs numpy flop_mccfr on a small shared case."""
    import flop_mccfr
    flop, base = _build("Kh 9d 4s", 6.0, 10.0, [0.75], [0.75], [0.75], 24, seed=7)
    ts = TorchFlopSolver(base, device="cpu", dtype=torch.float64)
    # share the SAME sampled turn sequence by seeding both identically
    base.rng = np.random.default_rng(123)
    ts.rng = np.random.default_rng(123)
    n_iters = 120
    base.solve(n_iters, expl_every=0)
    ts.solve(n_iters, expl_every=0)
    e_np = base.exploitability()["exploitability_pot_frac"]
    e_t = ts.exploitability()["exploitability_pot_frac"]
    ok = abs(e_np - e_t) < 5e-3
    print(f"[{'PASS' if ok else 'FAIL'}] flop torch parity: numpy={e_np*100:.4f}% torch={e_t*100:.4f}% "
          f"(|d|={abs(e_np-e_t)*100:.4f}pp)")
    print("flop_torch self-test " + ("passed" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--board", default="Kh 9d 4s")
    p.add_argument("--pot", type=float, default=6.0)
    p.add_argument("--stack", type=float, default=10.0)
    p.add_argument("--flop-bets", default="0.66")
    p.add_argument("--turn-bets", default="0.66")
    p.add_argument("--river-bets", default="0.75")
    p.add_argument("--iterations", type=int, default=3000)
    p.add_argument("--expl-every", type=int, default=1000)
    p.add_argument("--max-combos", type=int, default=120)
    p.add_argument("--device", default="cpu")
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        return _self_test()
    fb = [float(x) for x in args.flop_bets.split(",") if x]
    tb = [float(x) for x in args.turn_bets.split(",") if x]
    rb = [float(x) for x in args.river_bets.split(",") if x]
    flop, base = _build(args.board, args.pot, args.stack, fb, tb, rb, args.max_combos, args.seed)
    dev = args.device if (args.device != "cuda" or torch.cuda.is_available()) else "cpu"
    solver = TorchFlopSolver(base, device=dev, dtype=torch.float64)
    print(f"board={[card_text(c) for c in flop]} combos={base.n} nodes={len(base.nodes)} device={dev}", flush=True)
    t0 = time.time()
    result = solver.solve(args.iterations, expl_every=args.expl_every)
    print(f"FINAL exploitability={result['final']['exploitability_pot_frac']*100:.4f}% pot "
          f"in {time.time()-t0:.1f}s", flush=True)
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main() or 0)
