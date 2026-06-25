import { allHandCodes, clamp, comboCountForCode, scoreHandCode } from "./poker-core.js";

export const PREFLOP_POLICY_VERSION = "preflop-range-table-v1";

const OPEN_WIDTH = {
  UTG: 0.17,
  HJ: 0.21,
  CO: 0.29,
  BTN: 0.45,
  SB: 0.42,
  BB: 0.08,
};

const DEFEND_WIDTH = {
  UTG: 0.2,
  HJ: 0.22,
  CO: 0.26,
  BTN: 0.31,
  SB: 0.3,
  BB: 0.46,
};

const THREE_BET_WIDTH = {
  UTG: 0.055,
  HJ: 0.065,
  CO: 0.085,
  BTN: 0.11,
  SB: 0.12,
  BB: 0.115,
};

const FOUR_BET_WIDTH = {
  UTG: 0.035,
  HJ: 0.04,
  CO: 0.047,
  BTN: 0.055,
  SB: 0.052,
  BB: 0.045,
};

const sortedHands = allHandCodes()
  .map((code) => ({ code, score: scoreHandCode(code), combos: comboCountForCode(code) }))
  .sort((a, b) => b.score - a.score);

const rangeCache = new Map();

function rangeWeight(width) {
  const key = width.toFixed(4);
  if (rangeCache.has(key)) return rangeCache.get(key);

  const targetCombos = 1326 * clamp(width, 0, 1);
  const weights = {};
  let used = 0;
  for (const item of sortedHands) {
    if (used >= targetCombos) {
      weights[item.code] = 0;
      continue;
    }
    const remaining = targetCombos - used;
    const weight = remaining >= item.combos ? 1 : clamp(remaining / item.combos, 0, 1);
    weights[item.code] = weight < 0.08 ? 0 : weight;
    used += Math.min(item.combos, remaining);
  }
  rangeCache.set(key, weights);
  return weights;
}

function weightAt(code, width) {
  return Number(rangeWeight(width)?.[code] || 0);
}

function isPremium(code) {
  return ["AA", "KK", "QQ", "JJ", "AKs", "AKo"].includes(code);
}

function isNutted(code) {
  return ["AA", "KK", "QQ", "AKs"].includes(code);
}

function normalize(actions) {
  const total = actions.reduce((sum, action) => sum + Math.max(0, action.weight), 0) || 1;
  return actions
    .map((action) => ({
      ...action,
      frequency: clamp(action.weight / total, 0, 1),
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

function stackWidthAdjustment(stackBb) {
  if (stackBb <= 18) return 0.08;
  if (stackBb <= 35) return 0.035;
  if (stackBb >= 180) return -0.025;
  return 0;
}

function openActions({ handCode, position, stackBb }) {
  const width = (OPEN_WIDTH[position] ?? OPEN_WIDTH.CO) + stackWidthAdjustment(stackBb);
  let raise = weightAt(handCode, width);
  if (isPremium(handCode)) raise = Math.max(raise, 0.985);
  if (isNutted(handCode)) raise = 1;
  const fold = 1 - raise;
  return normalize([
    { key: "fold", label: "弃牌", weight: fold, tone: "danger" },
    { key: "raise", label: "Open", weight: raise, tone: "accent" },
  ]);
}

function defendActions({ handCode, position, stackBb }) {
  const defendWidth = (DEFEND_WIDTH[position] ?? DEFEND_WIDTH.CO) + stackWidthAdjustment(stackBb) * 0.6;
  const threeBetWidth = (THREE_BET_WIDTH[position] ?? THREE_BET_WIDTH.CO) + stackWidthAdjustment(stackBb) * 0.35;
  let raise = weightAt(handCode, threeBetWidth);
  let continueFreq = weightAt(handCode, defendWidth);
  if (isNutted(handCode)) {
    raise = Math.max(raise, 0.72);
    continueFreq = 1;
  } else if (isPremium(handCode)) {
    raise = Math.max(raise, 0.58);
    continueFreq = Math.max(continueFreq, 0.94);
  }
  const call = clamp(continueFreq - raise * 0.72, 0, 0.92);
  const fold = clamp(1 - call - raise, 0, 1);
  return normalize([
    { key: "fold", label: "弃牌", weight: fold, tone: "danger" },
    { key: "call", label: "跟注", weight: call, tone: "neutral" },
    { key: "raise", label: "3bet", weight: raise, tone: "accent" },
  ]);
}

function facingThreeBetActions({ handCode, position, stackBb }) {
  const callWidth = clamp((OPEN_WIDTH[position] ?? OPEN_WIDTH.CO) * 0.42 + stackWidthAdjustment(stackBb) * 0.25, 0.055, 0.26);
  const fourBetWidth = (FOUR_BET_WIDTH[position] ?? FOUR_BET_WIDTH.CO) + stackWidthAdjustment(stackBb) * 0.25;
  let raise = weightAt(handCode, fourBetWidth);
  let continueFreq = weightAt(handCode, callWidth);
  if (isNutted(handCode)) {
    raise = Math.max(raise, 0.68);
    continueFreq = 1;
  } else if (isPremium(handCode)) {
    raise = Math.max(raise, 0.44);
    continueFreq = Math.max(continueFreq, 0.9);
  }
  const call = clamp(continueFreq - raise * 0.52, 0, 0.72);
  const fold = clamp(1 - call - raise, 0, 1);
  return normalize([
    { key: "fold", label: "弃牌", weight: fold, tone: "danger" },
    { key: "call", label: "跟注", weight: call, tone: "neutral" },
    { key: "raise", label: "4bet", weight: raise, tone: "strong" },
  ]);
}

function checkOptionActions({ handCode, position, stackBb }) {
  const isoWidth = clamp((OPEN_WIDTH[position] ?? 0.2) * 0.54 + stackWidthAdjustment(stackBb) * 0.3, 0.08, 0.28);
  const bigIsoWidth = clamp(isoWidth * 0.32, 0.025, 0.085);
  let raise = weightAt(handCode, isoWidth);
  let bigRaise = weightAt(handCode, bigIsoWidth);
  if (isPremium(handCode)) {
    raise = Math.max(raise, 0.72);
    bigRaise = Math.max(bigRaise, 0.2);
  }
  const check = clamp(1 - raise - bigRaise, 0.08, 1);
  return normalize([
    { key: "check", label: "过牌", weight: check, tone: "neutral" },
    { key: "raise", label: "隔离加注", weight: raise, tone: "accent" },
    { key: "bet-big", label: "大隔离", weight: bigRaise, tone: "strong" },
  ]);
}

export function preflopStrategyActions({ handCode, position = "CO", context = "unopened", stackBb = 100 } = {}) {
  if (!handCode) return null;
  if (context === "unopened") return openActions({ handCode, position, stackBb });
  if (context === "check-option" || context === "limped-pot" || context === "blind-check") {
    return checkOptionActions({ handCode, position, stackBb });
  }
  if (context === "facing-3bet") return facingThreeBetActions({ handCode, position, stackBb });
  if (context === "facing-open" || context === "blind-defense") return defendActions({ handCode, position, stackBb });
  return openActions({ handCode, position, stackBb });
}
