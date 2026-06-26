# Six-Max Preflop Validation

Generated with `npm run validate:six-max -- --hands 6000 --seed 20260626`.

- Hands: 6000
- Seed: 20260626
- Stack: 100bb
- Temperature: 1
- Policy: six-max chart-first lookup with generated fallback; version `hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2`.
- Scope: preflop-only six-max action tree; postflop EV is intentionally excluded.

## Position Summary

| Pos | Hands | VPIP | PFR | VPIP-PFR | RFI | RFI opp | Call vs open | 3bet vs open | Fold vs open | Continue vs 3bet | 4bet vs 3bet | Saw flop | Table hit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| UTG | 6000 | 15% | 15% | 0pp | 15% | 6000 | - | - | - | 50.9% | 19.4% | 4.4% | 100% |
| HJ | 6000 | 17.6% | 17.4% | 0.2pp | 19.6% | 5103 | 1.4% | 5.2% | 93.3% | 47.9% | 11.5% | 5.3% | 100% |
| CO | 6000 | 21.3% | 21% | 0.3pp | 27% | 4105 | 1% | 7.8% | 91.2% | 42.1% | 12.5% | 7.2% | 100% |
| BTN | 6000 | 29.9% | 29.2% | 0.7pp | 46% | 2995 | 1.5% | 13.1% | 85.4% | 25.9% | 6.9% | 14.3% | 100% |
| SB | 6000 | 21.4% | 20.2% | 1.2pp | 46.3% | 1616 | 1.9% | 11.6% | 86.5% | 11.8% | 5.2% | 11.3% | 99.9% |
| BB | 6000 | 30.8% | 9.4% | 21.3pp | - | 0 | 31% | 12.9% | 56.1% | 3.2% | 3.2% | 24.6% | 99.9% |

## Quick Read

- RFI is chart-backed for UTG/HJ/CO/BTN/SB at 100bb.
- BB has no RFI row because unopened hands end as walks/check options before a voluntary action.
- Versus-open, opener-facing-3bet, cold-facing-3bet, facing-squeeze, and facing-4bet nodes use exact source charts first when a verified chart exists; unresolved nodes fall back explicitly instead of aliasing across contexts.
- Observed source coverage: exact 100%, alias 0%, fallback 0%, unkeyed 0%.
- Exact source-line hits: 3155 decisions; other line-capable source decisions use aggregate charts for the requested runtime key.
- Decision samples show aliases as `requested-key->source-key`; only unresolvable nodes fall back to generated widths.
- Chart MAE is calculated only when the requested exact source chart exists. Alias nodes are reported as data gaps because there is no target chart to diff against.
- Source `allin` cells are treated as strong aggressive raises in normal 100bb 6-max nodes, not literal open jams.
- 3bet and defend frequencies should be treated as style diagnostics, not proof of GTO accuracy.

## Source Coverage

| Source mode | Decisions | Share | Meaning |
| --- | ---: | ---: | --- |
| exact | 36926 | 100% | Requested node has an exact source chart. |
| alias | 3 | 0% | Requested node is mapped to a nearby source chart. |
| fallback | 10 | 0% | No source chart resolved; generated range fallback was used. |
| unkeyed | 0 | 0% | No chart key exists for the spot. |

## Provider Coverage

| Provider | Decisions | Share |
| --- | ---: | ---: |
| pekarstas | 30800 | 83.4% |
| gtowizard | 3312 | 9% |
| deepfold | 1909 | 5.2% |
| greenline | 905 | 2.4% |
| w0uf | 3 | 0% |

## Spot Breakdown

| Spot | Decisions | Share |
| --- | ---: | ---: |
| unopened | 19819 | 53.7% |
| blind-defense | 7753 | 21% |
| facing-open | 5514 | 14.9% |
| cold-facing-3bet | 1752 | 4.7% |
| opener-facing-3bet | 1462 | 4% |
| threebettor-facing-4bet | 249 | 0.7% |
| squeeze-opportunity | 227 | 0.6% |
| cold-facing-4bet | 90 | 0.2% |
| facing-squeeze | 53 | 0.1% |
| squeeze | 20 | 0.1% |

## Chart Node Coverage

| Requested node | Source | Provider | Spot | Decisions | Exact | Alias | Fallback | MAE |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| UTG-RFI | UTG-RFI | pekarstas | unopened | 6000 | 6000 | 0 | 0 | 0 |
| MP-RFI | MP-RFI | pekarstas | unopened | 5103 | 5103 | 0 | 0 | 0 |
| CO-RFI | CO-RFI | pekarstas | unopened | 4105 | 4105 | 0 | 0 | 0 |
| BTN-RFI | BTN-RFI | pekarstas | unopened | 2995 | 2995 | 0 | 0 | 0 |
| SB-RFI | SB-RFI | pekarstas | unopened | 1616 | 1616 | 0 | 0 | 0 |
| SB-vs-open-BTN | SB-vs-open-BTN | pekarstas | blind-defense | 1379 | 1379 | 0 | 0 | 0 |
| BB-vs-open-BTN | BB-vs-open-BTN | pekarstas | blind-defense | 1116 | 1116 | 0 | 0 | 0 |
| BTN-vs-open-CO | BTN-vs-open-CO | gtowizard | facing-open | 1110 | 1110 | 0 | 0 | 0.0459 |
| CO-vs-open-MP | CO-vs-open-MP | gtowizard | facing-open | 998 | 998 | 0 | 0 | 0.045 |
| SB-vs-open-CO | SB-vs-open-CO | pekarstas | blind-defense | 939 | 939 | 0 | 0 | 0 |
| BTN-vs-open-MP | BTN-vs-open-MP | greenline | facing-open | 905 | 905 | 0 | 0 | 0 |
| MP-vs-open-UTG | MP-vs-open-UTG | gtowizard | facing-open | 897 | 897 | 0 | 0 | 0.028 |
| CO-vs-open-UTG | CO-vs-open-UTG | pekarstas | facing-open | 837 | 837 | 0 | 0 | 0 |
| BB-vs-open-CO | BB-vs-open-CO | pekarstas | blind-defense | 828 | 828 | 0 | 0 | 0 |
| BTN-vs-open-UTG | BTN-vs-open-UTG | pekarstas | facing-open | 767 | 767 | 0 | 0 | 0 |
| SB-vs-open-MP | SB-vs-open-MP | pekarstas | blind-defense | 761 | 761 | 0 | 0 | 0 |
| BB-vs-open-SB | BB-vs-open-SB | pekarstas | blind-defense | 749 | 749 | 0 | 0 | 0 |
| BB-vs-open-MP | BB-vs-open-MP | pekarstas | blind-defense | 688 | 688 | 0 | 0 | 0 |
| SB-vs-open-UTG | SB-vs-open-UTG | pekarstas | blind-defense | 677 | 677 | 0 | 0 | 0 |
| BB-vs-open-UTG | BB-vs-open-UTG | pekarstas | blind-defense | 616 | 616 | 0 | 0 | 0 |
| BB-cold-vs-3bet-SB | BB-cold-vs-3bet-SB | deepfold | cold-facing-3bet | 439 | 439 | 0 | 0 | 0 |
| SB-cold-vs-3bet-BTN | SB-cold-vs-3bet-BTN | deepfold | cold-facing-3bet | 363 | 363 | 0 | 0 | 0 |
| BB-cold-vs-3bet-BTN | BB-cold-vs-3bet-BTN | deepfold | cold-facing-3bet | 348 | 348 | 0 | 0 | 0 |
| BTN-vs-3bet-SB | BTN-vs-3bet-SB | pekarstas | opener-facing-3bet | 214 | 214 | 0 | 0 | 0 |

## Alias Mappings

| Mapping | Decisions | Share |
| --- | ---: | ---: |
| BB-squeeze-CO-BTN-SB->pekarstas:BB-vs-open-CO | 2 | 0% |
| BB-squeeze-MP-CO-SB->pekarstas:BB-vs-open-MP | 1 | 0% |

## Fallback Nodes

| Node | Decisions | Share |
| --- | ---: | ---: |
| BB-vs-squeeze-BTN | 5 | 0% |
| SB-vs-squeeze-BTN | 5 | 0% |

## Exact Chart MAE Check

| Node | Decisions | Combo-weighted action MAE |
| --- | ---: | ---: |
| UTG-RFI | 6000 | 0 |
| MP-RFI | 5103 | 0 |
| CO-RFI | 4105 | 0 |
| BTN-RFI | 2995 | 0 |
| SB-RFI | 1616 | 0 |
| SB-vs-open-BTN | 1379 | 0 |
| BB-vs-open-BTN | 1116 | 0 |
| BTN-vs-open-CO | 1110 | 0.04587 |
| CO-vs-open-MP | 998 | 0.04497 |
| SB-vs-open-CO | 939 | 0 |
| BTN-vs-open-MP | 905 | 0 |
| MP-vs-open-UTG | 897 | 0.02796 |

## Hand Samples

| # | Opener | 3bettor | 4bettor | Remaining players | Line |
| ---: | --- | --- | --- | --- | --- |
| 1 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 2 | CO | - | - | CO | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB fold |
| 3 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 4 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 5 | UTG | BTN | - | UTG BTN | UTG open 2.5; HJ fold; CO fold; BTN 3bet 8; SB fold; BB fold; UTG call 8 |
| 6 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 7 | HJ | - | - | HJ BB | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB call 2.5 |
| 8 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 9 | UTG | HJ | - | HJ | UTG open 2.5; HJ 3bet 8; CO fold; BTN fold; SB fold; BB fold; UTG fold |
| 10 | HJ | BB | - | HJ BB | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB 3bet 10; HJ call 10 |
| 11 | HJ | - | - | HJ BB | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB call 2.5 |
| 12 | BTN | - | - | BTN BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB call 2.2 |
| 13 | HJ | BB | - | BB | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB 3bet 10; HJ fold |
| 14 | SB | - | - | SB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB fold |
| 15 | BTN | - | - | BTN BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB call 2.2 |
| 16 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 17 | HJ | - | - | HJ | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB fold |
| 18 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 19 | CO | - | - | CO | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB fold |
| 20 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 21 | BTN | BB | - | BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB 3bet 8.8; BTN fold |
| 22 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 23 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 24 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 25 | CO | SB | - | SB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB 3bet 10; BB fold; CO fold |
| 26 | BTN | BB | - | BTN BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB 3bet 8.8; BTN call 8.8 |
| 27 | UTG | - | - | UTG BB | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB call 2.5 |
| 28 | BTN | - | - | BTN BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB call 2.2 |
| 29 | CO | BB | CO | CO BB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB 3bet 10; CO 4bet 22.5; BB call 22.5 |
| 30 | CO | - | - | CO BTN | UTG fold; HJ fold; CO open 2.5; BTN call 2.5; SB fold; BB fold |
| 31 | CO | BB | - | BB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB 3bet 10; CO fold |
| 32 | HJ | - | - | HJ | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB fold |
| 33 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 34 | BTN | - | - | BTN BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB call 2.2 |
| 35 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 36 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 37 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 38 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 39 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 40 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |

## Decision Samples

| Hand | Pos | Cards | Code | Context | Spot | Aggressor | Mode | Source | Picked | Top mix |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | UTG | 6♦ Q♠ | Q6o | unopened | unopened | - | exact | pekarstas:UTG-RFI | fold | fold:100% |
| 1 | HJ | 6♣ 7♠ | 76o | unopened | unopened | - | exact | pekarstas:MP-RFI | fold | fold:100% |
| 1 | CO | 6♥ 2♣ | 62o | unopened | unopened | - | exact | pekarstas:CO-RFI | fold | fold:100% |
| 1 | BTN | 2♥ 7♥ | 72s | unopened | unopened | - | exact | pekarstas:BTN-RFI | fold | fold:100% |
| 1 | SB | Q♥ Q♦ | QQ | unopened | unopened | - | exact | pekarstas:SB-RFI | raise | raise:100% |
| 1 | BB | J♠ 9♣ | J9o | blind-defense | blind-defense | SB | exact | pekarstas:BB-vs-open-SB | call | call:100% |
| 2 | UTG | 4♣ K♥ | K4o | unopened | unopened | - | exact | pekarstas:UTG-RFI | fold | fold:100% |
| 2 | HJ | 4♦ 5♦ | 54s | unopened | unopened | - | exact | pekarstas:MP-RFI | fold | fold:100% |
| 2 | CO | 6♠ K♠ | K6s | unopened | unopened | - | exact | pekarstas:CO-RFI | raise | raise:100% |
| 2 | BTN | 3♠ T♥ | T3o | facing-open | facing-open | CO | exact | gtowizard:CO 2.5bb BTN | fold | fold:100% |
| 2 | SB | A♥ 7♠ | A7o | blind-defense | blind-defense | CO | exact | pekarstas:SB-vs-open-CO | fold | fold:100% |
| 2 | BB | 5♠ 8♦ | 85o | blind-defense | blind-defense | CO | exact | pekarstas:BB-vs-open-CO | fold | fold:100% |
| 3 | UTG | K♠ A♥ | AKo | unopened | unopened | - | exact | pekarstas:UTG-RFI | raise | raise:100% |
| 3 | HJ | 8♣ 3♥ | 83o | facing-open | facing-open | UTG | exact | gtowizard:UTG 2.5bb MP | fold | fold:100% |
| 3 | CO | 2♦ 4♥ | 42o | facing-open | facing-open | UTG | exact | pekarstas:CO-vs-open-UTG | fold | fold:100% |
| 3 | BTN | 7♥ 9♣ | 97o | facing-open | facing-open | UTG | exact | pekarstas:BTN-vs-open-UTG | fold | fold:100% |
| 3 | SB | 4♠ 8♦ | 84o | blind-defense | blind-defense | UTG | exact | pekarstas:SB-vs-open-UTG | fold | fold:100% |
| 3 | BB | 3♣ J♦ | J3o | blind-defense | blind-defense | UTG | exact | pekarstas:BB-vs-open-UTG | fold | fold:100% |
| 4 | UTG | T♣ 7♠ | T7o | unopened | unopened | - | exact | pekarstas:UTG-RFI | fold | fold:100% |
| 4 | HJ | 3♠ 4♣ | 43o | unopened | unopened | - | exact | pekarstas:MP-RFI | fold | fold:100% |
| 4 | CO | 7♦ K♠ | K7o | unopened | unopened | - | exact | pekarstas:CO-RFI | fold | fold:100% |
| 4 | BTN | K♥ 2♦ | K2o | unopened | unopened | - | exact | pekarstas:BTN-RFI | fold | fold:100% |
| 4 | SB | K♣ 5♣ | K5s | unopened | unopened | - | exact | pekarstas:SB-RFI | raise | raise:100% |
| 4 | BB | 5♦ 6♥ | 65o | blind-defense | blind-defense | SB | exact | pekarstas:BB-vs-open-SB | call | call:100% |
| 5 | UTG | A♣ T♣ | ATs | unopened | unopened | - | exact | pekarstas:UTG-RFI | raise | raise:100% |
| 5 | HJ | K♥ 6♦ | K6o | facing-open | facing-open | UTG | exact | gtowizard:UTG 2.5bb MP | fold | fold:100% |
| 5 | CO | 9♣ Q♠ | Q9o | facing-open | facing-open | UTG | exact | pekarstas:CO-vs-open-UTG | fold | fold:100% |
| 5 | BTN | J♥ T♥ | JTs | facing-open | facing-open | UTG | exact | pekarstas:BTN-vs-open-UTG | raise | raise:100% |
| 5 | SB | 9♠ 4♣ | 94o | cold-facing-3bet | cold-facing-3bet | BTN | exact | deepfold:SB-cold-vs-3bet-BTN | fold | fold:100% |
| 5 | BB | 9♥ 7♠ | 97o | cold-facing-3bet | cold-facing-3bet | BTN | exact | deepfold:BB-cold-vs-3bet-BTN | fold | fold:100% |
| 5 | UTG | A♣ T♣ | ATs | facing-3bet | opener-facing-3bet | BTN | exact | pekarstas:UTG-vs-3bet-BTN | call | call:100% |
| 6 | UTG | 2♠ T♣ | T2o | unopened | unopened | - | exact | pekarstas:UTG-RFI | fold | fold:100% |
| 6 | HJ | J♣ 6♣ | J6s | unopened | unopened | - | exact | pekarstas:MP-RFI | fold | fold:100% |
| 6 | CO | 4♥ 7♣ | 74o | unopened | unopened | - | exact | pekarstas:CO-RFI | fold | fold:100% |
| 6 | BTN | A♥ 4♦ | A4o | unopened | unopened | - | exact | pekarstas:BTN-RFI | raise | raise:100% |
| 6 | SB | Q♠ 9♥ | Q9o | blind-defense | blind-defense | BTN | exact | pekarstas:SB-vs-open-BTN | fold | fold:100% |
| 6 | BB | 7♠ 2♥ | 72o | blind-defense | blind-defense | BTN | exact | pekarstas:BB-vs-open-BTN | fold | fold:100% |
| 7 | UTG | 4♣ 9♥ | 94o | unopened | unopened | - | exact | pekarstas:UTG-RFI | fold | fold:100% |
| 7 | HJ | 6♥ 5♥ | 65s | unopened | unopened | - | exact | pekarstas:MP-RFI | raise | raise:100% |
| 7 | CO | 2♠ 5♠ | 52s | facing-open | facing-open | HJ | exact | gtowizard:MP 2.5bb CO | fold | fold:100% |
| 7 | BTN | K♣ 8♣ | K8s | facing-open | facing-open | HJ | exact | greenline:BTN-vs-open-MP | fold | fold:100% |
| 7 | SB | 7♣ Q♦ | Q7o | blind-defense | blind-defense | HJ | exact | pekarstas:SB-vs-open-MP | fold | fold:100% |
| 7 | BB | 2♥ K♥ | K2s | blind-defense | blind-defense | HJ | exact | pekarstas:BB-vs-open-MP | call | call:100% |
| 8 | UTG | A♣ 3♣ | A3s | unopened | unopened | - | exact | pekarstas:UTG-RFI | raise | raise:100% |
| 8 | HJ | 7♣ 7♥ | 77 | facing-open | facing-open | UTG | exact | gtowizard:UTG 2.5bb MP | fold | fold:83% call:11% raise:6% |
| 8 | CO | A♦ J♣ | AJo | facing-open | facing-open | UTG | exact | pekarstas:CO-vs-open-UTG | fold | fold:100% |
| 8 | BTN | 8♠ 5♣ | 85o | facing-open | facing-open | UTG | exact | pekarstas:BTN-vs-open-UTG | fold | fold:100% |
| 8 | SB | 3♥ 2♣ | 32o | blind-defense | blind-defense | UTG | exact | pekarstas:SB-vs-open-UTG | fold | fold:100% |
| 8 | BB | 6♥ K♠ | K6o | blind-defense | blind-defense | UTG | exact | pekarstas:BB-vs-open-UTG | fold | fold:100% |
| 9 | UTG | J♣ T♣ | JTs | unopened | unopened | - | exact | pekarstas:UTG-RFI | raise | raise:100% |
| 9 | HJ | K♦ 5♦ | K5s | facing-open | facing-open | UTG | exact | gtowizard:UTG 2.5bb MP | raise | fold:71% raise:29% |
| 9 | CO | 2♣ 9♥ | 92o | cold-facing-3bet | cold-facing-3bet | HJ | exact | deepfold:CO-cold-vs-3bet-MP | fold | fold:100% |
| 9 | BTN | 7♦ 9♣ | 97o | cold-facing-3bet | cold-facing-3bet | HJ | exact | deepfold:BTN-cold-vs-3bet-MP | fold | fold:100% |
| 9 | SB | 4♦ 5♣ | 54o | cold-facing-3bet | cold-facing-3bet | HJ | exact | deepfold:SB-cold-vs-3bet-MP | fold | fold:100% |
| 9 | BB | T♥ J♥ | JTs | cold-facing-3bet | cold-facing-3bet | HJ | exact | deepfold:BB-cold-vs-3bet-MP | fold | fold:100% |
| 9 | UTG | J♣ T♣ | JTs | facing-3bet | opener-facing-3bet | HJ | exact | gtowizard:UTG 2.5bb MP 8.0bb CO FOLD BTN FOLD SB FOLD BB FOLD UTG | fold | fold:70% call:30% |
| 10 | UTG | 7♠ 2♠ | 72s | unopened | unopened | - | exact | pekarstas:UTG-RFI | fold | fold:100% |
| 10 | HJ | T♠ T♦ | TT | unopened | unopened | - | exact | pekarstas:MP-RFI | raise | raise:100% |
| 10 | CO | 4♣ 7♦ | 74o | facing-open | facing-open | HJ | exact | gtowizard:MP 2.5bb CO | fold | fold:100% |
| 10 | BTN | 8♠ 9♦ | 98o | facing-open | facing-open | HJ | exact | greenline:BTN-vs-open-MP | fold | fold:100% |
