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

## Stage 2 — Turn → river two-street solve (done)

`scripts/solver/turn_cfr.py` extends the solver to a genuine **two-street** game.

- Turn betting plays out; when action continues without a fold (check/check or
  bet/call) a real **river chance node** deals every possible river card and a
  full **river betting subgame** is solved for each.
- Turn all-ins are run out with the exact 2-card runout equity (average over all
  rivers), so no Monte Carlo anywhere.
- The river chance is normalized rigorously: from a player's own perspective the
  river is uniform over the 46 cards unseen to that player (52 − 4 turn board − 2
  own), with per-river-card blocker masks so impossible holdings never count.
- Exploitability is again **exact**, now computed over the whole two-street tree
  including the chance node.

### Run

```bash
npm run solve:turn -- --board "Kh 9d 4s 2c" --pot 10 --stack 15 \
  --turn-bets 0.75 --river-bets 0.75 --iterations 400 --max-combos 160
```

Observed convergence (120-combo validation range, ~8s for 300 iters):

| iters | exploitability |
|------:|---------------:|
|     1 |       82.95% pot |
|   100 |        5.56% pot |
|   300 |        1.90% pot |

Same 1/√T decay as the river — a correct equilibrium for the two-street game.
`--max-combos` caps the range for fast local validation; full-range and
multi-board solves run on the dual-5090 host.

### Validation

`npm run test:solver` now runs **both** the river and turn convergence guards.

## Stage 3 — GPU torch port (done)

`scripts/solver/solver_torch.py` reimplements the exact river CFR+ in torch so it
runs on CUDA. The numpy solvers are exact but CPU-bound (small validation ranges
only); the torch port solves **full-range** spots (every combo) at scale.

- **Byte-faithful to numpy.** `--self-test` asserts torch (CPU, float64) matches
  `river_cfr` exploitability within 0.1% on a fixed case, and that full-range
  river convergence stays < 0.6% pot — both run locally on CPU.
- **GPU verified.** On the dual-5090 host a full-range river solve (1081 combos,
  2000 iters) reaches 0.356% pot exploitability in **3.1s on CUDA**, numerically
  identical to the CPU solve (CFR+ is deterministic).

```bash
# local validation (CPU)
npm run test:solver
# full-range GPU solve on the 5090 host
npm run solve:gpu -- --device cuda --dtype float32 --iterations 2000 \
  --board "Kh 9d 4s 2c 7h"
```

The 5090 host runs the solver from a torch venv
(`/home/wf/apps/texas-gto-lab-train/.venv-policy`); the repo is rsynced there.

## Roadmap

1. **River subgame solver + exact exploitability** ✅
2. **Turn → river two-street solve (chance node + river subgames)** ✅
3. **GPU torch port (full-range solves on the dual-5090 host)** ✅
4. Flop street via GPU sampling (MCCFR) — full three-street enumeration is ~10^5
   tree nodes, so the flop chance layers are sampled while keeping exact
   best-response measurement.
5. Card/preflop abstraction; export solved strategies into the JS artifact
   contract (`src/trained-policy-artifact.js`) and retire hand-written safeguards
   as the solved policy becomes trustworthy.
6. End-to-end exploitability measurement of the deployed policy.

The north star: replace heuristic blends with solver-derived strategies and watch
the measured exploitability fall.
