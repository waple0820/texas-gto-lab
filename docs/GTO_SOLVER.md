# GTO Solver Track

The strategy engine and trained MLP artifact are *GTO-inspired* heuristics: they
produce reasonable mixed frequencies but carry **no equilibrium guarantee** and,
until now, no way to measure how far from GTO they actually were.

This track adds a real solver whose distance to GTO is an *exact number*:
**exploitability** = how much an optimal best-responder beats the strategy,
reported as a fraction of the pot (and mbb/pot). At a true Nash equilibrium this
is 0.

## Why exploitability is the right metric

GTO = a Nash equilibrium of the betting game. A strategy is "GTO" iff no opponent
can do better than break even against it, i.e. exploitability is 0. Behavioral
sanity gates (value-bets ≥ 56%, etc.) cannot prove this; only a best-response
calculation can. Everything in this track is built to drive exploitability down
and to keep it measured.

## Stage 1 — River subgame (done)

`scripts/solver/river_cfr.py` solves a fully specified heads-up river subgame.

- The river board is public and complete, so every showdown is deterministic and
  equities are **exact** (no Monte Carlo). Card removal / blockers are handled
  exactly with a per-combo conflict mask.
- Strategy is solved with **CFR+** (regret matching with regret flooring).
- Best response and therefore exploitability are computed **exactly** by tree
  traversal, not estimated.

Betting abstraction (compact but real):

```
OOP: check | bet(size)
  OOP check -> IP: check(showdown) | bet(size)
    IP bet  -> OOP: fold | call(showdown) | raise(all-in)
      raise -> IP: fold | call(showdown)
  OOP bet  -> IP: fold | call(showdown) | raise(all-in)
    IP raise-> OOP: fold | call(showdown)
```

### Run

```bash
npm run solve:river -- --board "Kh 9d 4s 2c 7h" --pot 10 --stack 20 \
  --bet-sizes 0.5,1.0 --iterations 3000 --log-every 500
```

Observed convergence (full ranges, 1081 combos each, ~5s):

| iters | exploitability |
|------:|---------------:|
|     1 |       87.14% pot |
|   500 |        1.34% pot |
|  1000 |        0.71% pot |
|  3000 |        0.24% pot |

This is the textbook CFR ~1/√T decay toward 0 — a genuine equilibrium for the
subgame, with a measured distance to GTO.

### Validation

```bash
npm run test:solver
```

Asserts CFR+ drives exploitability below 0.6% of pot on fixed boards. This is the
convergence guard for the solver and runs as part of local validation.

## Roadmap

1. **River subgame solver + exact exploitability** ✅
2. Turn & flop chance nodes, multiple bet sizes, full postflop tree; large solves
   on the dual-5090 host.
3. Card/preflop abstraction; export solved strategies into the JS artifact
   contract (`src/trained-policy-artifact.js`) and retire hand-written safeguards
   as the solved policy becomes trustworthy.
4. End-to-end exploitability measurement of the deployed policy.

The north star: replace heuristic blends with solver-derived strategies and watch
the measured exploitability fall.
