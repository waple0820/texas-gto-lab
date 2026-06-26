# Heads-Up Strategy Validation

Generated with `npm run validate:heads-up -- --hands 5 --seed 123`.

- Hands: 5
- Seed: 123
- Level profile: solver
- Temperature: 1
- Noise: 0
- Samples per decision: 200
- Hero result: -2bb (-0.4bb/hand)
- Results: Hero 0, AI 4, split 1
- Showdowns: 1/5 (20%)
- Average max pot: 2bb

## Actor Style Summary

| Actor | Decisions | VPIP | PFR | Agg actions | Passive actions | Fold share | Avg recommended bet/raise freq | Policy sources | Top picked keys |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| hero | 8 | 20% | 0% | 1 | 3 | 50% | 7% | preflop:preflop-range-table-v1 5, trained:postflop-selfplay-regret-v3 3 | fold 4, check 2, call 1, bet-small 1 |
| ai | 5 | 0% | 0% | 0 | 5 | 0% | 7.7% | trained:postflop-selfplay-regret-v3 4, preflop:preflop-range-table-v1 1 | check 4, call 1 |

## Hand Table

| # | Hero | AI | Board | Winner | Hero bb | Max pot | SD | PFR | Line |
| ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | 4♠ Q♥ | 8♠ Q♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 2 | J♦ 7♠ | J♥ 7♣ | 7♥ 3♣ A♥ 8♠ T♣ | Split | 0 | 4 | Y | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:下注 1bb; river:ai:跟注 1bb |
| 3 | 3♥ J♠ | K♣ A♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 4 | 8♦ 5♣ | Q♣ 9♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 5 | T♣ 8♦ | K♣ 9♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |

## Decision Sample

| Hand | Actor | Street | Context | Picked | Executed | Amount | Top mix | Source |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | hero | preflop | blind-defense | fold | fold | 0 | fold:63% call:35% raise-small:1% | preflop:preflop-range-table-v1 |
| 2 | hero | preflop | blind-defense | call | call | 0.5 | fold:55% call:44% raise-small:1% | preflop:preflop-range-table-v1 |
| 2 | ai | preflop | check-option | check | check | 0 | check:100% raise:0% bet-big:0% | preflop:preflop-range-table-v1 |
| 2 | ai | flop | single-raised | check | check | 0 | check:88% bet-small:6% bet-mid:3% | trained:postflop-selfplay-regret-v3 |
| 2 | hero | flop | single-raised | check | check | 0 | check:84% bet-small:9% bet-mid:4% | trained:postflop-selfplay-regret-v3 |
| 2 | ai | turn | single-raised | check | check | 0 | check:87% bet-small:6% bet-mid:4% | trained:postflop-selfplay-regret-v3 |
| 2 | hero | turn | single-raised | check | check | 0 | check:85% bet-small:7% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 2 | ai | river | single-raised | check | check | 0 | check:86% bet-small:6% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 2 | hero | river | single-raised | bet-small | bet | 1 | check:83% bet-small:7% bet-mid:6% | trained:postflop-selfplay-regret-v3 |
| 2 | ai | river | facing-raise | call | call | 1 | call:82% fold:18% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 3 | hero | preflop | blind-defense | fold | fold | 0 | fold:57% call:41% raise-small:1% | preflop:preflop-range-table-v1 |
| 4 | hero | preflop | blind-defense | fold | fold | 0 | fold:69% call:29% raise-small:1% | preflop:preflop-range-table-v1 |
| 5 | hero | preflop | blind-defense | fold | fold | 0 | fold:68% call:31% raise-small:1% | preflop:preflop-range-table-v1 |
