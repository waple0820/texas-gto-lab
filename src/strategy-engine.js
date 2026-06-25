import {
  allHandCodes,
  analyzeMadeHand,
  buildRangeWeights,
  calculateEquity,
  cardRank,
  cardSuit,
  clamp,
  comboCountForCode,
  computeDecisionMetrics,
  pct,
  RANK_VALUE,
  rangeCoverage,
  round,
  scoreHandCode,
} from "./poker-core.js";
import { PREFLOP_POLICY_VERSION, preflopStrategyActions } from "./preflop-policy.js";
import { applyTrainedPolicy } from "./trained-policy-runtime.js";

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

function comboWeightedRangePercentile(handCode, rangeWeights) {
  const heroScore = scoreHandCode(handCode);
  let total = 0;
  let weaker = 0;
  let tied = 0;

  for (const code of allHandCodes()) {
    const weight = Number(rangeWeights?.[code] || 0);
    if (weight <= 0) continue;
    const combos = comboCountForCode(code) * weight;
    const score = scoreHandCode(code);
    total += combos;
    if (score < heroScore) weaker += combos;
    else if (score === heroScore) tied += combos;
  }

  if (total <= 0) return clamp(heroScore / 100, 0, 1);
  return clamp((weaker + tied * 0.5) / total, 0, 1);
}

function highCardValue(board = []) {
  return Math.max(0, ...board.map((card) => RANK_VALUE[cardRank(card)] || 0));
}

function boardSuitCounts(board = []) {
  return board.reduce((counts, card) => {
    counts[cardSuit(card)] = (counts[cardSuit(card)] || 0) + 1;
    return counts;
  }, {});
}

function blockerScore(hero = [], board = []) {
  if (!board.length) return 0;
  const boardHigh = highCardValue(board);
  const heroValues = hero.map((card) => RANK_VALUE[cardRank(card)] || 0);
  const heroSuits = hero.map(cardSuit);
  const suits = boardSuitCounts(board);
  const flushSuit = Object.entries(suits).find(([, count]) => count >= 3)?.[0];

  let score = 0;
  if (heroValues.includes(14)) score += 0.055;
  if (boardHigh && heroValues.includes(boardHigh)) score += 0.085;
  if (heroValues.some((value) => value >= 12 && value > boardHigh - 2)) score += 0.035;
  if (flushSuit && hero.some((card) => cardRank(card) === "A" && cardSuit(card) === flushSuit)) score += 0.09;
  if (flushSuit && heroSuits.includes(flushSuit)) score += 0.035;
  return clamp(score, 0, 0.22);
}

function rangeAdvantage({ board, context, position, profile, rangeInfo }) {
  let advantage = 0.48;
  const high = highCardValue(board);
  const texture = profile.texture || {};
  const aggressorContext = ["unopened", "single-raised", "three-bet-pot"].includes(context);

  if (aggressorContext) advantage += 0.08;
  if (context === "three-bet-pot") advantage += 0.08;
  if (["BTN", "CO"].includes(position)) advantage += 0.035;
  if (["SB", "BB"].includes(position)) advantage -= 0.025;
  if ((rangeInfo?.percent || 0) <= 0.18) advantage += 0.055;
  if ((rangeInfo?.percent || 0) >= 0.38) advantage -= 0.035;

  if (board.length >= 3) {
    if (high >= 13 && !texture.connected) advantage += 0.08;
    if (high >= 12 && texture.paired) advantage += 0.045;
    if (texture.monotone) advantage -= 0.075;
    if (texture.connected) advantage -= 0.06;
    if ((texture.wetness || 0) < 0.2) advantage += 0.035;
  }

  return clamp(advantage, 0.24, 0.78);
}

function rangeBetTarget({ profile, context, position, rangeModel }) {
  if (profile.street === "preflop") return 0;
  const texture = profile.texture || {};
  let target = 0.34 + rangeModel.advantage * 0.36;
  if (["single-raised", "three-bet-pot"].includes(context)) target += 0.08;
  if (context === "three-bet-pot") target += 0.08;
  if (["BTN", "CO"].includes(position)) target += 0.035;
  if (texture.paired) target += 0.035;
  if (texture.connected) target -= 0.06;
  if (texture.monotone) target -= 0.08;
  if ((texture.wetness || 0) < 0.22) target += 0.055;
  if ((texture.wetness || 0) > 0.52) target -= 0.08;
  return clamp(target, 0.18, 0.78);
}

function classifyRangeRole({ equity, profile, rangeModel }) {
  const made = MADE_HAND_WEIGHT[profile.madeName] || 0;
  const draw = drawBonus(profile.draws);
  const highRange = rangeModel.percentile >= 0.72;
  const lowShowdown = equity < 0.42 && made < 0.18;

  if (made >= 0.48 || equity >= 0.64) return "value";
  if (draw >= 0.075) return "semi-bluff";
  if (lowShowdown && (rangeModel.blockers >= 0.06 || rangeModel.advantage >= 0.58 || highRange)) return "blocker-bluff";
  if (made >= 0.12 || equity >= 0.42) return "bluff-catcher";
  return "range-air";
}

function roleLabel(role) {
  return {
    value: "价值下注",
    "semi-bluff": "半诈唬",
    "blocker-bluff": "阻断牌诈唬",
    "bluff-catcher": "抓诈/摊牌价值",
    "range-air": "低摊牌价值空气牌",
  }[role] || role;
}

function buildRangeModel({ hero, board, rangeWeights, rangeInfo, profile, position, context, equity }) {
  const handCode = profile.handCode;
  const rangeWeight = Number(rangeWeights?.[handCode] || 0);
  const percentile = comboWeightedRangePercentile(handCode, rangeWeights);
  const blockers = blockerScore(hero, board);
  const advantage = rangeAdvantage({ board, context, position, profile, rangeInfo });
  const role = classifyRangeRole({
    equity,
    profile,
    rangeModel: {
      advantage,
      blockers,
      percentile,
    },
  });

  return {
    handCode,
    rangeWeight,
    percentile,
    blockers,
    advantage,
    role,
    roleLabel: roleLabel(role),
  };
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

function alignSizingWithActions(sizing, actions, board, toCall) {
  if (!sizing?.options?.length || board.length < 3 || toCall > 0) return sizing;
  if (sizing.label?.includes("All-in")) return sizing;
  const top = actions[0]?.key;
  const buckets = {
    "bet-small": (option) => (option.fraction || 0) > 0 && option.fraction <= 0.35,
    "bet-mid": (option) => (option.fraction || 0) > 0.35 && option.fraction <= 0.7,
    "bet-big": (option) => (option.fraction || 0) > 0.7 && option.fraction <= 1.05,
    "bet-over": (option) => (option.fraction || 0) > 1.05,
  };
  const matcher = buckets[top];
  if (!matcher) return sizing;
  const primary = sizing.options.find((option) => matcher(option));
  if (!primary || primary.label === sizing.label) return sizing;
  return makeSizing(primary, `按最高频动作 ${actions[0].label} 同步主尺度`, sizing.options);
}

function strategyFacingBet({ equity, metrics, profile, position, context, rangeModel }) {
  const edge = equity - metrics.potOdds;
  const draws = profile.draws;
  const semiBluff = drawBonus(draws);
  const nutted = MADE_HAND_WEIGHT[profile.madeName] || 0;
  const positionBoost = POSITION_EDGE[position] || 0;
  const pressure = context === "facing-raise" ? 0.085 : context === "facing-3bet" ? 0.07 : 0;
  const blockerBluff = clamp((rangeModel.blockers + Math.max(0, rangeModel.advantage - 0.5) * 0.34) * (1 - nutted * 0.75), 0, 0.18);
  const bluffCatcher = clamp((rangeModel.percentile - 0.42) * 0.18 + (nutted >= 0.12 ? 0.08 : 0), 0, 0.18);

  let raise = clamp((equity - 0.57) * 1.25 + semiBluff * 1.05 + blockerBluff + nutted * 0.24 + positionBoost, 0.015, 0.72);
  let call = clamp((edge + 0.16 - pressure) * 1.35 + bluffCatcher + nutted * 0.1 + semiBluff * 0.32, 0.035, 0.9);
  let fold = clamp(1 - call - raise, 0.02, 0.92);

  if (metrics.spr < 2.3 && equity > 0.52) {
    raise += 0.22;
    call -= 0.12;
    fold -= 0.1;
  }
  if (equity < metrics.potOdds - 0.08 && !draws.flushDraw && !draws.straightDraw) {
    fold += 0.18;
    raise *= rangeModel.blockers > 0.07 ? 0.82 : 0.55;
  }
  if (rangeModel.role === "blocker-bluff" && metrics.spr > 3) {
    raise += 0.08;
    call -= 0.03;
    fold -= 0.05;
  }
  const jam = clamp((metrics.spr < 2.4 ? 0.08 : 0) + (equity - 0.68) * 0.7 + Math.max(0, nutted - 0.62) * 0.55, 0.002, 0.36);
  const bigRaise = clamp(raise * (0.28 + semiBluff * 0.75 + Math.max(0, nutted - 0.32) * 0.45), 0.006, 0.44);
  const smallRaise = clamp(raise - bigRaise * 0.72 - jam * 0.5, 0.008, 0.62);

  return normalizeActions([
    { key: "fold", label: "弃牌", weight: fold, tone: "danger" },
    { key: "call", label: "跟注", weight: call, tone: "neutral" },
    { key: "raise-small", label: "小加注", weight: smallRaise, tone: "accent" },
    { key: "raise-big", label: "大加注", weight: bigRaise, tone: "strong" },
    { key: "jam", label: "全压", weight: jam, tone: "strong" },
  ]);
}

function strategyOpenAction({ equity, metrics, profile, position, context, rangeModel }) {
  const draws = profile.draws;
  const made = MADE_HAND_WEIGHT[profile.madeName] || 0;
  const positionBoost = POSITION_EDGE[position] || 0;
  const initiativeBoost = ["unopened", "single-raised", "three-bet-pot"].includes(context) ? 0.035 : 0;
  const pressure = texturePressure(profile.texture);
  const preflop = profile.street === "preflop";
  const preflopStrength = clamp((profile.preflopScore - 48) / 45, 0, 1);

  if (preflop) {
    return preflopStrategyActions({
      handCode: profile.handCode,
      position,
      context,
      stackBb: metrics.effectiveStack,
    });
  }

  const rangeTarget = rangeBetTarget({ profile, context, position, rangeModel });
  const semiBluff = drawBonus(draws);
  const lowShowdown = equity < 0.42 && made < 0.18;
  const value = clamp((equity - 0.48) * 1.25 + made * 0.34 + Math.max(0, rangeModel.percentile - 0.62) * 0.18, 0, 0.86);
  const rangeBluff = clamp(
    semiBluff * 1.08 +
      rangeModel.blockers * 0.95 +
      Math.max(0, rangeModel.advantage - 0.48) * (lowShowdown ? 0.58 : 0.24) +
      rangeTarget * (lowShowdown ? 0.22 : 0.08) +
      pressure +
      positionBoost * 0.55 +
      initiativeBoost,
    0.02,
    0.46,
  );
  const protection = clamp(made > 0 && equity < 0.55 ? 0.07 + rangeTarget * 0.1 : 0, 0, 0.2);
  const bigBet = clamp((equity - 0.63) * 1.05 + made * 0.16 + semiBluff * 0.36 + Math.max(0, rangeModel.blockers - 0.08) * 0.8 + pressure, 0.015, 0.5);
  const targetBet = clamp(rangeTarget * 0.34 + value * 0.52 + rangeBluff * 0.82 + protection, 0.055, 0.9);
  const overBet = clamp(
    (profile.street === "river" || profile.street === "turn" ? 1 : 0) *
      ((equity - 0.72) * 0.72 + Math.max(0, made - 0.62) * 0.72 + Math.max(0, rangeModel.advantage - 0.62) * 0.5),
    0.005,
    0.28,
  );
  const remainingBet = clamp(targetBet - overBet * 0.72, 0.035, 0.9);
  const midShare = clamp(0.28 + (profile.texture.wetness || 0) * 0.34 + (profile.street === "turn" ? 0.08 : 0), 0.24, 0.62);
  const bigShare = clamp(0.16 + bigBet * 0.72 + (profile.street === "river" ? 0.08 : 0), 0.08, 0.5);
  const smallBet = clamp(remainingBet * (1 - midShare) - bigBet * 0.18, 0.025, 0.72);
  const midBet = clamp(remainingBet * midShare, 0.02, 0.56);
  const big = clamp(bigBet * 0.52 + remainingBet * bigShare, 0.015, 0.48);
  const check = clamp(1 - smallBet - midBet - big - overBet, 0.04, 0.92);

  return normalizeActions([
    { key: "check", label: "过牌", weight: check, tone: "neutral" },
    { key: "bet-small", label: "小注", weight: smallBet, tone: "accent" },
    { key: "bet-mid", label: "中注", weight: midBet, tone: "accent" },
    { key: "bet-big", label: "大注", weight: big, tone: "strong" },
    { key: "bet-over", label: "超池", weight: overBet, tone: "strong" },
  ]);
}

function strategyCheckOption({ equity, metrics, profile, position, rangeModel }) {
  if (profile.street !== "preflop") {
    return strategyOpenAction({ equity, metrics, profile, position, context: "single-raised", rangeModel });
  }

  return preflopStrategyActions({
    handCode: profile.handCode,
    position,
    context: "check-option",
    stackBb: metrics.effectiveStack,
  });
}

function buildReasons({ equityResult, metrics, profile, rangeInfo, position, context, rangeModel, policySource }) {
  const reasons = [
    `权益 ${pct(equityResult.equity, 1)} / 胜率 ${pct(equityResult.win, 1)}`,
    metrics.toCall > 0 ? `底池赔率 ${pct(metrics.potOdds, 1)}` : `SPR ${round(metrics.spr, 1)}`,
    `对手范围 ${round(rangeInfo.percent * 100, 1)}% (${rangeInfo.combos} combos)`,
    `范围角色 ${rangeModel.roleLabel} / 分位 ${pct(rangeModel.percentile, 0)}`,
    policySource.type === "trained" ? `训练策略 ${policySource.version}` : null,
    policySource.type === "preflop" ? `翻前范围表 ${policySource.version}` : null,
    profile.street === "preflop" ? `起手牌 ${profile.handCode}` : `${profile.description}`,
    `位置 ${position} / ${context}`,
  ].filter(Boolean);

  if (profile.draws.flushDraw) reasons.push("同花听牌");
  if (profile.draws.openEnded) reasons.push("开放顺听牌");
  if (rangeModel.blockers >= 0.07) reasons.push("阻断关键强牌");
  if (rangeModel.advantage >= 0.58 && profile.street !== "preflop") reasons.push("进攻方范围优势");
  if (profile.texture.label && profile.street !== "preflop") reasons.push(`牌面 ${profile.texture.label}`);

  return reasons.slice(0, 8);
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
  const rangeInfo = rangeCoverage(activeRange);
  const rangeModel = buildRangeModel({
    hero,
    board,
    rangeWeights: activeRange,
    rangeInfo,
    profile,
    position,
    context,
    equity: equityResult.equity,
  });
  const heuristicActions =
    metrics.toCall > 0
      ? strategyFacingBet({ equity: equityResult.equity, metrics, profile, position, context, rangeModel })
      : hasFreeCheckOption(context)
        ? strategyCheckOption({ equity: equityResult.equity, metrics, profile, position, rangeModel })
        : strategyOpenAction({ equity: equityResult.equity, metrics, profile, position, context, rangeModel });
  const trained = applyTrainedPolicy({
    actions: heuristicActions,
    board,
    equity: equityResult.equity,
    metrics,
    profile,
    rangeModel,
    rangeInfo,
    position,
    context,
  });
  const actions = trained?.actions || heuristicActions;
  const policySource = trained
    ? {
        type: "trained",
        version: trained.artifact.version,
        artifactId: trained.artifact.artifactId,
        blend: trained.artifact.blend,
        validation: trained.artifact.validation,
      }
    : profile.street === "preflop"
      ? { type: "preflop", version: PREFLOP_POLICY_VERSION }
      : { type: "heuristic", version: "range-role-v1" };
  const baseSizing = chooseSizing({
    board,
    metrics,
    profile,
    equity: equityResult.equity,
    toCall: metrics.toCall,
    context,
    position,
  });
  const sizing = alignSizingWithActions(baseSizing, actions, board, metrics.toCall);

  return {
    actions,
    sizing,
    equity: equityResult,
    profile,
    metrics,
    range: activeRange,
    rangeInfo,
    rangeModel,
    policySource,
    reasons: buildReasons({
      equityResult,
      metrics,
      profile,
      rangeInfo,
      position,
      context,
      rangeModel,
      policySource,
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
