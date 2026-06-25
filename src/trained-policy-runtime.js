import { clamp } from "./poker-core.js";
import { trainedPolicyArtifact } from "./trained-policy-artifact.js";

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

const POSITION_SIGNAL = {
  UTG: 0.22,
  HJ: 0.36,
  CO: 0.58,
  BTN: 0.76,
  SB: 0.34,
  BB: 0.3,
};

function drawStrength(draws = {}) {
  return clamp(
    (draws.flushDraw ? 0.13 : 0) +
      (draws.openEnded ? 0.11 : 0) +
      (draws.straightDraw && !draws.openEnded ? 0.07 : 0) +
      (draws.backdoorFlush ? 0.035 : 0) +
      Math.min(0.08, (draws.overcards || 0) * 0.036),
    0,
    0.28,
  );
}

function contextAggressor(context) {
  return ["unopened", "single-raised", "three-bet-pot"].includes(context) ? 1 : 0;
}

function featureMap({ equity, metrics, profile, rangeModel, rangeInfo, position, context }) {
  const texture = profile.texture || {};
  const street = profile.street || "preflop";
  return {
    equity: clamp(equity, 0, 1),
    pot_odds: clamp(metrics.potOdds || 0, 0, 0.75),
    spr_norm: clamp((metrics.spr || 0) / 20, 0, 1),
    street_flop: street === "flop" ? 1 : 0,
    street_turn: street === "turn" ? 1 : 0,
    street_river: street === "river" ? 1 : 0,
    position_signal: POSITION_SIGNAL[position] ?? 0.5,
    to_call_flag: metrics.toCall > 0 ? 1 : 0,
    made_strength: clamp(MADE_HAND_WEIGHT[profile.madeName] || 0, 0, 1),
    draw_strength: drawStrength(profile.draws),
    wetness: clamp(texture.wetness || 0, 0, 1),
    paired: texture.paired ? 1 : 0,
    monotone: texture.monotone ? 1 : 0,
    connected: texture.connected ? 1 : 0,
    range_advantage: clamp(rangeModel.advantage || 0.5, 0, 1),
    blockers: clamp(rangeModel.blockers || 0, 0, 0.25),
    range_percentile: clamp(rangeModel.percentile || 0, 0, 1),
    range_weight: clamp(rangeModel.rangeWeight || 0, 0, 1),
    range_coverage: clamp((rangeInfo.percent || 0) / 0.6, 0, 1),
    context_aggressor: contextAggressor(context),
    three_bet: context === "three-bet-pot" || context === "facing-3bet" ? 1 : 0,
    facing_bet: metrics.toCall > 0 ? 1 : 0,
    free_check: ["check-option", "limped-pot", "blind-check"].includes(context) ? 1 : 0,
  };
}

function relu(values) {
  return values.map((value) => Math.max(0, value));
}

function dense(inputs, layer, activate = true) {
  const outputs = layer.bias.map((bias, row) => {
    let value = bias;
    const weights = layer.weights[row];
    for (let col = 0; col < weights.length; col += 1) {
      value += weights[col] * inputs[col];
    }
    return value;
  });
  return activate ? relu(outputs) : outputs;
}

function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0) || 1;
  return exps.map((value) => value / total);
}

function regretMatch(regrets) {
  const positive = regrets.map((value) => Math.max(0, value));
  const total = positive.reduce((sum, value) => sum + value, 0);
  if (total <= 1e-8) return regrets.map(() => 1 / regrets.length);
  return positive.map((value) => value / total);
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

function runModel(features) {
  const model = trainedPolicyArtifact.model;
  if (!model?.layers?.length) return null;
  let values = trainedPolicyArtifact.featureNames.map((name) => Number(features[name] || 0));
  if (values.some((value) => !Number.isFinite(value))) return null;
  model.layers.forEach((layer, index) => {
    values = dense(values, layer, index < model.layers.length - 1);
  });
  if (trainedPolicyArtifact.policyKind === "regret-matching" || model.type === "mlp-regret") {
    return regretMatch(values);
  }
  return softmax(values);
}

export function applyTrainedPolicy({ actions, board, equity, metrics, profile, rangeModel, rangeInfo, position, context }) {
  if (!trainedPolicyArtifact.enabled || !trainedPolicyArtifact.passed) return null;
  if ((board?.length || 0) < 3 || profile.street === "preflop") return null;
  const probs = runModel(featureMap({ equity, metrics, profile, rangeModel, rangeInfo, position, context }));
  if (!probs?.length) return null;

  const actionKeys = metrics.toCall > 0
    ? trainedPolicyArtifact.actionSets?.facing || ["fold", "call", "raise"]
    : trainedPolicyArtifact.actionSets?.open || ["check", "bet-small", "bet-big"];
  if (probs.length !== actionKeys.length) return null;
  const byKey = new Map(actions.map((action) => [action.key, action]));
  if (!actionKeys.every((key) => byKey.has(key))) return null;

  const blend = clamp(Number(trainedPolicyArtifact.blend || 0.68), 0, 0.95);
  return {
    artifact: trainedPolicyArtifact,
    actions: normalize(
      actionKeys.map((key, index) => {
        const base = byKey.get(key);
        return {
          ...base,
          trainedFrequency: probs[index],
          weight: base.frequency * (1 - blend) + probs[index] * blend,
        };
      }),
    ),
  };
}
