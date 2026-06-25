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

`turn_torch.py` extends the GPU port to the **two-street** game: it reuses
`turn_cfr`'s exact tree + sign/runout precompute and runs CFR+/best-response in
torch. Self-test asserts torch (CPU, float64) matches `turn_cfr` exploitability
within 0.1% on a small case. On the 5090 host a **full-range** turn solve (all
1128 combos — far beyond the CPU solver's ~120-combo limit) reaches 0.909% pot
exploitability (still descending) in ~97s.

```bash
npm run solve:gpu-turn -- --device cuda --dtype float32 --max-combos 0 \
  --board "Kh 9d 4s 2c" --iterations 800
```

The 5090 host runs the solver from a torch venv
(`/home/wf/apps/texas-gto-lab-train/.venv-policy`); the repo is rsynced there.

## Stage 4 — Flop three-street solve, turn-sampled / river-exact (done)

`scripts/solver/flop_mccfr.py` solves the full **flop → turn → river** game.
Materializing all three streets is ~10^5 nodes, so chance is handled by sampling
— but sampling *both* the turn and river scatters updates across ~2300 river
information sets that then never train (verified: exploitability barely moved,
65% → 53%). So it samples only the **turn** card and **enumerates the river
exactly** (reusing the two-street turn solver):

- each iteration samples one turn card, masks blocked combos, and runs vectorized
  CFR+ over flop betting → turn betting → river chance (every river enumerated) →
  river betting → showdown;
- information sets: flop nodes keyed by node; turn/river nodes by (node, turn).
- every river subgame is solved well per visit, so a turn infoset trains every
  time its card is sampled (~iters/49) and convergence takes thousands of
  iterations, not millions.

Distance to GTO is an **exact enumerated best response** over all turn/river
cards (per-player chance weights, exact blocker masks) — same method as the other
solvers. Observed convergence (50-combo range, single bet size):

| iters | exploitability |
|------:|---------------:|
|     0 |    ~85% pot |
|   400 |    ~28% pot |
|  2000 |    ~11% pot |

The trend is unambiguous and the best response is exact; the floor falls with
more iterations. Turn sampling makes this slower than the exact-enumeration river
/ turn solvers (single digits in a few hundred iters), so flop is the natural
target for the GPU and card abstraction next.

### Run / validate

```bash
npm run solve:flop -- --board "Kh 9d 4s" --iterations 4000 --expl-every 1000
npm run test:solver-flop   # ~25s convergence-trend guard (separate from test:solver)
```

`test:solver-flop` is kept out of the bundled `test:solver` because each iteration
is tree-bound (the river is enumerated), so it runs longer than the exact solvers.

## Stage 5 — How far is the live engine from GTO? (measured)

`scripts/solver/engine_exploitability.py` answers the project's original question
with a concrete number: it measures the **shipped strategy engine's exact
exploitability** vs GTO on a river spot.

Method (no new approximation):
1. Build a river subgame and solve it with CFR+; its measured exploitability
   (~0) confirms the tree is sound.
2. Query the JS engine (`recommendStrategy`) for every (decision node, combo) via
   `engine_dump.mjs` and map its bucketed actions onto the tree.
3. Feed that fixed engine strategy into the **same exact best-response routine**
   the solvers use (`RiverSolver.exploitability`). The result is the engine's
   exact exploitability, in % of pot.

**Result** (board `Qc Jd 9s 4h 2c`, pot 10, stack 20, full 1081-combo range):

| strategy | exact exploitability |
|----------|---------------------:|
| GTO (Nash) | 0.18% pot (sanity ~0) |
| **shipped engine** | **28.7% pot (287 mbb/pot)** |

So on this spot a perfect opponent beats the current engine for ~29% of the pot —
a large, concrete gap that quantifies how far the heuristic is from GTO and gives
the baseline the artifact integration drives down.

> Consistency note: the engine always evaluates equity vs the *full* range, so the
> measurement must use the full range for both players. An earlier reduced-range
> run reported a misleading 71% because it told the engine its opponent was
> full-range while the game used only the top combos — the engine then overvalued
> hands and over-raised. `--max-combos 0` (full range) is the correct mode.

```bash
npm run measure:engine -- --board "Qc Jd 9s 4h 2c" --pot 10 --stack 20
```

## Stage 6 — Solved strategies in the product (done)

The solver now feeds the shipped engine. `scripts/solver/export_solved.py` solves
river spots exactly and writes `src/solved-river-artifact.js` (per-combo, per-node
equilibrium frequencies). At runtime `src/solved-policy.js` consults it, and
`recommendStrategy` plays the solved strategy for the hero's exact combo on any
covered spot instead of the heuristic.

Re-running the Stage 5 measurement with the solved policy active, on the same spot
where the heuristic was 28.7% exploitable:

| engine | exact exploitability |
|--------|---------------------:|
| heuristic (before) | 28.7% pot |
| **solved policy (after)** | **0.14% pot (1.4 mbb/pot)** |

So on the covered spot the product now plays within ~0.1% of pot of GTO — the same
level as the solver's own Nash iterate. This proves the full pipeline end to end:
solve → export to a JS artifact → engine consumes it → measured exploitability
collapses. Coverage grows by adding spots to `export_solved.py`; uncovered spots
fall back to the heuristic untouched (existing tests and the 100-hand audit are
unaffected).

```bash
npm run export:solved      # solve canonical spots -> src/solved-river-artifact.js
npm run measure:engine -- --board "Qc Jd 9s 4h 2c" --pot 10 --stack 20 --engine-iters 10
```

## Roadmap

1. **River subgame solver + exact exploitability** ✅
2. **Turn → river two-street solve (chance node + river subgames)** ✅
3. **GPU torch port — full-range river *and* turn solves on the dual-5090 host** ✅
4. **Flop three-street solve (turn-sampled, river-exact MCCFR)** ✅
5. **Measure the shipped engine's exact exploitability vs GTO (~29% pot)** ✅
6. **Solved strategies in the product — exploitability collapses to ~0.14% pot on
   covered spots** ✅
7. Widen coverage: solve a library of river/turn boards (GPU) + add a board
   abstraction so live spots map to the nearest solved entry; multiple bet sizes.
8. Speed/scale: GPU port of the flop solver + card abstraction to drive flop
   exploitability to single digits.

The north star: replace heuristic blends with solver-derived strategies and watch
the measured exploitability fall.
