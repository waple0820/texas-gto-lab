# Strategy Data Source Review

## Goal

Find practical strategy data sources, with priority on 6-max, opener-position-specific preflop tables.

The current runtime is only table-first for heads-up spots. For 6-max it still falls back to generated range widths in `src/preflop-policy.js`:

- `OPEN_WIDTH[position]` for raise-first-in.
- `DEFEND_WIDTH[position]` for facing an open.
- `THREE_BET_WIDTH[position]` for 3bet frequency.
- `FOUR_BET_WIDTH[position]` for facing a 3bet.

That means the current 6-max policy is not a pure chart lookup. It knows hero position and context, but it does not know the opener position for every response node. For example, BTN versus UTG open and BTN versus CO open are both shaped by the same BTN defense width unless another table overrides it.

## Project Stance

This is a personal entertainment project, so data accuracy and practical strategy quality are more important than strict redistribution hygiene. Licensing/provenance should still be documented, but it should not block a better chart source unless the risk becomes operationally relevant.

## Evaluation Criteria

- Coverage: RFI, versus open, versus 3bet, and ideally versus 4bet, keyed by hero position and opener/aggressor position.
- Accuracy: solver-like 6-max 100bb behavior is more important than a perfectly clean rights chain.
- Format: static text/JSON/TypeScript is much cheaper to integrate than PDFs or app-only charts.
- Poker assumptions: 6-max, 100bb, cash-game rake/sizing close enough to this simulator.
- Maintenance cost: easy to validate, diff, and replace later.

## Candidate Sources

| Source | Coverage | License / Access | Fit |
| --- | --- | --- | --- |
| [AHTOOOXA/poker-charts](https://github.com/AHTOOOXA/poker-charts) | Static TypeScript ranges for all 6 positions, including RFI, versus open, versus 3bet, and versus 4bet nodes. | Repository is MIT licensed. Some chart files are derived from external chart providers. | Best practical fit. Data is already structured and close to the target lookup model. |
| [RangeConverter free charts](https://rangeconverter.com/free-poker-charts) | Free 6-max 100bb chart sets are available, with simplified 50% frequencies. | Publicly viewable/downloadable, but site footer says all rights reserved. No clear redistribution permission. | Good calibration reference. Not a safe embedded data source without permission. |
| [tyloo/poker-range-analyzer](https://github.com/tyloo/poker-range-analyzer) | MIT TypeScript ranges, but mostly RFI plus limited BB defense examples. | MIT licensed. | Useful sanity reference, but not enough for opener-position-specific 6-max coverage. |
| [HoldemPokerTools/RangeAssistant](https://github.com/HoldemPokerTools/RangeAssistant) | Range editor/viewer/exporter, not a bundled strategy chart dataset. | MIT licensed. | Tooling reference only. |
| [preflop-academy](https://github.com/jbcazaux/preflop-academy) | App fetches charts from a backend API. No embedded reusable chart dataset found. | No clear repo license found. | Not suitable for committed data. |
| [FreeBetRange 6-max open-raise charts](https://blog.freebetrange.com/article/preflop-charts-open-raise-in-6-max-poker-cash-games) | Open-raise charts and PDF-style references. Mostly RFI. | Redistribution license unclear. | Sanity reference only. |
| [Upswing free charts](https://upswingpoker.com/charts/) | Free app/charts with 6-max opening ranges and other preflop spots. | App/content access, not raw redistributable tables. | Sanity reference only unless permission/export is obtained. |

## Recommended Path

### 1. Use `AHTOOOXA/poker-charts` as the first integration source

It has the right shape for this project:

- chart keys already encode spots such as `BTN-vs-open-UTG`, `BB-vs-open-BTN`, and `CO-vs-3bet-BTN`;
- cells contain action mixes instead of a single hand score cutoff;
- data is static and can be normalized at build/runtime without scraping.

Two provider tables are relevant:

| Provider | Nodes | Notes |
| --- | ---: | --- |
| `pekarstas` | 46 | Better total 6-max coverage: RFI, 13 versus-open nodes, 15 versus-3bet nodes, and 13 versus-4bet nodes. Described upstream as a GGPoker chart pack. |
| `greenline` | 42 | Has RFI, ISO, 12 versus-open nodes, 15 versus-3bet nodes, and 5 versus-4bet nodes. Source comment says it was extracted from `GreenCharts2024_01.pdf`. |

Given the user's accuracy-first preference, use `pekarstas` as the primary 6-max provider because its response-node coverage is better. Keep `greenline` as a comparison/calibration provider and possible source for ISO/limped-pot handling.

Measured combo widths from the local candidate data:

| Provider | UTG RFI | MP/HJ RFI | CO RFI | BTN RFI | SB RFI |
| --- | ---: | ---: | ---: | ---: | ---: |
| `pekarstas` | 15.5% aggressive / 16.7% in range | 19.4% / 19.8% | 27.8% / 28.8% | 44.8% / 46.0% | 44.3% / 44.8% |
| `greenline` | 15.5% / 16.7% | 19.4% / 19.8% | 27.8% / 28.8% | 44.8% / 46.0% | 43.0% / 43.0% |

### 2. Keep RangeConverter as calibration, not bundled source

RangeConverter is likely a stronger poker-quality reference, and its free 6-max 100bb pages document practical solver-style simplifications. The blocker is extraction cost, not rights: the public pages/PDF flow is less convenient than the static TypeScript tables above. Use it to sanity-check widths and obvious anomalies after the first table adapter is running.

### 3. Do not spend time on flop data yet

No lightweight flop table was found that can be directly plugged into the current action abstraction.

Current flop/postflop source scan:

| Source | What it provides | Fit |
| --- | --- | --- |
| [RangeConverter aggregated reports](https://rangeconverter.com/reports/free-poker-strategy-reports.html) | Spreadsheet/report-style aggregate frequencies by spot and flop class. Good for learning broad flop tendencies and comparing bet/check frequencies. | Useful calibration source, but not a per-hand/per-combo strategy table. |
| [WASM Postflop](https://github.com/b-inary/wasm-postflop) / [Desktop Postflop](https://github.com/b-inary/desktop-postflop) | Free open-source postflop solver. Development is suspended, but it can generate solutions if we define trees and ranges. | Solver engine path, not a data table. Good future route for self-generated flop exports. |
| [PokerBench](https://huggingface.co/datasets/RZ412/PokerBench) | Apache-2.0 dataset with solver-derived natural-language decisions, including postflop examples. | Better fit for model training/evaluation than direct table lookup. Not a compact mixed-frequency chart. |
| Commercial trainer databases such as GTO Wizard / RangeConverter Pro / Postflop+ | Large solved libraries and trainer views. | Likely strongest accuracy, but integration would require export access or manual distillation. |

Decision:

- Do not add a flop table in this iteration.
- Keep the current postflop model/heuristic path unchanged.
- If postflop accuracy becomes the next priority, prefer either self-generating exports with an open solver or training/evaluating a model on PokerBench-style decision data rather than manually hard-coding flop constraints.

## Integration Cost

### Engineering

Low to medium if using `poker-charts`; medium to high if manually extracting RangeConverter PDFs.

Implemented route:

- `src/preflop-sixmax-pekarstas.js` embeds the selected Pekarstas table.
- `src/preflop-sixmax-table.js` normalizes source chart keys to `(context, heroPosition, aggressorPosition)`.
- Source `MP` maps to this app's `HJ`.
- `preflopStrategyActions()` queries HU first, 6-max second, then generated fallback.
- Generated fallback remains active for uncovered nodes such as squeezes, limped pots, unusual stack sizes, or missing chart spots.

Important semantic mapping:

- Source `raise` means open/3bet/4bet depending on scenario.
- Source `allin` should not be treated as literal 100bb jam in normal 6-max `vs-open` and `vs-3bet` nodes. In those nodes it should be merged into the strongest available aggressive action, usually this app's `raise`.
- Literal `jam` should only be used where the app has a clearly matching high-aggression node, such as short stacks or true 5bet/all-in abstractions.

### Validation

Implemented.

`scripts/sixmax-preflop-validate.js` now compares:

- RFI by position;
- VPIP/PFR by position;
- call versus open by defender and opener;
- 3bet versus open by defender and opener;
- source hit rate versus fallback hit rate;
- exact source key or `fallback` in decision samples.

Latest deterministic run:

```bash
npm test
npm run build
npm run validate:six-max -- --hands 6000 --seed 20260625 --out reports/sixmax-preflop-validation-6000.md
```

Observed six-max style:

| Pos | RFI | VPIP | PFR | Table hit |
| --- | ---: | ---: | ---: | ---: |
| UTG | 15.7% | 15.7% | 15.7% | 100% |
| HJ | 20.1% | 18.3% | 18.3% | 99.7% |
| CO | 29.2% | 25.3% | 22.3% | 82.5% |
| BTN | 44.9% | 30.3% | 26.8% | 80.5% |
| SB | 45.6% | 22.1% | 20.2% | 90.2% |
| BB | - | 29.9% | 8.6% | 79.1% |

### Product / Strategy

Medium.

The biggest poker risk is mixing assumptions:

- source chart rake and sizing may not match the simulator;
- some source action labels may not map cleanly to this app's simplified action set;
- weighted hands need deterministic sampling or normalized frequencies;
- incomplete nodes can create a style discontinuity between chart-backed and fallback-backed spots.

## Remaining Limitations

1. Some 6-max nodes still fall back because the selected provider does not cover every response path, especially parts of CO/BTN versus HJ/MP open and multiway cold-call/3bet branches.
2. The UI does not yet expose an opener/aggressor position selector, so manual `facing-open` review cannot always hit opener-specific charts. The simulator does pass this information.
3. ISO/limped-pot spots still use generated fallback. `greenline` has ISO charts and can be evaluated in a later pass.
4. Flop is intentionally unchanged because no compact table source fit the current runtime. The most credible next postflop route is solver-generated exports or a model trained/evaluated on solver-decision datasets.

## Decision

The current iteration uses a 6-max chart adapter with `pekarstas` as the primary table. `greenline`, RangeConverter free charts, RangeConverter reports, open-source postflop solvers, and PokerBench remain calibration or future-data candidates.
