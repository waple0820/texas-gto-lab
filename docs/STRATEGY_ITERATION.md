# Strategy Iteration Plan

## Goal

Move the strategy layer from broad heuristics toward source-backed, replaceable policies without changing the UI or simulator contract.

## Current Iteration

### 1. Preflop: table-first for heads-up

Status: implemented.

Use a dedicated heads-up 100bb preflop table before falling back to the existing generated range model.

Covered nodes:

- SB/Button raise-first-in.
- BB versus SB/Button open.
- SB/Button versus BB 3bet.

Implementation:

- `src/preflop-hu-table.js` contains the compact HU lookup table.
- `src/preflop-policy.js` calls the HU table first when `tableSize <= 2`.
- `src/strategy-engine.js` routes all preflop decisions through `preflopStrategyActions()` before postflop heuristics.
- The 1v1 simulator keeps its existing blind-defense context so the latest postflop strategy audit remains calibrated; HU RFI table lookup is available from direct strategy calls and future simulator plumbing.

Data source:

- Primary embedded source: `AHTOOOXA/poker-charts`, MIT License.
- Imported subset: Pekarstas `BTN-RFI`, `BB-vs-open-SB`, and `BTN-vs-3bet-BB` charts.
- Calibration reference: RangeConverter free "Heads Up 100bb 500z" PDF, which publicly documents comparable HU 100bb spots and notes simplified 50% frequencies.
- SB/Button RFI is widened to the public HU 100bb target width because the reusable MIT BTN subset is too tight for heads-up first-in play.
- `BB-vs-open-SB` source cells marked `allin` are treated as strong 3bets in this runtime, not 100bb open-jams.

Licensing boundary:

- The embedded table uses the MIT-licensed open-source chart subset and preserves the source copyright notice in code.
- The RangeConverter PDF is a free reference, but its raw tables/images are not bundled because redistribution rights are not explicit.

### 2. Flop: no lightweight table yet

Status: deferred.

Initial scan did not find a clearly redistributable, compact flop strategy table that fits the current action abstraction. Most credible flop data sources are either:

- commercial solver exports;
- online trainer databases without raw redistribution rights;
- full solver projects that require generating our own tree outputs.

Decision:

- Do not add a flop table in this iteration.
- Keep current `trained:postflop-selfplay-regret-v3` behavior unchanged.
- Add a future table interface only after we have a solver export or a licensed compact dataset.

### 3. Turn and river: keep unchanged

Status: deferred.

No extra turn/river constraints are added in this iteration. The next intended direction is replacing heuristic decisions with a learned model or solver-derived policy, not adding more hard-coded rules.

## Validation

Use deterministic validation runs to track style, not short-run EV:

```bash
npm test
npm run validate:heads-up -- --hands 100 --seed 20260625 --samples 800 --out reports/heads-up-validation-100.md
```

Primary metrics:

- SB/Button VPIP and PFR.
- BB defend and 3bet frequency.
- Preflop fold share.
- Showdown rate.
- Average max pot.
- 100bb all-in frequency.

Expected preflop shift:

- SB/Button should open substantially wider than the previous generated `blind-defense` behavior.
- BB should defend many suited/connected hands and 3bet a polar/value subset instead of over-checking.
- Strategy source in reports should remain `preflop:hu-100bb-preflop-rangeconverter-calibrated-v1` for covered HU preflop nodes.

### 4. Six-max preflop: opener-specific chart adapter

Status: implemented.

Use a dedicated 6-max 100bb preflop table before falling back to the generated range-width model.

Primary embedded source:

- `AHTOOOXA/poker-charts`, Pekarstas provider.
- Upstream description: GGPoker chart pack.
- Local source file: `src/preflop-sixmax-pekarstas.js`.
- Adapter: `src/preflop-sixmax-table.js`.

Covered nodes:

- RFI for UTG/HJ/CO/BTN/SB.
- Facing open when opener position is known and present in the source table.
- Facing 3bet when 3bettor position is known and present in the source table.
- Facing 4bet adapter exists for future callers, but the current six-max validator only exercises through 4bet decisions.

Important runtime decision:

- Source `allin` cells are treated as the strongest aggressive action in normal 100bb six-max spots, usually this app's `raise`.
- They are not emitted as literal 100bb jams for `facing-open` or `facing-3bet`, because the source labels behave more like an aggression tier in many chart nodes.
- Generated fallback remains active for missing nodes, limped/check-option spots, unusual stack depths, and UI contexts that do not provide an opener/aggressor position.

Validation:

```bash
npm test
npm run validate:six-max -- --hands 6000 --seed 20260625 --out reports/sixmax-preflop-validation-6000.md
```

The six-max report includes table-hit rate by position and decision samples with the exact source chart key or `fallback`.
