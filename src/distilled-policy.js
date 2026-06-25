import { clamp, RANK_VALUE, cardRank } from "./poker-core.js";
import { distilledPolicyArtifact } from "./distilled-policy-artifact.js";

// Runtime consumer for the GTO-distilled open policy. The network was trained on
// features computed by scripts/solver/gen_solved_dataset.py:build_features, so
// this file reproduces those exact formulas from the engine's quantities to keep
// feature parity. It applies only to river OPEN (no-call) decisions; everywhere
// else the engine falls back to the solved table / trained / heuristic policy.
//
// DEFAULT OFF: the distilled policy currently covers only river OPEN decisions,
// so enabling it alone leaves facing nodes heuristic (bounded benefit) and shifts
// the behavioral audit. The plumbing ships ready; activate with
// globalThis.__ENABLE_DISTILL__ = true once facing-node distillation lands and the
// audit is reconciled with GTO-style checking. The exploitability harness flips
// this on via ENABLE_DISTILL=1.

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
};

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
  // fallback: a bump around the hand equity
  const buckets = Array.from({ length: 10 }, (_, i) => Math.max(0.02, 1 - Math.abs(i + 0.5 - clamp(equity, 0, 0.999) * 10) / 2.2));
  const total = buckets.reduce((s, v) => s + v, 0) || 1;
  return buckets.map((v) => v / total);
}

// Builds the 33-d feature vector in the artifact's featureNames order, matching
// gen_solved_dataset.build_features (river open, context_aggressor=1, free_check=1).
function buildFeatures({ hero, equity, hist, profile, metrics, position }) {
  const texture = profile.texture || {};
  const wet = clamp(texture.wetness || 0, 0, 1);
  const paired = texture.paired ? 1 : 0;
  const monotone = texture.monotone ? 1 : 0;
  const connected = texture.connected ? 1 : 0;
  const histMean = histogramMean(hist);
  const advantage = clamp(0.5 + (histMean - 0.5) * 0.72 + 0.05 - wet * 0.045, 0.18, 0.82);
  const cov = clamp(0.22 + histogramStd(hist) * 1.6 + (1 - wet) * 0.22, 0.08, 1);
  const spr = clamp((metrics.spr || 0) / 20, 0, 1);
  const made = clamp(MADE_HAND_WEIGHT[profile.madeName] || 0, 0, 1);
  const hasAce = hero.some((c) => RANK_VALUE[cardRank(c)] === 14) ? 1 : 0;
  const blockers = clamp(hasAce * 0.055 + (1 - wet) * Math.max(0, 0.48 - equity) * 0.08, 0, 0.24);
  // percentile: approximate the equity rank via the histogram CDF at this equity
  const bucket = clamp(Math.floor(equity * hist.length), 0, hist.length - 1);
  let cdf = 0;
  for (let i = 0; i < bucket; i += 1) cdf += hist[i];
  const percentile = clamp(cdf + hist[bucket] * 0.5, 0, 1);
  const rangeWeight = clamp(0.22 + percentile * 0.62 + advantage * 0.16, 0, 1);

  const f = {
    equity: clamp(equity, 0, 1),
    pot_odds: 0, spr_norm: spr,
    street_flop: 0, street_turn: 0, street_river: 1,
    position_signal: POSITION_SIGNAL[position] ?? 0.5,
    to_call_flag: 0, made_strength: made, draw_strength: 0,
    wetness: wet, paired, monotone, connected,
    range_advantage: advantage, blockers, range_percentile: percentile,
    range_weight: rangeWeight, range_coverage: cov,
    context_aggressor: 1, three_bet: 0, facing_bet: 0, free_check: 1,
  };
  hist.forEach((v, i) => {
    f[`range_eq_${i * 10}_${i * 10 + 10}`] = v;
  });
  return distilledPolicyArtifact.featureNames.map((name) => Number(f[name] || 0));
}

function forward(values) {
  let v = values;
  const layers = distilledPolicyArtifact.model.layers;
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
  const exps = v.map((x) => Math.exp(x - max));
  const total = exps.reduce((s, x) => s + x, 0) || 1;
  return exps.map((x) => x / total);
}

export function distilledOpenActions({ hero, board, equity, equityHistogram, profile, metrics, position }) {
  if (!globalThis.__ENABLE_DISTILL__) return null; // default off (see header)
  if (!distilledPolicyArtifact.enabled || !distilledPolicyArtifact.passed) return null;
  if (!board || board.length !== 5 || profile.street !== "river") return null;
  if (!hero || hero.length !== 2) return null;
  if ((metrics.toCall || 0) > 0) return null; // open (no-call) decisions only

  const hist = normalizeHistogram(equityHistogram, equity);
  const probs = forward(buildFeatures({ hero, equity, hist, profile, metrics, position }));
  const keys = distilledPolicyArtifact.actionSets.open;
  if (probs.length !== keys.length) return null;
  return keys
    .map((key, i) => ({ ...(ACTION_LABELS[key] || { key, label: key, tone: "neutral" }), frequency: probs[i] }))
    .sort((a, b) => b.frequency - a.frequency);
}
