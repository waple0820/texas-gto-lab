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
import { trainedPolicyArtifact } from "../src/trained-policy-artifact.js";
import { preflopStrategyActions } from "../src/preflop-policy.js";

assert.equal(trainedPolicyArtifact.passed, true);
assert.equal(trainedPolicyArtifact.featureNames.length, 33);
assert.ok(trainedPolicyArtifact.featureNames.includes("range_eq_0_10"));
assert.ok(trainedPolicyArtifact.featureNames.includes("range_eq_90_100"));
assert.equal(trainedPolicyArtifact.model.trainingTarget, "average-strategy-distilled-from-turn-river-cascaded-physical-regret");
assert.ok(trainedPolicyArtifact.training.showdownRollouts > 0);
assert.ok(trainedPolicyArtifact.training.riverOracleHands > 0);
assert.ok(trainedPolicyArtifact.training.turnOracleHands > 0);
assert.ok(trainedPolicyArtifact.training.equityCacheBoards > 0);

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
assert.equal(recommendation.policySource.type, "preflop");
assert.equal(recommendation.actions[0].key, "raise");
assert.ok(recommendation.actions[0].frequency > 0.98);
assert.ok(!recommendation.actions.some((action) => action.key === "call"));
assert.ok(recommendation.sizing.options.some((option) => option.label === "2.2bb open"));
assert.ok(recommendation.sizing.options.some((option) => option.label === "2.5bb open"));

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
assert.ok(bbCheckOption.sizing.options.some((option) => option.label.includes("隔离")));

const huButtonOpen = preflopStrategyActions({
  handCode: "K2s",
  position: "SB",
  context: "unopened",
  tableSize: 2,
  stackBb: 100,
});
assert.equal(huButtonOpen[0].key, "raise");

const huButtonFold = preflopStrategyActions({
  handCode: "72o",
  position: "SB",
  context: "unopened",
  tableSize: 2,
  stackBb: 100,
});
assert.equal(huButtonFold[0].key, "fold");

const huBbDefend = preflopStrategyActions({
  handCode: "72s",
  position: "BB",
  context: "blind-defense",
  tableSize: 2,
  stackBb: 100,
});
assert.equal(huBbDefend[0].key, "call");

const huButtonVsThreeBet = preflopStrategyActions({
  handCode: "A2s",
  position: "SB",
  context: "facing-3bet",
  tableSize: 2,
  stackBb: 100,
});
assert.deepEqual(
  huButtonVsThreeBet.map((action) => action.key),
  ["fold", "raise"],
);

const sixMaxUtgFold = preflopStrategyActions({
  handCode: "72o",
  position: "UTG",
  context: "unopened",
  tableSize: 6,
  stackBb: 100,
});
assert.equal(sixMaxUtgFold[0].key, "fold");

const sixMaxBbVsBtnAces = preflopStrategyActions({
  handCode: "AA",
  position: "BB",
  context: "blind-defense",
  aggressorPosition: "BTN",
  tableSize: 6,
  stackBb: 100,
});
assert.equal(sixMaxBbVsBtnAces[0].key, "raise");
assert.ok(!sixMaxBbVsBtnAces.some((action) => action.key === "jam"));

const sixMaxBtnVsUtg = preflopStrategyActions({
  handCode: "AQo",
  position: "BTN",
  context: "facing-open",
  aggressorPosition: "UTG",
  tableSize: 6,
  stackBb: 100,
});
assert.equal(sixMaxBtnVsUtg[0].key, "raise");

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

const aksFacingThreeBet = recommendStrategy({
  hero: ["Ah", "Kh"],
  board: [],
  position: "BTN",
  context: "facing-3bet",
  tableSize: 6,
  pot: 6,
  toCall: 12,
  stackBb: 100,
  opponents: 1,
  iterations: 300,
  rng: mulberry32(21),
});
assert.equal(aksFacingThreeBet.policySource.type, "preflop");
assert.equal(aksFacingThreeBet.actions[0].key, "raise");
assert.ok((aksFacingThreeBet.actions.find((action) => action.key === "fold")?.frequency || 0) < 0.01);
assert.ok((aksFacingThreeBet.actions.find((action) => action.key === "call")?.frequency || 0) > 0.2);

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
assert.ok(flopCheckOption.sizing.options.some((option) => option.label === "33% pot"));
assert.ok(flopCheckOption.sizing.options.some((option) => option.label === "75% pot"));

const betFrequency = (recommendation) =>
  recommendation.actions
    .filter((action) => ["bet-small", "bet-mid", "bet-big", "bet-over", "raise", "raise-small", "raise-big", "jam"].includes(action.key))
    .reduce((sum, action) => sum + action.frequency, 0);
const raiseFrequency = (recommendation) =>
  recommendation.actions
    .filter((action) => ["raise", "raise-small", "raise-big", "jam"].includes(action.key))
    .reduce((sum, action) => sum + action.frequency, 0);

const dryBoardBlockerBluff = recommendStrategy({
  hero: ["Ah", "5c"],
  board: ["Kd", "8s", "2h"],
  position: "BTN",
  context: "single-raised",
  pot: 6,
  toCall: 0,
  stackBb: 95,
  rangeWeights: buildRangeWeights({ style: "balanced", position: "BTN", context: "single-raised", tableSize: 2 }),
  iterations: 500,
  rng: mulberry32(17),
});
assert.equal(trainedPolicyArtifact.passed, true);
assert.equal(trainedPolicyArtifact.policyKind, "regret-matching");
assert.equal(trainedPolicyArtifact.model.type, "mlp-regret");
assert.equal(dryBoardBlockerBluff.policySource.type, "trained");
assert.equal(dryBoardBlockerBluff.rangeModel.role, "blocker-bluff");
assert.ok(betFrequency(dryBoardBlockerBluff) > 0.15, `blocker bluff frequency ${betFrequency(dryBoardBlockerBluff)}`);
assert.ok(betFrequency(dryBoardBlockerBluff) < 0.5, `blocker bluff overfire ${betFrequency(dryBoardBlockerBluff)}`);
assert.ok(dryBoardBlockerBluff.reasons.some((reason) => reason.includes("范围角色")));
assert.ok(dryBoardBlockerBluff.reasons.some((reason) => reason.includes("训练策略")));
assert.ok(dryBoardBlockerBluff.reasons.some((reason) => reason.includes("阻断")));

const wetBoardLowAir = recommendStrategy({
  hero: ["5h", "2c"],
  board: ["Qd", "Jd", "Tc"],
  position: "BTN",
  context: "single-raised",
  pot: 6,
  toCall: 0,
  stackBb: 95,
  rangeWeights: buildRangeWeights({ style: "balanced", position: "BTN", context: "single-raised", tableSize: 2 }),
  iterations: 500,
  rng: mulberry32(18),
});
assert.equal(wetBoardLowAir.actions[0].key, "check");
assert.ok(betFrequency(wetBoardLowAir) < 0.5, `wet low-air overbluff ${betFrequency(wetBoardLowAir)}`);

const semiBluffRaise = recommendStrategy({
  hero: ["Ah", "Qh"],
  board: ["Kh", "8h", "2c"],
  position: "BTN",
  context: "facing-bet",
  pot: 8,
  toCall: 4,
  stackBb: 92,
  rangeWeights: buildRangeWeights({ style: "balanced", position: "BTN", context: "facing-bet", tableSize: 2 }),
  iterations: 500,
  rng: mulberry32(19),
});
assert.ok(
  raiseFrequency(semiBluffRaise) > 0.18,
);

const weakLineRiverBluff = recommendStrategy({
  hero: ["5c", "7h"],
  board: ["6s", "9c", "Qs", "Jh", "Qc"],
  position: "CO",
  context: "facing-raise",
  pot: 3.1,
  toCall: 0.6,
  stackBb: 98,
  rangeWeights: buildRangeWeights({ style: "balanced", position: "CO", context: "facing-raise", tableSize: 6 }),
  iterations: 700,
  rng: mulberry32(2103),
  lineProfile: { weakProbe: true, passiveOpponentLine: true, previousChecks: 2, previousAggression: 0, currentBetFraction: 0.24, passiveScore: 0.9 },
});
assert.ok(raiseFrequency(weakLineRiverBluff) > 0.14, `weak-line bluff raise ${raiseFrequency(weakLineRiverBluff)}`);
assert.ok(weakLineRiverBluff.reasons.some((reason) => reason.includes("弱线小注")));

const riverPolarSizing = recommendStrategy({
  hero: ["As", "Qs"],
  board: ["Ks", "Js", "Ts", "2d", "7c"],
  position: "BTN",
  context: "single-raised",
  pot: 12,
  toCall: 0,
  stackBb: 100,
  iterations: 300,
  rng: mulberry32(15),
});
assert.ok(riverPolarSizing.sizing.options.some((option) => option.label === "125% pot"));
assert.ok(riverPolarSizing.sizing.options.some((option) => option.label === "150% pot"));

const lowSprSizing = recommendStrategy({
  hero: ["Ah", "Ad"],
  board: ["Ac", "Kd", "7s"],
  position: "SB",
  context: "three-bet-pot",
  pot: 36,
  toCall: 0,
  stackBb: 16,
  iterations: 300,
  rng: mulberry32(16),
});
assert.equal(lowSprSizing.sizing.label, "All-in / 低 SPR");
assert.ok(lowSprSizing.sizing.options[0].recommended);

const sim = new HoldemSimulator({ rng: mulberry32(7) });
assert.equal(sim.heroHole.length, 2);
assert.equal(sim.aiHole.length, 2);
assert.equal(sim.contextForActor("hero", sim.getToCall("hero")), "unopened");
sim.playerAction("check-call");
assert.ok(["ai", null].includes(sim.toAct));

console.log("engine tests passed");
