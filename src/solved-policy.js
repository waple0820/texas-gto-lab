import { solvedRiverArtifact } from "./solved-river-artifact.js";

// Runtime consumer for exact-CFR solved river strategies. When the current spot
// matches a solved entry, the strategy engine plays the equilibrium strategy for
// the hero's exact combo instead of the heuristic. This is how solver output
// reaches the product; coverage grows by solving more spots in export_solved.py.

const TREE_TO_ENGINE = {
  check: { key: "check", label: "过牌", tone: "neutral" },
  bet: { key: "bet-mid", label: "中注", tone: "accent" },
  fold: { key: "fold", label: "弃牌", tone: "danger" },
  call: { key: "call", label: "跟注", tone: "neutral" },
  raise: { key: "raise-big", label: "大加注", tone: "strong" },
};

function mapTreeAction(treeKey) {
  if (treeKey === "check") return TREE_TO_ENGINE.check;
  if (treeKey.startsWith("bet")) return TREE_TO_ENGINE.bet;
  return TREE_TO_ENGINE[treeKey] || { key: treeKey, label: treeKey, tone: "neutral" };
}

function comboKey(hero) {
  return [...hero].sort().join("");
}

function boardKey(board) {
  return [...board].sort().join("");
}

// Index solved spots by board. Each board carries MULTIPLE depth tiers (the
// same texture solved at different stacks behind), so the value is a list.
// The consumer contract (per-node `stack` recorded by export_solved.py) is
// versioned: refuse an artifact that predates it rather than guessing depths.
const ARTIFACT_OK = String(solvedRiverArtifact?.version || "").startsWith("solved-river-v2");
const spotIndex = new Map();
if (ARTIFACT_OK) {
  for (const spot of solvedRiverArtifact.spots || []) {
    const key = boardKey(spot.board);
    if (!spotIndex.has(key)) spotIndex.set(key, []);
    spotIndex.get(key).push(spot);
  }
}

function matchNode(spot, player, pot, toCall) {
  let best = null;
  let bestDelta = Infinity;
  for (const node of spot.nodes) {
    if (node.player !== player) continue;
    const facing = toCall > 0 ? 1 : 0;
    const nodeFacing = node.toCall > 0 ? 1 : 0;
    if (facing !== nodeFacing) continue;
    const delta = Math.abs(node.pot - pot) + Math.abs(node.toCall - toCall);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = node;
    }
  }
  // require a close match so we never misapply a solved node
  return bestDelta <= 0.5 ? best : null;
}

// A depth tier's equilibrium is only valid near the stack it was solved at:
// the betting tree caps every line at that stack, so a much deeper effective
// stack has raises the tree cannot express and a much shallower one breaks
// its bet/jam thresholds. Each node records the acting player's remaining
// stack (written by export_solved.py where the tree builder guarantees it);
// the gate FAILS CLOSED — no recorded node stack, or a missing/zero/garbage
// effective stack from the caller, rejects the tier rather than serving one
// depth's frequencies at an unknown depth.
const STACK_RATIO_MIN = 0.6;
const STACK_RATIO_MAX = 1.6;

function depthRatio(node, effectiveStack) {
  if (!Number.isFinite(effectiveStack) || effectiveStack <= 0) return null;
  const expected = Number(node.stack);
  if (!Number.isFinite(expected) || expected <= 0) return null;
  const ratio = effectiveStack / expected;
  return ratio >= STACK_RATIO_MIN && ratio <= STACK_RATIO_MAX ? ratio : null;
}

export function lookupSolvedActions({ board, position, toCall = 0, pot = 0, stackBb, hero } = {}) {
  if (!board || board.length !== 5 || !hero || hero.length !== 2) return null;
  const spots = spotIndex.get(boardKey(board));
  if (!spots) return null;

  // Among depth tiers whose node matches this pot/toCall AND whose depth band
  // contains the live effective stack, play the tier closest to it (ratio
  // nearest 1). No tier in range -> null, and the distilled model takes over.
  let node = null;
  let bestDistance = Infinity;
  for (const spot of spots) {
    const player = position === spot.posOOP ? 0 : position === spot.posIP ? 1 : null;
    if (player === null) continue;
    const candidate = matchNode(spot, player, pot, toCall);
    if (!candidate) continue;
    const ratio = depthRatio(candidate, stackBb);
    if (ratio === null) continue;
    const distance = Math.abs(Math.log(ratio));
    if (distance < bestDistance) {
      bestDistance = distance;
      node = candidate;
    }
  }
  if (!node) return null;
  const probs = node.strategy[comboKey(hero)];
  if (!probs) return null;

  const actions = node.actions.map((treeKey, index) => {
    const mapped = mapTreeAction(treeKey);
    return { ...mapped, frequency: Math.max(0, probs[index] || 0) };
  });
  const total = actions.reduce((sum, a) => sum + a.frequency, 0);
  if (total <= 1e-9) return null;
  return actions
    .map((a) => ({ ...a, frequency: a.frequency / total }))
    .sort((a, b) => b.frequency - a.frequency);
}

export function solvedSpotCount() {
  return spotIndex.size;
}
