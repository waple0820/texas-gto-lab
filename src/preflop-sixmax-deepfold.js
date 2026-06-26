// Source: DEEPFOLD-SOLVER gto_output/cash/texassolver_6max_100bb_2_5x_500rake.
// Upstream source metadata: TexasSolverGPU ranges/qb_ranges/100bb 2.5x 500rake.
// This file fills source gaps for active squeeze, cold-facing-3bet, facing-squeeze, and missing facing-4bet nodes.
// SIXMAX_DEEPFOLD_LINE_CHARTS preserves exact source preflop lines; SIXMAX_DEEPFOLD_CHARTS averages them by runtime key.

export const SIXMAX_DEEPFOLD_CHARTS = {
  "BB-cold-vs-3bet-BTN": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "raise": 7.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "raise": 11.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 6.9,
        "raise": 93.1
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 85.5,
        "raise": 14.5
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 59.6,
        "raise": 40.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 86.5,
        "raise": 13.5
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 97.7,
        "raise": 2.3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 78.3,
        "raise": 21.7
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 94.5,
        "raise": 5.5
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 32.5,
        "raise": 67.5
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 75.1,
        "raise": 24.9
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 94.7,
        "raise": 5.3
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 29.5,
        "raise": 70.5
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 51,
        "raise": 49
      }
    }
  },
  "BB-cold-vs-3bet-CO": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "raise": 1.7
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 91.1,
        "raise": 8.9
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 87.8,
        "raise": 12.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 7.8,
        "raise": 92.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "raise": 1.7
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 74.6,
        "raise": 25.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 65.5,
        "raise": 34.5
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 95.1,
        "raise": 4.9
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 40.2,
        "raise": 59.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 97.3,
        "raise": 2.7
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 28.9,
        "raise": 71.1
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    }
  },
  "BB-cold-vs-3bet-MP": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "raise": 2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "raise": 10.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "raise": 10.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 22.4,
        "raise": 77.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 5.8,
        "raise": 94.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "raise": 1
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "raise": 37.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "raise": 6.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "raise": 17.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "raise": 4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "raise": 15.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "raise": 20.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "raise": 6.2
      }
    }
  },
  "BB-cold-vs-3bet-SB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "raise": 25.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 8.8,
        "raise": 91.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "raise": 20.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 40.2,
        "raise": 59.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "raise": 20
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "raise": 1.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "raise": 7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 27.9,
        "raise": 72
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 67.5,
        "raise": 32.5
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 97.5,
        "raise": 2.5
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 90.5,
        "raise": 9.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 10.8,
        "raise": 89.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 47,
        "raise": 53
      }
    }
  },
  "BB-squeeze-CO-BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 98,
        "raise": 2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 89.4,
        "raise": 10.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 67.4,
        "raise": 32.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 24.2,
        "raise": 75.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 5.4,
        "raise": 94.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "call": 70.2,
        "raise": 29.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATo": {
      "weight": 100,
      "actions": {
        "fold": 19,
        "call": 81
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 57.4,
        "raise": 42.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 87.6,
        "raise": 12.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "call": 70.6,
        "raise": 29.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTo": {
      "weight": 100,
      "actions": {
        "fold": 56.8,
        "call": 43.2
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "call": 73.4,
        "raise": 26.6
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 14.6,
        "call": 85.4
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 16,
        "call": 84
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 17.8,
        "call": 82.2
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 37.4,
        "call": 62.6
      }
    },
    "K3s": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "call": 38.2
      }
    },
    "K2s": {
      "weight": 100,
      "actions": {
        "fold": 66.8,
        "call": 33.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJo": {
      "weight": 100,
      "actions": {
        "fold": 51,
        "call": 49
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 6.8,
        "raise": 93.2
      }
    },
    "QTo": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "Q8s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTo": {
      "weight": 100,
      "actions": {
        "fold": 58,
        "call": 42
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 47.8,
        "raise": 52.2
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 32.6,
        "call": 67.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 35.6,
        "raise": 64.4
      }
    },
    "T9o": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "call": 80,
        "raise": 20
      }
    },
    "T7s": {
      "weight": 100,
      "actions": {
        "fold": 50,
        "call": 50
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "call": 79,
        "raise": 21
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "96s": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "call": 59.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "call": 72,
        "raise": 28
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "85s": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "call": 64.4,
        "raise": 35.6
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "74s": {
      "weight": 100,
      "actions": {
        "fold": 72.2,
        "call": 27.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "call": 96.6,
        "raise": 3.4
      }
    },
    "63s": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 27
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "52s": {
      "weight": 100,
      "actions": {
        "fold": 59,
        "call": 41
      }
    },
    "43s": {
      "weight": 100,
      "actions": {
        "fold": 0.6,
        "call": 99.4
      }
    },
    "42s": {
      "weight": 100,
      "actions": {
        "fold": 61.4,
        "call": 38.6
      }
    },
    "32s": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    }
  },
  "BB-squeeze-MP-BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 98.4,
        "raise": 1.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 92.4,
        "raise": 7.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 78.4,
        "raise": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 64.4,
        "raise": 35.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 30.8,
        "raise": 69.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "call": 86,
        "raise": 14
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 59.4,
        "raise": 40.6
      }
    },
    "ATo": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 54.8,
        "raise": 45.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 75.2,
        "raise": 24.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "call": 94.2,
        "raise": 5.8
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "call": 69.8,
        "raise": 30.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 41.2,
        "call": 53,
        "raise": 5.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 28.8,
        "raise": 71.2
      }
    },
    "KTo": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "call": 11
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 53.4,
        "call": 46.6
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 52.4,
        "call": 47.6
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 65,
        "call": 35
      }
    },
    "K3s": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "K2s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJo": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 46.2,
        "raise": 53.8
      }
    },
    "QTo": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 20.6,
        "call": 79.4
      }
    },
    "Q8s": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 7.4,
        "raise": 92.6
      }
    },
    "JTo": {
      "weight": 100,
      "actions": {
        "fold": 71.6,
        "call": 28.4
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 61,
        "raise": 39
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 45.7,
        "call": 54.1,
        "raise": 0.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 11,
        "raise": 89
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 67.8,
        "raise": 32.2
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "call": 92.2,
        "raise": 7.8
      }
    },
    "T7s": {
      "weight": 100,
      "actions": {
        "fold": 60.4,
        "call": 39.6
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "call": 83.4,
        "raise": 16.6
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "96s": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "call": 41.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "call": 69.8,
        "raise": 30.2
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "call": 96.2,
        "raise": 3.8
      }
    },
    "85s": {
      "weight": 100,
      "actions": {
        "fold": 70.2,
        "call": 29.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "call": 61,
        "raise": 39
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "74s": {
      "weight": 100,
      "actions": {
        "fold": 70.4,
        "call": 29.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "call": 61.6,
        "raise": 38.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "call": 91.8,
        "raise": 8.2
      }
    },
    "63s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "call": 61.4,
        "raise": 38.6
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "52s": {
      "weight": 100,
      "actions": {
        "fold": 60.2,
        "call": 39.8
      }
    },
    "43s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "42s": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "call": 36.2
      }
    },
    "32s": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    }
  },
  "BB-squeeze-UTG-BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 99.2,
        "raise": 0.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 94.8,
        "raise": 5.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 83.4,
        "raise": 16.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 74.4,
        "raise": 25.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 55,
        "raise": 45
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 29.2,
        "call": 70.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 78.4,
        "raise": 21.6
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 56.4,
        "raise": 43.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 76.6,
        "raise": 23.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "call": 93.6,
        "raise": 6.4
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "call": 76.6,
        "raise": 23.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 4.2,
        "raise": 95.8
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 63.4,
        "call": 36.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 59.6,
        "raise": 40.4
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 1.8,
        "call": 98.2
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 73.4,
        "call": 26.6
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 48
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 40
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "K3s": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "K2s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJo": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 53,
        "raise": 47
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 15.6,
        "call": 64.8,
        "raise": 19.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 52.2,
        "raise": 47.8
      }
    },
    "JTo": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 81.4,
        "raise": 18.6
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 49,
        "call": 51
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 50.8,
        "raise": 49.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 74.8,
        "raise": 25.2
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "call": 93,
        "raise": 7
      }
    },
    "T7s": {
      "weight": 100,
      "actions": {
        "fold": 60.4,
        "call": 39.6
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "call": 86.8,
        "raise": 13.2
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "96s": {
      "weight": 100,
      "actions": {
        "fold": 60.6,
        "call": 39.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "call": 70.2,
        "raise": 29.8
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "call": 89.2,
        "raise": 10.8
      }
    },
    "85s": {
      "weight": 100,
      "actions": {
        "fold": 66,
        "call": 34
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "call": 63.4,
        "raise": 36.6
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "call": 98.4,
        "raise": 1.6
      }
    },
    "74s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "call": 62.6,
        "raise": 37.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "call": 90.4,
        "raise": 9.6
      }
    },
    "63s": {
      "weight": 100,
      "actions": {
        "fold": 69.6,
        "call": 30.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "52s": {
      "weight": 100,
      "actions": {
        "fold": 65.2,
        "call": 34.8
      }
    },
    "43s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "42s": {
      "weight": 100,
      "actions": {
        "fold": 62.6,
        "call": 37.4
      }
    },
    "32s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    }
  },
  "BB-vs-4bet-BTN": {
    "55": {
      "weight": 100,
      "actions": {
        "fold": 99.3,
        "call": 0.7
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "call": 1.7
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 94.9,
        "call": 5.1
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 68.4,
        "allin": 31.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 60,
        "allin": 40
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 11.6,
        "call": 60,
        "allin": 28.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 91.3,
        "call": 8.2,
        "allin": 0.5
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 85.3,
        "call": 7.4,
        "allin": 7.2
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "call": 3.9,
        "allin": 6.5
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 4.4,
        "allin": 2.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 60,
        "allin": 40
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 90.3,
        "call": 9.7
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 99.9,
        "call": 0.1
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 26.2,
        "call": 61,
        "allin": 12.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 91.2,
        "call": 8.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 40,
        "call": 55.6,
        "allin": 4.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 95.9,
        "call": 4.1
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 25.8,
        "allin": 4.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.1,
        "call": 7.9
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 93.5,
        "call": 6.5
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    }
  },
  "BB-vs-4bet-CO": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 92.1,
        "call": 7.9
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 83.7,
        "call": 16.3
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 64.1,
        "call": 35.9
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 32.6,
        "allin": 67.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 12.8,
        "call": 2.9,
        "allin": 84.3
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 74.1,
        "call": 25.9
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 34.7,
        "call": 65.3
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "call": 44.8
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.3,
        "call": 23.7,
        "allin": 14.1
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.3,
        "call": 12.7,
        "allin": 0.9
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 34.3,
        "call": 65.7
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 42.8,
        "call": 57.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 36.9,
        "call": 63.1
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 91.1,
        "call": 8.9
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 36.9,
        "allin": 29.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 90.3,
        "call": 9.7
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 32.1,
        "allin": 34.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 39.1,
        "call": 60.9
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 17.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 43.7,
        "call": 56.3
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 59.3,
        "call": 40.7
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 88.3,
        "call": 11.7
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 81.1,
        "call": 18.9
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 73.7,
        "call": 26.3
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 74.5,
        "call": 25.5
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.7,
        "call": 25.3
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "fold": 96.9,
        "call": 3.1
      }
    }
  },
  "BB-vs-4bet-MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 84.9,
        "call": 15.1
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 17.9,
        "allin": 82.1
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 19.2,
        "allin": 80.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 88.3,
        "call": 11.7
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 20.2,
        "call": 79.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 56.4,
        "call": 43.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 37.2,
        "allin": 2.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.5,
        "call": 13.5
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 97.1,
        "call": 2.9
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 11.9,
        "allin": 88.1
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 41.2,
        "call": 58.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 23.6,
        "call": 76.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 61.2,
        "call": 38.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 72.7,
        "allin": 27.3
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 98.9,
        "call": 1.1
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 11,
        "call": 63.3,
        "allin": 25.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 52.7,
        "call": 47.3
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 91.7,
        "call": 8.3
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 39.1,
        "call": 60.9
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 67.9,
        "call": 32.1
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 96.1,
        "call": 3.9
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 86.3,
        "call": 13.7
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 70.1,
        "call": 29.9
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 98.1,
        "call": 1.9
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 65,
        "call": 35
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 61.9,
        "call": 38.1
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 95.9,
        "call": 4.1
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 64.1,
        "call": 35.9
      }
    }
  },
  "BB-vs-4bet-SB": {
    "55": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "call": 1.7
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 14.3,
        "allin": 85.7
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 9.7,
        "allin": 90.3
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 38,
        "allin": 62
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 85.7,
        "call": 14.3
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 86.3,
        "call": 12.1,
        "allin": 1.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 14.3,
        "allin": 2.9
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "call": 14.2
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 96.3,
        "call": 3.7
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "call": 1,
        "allin": 0.7
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 4.9,
        "allin": 14.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 8.8,
        "allin": 2.9
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.9,
        "call": 9.1
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 97.3,
        "call": 2.7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 13.5,
        "allin": 86.5
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 85.7,
        "call": 14.3
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 85.7,
        "call": 14.3
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 98.1,
        "call": 1.9
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 87.3,
        "call": 12.7
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 93.5,
        "call": 6.5
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 97.1,
        "call": 2.9
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 92.7,
        "call": 7.3
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 69.9,
        "call": 3,
        "allin": 27.1
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 8.6,
        "allin": 3.7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 91.1,
        "call": 8.9
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 98.7,
        "call": 1.3
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 2.1,
        "allin": 15.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 91.9,
        "call": 8.1
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 85.7,
        "call": 6.2,
        "allin": 8.1
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 87.4,
        "call": 12.6
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "fold": 96.7,
        "call": 3.3
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 87.7,
        "call": 12.3
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 88.9,
        "call": 11.1
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 87.3,
        "call": 12.7
      }
    }
  },
  "BB-vs-4bet-UTG": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 87.9,
        "call": 12.1
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 14.6,
        "allin": 85.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 11.5,
        "call": 25.3,
        "allin": 63.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 6.6,
        "call": 93.4
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 27.8,
        "call": 72.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.6,
        "call": 30.1,
        "allin": 7.3
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 21.2,
        "allin": 78.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 50,
        "call": 50
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 74.9,
        "call": 25.1
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 74.8,
        "allin": 25.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 97.3,
        "call": 2.7
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 29.3,
        "call": 68,
        "allin": 2.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 62.1,
        "call": 37.9
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 65.3,
        "call": 34.7
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 76.7,
        "call": 23.3
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 96.5,
        "call": 3.5
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 88.9,
        "call": 11.1
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 73.9,
        "call": 26.1
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 67.9,
        "call": 32.1
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 64.4,
        "call": 35.6
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 68.4,
        "call": 31.6
      }
    }
  },
  "BB-vs-squeeze-SB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 97.5,
        "raise": 2.5
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 13,
        "raise": 87
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "raise": 5
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 80.5,
        "raise": 19.5
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 23.4,
        "raise": 76.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 3.8,
        "raise": 96.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "raise": 37.2
      }
    }
  },
  "BTN-cold-vs-3bet-CO": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 94.7,
        "raise": 5.3
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 1,
        "raise": 99
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "raise": 4.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "raise": 15.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 96.3,
        "raise": 3.7
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 85.1,
        "raise": 14.9
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 91.5,
        "raise": 8.5
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "raise": 36.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "raise": 1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 31,
        "raise": 69
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "raise": 5
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "raise": 11.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "raise": 36.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "raise": 14.2
      }
    }
  },
  "BTN-cold-vs-3bet-MP": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "raise": 4.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 32.4,
        "raise": 67.6
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "raise": 3.4
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "raise": 10.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68.6,
        "raise": 31.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 59.8,
        "raise": 40.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "raise": 21.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "raise": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "raise": 19.6
      }
    }
  },
  "BTN-vs-4bet-BB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 85.3,
        "call": 14.7
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 84.5,
        "call": 15.5
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 60.7,
        "allin": 39.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 14.1,
        "allin": 85.9
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 37.5,
        "call": 16.4,
        "allin": 46.1
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 39.8,
        "call": 43.6,
        "allin": 16.7
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 95.9,
        "call": 4.1
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 87.9,
        "call": 12.1
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 82.1,
        "call": 17.9
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 85.5,
        "call": 14.5
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 88.9,
        "call": 11.1
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 98.9,
        "call": 1.1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 88.5,
        "call": 11.5
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 94.7,
        "call": 5.3
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 37.3,
        "call": 34.9,
        "allin": 27.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86.3,
        "call": 13.7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 89.1,
        "call": 10.9
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 59.2,
        "call": 26.5,
        "allin": 14.3
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 87.4,
        "call": 12.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 82.7,
        "call": 17.3
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 94.1,
        "call": 5.9
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 91.9,
        "call": 8.1
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 89.9,
        "call": 10.1
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 86.5,
        "call": 13.5
      }
    }
  },
  "BTN-vs-4bet-CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 97.7,
        "call": 2.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.3,
        "call": 11.7
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.7,
        "call": 11.3
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 87.9,
        "call": 12.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 86.5,
        "call": 13.5
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 50,
        "allin": 50
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 11.5,
        "allin": 88.5
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 24,
        "allin": 76
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 50,
        "call": 50
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10.1
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 82.5,
        "call": 16.1,
        "allin": 1.5
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.5,
        "call": 13.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 89.9,
        "call": 10.1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 11.3,
        "allin": 88.7
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "call": 18.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 94.5,
        "call": 5.5
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 50,
        "call": 13.4,
        "allin": 36.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 84.3,
        "call": 15.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 78.3,
        "call": 12,
        "allin": 9.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 83.1,
        "call": 16.9
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 96.7,
        "call": 3.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.1,
        "call": 9.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 96.3,
        "call": 3.7
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    }
  },
  "BTN-vs-4bet-MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 97.4,
        "call": 2.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 90.3,
        "call": 9.7
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "call": 10.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 89.3,
        "call": 10.7
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 91.6,
        "allin": 8.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 10.2,
        "allin": 89.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 69.1,
        "call": 6.7,
        "allin": 24.1
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 70.9,
        "call": 29.1
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "call": 5.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 92.7,
        "call": 7.3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 91.3,
        "call": 8.7
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 91.9,
        "call": 8.1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 86.1,
        "call": 13.9
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 81.7,
        "call": 18.3
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 86.5,
        "call": 13.5
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 65.9,
        "call": 12.8,
        "allin": 21.3
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 84.3,
        "call": 15.7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 81.3,
        "call": 18.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 84.9,
        "call": 15.1
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.7,
        "call": 9.3
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "call": 4.7
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 93.1,
        "call": 6.9
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 92.1,
        "call": 7.9
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 89.1,
        "call": 10.9
      }
    }
  },
  "BTN-vs-4bet-SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 89.5,
        "call": 10.5
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 69.6,
        "call": 30.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 67.9,
        "call": 32.1
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.7,
        "call": 33.3
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 64.3,
        "call": 35.7
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 75.5,
        "allin": 24.5
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 28.9,
        "allin": 71.1
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 9.1,
        "call": 37.4,
        "allin": 53.5
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 19.9,
        "call": 80.1
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 93.9,
        "call": 6.1
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 79.1,
        "call": 20.9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 58.7,
        "call": 41.3
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 67.9,
        "call": 32.1
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 73.7,
        "call": 26.3
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 96.9,
        "call": 3.1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 67.1,
        "call": 32.9
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 92.1,
        "call": 7.9
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 8.8,
        "call": 85.6,
        "allin": 5.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 67.3,
        "call": 32.7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 76.3,
        "call": 23.7
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 41.3,
        "call": 58.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "call": 24.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 60.5,
        "call": 39.5
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 74.5,
        "call": 25.5
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.1,
        "call": 13.9
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 81.1,
        "call": 18.9
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 76.3,
        "call": 23.7
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 68.5,
        "call": 31.5
      }
    }
  },
  "BTN-vs-4bet-UTG": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.5,
        "call": 1.5
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 97.5,
        "call": 2.5
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 93.7,
        "call": 6.3
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 94.5,
        "call": 5.5
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 92.7,
        "call": 7.3
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 92.5,
        "call": 7.5
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 61,
        "allin": 39
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 3.4,
        "allin": 96.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 73.3,
        "call": 7.9,
        "allin": 18.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 72.3,
        "call": 27.7
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 99.5,
        "call": 0.5
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 90.5,
        "call": 9.5
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 90.9,
        "call": 9.1
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 94.1,
        "call": 5.9
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 95.7,
        "call": 4.3
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 87.9,
        "call": 12.1
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 97.9,
        "call": 2.1
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 74.6,
        "call": 24.3,
        "allin": 1.1
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "call": 4.7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 97.3,
        "call": 2.7
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 94.3,
        "call": 5.7
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 92.9,
        "call": 7.1
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 90.9,
        "call": 9.1
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 90.3,
        "call": 9.7
      }
    }
  },
  "BTN-vs-squeeze-BB": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 88.5,
        "call": 11.5
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 87.7,
        "call": 12.3
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 79.3,
        "call": 20.7
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 75.2,
        "call": 24.6,
        "allin": 0.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 69.3,
        "call": 30.7
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 86.3,
        "call": 6.9,
        "allin": 6.9
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 85.1,
        "call": 14.9
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 82.7,
        "call": 17.2,
        "allin": 0.1
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 56.5,
        "call": 43.5
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 82.2,
        "call": 17.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 84.6,
        "call": 15.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 63.1,
        "call": 36.9
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 74.3,
        "call": 25.7
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 99.7,
        "call": 0.3
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 79.1,
        "call": 20.9
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 96.7,
        "call": 3.3
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 98.1,
        "call": 1.9
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 86.9,
        "call": 7,
        "allin": 6.1
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "call": 18.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 64.6,
        "call": 32.7,
        "allin": 2.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 90.1,
        "call": 9.9
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 99.7,
        "call": 0.3
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "call": 4.7
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "call": 1.7
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 90.1,
        "call": 9.9
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    }
  },
  "BTN-vs-squeeze-SB": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 87.7,
        "call": 12.3
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.7,
        "call": 18.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 81.5,
        "call": 18.5
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 66.1,
        "call": 33.9
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 6,
        "allin": 7.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 85.1,
        "call": 14.9
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 84.1,
        "call": 15.9
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 56.9,
        "call": 43.1
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 85.9,
        "call": 14.1
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 91.3,
        "call": 8.7
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "call": 36.2
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 78.3,
        "call": 21.7
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 98.1,
        "call": 1.9
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 86.9,
        "call": 5.8,
        "allin": 7.3
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 81.3,
        "call": 18.7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 62.4,
        "call": 32.9,
        "allin": 4.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "call": 0.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 61.5,
        "call": 38.5
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 92.3,
        "call": 7.7
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 89.7,
        "call": 10.3
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 86.9,
        "call": 13.1
      }
    }
  },
  "CO-cold-vs-3bet-MP": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "raise": 4.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 35.8,
        "raise": 64.2
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "raise": 1.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 73.6,
        "raise": 26.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "raise": 5.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "raise": 38.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "raise": 0.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "raise": 21.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "raise": 12
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "raise": 21
      }
    }
  },
  "CO-vs-4bet-BB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.9,
        "call": 1.1
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 91.5,
        "call": 6.8,
        "allin": 1.7
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 27.7,
        "allin": 72.3
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 11.6,
        "allin": 88.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 5,
        "call": 15.5,
        "allin": 79.5
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 40
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 95.1,
        "call": 4.9
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 99.7,
        "call": 0.3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 84.1,
        "call": 15.9
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 88.1,
        "call": 11.9
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 82.2,
        "call": 17.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 35.2,
        "allin": 64.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 95.9,
        "call": 4.1
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 83.5,
        "call": 16.5
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 91.2,
        "call": 8.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    }
  },
  "CO-vs-4bet-BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99.1,
        "call": 0.9
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 94.3,
        "call": 5.7
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "call": 5.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 87.4,
        "call": 12.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 25.3,
        "allin": 74.7
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 56.7,
        "call": 14.6,
        "allin": 28.7
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 33,
        "call": 34,
        "allin": 33
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 38.6,
        "call": 61.4
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 69.7,
        "call": 30.3
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 83.1,
        "call": 16.9
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 39.5,
        "call": 47.7,
        "allin": 12.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 75.7,
        "call": 24.3
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 96.1,
        "call": 3.9
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 32.6,
        "call": 67.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 72.1,
        "call": 27.9
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.7,
        "call": 0.3
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 96.9,
        "call": 3.1
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 89.7,
        "call": 10.3
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    }
  },
  "CO-vs-4bet-MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 85,
        "allin": 15
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 10.2,
        "allin": 89.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 29.2,
        "allin": 70.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 44.2,
        "call": 55.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 2,
        "call": 98
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 50.2,
        "allin": 49.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    }
  },
  "CO-vs-4bet-SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.7,
        "call": 3.3
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 11.3,
        "allin": 2.5
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.7,
        "call": 11.3
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 81.9,
        "call": 18.1
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74.7,
        "call": 25.3
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 52.7,
        "allin": 47.3
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 34.8,
        "allin": 65.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 28.6,
        "allin": 71.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 38,
        "call": 62
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 97.5,
        "call": 2.5
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 72.5,
        "call": 27.5
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 80.1,
        "call": 19.9
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 88.3,
        "call": 11.7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 64.2,
        "allin": 35.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86.1,
        "call": 13.9
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 89.7,
        "call": 10.3
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 50.1,
        "call": 49.9
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93.1,
        "call": 6.9
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "call": 0.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 93.7,
        "call": 6.3
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.3,
        "call": 14.7
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 78.7,
        "call": 21.3
      }
    }
  },
  "CO-vs-4bet-UTG": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 48.8,
        "allin": 51.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 7,
        "allin": 93
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 30.6,
        "allin": 69.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 29.4,
        "call": 70.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "call": 16
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 37.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "call": 18.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 0.8,
        "call": 99.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 87.4,
        "allin": 12.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 51,
        "call": 49
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    }
  },
  "CO-vs-squeeze-BB": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 27
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 49,
        "call": 45.2,
        "raise": 5.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 2.8,
        "call": 73.6,
        "raise": 23.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 9.4,
        "raise": 90.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 47.2,
        "raise": 52.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 28,
        "raise": 72
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 58,
        "raise": 42
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 44.4,
        "raise": 55.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 73,
        "raise": 27
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 49.4,
        "raise": 50.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 55.6,
        "raise": 44.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 36,
        "raise": 64
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 34,
        "call": 48.6,
        "raise": 17.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 62.2,
        "raise": 37.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 55.6,
        "call": 44.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 67.8,
        "raise": 32.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 17.4
      }
    }
  },
  "CO-vs-squeeze-SB": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 72.8,
        "call": 27.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.6,
        "call": 30.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 37,
        "call": 58,
        "raise": 5
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 75.8,
        "raise": 24.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 20.6,
        "raise": 79.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 53.8,
        "raise": 46.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 6.8,
        "call": 32.2,
        "raise": 61
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 54.8,
        "raise": 45.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 49,
        "raise": 51
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 72.4,
        "raise": 27.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 52.2,
        "raise": 47.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 61.6,
        "raise": 38.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 45.4,
        "raise": 54.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 23.2,
        "call": 60.5,
        "raise": 16.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 66.6,
        "raise": 33.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 71.8,
        "raise": 28.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 75.2,
        "call": 24.8
      }
    }
  },
  "MP-vs-4bet-BB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99.7,
        "call": 0.3
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 95.7,
        "call": 4.3
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 16.1,
        "allin": 83.9
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 10,
        "allin": 90
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 9.6,
        "call": 9.2,
        "allin": 81.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 83.3,
        "call": 16.7
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 95.7,
        "call": 4.3
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 20.9,
        "call": 20,
        "allin": 59.1
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 98.9,
        "call": 1.1
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 90.3,
        "call": 9.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "call": 0.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 92.1,
        "call": 7.9
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 97.3,
        "call": 2.7
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 94.3,
        "call": 5.7
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 94.5,
        "call": 5.5
      }
    }
  },
  "MP-vs-4bet-BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "call": 0.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 98.1,
        "call": 1.9
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 98.1,
        "call": 1.9
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 9.4,
        "allin": 90.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 57.2,
        "call": 13.1,
        "allin": 29.7
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 45.5,
        "call": 22.5,
        "allin": 32
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 88.1,
        "call": 11.9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 94.7,
        "call": 5.3
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 97.3,
        "call": 2.7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 56.9,
        "call": 9.8,
        "allin": 33.3
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 19.9,
        "call": 64.5,
        "allin": 15.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 97.7,
        "call": 2.3
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 99.1,
        "call": 0.9
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 70.1,
        "call": 29.9
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 99.5,
        "call": 0.5
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 7.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.3,
        "call": 0.7
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    }
  },
  "MP-vs-4bet-CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 12.2,
        "allin": 87.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 30.2,
        "allin": 69.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 8.6,
        "allin": 91.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 48
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 66.8,
        "call": 33.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 74.6,
        "call": 25.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 89.2,
        "allin": 10.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 52.4,
        "call": 47.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 55.8,
        "call": 44.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "MP-vs-4bet-SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99.5,
        "call": 0.5
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 98.7,
        "call": 1.3
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 96.3,
        "call": 3.7
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 96.3,
        "call": 3.7
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 7.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 89.3,
        "call": 10.7
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 27.4,
        "allin": 72.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 18.1,
        "allin": 81.9
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 4.3,
        "call": 14.9,
        "allin": 80.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 79.3,
        "call": 20.7
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 94.1,
        "call": 5.9
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 21.1,
        "call": 33.3,
        "allin": 45.5
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 98.9,
        "call": 1.1
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "call": 8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 90.5,
        "call": 9.5
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 90.9,
        "call": 9.1
      }
    }
  },
  "MP-vs-4bet-UTG": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 49,
        "allin": 51
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 19.4,
        "allin": 80.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 27.6,
        "allin": 72.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 45.8,
        "call": 54.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 33.2,
        "call": 66.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 87.6,
        "allin": 12.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "MP-vs-squeeze-BB": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 26
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 56.8,
        "call": 35.8,
        "raise": 7.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 36,
        "call": 47,
        "raise": 17
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 24.6,
        "raise": 75.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 60.2,
        "raise": 39.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 43.4,
        "call": 15.2,
        "raise": 41.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 49,
        "raise": 51
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 43.4,
        "call": 23.2,
        "raise": 33.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 67.6,
        "call": 32.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 79.2,
        "call": 20.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 12.2,
        "raise": 87.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 62.6,
        "raise": 37.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 61.8,
        "raise": 38.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 49.6,
        "call": 37.6,
        "raise": 12.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 75.6,
        "raise": 24.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 58.6,
        "call": 41.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 67.8,
        "raise": 32.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 64.2,
        "call": 35.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 71.4,
        "raise": 28.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "call": 10.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    }
  },
  "MP-vs-squeeze-SB": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 16.2,
        "call": 63.2,
        "raise": 20.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 32.2,
        "raise": 67.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 66.8,
        "raise": 33.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 46.7,
        "call": 17,
        "raise": 36.3
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 43.8,
        "raise": 56.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 49.2,
        "call": 29.4,
        "raise": 21.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 17.2,
        "raise": 82.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 56.4,
        "raise": 43.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 64.6,
        "raise": 35.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 37.6,
        "call": 41,
        "raise": 21.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 78.8,
        "raise": 21.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 44.4,
        "call": 55.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 68.2,
        "raise": 31.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 57.6,
        "call": 42.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 73.4,
        "raise": 26.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 83.6,
        "call": 16.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "call": 30.2
      }
    }
  },
  "SB-cold-vs-3bet-BTN": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "raise": 4.7
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 91.1,
        "raise": 8.9
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 8.4,
        "raise": 91.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 8.6,
        "raise": 91.4
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 88.9,
        "raise": 11.1
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 62.1,
        "raise": 37.9
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "raise": 4.7
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "raise": 3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 78.7,
        "raise": 21.3
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 42,
        "raise": 58
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "raise": 15.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "raise": 8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 38.7,
        "raise": 61.3
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 61.3,
        "raise": 38.7
      }
    }
  },
  "SB-cold-vs-3bet-CO": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 95.7,
        "raise": 4.3
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "raise": 6.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 88.3,
        "raise": 11.7
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 13.7,
        "raise": 86.3
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 4.1,
        "raise": 95.9
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "raise": 15.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 97.1,
        "raise": 2.9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "raise": 30.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "raise": 5.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 52.8,
        "raise": 47.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "raise": 3.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "raise": 6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 46.6,
        "raise": 53.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 92.5,
        "raise": 7.5
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98.7,
        "raise": 1.3
      }
    }
  },
  "SB-cold-vs-3bet-MP": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "raise": 8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 24.8,
        "raise": 75.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 25,
        "raise": 75
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 64.6,
        "raise": 35.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "raise": 10.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "raise": 20.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "raise": 4.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "raise": 10.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "raise": 14.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "raise": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    }
  },
  "SB-squeeze-CO-BTN": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "raise": 31
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "raise": 35.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 11.8,
        "raise": 88.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "raise": 23.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 50.2,
        "raise": 49.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "raise": 7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "raise": 32
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "raise": 16.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "raise": 28
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "raise": 59.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "raise": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "raise": 20.4
      }
    }
  },
  "SB-squeeze-MP-BTN": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "raise": 20
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 75.6,
        "raise": 24.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "raise": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "raise": 78
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "raise": 38.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "raise": 11.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 3,
        "raise": 97
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "raise": 41.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "raise": 9.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "raise": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "raise": 30.2
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "raise": 30.6
      }
    }
  },
  "SB-squeeze-UTG-BTN": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "raise": 21.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "raise": 33.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "raise": 59.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 39,
        "raise": 61
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "raise": 26.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "raise": 44.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "raise": 19.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "raise": 8.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 52.8,
        "raise": 47.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 55.4,
        "raise": 44.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 45,
        "raise": 55
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "raise": 26.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "raise": 33.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66,
        "raise": 34
      }
    }
  },
  "SB-vs-4bet-BB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "call": 5.6
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 58.1,
        "call": 41.9
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 35.1,
        "call": 64.9
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 13.4,
        "call": 86.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 17.3,
        "allin": 82.7
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 0.8,
        "allin": 99.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 13.1,
        "allin": 86.9
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 71.8,
        "call": 28.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 45.1,
        "call": 54.9
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 66.6,
        "call": 33.4
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 92.3,
        "call": 7.7
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 44.5,
        "call": 55.5
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 26,
        "call": 74
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 31.6,
        "call": 64.9,
        "allin": 3.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 56.5,
        "call": 43.5
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19.1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 24,
        "call": 62.1,
        "allin": 13.8
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 7.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 54.7,
        "call": 45.3
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "call": 4.7
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 59.7,
        "call": 40.3
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 48.5,
        "allin": 51.5
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 51.8,
        "call": 48.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 49.2,
        "call": 50.8
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 40
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 4.7,
        "call": 86.8,
        "allin": 8.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 52.5,
        "call": 47.5
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 72.7,
        "call": 27.3
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 21.7,
        "call": 78.3
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 58,
        "call": 42
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 19,
        "call": 81
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 17.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 80.3,
        "call": 19.7
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 76.7,
        "call": 23.3
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    }
  },
  "SB-vs-4bet-BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 97.5,
        "call": 2.5
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 67.6,
        "allin": 32.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 60,
        "allin": 40
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 14.2,
        "call": 60,
        "allin": 25.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 95.7,
        "call": 4.3
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 9.3,
        "allin": 0.7
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 79.7,
        "call": 20.3
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 16.4,
        "allin": 8.6
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 90.7,
        "call": 5.5,
        "allin": 3.9
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "fold": 99.3,
        "call": 0.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 86.9,
        "call": 4.9,
        "allin": 8.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 6.9,
        "allin": 3.1
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.1,
        "call": 6.9
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 60,
        "allin": 40
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 96.3,
        "call": 3.7
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 83.3,
        "call": 16.7
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 93.5,
        "call": 6.5
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 27.8,
        "call": 60.6,
        "allin": 11.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 40,
        "call": 54.6,
        "allin": 5.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 30.6,
        "allin": 2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 87.5,
        "call": 12.5
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 94.5,
        "call": 5.5
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 90.7,
        "call": 9.3
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 96.7,
        "call": 3.3
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 98.3,
        "call": 1.7
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 99.5,
        "call": 0.5
      }
    }
  },
  "SB-vs-4bet-CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.5,
        "call": 4.5
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 73.5,
        "call": 26.5
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 68.1,
        "call": 31.9
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 37.3,
        "call": 62.7
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 25.5,
        "allin": 74.5
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 18.2,
        "call": 1.5,
        "allin": 80.3
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 62,
        "call": 38
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 55.1,
        "allin": 11.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 41.7,
        "call": 41.3,
        "allin": 17
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 81.3,
        "call": 18.7
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 34.6,
        "call": 65.4
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 32.6,
        "allin": 34.1
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 77.1,
        "call": 22.9
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 88.1,
        "call": 11.9
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 41,
        "allin": 25.7
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 43.8,
        "call": 56.2
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 90.7,
        "call": 9.3
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 33.3,
        "call": 66.7
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 94.1,
        "call": 5.9
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 90.5,
        "call": 9.5
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 89.5,
        "call": 10.5
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 88.7,
        "call": 11.3
      }
    }
  },
  "SB-vs-4bet-MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 76.9,
        "call": 23.1
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 72.5,
        "call": 27.5
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 7.8,
        "call": 92.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 21.4,
        "allin": 78.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 20.2,
        "allin": 79.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 19.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 46.6,
        "call": 53.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 41.3,
        "call": 44,
        "allin": 14.7
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 18.5,
        "call": 81.5
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 15,
        "call": 85
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 53.6,
        "call": 46.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 69.5,
        "allin": 30.5
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 91.5,
        "call": 8.5
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 75.4,
        "allin": 24.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 43.8,
        "call": 56.2
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 74.6,
        "call": 25.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 70.7,
        "call": 29.3
      }
    }
  },
  "SB-vs-4bet-UTG": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "call": 16
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.7,
        "call": 21.3
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 44.6,
        "call": 55.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 15.7,
        "allin": 84.3
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 28.2,
        "allin": 71.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 96.9,
        "call": 3.1
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 8.9,
        "call": 91.1
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 59.5,
        "call": 40.5
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 11.2,
        "allin": 88.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 38.7,
        "call": 61.3
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 75.4,
        "allin": 24.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 89.1,
        "allin": 10.9
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "call": 35.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 12.9,
        "call": 87.1
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 67.9,
        "call": 32.1
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 65.3,
        "call": 34.7
      }
    }
  },
  "UTG-vs-4bet-BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 37.4,
        "allin": 62.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 84.6,
        "allin": 15.4
      }
    }
  },
  "UTG-vs-4bet-BTN": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 99.9,
        "call": 0.1
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 99.5,
        "call": 0.5
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 99.3,
        "call": 0.7
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 56.1,
        "call": 10.6,
        "allin": 33.3
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 52.6,
        "call": 24.2,
        "allin": 23.3
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 44.2,
        "call": 22.5,
        "allin": 33.3
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 36.5,
        "call": 61.7,
        "allin": 1.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 90.5,
        "call": 9.5
      }
    }
  },
  "UTG-vs-4bet-CO": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 31,
        "allin": 69
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG-vs-4bet-SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 36.3,
        "allin": 63.7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 95.3,
        "allin": 4.7
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 97.7,
        "allin": 2.3
      }
    }
  },
  "UTG-vs-squeeze-BB": {
    "33": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 29.2,
        "raise": 7.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 35.8,
        "raise": 12.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 32.8,
        "raise": 67.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 71.4,
        "raise": 28.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 0.2,
        "raise": 26.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 55.8,
        "raise": 44.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 65.3,
        "call": 16.2,
        "raise": 18.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 46.2,
        "call": 36.8,
        "raise": 17
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 30.6,
        "raise": 69.4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 65.2,
        "raise": 34.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 34.8,
        "call": 46.2,
        "raise": 19
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "call": 11,
        "raise": 12.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 92.2,
        "raise": 7.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 70,
        "raise": 30
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "call": 22
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 20.8,
        "call": 54.9,
        "raise": 24.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    }
  },
  "UTG-vs-squeeze-SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 22.6,
        "raise": 3.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 51.8,
        "call": 36.4,
        "raise": 11.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 30.6,
        "raise": 69.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 73.6,
        "raise": 26.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "raise": 25.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 56.2,
        "raise": 43.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 8.4,
        "raise": 7.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 29.8,
        "raise": 7
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 36.8,
        "raise": 63.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 61.4,
        "raise": 38.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "call": 55.5,
        "raise": 22.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 12.2,
        "raise": 5.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 93,
        "raise": 7
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 66.6,
        "call": 33.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 66.6,
        "raise": 33.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 69.2,
        "raise": 30.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    }
  }
};

export const SIXMAX_DEEPFOLD_LINE_CHARTS = {
  "CO 2.5bb BTN Call BB": {
    "22": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 98,
        "raise": 2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 89.4,
        "raise": 10.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 67.4,
        "raise": 32.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 24.2,
        "raise": 75.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 5.4,
        "raise": 94.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "call": 70.2,
        "raise": 29.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATo": {
      "weight": 100,
      "actions": {
        "fold": 19,
        "call": 81
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 57.4,
        "raise": 42.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 87.6,
        "raise": 12.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "call": 70.6,
        "raise": 29.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTo": {
      "weight": 100,
      "actions": {
        "fold": 56.8,
        "call": 43.2
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "call": 73.4,
        "raise": 26.6
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 14.6,
        "call": 85.4
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 16,
        "call": 84
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 17.8,
        "call": 82.2
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 37.4,
        "call": 62.6
      }
    },
    "K3s": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "call": 38.2
      }
    },
    "K2s": {
      "weight": 100,
      "actions": {
        "fold": 66.8,
        "call": 33.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJo": {
      "weight": 100,
      "actions": {
        "fold": 51,
        "call": 49
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 6.8,
        "raise": 93.2
      }
    },
    "QTo": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "Q8s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTo": {
      "weight": 100,
      "actions": {
        "fold": 58,
        "call": 42
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 47.8,
        "raise": 52.2
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 32.6,
        "call": 67.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 35.6,
        "raise": 64.4
      }
    },
    "T9o": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "call": 80,
        "raise": 20
      }
    },
    "T7s": {
      "weight": 100,
      "actions": {
        "fold": 50,
        "call": 50
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "call": 79,
        "raise": 21
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "96s": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "call": 59.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "call": 72,
        "raise": 28
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "85s": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "call": 64.4,
        "raise": 35.6
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "74s": {
      "weight": 100,
      "actions": {
        "fold": 72.2,
        "call": 27.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "call": 96.6,
        "raise": 3.4
      }
    },
    "63s": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 27
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "52s": {
      "weight": 100,
      "actions": {
        "fold": 59,
        "call": 41
      }
    },
    "43s": {
      "weight": 100,
      "actions": {
        "fold": 0.6,
        "call": 99.4
      }
    },
    "42s": {
      "weight": 100,
      "actions": {
        "fold": 61.4,
        "call": 38.6
      }
    },
    "32s": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    }
  },
  "MP 2.5bb BTN Call BB": {
    "22": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 98.4,
        "raise": 1.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 92.4,
        "raise": 7.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 78.4,
        "raise": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 64.4,
        "raise": 35.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 30.8,
        "raise": 69.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "call": 86,
        "raise": 14
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 59.4,
        "raise": 40.6
      }
    },
    "ATo": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 54.8,
        "raise": 45.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 75.2,
        "raise": 24.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "call": 94.2,
        "raise": 5.8
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "call": 69.8,
        "raise": 30.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 41.2,
        "call": 53,
        "raise": 5.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 28.8,
        "raise": 71.2
      }
    },
    "KTo": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "call": 11
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 53.4,
        "call": 46.6
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 52.4,
        "call": 47.6
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 65,
        "call": 35
      }
    },
    "K3s": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "K2s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJo": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 46.2,
        "raise": 53.8
      }
    },
    "QTo": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 20.6,
        "call": 79.4
      }
    },
    "Q8s": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 7.4,
        "raise": 92.6
      }
    },
    "JTo": {
      "weight": 100,
      "actions": {
        "fold": 71.6,
        "call": 28.4
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 61,
        "raise": 39
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 45.7,
        "call": 54.1,
        "raise": 0.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 11,
        "raise": 89
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 67.8,
        "raise": 32.2
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "call": 92.2,
        "raise": 7.8
      }
    },
    "T7s": {
      "weight": 100,
      "actions": {
        "fold": 60.4,
        "call": 39.6
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "call": 83.4,
        "raise": 16.6
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "96s": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "call": 41.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "call": 69.8,
        "raise": 30.2
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "call": 96.2,
        "raise": 3.8
      }
    },
    "85s": {
      "weight": 100,
      "actions": {
        "fold": 70.2,
        "call": 29.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "call": 61,
        "raise": 39
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "74s": {
      "weight": 100,
      "actions": {
        "fold": 70.4,
        "call": 29.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "call": 61.6,
        "raise": 38.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "call": 91.8,
        "raise": 8.2
      }
    },
    "63s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "call": 61.4,
        "raise": 38.6
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "52s": {
      "weight": 100,
      "actions": {
        "fold": 60.2,
        "call": 39.8
      }
    },
    "43s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "42s": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "call": 36.2
      }
    },
    "32s": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    }
  },
  "UTG 2.5bb BTN Call BB": {
    "22": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 99.2,
        "raise": 0.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 94.8,
        "raise": 5.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 83.4,
        "raise": 16.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 74.4,
        "raise": 25.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 55,
        "raise": 45
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 29.2,
        "call": 70.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 78.4,
        "raise": 21.6
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 56.4,
        "raise": 43.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 76.6,
        "raise": 23.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "call": 93.6,
        "raise": 6.4
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "call": 76.6,
        "raise": 23.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 4.2,
        "raise": 95.8
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 63.4,
        "call": 36.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 59.6,
        "raise": 40.4
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 1.8,
        "call": 98.2
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 73.4,
        "call": 26.6
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 48
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 40
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "K3s": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "K2s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJo": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 53,
        "raise": 47
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 15.6,
        "call": 64.8,
        "raise": 19.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 52.2,
        "raise": 47.8
      }
    },
    "JTo": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 81.4,
        "raise": 18.6
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 49,
        "call": 51
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 50.8,
        "raise": 49.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 74.8,
        "raise": 25.2
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "call": 93,
        "raise": 7
      }
    },
    "T7s": {
      "weight": 100,
      "actions": {
        "fold": 60.4,
        "call": 39.6
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "call": 86.8,
        "raise": 13.2
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "96s": {
      "weight": 100,
      "actions": {
        "fold": 60.6,
        "call": 39.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "call": 70.2,
        "raise": 29.8
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "call": 89.2,
        "raise": 10.8
      }
    },
    "85s": {
      "weight": 100,
      "actions": {
        "fold": 66,
        "call": 34
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "call": 63.4,
        "raise": 36.6
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "call": 98.4,
        "raise": 1.6
      }
    },
    "74s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "call": 62.6,
        "raise": 37.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "call": 90.4,
        "raise": 9.6
      }
    },
    "63s": {
      "weight": 100,
      "actions": {
        "fold": 69.6,
        "call": 30.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "call": 63.6,
        "raise": 36.4
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "52s": {
      "weight": 100,
      "actions": {
        "fold": 65.2,
        "call": 34.8
      }
    },
    "43s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "42s": {
      "weight": 100,
      "actions": {
        "fold": 62.6,
        "call": 37.4
      }
    },
    "32s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    }
  },
  "CO 2.5bb BTN Call SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "raise": 31
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "raise": 35.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 11.8,
        "raise": 88.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "raise": 23.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 50.2,
        "raise": 49.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "raise": 7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "raise": 32
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "raise": 16.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "raise": 28
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "raise": 59.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "raise": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "raise": 20.4
      }
    }
  },
  "MP 2.5bb BTN Call SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "raise": 20
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 75.6,
        "raise": 24.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "raise": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "raise": 78
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "raise": 38.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "raise": 11.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 3,
        "raise": 97
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "raise": 41.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "raise": 9.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "raise": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "raise": 30.2
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "raise": 30.6
      }
    }
  },
  "UTG 2.5bb BTN Call SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "raise": 21.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "raise": 33.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "raise": 59.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 39,
        "raise": 61
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "raise": 26.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "raise": 44.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "raise": 19.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "raise": 8.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 52.8,
        "raise": 47.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 55.4,
        "raise": 44.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 45,
        "raise": 55
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "raise": 26.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "raise": 33.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66,
        "raise": 34
      }
    }
  },
  "BTN 2.5bb SB 11.0bb BB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 10.8,
        "raise": 89.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 41.6,
        "raise": 58.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 26.2,
        "raise": 73.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "raise": 9.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "raise": 37.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    }
  },
  "CO 2.5bb BTN 8.5bb BB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "raise": 12.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "raise": 24.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 56.4,
        "raise": 43.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "raise": 30.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 34.2,
        "raise": 65.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "raise": 3
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "raise": 9.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 59.2,
        "raise": 40.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 14.6,
        "raise": 85.4
      }
    }
  },
  "CO 2.5bb SB 11.0bb BB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "raise": 2.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "raise": 21
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "raise": 6.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 70.2,
        "raise": 29.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    }
  },
  "MP 2.5bb BTN 8.5bb BB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "raise": 4.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "raise": 3.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "raise": 21.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "raise": 7.8
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "raise": 5.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "raise": 36
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "raise": 4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 8.6,
        "raise": 91.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 14.6,
        "raise": 85.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 71.6,
        "raise": 28.4
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 17,
        "raise": 83
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "raise": 5.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 82.2,
        "raise": 17.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 15.2,
        "raise": 84.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "raise": 26.2
      }
    }
  },
  "MP 2.5bb CO 8.5bb BB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "raise": 8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 87.4,
        "raise": 12.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "raise": 3.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 51.6,
        "raise": 48.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "raise": 32.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "raise": 2.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "raise": 11.6
      }
    }
  },
  "MP 2.5bb SB 11.0bb BB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 13.4,
        "raise": 86.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "raise": 3
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 61,
        "raise": 39
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "raise": 4.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 34.4,
        "raise": 65.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "raise": 5.6
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb BB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "raise": 5.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 20.8,
        "raise": 79.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "raise": 29.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "raise": 12.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "raise": 11.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "raise": 9
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "raise": 12.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "raise": 26
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "raise": 18.6
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb BB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "raise": 7.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "raise": 78
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 55,
        "raise": 45
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 11.4,
        "raise": 88.6
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BB": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "raise": 3.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "raise": 9.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "raise": 11.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 15.6,
        "raise": 84.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "raise": 36.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "raise": 7.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "raise": 19.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "raise": 5.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "raise": 4.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 57.8,
        "raise": 42.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "raise": 16
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "raise": 3.6
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BB": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "raise": 2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "raise": 10.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "raise": 10.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 22.4,
        "raise": 77.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 5.8,
        "raise": 94.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "raise": 1
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "raise": 37.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "raise": 6.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "raise": 17.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "raise": 4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "raise": 15.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "raise": 20.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "raise": 6.2
      }
    }
  },
  "UTG 2.5bb SB 11.0bb BB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "raise": 5
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 21.8,
        "raise": 78.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "raise": 0.2
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "raise": 5.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "raise": 23.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 77.4,
        "raise": 22.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 43.2,
        "raise": 56.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "raise": 6.4
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 77.4,
        "call": 22.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 68.6,
        "call": 30.4,
        "allin": 1
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 62.4,
        "call": 37.6
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 87.8,
        "call": 11.8,
        "allin": 0.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 10.8,
        "allin": 2.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO FOLD BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 91.2,
        "call": 8.8
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 79.2,
        "call": 20.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 19.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 25
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 57.8,
        "call": 42.2
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 64.2,
        "call": 35.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 53.8,
        "call": 46.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 7.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 63,
        "call": 37
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 71,
        "call": 28.8,
        "allin": 0.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 57,
        "call": 43
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 85.4,
        "call": 14.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13,
        "allin": 0.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO FOLD BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 7.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 73.6,
        "call": 26.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 54,
        "call": 46
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 58.8,
        "call": 41.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 63,
        "call": 37
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 68.4,
        "call": 31.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "call": 8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 85.4,
        "call": 14.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "allin": 7.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 97.4,
        "call": 2.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 70.4,
        "call": 29.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "allin": 2.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 31,
        "allin": 13
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP FOLD BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 87.8,
        "call": 12.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 73.4,
        "call": 26.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "call": 31.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 32.4,
        "call": 67.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "call": 26.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 25
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 41.8,
        "call": 58.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 54.8,
        "call": 45.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 51.2,
        "call": 48.8
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 45.4,
        "call": 54.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "call": 22
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 17.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 77.8,
        "call": 22.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 26
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "allin": 7.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 26
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "allin": 2.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 30.4,
        "allin": 13.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP FOLD BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 92.8,
        "call": 7.2
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "call": 10.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 25
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 57,
        "call": 43
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 32.4,
        "call": 67.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 19.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 41.8,
        "call": 58.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 54.8,
        "call": 45.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 48.8,
        "call": 51.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 65,
        "call": 35
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 45.4,
        "call": 54.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 25
      }
    }
  },
  "MP 2.5bb CO 8.5bb BTN": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "raise": 8.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "raise": 9.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "raise": 31.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "raise": 7.4
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "raise": 20
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "raise": 8.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "raise": 37.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "raise": 1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "raise": 5.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "raise": 2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 39.8,
        "raise": 60.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "raise": 9.4
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "call": 14.2
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 84.6,
        "call": 15.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 17.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "allin": 20
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 1.8,
        "allin": 22
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "call": 41.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG FOLD BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "call": 18.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 72.8,
        "call": 27.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 28.6,
        "call": 71.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 73.4,
        "call": 26.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 36.2,
        "call": 63.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 46,
        "call": 54
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 44.4,
        "call": 55.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "call": 5.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 54,
        "call": 46
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "call": 22
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "call": 24.2
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "call": 11
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "allin": 20
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 82.2,
        "call": 17.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "allin": 23.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 45,
        "call": 41.8,
        "allin": 13.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 17.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG FOLD BTN": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "call": 14.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 77.8,
        "call": 22.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 27
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 16.8,
        "allin": 3
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 28.6,
        "call": 71.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "call": 16
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "call": 8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 36.2,
        "call": 63.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 46.4,
        "call": 53.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 20.8,
        "allin": 3
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "call": 16
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 44.4,
        "call": 54.8,
        "allin": 0.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 91.2,
        "call": 8.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 46,
        "call": 54
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "call": 16
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BTN": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 2,
        "raise": 98
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "raise": 9.8
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "raise": 8.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "raise": 35.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "raise": 1
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 62,
        "raise": 38
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "raise": 4.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "raise": 21.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 87.8,
        "raise": 12.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "raise": 19
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BTN": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "raise": 4.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 32.4,
        "raise": 67.6
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "raise": 3.4
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "raise": 10.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68.6,
        "raise": 31.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 59.8,
        "raise": 40.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "raise": 21.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "raise": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "raise": 19.6
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 27
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 49,
        "call": 45.2,
        "raise": 5.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 2.8,
        "call": 73.6,
        "raise": 23.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 9.4,
        "raise": 90.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 47.2,
        "raise": 52.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 28,
        "raise": 72
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 58,
        "raise": 42
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 44.4,
        "raise": 55.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 73,
        "raise": 27
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 49.4,
        "raise": 50.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 55.6,
        "raise": 44.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 36,
        "raise": 64
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 34,
        "call": 48.6,
        "raise": 17.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 62.2,
        "raise": 37.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 55.6,
        "call": 44.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 67.8,
        "raise": 32.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 17.4
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 72.8,
        "call": 27.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.6,
        "call": 30.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 37,
        "call": 58,
        "raise": 5
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 75.8,
        "raise": 24.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 20.6,
        "raise": 79.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 53.8,
        "raise": 46.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 6.8,
        "call": 32.2,
        "raise": 61
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 54.8,
        "raise": 45.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 49,
        "raise": 51
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 72.4,
        "raise": 27.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 52.2,
        "raise": 47.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 61.6,
        "raise": 38.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 45.4,
        "raise": 54.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 23.2,
        "call": 60.5,
        "raise": 16.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 66.6,
        "raise": 33.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 71.8,
        "raise": 28.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 75.2,
        "call": 24.8
      }
    }
  },
  "UTG 2.5bb MP 8.5bb CO": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "raise": 4.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 35.8,
        "raise": 64.2
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "raise": 1.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 73.6,
        "raise": 26.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "raise": 5.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "raise": 38.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "raise": 0.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "raise": 21.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "raise": 12
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "raise": 21
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 26
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 56.8,
        "call": 35.8,
        "raise": 7.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 36,
        "call": 47,
        "raise": 17
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 24.6,
        "raise": 75.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 60.2,
        "raise": 39.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 43.4,
        "call": 15.2,
        "raise": 41.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 49,
        "raise": 51
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 43.4,
        "call": 23.2,
        "raise": 33.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 67.6,
        "call": 32.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 79.2,
        "call": 20.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 12.2,
        "raise": 87.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 62.6,
        "raise": 37.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 61.8,
        "raise": 38.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 49.6,
        "call": 37.6,
        "raise": 12.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 75.6,
        "raise": 24.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 58.6,
        "call": 41.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 67.8,
        "raise": 32.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 64.2,
        "call": 35.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 71.4,
        "raise": 28.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "call": 10.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP": {
    "22": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "33": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 16.2,
        "call": 63.2,
        "raise": 20.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 32.2,
        "raise": 67.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 66.8,
        "raise": 33.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 46.7,
        "call": 17,
        "raise": 36.3
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 43.8,
        "raise": 56.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 49.2,
        "call": 29.4,
        "raise": 21.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 17.2,
        "raise": 82.8
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 56.4,
        "raise": 43.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 64.6,
        "raise": 35.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 37.6,
        "call": 41,
        "raise": 21.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 78.8,
        "raise": 21.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 44.4,
        "call": 55.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 68.2,
        "raise": 31.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 57.6,
        "call": 42.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 73.4,
        "raise": 26.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 83.6,
        "call": 16.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "call": 30.2
      }
    }
  },
  "CO 2.5bb BTN 8.5bb SB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "raise": 6.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "raise": 17.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 66.8,
        "raise": 33.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "raise": 12.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "raise": 7.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "raise": 37.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "raise": 6.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 23,
        "raise": 77
      }
    }
  },
  "MP 2.5bb BTN 8.5bb SB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "raise": 4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "raise": 6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 3.4,
        "raise": 96.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "raise": 13.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "raise": 1.4
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "raise": 2.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "raise": 32
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "raise": 0.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 37.2,
        "raise": 62.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "raise": 4.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 30.6,
        "raise": 69.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "raise": 22
      }
    }
  },
  "MP 2.5bb CO 8.5bb SB": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "raise": 5
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "raise": 13.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 4.4,
        "raise": 95.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 69.6,
        "raise": 30.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "raise": 33.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "raise": 1.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 23.8,
        "raise": 76.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 15.8,
        "raise": 84.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "raise": 4.2
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb SB": {
    "88": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "raise": 3.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "raise": 3.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 21.8,
        "raise": 78.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 25.8,
        "raise": 74.2
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "raise": 6.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "raise": 24.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "raise": 6.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "raise": 11.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "raise": 9.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 87.4,
        "raise": 12.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "raise": 14.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "raise": 17
      }
    }
  },
  "UTG 2.5bb CO 8.5bb SB": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "raise": 7.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "raise": 9.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 23,
        "raise": 77
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 8.2,
        "raise": 91.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "raise": 27.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "raise": 9.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "raise": 18.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "raise": 6.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "raise": 12
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 77.4,
        "raise": 22.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "raise": 10.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97.4,
        "raise": 2.6
      }
    }
  },
  "UTG 2.5bb MP 8.5bb SB": {
    "77": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "raise": 5.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "raise": 8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 24.8,
        "raise": 75.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 25,
        "raise": 75
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "raise": 2.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 64.6,
        "raise": 35.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 89.6,
        "raise": 10.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "raise": 20.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "raise": 4.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "raise": 10.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "raise": 14.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "raise": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "raise": 1.8
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG": {
    "33": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 29.2,
        "raise": 7.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 35.8,
        "raise": 12.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 32.8,
        "raise": 67.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 71.4,
        "raise": 28.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 73,
        "call": 0.2,
        "raise": 26.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 55.8,
        "raise": 44.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 65.3,
        "call": 16.2,
        "raise": 18.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 46.2,
        "call": 36.8,
        "raise": 17
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 30.6,
        "raise": 69.4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 65.2,
        "raise": 34.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 34.8,
        "call": 46.2,
        "raise": 19
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "call": 11,
        "raise": 12.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 92.2,
        "raise": 7.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 70,
        "raise": 30
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "call": 22
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 20.8,
        "call": 54.9,
        "raise": 24.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 22.6,
        "raise": 3.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 51.8,
        "call": 36.4,
        "raise": 11.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "raise": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 30.6,
        "raise": 69.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 73.6,
        "raise": 26.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "raise": 25.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 56.2,
        "raise": 43.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 8.4,
        "raise": 7.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 29.8,
        "raise": 7
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 36.8,
        "raise": 63.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 61.4,
        "raise": 38.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "call": 55.5,
        "raise": 22.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 82.6,
        "call": 12.2,
        "raise": 5.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 93,
        "raise": 7
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 66.6,
        "call": 33.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 66.6,
        "raise": 33.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 69.2,
        "raise": 30.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    }
  },
  "BTN 2.5bb BB 11.0bb BTN 24.0bb BB": {
    "55": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 70.4,
        "call": 29.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 48.6,
        "call": 51.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 8.4,
        "call": 91.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 84,
        "allin": 16
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 3,
        "call": 97
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 13,
        "call": 81.6,
        "allin": 5.4
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 61.6,
        "call": 38.4
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 41.2,
        "call": 29.8,
        "allin": 29
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 39.2,
        "allin": 60.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 28.2,
        "call": 43.6,
        "allin": 28.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 82.2,
        "call": 17.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 2.6,
        "call": 97.4
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 30.6,
        "call": 69.4
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 98.2,
        "call": 1.8
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 73.6,
        "call": 26.4
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 10.2,
        "allin": 89.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 6,
        "call": 94
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 12.2,
        "call": 87.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 55.6,
        "allin": 44.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 59.2,
        "call": 40.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 58.2,
        "allin": 41.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 33.8,
        "call": 66.2
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 21.2,
        "call": 78.8
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 34.6,
        "call": 65.4
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 45.6,
        "call": 54.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 39.6,
        "call": 60.4
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    }
  },
  "CO 2.5bb BB 11.0bb CO 24.0bb BB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 42,
        "allin": 58
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 8.8,
        "allin": 91.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 4.2,
        "call": 95.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 65.6,
        "call": 34.4
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 29.4,
        "call": 28.4,
        "allin": 42.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 25.8,
        "allin": 2.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 2.8,
        "call": 97.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 28.4,
        "call": 71.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 10.8,
        "call": 89.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 70.8,
        "allin": 29.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.4,
        "call": 5.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 51.6,
        "allin": 48.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 17.4,
        "call": 82.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 31,
        "call": 69
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 42.2,
        "call": 57.8
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "fold": 87.2,
        "call": 12.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 56.6,
        "call": 43.4
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 59.8,
        "call": 40.2
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 60.6,
        "call": 39.4
      }
    },
    "53s": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    }
  },
  "CO 2.5bb BTN 8.5bb SB 21.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO 25.0bb BTN FOLD BB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 98,
        "call": 2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 32.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 24.2,
        "call": 75.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 55.8,
        "allin": 44.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 49.6,
        "call": 50.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 57.4,
        "call": 42.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 73.4,
        "call": 26.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 39.8,
        "allin": 60.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 28,
        "call": 72
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 44.6,
        "allin": 55.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 47.8,
        "call": 52.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 35.6,
        "call": 64.4
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 64.4,
        "call": 35.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 63.6,
        "call": 36.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 63.6,
        "call": 36.4
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 5.4,
        "call": 94.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 82,
        "call": 18
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO FOLD BTN AllIn BB": {
    "99": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 5.4,
        "call": 94.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "MP 2.5bb BB 11.0bb MP 24.0bb BB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 99,
        "call": 1
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "call": 8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 16.6,
        "allin": 83.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 22,
        "allin": 78
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 40.4,
        "call": 59.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 53.4,
        "call": 46.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 65.2,
        "call": 29.2,
        "allin": 5.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 23.8,
        "allin": 76.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 47.2,
        "call": 52.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "call": 26.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 81,
        "allin": 19
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "call": 54.4,
        "allin": 23.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 65,
        "call": 35
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 70.4,
        "call": 29.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "call": 37.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66.8,
        "call": 33.2
      }
    }
  },
  "MP 2.5bb BTN 8.5bb SB 21.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 41.8,
        "allin": 58.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP 25.0bb BTN FOLD BB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 64.4,
        "call": 35.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 19.2,
        "allin": 80.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 16.4,
        "allin": 83.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 59.4,
        "call": 40.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 54.8,
        "call": 45.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 75.2,
        "call": 24.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 49.2,
        "call": 50.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 64.4,
        "allin": 35.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 97.8,
        "call": 2.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 72.2,
        "allin": 27.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 40.4,
        "call": 59.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 11,
        "call": 89
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "call": 30.2
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 61,
        "call": 39
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 61.6,
        "call": 38.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 61.4,
        "call": 38.6
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP FOLD BTN AllIn BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 41.8,
        "call": 58.2
      }
    }
  },
  "MP 2.5bb CO 8.5bb BTN 20.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 35,
        "allin": 65
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "allin": 26.2
      }
    }
  },
  "MP 2.5bb CO 8.5bb SB 21.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 41.8,
        "allin": 58.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "allin": 10.8
      }
    }
  },
  "SB 3.0bb BB 9.0bb SB 22.0bb BB": {
    "55": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "call": 26.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 42.6,
        "call": 57.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 16,
        "call": 84
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 67.6,
        "allin": 32.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 4.2,
        "call": 84.6,
        "allin": 11.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "call": 37.8
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 0.4,
        "call": 99.6
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 87.4,
        "call": 12.6
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 6.8,
        "allin": 5.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 34.6,
        "allin": 65.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 18.6,
        "call": 61.4,
        "allin": 20
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 36.4,
        "call": 63.6
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 94.6,
        "allin": 5.4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 11.2,
        "call": 88.8
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "K7s": {
      "weight": 100,
      "actions": {
        "fold": 65,
        "call": 35
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 48.8,
        "call": 51.2
      }
    },
    "K5s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "K4s": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 21.2,
        "allin": 78.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 13.4,
        "call": 60.4,
        "allin": 26.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 37.8,
        "call": 62.2
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 15,
        "allin": 85
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 10.2,
        "call": 89.8
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 43.6,
        "call": 56.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 43.6,
        "allin": 56.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 12,
        "call": 88
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "call": 26.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 13.2,
        "call": 86.8
      }
    },
    "97s": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 7.6,
        "call": 92.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 14,
        "call": 86
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 22.2,
        "call": 77.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 11,
        "call": 89
      }
    }
  },
  "UTG 2.5bb BB 11.0bb UTG 24.0bb BB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 18.2,
        "allin": 81.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 23,
        "call": 20.6,
        "allin": 56.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 13.2,
        "call": 86.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 55.6,
        "call": 44.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "call": 16.6,
        "allin": 14.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 42.4,
        "allin": 57.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 71,
        "allin": 29
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 58.6,
        "call": 41.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 71.8,
        "call": 28.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "call": 26.8
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb SB 21.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "allin": 44.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "allin": 19
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG 25.0bb BTN FOLD BB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 99.2,
        "call": 0.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 94.8,
        "call": 5.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 11,
        "allin": 89
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 30,
        "allin": 70
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 56.4,
        "call": 43.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 64.2,
        "call": 35.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 80.4,
        "call": 19.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 78.6,
        "allin": 21.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 94.6,
        "allin": 5.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 52.4,
        "call": 47.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 50.8,
        "call": 49.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "call": 25.2
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 70.2,
        "call": 29.8
      }
    },
    "86s": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 63.4,
        "call": 36.6
      }
    },
    "75s": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 62.6,
        "call": 37.4
      }
    },
    "64s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 63.6,
        "call": 36.4
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG FOLD BTN AllIn BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "call": 41.6
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BTN 20.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 38.4,
        "allin": 61.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "allin": 11.6
      }
    }
  },
  "UTG 2.5bb CO 8.5bb SB 21.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 51.6,
        "allin": 48.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "allin": 1.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "allin": 10.6
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BTN 20.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 42.2,
        "allin": 57.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "allin": 4.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb MP 8.5bb CO 20.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 38.4,
        "allin": 61.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb MP 8.5bb SB 21.0bb BB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "allin": 24.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 65.8,
        "allin": 34.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "allin": 11
      }
    }
  },
  "BTN 2.5bb SB 11.0bb BB 22.0bb BTN": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "CO 2.5bb BTN 8.5bb BB 21.0bb CO FOLD BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 53.4,
        "call": 46.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 51.4,
        "call": 48.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 46,
        "call": 54
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 91.4,
        "allin": 8.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 12.2,
        "allin": 87.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 32,
        "allin": 68
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 71.6,
        "call": 28.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 35.8,
        "call": 64.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 41.2,
        "call": 58.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 57.4,
        "call": 42.6
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 25.6,
        "call": 74.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 19.4,
        "call": 80.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 37.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 48.8,
        "allin": 51.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 37,
        "call": 63
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 51.4,
        "call": 48.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 13.4,
        "call": 86.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 44.4,
        "call": 55.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 36.8,
        "call": 63.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 64.2,
        "call": 35.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 19.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 32.6
      }
    }
  },
  "CO 2.5bb BTN 8.5bb CO 22.0bb BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 53.4,
        "call": 46.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 51.4,
        "call": 48.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 46,
        "call": 54
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 23,
        "allin": 77
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "call": 59.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 59.8,
        "call": 40.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 35.8,
        "call": 64.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 45.8,
        "call": 54.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 59.6,
        "call": 40.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 22.6,
        "allin": 77.4
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 25.6,
        "call": 74.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 19.4,
        "call": 80.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 36.8,
        "call": 63.2
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 48.8,
        "call": 51.2
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 77.8,
        "call": 22.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 26.8,
        "allin": 73.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 37,
        "call": 63
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 13.4,
        "call": 48.2,
        "allin": 38.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 32.4,
        "call": 67.6
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 36.8,
        "call": 63.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 60.6,
        "call": 39.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 19.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 32.6
      }
    }
  },
  "CO 2.5bb BTN 8.5bb SB 21.0bb CO FOLD BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 53.4,
        "call": 46.6
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 51.4,
        "call": 48.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 46,
        "call": 54
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 66.4,
        "allin": 33.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 17.8,
        "allin": 82.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 0.2,
        "call": 40.6,
        "allin": 59.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 35.8,
        "call": 64.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 47.6,
        "call": 52.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 53.6,
        "call": 46.4
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 25.6,
        "call": 74.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 22.6,
        "call": 77.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 88.6,
        "allin": 11.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 38.2,
        "call": 61.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 48.6,
        "call": 51.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 13.4,
        "call": 86.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 59.4,
        "call": 40.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 36.8,
        "call": 63.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 19.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 32.6
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO 25.0bb BTN": {},
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO FOLD BTN": {},
  "CO 2.5bb BTN Call SB 13.0bb CO 25.0bb BTN": {},
  "MP 2.5bb BTN 8.5bb BB 21.0bb MP FOLD BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "call": 31.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 64.4,
        "allin": 35.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 17,
        "allin": 83
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 7.4,
        "call": 30.6,
        "allin": 62
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 12.8,
        "call": 87.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 71.2,
        "call": 28.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 61.6,
        "call": 38.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "call": 24.2
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 58.2,
        "call": 41.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 2.4,
        "call": 84.6,
        "allin": 13
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 85.4,
        "call": 14.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 65.2,
        "call": 34.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 84.2,
        "call": 15.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "call": 14.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 79.2,
        "call": 20.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    }
  },
  "MP 2.5bb BTN 8.5bb MP 22.0bb BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "call": 31.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 91.6,
        "allin": 8.4
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 10.2,
        "allin": 89.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 7.4,
        "call": 20.2,
        "allin": 72.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 12.8,
        "call": 87.2
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 83.2,
        "call": 16.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 67.6,
        "call": 32.4
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 51.4,
        "call": 48.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 75.6,
        "call": 24.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 58.2,
        "call": 41.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 45.2,
        "call": 54.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 59.6,
        "call": 40.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 2.4,
        "call": 38.4,
        "allin": 59.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 53,
        "call": 47
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 65.8,
        "call": 34.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 72.2,
        "call": 27.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "call": 14.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 79.2,
        "call": 20.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    }
  },
  "MP 2.5bb BTN 8.5bb SB 21.0bb MP FOLD BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "call": 8.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "call": 31.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 73.4,
        "allin": 26.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 36.4,
        "allin": 63.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 7.4,
        "call": 35.8,
        "allin": 56.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 12.8,
        "call": 87.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 63.4,
        "call": 36.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 77.4,
        "call": 22.6
      }
    },
    "A2s": {
      "weight": 100,
      "actions": {
        "fold": 99.8,
        "call": 0.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "call": 24.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 2.6,
        "call": 92,
        "allin": 5.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 17.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 81.6,
        "call": 18.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 67,
        "call": 33
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "call": 23.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 85.8,
        "call": 14.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 79.2,
        "call": 20.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP 25.0bb BTN": {
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "allin": 2.4
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP FOLD BTN": {
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 97.4,
        "allin": 2.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "allin": 2.4
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP 25.0bb BTN": {
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "allin": 2.4
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb BB 21.0bb UTG FOLD BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 86.8,
        "allin": 13.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 27.2,
        "allin": 72.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 20,
        "call": 36,
        "allin": 44
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 25.8,
        "call": 74.2
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "call": 11
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 23.8,
        "call": 76.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "call": 6.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 57,
        "call": 43
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 82.2,
        "call": 17.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "call": 18.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "call": 21.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 71,
        "call": 29
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb SB 21.0bb UTG FOLD BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 86.8,
        "allin": 13.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 32.4,
        "allin": 67.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 19.8,
        "call": 35.8,
        "allin": 44.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 47,
        "call": 53
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "call": 23.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 23.8,
        "call": 76.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 97.4,
        "call": 2.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "call": 21.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "call": 21.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 71,
        "call": 29
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb UTG 22.0bb BTN": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.2,
        "call": 18.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "call": 22
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 61,
        "allin": 39
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 3.4,
        "allin": 96.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 20,
        "call": 23.6,
        "allin": 56.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 17,
        "call": 83
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "call": 36.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 23.8,
        "call": 72.8,
        "allin": 3.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 92,
        "call": 8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 55.6,
        "call": 44.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 17.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.8,
        "call": 21.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 71,
        "call": 29
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG 25.0bb BTN": {},
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG FOLD BTN": {},
  "UTG 2.5bb BTN Call SB 13.0bb UTG 25.0bb BTN": {},
  "UTG 2.5bb MP 8.5bb CO 20.0bb BTN": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 48,
        "allin": 52
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "allin": 6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "CO 2.5bb BTN 8.5bb BB 21.0bb CO": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 91.6,
        "allin": 8.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "CO 2.5bb BTN 8.5bb SB 21.0bb CO": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "allin": 7.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB Call CO": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 52.8,
        "call": 47.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 37.8,
        "call": 62.2
      }
    }
  },
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB FOLD CO": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 52.8,
        "call": 47.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 27,
        "call": 73
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 50.6,
        "call": 49.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 64,
        "call": 36
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 51.4,
        "call": 48.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 37.8,
        "call": 62.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 25,
        "allin": 75
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB Call CO": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 46.2,
        "call": 53.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 33.4,
        "call": 66.6
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB FOLD CO": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 46.2,
        "call": 53.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 27.6,
        "call": 72.4
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 47.8,
        "call": 52.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "call": 45.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 39.4,
        "call": 60.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 33.4,
        "call": 66.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    }
  },
  "CO 2.5bb SB 11.0bb BB 22.0bb CO": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "MP 2.5bb CO 8.5bb BB 21.0bb MP FOLD CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 61.2,
        "allin": 38.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 15.4,
        "allin": 84.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 35,
        "allin": 65
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 98.4,
        "call": 1.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 49.6,
        "call": 50.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 60.8,
        "call": 39.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 20.8,
        "call": 79.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 83.2,
        "allin": 16.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 80.2,
        "call": 19.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 57,
        "call": 43
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    }
  },
  "MP 2.5bb CO 8.5bb BTN 20.0bb MP FOLD CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 29.2,
        "allin": 70.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "call": 11
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 44,
        "call": 56
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 63.6,
        "call": 36.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 51.8,
        "allin": 48.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 19.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 6.4,
        "call": 93.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 44.4,
        "call": 55.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    }
  },
  "MP 2.5bb CO 8.5bb MP 22.0bb CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 85,
        "allin": 15
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 10.2,
        "allin": 89.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 29.2,
        "allin": 70.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 44.2,
        "call": 55.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 2,
        "call": 98
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 76.6,
        "call": 23.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 50.2,
        "allin": 49.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    }
  },
  "MP 2.5bb CO 8.5bb SB 21.0bb MP FOLD CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 56,
        "call": 44
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 71.8,
        "allin": 28.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 38.6,
        "allin": 61.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 40.8,
        "allin": 59.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 92.4,
        "call": 7.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 48
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 37.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 50.2,
        "call": 49.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 92.6,
        "allin": 7.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 75.8,
        "call": 24.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 57.8,
        "call": 42.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 99.6,
        "call": 0.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BB 21.0bb UTG FOLD CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 77.2,
        "allin": 22.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 42.8,
        "allin": 57.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 42.4,
        "allin": 57.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 71,
        "call": 29
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 90,
        "call": 10
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 92.8,
        "allin": 7.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 19.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 31.2,
        "call": 68.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 60.6,
        "call": 39.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BTN 20.0bb UTG FOLD CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 21.4,
        "allin": 78.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 27.6,
        "allin": 72.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 2.2,
        "allin": 97.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 31.6,
        "call": 68.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.6,
        "call": 37.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 65.8,
        "call": 34.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 71.6,
        "allin": 28.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 46.8,
        "call": 53.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 49.8,
        "call": 50.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    }
  },
  "UTG 2.5bb CO 8.5bb SB 21.0bb UTG FOLD CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 86.2,
        "allin": 13.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 65.8,
        "allin": 34.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 45,
        "allin": 55
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 14,
        "call": 86
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 65.4,
        "call": 34.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 50.2,
        "call": 49.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 56.4,
        "call": 43.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    }
  },
  "UTG 2.5bb CO 8.5bb UTG 22.0bb CO": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.8,
        "call": 1.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 76.4,
        "call": 23.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 48.8,
        "allin": 51.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 7,
        "allin": 93
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 30.6,
        "allin": 69.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 29.4,
        "call": 70.6
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 84,
        "call": 16
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 37.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 81.4,
        "call": 18.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 0.8,
        "call": 99.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 90.6,
        "call": 9.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 87.4,
        "allin": 12.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "call": 6.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 51,
        "call": 49
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 78.6,
        "call": 21.4
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.2,
        "call": 30.8
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 70,
        "call": 30
      }
    }
  },
  "MP 2.5bb BTN 8.5bb BB 21.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 3,
        "allin": 97
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 32.2,
        "allin": 67.8
      }
    }
  },
  "MP 2.5bb BTN 8.5bb SB 21.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 7.8,
        "allin": 92.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 39,
        "allin": 61
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB Call MP": {
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 87.8,
        "call": 12.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 24.4,
        "call": 75.6
      }
    }
  },
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB FOLD MP": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 75.4,
        "call": 24.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 39.8,
        "call": 60.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 92.2,
        "call": 7.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 87.8,
        "call": 12.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 24.4,
        "call": 75.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 32.2,
        "call": 67.8
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 25.4,
        "allin": 74.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB Call MP": {
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 17.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 21.2,
        "call": 78.8
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB FOLD MP": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 33.2,
        "call": 66.8
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 82.8,
        "call": 17.2
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 81,
        "call": 19
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 21.2,
        "call": 78.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 31.8,
        "call": 68.2
      }
    }
  },
  "MP 2.5bb CO 8.5bb BB 21.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 1.4,
        "allin": 98.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 24.6,
        "allin": 75.4
      }
    }
  },
  "MP 2.5bb CO 8.5bb BTN 20.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 28.4,
        "allin": 71.6
      }
    }
  },
  "MP 2.5bb CO 8.5bb SB 21.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 4.4,
        "allin": 95.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 24.4,
        "allin": 75.6
      }
    }
  },
  "MP 2.5bb SB 11.0bb BB 22.0bb MP": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 18,
        "allin": 82
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 47.6,
        "allin": 52.4
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BB 21.0bb UTG FOLD MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 80.4,
        "allin": 19.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 50,
        "allin": 50
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 46,
        "allin": 54
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 16.4,
        "call": 83.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 88,
        "call": 12
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 51.6,
        "call": 48.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 60.4,
        "call": 39.6
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BTN 20.0bb UTG FOLD MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 18.8,
        "allin": 81.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 21.6,
        "allin": 78.4
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 8,
        "allin": 92
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 47.2,
        "call": 52.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68.4,
        "call": 31.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 78,
        "allin": 22
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 56.4,
        "call": 43.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 56.8,
        "call": 43.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "UTG 2.5bb MP 8.5bb CO 20.0bb UTG FOLD MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 12.2,
        "allin": 87.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 30.2,
        "allin": 69.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 8.6,
        "allin": 91.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 52,
        "call": 48
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 66.8,
        "call": 33.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 74.6,
        "call": 25.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 83.8,
        "call": 16.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 89.2,
        "allin": 10.8
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 52.4,
        "call": 47.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 55.8,
        "call": 44.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "UTG 2.5bb MP 8.5bb SB 21.0bb UTG FOLD MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 67.8,
        "call": 32.2
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 82.2,
        "allin": 17.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 54.4,
        "allin": 45.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 0.6,
        "call": 44.7,
        "allin": 54.7
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "fold": 38,
        "call": 62
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 64.6,
        "call": 35.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 82.4,
        "call": 17.6
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 59.8,
        "call": 40.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 68.2,
        "call": 31.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "UTG 2.5bb MP 8.5bb UTG 22.0bb MP": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.2,
        "call": 3.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 49,
        "allin": 51
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 19.4,
        "allin": 80.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 27.6,
        "allin": 72.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 45.8,
        "call": 54.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 84.8,
        "call": 15.2
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 33.2,
        "call": 66.8
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 87.6,
        "allin": 12.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 86.6,
        "call": 13.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 76,
        "call": 24
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 71.4,
        "call": 28.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72.6,
        "call": 27.4
      }
    }
  },
  "BTN 2.5bb SB 11.0bb BB 22.0bb BTN FOLD SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "call": 44.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 62.2,
        "allin": 37.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 77,
        "call": 23
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 26,
        "call": 74
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 75,
        "allin": 25
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 3.2,
        "allin": 96.8
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 49.8,
        "call": 50.2
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJo": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K8s": {
      "weight": 100,
      "actions": {
        "fold": 88.6,
        "call": 11.4
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "Q9s": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 40
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 40,
        "allin": 60
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J8s": {
      "weight": 100,
      "actions": {
        "fold": 96.6,
        "call": 3.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 19,
        "call": 81
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 37.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 32.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    }
  },
  "BTN 2.5bb SB 11.0bb BTN 24.0bb SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 90.2,
        "call": 9.8
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "call": 44.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 76.2,
        "allin": 23.8
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJo": {
      "weight": 100,
      "actions": {
        "fold": 74,
        "call": 26
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 93,
        "allin": 7
      }
    },
    "A9s": {
      "weight": 100,
      "actions": {
        "fold": 18.8,
        "call": 81.2
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "call": 65.6,
        "allin": 34.4
      }
    },
    "A7s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 21.8,
        "allin": 15.4
      }
    },
    "A6s": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 49.2,
        "allin": 50.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "call": 68.6,
        "allin": 31.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 72.4,
        "call": 27.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K6s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 6.4,
        "allin": 93.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 45.6,
        "allin": 54.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 76.2,
        "call": 23.8
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 80,
        "allin": 20
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T8s": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "98s": {
      "weight": 100,
      "actions": {
        "fold": 74.4,
        "call": 25.6
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 62.8,
        "call": 37.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 67.4,
        "call": 32.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO FOLD BTN FOLD SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "call": 35.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 11.8,
        "call": 88.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 6.6,
        "allin": 93.4
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 60,
        "call": 40
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 41.4,
        "call": 58.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 50.2,
        "call": 49.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 2.4,
        "call": 97.6
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 37.8,
        "call": 62.2
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 15.6,
        "allin": 84.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 12,
        "call": 88
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 35.2,
        "call": 64.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 48.2,
        "call": 51.8
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 76.8,
        "call": 23.2
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 43.6,
        "call": 56.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO 25.0bb BTN FOLD SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 69,
        "call": 31
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "call": 35.2
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 11.8,
        "call": 88.2
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 38,
        "allin": 62
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 41.8,
        "call": 58.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 50.2,
        "call": 49.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 44.8,
        "allin": 55.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 31.2,
        "call": 68.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 64.2,
        "call": 35.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 60.8,
        "allin": 39.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "call": 59.4
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 97.2,
        "call": 2.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 79.6,
        "call": 20.4
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KQo": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 12.4,
        "call": 87.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "CO 2.5bb BTN Call SB 13.0bb CO FOLD BTN AllIn SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 68,
        "call": 32
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "CO 2.5bb SB 11.0bb BB 22.0bb CO FOLD SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 51.6,
        "call": 48.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 39.6,
        "call": 60.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 13.4,
        "allin": 86.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 42.4,
        "call": 57.6
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 88.4,
        "call": 11.6
      }
    },
    "A8s": {
      "weight": 100,
      "actions": {
        "fold": 89,
        "call": 11
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 39.6,
        "call": 60.4
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 25
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 17.4,
        "call": 82.6
      }
    },
    "K9s": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 57.8,
        "allin": 42.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 11,
        "call": 89
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 14.4,
        "call": 85.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 94,
        "call": 6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 39,
        "call": 61
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    }
  },
  "CO 2.5bb SB 11.0bb CO 24.0bb SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96,
        "call": 4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 91,
        "call": 9
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 51.6,
        "call": 48.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 39.6,
        "call": 60.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 38.4,
        "allin": 61.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 4.4,
        "allin": 95.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 44.2,
        "call": 55.8
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "call": 65.2,
        "allin": 34.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "call": 74.2,
        "allin": 25.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 51,
        "call": 49
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 84.4,
        "call": 15.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 3.8,
        "call": 96.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 53,
        "allin": 47
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 62.2,
        "allin": 37.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 31.4,
        "call": 68.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 49,
        "call": 51
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 74.2,
        "call": 25.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 85,
        "call": 15
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 86.4,
        "call": 13.6
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP FOLD BTN FOLD SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 75.6,
        "call": 24.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 27.4,
        "allin": 72.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 35.8,
        "call": 64.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 48.2,
        "call": 51.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "call": 38.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 19.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "call": 6.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 67.4,
        "allin": 32.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 70.8,
        "call": 29.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "call": 41.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 87,
        "call": 13
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 29.8,
        "call": 70.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "call": 30.2
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP 25.0bb BTN FOLD SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 75.6,
        "call": 24.4
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 17.8,
        "allin": 82.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 23,
        "allin": 77
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 64.8,
        "call": 35.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 22,
        "call": 78
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 61.8,
        "call": 38.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 42.8,
        "call": 57.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 66.6,
        "allin": 33.4
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "call": 13.2
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 83,
        "call": 17
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 81.2,
        "allin": 18.8
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 9.6,
        "call": 90.4
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 97.6,
        "call": 2.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 90.4,
        "call": 9.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 85.2,
        "call": 14.8
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.8,
        "call": 30.2
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "MP 2.5bb BTN Call SB 13.0bb MP FOLD BTN AllIn SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 31.4,
        "call": 68.6
      }
    }
  },
  "MP 2.5bb CO 8.5bb BTN 20.0bb SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 39.2,
        "allin": 60.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "allin": 20.6
      }
    }
  },
  "MP 2.5bb SB 11.0bb BB 22.0bb MP FOLD SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 4.6,
        "call": 95.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 24.8,
        "allin": 75.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 9,
        "allin": 91
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 79.8,
        "call": 20.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 88.2,
        "call": 11.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 20.8,
        "call": 79.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 45.2,
        "call": 54.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 85.6,
        "call": 14.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 14,
        "call": 86
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 84.6,
        "call": 15.4
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 60.4,
        "allin": 39.6
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 77.2,
        "call": 22.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 70.4,
        "call": 29.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 62.2,
        "call": 37.8
      }
    },
    "J9s": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 32.8,
        "call": 67.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 19.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    }
  },
  "MP 2.5bb SB 11.0bb MP 24.0bb SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 94.6,
        "call": 5.4
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 94.2,
        "call": 5.8
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 50.4,
        "call": 49.6
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 15.6,
        "call": 84.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 25,
        "allin": 75
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 17.4,
        "allin": 82.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 95.6,
        "call": 4.4
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 71.2,
        "call": 28.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 20.8,
        "call": 49.8,
        "allin": 29.4
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 37,
        "call": 63
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 30,
        "call": 70
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 64.4,
        "call": 35.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 72.4,
        "allin": 27.6
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 69.6,
        "allin": 30.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 78,
        "call": 22
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "call": 14
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 80.8,
        "call": 19.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 79.4,
        "call": 20.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 72,
        "call": 28
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG FOLD BTN FOLD SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "call": 59.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 20.8,
        "allin": 79.2
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "call": 44.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 61.2,
        "call": 38.8
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 89.2,
        "call": 10.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 42.6,
        "allin": 57.4
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 87.6,
        "call": 12.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 7.6,
        "call": 92.4
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 95,
        "call": 5
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 54.8,
        "call": 45.2
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66,
        "call": 34
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG 25.0bb BTN FOLD SB": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 86.2,
        "call": 13.8
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 78.4,
        "call": 21.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.2,
        "call": 33.8
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 40.6,
        "call": 59.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 14.4,
        "allin": 85.6
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 31,
        "allin": 69
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AQo": {
      "weight": 100,
      "actions": {
        "fold": 93.8,
        "call": 6.2
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 73.2,
        "call": 26.8
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 55.2,
        "call": 44.8
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 80.6,
        "call": 19.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 58.8,
        "call": 41.2
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 95.4,
        "call": 4.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 72.2,
        "allin": 27.8
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 75.2,
        "call": 24.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 90.8,
        "allin": 9.2
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 45,
        "call": 55
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 73.8,
        "call": 26.2
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 66.4,
        "call": 33.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 66,
        "call": 34
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG FOLD BTN AllIn SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 43,
        "call": 57
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BTN 20.0bb SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 42.4,
        "allin": 57.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "allin": 1.4
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BTN 20.0bb SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 60.4,
        "allin": 39.6
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 68.8,
        "allin": 31.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb MP 8.5bb CO 20.0bb SB": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 54.6,
        "allin": 45.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 74.8,
        "allin": 25.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb SB 11.0bb BB 22.0bb UTG FOLD SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.6,
        "call": 33.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 48.6,
        "call": 51.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 20.8,
        "allin": 79.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "call": 5.8,
        "allin": 94.2
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 28,
        "allin": 72
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 33,
        "call": 67
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 51.2,
        "call": 48.8
      }
    },
    "A3s": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "call": 9.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 93,
        "call": 7
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 95.2,
        "call": 4.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 95.8,
        "allin": 4.2
      }
    },
    "QJs": {
      "weight": 100,
      "actions": {
        "fold": 91.4,
        "call": 8.6
      }
    },
    "QTs": {
      "weight": 100,
      "actions": {
        "fold": 78.2,
        "call": 21.8
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 25,
        "call": 75
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 75,
        "call": 25
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 34.6,
        "call": 65.4
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 64.6,
        "call": 35.4
      }
    }
  },
  "UTG 2.5bb SB 11.0bb UTG 24.0bb SB": {
    "44": {
      "weight": 100,
      "actions": {
        "fold": 96.8,
        "call": 3.2
      }
    },
    "55": {
      "weight": 100,
      "actions": {
        "fold": 96.4,
        "call": 3.6
      }
    },
    "66": {
      "weight": 100,
      "actions": {
        "fold": 81.8,
        "call": 18.2
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 79,
        "call": 21
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 66.6,
        "call": 33.4
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 48.6,
        "call": 51.4
      }
    },
    "AA": {
      "weight": 100,
      "actions": {
        "call": 17,
        "allin": 83
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "call": 25.4,
        "allin": 74.6
      }
    },
    "AQs": {
      "weight": 100,
      "actions": {
        "call": 100
      }
    },
    "AJs": {
      "weight": 100,
      "actions": {
        "fold": 17.8,
        "call": 82.2
      }
    },
    "ATs": {
      "weight": 100,
      "actions": {
        "fold": 77.6,
        "call": 22.4
      }
    },
    "A5s": {
      "weight": 100,
      "actions": {
        "fold": 63.8,
        "call": 36.2
      }
    },
    "A4s": {
      "weight": 100,
      "actions": {
        "fold": 92.6,
        "call": 7.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "call": 22.4,
        "allin": 77.6
      }
    },
    "KQs": {
      "weight": 100,
      "actions": {
        "fold": 77.4,
        "call": 22.6
      }
    },
    "KJs": {
      "weight": 100,
      "actions": {
        "fold": 80,
        "call": 20
      }
    },
    "KTs": {
      "weight": 100,
      "actions": {
        "fold": 91.8,
        "call": 8.2
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "call": 78.6,
        "allin": 21.4
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "call": 87.4,
        "allin": 12.6
      }
    },
    "JTs": {
      "weight": 100,
      "actions": {
        "fold": 84.6,
        "call": 15.4
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 25.8,
        "call": 74.2
      }
    },
    "T9s": {
      "weight": 100,
      "actions": {
        "fold": 88.8,
        "call": 11.2
      }
    },
    "87s": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "call": 10.6
      }
    },
    "76s": {
      "weight": 100,
      "actions": {
        "fold": 83.4,
        "call": 16.6
      }
    },
    "65s": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "54s": {
      "weight": 100,
      "actions": {
        "fold": 64.6,
        "call": 35.4
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb BB 21.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 34.4,
        "allin": 65.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 93.6,
        "allin": 6.4
      }
    }
  },
  "UTG 2.5bb BTN 8.5bb SB 21.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 34.6,
        "allin": 65.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB Call UTG": {
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 7.8,
        "call": 92.2
      }
    }
  },
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB FOLD UTG": {
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 67.2,
        "call": 32.8
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 28.6,
        "call": 71.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 7.8,
        "call": 92.2
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 30,
        "call": 70
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 46.2,
        "allin": 53.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 58.4,
        "allin": 41.6
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB Call UTG": {
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 7,
        "call": 93
      }
    }
  },
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB FOLD UTG": {
    "66": {
      "weight": 100,
      "actions": {
        "fold": 98.6,
        "call": 1.4
      }
    },
    "77": {
      "weight": 100,
      "actions": {
        "fold": 99.4,
        "call": 0.6
      }
    },
    "88": {
      "weight": 100,
      "actions": {
        "fold": 97,
        "call": 3
      }
    },
    "99": {
      "weight": 100,
      "actions": {
        "fold": 95.8,
        "call": 4.2
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "fold": 69.4,
        "call": 30.6
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 26.4,
        "call": 73.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "fold": 63.2,
        "call": 36.8
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 7,
        "call": 93
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 33.4,
        "call": 66.6
      }
    },
    "TT": {
      "weight": 100,
      "actions": {
        "fold": 43,
        "call": 57
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BB 21.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 31.2,
        "allin": 68.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 93.4,
        "allin": 6.6
      }
    }
  },
  "UTG 2.5bb CO 8.5bb BTN 20.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 29.6,
        "allin": 70.4
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 89.4,
        "allin": 10.6
      }
    }
  },
  "UTG 2.5bb CO 8.5bb SB 21.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 32.8,
        "allin": 67.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 86,
        "allin": 14
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BB 21.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 34.8,
        "allin": 65.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 86.8,
        "allin": 13.2
      }
    }
  },
  "UTG 2.5bb MP 8.5bb BTN 20.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 30.8,
        "allin": 69.2
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb MP 8.5bb CO 20.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 31,
        "allin": 69
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    }
  },
  "UTG 2.5bb MP 8.5bb SB 21.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 41.4,
        "allin": 58.6
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "JJ": {
      "weight": 100,
      "actions": {
        "fold": 93.2,
        "allin": 6.8
      }
    }
  },
  "UTG 2.5bb SB 11.0bb BB 22.0bb UTG": {
    "AA": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKs": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "AKo": {
      "weight": 100,
      "actions": {
        "fold": 40.2,
        "allin": 59.8
      }
    },
    "KK": {
      "weight": 100,
      "actions": {
        "allin": 100
      }
    },
    "QQ": {
      "weight": 100,
      "actions": {
        "fold": 90.8,
        "allin": 9.2
      }
    }
  }
};

export const SIXMAX_DEEPFOLD_LINE_KEYS = {
  "CO 2.5bb BTN Call BB": "BB-squeeze-CO-BTN",
  "MP 2.5bb BTN Call BB": "BB-squeeze-MP-BTN",
  "UTG 2.5bb BTN Call BB": "BB-squeeze-UTG-BTN",
  "CO 2.5bb BTN Call SB": "SB-squeeze-CO-BTN",
  "MP 2.5bb BTN Call SB": "SB-squeeze-MP-BTN",
  "UTG 2.5bb BTN Call SB": "SB-squeeze-UTG-BTN",
  "BTN 2.5bb SB 11.0bb BB": "BB-cold-vs-3bet-SB",
  "CO 2.5bb BTN 8.5bb BB": "BB-cold-vs-3bet-BTN",
  "CO 2.5bb BTN Call SB 13.0bb BB": "BB-vs-squeeze-SB",
  "CO 2.5bb SB 11.0bb BB": "BB-cold-vs-3bet-SB",
  "MP 2.5bb BTN 8.5bb BB": "BB-cold-vs-3bet-BTN",
  "MP 2.5bb BTN Call SB 13.0bb BB": "BB-vs-squeeze-SB",
  "MP 2.5bb CO 8.5bb BB": "BB-cold-vs-3bet-CO",
  "MP 2.5bb SB 11.0bb BB": "BB-cold-vs-3bet-SB",
  "UTG 2.5bb BTN 8.5bb BB": "BB-cold-vs-3bet-BTN",
  "UTG 2.5bb BTN Call SB 13.0bb BB": "BB-vs-squeeze-SB",
  "UTG 2.5bb CO 8.5bb BB": "BB-cold-vs-3bet-CO",
  "UTG 2.5bb MP 8.5bb BB": "BB-cold-vs-3bet-MP",
  "UTG 2.5bb SB 11.0bb BB": "BB-cold-vs-3bet-SB",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN": "BTN-vs-squeeze-BB",
  "CO 2.5bb BTN Call BB 13.0bb CO FOLD BTN": "BTN-vs-squeeze-BB",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN": "BTN-vs-squeeze-SB",
  "CO 2.5bb BTN Call SB 13.0bb CO FOLD BTN": "BTN-vs-squeeze-SB",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN": "BTN-vs-squeeze-BB",
  "MP 2.5bb BTN Call BB 13.0bb MP FOLD BTN": "BTN-vs-squeeze-BB",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN": "BTN-vs-squeeze-SB",
  "MP 2.5bb BTN Call SB 13.0bb MP FOLD BTN": "BTN-vs-squeeze-SB",
  "MP 2.5bb CO 8.5bb BTN": "BTN-cold-vs-3bet-CO",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN": "BTN-vs-squeeze-BB",
  "UTG 2.5bb BTN Call BB 13.0bb UTG FOLD BTN": "BTN-vs-squeeze-BB",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN": "BTN-vs-squeeze-SB",
  "UTG 2.5bb BTN Call SB 13.0bb UTG FOLD BTN": "BTN-vs-squeeze-SB",
  "UTG 2.5bb CO 8.5bb BTN": "BTN-cold-vs-3bet-CO",
  "UTG 2.5bb MP 8.5bb BTN": "BTN-cold-vs-3bet-MP",
  "CO 2.5bb BTN Call BB 13.0bb CO": "CO-vs-squeeze-BB",
  "CO 2.5bb BTN Call SB 13.0bb CO": "CO-vs-squeeze-SB",
  "UTG 2.5bb MP 8.5bb CO": "CO-cold-vs-3bet-MP",
  "MP 2.5bb BTN Call BB 13.0bb MP": "MP-vs-squeeze-BB",
  "MP 2.5bb BTN Call SB 13.0bb MP": "MP-vs-squeeze-SB",
  "CO 2.5bb BTN 8.5bb SB": "SB-cold-vs-3bet-BTN",
  "MP 2.5bb BTN 8.5bb SB": "SB-cold-vs-3bet-BTN",
  "MP 2.5bb CO 8.5bb SB": "SB-cold-vs-3bet-CO",
  "UTG 2.5bb BTN 8.5bb SB": "SB-cold-vs-3bet-BTN",
  "UTG 2.5bb CO 8.5bb SB": "SB-cold-vs-3bet-CO",
  "UTG 2.5bb MP 8.5bb SB": "SB-cold-vs-3bet-MP",
  "UTG 2.5bb BTN Call BB 13.0bb UTG": "UTG-vs-squeeze-BB",
  "UTG 2.5bb BTN Call SB 13.0bb UTG": "UTG-vs-squeeze-SB",
  "BTN 2.5bb BB 11.0bb BTN 24.0bb BB": "BB-vs-4bet-BTN",
  "CO 2.5bb BB 11.0bb CO 24.0bb BB": "BB-vs-4bet-CO",
  "CO 2.5bb BTN 8.5bb SB 21.0bb BB": "BB-vs-4bet-SB",
  "CO 2.5bb BTN Call BB 13.0bb CO 25.0bb BTN FOLD BB": "BB-vs-4bet-CO",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB": "BB-vs-4bet-BTN",
  "CO 2.5bb BTN Call BB 13.0bb CO FOLD BTN AllIn BB": "BB-vs-4bet-BTN",
  "MP 2.5bb BB 11.0bb MP 24.0bb BB": "BB-vs-4bet-MP",
  "MP 2.5bb BTN 8.5bb SB 21.0bb BB": "BB-vs-4bet-SB",
  "MP 2.5bb BTN Call BB 13.0bb MP 25.0bb BTN FOLD BB": "BB-vs-4bet-MP",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB": "BB-vs-4bet-BTN",
  "MP 2.5bb BTN Call BB 13.0bb MP FOLD BTN AllIn BB": "BB-vs-4bet-BTN",
  "MP 2.5bb CO 8.5bb BTN 20.0bb BB": "BB-vs-4bet-BTN",
  "MP 2.5bb CO 8.5bb SB 21.0bb BB": "BB-vs-4bet-SB",
  "SB 3.0bb BB 9.0bb SB 22.0bb BB": "BB-vs-4bet-SB",
  "UTG 2.5bb BB 11.0bb UTG 24.0bb BB": "BB-vs-4bet-UTG",
  "UTG 2.5bb BTN 8.5bb SB 21.0bb BB": "BB-vs-4bet-SB",
  "UTG 2.5bb BTN Call BB 13.0bb UTG 25.0bb BTN FOLD BB": "BB-vs-4bet-UTG",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB": "BB-vs-4bet-BTN",
  "UTG 2.5bb BTN Call BB 13.0bb UTG FOLD BTN AllIn BB": "BB-vs-4bet-BTN",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb BB": "BB-vs-4bet-BTN",
  "UTG 2.5bb CO 8.5bb SB 21.0bb BB": "BB-vs-4bet-SB",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb BB": "BB-vs-4bet-BTN",
  "UTG 2.5bb MP 8.5bb CO 20.0bb BB": "BB-vs-4bet-CO",
  "UTG 2.5bb MP 8.5bb SB 21.0bb BB": "BB-vs-4bet-SB",
  "BTN 2.5bb SB 11.0bb BB 22.0bb BTN": "BTN-vs-4bet-BB",
  "CO 2.5bb BTN 8.5bb BB 21.0bb CO FOLD BTN": "BTN-vs-4bet-BB",
  "CO 2.5bb BTN 8.5bb CO 22.0bb BTN": "BTN-vs-4bet-CO",
  "CO 2.5bb BTN 8.5bb SB 21.0bb CO FOLD BTN": "BTN-vs-4bet-SB",
  "CO 2.5bb BTN Call BB 13.0bb CO 25.0bb BTN": "BTN-vs-4bet-CO",
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO FOLD BTN": "BTN-vs-4bet-BB",
  "CO 2.5bb BTN Call SB 13.0bb CO 25.0bb BTN": "BTN-vs-4bet-CO",
  "MP 2.5bb BTN 8.5bb BB 21.0bb MP FOLD BTN": "BTN-vs-4bet-BB",
  "MP 2.5bb BTN 8.5bb MP 22.0bb BTN": "BTN-vs-4bet-MP",
  "MP 2.5bb BTN 8.5bb SB 21.0bb MP FOLD BTN": "BTN-vs-4bet-SB",
  "MP 2.5bb BTN Call BB 13.0bb MP 25.0bb BTN": "BTN-vs-4bet-MP",
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP FOLD BTN": "BTN-vs-4bet-BB",
  "MP 2.5bb BTN Call SB 13.0bb MP 25.0bb BTN": "BTN-vs-4bet-MP",
  "UTG 2.5bb BTN 8.5bb BB 21.0bb UTG FOLD BTN": "BTN-vs-4bet-BB",
  "UTG 2.5bb BTN 8.5bb SB 21.0bb UTG FOLD BTN": "BTN-vs-4bet-SB",
  "UTG 2.5bb BTN 8.5bb UTG 22.0bb BTN": "BTN-vs-4bet-UTG",
  "UTG 2.5bb BTN Call BB 13.0bb UTG 25.0bb BTN": "BTN-vs-4bet-UTG",
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG FOLD BTN": "BTN-vs-4bet-BB",
  "UTG 2.5bb BTN Call SB 13.0bb UTG 25.0bb BTN": "BTN-vs-4bet-UTG",
  "UTG 2.5bb MP 8.5bb CO 20.0bb BTN": "BTN-vs-4bet-CO",
  "CO 2.5bb BTN 8.5bb BB 21.0bb CO": "CO-vs-4bet-BB",
  "CO 2.5bb BTN 8.5bb SB 21.0bb CO": "CO-vs-4bet-SB",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB Call CO": "CO-vs-4bet-BTN",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB FOLD CO": "CO-vs-4bet-BTN",
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO": "CO-vs-4bet-BB",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB Call CO": "CO-vs-4bet-BTN",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB FOLD CO": "CO-vs-4bet-BTN",
  "CO 2.5bb SB 11.0bb BB 22.0bb CO": "CO-vs-4bet-BB",
  "MP 2.5bb CO 8.5bb BB 21.0bb MP FOLD CO": "CO-vs-4bet-BB",
  "MP 2.5bb CO 8.5bb BTN 20.0bb MP FOLD CO": "CO-vs-4bet-BTN",
  "MP 2.5bb CO 8.5bb MP 22.0bb CO": "CO-vs-4bet-MP",
  "MP 2.5bb CO 8.5bb SB 21.0bb MP FOLD CO": "CO-vs-4bet-SB",
  "UTG 2.5bb CO 8.5bb BB 21.0bb UTG FOLD CO": "CO-vs-4bet-BB",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb UTG FOLD CO": "CO-vs-4bet-BTN",
  "UTG 2.5bb CO 8.5bb SB 21.0bb UTG FOLD CO": "CO-vs-4bet-SB",
  "UTG 2.5bb CO 8.5bb UTG 22.0bb CO": "CO-vs-4bet-UTG",
  "MP 2.5bb BTN 8.5bb BB 21.0bb MP": "MP-vs-4bet-BB",
  "MP 2.5bb BTN 8.5bb SB 21.0bb MP": "MP-vs-4bet-SB",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB Call MP": "MP-vs-4bet-BTN",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB FOLD MP": "MP-vs-4bet-BTN",
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP": "MP-vs-4bet-BB",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB Call MP": "MP-vs-4bet-BTN",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB FOLD MP": "MP-vs-4bet-BTN",
  "MP 2.5bb CO 8.5bb BB 21.0bb MP": "MP-vs-4bet-BB",
  "MP 2.5bb CO 8.5bb BTN 20.0bb MP": "MP-vs-4bet-BTN",
  "MP 2.5bb CO 8.5bb SB 21.0bb MP": "MP-vs-4bet-SB",
  "MP 2.5bb SB 11.0bb BB 22.0bb MP": "MP-vs-4bet-BB",
  "UTG 2.5bb MP 8.5bb BB 21.0bb UTG FOLD MP": "MP-vs-4bet-BB",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb UTG FOLD MP": "MP-vs-4bet-BTN",
  "UTG 2.5bb MP 8.5bb CO 20.0bb UTG FOLD MP": "MP-vs-4bet-CO",
  "UTG 2.5bb MP 8.5bb SB 21.0bb UTG FOLD MP": "MP-vs-4bet-SB",
  "UTG 2.5bb MP 8.5bb UTG 22.0bb MP": "MP-vs-4bet-UTG",
  "BTN 2.5bb SB 11.0bb BB 22.0bb BTN FOLD SB": "SB-vs-4bet-BB",
  "BTN 2.5bb SB 11.0bb BTN 24.0bb SB": "SB-vs-4bet-BTN",
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO FOLD BTN FOLD SB": "SB-vs-4bet-BB",
  "CO 2.5bb BTN Call SB 13.0bb CO 25.0bb BTN FOLD SB": "SB-vs-4bet-CO",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB": "SB-vs-4bet-BTN",
  "CO 2.5bb BTN Call SB 13.0bb CO FOLD BTN AllIn SB": "SB-vs-4bet-BTN",
  "CO 2.5bb SB 11.0bb BB 22.0bb CO FOLD SB": "SB-vs-4bet-BB",
  "CO 2.5bb SB 11.0bb CO 24.0bb SB": "SB-vs-4bet-CO",
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP FOLD BTN FOLD SB": "SB-vs-4bet-BB",
  "MP 2.5bb BTN Call SB 13.0bb MP 25.0bb BTN FOLD SB": "SB-vs-4bet-MP",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB": "SB-vs-4bet-BTN",
  "MP 2.5bb BTN Call SB 13.0bb MP FOLD BTN AllIn SB": "SB-vs-4bet-BTN",
  "MP 2.5bb CO 8.5bb BTN 20.0bb SB": "SB-vs-4bet-BTN",
  "MP 2.5bb SB 11.0bb BB 22.0bb MP FOLD SB": "SB-vs-4bet-BB",
  "MP 2.5bb SB 11.0bb MP 24.0bb SB": "SB-vs-4bet-MP",
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG FOLD BTN FOLD SB": "SB-vs-4bet-BB",
  "UTG 2.5bb BTN Call SB 13.0bb UTG 25.0bb BTN FOLD SB": "SB-vs-4bet-UTG",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB": "SB-vs-4bet-BTN",
  "UTG 2.5bb BTN Call SB 13.0bb UTG FOLD BTN AllIn SB": "SB-vs-4bet-BTN",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb SB": "SB-vs-4bet-BTN",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb SB": "SB-vs-4bet-BTN",
  "UTG 2.5bb MP 8.5bb CO 20.0bb SB": "SB-vs-4bet-CO",
  "UTG 2.5bb SB 11.0bb BB 22.0bb UTG FOLD SB": "SB-vs-4bet-BB",
  "UTG 2.5bb SB 11.0bb UTG 24.0bb SB": "SB-vs-4bet-UTG",
  "UTG 2.5bb BTN 8.5bb BB 21.0bb UTG": "UTG-vs-4bet-BB",
  "UTG 2.5bb BTN 8.5bb SB 21.0bb UTG": "UTG-vs-4bet-SB",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB Call UTG": "UTG-vs-4bet-BTN",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB FOLD UTG": "UTG-vs-4bet-BTN",
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG": "UTG-vs-4bet-BB",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB Call UTG": "UTG-vs-4bet-BTN",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB FOLD UTG": "UTG-vs-4bet-BTN",
  "UTG 2.5bb CO 8.5bb BB 21.0bb UTG": "UTG-vs-4bet-BB",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb UTG": "UTG-vs-4bet-BTN",
  "UTG 2.5bb CO 8.5bb SB 21.0bb UTG": "UTG-vs-4bet-SB",
  "UTG 2.5bb MP 8.5bb BB 21.0bb UTG": "UTG-vs-4bet-BB",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb UTG": "UTG-vs-4bet-BTN",
  "UTG 2.5bb MP 8.5bb CO 20.0bb UTG": "UTG-vs-4bet-CO",
  "UTG 2.5bb MP 8.5bb SB 21.0bb UTG": "UTG-vs-4bet-SB",
  "UTG 2.5bb SB 11.0bb BB 22.0bb UTG": "UTG-vs-4bet-BB"
};

export const SIXMAX_DEEPFOLD_LINE_SOURCE_PATHS = {
  "CO 2.5bb BTN Call BB": "vs_Open/BB/CO_2.5bb_BTN_Call_BB.json",
  "MP 2.5bb BTN Call BB": "vs_Open/BB/MP_2.5bb_BTN_Call_BB.json",
  "UTG 2.5bb BTN Call BB": "vs_Open/BB/UTG_2.5bb_BTN_Call_BB.json",
  "CO 2.5bb BTN Call SB": "vs_Open/SB/CO_2.5bb_BTN_Call_SB.json",
  "MP 2.5bb BTN Call SB": "vs_Open/SB/MP_2.5bb_BTN_Call_SB.json",
  "UTG 2.5bb BTN Call SB": "vs_Open/SB/UTG_2.5bb_BTN_Call_SB.json",
  "BTN 2.5bb SB 11.0bb BB": "vs_3B/BB/BTN_2.5bb_SB_11.0bb_BB.json",
  "CO 2.5bb BTN 8.5bb BB": "vs_3B/BB/CO_2.5bb_BTN_8.5bb_BB.json",
  "CO 2.5bb BTN Call SB 13.0bb BB": "vs_3B/BB/CO_2.5bb_BTN_Call_SB_13.0bb_BB.json",
  "CO 2.5bb SB 11.0bb BB": "vs_3B/BB/CO_2.5bb_SB_11.0bb_BB.json",
  "MP 2.5bb BTN 8.5bb BB": "vs_3B/BB/MP_2.5bb_BTN_8.5bb_BB.json",
  "MP 2.5bb BTN Call SB 13.0bb BB": "vs_3B/BB/MP_2.5bb_BTN_Call_SB_13.0bb_BB.json",
  "MP 2.5bb CO 8.5bb BB": "vs_3B/BB/MP_2.5bb_CO_8.5bb_BB.json",
  "MP 2.5bb SB 11.0bb BB": "vs_3B/BB/MP_2.5bb_SB_11.0bb_BB.json",
  "UTG 2.5bb BTN 8.5bb BB": "vs_3B/BB/UTG_2.5bb_BTN_8.5bb_BB.json",
  "UTG 2.5bb BTN Call SB 13.0bb BB": "vs_3B/BB/UTG_2.5bb_BTN_Call_SB_13.0bb_BB.json",
  "UTG 2.5bb CO 8.5bb BB": "vs_3B/BB/UTG_2.5bb_CO_8.5bb_BB.json",
  "UTG 2.5bb MP 8.5bb BB": "vs_3B/BB/UTG_2.5bb_MP_8.5bb_BB.json",
  "UTG 2.5bb SB 11.0bb BB": "vs_3B/BB/UTG_2.5bb_SB_11.0bb_BB.json",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN": "vs_3B/BTN/CO_2.5bb_BTN_Call_BB_13.0bb_CO_Call_BTN.json",
  "CO 2.5bb BTN Call BB 13.0bb CO FOLD BTN": "vs_3B/BTN/CO_2.5bb_BTN_Call_BB_13.0bb_CO_FOLD_BTN.json",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN": "vs_3B/BTN/CO_2.5bb_BTN_Call_SB_13.0bb_CO_Call_BTN.json",
  "CO 2.5bb BTN Call SB 13.0bb CO FOLD BTN": "vs_3B/BTN/CO_2.5bb_BTN_Call_SB_13.0bb_CO_FOLD_BTN.json",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN": "vs_3B/BTN/MP_2.5bb_BTN_Call_BB_13.0bb_MP_Call_BTN.json",
  "MP 2.5bb BTN Call BB 13.0bb MP FOLD BTN": "vs_3B/BTN/MP_2.5bb_BTN_Call_BB_13.0bb_MP_FOLD_BTN.json",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN": "vs_3B/BTN/MP_2.5bb_BTN_Call_SB_13.0bb_MP_Call_BTN.json",
  "MP 2.5bb BTN Call SB 13.0bb MP FOLD BTN": "vs_3B/BTN/MP_2.5bb_BTN_Call_SB_13.0bb_MP_FOLD_BTN.json",
  "MP 2.5bb CO 8.5bb BTN": "vs_3B/BTN/MP_2.5bb_CO_8.5bb_BTN.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN": "vs_3B/BTN/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_Call_BTN.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG FOLD BTN": "vs_3B/BTN/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_FOLD_BTN.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN": "vs_3B/BTN/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_Call_BTN.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG FOLD BTN": "vs_3B/BTN/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_FOLD_BTN.json",
  "UTG 2.5bb CO 8.5bb BTN": "vs_3B/BTN/UTG_2.5bb_CO_8.5bb_BTN.json",
  "UTG 2.5bb MP 8.5bb BTN": "vs_3B/BTN/UTG_2.5bb_MP_8.5bb_BTN.json",
  "CO 2.5bb BTN Call BB 13.0bb CO": "vs_3B/CO/CO_2.5bb_BTN_Call_BB_13.0bb_CO.json",
  "CO 2.5bb BTN Call SB 13.0bb CO": "vs_3B/CO/CO_2.5bb_BTN_Call_SB_13.0bb_CO.json",
  "UTG 2.5bb MP 8.5bb CO": "vs_3B/CO/UTG_2.5bb_MP_8.5bb_CO.json",
  "MP 2.5bb BTN Call BB 13.0bb MP": "vs_3B/MP/MP_2.5bb_BTN_Call_BB_13.0bb_MP.json",
  "MP 2.5bb BTN Call SB 13.0bb MP": "vs_3B/MP/MP_2.5bb_BTN_Call_SB_13.0bb_MP.json",
  "CO 2.5bb BTN 8.5bb SB": "vs_3B/SB/CO_2.5bb_BTN_8.5bb_SB.json",
  "MP 2.5bb BTN 8.5bb SB": "vs_3B/SB/MP_2.5bb_BTN_8.5bb_SB.json",
  "MP 2.5bb CO 8.5bb SB": "vs_3B/SB/MP_2.5bb_CO_8.5bb_SB.json",
  "UTG 2.5bb BTN 8.5bb SB": "vs_3B/SB/UTG_2.5bb_BTN_8.5bb_SB.json",
  "UTG 2.5bb CO 8.5bb SB": "vs_3B/SB/UTG_2.5bb_CO_8.5bb_SB.json",
  "UTG 2.5bb MP 8.5bb SB": "vs_3B/SB/UTG_2.5bb_MP_8.5bb_SB.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG": "vs_3B/UTG/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG": "vs_3B/UTG/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG.json",
  "BTN 2.5bb BB 11.0bb BTN 24.0bb BB": "vs_4B/BB/BTN_2.5bb_BB_11.0bb_BTN_24.0bb_BB.json",
  "CO 2.5bb BB 11.0bb CO 24.0bb BB": "vs_4B/BB/CO_2.5bb_BB_11.0bb_CO_24.0bb_BB.json",
  "CO 2.5bb BTN 8.5bb SB 21.0bb BB": "vs_4B/BB/CO_2.5bb_BTN_8.5bb_SB_21.0bb_BB.json",
  "CO 2.5bb BTN Call BB 13.0bb CO 25.0bb BTN FOLD BB": "vs_4B/BB/CO_2.5bb_BTN_Call_BB_13.0bb_CO_25.0bb_BTN_FOLD_BB.json",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB": "vs_4B/BB/CO_2.5bb_BTN_Call_BB_13.0bb_CO_Call_BTN_AllIn_BB.json",
  "CO 2.5bb BTN Call BB 13.0bb CO FOLD BTN AllIn BB": "vs_4B/BB/CO_2.5bb_BTN_Call_BB_13.0bb_CO_FOLD_BTN_AllIn_BB.json",
  "MP 2.5bb BB 11.0bb MP 24.0bb BB": "vs_4B/BB/MP_2.5bb_BB_11.0bb_MP_24.0bb_BB.json",
  "MP 2.5bb BTN 8.5bb SB 21.0bb BB": "vs_4B/BB/MP_2.5bb_BTN_8.5bb_SB_21.0bb_BB.json",
  "MP 2.5bb BTN Call BB 13.0bb MP 25.0bb BTN FOLD BB": "vs_4B/BB/MP_2.5bb_BTN_Call_BB_13.0bb_MP_25.0bb_BTN_FOLD_BB.json",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB": "vs_4B/BB/MP_2.5bb_BTN_Call_BB_13.0bb_MP_Call_BTN_AllIn_BB.json",
  "MP 2.5bb BTN Call BB 13.0bb MP FOLD BTN AllIn BB": "vs_4B/BB/MP_2.5bb_BTN_Call_BB_13.0bb_MP_FOLD_BTN_AllIn_BB.json",
  "MP 2.5bb CO 8.5bb BTN 20.0bb BB": "vs_4B/BB/MP_2.5bb_CO_8.5bb_BTN_20.0bb_BB.json",
  "MP 2.5bb CO 8.5bb SB 21.0bb BB": "vs_4B/BB/MP_2.5bb_CO_8.5bb_SB_21.0bb_BB.json",
  "SB 3.0bb BB 9.0bb SB 22.0bb BB": "vs_4B/BB/SB_3.0bb_BB_9.0bb_SB_22.0bb_BB.json",
  "UTG 2.5bb BB 11.0bb UTG 24.0bb BB": "vs_4B/BB/UTG_2.5bb_BB_11.0bb_UTG_24.0bb_BB.json",
  "UTG 2.5bb BTN 8.5bb SB 21.0bb BB": "vs_4B/BB/UTG_2.5bb_BTN_8.5bb_SB_21.0bb_BB.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG 25.0bb BTN FOLD BB": "vs_4B/BB/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_25.0bb_BTN_FOLD_BB.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB": "vs_4B/BB/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_Call_BTN_AllIn_BB.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG FOLD BTN AllIn BB": "vs_4B/BB/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_FOLD_BTN_AllIn_BB.json",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb BB": "vs_4B/BB/UTG_2.5bb_CO_8.5bb_BTN_20.0bb_BB.json",
  "UTG 2.5bb CO 8.5bb SB 21.0bb BB": "vs_4B/BB/UTG_2.5bb_CO_8.5bb_SB_21.0bb_BB.json",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb BB": "vs_4B/BB/UTG_2.5bb_MP_8.5bb_BTN_20.0bb_BB.json",
  "UTG 2.5bb MP 8.5bb CO 20.0bb BB": "vs_4B/BB/UTG_2.5bb_MP_8.5bb_CO_20.0bb_BB.json",
  "UTG 2.5bb MP 8.5bb SB 21.0bb BB": "vs_4B/BB/UTG_2.5bb_MP_8.5bb_SB_21.0bb_BB.json",
  "BTN 2.5bb SB 11.0bb BB 22.0bb BTN": "vs_4B/BTN/BTN_2.5bb_SB_11.0bb_BB_22.0bb_BTN.json",
  "CO 2.5bb BTN 8.5bb BB 21.0bb CO FOLD BTN": "vs_4B/BTN/CO_2.5bb_BTN_8.5bb_BB_21.0bb_CO_FOLD_BTN.json",
  "CO 2.5bb BTN 8.5bb CO 22.0bb BTN": "vs_4B/BTN/CO_2.5bb_BTN_8.5bb_CO_22.0bb_BTN.json",
  "CO 2.5bb BTN 8.5bb SB 21.0bb CO FOLD BTN": "vs_4B/BTN/CO_2.5bb_BTN_8.5bb_SB_21.0bb_CO_FOLD_BTN.json",
  "CO 2.5bb BTN Call BB 13.0bb CO 25.0bb BTN": "vs_4B/BTN/CO_2.5bb_BTN_Call_BB_13.0bb_CO_25.0bb_BTN.json",
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO FOLD BTN": "vs_4B/BTN/CO_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_CO_FOLD_BTN.json",
  "CO 2.5bb BTN Call SB 13.0bb CO 25.0bb BTN": "vs_4B/BTN/CO_2.5bb_BTN_Call_SB_13.0bb_CO_25.0bb_BTN.json",
  "MP 2.5bb BTN 8.5bb BB 21.0bb MP FOLD BTN": "vs_4B/BTN/MP_2.5bb_BTN_8.5bb_BB_21.0bb_MP_FOLD_BTN.json",
  "MP 2.5bb BTN 8.5bb MP 22.0bb BTN": "vs_4B/BTN/MP_2.5bb_BTN_8.5bb_MP_22.0bb_BTN.json",
  "MP 2.5bb BTN 8.5bb SB 21.0bb MP FOLD BTN": "vs_4B/BTN/MP_2.5bb_BTN_8.5bb_SB_21.0bb_MP_FOLD_BTN.json",
  "MP 2.5bb BTN Call BB 13.0bb MP 25.0bb BTN": "vs_4B/BTN/MP_2.5bb_BTN_Call_BB_13.0bb_MP_25.0bb_BTN.json",
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP FOLD BTN": "vs_4B/BTN/MP_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_MP_FOLD_BTN.json",
  "MP 2.5bb BTN Call SB 13.0bb MP 25.0bb BTN": "vs_4B/BTN/MP_2.5bb_BTN_Call_SB_13.0bb_MP_25.0bb_BTN.json",
  "UTG 2.5bb BTN 8.5bb BB 21.0bb UTG FOLD BTN": "vs_4B/BTN/UTG_2.5bb_BTN_8.5bb_BB_21.0bb_UTG_FOLD_BTN.json",
  "UTG 2.5bb BTN 8.5bb SB 21.0bb UTG FOLD BTN": "vs_4B/BTN/UTG_2.5bb_BTN_8.5bb_SB_21.0bb_UTG_FOLD_BTN.json",
  "UTG 2.5bb BTN 8.5bb UTG 22.0bb BTN": "vs_4B/BTN/UTG_2.5bb_BTN_8.5bb_UTG_22.0bb_BTN.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG 25.0bb BTN": "vs_4B/BTN/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_25.0bb_BTN.json",
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG FOLD BTN": "vs_4B/BTN/UTG_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_UTG_FOLD_BTN.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG 25.0bb BTN": "vs_4B/BTN/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_25.0bb_BTN.json",
  "UTG 2.5bb MP 8.5bb CO 20.0bb BTN": "vs_4B/BTN/UTG_2.5bb_MP_8.5bb_CO_20.0bb_BTN.json",
  "CO 2.5bb BTN 8.5bb BB 21.0bb CO": "vs_4B/CO/CO_2.5bb_BTN_8.5bb_BB_21.0bb_CO.json",
  "CO 2.5bb BTN 8.5bb SB 21.0bb CO": "vs_4B/CO/CO_2.5bb_BTN_8.5bb_SB_21.0bb_CO.json",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB Call CO": "vs_4B/CO/CO_2.5bb_BTN_Call_BB_13.0bb_CO_Call_BTN_AllIn_BB_Call_CO.json",
  "CO 2.5bb BTN Call BB 13.0bb CO Call BTN AllIn BB FOLD CO": "vs_4B/CO/CO_2.5bb_BTN_Call_BB_13.0bb_CO_Call_BTN_AllIn_BB_FOLD_CO.json",
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO": "vs_4B/CO/CO_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_CO.json",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB Call CO": "vs_4B/CO/CO_2.5bb_BTN_Call_SB_13.0bb_CO_Call_BTN_AllIn_SB_Call_CO.json",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB FOLD CO": "vs_4B/CO/CO_2.5bb_BTN_Call_SB_13.0bb_CO_Call_BTN_AllIn_SB_FOLD_CO.json",
  "CO 2.5bb SB 11.0bb BB 22.0bb CO": "vs_4B/CO/CO_2.5bb_SB_11.0bb_BB_22.0bb_CO.json",
  "MP 2.5bb CO 8.5bb BB 21.0bb MP FOLD CO": "vs_4B/CO/MP_2.5bb_CO_8.5bb_BB_21.0bb_MP_FOLD_CO.json",
  "MP 2.5bb CO 8.5bb BTN 20.0bb MP FOLD CO": "vs_4B/CO/MP_2.5bb_CO_8.5bb_BTN_20.0bb_MP_FOLD_CO.json",
  "MP 2.5bb CO 8.5bb MP 22.0bb CO": "vs_4B/CO/MP_2.5bb_CO_8.5bb_MP_22.0bb_CO.json",
  "MP 2.5bb CO 8.5bb SB 21.0bb MP FOLD CO": "vs_4B/CO/MP_2.5bb_CO_8.5bb_SB_21.0bb_MP_FOLD_CO.json",
  "UTG 2.5bb CO 8.5bb BB 21.0bb UTG FOLD CO": "vs_4B/CO/UTG_2.5bb_CO_8.5bb_BB_21.0bb_UTG_FOLD_CO.json",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb UTG FOLD CO": "vs_4B/CO/UTG_2.5bb_CO_8.5bb_BTN_20.0bb_UTG_FOLD_CO.json",
  "UTG 2.5bb CO 8.5bb SB 21.0bb UTG FOLD CO": "vs_4B/CO/UTG_2.5bb_CO_8.5bb_SB_21.0bb_UTG_FOLD_CO.json",
  "UTG 2.5bb CO 8.5bb UTG 22.0bb CO": "vs_4B/CO/UTG_2.5bb_CO_8.5bb_UTG_22.0bb_CO.json",
  "MP 2.5bb BTN 8.5bb BB 21.0bb MP": "vs_4B/MP/MP_2.5bb_BTN_8.5bb_BB_21.0bb_MP.json",
  "MP 2.5bb BTN 8.5bb SB 21.0bb MP": "vs_4B/MP/MP_2.5bb_BTN_8.5bb_SB_21.0bb_MP.json",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB Call MP": "vs_4B/MP/MP_2.5bb_BTN_Call_BB_13.0bb_MP_Call_BTN_AllIn_BB_Call_MP.json",
  "MP 2.5bb BTN Call BB 13.0bb MP Call BTN AllIn BB FOLD MP": "vs_4B/MP/MP_2.5bb_BTN_Call_BB_13.0bb_MP_Call_BTN_AllIn_BB_FOLD_MP.json",
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP": "vs_4B/MP/MP_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_MP.json",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB Call MP": "vs_4B/MP/MP_2.5bb_BTN_Call_SB_13.0bb_MP_Call_BTN_AllIn_SB_Call_MP.json",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB FOLD MP": "vs_4B/MP/MP_2.5bb_BTN_Call_SB_13.0bb_MP_Call_BTN_AllIn_SB_FOLD_MP.json",
  "MP 2.5bb CO 8.5bb BB 21.0bb MP": "vs_4B/MP/MP_2.5bb_CO_8.5bb_BB_21.0bb_MP.json",
  "MP 2.5bb CO 8.5bb BTN 20.0bb MP": "vs_4B/MP/MP_2.5bb_CO_8.5bb_BTN_20.0bb_MP.json",
  "MP 2.5bb CO 8.5bb SB 21.0bb MP": "vs_4B/MP/MP_2.5bb_CO_8.5bb_SB_21.0bb_MP.json",
  "MP 2.5bb SB 11.0bb BB 22.0bb MP": "vs_4B/MP/MP_2.5bb_SB_11.0bb_BB_22.0bb_MP.json",
  "UTG 2.5bb MP 8.5bb BB 21.0bb UTG FOLD MP": "vs_4B/MP/UTG_2.5bb_MP_8.5bb_BB_21.0bb_UTG_FOLD_MP.json",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb UTG FOLD MP": "vs_4B/MP/UTG_2.5bb_MP_8.5bb_BTN_20.0bb_UTG_FOLD_MP.json",
  "UTG 2.5bb MP 8.5bb CO 20.0bb UTG FOLD MP": "vs_4B/MP/UTG_2.5bb_MP_8.5bb_CO_20.0bb_UTG_FOLD_MP.json",
  "UTG 2.5bb MP 8.5bb SB 21.0bb UTG FOLD MP": "vs_4B/MP/UTG_2.5bb_MP_8.5bb_SB_21.0bb_UTG_FOLD_MP.json",
  "UTG 2.5bb MP 8.5bb UTG 22.0bb MP": "vs_4B/MP/UTG_2.5bb_MP_8.5bb_UTG_22.0bb_MP.json",
  "BTN 2.5bb SB 11.0bb BB 22.0bb BTN FOLD SB": "vs_4B/SB/BTN_2.5bb_SB_11.0bb_BB_22.0bb_BTN_FOLD_SB.json",
  "BTN 2.5bb SB 11.0bb BTN 24.0bb SB": "vs_4B/SB/BTN_2.5bb_SB_11.0bb_BTN_24.0bb_SB.json",
  "CO 2.5bb BTN Call SB 13.0bb BB 25.0bb CO FOLD BTN FOLD SB": "vs_4B/SB/CO_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_CO_FOLD_BTN_FOLD_SB.json",
  "CO 2.5bb BTN Call SB 13.0bb CO 25.0bb BTN FOLD SB": "vs_4B/SB/CO_2.5bb_BTN_Call_SB_13.0bb_CO_25.0bb_BTN_FOLD_SB.json",
  "CO 2.5bb BTN Call SB 13.0bb CO Call BTN AllIn SB": "vs_4B/SB/CO_2.5bb_BTN_Call_SB_13.0bb_CO_Call_BTN_AllIn_SB.json",
  "CO 2.5bb BTN Call SB 13.0bb CO FOLD BTN AllIn SB": "vs_4B/SB/CO_2.5bb_BTN_Call_SB_13.0bb_CO_FOLD_BTN_AllIn_SB.json",
  "CO 2.5bb SB 11.0bb BB 22.0bb CO FOLD SB": "vs_4B/SB/CO_2.5bb_SB_11.0bb_BB_22.0bb_CO_FOLD_SB.json",
  "CO 2.5bb SB 11.0bb CO 24.0bb SB": "vs_4B/SB/CO_2.5bb_SB_11.0bb_CO_24.0bb_SB.json",
  "MP 2.5bb BTN Call SB 13.0bb BB 25.0bb MP FOLD BTN FOLD SB": "vs_4B/SB/MP_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_MP_FOLD_BTN_FOLD_SB.json",
  "MP 2.5bb BTN Call SB 13.0bb MP 25.0bb BTN FOLD SB": "vs_4B/SB/MP_2.5bb_BTN_Call_SB_13.0bb_MP_25.0bb_BTN_FOLD_SB.json",
  "MP 2.5bb BTN Call SB 13.0bb MP Call BTN AllIn SB": "vs_4B/SB/MP_2.5bb_BTN_Call_SB_13.0bb_MP_Call_BTN_AllIn_SB.json",
  "MP 2.5bb BTN Call SB 13.0bb MP FOLD BTN AllIn SB": "vs_4B/SB/MP_2.5bb_BTN_Call_SB_13.0bb_MP_FOLD_BTN_AllIn_SB.json",
  "MP 2.5bb CO 8.5bb BTN 20.0bb SB": "vs_4B/SB/MP_2.5bb_CO_8.5bb_BTN_20.0bb_SB.json",
  "MP 2.5bb SB 11.0bb BB 22.0bb MP FOLD SB": "vs_4B/SB/MP_2.5bb_SB_11.0bb_BB_22.0bb_MP_FOLD_SB.json",
  "MP 2.5bb SB 11.0bb MP 24.0bb SB": "vs_4B/SB/MP_2.5bb_SB_11.0bb_MP_24.0bb_SB.json",
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG FOLD BTN FOLD SB": "vs_4B/SB/UTG_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_UTG_FOLD_BTN_FOLD_SB.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG 25.0bb BTN FOLD SB": "vs_4B/SB/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_25.0bb_BTN_FOLD_SB.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB": "vs_4B/SB/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_Call_BTN_AllIn_SB.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG FOLD BTN AllIn SB": "vs_4B/SB/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_FOLD_BTN_AllIn_SB.json",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb SB": "vs_4B/SB/UTG_2.5bb_CO_8.5bb_BTN_20.0bb_SB.json",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb SB": "vs_4B/SB/UTG_2.5bb_MP_8.5bb_BTN_20.0bb_SB.json",
  "UTG 2.5bb MP 8.5bb CO 20.0bb SB": "vs_4B/SB/UTG_2.5bb_MP_8.5bb_CO_20.0bb_SB.json",
  "UTG 2.5bb SB 11.0bb BB 22.0bb UTG FOLD SB": "vs_4B/SB/UTG_2.5bb_SB_11.0bb_BB_22.0bb_UTG_FOLD_SB.json",
  "UTG 2.5bb SB 11.0bb UTG 24.0bb SB": "vs_4B/SB/UTG_2.5bb_SB_11.0bb_UTG_24.0bb_SB.json",
  "UTG 2.5bb BTN 8.5bb BB 21.0bb UTG": "vs_4B/UTG/UTG_2.5bb_BTN_8.5bb_BB_21.0bb_UTG.json",
  "UTG 2.5bb BTN 8.5bb SB 21.0bb UTG": "vs_4B/UTG/UTG_2.5bb_BTN_8.5bb_SB_21.0bb_UTG.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB Call UTG": "vs_4B/UTG/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_Call_BTN_AllIn_BB_Call_UTG.json",
  "UTG 2.5bb BTN Call BB 13.0bb UTG Call BTN AllIn BB FOLD UTG": "vs_4B/UTG/UTG_2.5bb_BTN_Call_BB_13.0bb_UTG_Call_BTN_AllIn_BB_FOLD_UTG.json",
  "UTG 2.5bb BTN Call SB 13.0bb BB 25.0bb UTG": "vs_4B/UTG/UTG_2.5bb_BTN_Call_SB_13.0bb_BB_25.0bb_UTG.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB Call UTG": "vs_4B/UTG/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_Call_BTN_AllIn_SB_Call_UTG.json",
  "UTG 2.5bb BTN Call SB 13.0bb UTG Call BTN AllIn SB FOLD UTG": "vs_4B/UTG/UTG_2.5bb_BTN_Call_SB_13.0bb_UTG_Call_BTN_AllIn_SB_FOLD_UTG.json",
  "UTG 2.5bb CO 8.5bb BB 21.0bb UTG": "vs_4B/UTG/UTG_2.5bb_CO_8.5bb_BB_21.0bb_UTG.json",
  "UTG 2.5bb CO 8.5bb BTN 20.0bb UTG": "vs_4B/UTG/UTG_2.5bb_CO_8.5bb_BTN_20.0bb_UTG.json",
  "UTG 2.5bb CO 8.5bb SB 21.0bb UTG": "vs_4B/UTG/UTG_2.5bb_CO_8.5bb_SB_21.0bb_UTG.json",
  "UTG 2.5bb MP 8.5bb BB 21.0bb UTG": "vs_4B/UTG/UTG_2.5bb_MP_8.5bb_BB_21.0bb_UTG.json",
  "UTG 2.5bb MP 8.5bb BTN 20.0bb UTG": "vs_4B/UTG/UTG_2.5bb_MP_8.5bb_BTN_20.0bb_UTG.json",
  "UTG 2.5bb MP 8.5bb CO 20.0bb UTG": "vs_4B/UTG/UTG_2.5bb_MP_8.5bb_CO_20.0bb_UTG.json",
  "UTG 2.5bb MP 8.5bb SB 21.0bb UTG": "vs_4B/UTG/UTG_2.5bb_MP_8.5bb_SB_21.0bb_UTG.json",
  "UTG 2.5bb SB 11.0bb BB 22.0bb UTG": "vs_4B/UTG/UTG_2.5bb_SB_11.0bb_BB_22.0bb_UTG.json"
};

export const SIXMAX_DEEPFOLD_SOURCE_COUNTS = {
  "BB-squeeze-CO-BTN": 1,
  "BB-squeeze-MP-BTN": 1,
  "BB-squeeze-UTG-BTN": 1,
  "SB-squeeze-CO-BTN": 1,
  "SB-squeeze-MP-BTN": 1,
  "SB-squeeze-UTG-BTN": 1,
  "BB-cold-vs-3bet-SB": 4,
  "BB-cold-vs-3bet-BTN": 3,
  "BB-vs-squeeze-SB": 3,
  "BB-cold-vs-3bet-CO": 2,
  "BB-cold-vs-3bet-MP": 1,
  "BTN-vs-squeeze-BB": 6,
  "BTN-vs-squeeze-SB": 6,
  "BTN-cold-vs-3bet-CO": 2,
  "BTN-cold-vs-3bet-MP": 1,
  "CO-vs-squeeze-BB": 1,
  "CO-vs-squeeze-SB": 1,
  "CO-cold-vs-3bet-MP": 1,
  "MP-vs-squeeze-BB": 1,
  "MP-vs-squeeze-SB": 1,
  "SB-cold-vs-3bet-BTN": 3,
  "SB-cold-vs-3bet-CO": 2,
  "SB-cold-vs-3bet-MP": 1,
  "UTG-vs-squeeze-BB": 1,
  "UTG-vs-squeeze-SB": 1,
  "BB-vs-4bet-BTN": 10,
  "BB-vs-4bet-CO": 3,
  "BB-vs-4bet-SB": 7,
  "BB-vs-4bet-MP": 2,
  "BB-vs-4bet-UTG": 2,
  "BTN-vs-4bet-BB": 7,
  "BTN-vs-4bet-CO": 4,
  "BTN-vs-4bet-SB": 3,
  "BTN-vs-4bet-MP": 3,
  "BTN-vs-4bet-UTG": 3,
  "CO-vs-4bet-BB": 5,
  "CO-vs-4bet-SB": 3,
  "CO-vs-4bet-BTN": 6,
  "CO-vs-4bet-MP": 1,
  "CO-vs-4bet-UTG": 1,
  "MP-vs-4bet-BB": 5,
  "MP-vs-4bet-SB": 3,
  "MP-vs-4bet-BTN": 6,
  "MP-vs-4bet-CO": 1,
  "MP-vs-4bet-UTG": 1,
  "SB-vs-4bet-BB": 7,
  "SB-vs-4bet-BTN": 10,
  "SB-vs-4bet-CO": 3,
  "SB-vs-4bet-MP": 2,
  "SB-vs-4bet-UTG": 2,
  "UTG-vs-4bet-BB": 5,
  "UTG-vs-4bet-SB": 3,
  "UTG-vs-4bet-BTN": 6,
  "UTG-vs-4bet-CO": 1
};
