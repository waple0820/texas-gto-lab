import {
  analyzeMadeHand,
  buildRangeWeights,
  calculateEquity,
  clamp,
  computeDecisionMetrics,
  pct,
  rangeCoverage,
  round,
} from "./poker-core.js";

const POSITION_EDGE = {
  UTG: -0.05,
  HJ: -0.025,
  CO: 0.02,
  BTN: 0.07,
  SB: -0.015,
  BB: -0.025,
};

const MADE_HAND_WEIGHT = {
  Preflop: 0,
  "High Card": 0,
  Pair: 0.12,
  "Two Pair": 0.32,
  "Three of a Kind": 0.48,
  Straight: 0.62,
  Flush: 0.68,
  "Full House": 0.78,
  "Four of a Kind": 0.9,
  "Straight Flush": 0.96,
  "Royal Flush": 1,
};

export function normalizeActions(actions) {
  const total = actions.reduce((sum, action) => sum + Math.max(0, action.weight), 0) || 1;
  return actions
    .map((action) => ({
      ...action,
      frequency: clamp(action.weight / total, 0, 1),
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

function drawBonus(draws) {
  return (
    (draws.flushDraw ? 0.09 : 0) +
    (draws.openEnded ? 0.075 : 0) +
    (draws.straightDraw && !draws.openEnded ? 0.045 : 0) +
    (draws.backdoorFlush ? 0.02 : 0) +
    Math.min(0.055, draws.overcards * 0.026)
  );
}

function texturePressure(texture) {
  return (texture.wetness || 0) * 0.09 + (texture.paired ? -0.025 : 0);
}

function hasFreeCheckOption(context) {
  return ["check-option", "limped-pot", "blind-check"].includes(context);
}

function chooseSizing({ board, metrics, profile, equity, toCall, context }) {
  const wetness = profile.texture.wetness || 0;
  const spr = metrics.spr;
  const valueHeavy = equity > 0.66 || (MADE_HAND_WEIGHT[profile.madeName] || 0) > 0.48;

  if (spr < 2.1 || metrics.effectiveStack <= 18) {
    return {
      label: "All-in / 低 SPR",
      amount: metrics.effectiveStack,
      note: "短 SPR 下权益实现优先",
    };
  }
  if (board.length === 0) {
    if (toCall <= 0 && hasFreeCheckOption(context)) {
      const isolationSize = Math.max(3, metrics.pot * 1.8);
      return {
        label: "隔离加注",
        amount: round(isolationSize, 1),
        note: "免费看牌时不能弃牌，只在过牌与加注间混合",
      };
    }
    const openSize = toCall > 0 ? Math.max(toCall * 3, 6) : 2.5;
    return {
      label: toCall > 0 ? "3x 加注" : "2.5bb open",
      amount: round(openSize, 1),
      note: "翻前标准尺度",
    };
  }
  if (valueHeavy && wetness > 0.45) {
    return {
      label: "75% pot",
      amount: round(metrics.pot * 0.75, 1),
      note: "湿润面价值与保护",
    };
  }
  if (valueHeavy && wetness < 0.22) {
    return {
      label: "33% pot",
      amount: round(metrics.pot * 0.33, 1),
      note: "静态面高频小注",
    };
  }
  return {
    label: wetness > 0.4 ? "66% pot" : "50% pot",
    amount: round(metrics.pot * (wetness > 0.4 ? 0.66 : 0.5), 1),
    note: "混合尺度",
  };
}

function strategyFacingBet({ equity, metrics, profile, position, context }) {
  const edge = equity - metrics.potOdds;
  const draws = profile.draws;
  const semiBluff = drawBonus(draws);
  const nutted = MADE_HAND_WEIGHT[profile.madeName] || 0;
  const positionBoost = POSITION_EDGE[position] || 0;
  const pressure = context === "facing-raise" ? 0.085 : context === "facing-3bet" ? 0.07 : 0;

  let fold = clamp((metrics.potOdds + 0.055 + pressure - equity) * 3.15 - semiBluff, 0.02, 0.9);
  let raise = clamp((equity - 0.58) * 1.45 + semiBluff * 0.9 + nutted * 0.22 + positionBoost, 0, 0.74);
  let call = clamp(1 - fold - raise, 0.04, 0.92);

  if (metrics.spr < 2.3 && equity > 0.52) {
    raise += 0.22;
    call -= 0.12;
    fold -= 0.1;
  }
  if (equity < metrics.potOdds - 0.08 && !draws.flushDraw && !draws.straightDraw) {
    fold += 0.18;
    raise *= 0.55;
  }

  return normalizeActions([
    { key: "fold", label: "弃牌", weight: fold, tone: "danger" },
    { key: "call", label: "跟注", weight: call, tone: "neutral" },
    { key: "raise", label: metrics.spr < 2.3 ? "全压" : "加注", weight: raise, tone: "accent" },
  ]);
}

function strategyOpenAction({ equity, metrics, profile, position, context }) {
  const draws = profile.draws;
  const made = MADE_HAND_WEIGHT[profile.madeName] || 0;
  const positionBoost = POSITION_EDGE[position] || 0;
  const initiativeBoost = ["unopened", "single-raised", "three-bet-pot"].includes(context) ? 0.035 : 0;
  const pressure = texturePressure(profile.texture);
  const preflop = profile.street === "preflop";
  const preflopStrength = clamp((profile.preflopScore - 48) / 45, 0, 1);

  if (preflop) {
    const open = clamp(preflopStrength * 0.98 + positionBoost + (context === "unopened" ? 0.08 : -0.03), 0.02, 0.94);
    const call = clamp(preflopStrength * 0.32 + (context === "blind-defense" ? 0.32 : 0.04), 0.02, 0.58);
    const fold = clamp(1 - open - call, 0.02, 0.9);
    return normalizeActions([
      { key: "fold", label: "弃牌", weight: fold, tone: "danger" },
      { key: "call", label: context === "unopened" ? "少量跟入" : "跟注", weight: call, tone: "neutral" },
      { key: "raise", label: context === "unopened" ? "Open" : "加注", weight: open, tone: "accent" },
    ]);
  }

  const value = clamp((equity - 0.47) * 1.35 + made * 0.26, 0, 0.82);
  const bluff = clamp(drawBonus(draws) + pressure + positionBoost + initiativeBoost, 0.015, 0.28);
  const bigBet = clamp((equity - 0.64) * 1.15 + pressure + made * 0.1, 0, 0.46);
  const smallBet = clamp(value + bluff - bigBet * 0.45, 0.04, 0.88);
  const check = clamp(1 - smallBet - bigBet, 0.05, 0.9);

  return normalizeActions([
    { key: "check", label: "过牌", weight: check, tone: "neutral" },
    { key: "bet-small", label: "小注", weight: smallBet, tone: "accent" },
    { key: "bet-big", label: "大注", weight: bigBet, tone: "strong" },
  ]);
}

function strategyCheckOption({ equity, metrics, profile, position }) {
  if (profile.street !== "preflop") {
    return strategyOpenAction({ equity, metrics, profile, position, context: "single-raised" });
  }

  const positionBoost = POSITION_EDGE[position] || 0;
  const preflopStrength = clamp((profile.preflopScore - 48) / 45, 0, 1);
  const raise = clamp(preflopStrength * 0.62 + positionBoost + 0.035, 0.035, 0.68);
  const bigRaise = clamp((preflopStrength - 0.64) * 0.52 + positionBoost * 0.45, 0, 0.28);
  const check = clamp(1 - raise - bigRaise, 0.18, 0.96);

  return normalizeActions([
    { key: "check", label: "过牌", weight: check, tone: "neutral" },
    { key: "raise", label: "加注", weight: raise, tone: "accent" },
    { key: "bet-big", label: "大加注", weight: bigRaise, tone: "strong" },
  ]);
}

function buildReasons({ equityResult, metrics, profile, rangeInfo, position, context }) {
  const reasons = [
    `权益 ${pct(equityResult.equity, 1)} / 胜率 ${pct(equityResult.win, 1)}`,
    metrics.toCall > 0 ? `底池赔率 ${pct(metrics.potOdds, 1)}` : `SPR ${round(metrics.spr, 1)}`,
    `对手范围 ${round(rangeInfo.percent * 100, 1)}% (${rangeInfo.combos} combos)`,
    profile.street === "preflop" ? `起手牌 ${profile.handCode}` : `${profile.description}`,
    `位置 ${position} / ${context}`,
  ];

  if (profile.draws.flushDraw) reasons.push("同花听牌");
  if (profile.draws.openEnded) reasons.push("开放顺听牌");
  if (profile.texture.label && profile.street !== "preflop") reasons.push(`牌面 ${profile.texture.label}`);

  return reasons.slice(0, 7);
}

export function recommendStrategy({
  hero,
  board = [],
  position = "CO",
  context = "unopened",
  tableSize = 6,
  stackBb = 100,
  pot = 6,
  toCall = 0,
  opponents = 1,
  rangeStyle = "balanced",
  rangeWeights,
  iterations = 1200,
  rng = Math.random,
} = {}) {
  const activeRange =
    rangeWeights ||
    buildRangeWeights({
      style: rangeStyle,
      position,
      context,
      tableSize,
      stackBb,
    });
  const equityResult = calculateEquity({
    hero,
    board,
    rangeWeights: activeRange,
    opponents,
    iterations,
    rng,
  });
  const profile = analyzeMadeHand(hero, board);
  const metrics = computeDecisionMetrics({
    equity: equityResult.equity,
    pot,
    toCall,
    effectiveStack: stackBb,
  });
  const actions =
    metrics.toCall > 0
      ? strategyFacingBet({ equity: equityResult.equity, metrics, profile, position, context })
      : hasFreeCheckOption(context)
        ? strategyCheckOption({ equity: equityResult.equity, metrics, profile, position })
      : strategyOpenAction({ equity: equityResult.equity, metrics, profile, position, context });
  const sizing = chooseSizing({
    board,
    metrics,
    profile,
    equity: equityResult.equity,
    toCall: metrics.toCall,
    context,
  });
  const rangeInfo = rangeCoverage(activeRange);

  return {
    actions,
    sizing,
    equity: equityResult,
    profile,
    metrics,
    range: activeRange,
    rangeInfo,
    reasons: buildReasons({
      equityResult,
      metrics,
      profile,
      rangeInfo,
      position,
      context,
    }),
  };
}

export function pickAction(actions, rng = Math.random, temperature = 1) {
  const adjusted = actions.map((action) => ({
    ...action,
    adjusted: Math.max(0.001, action.frequency) ** (1 / clamp(temperature, 0.35, 2.4)),
  }));
  const total = adjusted.reduce((sum, action) => sum + action.adjusted, 0);
  let roll = rng() * total;
  for (const action of adjusted) {
    roll -= action.adjusted;
    if (roll <= 0) return action;
  }
  return adjusted[0];
}
