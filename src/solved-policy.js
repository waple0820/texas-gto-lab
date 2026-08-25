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

// index solved spots by board for O(1) lookup
const spotIndex = new Map();
for (const spot of solvedRiverArtifact?.spots || []) {
  spotIndex.set(boardKey(spot.board), spot);
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

// The artifact's equilibrium is only valid near the stack depth it was solved
// at: the betting tree caps every line at spot.stack, so at a much deeper
// effective stack the real equilibrium has raises/jams this tree cannot
// express, and at a much shallower one its bet/jam thresholds are wrong.
// Reconstruct the acting player's expected remaining stack at this node from
// the tree geometry (invested = (node.pot - spot.pot - node.toCall) / 2 in a
// heads-up subgame) and accept only when the engine's effective stack is in
// the same regime; outside it the SPR-conditioned distilled model is the more
// faithful policy.
const STACK_RATIO_MIN = 0.6;
const STACK_RATIO_MAX = 1.6;

function stackMatches(spot, node, effectiveStack) {
  if (!Number.isFinite(effectiveStack) || effectiveStack <= 0) return true; // caller opted out
  const invested = Math.max(0, (node.pot - spot.pot - node.toCall) / 2);
  const expected = spot.stack - invested;
  if (expected <= 0) return true; // all-in node: nothing left to size
  const ratio = effectiveStack / expected;
  return ratio >= STACK_RATIO_MIN && ratio <= STACK_RATIO_MAX;
}

export function lookupSolvedActions({ board, position, toCall = 0, pot = 0, stackBb = 0, hero } = {}) {
  if (!board || board.length !== 5 || !hero || hero.length !== 2) return null;
  const spot = spotIndex.get(boardKey(board));
  if (!spot) return null;
  let player;
  if (position === spot.posOOP) player = 0;
  else if (position === spot.posIP) player = 1;
  else return null;

  const node = matchNode(spot, player, pot, toCall);
  if (!node) return null;
  if (!stackMatches(spot, node, stackBb)) return null;
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
