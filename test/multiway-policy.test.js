import assert from "node:assert/strict";
import { buildRangeWeights, mulberry32 } from "../src/poker-core.js";
import { recommendStrategy } from "../src/strategy-engine.js";

function recommend({ hero, board, position = "BTN", context, tableSize, opponents, pot, toCall, seed }) {
  return recommendStrategy({
    hero,
    board,
    position,
    context,
    tableSize,
    opponents,
    stackBb: 100,
    pot,
    toCall,
    rangeWeights: buildRangeWeights({ style: "balanced", position, context, tableSize, stackBb: 100 }),
    iterations: 900,
    rng: mulberry32(seed),
  });
}

const reportedMultiwayTurn = recommend({
  hero: ["7s", "5c"],
  board: ["Kc", "Kd", "6h", "2c"],
  context: "facing-bet",
  tableSize: 3,
  opponents: 2,
  pot: 11,
  toCall: 2.2,
  seed: 2103,
});
assert.equal(reportedMultiwayTurn.policySource.type, "multiway");
assert.equal(reportedMultiwayTurn.policySource.equilibrium, false);
assert.equal(reportedMultiwayTurn.actions[0].key, "fold");
assert.ok((reportedMultiwayTurn.actions.find((action) => action.key === "call")?.frequency || 0) < 0.25);
assert.ok(reportedMultiwayTurn.reasons.some((reason) => reason.includes("非纳什均衡解")));

globalThis.__ENABLE_DISTILL__ = false;
const reportedMultiwayTurnWithoutDistill = recommend({
  hero: ["7s", "5c"],
  board: ["Kc", "Kd", "6h", "2c"],
  context: "facing-bet",
  tableSize: 3,
  opponents: 2,
  pot: 11,
  toCall: 2.2,
  seed: 2103,
});
globalThis.__ENABLE_DISTILL__ = true;
assert.deepEqual(
  reportedMultiwayTurn.actions.map(({ key, frequency }) => [key, frequency]),
  reportedMultiwayTurnWithoutDistill.actions.map(({ key, frequency }) => [key, frequency]),
  "multiway postflop actions must not depend on heads-up distillation",
);

const sameTurnHeadsUp = recommend({
  hero: ["7s", "5c"],
  board: ["Kc", "Kd", "6h", "2c"],
  context: "facing-bet",
  tableSize: 2,
  opponents: 1,
  pot: 11,
  toCall: 2.2,
  seed: 2103,
});
assert.equal(sameTurnHeadsUp.policySource.type, "distilled");

const canonicalRiverHeadsUp = recommend({
  hero: ["As", "Ah"],
  board: ["Qc", "Jd", "9s", "4h", "2c"],
  context: "single-raised",
  tableSize: 2,
  opponents: 1,
  pot: 10,
  toCall: 0,
  seed: 91,
});
assert.equal(canonicalRiverHeadsUp.policySource.type, "solved");

const canonicalRiverMultiway = recommend({
  hero: ["As", "Ah"],
  board: ["Qc", "Jd", "9s", "4h", "2c"],
  context: "single-raised",
  tableSize: 3,
  opponents: 2,
  pot: 10,
  toCall: 0,
  seed: 91,
});
assert.equal(canonicalRiverMultiway.policySource.type, "multiway");
assert.notEqual(canonicalRiverMultiway.policySource.type, "solved");

const sixMaxPreflop = recommend({
  hero: ["As", "Kh"],
  board: [],
  position: "CO",
  context: "unopened",
  tableSize: 6,
  opponents: 5,
  pot: 1.5,
  toCall: 0,
  seed: 44,
});
assert.equal(sixMaxPreflop.policySource.type, "preflop");

// A 6-max hand that reaches the flop with ONE live opponent is a heads-up
// subgame: the GTO policies must fire. Guarding on seats-dealt-in used to
// silently disable solved/distilled everywhere on the 6-max battle table.
const sixMaxHeadsUpFlop = recommend({
  hero: ["As", "Ah"],
  board: ["2c", "7d", "9h"],
  context: "single-raised",
  tableSize: 6,
  opponents: 1,
  pot: 6,
  toCall: 0,
  seed: 7,
});
assert.equal(sixMaxHeadsUpFlop.policySource.type, "distilled");

const sixMaxHeadsUpCanonicalRiver = recommend({
  hero: ["As", "Ah"],
  board: ["Qc", "Jd", "9s", "4h", "2c"],
  context: "single-raised",
  tableSize: 6,
  opponents: 1,
  pot: 10,
  toCall: 0,
  seed: 91,
});
assert.equal(sixMaxHeadsUpCanonicalRiver.policySource.type, "solved");

console.log("multiway policy boundary tests passed");
