import { clamp } from "./poker-core.js";

export const HU_PREFLOP_TABLE_VERSION = "hu-100bb-preflop-rangeconverter-calibrated-v2";

// Data subset adapted from AHTOOOXA/poker-charts, MIT License.
// Copyright (c) 2025-2026 Anton Safonov.
// Source: https://github.com/AHTOOOXA/poker-charts
// Coverage: BTN/SB RFI, BB vs SB open, BTN/SB vs BB 3bet.
// The BTN/SB RFI range is extended to the public RangeConverter HU 100bb
// chart width (~78%) because the reusable MIT chart subset is a general
// BTN baseline and is too tight for heads-up small blind first-in play.
// Unlisted hands in covered charts are folds.

function hands(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function makeChart(groups) {
  const chart = {};
  for (const [action, codes] of Object.entries(groups)) {
    for (const code of hands(codes)) {
      chart[code] = action;
    }
  }
  return chart;
}

function addMixed(chart, actionA, actionB, codes) {
  for (const code of hands(codes)) {
    chart[code] = [actionA, actionB];
  }
  return chart;
}

function addWeighted(chart, weights, codes) {
  for (const code of hands(codes)) {
    chart[code] = weights;
  }
  return chart;
}

const HU_BTN_RFI = addMixed(
  makeChart({
    raise: `
      AA KK QQ JJ TT 99 88 77 66 55 44 33 22
      AKs AQs AJs ATs A9s A8s A7s A6s A5s A4s A3s A2s
      KQs KJs KTs K9s K8s K7s K6s K5s K4s K3s K2s
      QJs QTs Q9s Q8s Q7s Q6s Q5s Q4s Q3s Q2s
      JTs J9s J8s J7s J6s J5s
      T9s T8s T7s T6s
      98s 97s 96s
      87s 86s 76s 75s 65s 64s 54s
      AKo AQo AJo ATo A9o A8o A7o A6o A5o A4o
      KQo KJo KTo K9o QJo QTo Q9o Q8o JTo J9o J8o T9o T8o 98o
      K7o A3o K6o A2o Q7o K5o J7o Q6o J4s K4o T5s Q5o J3s K3o
      95s J6o T4s Q4o J2s K2o J5o T3s Q3o T7o 97o 94s J4o
      T2s Q2o 87o 84s 93s J3o T6o 92s J2o 96o 86o 83s 76o
      73s 82s T5o 95o T4o 85o 75o 72s
    `,
  }),
  "raise",
  "fold",
  "K8o 85s 74s 63s 53s 43s",
);

addWeighted(
  HU_BTN_RFI,
  { raise: 0.48, call: 0.42, fold: 0.1 },
  `
    A9o A8o A7o A6o A5o A4o A3o A2o
    K9o K8o K7o K6o K5o K4o K3o K2o
    Q9o Q8o Q7o Q6o Q5o Q4o Q3o Q2o
    J9o J8o J7o J6o J5o J4o J3o J2o
    T8o T7o T6o T5o T4o
    98o 97o 96o 87o 86o 85o 76o 75o
  `,
);

addWeighted(
  HU_BTN_RFI,
  { raise: 0.22, call: 0.53, fold: 0.25 },
  `
    85s 74s 63s 53s 43s
    65o 64o 54o 94o 84o 74o
    T3o 93o 83o 73o 63o 53o 43o
  `,
);

addWeighted(
  HU_BTN_RFI,
  { call: 0.35, fold: 0.65 },
  `
    62s 52s 42s 32s
    T2o 92o 82o 62o 52o 42o
  `,
);

const HU_BB_VS_SB_OPEN = makeChart({
  call: `
    22 33 44 55
    32s 42s 43s 52s 53s 54o 62s 63s 65o 72s 73s 74s 75o
    76o 82s 83s 84s 86o 87o 92s 93s 94s 95s 97o
    A6o A6s A7o A7s A8o A8s A9o A9s ATo
    K2s K3s K4s K5o K5s K6o K6s K7o K7s K8o K8s K9o K9s KJo KTo
    Q2s Q3s Q4s Q5s Q6o Q6s Q7o Q7s Q8o Q8s Q9o Q9s QJo QTo
    J2s J3s J4s J5s J6s J7o J7s J8o J8s J9o J9s JTo
    T2s T3s T4s T5s T8o T8s T9o
  `,
  raise: `
    64s 75s 85s 96s 98o 98s 99
    A2o A2s A3o A3s A4o A4s A5o A5s AJo AJs AQo AQs ATs
    K4o KJs KQo KQs KTs QJs QTs JTs T6s T7s T9s TT
  `,
  allin: "AA KK QQ JJ 88 77 66 AKo AKs",
});

const HU_BB_VS_SB_LIMP = addWeighted(
  makeChart({
    raise: `
      AA KK QQ JJ TT 99 88 77 66 55
      AKs AQs AJs ATs A9s A8s A7s A6s A5s A4s A3s A2s
      KQs KJs KTs K9s K8s K7s K6s K5s
      QJs QTs Q9s Q8s JTs J9s J8s T9s T8s 98s 87s
      AKo AQo AJo ATo A9o KQo KJo KTo QJo QTo JTo
    `,
  }),
  { raise: 0.45, check: 0.55 },
  `
    44 33 22
    K4s K3s K2s Q7s Q6s Q5s Q4s J7s J6s T7s 97s 86s 76s 65s 54s
    A8o A7o A6o A5o A4o A3o A2o K9o K8o Q9o J9o T9o 98o
  `,
);

const HU_BTN_VS_BB_3BET = addMixed(
  makeChart({
    call: `
      22 33 44 55 66 77 88 99 TT
      54s 65s 76s 87s 98s
      A4s A5s A6s A7s A8s A9s ATo ATs AJs AQo AQs
      K8s K9s KTs KJs KQs Q9s QTs QJs J8s J9s JTs T8s T9s
    `,
    allin: "AA KK QQ JJ AKo AKs",
  }),
  "raise",
  "fold",
  "A2s A3s AJo K6s K7s KQo",
);

function normalizeCell(cell, labels, options = {}) {
  const weights = { fold: 0, call: 0, check: 0, raise: 0, jam: 0 };
  const allinKey = options.allinKey || "jam";
  if (!cell) {
    weights[options.defaultKey || "fold"] = 1;
  } else if (typeof cell === "string") {
    weights[cell === "allin" ? allinKey : cell] = 1;
  } else if (Array.isArray(cell)) {
    for (const action of cell) weights[action === "allin" ? allinKey : action] += 0.5;
  } else if (typeof cell === "object") {
    for (const [action, frequency] of Object.entries(cell)) {
      const key = action === "allin" ? allinKey : action;
      if (key in weights) weights[key] += clamp(Number(frequency || 0), 0, 1);
    }
  } else {
    return null;
  }

  return [
    { key: "fold", label: "弃牌", weight: weights.fold, tone: "danger" },
    { key: "call", label: "跟注", weight: weights.call, tone: "neutral" },
    { key: "check", label: "过牌", weight: weights.check, tone: "neutral" },
    { key: "raise", label: labels.raise, weight: weights.raise, tone: "accent" },
    { key: "jam", label: labels.jam, weight: weights.jam, tone: "strong" },
  ]
    .filter((action) => action.weight > 0)
    .map((action) => ({ ...action, frequency: clamp(action.weight, 0, 1) }))
    .sort((a, b) => b.frequency - a.frequency);
}

export function lookupHuPreflopActions({ handCode, position, context, tableSize = 6, stackBb = 100 } = {}) {
  if (!handCode || Number(tableSize) > 2) return null;
  if (stackBb < 60 || stackBb > 140) return null;

  const isButton = position === "SB" || position === "BTN";
  if (isButton && context === "unopened") {
    return normalizeCell(HU_BTN_RFI[handCode], { raise: "Open", jam: "Open jam" });
  }
  if (position === "BB" && (context === "blind-defense" || context === "facing-open")) {
    return normalizeCell(HU_BB_VS_SB_OPEN[handCode], { raise: "3bet", jam: "3bet jam" }, { allinKey: "raise" });
  }
  if (position === "BB" && (context === "check-option" || context === "limped-pot" || context === "blind-check")) {
    return normalizeCell(HU_BB_VS_SB_LIMP[handCode], { raise: "Iso", jam: "Iso jam" }, { allinKey: "raise", defaultKey: "check" });
  }
  if (isButton && context === "facing-3bet") {
    return normalizeCell(HU_BTN_VS_BB_3BET[handCode], { raise: "4bet", jam: "4bet jam" });
  }
  return null;
}
