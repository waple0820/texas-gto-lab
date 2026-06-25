import pokerSolver from "pokersolver";

export const Hand = pokerSolver.Hand || pokerSolver.default?.Hand;

if (!Hand) {
  throw new Error("pokersolver Hand API was not loaded");
}

export const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
export const SUITS = [
  { id: "s", glyph: "♠", label: "Spades", tone: "black" },
  { id: "h", glyph: "♥", label: "Hearts", tone: "red" },
  { id: "d", glyph: "♦", label: "Diamonds", tone: "red" },
  { id: "c", glyph: "♣", label: "Clubs", tone: "black" },
];

export const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
export const ACTION_CONTEXTS = [
  { id: "unopened", label: "未入池" },
  { id: "check-option", label: "可免费看牌" },
  { id: "facing-open", label: "面对 open" },
  { id: "facing-3bet", label: "面对 3bet" },
  { id: "blind-defense", label: "盲注防守" },
  { id: "single-raised", label: "单挑底池" },
  { id: "three-bet-pot", label: "3bet 底池" },
  { id: "facing-bet", label: "面对下注" },
  { id: "facing-raise", label: "面对加注" },
];

export const RANGE_STYLES = [
  { id: "tight", label: "紧" },
  { id: "balanced", label: "均衡" },
  { id: "loose", label: "松" },
  { id: "wide", label: "宽" },
];

export const RANK_VALUE = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const HAND_NAME_SCORE = {
  "High Card": 0,
  Pair: 1,
  "Two Pair": 2,
  "Three of a Kind": 3,
  Straight: 4,
  Flush: 5,
  "Full House": 6,
  "Four of a Kind": 7,
  "Straight Flush": 8,
  "Royal Flush": 9,
};

const STYLE_BASE_WIDTH = {
  tight: 0.14,
  balanced: 0.23,
  loose: 0.34,
  wide: 0.48,
};

const POSITION_WIDTH = {
  UTG: -0.055,
  HJ: -0.025,
  CO: 0.025,
  BTN: 0.085,
  SB: 0.015,
  BB: 0.045,
};

const CONTEXT_WIDTH = {
  unopened: 0,
  "check-option": 0.03,
  "facing-open": -0.06,
  "facing-3bet": -0.135,
  "blind-defense": 0.13,
  "single-raised": 0.02,
  "three-bet-pot": -0.06,
  "facing-bet": -0.03,
  "facing-raise": -0.105,
};

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function pct(value, digits = 0) {
  return `${round(value * 100, digits)}%`;
}

export function makeDeck() {
  return RANKS.flatMap((rank) => SUITS.map((suit) => `${rank}${suit.id}`));
}

export function cardRank(card) {
  return card?.slice(0, 1);
}

export function cardSuit(card) {
  return card?.slice(1, 2);
}

export function cardLabel(card) {
  if (!card) return "";
  const suit = SUITS.find((item) => item.id === cardSuit(card));
  return `${cardRank(card)}${suit?.glyph || cardSuit(card)}`;
}

export function suitTone(card) {
  return SUITS.find((item) => item.id === cardSuit(card))?.tone || "black";
}

export function validateCards(cards) {
  const clean = cards.filter(Boolean);
  const seen = new Set();
  const duplicates = [];
  for (const card of clean) {
    if (seen.has(card)) duplicates.push(card);
    seen.add(card);
  }
  return {
    ok: duplicates.length === 0,
    duplicates,
  };
}

export function shuffle(array, rng = Math.random) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function drawFromDeck(deck, used, rng = Math.random) {
  const available = deck.filter((card) => !used.has(card));
  if (!available.length) return null;
  const card = available[Math.floor(rng() * available.length)];
  used.add(card);
  return card;
}

export function handCodeFromCards(cards) {
  if (!cards || cards.length < 2) return "";
  const [a, b] = cards;
  const ar = cardRank(a);
  const br = cardRank(b);
  const av = RANK_VALUE[ar];
  const bv = RANK_VALUE[br];
  if (ar === br) return `${ar}${br}`;
  const high = av > bv ? ar : br;
  const low = av > bv ? br : ar;
  return `${high}${low}${cardSuit(a) === cardSuit(b) ? "s" : "o"}`;
}

export function matrixCode(rowIndex, colIndex) {
  const rowRank = RANKS[rowIndex];
  const colRank = RANKS[colIndex];
  if (rowIndex === colIndex) return `${rowRank}${colRank}`;
  if (rowIndex < colIndex) return `${rowRank}${colRank}s`;
  return `${colRank}${rowRank}o`;
}

export function allHandCodes() {
  const codes = [];
  for (let row = 0; row < RANKS.length; row += 1) {
    for (let col = 0; col < RANKS.length; col += 1) {
      codes.push(matrixCode(row, col));
    }
  }
  return codes;
}

export function comboCountForCode(code) {
  if (!code) return 0;
  if (code.length === 2) return 6;
  return code.endsWith("s") ? 4 : 12;
}

export function scoreHandCode(code) {
  if (!code) return 0;
  const first = code[0];
  const second = code[1];
  const high = Math.max(RANK_VALUE[first], RANK_VALUE[second]);
  const low = Math.min(RANK_VALUE[first], RANK_VALUE[second]);

  if (code.length === 2) {
    const pairPremium = high >= 10 ? 8 : high >= 7 ? 4 : 0;
    return 48 + high * 3.1 + pairPremium;
  }

  const suited = code.endsWith("s");
  const gap = Math.abs(high - low) - 1;
  const broadway = high >= 10 && low >= 10 ? 8 : 0;
  const aceQuality = high === 14 ? 5 + low * 0.25 : 0;
  const connectivity = Math.max(0, 8.5 - gap * 2.15);
  const suitedBonus = suited ? 6.4 : 0;
  const lowOffsuitPenalty = !suited && high <= 10 && low <= 7 ? 5 : 0;
  const dominatedPenalty = !suited && high === 14 && low < 9 ? 2.5 : 0;

  return high * 3.15 + low * 1.7 + broadway + aceQuality + connectivity + suitedBonus - lowOffsuitPenalty - dominatedPenalty;
}

export function buildRangeWeights({
  style = "balanced",
  position = "CO",
  context = "unopened",
  tableSize = 6,
  stackBb = 100,
} = {}) {
  const tableAdjustment = Number(tableSize) >= 8 ? -0.035 : Number(tableSize) <= 2 ? 0.13 : 0;
  const stackAdjustment = Number(stackBb) < 25 ? 0.075 : Number(stackBb) > 170 ? -0.025 : 0;
  const width = clamp(
    (STYLE_BASE_WIDTH[style] ?? STYLE_BASE_WIDTH.balanced) +
      (POSITION_WIDTH[position] ?? 0) +
      (CONTEXT_WIDTH[context] ?? 0) +
      tableAdjustment +
      stackAdjustment,
    0.035,
    0.92,
  );

  const sorted = allHandCodes()
    .map((code) => ({ code, score: scoreHandCode(code), combos: comboCountForCode(code) }))
    .sort((a, b) => b.score - a.score);

  const targetCombos = 1326 * width;
  const weights = {};
  let usedCombos = 0;

  for (const item of sorted) {
    if (usedCombos >= targetCombos) {
      weights[item.code] = 0;
      continue;
    }
    const remaining = targetCombos - usedCombos;
    if (remaining >= item.combos) {
      weights[item.code] = 1;
      usedCombos += item.combos;
    } else {
      weights[item.code] = remaining / item.combos >= 0.12 ? round(remaining / item.combos, 2) : 0;
      usedCombos += Math.max(0, remaining);
    }
  }

  return weights;
}

export function rangeCoverage(weights) {
  const combos = Object.entries(weights || {}).reduce((sum, [code, weight]) => {
    return sum + comboCountForCode(code) * Number(weight || 0);
  }, 0);
  return {
    combos: round(combos, 1),
    percent: combos / 1326,
  };
}

export function generateCombosForCode(code) {
  if (!code) return [];
  const first = code[0];
  const second = code[1];
  const combos = [];

  if (code.length === 2) {
    for (let i = 0; i < SUITS.length; i += 1) {
      for (let j = i + 1; j < SUITS.length; j += 1) {
        combos.push([`${first}${SUITS[i].id}`, `${second}${SUITS[j].id}`]);
      }
    }
    return combos;
  }

  if (code.endsWith("s")) {
    for (const suit of SUITS) {
      combos.push([`${first}${suit.id}`, `${second}${suit.id}`]);
    }
    return combos;
  }

  for (const highSuit of SUITS) {
    for (const lowSuit of SUITS) {
      if (highSuit.id !== lowSuit.id) {
        combos.push([`${first}${highSuit.id}`, `${second}${lowSuit.id}`]);
      }
    }
  }
  return combos;
}

export function expandRangeWeights(weights, blockedCards = []) {
  const blocked = new Set(blockedCards.filter(Boolean));
  const combos = [];
  for (const [code, rawWeight] of Object.entries(weights || {})) {
    const weight = Number(rawWeight || 0);
    if (weight <= 0) continue;
    for (const combo of generateCombosForCode(code)) {
      if (!blocked.has(combo[0]) && !blocked.has(combo[1])) {
        combos.push({ cards: combo, code, weight });
      }
    }
  }
  return combos;
}

export function pickWeightedCombo(combos, used, rng = Math.random) {
  let total = 0;
  for (const combo of combos) {
    if (!used.has(combo.cards[0]) && !used.has(combo.cards[1])) {
      total += combo.weight;
    }
  }
  if (total <= 0) return null;

  let roll = rng() * total;
  for (const combo of combos) {
    if (used.has(combo.cards[0]) || used.has(combo.cards[1])) continue;
    roll -= combo.weight;
    if (roll <= 0) return combo.cards;
  }
  return null;
}

export function randomHoleCombo(used, rng = Math.random) {
  const deck = makeDeck().filter((card) => !used.has(card));
  if (deck.length < 2) return null;
  const first = deck.splice(Math.floor(rng() * deck.length), 1)[0];
  const second = deck.splice(Math.floor(rng() * deck.length), 1)[0];
  return [first, second];
}

export function solveCards(cards) {
  if (!cards || cards.length < 5) return null;
  return Hand.solve(cards);
}

export function compareSolvedHands(solvedHands) {
  return Hand.winners(solvedHands);
}

export function calculateEquity({
  hero,
  board = [],
  rangeWeights,
  opponents = 1,
  iterations = 1200,
  rng = Math.random,
} = {}) {
  if (!hero || hero.length !== 2) {
    throw new Error("Hero hand must contain exactly two cards");
  }
  if (board.length > 5) {
    throw new Error("Board cannot contain more than five cards");
  }
  const validation = validateCards([...hero, ...board]);
  if (!validation.ok) {
    throw new Error(`Duplicate cards: ${validation.duplicates.join(", ")}`);
  }

  const deck = makeDeck();
  const known = [...hero, ...board].filter(Boolean);
  const baseCombos = expandRangeWeights(rangeWeights, known);
  const safeIterations = clamp(Number(iterations) || 1200, 80, 12000);
  const playerCount = clamp(Number(opponents) || 1, 1, 8);

  let share = 0;
  let wins = 0;
  let ties = 0;
  const distribution = {};

  for (let i = 0; i < safeIterations; i += 1) {
    const used = new Set(known);
    const villains = [];

    for (let seat = 0; seat < playerCount; seat += 1) {
      const combo = pickWeightedCombo(baseCombos, used, rng) || randomHoleCombo(used, rng);
      if (!combo) continue;
      used.add(combo[0]);
      used.add(combo[1]);
      villains.push(combo);
    }

    const runout = [...board];
    while (runout.length < 5) {
      const card = drawFromDeck(deck, used, rng);
      if (!card) break;
      runout.push(card);
    }

    const heroSolved = solveCards([...hero, ...runout]);
    const solvedHands = [heroSolved, ...villains.map((cards) => solveCards([...cards, ...runout]))].filter(Boolean);
    const winners = compareSolvedHands(solvedHands);
    const heroWonShare = winners.includes(heroSolved) ? 1 / winners.length : 0;
    share += heroWonShare;
    if (heroWonShare === 1) wins += 1;
    if (heroWonShare > 0 && heroWonShare < 1) ties += 1;
    distribution[heroSolved.name] = (distribution[heroSolved.name] || 0) + 1;
  }

  const sortedDistribution = Object.entries(distribution)
    .map(([name, count]) => ({ name, count, percent: count / safeIterations }))
    .sort((a, b) => (HAND_NAME_SCORE[b.name] ?? 0) - (HAND_NAME_SCORE[a.name] ?? 0));

  return {
    equity: share / safeIterations,
    win: wins / safeIterations,
    tie: ties / safeIterations,
    lose: 1 - share / safeIterations,
    iterations: safeIterations,
    opponents: playerCount,
    distribution: sortedDistribution,
  };
}

export function currentStreet(board) {
  const count = board?.length || 0;
  if (count === 0) return "preflop";
  if (count === 3) return "flop";
  if (count === 4) return "turn";
  if (count === 5) return "river";
  return "partial";
}

export function analyzeMadeHand(hero, board = []) {
  const combined = [...hero, ...board].filter(Boolean);
  const handCode = handCodeFromCards(hero);
  const preflopScore = scoreHandCode(handCode);

  if (combined.length < 5) {
    return {
      street: "preflop",
      handCode,
      preflopScore,
      madeName: "Preflop",
      madeRank: 0,
      description: handCode || "No hand",
      draws: analyzeDraws(hero, board),
      texture: analyzeBoardTexture(board),
    };
  }

  const solved = solveCards(combined);
  return {
    street: currentStreet(board),
    handCode,
    preflopScore,
    madeName: solved.name,
    madeRank: HAND_NAME_SCORE[solved.name] ?? 0,
    description: solved.descr,
    draws: analyzeDraws(hero, board),
    texture: analyzeBoardTexture(board),
  };
}

export function analyzeBoardTexture(board = []) {
  if (!board.length) {
    return {
      paired: false,
      monotone: false,
      twoTone: false,
      connected: false,
      wetness: 0,
      label: "Preflop",
    };
  }
  const rankCounts = {};
  const suitCounts = {};
  for (const card of board) {
    rankCounts[cardRank(card)] = (rankCounts[cardRank(card)] || 0) + 1;
    suitCounts[cardSuit(card)] = (suitCounts[cardSuit(card)] || 0) + 1;
  }
  const ranks = [...new Set(board.map((card) => RANK_VALUE[cardRank(card)]))].sort((a, b) => a - b);
  if (ranks.includes(14)) ranks.unshift(1);
  const paired = Object.values(rankCounts).some((count) => count > 1);
  const maxSuit = Math.max(...Object.values(suitCounts));
  let connected = false;
  for (let i = 0; i < ranks.length; i += 1) {
    const window = ranks.filter((rank) => rank >= ranks[i] && rank <= ranks[i] + 4);
    if (window.length >= Math.min(3, board.length)) connected = true;
  }
  const wetness = clamp((connected ? 0.34 : 0) + (maxSuit >= 3 ? 0.32 : maxSuit === 2 ? 0.16 : 0) + (paired ? -0.08 : 0), 0, 1);
  const label = [
    paired ? "paired" : null,
    maxSuit >= 3 ? "monotone" : maxSuit === 2 ? "two-tone" : null,
    connected ? "connected" : "static",
  ]
    .filter(Boolean)
    .join(" / ");
  return {
    paired,
    monotone: maxSuit >= 3,
    twoTone: maxSuit === 2,
    connected,
    wetness,
    label,
  };
}

export function analyzeDraws(hero = [], board = []) {
  const cards = [...hero, ...board].filter(Boolean);
  const suitCounts = {};
  for (const card of cards) {
    suitCounts[cardSuit(card)] = (suitCounts[cardSuit(card)] || 0) + 1;
  }
  const maxSuit = Math.max(0, ...Object.values(suitCounts));
  const values = [...new Set(cards.map((card) => RANK_VALUE[cardRank(card)]))].sort((a, b) => a - b);
  if (values.includes(14)) values.unshift(1);
  let straightDraw = false;
  let openEnded = false;
  for (let low = 1; low <= 10; low += 1) {
    const window = [low, low + 1, low + 2, low + 3, low + 4];
    const hits = window.filter((rank) => values.includes(rank));
    if (hits.length >= 4) {
      straightDraw = true;
      const missing = window.find((rank) => !values.includes(rank));
      if (missing === low || missing === low + 4) openEnded = true;
    }
  }
  const boardHigh = Math.max(0, ...board.map((card) => RANK_VALUE[cardRank(card)]));
  const overcards = hero.filter((card) => RANK_VALUE[cardRank(card)] > boardHigh).length;
  return {
    flushDraw: board.length >= 3 && maxSuit === 4,
    madeFlush: maxSuit >= 5,
    backdoorFlush: board.length === 3 && maxSuit === 3,
    straightDraw,
    openEnded,
    overcards,
  };
}

export function computeDecisionMetrics({ equity, pot, toCall, effectiveStack, betSize } = {}) {
  const cleanPot = Math.max(0, Number(pot) || 0);
  const cleanCall = Math.max(0, Number(toCall) || 0);
  const cleanStack = Math.max(0, Number(effectiveStack) || 0);
  const cleanBet = Math.max(0, Number(betSize) || cleanPot * 0.75 || 1);
  const potOdds = cleanCall > 0 ? cleanCall / (cleanPot + cleanCall) : 0;
  const callEv = cleanCall > 0 ? equity * (cleanPot + cleanCall) - (1 - equity) * cleanCall : 0;
  const mdf = cleanCall > 0 ? cleanPot / (cleanPot + cleanCall) : 1;
  const betBreakevenFold = cleanBet / (cleanPot + cleanBet);
  const spr = cleanPot > 0 ? cleanStack / cleanPot : cleanStack;
  return {
    pot: cleanPot,
    toCall: cleanCall,
    effectiveStack: cleanStack,
    potOdds,
    callEv,
    mdf,
    betBreakevenFold,
    spr,
  };
}

export function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
