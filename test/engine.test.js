import assert from "node:assert/strict";
import {
  buildRangeWeights,
  calculateEquity,
  comboCountForCode,
  expandRangeWeights,
  handCodeFromCards,
  makeDeck,
  matrixCode,
  mulberry32,
  rangeCoverage,
  solveCards,
} from "../src/poker-core.js";
import { recommendStrategy } from "../src/strategy-engine.js";
import { HoldemSimulator } from "../src/simulator.js";

const deck = makeDeck();
assert.equal(deck.length, 52);
assert.equal(new Set(deck).size, 52);

assert.equal(handCodeFromCards(["As", "Ks"]), "AKs");
assert.equal(handCodeFromCards(["Ah", "Kd"]), "AKo");
assert.equal(handCodeFromCards(["Qh", "Qs"]), "QQ");
assert.equal(matrixCode(0, 0), "AA");
assert.equal(matrixCode(0, 1), "AKs");
assert.equal(matrixCode(1, 0), "AKo");
assert.equal(comboCountForCode("AA"), 6);
assert.equal(comboCountForCode("AKs"), 4);
assert.equal(comboCountForCode("AKo"), 12);

const solved = solveCards(["As", "Ks", "Qs", "Js", "Ts", "2d", "3c"]);
assert.equal(solved.name, "Straight Flush");

const range = buildRangeWeights({
  style: "balanced",
  position: "CO",
  context: "unopened",
  tableSize: 6,
  stackBb: 100,
});
const coverage = rangeCoverage(range);
assert.ok(coverage.percent > 0.18 && coverage.percent < 0.32, `coverage ${coverage.percent}`);
assert.ok(expandRangeWeights(range, ["As", "Ah"]).every((combo) => !combo.cards.includes("As") && !combo.cards.includes("Ah")));

const aaEquity = calculateEquity({
  hero: ["As", "Ah"],
  board: [],
  rangeWeights: buildRangeWeights({ style: "wide", position: "BB", context: "blind-defense", tableSize: 2 }),
  opponents: 1,
  iterations: 500,
  rng: mulberry32(42),
});
assert.ok(aaEquity.equity > 0.72, `AA equity ${aaEquity.equity}`);

const recommendation = recommendStrategy({
  hero: ["As", "Ah"],
  board: [],
  position: "BTN",
  context: "unopened",
  pot: 1.5,
  toCall: 0,
  stackBb: 100,
  rangeWeights: range,
  iterations: 300,
  rng: mulberry32(11),
});
assert.equal(Math.round(recommendation.actions.reduce((sum, action) => sum + action.frequency, 0) * 100), 100);
assert.ok(recommendation.actions[0].frequency > 0.35);

const bbCheckOption = recommendStrategy({
  hero: ["4c", "6d"],
  board: [],
  position: "BB",
  context: "check-option",
  pot: 2,
  toCall: 0,
  stackBb: 98,
  iterations: 300,
  rng: mulberry32(12),
});
assert.ok(bbCheckOption.actions.some((action) => action.key === "check"));
assert.ok(!bbCheckOption.actions.some((action) => action.key === "fold"));
assert.notEqual(bbCheckOption.actions[0].key, "fold");
assert.match(bbCheckOption.sizing.label, /隔离|加注/);

const openOption = recommendStrategy({
  hero: ["4c", "6d"],
  board: [],
  position: "BTN",
  context: "unopened",
  pot: 1.5,
  toCall: 0,
  stackBb: 100,
  iterations: 300,
  rng: mulberry32(13),
});
assert.ok(openOption.actions.some((action) => action.key === "fold"));

const flopCheckOption = recommendStrategy({
  hero: ["As", "Qd"],
  board: ["Ah", "7c", "2s"],
  position: "BTN",
  context: "single-raised",
  pot: 6,
  toCall: 0,
  stackBb: 95,
  iterations: 300,
  rng: mulberry32(14),
});
assert.ok(flopCheckOption.actions.some((action) => action.key === "check"));
assert.ok(!flopCheckOption.actions.some((action) => action.key === "fold"));

const sim = new HoldemSimulator({ rng: mulberry32(7) });
assert.equal(sim.heroHole.length, 2);
assert.equal(sim.aiHole.length, 2);
sim.playerAction("check-call");
assert.ok(["ai", null].includes(sim.toAct));

console.log("engine tests passed");
