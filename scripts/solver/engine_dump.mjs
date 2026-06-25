// Dump the live strategy engine's river strategy onto a solver betting tree.
//
// Reads a spec JSON (written by engine_exploitability.py) describing a river spot
// and its decision nodes, queries recommendStrategy() for every (node, combo),
// maps the engine's bucketed actions onto each node's tree actions, and writes
// the per-node [combo x action] strategy arrays back out as JSON. This lets the
// Python solver measure the engine's EXACT exploitability vs the GTO baseline.
//
// Usage: node engine_dump.mjs <spec.json> <out.json>

import { readFileSync, writeFileSync } from "node:fs";
import { recommendStrategy } from "../../src/strategy-engine.js";
import { allHandCodes } from "../../src/poker-core.js";

const [, , specPath, outPath] = process.argv;
const spec = JSON.parse(readFileSync(specPath, "utf8"));

// Opponent range for equity: full range (weight 1 on every hand class) so it
// matches a full-combo solver spot.
const fullRange = Object.fromEntries(allHandCodes().map((code) => [code, 1]));

function sum(actions, keys) {
  return keys.reduce((total, key) => total + (actions.find((a) => a.key === key)?.frequency || 0), 0);
}

function mapToTree(treeActions, engineActions) {
  // treeActions: e.g. ["check","bet0.75"] | ["fold","call","raise"] | ["fold","call"]
  const betKeys = ["bet-small", "bet-mid", "bet-big", "bet-over"];
  const raiseKeys = ["raise-small", "raise-big", "jam"];
  const probs = treeActions.map((key) => {
    if (key === "check") return sum(engineActions, ["check"]);
    if (key.startsWith("bet")) return sum(engineActions, betKeys);
    if (key === "fold") return sum(engineActions, ["fold"]);
    if (key === "raise") return sum(engineActions, raiseKeys);
    if (key === "call") {
      // a plain call node (fold/call) absorbs the engine's raise mass as "continue"
      const hasRaise = treeActions.includes("raise");
      return hasRaise ? sum(engineActions, ["call"]) : sum(engineActions, ["call", ...raiseKeys]);
    }
    return 0;
  });
  const total = probs.reduce((a, b) => a + b, 0);
  if (total <= 1e-9) return treeActions.map(() => 1 / treeActions.length);
  return probs.map((p) => p / total);
}

const strategies = {};
for (const node of spec.nodes) {
  const position = node.player === 0 ? spec.posOOP : spec.posIP;
  const context = node.toCall > 0 ? "facing-bet" : "single-raised";
  const rows = spec.combos.map((combo) => {
    const result = recommendStrategy({
      hero: combo,
      board: spec.board,
      position,
      context,
      pot: node.pot,
      toCall: node.toCall,
      stackBb: spec.stackBb,
      opponents: 1,
      rangeWeights: fullRange,
      iterations: spec.iterations,
    });
    return mapToTree(node.actions, result.actions);
  });
  strategies[node.index] = rows;
}

writeFileSync(outPath, JSON.stringify({ strategies }));
console.error(`dumped ${spec.nodes.length} nodes x ${spec.combos.length} combos`);
