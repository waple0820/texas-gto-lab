import { clamp } from "./poker-core.js";
import {
  SIXMAX_DEEPFOLD_CHARTS,
  SIXMAX_DEEPFOLD_LINE_CHARTS,
  SIXMAX_DEEPFOLD_LINE_KEYS,
  SIXMAX_DEEPFOLD_LINE_SOURCE_PATHS,
} from "./preflop-sixmax-deepfold.js";
import {
  SIXMAX_GTO_WIZARD_CHARTS,
  SIXMAX_GTO_WIZARD_LINE_CHARTS,
  SIXMAX_GTO_WIZARD_LINE_KEYS,
  SIXMAX_GTO_WIZARD_LINE_SOURCE_PATHS,
} from "./preflop-sixmax-gtowizard.js";
import { SIXMAX_GREENLINE_CHARTS } from "./preflop-sixmax-greenline.js";
import { SIXMAX_PEKARSTAS_CHARTS } from "./preflop-sixmax-pekarstas.js";
import { SIXMAX_POKERCOACHING_CHARTS } from "./preflop-sixmax-pokercoaching.js";
import { SIXMAX_W0UF_CHARTS } from "./preflop-sixmax-w0uf.js";

export const SIXMAX_PREFLOP_TABLE_VERSION = "sixmax-100bb-pekarstas-v1+greenline-v1+pokercoaching-facing-rfi-v1+w0uf-squeeze-v1+gtowizard-sqz-v1+deepfold-line-squeeze-cold-4bet-v1+context-v2";

const CHART_SOURCES = [
  { id: "pekarstas", charts: SIXMAX_PEKARSTAS_CHARTS },
  { id: "greenline", charts: SIXMAX_GREENLINE_CHARTS },
  { id: "pokercoaching", charts: SIXMAX_POKERCOACHING_CHARTS },
  { id: "w0uf", charts: SIXMAX_W0UF_CHARTS },
  { id: "gtowizard", charts: SIXMAX_GTO_WIZARD_CHARTS },
  { id: "deepfold", charts: SIXMAX_DEEPFOLD_CHARTS },
];

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

function normalizeDeepfoldPreflopLine(line) {
  if (!line) return null;
  return String(line)
    .trim()
    .split(/\s+/)
    .map((part) => sourcePosition(part) || part)
    .join(" ");
}

function normalizeCell(cell, labels, { literalJam = false, defaultKey = "fold" } = {}) {
  const weights = { fold: 0, check: 0, call: 0, raise: 0, jam: 0 };

  function add(action, frequency) {
    const key = action === "allin" ? (literalJam ? "jam" : "raise") : action;
    if (key in weights) weights[key] += frequency;
  }

  if (!cell) {
    add(defaultKey, 1);
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
    { key: "check", label: labels.check || "过牌", weight: weights.check, tone: "neutral" },
    { key: "call", label: "跟注", weight: weights.call, tone: "neutral" },
    { key: "raise", label: labels.raise, weight: weights.raise, tone: "accent" },
    { key: "jam", label: labels.jam, weight: weights.jam, tone: "strong" },
  ]
    .filter((action) => action.weight > 0)
    .map((action) => ({ ...action, frequency: clamp(action.weight, 0, 1) }))
    .sort((a, b) => b.frequency - a.frequency);
}

export function sixMaxPreflopChartKey({ position, context, aggressorPosition, callerPositions = [] } = {}) {
  const hero = sourcePosition(position);
  const aggressor = sourcePosition(aggressorPosition);
  const callers = callerPositions.map(sourcePosition).filter(Boolean);
  if (!hero) return null;

  if (context === "unopened") {
    if (hero === "BB") return null;
    return `${hero}-RFI`;
  }

  if (context === "check-option" || context === "limped-pot" || context === "blind-check") {
    return `${hero}-ISO`;
  }

  if ((context === "facing-open" || context === "blind-defense") && aggressor) {
    return `${hero}-vs-open-${aggressor}`;
  }

  if (context === "squeeze" && aggressor && callers.length) {
    return `${hero}-squeeze-${aggressor}-${callers.join("-")}`;
  }

  if (context === "facing-3bet" && aggressor) {
    return `${hero}-vs-3bet-${aggressor}`;
  }

  if (context === "cold-facing-3bet" && aggressor) {
    return `${hero}-cold-vs-3bet-${aggressor}`;
  }

  if (context === "facing-squeeze" && aggressor) {
    return `${hero}-vs-squeeze-${aggressor}`;
  }

  if (context === "facing-4bet" && aggressor) {
    return `${hero}-vs-4bet-${aggressor}`;
  }

  return null;
}

const FACING_OPEN_ALIASES = {
  "CO-vs-open-MP": "CO-vs-open-UTG",
  "BTN-vs-open-MP": "BTN-vs-open-UTG",
};

const AGGRESSOR_FALLBACK_ORDER = {
  UTG: ["MP", "CO", "BTN", "SB", "BB"],
  MP: ["CO", "BTN", "SB", "BB", "UTG"],
  CO: ["BTN", "SB", "BB", "MP", "UTG"],
  BTN: ["SB", "BB", "CO", "MP", "UTG"],
  SB: ["BB", "BTN", "CO", "MP", "UTG"],
  BB: ["SB", "BTN", "CO", "MP", "UTG"],
};

function firstExistingKey(candidates) {
  return firstExistingSource(candidates)?.key || null;
}

function firstExistingSource(candidates) {
  for (const key of candidates) {
    for (const source of CHART_SOURCES) {
      const chart = source.charts[key];
      if (chart) return { provider: source.id, key, chart };
    }
  }
  return null;
}

function exactSource(key) {
  return firstExistingSource([key]);
}

function deepfoldLineSource(params, rawKey) {
  const lineKey = normalizeDeepfoldPreflopLine(params.preflopLine);
  if (!lineKey) return null;
  if (SIXMAX_DEEPFOLD_LINE_KEYS[lineKey] !== rawKey) return null;
  const chart = SIXMAX_DEEPFOLD_LINE_CHARTS[lineKey];
  if (!chart) return null;
  return {
    provider: "deepfold",
    key: rawKey,
    chart,
    lineKey,
    sourcePath: SIXMAX_DEEPFOLD_LINE_SOURCE_PATHS[lineKey] || null,
  };
}

function gtowizardLineSource(params, rawKey) {
  const lineKey = normalizeDeepfoldPreflopLine(params.preflopLine);
  if (!lineKey) return null;
  if (SIXMAX_GTO_WIZARD_LINE_KEYS[lineKey] !== rawKey) return null;
  const chart = SIXMAX_GTO_WIZARD_LINE_CHARTS[lineKey];
  if (!chart) return null;
  return {
    provider: "gtowizard",
    key: rawKey,
    chart,
    lineKey,
    sourcePath: SIXMAX_GTO_WIZARD_LINE_SOURCE_PATHS[lineKey] || null,
  };
}

export function resolveSixMaxPreflopChartKey(params = {}) {
  return resolveSixMaxPreflopChartSource(params)?.key || null;
}

export function resolveSixMaxPreflopChartSource(params = {}) {
  const rawKey = sixMaxPreflopChartKey(params);
  if (!rawKey) return null;
  const gtowizardLineExact = gtowizardLineSource(params, rawKey);
  if (gtowizardLineExact) return gtowizardLineExact;
  const lineExact = deepfoldLineSource(params, rawKey);
  if (lineExact) return lineExact;
  const exact = exactSource(rawKey);
  if (exact) return exact;

  if (params.context === "facing-open" || params.context === "blind-defense") {
    const aliasKey = FACING_OPEN_ALIASES[rawKey];
    return aliasKey ? exactSource(aliasKey) : null;
  }
  if (params.context === "squeeze") {
    const hero = sourcePosition(params.position);
    const aggressor = sourcePosition(params.aggressorPosition);
    if (!hero || !aggressor) return null;

    return resolveSixMaxPreflopChartSource({
      ...params,
      context: hero === "SB" || hero === "BB" ? "blind-defense" : "facing-open",
    });
  }
  if (params.context === "cold-facing-3bet" || params.context === "facing-squeeze") {
    return null;
  }
  if (params.context === "facing-3bet") {
    const hero = sourcePosition(params.position);
    const aggressor = sourcePosition(params.aggressorPosition);
    if (!hero || !aggressor) return null;

    return firstExistingSource([
      `${hero}-vs-4bet-${aggressor}`,
      ...(AGGRESSOR_FALLBACK_ORDER[aggressor] || []).map((fallbackAggressor) => `${hero}-vs-3bet-${fallbackAggressor}`),
      ...(AGGRESSOR_FALLBACK_ORDER[aggressor] || []).map((fallbackAggressor) => `${hero}-vs-4bet-${fallbackAggressor}`),
    ]);
  }
  if (params.context === "facing-4bet") {
    const hero = sourcePosition(params.position);
    const aggressor = sourcePosition(params.aggressorPosition);
    if (!hero || !aggressor) return null;

    return firstExistingSource((AGGRESSOR_FALLBACK_ORDER[aggressor] || []).map((fallbackAggressor) => `${hero}-vs-4bet-${fallbackAggressor}`));
  }
  return null;
}

export function hasSixMaxPreflopChart(params = {}) {
  return Boolean(resolveSixMaxPreflopChartSource(params)?.chart);
}

export function lookupSixMaxPreflopActions({
  handCode,
  position,
  context,
  aggressorPosition,
  callerPositions = [],
  preflopLine,
  tableSize = 6,
  stackBb = 100,
} = {}) {
  if (!handCode || Number(tableSize) !== 6) return null;
  if (stackBb < 60 || stackBb > 140) return null;

  const source = resolveSixMaxPreflopChartSource({ position, context, aggressorPosition, callerPositions, preflopLine });
  if (!source?.chart) return null;
  const { chart } = source;

  if (context === "unopened") {
    return normalizeCell(chart[handCode], { raise: "Open", jam: "Open jam" });
  }
  if (context === "check-option" || context === "limped-pot" || context === "blind-check") {
    const defaultKey = context === "limped-pot" ? "fold" : "check";
    return normalizeCell(chart[handCode], { check: "过牌", raise: "Iso", jam: "Iso jam" }, { defaultKey });
  }
  if (context === "facing-open" || context === "blind-defense" || context === "squeeze") {
    return normalizeCell(chart[handCode], { raise: "3bet", jam: "3bet jam" });
  }
  if (context === "facing-3bet" || context === "cold-facing-3bet" || context === "facing-squeeze") {
    const raiseLabel = context === "cold-facing-3bet" ? "Cold 4bet" : context === "facing-squeeze" ? "4bet vs squeeze" : "4bet";
    return normalizeCell(chart[handCode], { raise: raiseLabel, jam: "4bet jam" });
  }
  if (context === "facing-4bet") {
    return normalizeCell(chart[handCode], { raise: "5bet", jam: "5bet jam" }, { literalJam: true });
  }
  return null;
}
