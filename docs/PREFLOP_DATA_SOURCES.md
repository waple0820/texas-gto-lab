# Strategy Data Source Review

## Goal

Find practical strategy data sources, with priority on 6-max, opener-position-specific preflop tables.

The current runtime is only table-first for heads-up spots. For 6-max it still falls back to generated range widths in `src/preflop-policy.js`:

- `OPEN_WIDTH[position]` for raise-first-in.
- `DEFEND_WIDTH[position]` for facing an open.
- `THREE_BET_WIDTH[position]` for 3bet frequency.
- `FOUR_BET_WIDTH[position]` for facing a 3bet.

That means the current 6-max policy is not a pure chart lookup. It knows hero position and context, but it does not know the opener position for every response node. For example, BTN versus UTG open and BTN versus CO open are both shaped by the same BTN defense width unless another table overrides it.

Current status after the latest iteration: 6-max preflop is chart-first for normal 100bb spots and for nearly all observed squeeze/facing-squeeze branches. Generated fallback remains only for nodes where no sanity-passing source chart was found or where the simulated action tree creates a multi-cold-caller key that the available sources do not model.

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
| [AHTOOOXA/poker-charts](https://github.com/AHTOOOXA/poker-charts) | Static TypeScript ranges for all 6 positions, including RFI, versus open, versus 3bet, and versus 4bet nodes. | Repository is MIT licensed. Some chart files are derived from external chart providers. | Best first-pass fit. Data is structured and close to the target lookup model. Rechecked in the broader source pass; it does not add exact squeeze/cold-facing nodes beyond the existing Pekarstas/Greenline imports. |
| [PokerCoaching full preflop charts](https://poker-coaching.s3.amazonaws.com/tools/preflop-charts/full-preflop-charts.pdf) | Public 100bb preflop PDF. Includes Facing RFI charts with clear action legend. | Publicly accessible PDF; page footer says all rights reserved. | Used narrowly for one high-volume missing node, `CO-vs-open-MP`, extracted from `CO vs HJ` on the Facing RFI: CO page. |
| [fordbjay/poker-preflop-charts](https://github.com/fordbjay/poker-preflop-charts) | Vue app with hard-coded RFI, facing RFI, RFI-vs-3bet, SB limp, and BB defense ranges. | No license file found. | Good cross-check for PokerCoaching-style ranges, but does not cover the remaining cold-facing-3bet or squeeze gaps. Not embedded. |
| [davidt35/preflop_charts](https://github.com/davidt35/preflop_charts) | MIT 6-max chart images. README mentions RFI, call versus open, 3bet defense, 5bet, and squeeze. | MIT repository, but strategy data is only PNG grids and HTML pages. | Promising reference for missing cold-call/squeeze spots, but not embedded yet because the PNG action colors need a reliable legend before conversion. |
| [w0uf/poker-training](https://github.com/w0uf/poker-training) | Example JSON ranges for a poker quiz app, including one BTN squeeze spot and BTN versus limpers examples. | No explicit license file found in the repository. Example JSONs include source metadata from `site2wouf.fr`. | Narrow but structured. Used only for the explicitly named `BTN squeeze vs UTG + CO` spot. |
| [a8594755-maker/CardPilot](https://github.com/a8594755-maker/CardPilot) | Structured JSON preflop solution files for `cash_6max_100bb`, including 14 `*_squeeze_vs_*` nodes and many open/3bet/4bet nodes. | No declared license found. Metadata says `cardpilot-preflop-cfr-v1`, 10,000,000 iterations. | Not embedded. The squeeze nodes are machine-readable but fail basic poker sanity checks: e.g. `BTN_squeeze_vs_SB` assigns `72o` a 98.2% 4bet frequency and `33` a 100% 4bet frequency when facing a squeeze. |
| [ethanchiou/GTOpoker](https://github.com/ethanchiou/GTOpoker) | Structured `6max_100bb_v1` manifest with RFI, vs RFI, vs 3bet, vs 4bet, and vs 5bet. | No declared license found. README says the ranges are hand-authored approximations, not solver output. | Useful format reference, but it explicitly does not chart multiway lines; squeezes/cold 4bets/facing squeeze are served by its own low-confidence derived fallback. Not embedded. |
| [jayj1990/gto-today](https://github.com/jayj1990/gto-today) | RFI, BB defense, and a `call-vs-3bet-6max-100bb.json` file. | Solver wasm subpackage is AGPL-3.0; main data licensing is not clearly declared. | Not embedded. The relevant `call-vs-3bet` file states it is derived from model/training knowledge and should be checked by eye against GTO Wizard; it is not a primary solver export or full action table. |
| [a9876543245/DEEPFOLD-SOLVER](https://github.com/a9876543245/DEEPFOLD-SOLVER) | Solver export contains `gto_output/cash/texassolver_6max_100bb_2_5x_500rake` with 510 JSON files: RFI 5, vs open 21, vs 3bet 56, vs 4bet 115, vs 5bet 313. | No declared license found. Upstream metadata says `TexasSolverGPU ranges/qb_ranges/100bb 2.5x 500rake`. | Embedded narrowly for source gaps: active squeeze, cold-facing-3bet, facing-squeeze, and missing facing-4bet nodes. Runtime key lacks opener/caller/sizing detail, so multiple line-specific files are averaged. |
| [SStoyanov22/gto-poker](https://github.com/SStoyanov22/gto-poker) | MIT app with processed GTOWizard cash NL100 exports. The `scraper/gtowizard/out/nl100/100bb` folder has 197 JSON files: 5 RFI, 30 vs-open, 15 vs-3bet, 15 vs-4bet, 20 active squeeze, 60 vs-squeeze, and 52 squeeze-vs-4bet files. | MIT licensed. Files identify `Cash6mGeneral_6mNL100R25`, 100bb, and GTOWizard preflop action paths. | Embedded as `src/preflop-sixmax-gtowizard.js`. It is now the strongest structured source for 100bb squeeze and facing-squeeze coverage. Exact source preflop lines are preserved when the runtime provides `preflopLine`; otherwise files are averaged by runtime key. |
| [RangeConverter free charts](https://rangeconverter.com/free-poker-charts) | Free 6-max 100bb chart sets are available, with simplified 50% frequencies. | Publicly viewable/downloadable, but site footer says all rights reserved. No clear redistribution permission. | Good calibration reference. Not a safe embedded data source without permission. |
| [FreeBetRange Smart Preflop Ranges PDF](https://help.freebetrange.com/guides/Smart_Preflop_Ranges_For_6-max_Holdem.pdf) | Public PDF says the free app package includes 56 charts, including squeeze and cold 4bet ranges. | Public PDF/app access; raw chart export not found in the PDF. | Not embedded. The PDF is an instruction/marketing document, not the actual 56 chart dataset. The raw app data was not found in this pass. |
| [tyloo/poker-range-analyzer](https://github.com/tyloo/poker-range-analyzer) | MIT TypeScript ranges, but mostly RFI plus limited BB defense examples. | MIT licensed. | Useful sanity reference, but not enough for opener-position-specific 6-max coverage. |
| [HoldemPokerTools/RangeAssistant](https://github.com/HoldemPokerTools/RangeAssistant) | Range editor/viewer/exporter, not a bundled strategy chart dataset. | MIT licensed. | Tooling reference only. |
| [preflop-academy](https://github.com/jbcazaux/preflop-academy) | App fetches charts from a backend API. No embedded reusable chart dataset found. | No clear repo license found. | Not suitable for committed data. |
| [jcgray2/PokerNow-Preflop-Ranger](https://github.com/jcgray2/PokerNow-Preflop-Ranger) | PokerNow assistant shell with chart file path placeholders. | MIT licensed. | No embedded chart data found. |
| [n1kFord/preflop-range-trainer](https://github.com/n1kFord/preflop-range-trainer) | MIT local-first custom range trainer. | MIT licensed. | Stores user-created ranges in browser local storage; no bundled strategy dataset. |
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

### 2. Use Greenline as a secondary structured provider

Status: implemented.

Greenline is now used only after Pekarstas misses an exact requested node. This replaces one high-volume alias with a real structured chart:

- `BTN-vs-open-MP` now resolves to `greenline:BTN-vs-open-MP` instead of aliasing to `BTN-vs-open-UTG`.
- `MP/CO/BTN/SB/BB-ISO` nodes are available for `check-option`, `limped-pot`, and `blind-check` 6-max contexts.

The runtime still keeps Pekarstas first because it has better overall response-node coverage in this project.

### 3. Use PokerCoaching for the highest-volume missing facing-open node

Status: implemented for one node.

The PokerCoaching PDF has an explicit legend for Facing RFI charts:

- red: 3bet for value;
- blue: 3bet as a bluff;
- green: call;
- white: fold.

The project maps its HJ position to source `MP`, so the missing `CO-vs-open-MP` runtime key is equivalent to the PokerCoaching `CO vs HJ` chart. That node is now embedded as `pokercoaching:CO-vs-open-MP`.

The source PDF assumes 100bb effective stacks with ante in play. It uses 2.5bb initial raises in position, 3.5bb initial raises out of position, 3x 3bets in position, 3.5x 3bets out of position, 2.5x 4bets in position, and 2.75x 4bets out of position. This is close enough for the current six-max simulator's 100bb cash-style practice, but the source is still used narrowly rather than generalized across all nodes.

### 4. Use w0uf only for explicitly covered squeeze spot

Status: implemented for one node.

The `w0uf/poker-training` repository includes a structured JSON example named `nlhe-5max-btn-squeeze-100bb.json`. Its metadata says `squezze BTN vs UTG + CO`, 100bb, NL2. This is not a full 6-max pack, so it is not generalized.

Implemented node:

- `BTN-squeeze-UTG-CO`

Runtime behavior:

- A squeeze lookup is attempted only when opener and cold caller positions are known.
- If the exact squeeze key is missing, the adapter falls back to the nearest normal versus-open chart rather than reusing the BTN UTG+CO squeeze table for unrelated positions.

### 5. Use GTOWizard exports for broad squeeze and facing-squeeze coverage

Status: implemented.

`SStoyanov22/gto-poker` contains processed GTOWizard cash NL100 100bb JSON exports in a static repository. The project imports the 100bb NL100 subset only.

Imported source groups:

| Source group | Runtime nodes filled | Notes |
| --- | --- | --- |
| active squeeze | `*-squeeze-*-*` | Covers 20 opener + caller + squeezer combinations, including the previously aliased blind squeeze branches such as `BB-squeeze-BTN-SB`. |
| facing squeeze | `*-vs-squeeze-*` | Covers 60 opener/caller/squeezer branches. Runtime keys keep hero and squeezer, and source-line keys retain opener/caller/sizing when available. |
| squeeze versus 4bet | `*-vs-4bet-*` for the squeezer | Covers 52 squeezer-facing-4bet branches with opener/cold-caller response detail. |
| ordinary 100bb nodes | RFI, vs-open, vs-3bet, vs-4bet | Also available; used when provider order and/or exact source-line lookup selects them. |

Important import rule:

- `SIXMAX_GTO_WIZARD_LINE_CHARTS` preserves the source preflop action line, for example `UTG 2.5bb MP FOLD CO Call BTN ...`.
- `SIXMAX_GTO_WIZARD_CHARTS` averages multiple source lines only when the runtime key is less specific than the source.
- Raise sizes at `100bb` are mapped to `jam`; smaller raise sizes remain `raise`.
- Missing hands are treated as fold by lookup, but source files only contribute explicit non-fold frequencies to an averaged key.

### 6. Use DEEPFOLD for verified cold-facing and remaining 4bet gaps

Status: implemented.

The broader source pass found usable structured JSON in `DEEPFOLD-SOLVER/gto_output/cash/texassolver_6max_100bb_2_5x_500rake`. That profile is closest to the current simulator assumptions among the inspected DEEPFOLD cash exports.

Imported source groups:

| Source group | Runtime nodes filled | Notes |
| --- | --- | --- |
| `vs_Open` | `*-squeeze-*-BTN` for BB/SB squeeze opportunities | Still available, but GTOWizard now covers most active squeeze use. DEEPFOLD source-line exact lookup remains useful when its source line is the closer match. |
| `vs_3B` | `*-cold-vs-3bet-*` and some `*-vs-squeeze-*` | Used primarily for cold players facing a 3bet. GTOWizard now covers most facing-squeeze nodes. |
| `vs_4B` | missing `*-vs-4bet-*` nodes, especially `UTG-vs-4bet-*` | Used after normal chart sources miss. All-in source actions map to the runtime's literal jam only in facing-4bet contexts. |

Important import rule:

- A DEEPFOLD source file only contributes a hand when that hand appears in one of the source action ranges. Missing hands are not counted as folds during averaging. This avoids polluting premium hands when a line-specific export omits a hand because it is outside that source line's prior range.
- `SIXMAX_DEEPFOLD_LINE_CHARTS` preserves exact source-line charts when the runtime provides `preflopLine`; otherwise files are averaged by runtime key.

Remaining fallback after the GTOWizard + DEEPFOLD imports is limited to `BB-vs-squeeze-BTN` and `SB-vs-squeeze-BTN` in the deterministic 6000-hand run. Remaining aliases are multi-cold-caller active squeeze opportunities such as `BB-squeeze-CO-BTN-SB`; the inspected free structured sources do not provide those exact branches. `CardPilot` has machine-readable facing-squeeze-like files, but its trash-hand aggression fails basic sanity checks and is not used.

### 7. Keep RangeConverter as calibration, not bundled source

RangeConverter is likely a stronger poker-quality reference, and its free 6-max 100bb pages document practical solver-style simplifications. The blocker is extraction cost, not rights: the public pages/PDF flow is less convenient than the static TypeScript tables above. Use it to sanity-check widths and obvious anomalies after the first table adapter is running.

### 8. Do not spend time on flop data yet

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

### 9. Do not use low-confidence generated squeeze tables as exact data

Additional search found one structured squeeze-like dataset in `a8594755-maker/CardPilot`, under `data/preflop/solutions/cash_6max_100bb`.

It is not used as a source table in this project because its squeeze nodes fail simple sanity checks:

- `BTN_squeeze_vs_SB` has actions `fold/call/4bet_19.6875`, so it maps semantically to this project's `facing-squeeze`, not the active `squeeze` decision.
- The same node assigns `72o` a 98.2% 4bet frequency and `33` a 100% 4bet frequency.
- `BTN_squeeze_vs_BB` assigns `72o` a 48.8% 4bet frequency and `22` a 65.5% 4bet frequency.

Those outputs are materially less credible than the current generated fallback. Treat this repository as evidence that structured data exists in the wild, but not as a usable strategy source unless the upstream generation bug or semantic mismatch is resolved.

`ethanchiou/GTOpoker`, `jayj1990/gto-today`, `AHTOOOXA/poker-charts`, `davidt35/preflop_charts`, `HoldemPokerTools/RangeAssistant`, `lukebhan/memorizePreFlop`, `talpinkas/pink-ace-gto`, and `sasinpracha-B13/range-master-mtt` were also rechecked in the broader pass. They are useful implementation references, but none supplies verified exact charts for the remaining `BB/SB-vs-squeeze-BTN` nodes:

- `GTOpoker` explicitly routes multiway squeezes/cold 4bets/facing squeeze through a low-confidence derived fallback.
- `gto-today` labels its `call-vs-3bet-6max-100bb.json` as derived from model/training knowledge and eye-check calibration, not a solver/exported action mix.
- `AHTOOOXA/poker-charts` is a strong structured source for ordinary RFI/vs-open/vs-3bet/vs-4bet nodes, but not for remaining multiway facing-squeeze gaps.
- `davidt35/preflop_charts` has only PNG/HTML chart views for the relevant data.
- `RangeAssistant` is a range editor/viewer with example files, not a bundled 6-max solved library.
- `memorizePreFlop` has RFI/vs-open text ranges only.
- `pink-ace-gto` and `range-master-mtt` are training/MTT-oriented and do not provide the missing 100bb 6-max cash squeeze-response branches.

## Integration Cost

### Engineering

Low to medium if using `poker-charts`; medium to high if manually extracting RangeConverter PDFs.

Implemented route:

- `src/preflop-sixmax-pekarstas.js` embeds the selected Pekarstas table.
- `src/preflop-sixmax-gtowizard.js` embeds the selected GTOWizard cash NL100 100bb table.
- `src/preflop-sixmax-deepfold.js` embeds the selected DEEPFOLD gap-fill tables.
- `src/preflop-sixmax-table.js` normalizes source chart keys to `(context, heroPosition, aggressorPosition)`.
- Source `MP` maps to this app's `HJ`.
- Cold-facing-3bet and facing-squeeze are kept as distinct contexts. GTOWizard and DEEPFOLD exact charts are used where present; if no verified chart exists, the spot falls back explicitly instead of aliasing to opener-facing-3bet or 4bet-defense charts.
- `preflopStrategyActions()` queries HU first, 6-max second, then generated fallback.
- Generated fallback remains active only for uncovered nodes, unusual stack sizes, or missing chart spots.

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
npm run validate:six-max -- --hands 6000 --seed 20260626 --out reports/sixmax-preflop-validation-6000.md
```

Observed six-max style after GTOWizard + DEEPFOLD preflop gap fill:

| Pos | RFI | VPIP | PFR | Table hit |
| --- | ---: | ---: | ---: | ---: |
| UTG | 15.0% | 15.0% | 15.0% | 100.0% |
| HJ | 19.6% | 17.6% | 17.4% | 100.0% |
| CO | 27.0% | 21.3% | 21.0% | 100.0% |
| BTN | 46.0% | 29.9% | 29.2% | 100.0% |
| SB | 46.3% | 21.4% | 20.2% | 99.9% |
| BB | - | 30.8% | 9.4% | 99.9% |

Latest source coverage in the deterministic 6000-hand run is 36,926 exact decisions, 3 alias decisions, and 10 fallback decisions. Reported percentages round to exact 100%, alias 0%, fallback 0%. Provider coverage is Pekarstas 83.4%, GTOWizard 9.0%, DEEPFOLD 5.2%, Greenline 2.4%, and w0uf below 0.1%.

### Product / Strategy

Medium.

The biggest poker risk is mixing assumptions:

- source chart rake and sizing may not match the simulator;
- some source action labels may not map cleanly to this app's simplified action set;
- weighted hands need deterministic sampling or normalized frequencies;
- incomplete nodes can create a style discontinuity between chart-backed and fallback-backed spots.

## Remaining Limitations

1. Some 6-max nodes still fall back or alias because the selected providers do not cover every response path. After the GTOWizard import, measured fallback is limited to `BB-vs-squeeze-BTN` and `SB-vs-squeeze-BTN`. Active squeeze aliases are limited to multi-cold-caller keys such as `BB-squeeze-CO-BTN-SB`, where no matching source branch was found.
2. The UI does not yet expose an opener/aggressor position selector, so manual `facing-open` review cannot always hit opener-specific charts. The simulator does pass this information.
3. ISO/limped-pot spots now have Greenline charts for 6-max, but the six-max simulator rarely exercises them because current RFI source charts do not limp first in.
4. Flop is intentionally unchanged because no compact table source fit the current runtime. The most credible next postflop route is solver-generated exports or a model trained/evaluated on solver-decision datasets.
5. `davidt35/preflop_charts` may contain missing cold-call/squeeze coverage, but it is image-only. Its recurring colors are machine-readable, but the repository does not define which colors map to call, 3bet, 4bet, 5bet, and squeeze actions. It should be converted only after that legend is verified from source or manually audited.
6. `CardPilot` has structured `facing-squeeze`-like files, but they are rejected until a sanity-passing version is found; the current grids contain impossible trash-hand aggression.
7. GTOWizard and DEEPFOLD line-specific files are preserved when `preflopLine` is available, then averaged into simplified runtime keys only as fallback. The remaining accuracy step is not code plumbing; it is finding exact source data for the two still-missing blind/cold-player facing BTN squeeze branches and multi-cold-caller squeeze branches.

## Decision

The current iteration uses a 6-max chart adapter with `pekarstas` as the primary table, `greenline` as a secondary exact-fill source, PokerCoaching for one high-volume CO facing-open node, `w0uf` for one explicitly covered BTN squeeze node, GTOWizard for broad 100bb squeeze/facing-squeeze/squeeze-vs-4bet coverage, and DEEPFOLD for cold-facing-3bet plus remaining verified 4bet gaps. RangeConverter free charts, RangeConverter reports, open-source postflop solvers, PokerBench, and image/app-only chart repositories remain calibration or future-data candidates.
