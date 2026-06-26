# Heads-Up Strategy Validation

Generated with `npm run validate:heads-up -- --hands 100 --seed 20260626`.

- Hands: 100
- Seed: 20260626
- Level profile: solver
- Temperature: 1
- Noise: 0
- Samples per decision: 120
- Stack mode: reset to 100bb each hand
- Hero result: -66.9bb (-0.67bb/hand)
- Results: Hero 39, AI 60, split 1
- Showdowns: 13/100 (13%)
- Average max pot: 20.9bb

## Actor Style Summary

| Actor | Decisions | VPIP | PFR | Agg actions | Passive actions | Fold share | Avg recommended bet/raise freq | Policy sources | Top picked keys |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| hero | 221 | 87% | 61% | 96 | 72 | 24% | 44.4% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 115, trained:postflop-turn-river-cascade-regret-v1 95, distilled:distill-river-v3 11 | raise 61, fold 53, call 45, check 27, bet-small 11, raise-small 9, bet-mid 8, jam 2 |
| ai | 222 | 52% | 15% | 73 | 115 | 15.3% | 31.3% | trained:postflop-turn-river-cascade-regret-v1 117, preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 88, distilled:distill-river-v3 17 | check 69, call 46, fold 34, raise 16, bet-small 15, bet-big 14, bet-mid 11, bet-over 10 |

## Hand Table

| # | Hero | AI | Board | Winner | Hero bb | Max pot | SD | PFR | Line |
| ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | Q♥ T♠ | 7♦ 5♠ | Q♦ 7♠ 5♦ K♥ 5♥ | AI | -99.9 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:加注 13.4bb; flop:ai:加注 21.1bb; flop:hero:加注 38.3bb; flop:ai:跟注 23.4bb; turn:ai:全压 45.8bb; turn:hero:跟注 45.8bb |
| 2 | K♠ 3♥ | 5♥ 9♥ | 6♣ 3♠ 2♠ A♣ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 1.9bb; turn:hero:弃牌 |
| 3 | K♣ J♠ | 4♦ 6♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 4 | 5♦ 3♠ | 7♠ 7♥ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |
| 5 | 6♦ K♥ | 3♣ 2♠ | 2♣ Q♣ 9♠ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 1.2bb; flop:hero:弃牌 |
| 6 | A♦ K♦ | A♣ 6♠ | J♣ Q♣ 9♦ A♠ | Hero | 4.4 | 11.7 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:跟注 1.9bb; turn:ai:过牌; turn:hero:下注 2.9bb; turn:ai:弃牌 |
| 7 | 5♥ 8♣ | 8♦ 5♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 8 | 9♣ 3♥ | 2♦ T♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 9 | J♥ 7♦ | 3♣ K♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 10 | J♦ A♥ | 3♣ Q♣ | 6♠ 8♥ T♣ 5♦ | Hero | 8.3 | 27.4 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 5.8bb; turn:hero:加注 16.6bb; turn:ai:弃牌 |
| 11 | 3♠ 8♣ | 5♥ A♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 12 | J♣ A♥ | Q♥ 6♣ | J♥ 7♦ T♠ | Hero | 4.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:加注 5.4bb; flop:ai:弃牌 |
| 13 | 7♣ J♠ | 7♦ 6♥ | 3♣ A♠ T♥ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:弃牌 |
| 14 | Q♦ Q♣ | J♦ 2♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 15 | A♣ 5♠ | 3♣ 3♠ | 8♦ 5♣ 4♠ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:弃牌 |
| 16 | 9♠ 9♥ | K♥ 8♦ | 3♦ K♠ 3♣ K♣ T♥ | AI | -100 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:加注 11.2bb; flop:ai:加注 18.2bb; flop:hero:跟注 12.8bb; turn:ai:下注 20.3bb; turn:hero:加注 57bb; turn:ai:全压 53.2bb; turn:hero:跟注 16.5bb |
| 17 | Q♥ T♥ | 8♣ 3♣ | 3♦ 5♠ T♦ A♥ 8♥ | AI | -99.9 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:加注 6.9bb; flop:ai:跟注 4bb; turn:ai:过牌; turn:hero:下注 9.4bb; turn:ai:全压 90.6bb; turn:hero:跟注 81.2bb |
| 18 | 6♦ 9♣ | 6♠ 7♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 19 | Q♥ 2♦ | 4♠ 5♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 20 | A♦ 3♠ | 9♦ A♣ | 4♠ K♠ J♠ 3♦ K♥ | Hero | 2.6 | 6.7 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:下注 1.7bb; river:ai:弃牌 |
| 21 | A♦ 7♠ | 5♥ 8♦ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 22 | K♠ A♦ | Q♠ Q♥ | 8♥ 7♦ 2♣ 4♥ K♣ | Hero | 100 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:全压 97.5bb; preflop:ai:全压 93.4bb |
| 23 | 9♣ K♥ | 2♦ Q♥ | 2♣ 7♣ 4♣ | AI | -1 | 4.3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 2.3bb; flop:hero:弃牌 |
| 24 | T♥ 4♣ | 9♣ 8♦ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 25 | 9♥ Q♣ | 6♥ 4♦ | T♠ 8♦ K♦ 9♦ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 1.2bb; turn:hero:弃牌 |
| 26 | 5♦ 8♦ | Q♣ K♦ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |
| 27 | 2♥ 9♠ | Q♥ 5♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 28 | 8♥ 3♥ | 7♦ J♠ | 9♠ K♦ 5♦ A♣ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 5.8bb; turn:hero:弃牌 |
| 29 | K♣ 3♦ | Q♥ 8♠ | 5♣ 7♦ 2♣ 5♥ | AI | -2.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 7.2bb; turn:hero:弃牌 |
| 30 | Q♠ 3♦ | J♥ 7♣ | T♥ A♠ 2♦ 9♥ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 5.8bb; turn:hero:弃牌 |
| 31 | K♠ Q♥ | 4♠ A♦ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 32 | 2♠ A♣ | 3♦ 7♠ | 4♠ 4♥ K♦ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 1.2bb; flop:hero:弃牌 |
| 33 | 8♠ K♥ | K♦ Q♦ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 34 | 3♣ 2♠ | 3♦ Q♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 35 | A♠ J♠ | 6♠ 7♥ | 9♣ 3♥ 8♣ 7♦ 4♥ | AI | -9.7 | 19.5 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 7.2bb; turn:hero:跟注 7.2bb; river:ai:过牌; river:hero:过牌 |
| 36 | 3♦ T♠ | A♠ 4♣ | 5♥ 6♣ T♦ 6♥ | AI | -1 | 4.3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 2.3bb; turn:hero:弃牌 |
| 37 | 5♥ 3♠ | 4♣ 5♣ | 6♥ K♥ K♣ | Hero | 1 | 3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:下注 1bb; flop:ai:弃牌 |
| 38 | 9♠ A♠ | T♥ 9♣ | 3♦ 2♦ J♣ | Hero | 2.6 | 11.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 6.3bb; flop:ai:弃牌 |
| 39 | 5♥ T♦ | Q♥ 8♥ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |
| 40 | 3♣ 6♥ | 4♦ 7♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 41 | Q♥ 3♥ | 7♠ 8♣ | 5♦ 6♥ 2♠ 5♥ | Hero | 2.6 | 6.7 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 1.7bb; turn:ai:弃牌 |
| 42 | 2♦ 2♣ | A♥ 9♦ | K♦ 8♠ 7♦ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:弃牌 |
| 43 | 7♣ A♠ | 9♣ 6♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 44 | Q♦ T♠ | 9♥ 7♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 45 | 2♣ 6♠ | Q♣ 3♥ | 4♥ J♦ 7♥ J♣ 4♣ | AI | -1 | 2 | Y | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:过牌 |
| 46 | 2♦ 2♠ | T♣ 8♥ | T♠ 2♣ A♦ 4♦ K♣ | Hero | 49.1 | 98.2 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:跟注 2.9bb; turn:ai:下注 12.5bb; turn:hero:加注 24.2bb; turn:ai:跟注 11.7bb; river:ai:过牌; river:hero:下注 19.5bb; river:ai:跟注 19.5bb |
| 47 | 6♦ 2♦ | A♣ 6♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 48 | 8♥ 6♠ | J♣ 6♣ | T♣ 5♦ 4♥ 3♥ 2♦ | Split | 0 | 2 | Y | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:过牌 |
| 49 | 5♠ 9♣ | J♣ 6♣ | 8♠ 9♥ 4♥ | AI | -2.5 | 7.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:弃牌 |
| 50 | 3♦ 6♥ | 9♦ J♦ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |
| 51 | K♥ 7♥ | 9♥ 3♥ | 8♦ 3♦ 9♠ | AI | -2.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:弃牌 |
| 52 | 9♥ T♥ | A♣ 3♥ | 8♥ 7♠ A♠ 2♠ | AI | -25.7 | 111 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:跟注 4.1bb; flop:ai:下注 19.1bb; flop:hero:跟注 19.1bb; turn:ai:下注 59.6bb; turn:hero:弃牌 |
| 53 | 8♥ 7♥ | 6♦ 2♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 54 | 8♦ J♣ | 3♦ 3♠ | A♠ 3♣ Q♥ | AI | -2.5 | 7.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:弃牌 |
| 55 | 8♠ 9♥ | 9♠ 5♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 56 | 6♠ 5♥ | 9♠ T♠ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |
| 57 | K♥ 9♠ | 5♠ A♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 58 | 6♣ Q♦ | Q♠ 8♦ | 4♦ A♥ 6♥ 3♠ | Hero | 1 | 4 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 2bb; turn:ai:弃牌 |
| 59 | 5♣ 6♣ | Q♦ T♣ | 2♥ 4♥ T♠ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:弃牌 |
| 60 | 5♦ Q♣ | 2♦ 5♥ | 3♦ 4♣ 6♠ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 1.2bb; flop:hero:弃牌 |
| 61 | 9♠ 4♠ | 7♣ K♥ | 9♥ 3♣ K♠ 8♣ Q♦ | AI | -47 | 94.2 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:跟注 1.7bb; turn:ai:下注 12.2bb; turn:hero:加注 22.5bb; turn:ai:跟注 10.3bb; river:ai:下注 20.4bb; river:hero:跟注 20.4bb |
| 62 | 2♥ 3♣ | 3♥ 9♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 63 | 4♣ 4♠ | 9♠ 5♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 64 | 2♣ 6♦ | T♣ 7♥ | A♠ 9♠ T♠ | Hero | 1 | 3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:下注 1bb; flop:ai:弃牌 |
| 65 | J♦ 4♠ | A♠ Q♠ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 66 | 5♠ T♥ | 3♠ Q♠ | 9♦ 6♦ 8♣ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 1.2bb; flop:hero:弃牌 |
| 67 | 2♣ 2♦ | T♠ A♥ | Q♠ 9♣ J♣ 7♠ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 1.9bb; turn:hero:弃牌 |
| 68 | K♣ 9♣ | Q♥ K♠ | 9♦ T♣ T♠ | Hero | 35.2 | 97.7 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:跟注 4.1bb; flop:ai:过牌; flop:hero:下注 13.2bb; flop:ai:加注 28.5bb; flop:hero:加注 42.8bb; flop:ai:弃牌 |
| 69 | 5♥ 6♥ | 8♦ Q♦ | 5♠ 4♦ T♦ Q♥ Q♠ | AI | -20.5 | 41 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:跟注 2.9bb; turn:ai:下注 4.1bb; turn:hero:跟注 4.1bb; river:ai:下注 11bb; river:hero:跟注 11bb |
| 70 | K♥ 2♣ | 7♣ 8♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 71 | 9♠ Q♠ | Q♥ 7♥ | A♦ 3♥ Q♣ 8♥ 9♣ | Hero | 28.6 | 57.2 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:跟注 1.9bb; turn:ai:下注 12.8bb; turn:hero:跟注 12.8bb; river:ai:过牌; river:hero:下注 11.4bb; river:ai:跟注 11.4bb |
| 72 | 8♠ 8♦ | J♦ K♥ | 3♠ 4♠ T♣ A♥ 7♦ | Hero | 5 | 13.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 2.5bb; flop:ai:跟注 2.5bb; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:下注 3.3bb; river:ai:弃牌 |
| 73 | A♠ 2♣ | J♥ 6♣ | 6♠ T♣ 8♥ | AI | -1 | 4.3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 2.3bb; flop:hero:弃牌 |
| 74 | Q♦ 7♥ | 7♠ J♠ | 5♦ T♣ A♠ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 1.2bb; flop:hero:弃牌 |
| 75 | T♦ 8♥ | J♠ 9♥ | Q♠ 4♣ T♠ 7♠ | Hero | 2.6 | 11.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 6.3bb; turn:ai:弃牌 |
| 76 | A♠ A♦ | 7♥ 8♣ | 8♦ J♠ 5♥ 2♥ 4♥ | Hero | 100.1 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:全压 97.5bb; flop:ai:全压 90.3bb |
| 77 | 8♣ 2♠ | 7♦ 3♦ | A♦ A♠ 9♣ 3♥ | AI | -1 | 4.3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 2.3bb; turn:hero:弃牌 |
| 78 | A♣ J♠ | T♦ 4♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 79 | 6♥ Q♦ | J♥ 9♥ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |
| 80 | 8♠ K♠ | 2♥ 8♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 81 | 7♦ 8♣ | A♥ 5♦ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 82 | 9♠ A♥ | 4♠ 7♠ | 9♦ A♠ J♥ | Hero | 1 | 3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:下注 1bb; flop:ai:弃牌 |
| 83 | 8♣ 8♦ | 6♦ J♦ | 9♠ A♦ A♣ 6♥ | AI | -2.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 7.2bb; turn:hero:弃牌 |
| 84 | 2♣ J♦ | Q♦ J♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 85 | A♦ 5♠ | 3♦ 8♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 86 | K♥ 8♠ | J♠ 2♠ | A♣ 2♥ T♥ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:弃牌 |
| 87 | T♦ K♣ | Q♣ 8♣ | 6♦ K♠ 9♣ | Hero | 2.6 | 6.7 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:弃牌 |
| 88 | Q♥ 3♦ | 8♥ 6♣ | Q♣ 7♣ 5♣ Q♦ A♥ | Hero | 3.7 | 11.1 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 1bb; turn:ai:加注 2.7bb; turn:hero:跟注 1.7bb; river:ai:过牌; river:hero:下注 3.7bb; river:ai:弃牌 |
| 89 | T♥ K♦ | 4♣ Q♦ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 90 | 5♠ K♥ | 7♦ 2♦ | 7♣ 5♦ 5♥ Q♥ K♦ | Hero | 35.8 | 71.6 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:跟注 5.8bb; turn:ai:下注 9.6bb; turn:hero:跟注 9.6bb; river:ai:过牌; river:hero:下注 17.9bb; river:ai:跟注 17.9bb |
| 91 | 9♥ K♦ | 7♦ 9♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 92 | T♠ 9♠ | 5♥ 9♥ | 6♥ 2♣ K♠ | Hero | 2.6 | 6.7 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:弃牌 |
| 93 | 3♥ Q♣ | J♥ 8♥ | T♦ 7♣ 6♥ 3♠ | Hero | 2.5 | 7.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 2.5bb; turn:ai:弃牌 |
| 94 | 3♣ 6♣ | 3♦ J♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 95 | K♥ 6♥ | 8♥ J♦ | 3♦ T♥ A♠ 8♦ | AI | -2.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 7.2bb; turn:hero:弃牌 |
| 96 | 2♠ 6♣ | 7♦ 5♦ | 3♥ 2♣ 2♥ | Hero | 1 | 3 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:过牌; flop:hero:下注 1bb; flop:ai:弃牌 |
| 97 | T♦ 7♠ | 8♣ K♣ | 5♣ 5♥ K♠ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:弃牌 |
| 98 | 3♠ 4♠ | Q♦ 8♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 99 | Q♦ 7♠ | 7♥ 5♦ | A♥ T♥ T♣ | AI | -1 | 3.2 | N | - | preflop:hero:跟注 0.5bb; preflop:ai:过牌; flop:ai:下注 1.2bb; flop:hero:弃牌 |
| 100 | 3♠ 6♠ | 4♥ A♠ | - | AI | -1 | 4.3 | N | ai | preflop:hero:跟注 0.5bb; preflop:ai:加注 2.3bb; preflop:hero:弃牌 |

## Decision Sample

| Hand | Actor | Street | Context | Picked | Executed | Amount | Top mix | Source |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 1 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 1 | ai | flop | single-raised | bet-over | bet | 7.2 | bet-big:25% bet-small:25% bet-mid:20% | trained:postflop-turn-river-cascade-regret-v1 |
| 1 | hero | flop | facing-bet | raise-small | raise | 13.4 | raise-small:68% call:28% raise-big:3% | trained:postflop-turn-river-cascade-regret-v1 |
| 1 | ai | flop | facing-raise | raise-small | raise | 21.1 | raise-small:77% call:18% raise-big:2% | trained:postflop-turn-river-cascade-regret-v1 |
| 1 | hero | flop | facing-bet | raise-small | raise | 38.3 | raise-small:64% call:30% raise-big:3% | trained:postflop-turn-river-cascade-regret-v1 |
| 1 | ai | flop | facing-bet | call | call | 23.4 | call:86% raise-small:7% jam:4% | trained:postflop-turn-river-cascade-regret-v1 |
| 1 | ai | turn | single-raised | bet-mid | allin | 45.8 | bet-big:24% bet-small:22% bet-mid:21% | trained:postflop-turn-river-cascade-regret-v1 |
| 1 | hero | turn | facing-raise | call | call | 45.8 | call:87% raise-small:8% raise-big:3% | trained:postflop-turn-river-cascade-regret-v1 |
| 2 | hero | preflop | unopened | raise | raise | 2 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 2 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 2 | ai | flop | single-raised | check | check | 0 | check:87% bet-small:6% bet-mid:5% | trained:postflop-turn-river-cascade-regret-v1 |
| 2 | hero | flop | single-raised | check | check | 0 | bet-small:22% check:21% bet-mid:21% | trained:postflop-turn-river-cascade-regret-v1 |
| 2 | ai | turn | single-raised | bet-small | bet | 1.9 | check:88% bet-mid:5% bet-small:5% | trained:postflop-turn-river-cascade-regret-v1 |
| 2 | hero | turn | facing-raise | fold | fold | 0 | fold:86% call:13% raise-small:0% | trained:postflop-turn-river-cascade-regret-v1 |
| 3 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 3 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 4 | hero | preflop | unopened | call | call | 0.5 | call:53% fold:25% raise:22% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 4 | ai | preflop | check-option | raise | raise | 2.3 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 4 | hero | preflop | facing-open | fold | fold | 0 | fold:100% call:0% raise:0% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 5 | hero | preflop | unopened | call | call | 0.5 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 5 | ai | preflop | check-option | check | check | 0 | check:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 5 | ai | flop | single-raised | bet-small | bet | 1.2 | check:27% bet-small:23% bet-mid:19% | trained:postflop-turn-river-cascade-regret-v1 |
| 5 | hero | flop | facing-raise | fold | fold | 0 | fold:99% call:1% raise-small:0% | trained:postflop-turn-river-cascade-regret-v1 |
| 6 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 6 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 6 | ai | flop | single-raised | bet-small | bet | 1.9 | check:28% bet-small:21% bet-mid:20% | trained:postflop-turn-river-cascade-regret-v1 |
| 6 | hero | flop | facing-raise | call | call | 1.9 | call:86% fold:11% raise-small:2% | trained:postflop-turn-river-cascade-regret-v1 |
| 6 | ai | turn | single-raised | check | check | 0 | check:80% bet-mid:9% bet-small:7% | trained:postflop-turn-river-cascade-regret-v1 |
| 6 | hero | turn | single-raised | bet-small | bet | 2.9 | bet-big:82% bet-mid:10% bet-small:7% | trained:postflop-turn-river-cascade-regret-v1 |
| 6 | ai | turn | facing-raise | fold | fold | 0 | call:75% fold:22% raise-small:2% | trained:postflop-turn-river-cascade-regret-v1 |
| 7 | hero | preflop | unopened | fold | fold | 0 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 8 | hero | preflop | unopened | raise | raise | 2 | call:53% fold:25% raise:22% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 8 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 9 | hero | preflop | unopened | raise | raise | 2 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 9 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 10 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 10 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 10 | ai | flop | single-raised | check | check | 0 | check:87% bet-small:6% bet-mid:4% | trained:postflop-turn-river-cascade-regret-v1 |
| 10 | hero | flop | single-raised | check | check | 0 | check:85% bet-small:7% bet-mid:5% | trained:postflop-turn-river-cascade-regret-v1 |
| 10 | ai | turn | single-raised | bet-big | bet | 5.8 | check:58% bet-small:18% bet-mid:17% | trained:postflop-turn-river-cascade-regret-v1 |
| 10 | hero | turn | facing-raise | raise-big | raise | 16.6 | fold:34% call:20% raise-small:16% | trained:postflop-turn-river-cascade-regret-v1 |
| 10 | ai | turn | facing-bet | fold | fold | 0 | fold:96% call:3% raise-small:1% | trained:postflop-turn-river-cascade-regret-v1 |
| 11 | hero | preflop | unopened | fold | fold | 0 | call:53% fold:25% raise:22% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 12 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 12 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 12 | ai | flop | single-raised | bet-small | bet | 1.9 | check:58% bet-small:21% bet-mid:14% | trained:postflop-turn-river-cascade-regret-v1 |
| 12 | hero | flop | facing-raise | raise-small | raise | 5.4 | raise-small:79% call:18% raise-big:3% | trained:postflop-turn-river-cascade-regret-v1 |
| 12 | ai | flop | facing-raise | fold | fold | 0 | fold:95% call:3% raise-small:1% | trained:postflop-turn-river-cascade-regret-v1 |
| 13 | hero | preflop | unopened | raise | raise | 2 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 13 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 13 | ai | flop | single-raised | bet-small | bet | 1.9 | check:27% bet-small:24% bet-mid:18% | trained:postflop-turn-river-cascade-regret-v1 |
| 13 | hero | flop | facing-raise | fold | fold | 0 | fold:98% raise-small:2% raise-big:1% | trained:postflop-turn-river-cascade-regret-v1 |
| 14 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 14 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 15 | hero | preflop | unopened | raise | raise | 2 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 15 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 15 | ai | flop | single-raised | bet-big | bet | 5.8 | bet-big:74% check:17% bet-small:5% | trained:postflop-turn-river-cascade-regret-v1 |
| 15 | hero | flop | facing-raise | fold | fold | 0 | call:28% raise-small:21% fold:20% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 16 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 16 | ai | flop | single-raised | bet-big | bet | 5.8 | bet-small:38% bet-mid:31% bet-big:26% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | hero | flop | facing-raise | raise-small | raise | 11.2 | raise-small:56% call:23% raise-big:14% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | ai | flop | facing-raise | raise-small | raise | 18.2 | raise-small:75% call:22% raise-big:2% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | hero | flop | facing-bet | call | call | 12.8 | raise-small:72% call:25% raise-big:3% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | ai | turn | single-raised | bet-small | bet | 20.3 | bet-small:46% check:33% bet-big:10% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | hero | turn | facing-raise | raise-small | raise | 57 | raise-small:54% call:37% raise-big:6% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | ai | turn | facing-raise | raise-small | allin | 53.2 | call:57% raise-small:32% raise-big:6% | trained:postflop-turn-river-cascade-regret-v1 |
| 16 | hero | turn | facing-raise | call | call | 16.5 | raise-small:48% call:35% raise-big:14% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 17 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 17 | ai | flop | single-raised | bet-mid | bet | 2.9 | check:26% bet-small:24% bet-mid:19% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | hero | flop | facing-raise | raise-small | raise | 6.9 | raise-small:79% call:17% raise-big:3% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | ai | flop | facing-raise | call | call | 4 | call:86% fold:13% raise-small:0% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | ai | turn | single-raised | check | check | 0 | check:85% bet-mid:7% bet-small:6% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | hero | turn | single-raised | bet-mid | bet | 9.4 | check:24% bet-mid:22% bet-small:22% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | ai | turn | facing-raise | jam | allin | 90.6 | fold:35% call:21% raise-small:15% | trained:postflop-turn-river-cascade-regret-v1 |
| 17 | hero | turn | facing-bet | call | call | 81.2 | call:84% fold:8% raise-small:6% | trained:postflop-turn-river-cascade-regret-v1 |
| 18 | hero | preflop | unopened | fold | fold | 0 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
| 19 | hero | preflop | unopened | raise | raise | 2 | raise:48% call:42% fold:10% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v2+sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2 |
