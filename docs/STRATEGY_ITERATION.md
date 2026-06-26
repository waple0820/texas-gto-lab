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

Secondary embedded source:

- `AHTOOOXA/poker-charts`, Greenline provider.
- Upstream comment: extracted from `GreenCharts2024_01.pdf`.
- Local source file: `src/preflop-sixmax-greenline.js`.
- Used only when Pekarstas does not have the exact requested key.

Targeted facing-RFI source:

- PokerCoaching full preflop charts PDF.
- Local source file: `src/preflop-sixmax-pokercoaching.js`.
- Covers `CO-vs-open-MP`, extracted from the PDF's `CO vs HJ` Facing RFI chart.

Narrow squeeze source:

- `w0uf/poker-training`, example JSON range.
- Local source file: `src/preflop-sixmax-w0uf.js`.
- Covers only `BTN-squeeze-UTG-CO`.

Broad squeeze source:

- `SStoyanov22/gto-poker`, MIT License.
- Source data: processed GTOWizard cash NL100 100bb JSON in `scraper/gtowizard/out/nl100/100bb`.
- Local source file: `src/preflop-sixmax-gtowizard.js`.
- Imports 197 source files: 5 RFI, 30 vs-open, 15 vs-3bet, 15 vs-4bet, 20 active squeeze, 60 vs-squeeze, and 52 squeeze-vs-4bet files.
- Exact source preflop lines are preserved in `SIXMAX_GTO_WIZARD_LINE_CHARTS`; simplified runtime keys use averaged charts only when the runtime cannot match a line.

Gap-fill source:

- `a9876543245/DEEPFOLD-SOLVER`, TexasSolverGPU 100bb 2.5x 500rake cash export.
- Local source file: `src/preflop-sixmax-deepfold.js`.
- Covers cold-facing-3bet and remaining facing-4bet nodes where DEEPFOLD has sanity-passing structured JSON.
- Exact source preflop lines are preserved in `SIXMAX_DEEPFOLD_LINE_CHARTS`; simplified runtime keys use averaged charts only when the runtime cannot match a line.

Covered nodes:

- RFI for UTG/HJ/CO/BTN/SB.
- Facing open when opener position is known and present in the source table.
- Facing 3bet when 3bettor position is known and present in the source table.
- Facing 4bet when the 4bettor position is known and present in the source table; DEEPFOLD fills the previously missing `UTG-vs-4bet-*` branches.
- ISO/limped-pot 6-max nodes via Greenline `MP/CO/BTN/SB/BB-ISO`.
- `CO-vs-open-MP` via PokerCoaching `CO vs HJ`.
- One explicit squeeze node via w0uf: BTN squeezing after UTG open and CO cold call.
- Broad active squeeze, facing-squeeze, and squeezer-facing-4bet coverage via GTOWizard 100bb NL100 exports.
- Additional BB/SB active squeeze nodes via DEEPFOLD where its source line is the exact runtime `preflopLine` match.
- Cold-facing-3bet and facing-squeeze are distinct lookup contexts. GTOWizard and DEEPFOLD exact charts are used where present; missing exact nodes fall back explicitly instead of aliasing to opener-facing-3bet or 4bet-defense charts.

Known remaining source gaps:

- Remaining measured fallback is limited to `BB-vs-squeeze-BTN` and `SB-vs-squeeze-BTN` in the deterministic 6000-hand run. Remaining aliases are multi-cold-caller active squeeze keys such as `BB-squeeze-CO-BTN-SB`. These were not present as sanity-passing exact charts in the inspected free structured sources.
- `davidt35/preflop_charts` is MIT and mentions squeeze/cold-call coverage, but its data is PNG-only. It should not be embedded until the color/action legend is verified.
- `HoldemPokerTools/RangeAssistant` and `lukebhan/memorizePreFlop` were inspected; they do not bundle the missing 100bb 6-max cash squeeze-response data.
- `talpinkas/pink-ace-gto` and `sasinpracha-B13/range-master-mtt` were inspected; they are training/MTT-oriented and do not provide the missing branches.
- `CardPilot` has structured `*_squeeze_vs_*` JSON nodes, but the current data fails sanity checks and is not used as exact strategy data. Example: `BTN_squeeze_vs_SB` assigns `72o` a 98.2% 4bet frequency and `33` a 100% 4bet frequency.
- `GTOpoker`, `gto-today`, and `AHTOOOXA/poker-charts` were inspected as additional open repositories for the remaining gaps. They are useful implementation references, but their multiway/facing-squeeze paths are either absent or derived approximations rather than verified solver/export charts.

Important runtime decision:

- Source `allin` cells are treated as the strongest aggressive action in normal 100bb six-max spots, usually this app's `raise`.
- They are not emitted as literal 100bb jams for `facing-open` or `facing-3bet`, because the source labels behave more like an aggression tier in many chart nodes.
- GTOWizard `100bb` raise-size buckets are emitted as `jam`; smaller raise-size buckets remain `raise`.
- DEEPFOLD `allin` source cells are emitted as literal `jam` only in facing-4bet contexts.
- Generated fallback remains active for missing nodes, especially the two remaining blind/cold-player facing BTN squeeze keys, unusual stack depths, and UI contexts that do not provide an opener/aggressor position.

Validation:

```bash
npm test
npm run build
npm run validate:six-max -- --hands 6000 --seed 20260626 --out reports/sixmax-preflop-validation-6000.md
```

The six-max report includes table-hit rate by position and decision samples with the exact source chart key or `fallback`. Latest deterministic coverage is 36,926 exact decisions, 3 alias decisions, and 10 fallback decisions from 36,939 preflop decisions. Percentages round to exact 100%, alias 0%, fallback 0% in the report.
