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

function sizeOption(label, amount, role, frequency = null) {
  return {
    label,
    amount: round(Math.max(0, amount), 1),
    role,
    frequency,
  };
}

function potSize(label, fraction, pot, role, frequency = null) {
  return {
    ...sizeOption(label, pot * fraction, role, frequency),
    fraction,
  };
}

function makeSizing(primary, note, options) {
  const seen = new Set();
  const uniqueOptions = [primary, ...options].filter((option) => {
    const key = option.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    label: primary.label,
    amount: primary.amount,
    note,
    options: uniqueOptions.map((option) => ({
      ...option,
      recommended: option.label === primary.label,
    })),
  };
}

function preflopOpenPrimary(position, stackBb) {
  if (stackBb < 35) return sizeOption("2.0bb open", 2, "短筹码低风险开池", 0.3);
  if (position === "SB") return sizeOption("3.0bb SB open", 3, "盲战 OOP 提高弃牌率", 0.34);
  if (position === "BTN" || position === "CO") return sizeOption("2.2bb open", 2.2, "后位高频小开", 0.32);
  return sizeOption("2.5bb open", 2.5, "标准开池", 0.34);
}

function commonPostflopSizes(pot, spr, boardCards) {
  const options = [
    potSize("25% pot", 0.25, pot, "range bet / deny equity", 0.18),
    potSize("33% pot", 0.33, pot, "高频小注", 0.22),
    potSize("50% pot", 0.5, pot, "中等混合尺度", 0.2),
    potSize("66% pot", 0.66, pot, "保护与价值", 0.16),
    potSize("75% pot", 0.75, pot, "湿润面压力", 0.14),
    potSize("100% pot", 1, pot, "极化下注", 0.08),
  ];
  if (boardCards >= 4 && spr >= 3.2) {
    options.push(potSize("125% pot", 1.25, pot, "转河极化 overbet", 0.05));
  }
  if (boardCards >= 4 && spr >= 4.5) {
    options.push(potSize("150% pot", 1.5, pot, "坚果优势超池", 0.03));
  }
  return options;
}

function chooseSizing({ board, metrics, profile, equity, toCall, context, position }) {
  const wetness = profile.texture.wetness || 0;
  const spr = metrics.spr;
  const valueHeavy = equity > 0.66 || (MADE_HAND_WEIGHT[profile.madeName] || 0) > 0.48;
  const nutted = (MADE_HAND_WEIGHT[profile.madeName] || 0) > 0.62;

  if (spr < 2.1 || metrics.effectiveStack <= 18) {
    return makeSizing(sizeOption("All-in / 低 SPR", metrics.effectiveStack, "短 SPR 直接实现权益", 0.62), "短 SPR 下权益实现优先", [
      potSize("33% pot", 0.33, metrics.pot, "保留弱范围"),
      potSize("66% pot", 0.66, metrics.pot, "承诺底池"),
    ]);
  }
  if (board.length === 0) {
    if (toCall <= 0 && hasFreeCheckOption(context)) {
      const primary = sizeOption("4.0bb 隔离加注", Math.max(4, metrics.pot * 1.8), "隔离 limper", 0.34);
      return makeSizing(primary, "免费看牌时不能弃牌，主动入池使用隔离加注树", [
        sizeOption("3.5bb 小隔离", Math.max(3.5, metrics.pot * 1.55), "低风险隔离", 0.22),
        sizeOption("4.5bb 标准隔离", Math.max(4.5, metrics.pot * 2.05), "标准隔离", 0.26),
        sizeOption("6.0bb 大隔离", Math.max(6, metrics.pot * 2.7), "多 limper / OOP 压力", 0.1),
      ]);
    }
    if (toCall > 0 && context === "facing-3bet") {
      const primary = sizeOption("2.2x 4bet", Math.max(toCall * 2.2, 16), "常规 4bet", 0.38);
      return makeSizing(primary, "面对 3bet 使用小 4bet / jam 混合", [
        sizeOption("2.0x 4bet", Math.max(toCall * 2, 14), "IP 小 4bet", 0.22),
        sizeOption("2.5x 4bet", Math.max(toCall * 2.5, 18), "OOP 压力 4bet", 0.24),
        sizeOption("All-in", metrics.effectiveStack, "低 SPR / 强极化", 0.16),
      ]);
    }
    if (toCall > 0) {
      const outOfPosition = position === "SB" || position === "BB";
      const primary = sizeOption(outOfPosition ? "4x 3bet" : "3x 3bet", Math.max(toCall * (outOfPosition ? 4 : 3), outOfPosition ? 8 : 6), outOfPosition ? "OOP 3bet" : "IP 3bet", 0.36);
      return makeSizing(primary, "面对 open 使用 IP 小 3bet、OOP 大 3bet、squeeze 加大", [
        sizeOption("3x 3bet", Math.max(toCall * 3, 6), "IP 标准"),
        sizeOption("4x 3bet", Math.max(toCall * 4, 8), "OOP 标准"),
        sizeOption("4.5x squeeze", Math.max(toCall * 4.5, 9), "多人底池挤压"),
      ]);
    }
    const primary = preflopOpenPrimary(position, metrics.effectiveStack);
    return makeSizing(primary, "翻前 open 常见尺度树", [
      sizeOption("2.0bb open", 2, "短筹码 / 后位高频", 0.18),
      sizeOption("2.2bb open", 2.2, "后位常规", 0.24),
      sizeOption("2.5bb open", 2.5, "中早位标准", 0.28),
      sizeOption("3.0bb open", 3, "SB / 低级别惩罚", 0.18),
    ]);
  }
  const postflopOptions = commonPostflopSizes(metrics.pot, spr, board.length);
  if (board.length === 5 && (valueHeavy || nutted) && spr >= 3) {
    const primary = equity > 0.72 || nutted ? postflopOptions.find((option) => option.label === "125% pot") : postflopOptions.find((option) => option.label === "100% pot");
    return makeSizing(primary || postflopOptions.at(-1), "河牌极化范围加入 pot / overbet 尺度", postflopOptions);
  }
  if (board.length >= 4 && wetness > 0.42 && valueHeavy) {
    const primary = postflopOptions.find((option) => option.label === "100% pot") || postflopOptions.find((option) => option.label === "75% pot");
    return makeSizing(primary, "转河湿润面价值与保护，使用大注到 pot", postflopOptions);
  }
  if (valueHeavy && wetness > 0.45) {
    const primary = postflopOptions.find((option) => option.label === "75% pot");
    return makeSizing(primary, "湿润面价值与保护", postflopOptions);
  }
  if (valueHeavy && wetness < 0.22) {
    const primary = postflopOptions.find((option) => option.label === "33% pot");
    return makeSizing(primary, "静态面高频小注", postflopOptions);
  }
  const primary = postflopOptions.find((option) => option.label === (wetness > 0.4 ? "66% pot" : "50% pot"));
  return makeSizing(primary, "常规混合尺度，保留小注、中注、大注和极化 overbet", postflopOptions);
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
    position,
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
