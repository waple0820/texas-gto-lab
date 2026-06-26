# Heads-Up Strategy Validation

Generated with `npm run validate:heads-up -- --hands 100 --seed 20260625`.

- Hands: 100
- Seed: 20260625
- Level profile: solver
- Temperature: 1
- Noise: 0
- Samples per decision: 800
- Stack mode: reset to 100bb each hand
- Hero result: -268.3bb (-2.68bb/hand)
- Results: Hero 35, AI 64, split 1
- Showdowns: 19/100 (19%)
- Average max pot: 30.8bb

## Actor Style Summary

| Actor | Decisions | VPIP | PFR | Agg actions | Passive actions | Fold share | Avg recommended bet/raise freq | Policy sources | Top picked keys |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| hero | 198 | 74% | 74% | 98 | 46 | 27.3% | 51.2% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 113, trained:postflop-selfplay-regret-v3 85 | raise 74, fold 54, check 28, call 18, jam 10, bet-small 5, bet-over 3, bet-big 2 |
| ai | 178 | 51% | 13% | 64 | 87 | 15.2% | 33.1% | trained:postflop-selfplay-regret-v3 104, preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 74 | call 47, check 40, fold 27, bet-big 14, bet-small 13, raise 13, bet-over 7, bet-mid 7 |

## Hand Table

| # | Hero | AI | Board | Winner | Hero bb | Max pot | SD | PFR | Line |
| ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | 2♠ K♠ | 8♣ Q♥ | 2♦ 3♣ 9♣ | Hero | 8.3 | 108.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:全压 97.5bb; flop:ai:弃牌 |
| 2 | J♥ 7♥ | Q♠ 7♦ | T♠ 2♠ 5♦ T♦ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 1.9bb; turn:hero:弃牌 |
| 3 | A♠ 7♥ | 7♦ Q♣ | 5♠ 2♠ 3♣ 5♥ 9♥ | Hero | 4.3 | 8.4 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:跟注 1.7bb; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:过牌 |
| 4 | T♠ Q♦ | Q♣ 8♥ | 5♣ 8♦ 4♣ J♠ K♣ | AI | -2.5 | 5 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:过牌 |
| 5 | T♥ 8♣ | 5♣ 4♠ | T♦ 5♠ T♣ 6♦ A♥ | Hero | 100.1 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 6.3bb; flop:ai:全压 97.5bb; flop:hero:全压 91.3bb |
| 6 | 5♣ T♦ | 3♣ 2♣ | K♠ 7♣ 8♠ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:弃牌 |
| 7 | T♣ 4♣ | 8♥ Q♠ | T♦ J♠ Q♦ 3♥ 2♣ | AI | -27.6 | 55.2 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 5.8bb; turn:hero:跟注 5.8bb; river:ai:下注 19.3bb; river:hero:跟注 19.3bb |
| 8 | 8♥ 5♦ | 9♣ 4♦ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 9 | 8♥ 8♣ | A♣ 6♥ | 2♠ K♦ 3♥ J♠ 9♦ | Hero | 100 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:全压 97.5bb; flop:ai:跟注 91.7bb |
| 10 | A♠ 3♦ | 3♥ T♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 11 | 8♠ 3♦ | 4♦ 9♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 12 | 2♣ T♠ | Q♣ 2♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 13 | Q♦ 4♠ | A♠ K♥ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 14 | 9♦ 2♠ | 3♠ 9♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 15 | 6♠ 9♣ | 4♠ A♣ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 16 | 4♣ K♣ | 7♠ T♠ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 17 | 5♠ 2♦ | 6♣ 5♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 18 | 4♣ T♦ | K♦ 4♥ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 19 | T♠ 2♠ | 7♥ 9♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 20 | 6♦ 7♠ | J♥ T♠ | 3♠ K♥ K♣ 4♦ 9♣ | AI | -7.8 | 21.6 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:跟注 1.9bb; turn:ai:下注 3.4bb; turn:hero:跟注 3.4bb; river:ai:下注 6bb; river:hero:弃牌 |
| 21 | 2♠ 2♦ | 7♣ Q♣ | 5♠ 8♥ 3♣ 8♣ 6♣ | AI | -100 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:下注 5.8bb; river:hero:全压 97.5bb; river:ai:全压 91.7bb |
| 22 | A♦ 4♣ | 6♦ 3♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 23 | J♠ 9♥ | 2♣ 8♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 24 | 7♠ Q♥ | 4♠ T♣ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 25 | T♣ J♣ | 8♦ A♣ | 9♥ A♦ K♣ 3♠ | AI | -9.7 | 30.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:跟注 7.2bb; turn:ai:下注 11.3bb; turn:hero:弃牌 |
| 26 | 3♣ 8♦ | 6♦ 3♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 27 | 7♣ A♥ | 8♥ A♦ | 4♣ T♦ K♥ 2♥ 9♥ | AI | -9.5 | 19 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:跟注 2.9bb; turn:ai:下注 4.1bb; turn:hero:跟注 4.1bb; river:ai:过牌; river:hero:过牌 |
| 28 | 9♣ 6♠ | 9♥ 2♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 29 | 9♣ K♦ | 3♥ A♥ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 30 | 9♥ A♥ | A♣ 4♣ | 2♦ 3♣ 5♠ 3♦ 7♣ | AI | -100 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:跟注 4.1bb; flop:ai:下注 7.7bb; flop:hero:全压 93.4bb; flop:ai:全压 85.7bb |
| 31 | 3♠ 2♦ | 9♣ 2♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 32 | 4♣ K♥ | 9♥ 3♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 33 | T♠ 6♠ | Q♣ 2♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 34 | 8♠ A♥ | 7♠ 8♥ | Q♦ 6♥ 9♥ Q♠ Q♣ | Hero | 7.5 | 14.8 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 1.7bb; turn:ai:跟注 1.7bb; river:ai:下注 3.2bb; river:hero:跟注 3.2bb |
| 35 | 2♦ J♦ | 3♣ T♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 36 | 8♠ 5♥ | 4♠ 7♦ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 37 | T♦ 8♦ | 8♠ 9♠ | 9♦ 3♥ Q♠ K♦ T♠ | Hero | 19.8 | 39.6 | Y | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:跟注 4.1bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 13.2bb; turn:ai:跟注 13.2bb; river:ai:过牌; river:hero:过牌 |
| 38 | J♦ 7♠ | 2♣ A♦ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 39 | 8♥ Q♥ | J♣ 7♥ | Q♣ 9♣ K♠ T♥ Q♦ | AI | -100 | 200 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 5.8bb; turn:hero:跟注 5.8bb; river:ai:下注 19.3bb; river:hero:全压 91.7bb; river:ai:全压 72.4bb |
| 40 | T♥ T♦ | A♦ 9♥ | 2♥ 9♣ Q♦ 8♦ A♠ | AI | -100 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:全压 97.5bb; flop:ai:全压 90.3bb |
| 41 | 3♣ T♥ | 9♥ 6♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 42 | A♠ 5♣ | 8♠ J♥ | 9♣ 6♣ 7♦ 8♣ 7♥ | Hero | 30.9 | 61.6 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:下注 6.3bb; turn:ai:跟注 6.3bb; river:ai:过牌; river:hero:下注 22bb; river:ai:跟注 22bb |
| 43 | 7♠ J♠ | K♥ 2♥ | 5♥ 3♣ K♦ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:弃牌 |
| 44 | 4♠ 2♥ | 9♥ T♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 45 | T♥ J♥ | J♦ 9♦ | 5♥ 7♥ 5♦ K♥ | Hero | 11.3 | 33.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:加注 8.8bb; flop:ai:跟注 6.9bb; turn:ai:过牌; turn:hero:下注 11.3bb; turn:ai:弃牌 |
| 46 | A♠ T♥ | 4♦ 9♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 47 | 3♦ 3♣ | 8♥ 7♣ | K♦ T♠ 7♥ A♦ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 1.9bb; turn:hero:弃牌 |
| 48 | 4♣ 8♦ | A♠ 3♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 49 | 5♦ K♠ | 6♣ 3♣ | 6♥ Q♣ 9♣ | AI | -4.1 | 104.2 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:全压 97.5bb; flop:hero:弃牌 |
| 50 | 8♠ 3♦ | 8♣ 2♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 51 | T♦ 2♥ | 9♥ 4♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 52 | Q♦ 8♣ | 7♠ 2♠ | T♦ A♣ A♠ | AI | -2.5 | 6.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:弃牌 |
| 53 | 3♥ 5♥ | T♦ T♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 54 | 7♥ 7♦ | Q♠ K♣ | 8♦ 2♥ J♣ 2♠ 9♠ | Hero | 6.6 | 13.2 | Y | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:跟注 4.1bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:过牌 |
| 55 | A♥ 7♠ | 5♥ Q♦ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 56 | A♣ A♥ | 8♥ T♥ | T♣ 5♦ 2♥ 3♥ 4♠ | Hero | 100.1 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:全压 97.5bb; flop:ai:全压 90.3bb |
| 57 | T♦ Q♣ | 5♦ 4♥ | K♦ 5♣ 2♥ | AI | -4.1 | 104.2 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:全压 97.5bb; flop:hero:弃牌 |
| 58 | 9♦ T♥ | 6♣ 2♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 59 | 2♠ 4♥ | A♣ K♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 60 | 2♥ J♣ | Q♠ 4♠ | T♣ A♣ 7♦ | AI | -2.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:弃牌 |
| 61 | 4♦ 6♠ | 9♦ 9♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 62 | 3♥ Q♥ | 5♠ 6♣ | T♠ J♥ 5♦ 9♥ 9♣ | AI | -2.5 | 5 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:过牌; river:hero:过牌 |
| 63 | 2♥ J♦ | Q♠ 9♥ | 6♦ A♠ 7♠ 2♠ 3♠ | AI | -35.9 | 71.8 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 2.5bb; flop:ai:跟注 2.5bb; turn:ai:下注 5.8bb; turn:hero:跟注 5.8bb; river:ai:下注 25.1bb; river:hero:跟注 25.1bb |
| 64 | 4♦ 6♦ | 5♦ 7♣ | 2♠ 6♠ 7♥ J♥ A♠ | AI | -100 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:跟注 7.2bb; turn:ai:下注 11.3bb; turn:hero:全压 90.3bb; turn:ai:全压 79bb |
| 65 | 8♣ 5♣ | K♣ A♣ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 66 | 2♣ 8♥ | A♦ K♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 67 | A♠ T♦ | 2♥ 2♠ | A♦ 4♣ Q♥ | Hero | 2.5 | 10 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 5bb; flop:ai:弃牌 |
| 68 | 6♠ 3♠ | 8♠ 6♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 69 | 3♥ A♥ | 8♠ 8♥ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 70 | J♠ Q♥ | 7♠ 6♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 71 | 3♦ Q♦ | 2♣ 8♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 72 | 2♥ Q♥ | 4♦ 9♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 73 | A♠ 9♣ | 2♥ 9♥ | K♣ 6♥ Q♥ | AI | -2.5 | 7.9 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 2.9bb; flop:hero:弃牌 |
| 74 | 7♠ 8♥ | A♦ 8♣ | 6♥ 4♣ A♠ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 5.8bb; flop:hero:弃牌 |
| 75 | 2♥ 3♣ | 6♠ 3♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 76 | 2♥ J♣ | 2♠ T♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 77 | 9♥ 3♣ | 4♦ 9♦ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 78 | 8♦ 2♠ | 2♥ J♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 79 | J♦ 3♣ | 6♦ 8♠ | A♠ 3♦ 5♠ 7♠ 4♥ | AI | -5.4 | 23.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 2.9bb; turn:hero:跟注 2.9bb; river:ai:下注 12.5bb; river:hero:弃牌 |
| 80 | 2♠ 2♥ | 9♠ 8♣ | J♦ 7♠ A♥ T♥ | AI | -6.6 | 28.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:跟注 4.1bb; flop:ai:过牌; flop:hero:过牌; turn:ai:下注 15.3bb; turn:hero:弃牌 |
| 81 | 2♦ 5♦ | J♦ 2♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 82 | 3♣ Q♥ | J♠ 4♠ | 5♥ 6♣ K♠ | AI | -2.5 | 12.3 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:弃牌 |
| 83 | 3♦ 3♥ | A♣ 9♠ | 6♣ T♥ K♣ J♣ 8♣ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:下注 5.8bb; river:hero:弃牌 |
| 84 | 9♠ 4♣ | Q♥ T♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 85 | 2♠ 3♠ | K♦ 4♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 86 | 6♦ 5♠ | J♥ Q♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 87 | Q♣ J♥ | 3♥ 3♦ | 2♥ 7♣ 4♥ | AI | -4.1 | 104.2 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:下注 1.7bb; flop:ai:全压 97.5bb; flop:hero:弃牌 |
| 88 | 9♥ A♣ | 7♦ 8♦ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 89 | 7♦ 8♦ | 6♠ 4♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 90 | K♣ 4♣ | 2♣ 8♣ | J♠ 3♠ A♠ 5♥ T♠ | AI | -2.5 | 10.8 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:过牌; flop:hero:过牌; turn:ai:过牌; turn:hero:过牌; river:ai:下注 5.8bb; river:hero:弃牌 |
| 91 | 6♦ 8♣ | 9♥ 4♠ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 92 | A♠ Q♦ | T♣ 4♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 93 | 6♥ J♦ | 2♠ 3♥ | - | Hero | 1 | 3.5 | N | hero | preflop:hero:加注 2bb; preflop:ai:弃牌 |
| 94 | T♦ 4♠ | 6♥ J♥ | 8♠ 3♣ 4♦ | Hero | 4.4 | 104.4 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:全压 97.5bb; flop:ai:弃牌 |
| 95 | 8♥ 7♣ | Q♦ 8♠ | 2♦ T♠ 9♥ 7♦ | AI | -4.4 | 12.2 | N | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 1.9bb; flop:hero:跟注 1.9bb; turn:ai:下注 3.4bb; turn:hero:弃牌 |
| 96 | 4♠ Q♥ | Q♦ 3♦ | Q♣ J♥ 7♠ T♥ 7♣ | Split | 0.1 | 200.1 | Y | hero | preflop:hero:加注 2bb; preflop:ai:跟注 1.5bb; flop:ai:下注 7.2bb; flop:hero:全压 97.5bb; flop:ai:跟注 90.3bb |
| 97 | 2♦ 8♣ | J♣ 2♥ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 98 | 2♦ 4♥ | 9♠ J♣ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |
| 99 | 9♣ Q♠ | 9♥ 8♦ | - | AI | -2.5 | 9.1 | N | hero | preflop:hero:加注 2bb; preflop:ai:加注 5.6bb; preflop:hero:弃牌 |
| 100 | 2♣ 9♦ | J♥ 9♠ | - | AI | -0.5 | 1.5 | N | - | preflop:hero:弃牌 |

## Decision Sample

| Hand | Actor | Street | Context | Picked | Executed | Amount | Top mix | Source |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 1 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 1 | ai | flop | single-raised | bet-big | bet | 5.8 | check:25% bet-small:23% bet-mid:19% | trained:postflop-selfplay-regret-v3 |
| 1 | hero | flop | facing-raise | jam | allin | 97.5 | jam:78% fold:9% call:9% | trained:postflop-selfplay-regret-v3 |
| 1 | ai | flop | facing-bet | fold | fold | 0 | fold:99% call:1% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 2 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 2 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 2 | ai | flop | single-raised | check | check | 0 | check:25% bet-small:23% bet-mid:19% | trained:postflop-selfplay-regret-v3 |
| 2 | hero | flop | single-raised | check | check | 0 | check:86% bet-small:8% bet-mid:4% | trained:postflop-selfplay-regret-v3 |
| 2 | ai | turn | single-raised | bet-small | bet | 1.9 | bet-small:86% check:6% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 2 | hero | turn | facing-raise | fold | fold | 0 | fold:99% call:1% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 3 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 3 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 3 | ai | flop | single-raised | check | check | 0 | check:89% bet-small:5% bet-mid:4% | trained:postflop-selfplay-regret-v3 |
| 3 | hero | flop | single-raised | bet-small | bet | 1.7 | check:86% bet-small:7% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 3 | ai | flop | facing-raise | call | call | 1.7 | call:81% fold:19% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 3 | ai | turn | single-raised | check | check | 0 | check:86% bet-mid:6% bet-small:6% | trained:postflop-selfplay-regret-v3 |
| 3 | hero | turn | single-raised | check | check | 0 | check:84% bet-mid:6% bet-small:6% | trained:postflop-selfplay-regret-v3 |
| 3 | ai | river | single-raised | check | check | 0 | check:86% bet-small:6% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 3 | hero | river | single-raised | check | check | 0 | check:83% bet-small:8% bet-mid:6% | trained:postflop-selfplay-regret-v3 |
| 4 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 4 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 4 | ai | flop | single-raised | check | check | 0 | check:83% bet-small:6% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 4 | hero | flop | single-raised | check | check | 0 | check:87% bet-small:6% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 4 | ai | turn | single-raised | check | check | 0 | check:89% bet-mid:5% bet-small:4% | trained:postflop-selfplay-regret-v3 |
| 4 | hero | turn | single-raised | check | check | 0 | check:86% bet-mid:6% bet-small:5% | trained:postflop-selfplay-regret-v3 |
| 4 | ai | river | single-raised | check | check | 0 | check:87% bet-mid:5% bet-small:5% | trained:postflop-selfplay-regret-v3 |
| 4 | hero | river | single-raised | check | check | 0 | check:89% bet-mid:5% bet-small:4% | trained:postflop-selfplay-regret-v3 |
| 5 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 5 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 5 | ai | flop | single-raised | check | check | 0 | check:86% bet-small:8% bet-mid:3% | trained:postflop-selfplay-regret-v3 |
| 5 | hero | flop | single-raised | bet-over | bet | 6.3 | bet-big:54% bet-over:32% bet-small:9% | trained:postflop-selfplay-regret-v3 |
| 5 | ai | flop | facing-bet | jam | allin | 97.5 | jam:78% call:11% fold:10% | trained:postflop-selfplay-regret-v3 |
| 5 | hero | flop | facing-bet | raise-small | allin | 91.3 | raise-big:37% jam:27% raise-small:26% | trained:postflop-selfplay-regret-v3 |
| 6 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 6 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 6 | ai | flop | single-raised | bet-small | bet | 1.9 | check:25% bet-small:23% bet-mid:19% | trained:postflop-selfplay-regret-v3 |
| 6 | hero | flop | facing-raise | fold | fold | 0 | fold:85% call:13% raise-small:2% | trained:postflop-selfplay-regret-v3 |
| 7 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 7 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 7 | ai | flop | single-raised | check | check | 0 | check:85% bet-small:7% bet-mid:6% | trained:postflop-selfplay-regret-v3 |
| 7 | hero | flop | single-raised | check | check | 0 | check:86% bet-small:7% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 7 | ai | turn | single-raised | bet-big | bet | 5.8 | check:87% bet-mid:6% bet-small:5% | trained:postflop-selfplay-regret-v3 |
| 7 | hero | turn | facing-raise | call | call | 5.8 | call:81% fold:18% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 7 | ai | river | single-raised | bet-big | bet | 19.3 | bet-big:81% bet-small:6% bet-mid:6% | trained:postflop-selfplay-regret-v3 |
| 7 | hero | river | facing-raise | call | call | 19.3 | call:83% fold:17% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 8 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 8 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 9 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 9 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 9 | ai | flop | single-raised | bet-big | bet | 5.8 | bet-big:59% bet-small:24% bet-mid:10% | trained:postflop-selfplay-regret-v3 |
| 9 | hero | flop | facing-raise | jam | allin | 97.5 | jam:78% call:11% fold:7% | trained:postflop-selfplay-regret-v3 |
| 9 | ai | flop | facing-bet | call | call | 91.7 | call:79% fold:21% raise-small:0% | trained:postflop-selfplay-regret-v3 |
| 10 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 10 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 11 | hero | preflop | unopened | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 12 | hero | preflop | unopened | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 13 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 13 | ai | preflop | blind-defense | raise | raise | 5.6 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 13 | hero | preflop | facing-3bet | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 14 | hero | preflop | unopened | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 15 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 15 | ai | preflop | blind-defense | raise | raise | 5.6 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 15 | hero | preflop | facing-3bet | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 16 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 16 | ai | preflop | blind-defense | raise | raise | 5.6 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 16 | hero | preflop | facing-3bet | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 17 | hero | preflop | unopened | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 18 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 18 | ai | preflop | blind-defense | raise | raise | 5.6 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 18 | hero | preflop | facing-3bet | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 19 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 19 | ai | preflop | blind-defense | fold | fold | 0 | fold:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 20 | hero | preflop | unopened | raise | raise | 2 | raise:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 20 | ai | preflop | blind-defense | call | call | 1.5 | call:100% | preflop:hu-100bb-preflop-rangeconverter-calibrated-v1 |
| 20 | ai | flop | single-raised | bet-small | bet | 1.9 | bet-small:88% check:5% bet-mid:4% | trained:postflop-selfplay-regret-v3 |
| 20 | hero | flop | facing-raise | call | call | 1.9 | call:55% fold:42% raise-small:2% | trained:postflop-selfplay-regret-v3 |
| 20 | ai | turn | single-raised | bet-small | bet | 3.4 | bet-small:87% check:5% bet-mid:5% | trained:postflop-selfplay-regret-v3 |
| 20 | hero | turn | facing-raise | call | call | 3.4 | call:52% fold:46% raise-small:2% | trained:postflop-selfplay-regret-v3 |
| 20 | ai | river | single-raised | bet-small | bet | 6 | bet-small:88% bet-mid:5% bet-big:4% | trained:postflop-selfplay-regret-v3 |
