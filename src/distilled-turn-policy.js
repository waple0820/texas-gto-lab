import { clamp, RANK_VALUE, cardRank, cardSuit } from "./poker-core.js";
import { distilledTurnArtifact } from "./distilled-turn-artifact.js";
import { distillTemperature } from "./distill-calibration.js";

// Runtime consumer for the GTO-distilled TURN policy (unified open + facing,
// distill-turn-v1). Companion to src/distilled-policy.js (river). The network was
// trained by scripts/solver/gen_turn_dataset.py on features computed there
// (turn_features) from the EXACT enumerated two-street turn solver (turn_cfr),
// with street_turn=1. This file reproduces those exact formulas from the engine's
// quantities to keep feature parity. It applies to TURN decisions (board.length
// === 4): OPEN (no call, 5 actions) and FACING a bet (3 actions: fold/call/jam).
//
// The model has 5 outputs; for FACING they are read as [fold, call, jam, _, _]
// (targets were padded), so only the first 3 are used and renormalized — the same
// open/facing context switch the river unified model uses, distinguished by the
// facing flag in the features. Disable with globalThis.__ENABLE_DISTILL__ = false.

const MADE_HAND_WEIGHT = {
  Preflop: 0, "High Card": 0, Pair: 0.12, "Two Pair": 0.32, "Three of a Kind": 0.48,
  Straight: 0.62, Flush: 0.68, "Full House": 0.78, "Four of a Kind": 0.9,
  "Straight Flush": 0.96, "Royal Flush": 1,
};
const POSITION_SIGNAL = { UTG: 0.22, HJ: 0.36, CO: 0.58, BTN: 0.76, SB: 0.34, BB: 0.3 };

const ACTION_LABELS = {
  check: { key: "check", label: "过牌", tone: "neutral" },
  "bet-small": { key: "bet-small", label: "小注", tone: "accent" },
  "bet-mid": { key: "bet-mid", label: "中注", tone: "accent" },
  "bet-big": { key: "bet-big", label: "大注", tone: "strong" },
  "bet-over": { key: "bet-over", label: "超池", tone: "strong" },
  fold: { key: "fold", label: "弃牌", tone: "danger" },
  call: { key: "call", label: "跟注", tone: "neutral" },
  "raise-small": { key: "raise-small", label: "小加注", tone: "accent" },
  "raise-big": { key: "raise-big", label: "大加注", tone: "strong" },
  jam: { key: "jam", label: "全压", tone: "strong" },
};

// Mirror trained-policy-runtime.drawStrength (fed by poker-core.analyzeDraws,
// which the engine already computed into profile.draws). Parity with
// gen_turn_dataset.draw_strength.
function drawStrength(draws = {}) {
  return clamp(
    (draws.flushDraw ? 0.13 : 0)
      + (draws.openEnded ? 0.11 : 0)
      + (draws.straightDraw && !draws.openEnded ? 0.07 : 0)
      + (draws.backdoorFlush ? 0.035 : 0)
      + Math.min(0.08, (draws.overcards || 0) * 0.036),
    0,
    0.28,
  );
}

function histogramMean(hist) {
  return hist.reduce((sum, v, i) => sum + ((i + 0.5) / hist.length) * v, 0);
}

function histogramStd(hist) {
  const mean = hist.reduce((s, v) => s + v, 0) / hist.length;
  const varr = hist.reduce((s, v) => s + (v - mean) ** 2, 0) / hist.length;
  return Math.sqrt(varr);
}

function normalizeHistogram(equityHistogram, equity) {
  if (Array.isArray(equityHistogram) && equityHistogram.length === 10) {
    const total = equityHistogram.reduce((s, v) => s + Math.max(0, v), 0);
    if (total > 1e-8) return equityHistogram.map((v) => Math.max(0, v) / total);
  }
  const buckets = Array.from({ length: 10 }, (_, i) => Math.max(0.02, 1 - Math.abs(i + 0.5 - clamp(equity, 0, 0.999) * 10) / 2.2));
  const total = buckets.reduce((s, v) => s + v, 0) || 1;
  return buckets.map((v) => v / total);
}

// Granular blockers from the hero combo + 4-card turn board, reproducing
// gen_solved_dataset.blocker_features exactly (only one suit can be 3+ of 4
// board cards, so flush_suit is unambiguous): flush_blocker (holds a card of a
// 3+ suit), nut_flush_blocker (holds the ace of it), top_blocker (holds a card
// matching the highest board rank), board_pair_blocker (board has a paired rank
// and hero holds that rank).
function blockerFeatures(hero, board) {
  const suitCounts = {};
  board.forEach((c) => {
    const s = cardSuit(c);
    suitCounts[s] = (suitCounts[s] || 0) + 1;
  });
  const flushSuit = Object.keys(suitCounts).find((s) => suitCounts[s] >= 3) ?? null;
  const fl = flushSuit != null && hero.some((c) => String(cardSuit(c)) === flushSuit) ? 1 : 0;
  const nutfl = flushSuit != null
    && hero.some((c) => String(cardSuit(c)) === flushSuit && RANK_VALUE[cardRank(c)] === 14) ? 1 : 0;
  const ranks = board.map((c) => RANK_VALUE[cardRank(c)]);
  const topRank = Math.max(...ranks);
  const top = hero.some((c) => RANK_VALUE[cardRank(c)] === topRank) ? 1 : 0;
  const counts = {};
  ranks.forEach((r) => { counts[r] = (counts[r] || 0) + 1; });
  const pairedRanks = new Set(Object.keys(counts).filter((r) => counts[r] >= 2).map(Number));
  const pblk = pairedRanks.size > 0 && hero.some((c) => pairedRanks.has(RANK_VALUE[cardRank(c)])) ? 1 : 0;
  return { flush_blocker: fl, nut_flush_blocker: nutfl, top_blocker: top, board_pair_blocker: pblk };
}

// Builds the feature vector in the artifact's featureNames order, matching
// gen_turn_dataset.turn_features (street_turn=1; open vs facing toggles
// context_aggressor/free_check/facing_bet/to_call_flag/pot_odds and the +0.05
// aggressor term in range_advantage).
function buildFeatures({ hero, board, equity, hist, profile, metrics, position, facing }) {
  const texture = profile.texture || {};
  const wet = clamp(texture.wetness || 0, 0, 1);
  const paired = texture.paired ? 1 : 0;
  const monotone = texture.monotone ? 1 : 0;
  const connected = texture.connected ? 1 : 0;
  const histMean = histogramMean(hist);
  const advantage = clamp(0.5 + (histMean - 0.5) * 0.72 + (facing ? 0 : 0.05) - wet * 0.045, 0.18, 0.82);
  const cov = clamp(0.22 + histogramStd(hist) * 1.6 + (1 - wet) * 0.22, 0.08, 1);
  const spr = clamp((metrics.spr || 0) / 20, 0, 1);
  const made = clamp(MADE_HAND_WEIGHT[profile.madeName] || 0, 0, 1);
  const hasAce = hero.some((c) => RANK_VALUE[cardRank(c)] === 14) ? 1 : 0;
  const blockers = clamp(hasAce * 0.055 + (1 - wet) * Math.max(0, 0.48 - equity) * 0.08, 0, 0.24);
  const bucket = clamp(Math.floor(equity * hist.length), 0, hist.length - 1);
  let cdf = 0;
  for (let i = 0; i < bucket; i += 1) cdf += hist[i];
  const percentile = clamp(cdf + hist[bucket] * 0.5, 0, 1);
  const rangeWeight = clamp(0.22 + percentile * 0.62 + advantage * 0.16, 0, 1);

  const f = {
    equity: clamp(equity, 0, 1),
    pot_odds: 0, spr_norm: spr,
    street_flop: 0, street_turn: 1, street_river: 0,
    position_signal: POSITION_SIGNAL[position] ?? 0.5,
    to_call_flag: 0, made_strength: made, draw_strength: drawStrength(profile.draws),
    wetness: wet, paired, monotone, connected,
    range_advantage: advantage, blockers, range_percentile: percentile,
    range_weight: rangeWeight, range_coverage: cov,
    context_aggressor: facing ? 0 : 1, three_bet: 0,
    facing_bet: facing ? 1 : 0, free_check: facing ? 0 : 1,
    ...blockerFeatures(hero, board),
  };
  if (facing) {
    f.pot_odds = clamp(metrics.potOdds || 0, 0, 0.75);
    f.to_call_flag = 1;
  }
  hist.forEach((v, i) => {
    f[`range_eq_${i * 10}_${i * 10 + 10}`] = v;
  });
  return distilledTurnArtifact.featureNames.map((name) => Number(f[name] || 0));
}

function forward(values) {
  let v = values;
  const layers = distilledTurnArtifact.model.layers;
  layers.forEach((layer, idx) => {
    const out = layer.bias.map((b, row) => {
      const w = layer.weights[row];
      let acc = b;
      for (let c = 0; c < w.length; c += 1) acc += w[c] * v[c];
      return acc;
    });
    v = idx < layers.length - 1 ? out.map((x) => Math.max(0, x)) : out;
  });
  const max = Math.max(...v);
  const temp = distillTemperature("turn");
  const exps = v.map((x) => Math.exp((x - max) / temp));
  const total = exps.reduce((s, x) => s + x, 0) || 1;
  return exps.map((x) => x / total);
}

// Distilled GTO policy for TURN decisions: open (no call, 5 actions) and facing a
// bet (3 actions read from the first 3 of the 5 outputs, then renormalized).
// Readiness gate. distill-turn-v2 adds the draw_strength feature (turn betting
// hinges on draws, which raw equity doesn't separate) and clears the bar:
// held-out facing TV 0.113, open TV 0.180, and the turn-decision A/B beats the
// heuristic on every board tested (ON ~23.5% vs OFF ~29.6% pot — ~6pp closer to
// GTO). v1 (no draws) was a wash. This gate stays as the kill-switch for retrains.
const TURN_DISTILL_READY = true;

export function distilledTurnActions({ hero, board, equity, equityHistogram, profile, metrics, position }) {
  if (!TURN_DISTILL_READY) return null;
  if (globalThis.__ENABLE_DISTILL__ === false) return null;
  if (!distilledTurnArtifact.enabled || !distilledTurnArtifact.passed) return null;
  if (!board || board.length !== 4 || profile.street !== "turn") return null;
  if (!hero || hero.length !== 2) return null;

  const facing = (metrics.toCall || 0) > 0;
  const hist = normalizeHistogram(equityHistogram, equity);
  const probs = forward(buildFeatures({ hero, board, equity, hist, profile, metrics, position, facing }));
  const keys = facing ? distilledTurnArtifact.actionSets.facing : distilledTurnArtifact.actionSets.open;
  const used = probs.slice(0, keys.length);
  const total = used.reduce((s, x) => s + x, 0) || 1;
  return keys
    .map((key, i) => ({ ...(ACTION_LABELS[key] || { key, label: key, tone: "neutral" }), frequency: used[i] / total }))
    .sort((a, b) => b.frequency - a.frequency);
}
