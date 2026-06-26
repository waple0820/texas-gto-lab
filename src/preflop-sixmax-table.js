import { clamp } from "./poker-core.js";
import { SIXMAX_PEKARSTAS_CHARTS } from "./preflop-sixmax-pekarstas.js";

export const SIXMAX_PREFLOP_TABLE_VERSION = "sixmax-100bb-pekarstas-v1";

const SOURCE_POSITION = {
  UTG: "UTG",
  HJ: "MP",
  MP: "MP",
  CO: "CO",
  BTN: "BTN",
  SB: "SB",
  BB: "BB",
};

function sourcePosition(position) {
  return SOURCE_POSITION[position] || null;
}

function normalizeCell(cell, labels, { literalJam = false } = {}) {
  const weights = { fold: 0, call: 0, raise: 0, jam: 0 };

  function add(action, frequency) {
    const key = action === "allin" ? (literalJam ? "jam" : "raise") : action;
    if (key in weights) weights[key] += frequency;
  }

  if (!cell) {
    weights.fold = 1;
  } else if (typeof cell === "string") {
    add(cell, 1);
  } else if (Array.isArray(cell)) {
    const share = 1 / cell.length;
    for (const action of cell) add(action, share);
  } else if (typeof cell === "object") {
    const rangeWeight = clamp(Number(cell.weight || 0) / 100, 0, 1);
    weights.fold += 1 - rangeWeight;
    for (const [action, frequency] of Object.entries(cell.actions || {})) {
      add(action, rangeWeight * clamp(Number(frequency || 0) / 100, 0, 1));
    }
  }

  return [
    { key: "fold", label: "弃牌", weight: weights.fold, tone: "danger" },
    { key: "call", label: "跟注", weight: weights.call, tone: "neutral" },
    { key: "raise", label: labels.raise, weight: weights.raise, tone: "accent" },
    { key: "jam", label: labels.jam, weight: weights.jam, tone: "strong" },
  ]
    .filter((action) => action.weight > 0)
    .map((action) => ({ ...action, frequency: clamp(action.weight, 0, 1) }))
    .sort((a, b) => b.frequency - a.frequency);
}

export function sixMaxPreflopChartKey({ position, context, aggressorPosition } = {}) {
  const hero = sourcePosition(position);
  const aggressor = sourcePosition(aggressorPosition);
  if (!hero) return null;

  if (context === "unopened") {
    if (hero === "BB") return null;
    return `${hero}-RFI`;
  }

  if ((context === "facing-open" || context === "blind-defense") && aggressor) {
    return `${hero}-vs-open-${aggressor}`;
  }

  if (context === "facing-3bet" && aggressor) {
    return `${hero}-vs-3bet-${aggressor}`;
  }

  if (context === "facing-4bet" && aggressor) {
    return `${hero}-vs-4bet-${aggressor}`;
  }

  return null;
}

export function hasSixMaxPreflopChart(params = {}) {
  const key = sixMaxPreflopChartKey(params);
  return Boolean(key && SIXMAX_PEKARSTAS_CHARTS[key]);
}

export function lookupSixMaxPreflopActions({
  handCode,
  position,
  context,
  aggressorPosition,
  tableSize = 6,
  stackBb = 100,
} = {}) {
  if (!handCode || Number(tableSize) !== 6) return null;
  if (stackBb < 60 || stackBb > 140) return null;

  const key = sixMaxPreflopChartKey({ position, context, aggressorPosition });
  if (!key) return null;
  const chart = SIXMAX_PEKARSTAS_CHARTS[key];
  if (!chart) return null;

  if (context === "unopened") {
    return normalizeCell(chart[handCode], { raise: "Open", jam: "Open jam" });
  }
  if (context === "facing-open" || context === "blind-defense") {
    return normalizeCell(chart[handCode], { raise: "3bet", jam: "3bet jam" });
  }
  if (context === "facing-3bet") {
    return normalizeCell(chart[handCode], { raise: "4bet", jam: "4bet jam" });
  }
  if (context === "facing-4bet") {
    return normalizeCell(chart[handCode], { raise: "5bet", jam: "5bet jam" }, { literalJam: true });
  }
  return null;
}
