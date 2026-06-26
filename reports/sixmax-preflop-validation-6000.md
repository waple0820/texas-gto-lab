# Six-Max Preflop Validation

Generated with `npm run validate:six-max -- --hands 6000 --seed 20260625`.

- Hands: 6000
- Seed: 20260625
- Stack: 100bb
- Temperature: 1
- Policy: six-max chart-first lookup with generated fallback; version `hu-100bb-preflop-rangeconverter-calibrated-v1+sixmax-100bb-pekarstas-v1`.
- Scope: preflop-only six-max action tree; postflop EV is intentionally excluded.

## Position Summary

| Pos | Hands | VPIP | PFR | VPIP-PFR | RFI | RFI opp | Call vs open | 3bet vs open | Fold vs open | Continue vs 3bet | 4bet vs 3bet | Saw flop | Table hit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| UTG | 6000 | 15.7% | 15.7% | 0pp | 15.7% | 6000 | - | - | - | 51.2% | 16.3% | 4.9% | 100% |
| HJ | 6000 | 18.3% | 18.3% | 0pp | 20.1% | 5060 | 0.2% | 8.2% | 91.6% | 41.4% | 11.3% | 8.6% | 99.7% |
| CO | 6000 | 25.3% | 22.3% | 3.1pp | 29.2% | 4041 | 9.4% | 8.3% | 82.3% | 42.6% | 8.3% | 10.5% | 82.5% |
| BTN | 6000 | 30.3% | 26.8% | 3.6pp | 44.9% | 2862 | 6.4% | 10.8% | 82.8% | 38.4% | 6.7% | 16.2% | 80.5% |
| SB | 6000 | 22.1% | 20.2% | 1.9pp | 45.6% | 1578 | 1.7% | 12.2% | 86.1% | 25% | 4.9% | 12.4% | 90.2% |
| BB | 6000 | 29.9% | 8.6% | 21.4pp | - | 0 | 30.5% | 11.6% | 57.8% | 7.9% | 3% | 25.1% | 79.1% |

## Quick Read

- RFI is chart-backed for UTG/HJ/CO/BTN/SB at 100bb.
- BB has no RFI row because unopened hands end as walks/check options before a voluntary action.
- Versus-open and versus-3bet nodes are chart-backed when the opener/3bettor position exists in the source table; otherwise they fall back to generated widths.
- Source `allin` cells are treated as strong aggressive raises in normal 100bb 6-max nodes, not literal open jams.
- 3bet and defend frequencies should be treated as style diagnostics, not proof of GTO accuracy.

## Hand Samples

| # | Opener | 3bettor | 4bettor | Remaining players | Line |
| ---: | --- | --- | --- | --- | --- |
| 1 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 2 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 3 | UTG | BTN | - | BTN | UTG open 2.5; HJ fold; CO fold; BTN 3bet 8; SB fold; BB fold; UTG fold |
| 4 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 5 | UTG | BTN | - | UTG BTN SB BB | UTG open 2.5; HJ fold; CO fold; BTN 3bet 8; SB call 8; BB call 8; UTG call 8 |
| 6 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 7 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 8 | HJ | - | - | HJ | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB fold |
| 9 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 10 | CO | - | - | CO BB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB call 2.5 |
| 11 | CO | - | - | CO BB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB call 2.5 |
| 12 | CO | BB | - | CO BB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB 3bet 10; CO call 10 |
| 13 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 14 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 15 | SB | - | - | SB BB | UTG fold; HJ fold; CO fold; BTN fold; SB open 3; BB call 3 |
| 16 | CO | - | - | CO | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB fold |
| 17 | CO | BTN | - | BTN | UTG fold; HJ fold; CO open 2.5; BTN 3bet 8; SB fold; BB fold; CO fold |
| 18 | UTG | - | - | UTG HJ | UTG open 2.5; HJ call 2.5; CO fold; BTN fold; SB fold; BB fold |
| 19 | CO | - | - | CO | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB fold |
| 20 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 21 | CO | SB | - | SB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB 3bet 10; BB fold; CO fold |
| 22 | UTG | - | - | UTG BB | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB call 2.5 |
| 23 | CO | - | - | CO | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB fold |
| 24 | CO | - | - | CO | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB fold |
| 25 | BTN | SB | BTN | BTN SB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB 3bet 8.8; BB fold; BTN 4bet 19.8; SB call 19.8 |
| 26 | HJ | - | - | HJ BB | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB call 2.5 |
| 27 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 28 | BTN | - | - | BTN BB | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB call 2.2 |
| 29 | CO | - | - | CO BB | UTG fold; HJ fold; CO open 2.5; BTN fold; SB fold; BB call 2.5 |
| 30 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 31 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 32 | BTN | - | - | BTN | UTG fold; HJ fold; CO fold; BTN open 2.2; SB fold; BB fold |
| 33 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 34 | HJ | - | - | HJ | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB fold |
| 35 | HJ | BB | - | BB | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB 3bet 10; HJ fold |
| 36 | - | - | - | BB | UTG fold; HJ fold; CO fold; BTN fold; SB fold |
| 37 | HJ | - | - | HJ | UTG fold; HJ open 2.5; CO fold; BTN fold; SB fold; BB fold |
| 38 | UTG | SB | - | UTG SB | UTG open 2.5; HJ fold; CO fold; BTN fold; SB 3bet 10; BB fold; UTG call 10 |
| 39 | UTG | - | - | UTG | UTG open 2.5; HJ fold; CO fold; BTN fold; SB fold; BB fold |
| 40 | HJ | CO | - | CO | UTG fold; HJ open 2.5; CO 3bet 8; BTN fold; SB fold; BB fold; HJ fold |

## Decision Samples

| Hand | Pos | Cards | Code | Context | Aggressor | Source | Picked | Top mix |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | UTG | T♣ 6♦ | T6o | unopened | - | UTG-RFI | fold | fold:100% |
| 1 | HJ | 7♦ Q♠ | Q7o | unopened | - | MP-RFI | fold | fold:100% |
| 1 | CO | 9♥ 5♣ | 95o | unopened | - | CO-RFI | fold | fold:100% |
| 1 | BTN | Q♥ 4♦ | Q4o | unopened | - | BTN-RFI | fold | fold:100% |
| 1 | SB | 3♥ 8♥ | 83s | unopened | - | SB-RFI | fold | fold:100% |
| 2 | UTG | K♠ 8♥ | K8o | unopened | - | UTG-RFI | fold | fold:100% |
| 2 | HJ | Q♦ 8♦ | Q8s | unopened | - | MP-RFI | fold | fold:100% |
| 2 | CO | 7♦ 4♦ | 74s | unopened | - | CO-RFI | fold | fold:100% |
| 2 | BTN | J♣ 2♦ | J2o | unopened | - | BTN-RFI | fold | fold:100% |
| 2 | SB | 7♣ K♦ | K7o | unopened | - | SB-RFI | fold | fold:100% |
| 3 | UTG | 4♠ 4♥ | 44 | unopened | - | UTG-RFI | raise | fold:50% raise:50% |
| 3 | HJ | Q♠ 2♥ | Q2o | facing-open | UTG | MP-vs-open-UTG | fold | fold:100% |
| 3 | CO | 4♦ Q♣ | Q4o | facing-open | UTG | CO-vs-open-UTG | fold | fold:100% |
| 3 | BTN | K♠ A♥ | AKo | facing-open | UTG | BTN-vs-open-UTG | raise | raise:100% |
| 3 | SB | A♦ 3♥ | A3o | facing-3bet | BTN | fallback | fold | fold:100% call:0% raise:0% |
| 3 | BB | J♣ T♥ | JTo | facing-3bet | BTN | fallback | fold | fold:100% call:0% raise:0% |
| 3 | UTG | 4♠ 4♥ | 44 | facing-3bet | BTN | UTG-vs-3bet-BTN | fold | fold:100% |
| 4 | UTG | A♦ 4♣ | A4o | unopened | - | UTG-RFI | fold | fold:100% |
| 4 | HJ | 6♣ Q♦ | Q6o | unopened | - | MP-RFI | fold | fold:100% |
| 4 | CO | 9♦ 6♠ | 96o | unopened | - | CO-RFI | fold | fold:100% |
| 4 | BTN | 3♥ 4♦ | 43o | unopened | - | BTN-RFI | fold | fold:100% |
| 4 | SB | Q♣ J♣ | QJs | unopened | - | SB-RFI | raise | raise:100% |
| 4 | BB | 6♥ A♠ | A6o | blind-defense | SB | BB-vs-open-SB | call | call:100% |
| 5 | UTG | K♠ Q♠ | KQs | unopened | - | UTG-RFI | raise | raise:100% |
| 5 | HJ | 3♥ 4♣ | 43o | facing-open | UTG | MP-vs-open-UTG | fold | fold:100% |
| 5 | CO | 5♦ 2♦ | 52s | facing-open | UTG | CO-vs-open-UTG | fold | fold:100% |
| 5 | BTN | J♥ J♣ | JJ | facing-open | UTG | BTN-vs-open-UTG | raise | raise:100% |
| 5 | SB | J♦ K♦ | KJs | facing-3bet | BTN | fallback | call | call:72% fold:28% raise:0% |
| 5 | BB | Q♣ A♠ | AQo | facing-3bet | BTN | fallback | call | call:60% raise:40% fold:0% |
| 5 | UTG | K♠ Q♠ | KQs | facing-3bet | BTN | UTG-vs-3bet-BTN | call | call:100% |
| 6 | UTG | J♣ K♣ | KJs | unopened | - | UTG-RFI | raise | raise:100% |
| 6 | HJ | 2♠ T♥ | T2o | facing-open | UTG | MP-vs-open-UTG | fold | fold:100% |
| 6 | CO | K♥ 5♠ | K5o | facing-open | UTG | CO-vs-open-UTG | fold | fold:100% |
| 6 | BTN | 3♦ 6♥ | 63o | facing-open | UTG | BTN-vs-open-UTG | fold | fold:100% |
| 6 | SB | 6♠ 8♦ | 86o | blind-defense | UTG | SB-vs-open-UTG | fold | fold:100% |
| 6 | BB | 4♣ A♦ | A4o | blind-defense | UTG | BB-vs-open-UTG | fold | fold:100% |
| 7 | UTG | K♥ Q♣ | KQo | unopened | - | UTG-RFI | raise | raise:100% |
| 7 | HJ | 4♣ 7♥ | 74o | facing-open | UTG | MP-vs-open-UTG | fold | fold:100% |
| 7 | CO | T♦ 2♥ | T2o | facing-open | UTG | CO-vs-open-UTG | fold | fold:100% |
| 7 | BTN | J♠ 9♥ | J9o | facing-open | UTG | BTN-vs-open-UTG | fold | fold:100% |
| 7 | SB | A♥ 2♦ | A2o | blind-defense | UTG | SB-vs-open-UTG | fold | fold:100% |
| 7 | BB | T♥ 9♠ | T9o | blind-defense | UTG | BB-vs-open-UTG | fold | fold:100% |
| 8 | UTG | 8♠ A♦ | A8o | unopened | - | UTG-RFI | fold | fold:100% |
| 8 | HJ | 9♠ 9♣ | 99 | unopened | - | MP-RFI | raise | raise:100% |
| 8 | CO | J♠ 5♠ | J5s | facing-open | HJ | fallback | fold | fold:100% call:0% raise:0% |
| 8 | BTN | 5♥ 4♦ | 54o | facing-open | HJ | fallback | fold | fold:100% call:0% raise:0% |
| 8 | SB | Q♣ T♠ | QTo | blind-defense | HJ | SB-vs-open-MP | fold | fold:100% |
| 8 | BB | T♥ 8♣ | T8o | blind-defense | HJ | BB-vs-open-MP | fold | fold:100% |
| 9 | UTG | J♥ 4♠ | J4o | unopened | - | UTG-RFI | fold | fold:100% |
| 9 | HJ | 3♣ 7♦ | 73o | unopened | - | MP-RFI | fold | fold:100% |
| 9 | CO | 5♦ A♣ | A5o | unopened | - | CO-RFI | fold | fold:100% |
| 9 | BTN | Q♦ 4♥ | Q4o | unopened | - | BTN-RFI | fold | fold:100% |
| 9 | SB | 6♣ 6♥ | 66 | unopened | - | SB-RFI | raise | raise:100% |
| 9 | BB | 8♣ Q♥ | Q8o | blind-defense | SB | BB-vs-open-SB | call | call:100% |
| 10 | UTG | 5♠ 3♠ | 53s | unopened | - | UTG-RFI | fold | fold:100% |
| 10 | HJ | 2♠ J♥ | J2o | unopened | - | MP-RFI | fold | fold:100% |
| 10 | CO | 8♥ 8♦ | 88 | unopened | - | CO-RFI | raise | raise:100% |
| 10 | BTN | 8♣ 3♥ | 83o | facing-open | CO | BTN-vs-open-CO | fold | fold:100% |
| 10 | SB | 7♠ Q♣ | Q7o | blind-defense | CO | SB-vs-open-CO | fold | fold:100% |
| 10 | BB | 4♠ 4♣ | 44 | blind-defense | CO | BB-vs-open-CO | call | call:100% |
