import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRangeWeights, cardLabel, mulberry32, round } from "../src/poker-core.js";
import { AI_LEVELS, HoldemSimulator } from "../src/simulator.js";
import { pickAction, recommendStrategy } from "../src/strategy-engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HANDS = Number(process.env.STRATEGY_AUDIT_HANDS || 100);
const SEED = Number(process.env.STRATEGY_AUDIT_SEED || 20260625);
const ITERATIONS = Number(process.env.STRATEGY_AUDIT_ITERATIONS || 320);
const MAX_DECISIONS_PER_HAND = 90;
const REPORT_PATH = path.join(ROOT, "artifacts", "strategy-audit-latest.json");
const PREMIUM = new Set(["AA", "KK", "QQ", "JJ", "AKs", "AKo"]);
const FREE_CHECK_CONTEXTS = new Set(["check-option", "limped-pot", "blind-check"]);

function frequency(actions, key) {
  return actions.find((action) => action.key === key)?.frequency || 0;
}

function aggressiveFrequency(actions) {
  return actions
    .filter((action) => ["bet-small", "bet-mid", "bet-big", "bet-over", "raise", "raise-small", "raise-big", "jam"].includes(action.key))
    .reduce((sum, action) => sum + action.frequency, 0);
}

function issue(severity, code, message, extra = {}) {
  return { severity, code, message, ...extra };
}

function analyzeDecision({ actor, toCall, context, recommendation }) {
  const actions = recommendation.actions || [];
  const issues = [];
  const sum = actions.reduce((total, action) => total + action.frequency, 0);
  const foldFreq = frequency(actions, "fold");
  const aggroFreq = aggressiveFrequency(actions);
  const top = actions[0];
  const street = recommendation.profile.street;
  const handCode = recommendation.profile.handCode;
  const equity = recommendation.equity.equity;
  const potOdds = recommendation.metrics.potOdds;
  // Exact-CFR / distilled GTO outputs are verified by exploitability; the EV-shape
  // heuristics below (calibrated for the heuristic engine) assume equity vs a wide
  // range and false-flag GTO's correct bluff-catcher folds, so trust GTO sources
  // for those. Structural invariants (sum-to-1, no free-fold, etc.) still apply to
  // every source.
  const trustGto = ["solved", "distilled"].includes(recommendation.policySource?.type);

  if (!actions.length) {
    issues.push(issue("critical", "no_actions", "No actions were produced."));
    return issues;
  }
  if (!Number.isFinite(sum) || Math.abs(sum - 1) > 0.015) {
    issues.push(issue("critical", "frequency_sum", "Action frequencies do not sum to 1.", { sum: round(sum, 4) }));
  }
  if (actions.some((action) => !Number.isFinite(action.frequency) || action.frequency < -0.001 || action.frequency > 1.001)) {
    issues.push(issue("critical", "invalid_frequency", "At least one action has an invalid frequency."));
  }
  if (street !== "preflop" && toCall <= 0 && foldFreq > 0.001) {
    issues.push(issue("critical", "postflop_free_fold", "Postflop no-call spot should not offer fold.", { foldFreq: round(foldFreq, 4) }));
  }
  if (FREE_CHECK_CONTEXTS.has(context) && foldFreq > 0.001) {
    issues.push(issue("critical", "free_check_fold", "Free-check preflop context should not offer fold.", { foldFreq: round(foldFreq, 4) }));
  }
  if (street === "preflop" && context === "facing-3bet" && PREMIUM.has(handCode) && foldFreq > 0.05) {
    issues.push(issue("critical", "premium_facing_3bet_fold", "Premium hand is folding too often versus 3bet.", { handCode, foldFreq: round(foldFreq, 4) }));
  }
  if (street === "preflop" && context === "unopened" && PREMIUM.has(handCode) && top?.key !== "raise") {
    issues.push(issue("critical", "premium_unopened_not_raise", "Premium unopened preflop hand is not raising first.", { handCode, top: top?.key }));
  }
  // Skip preflop: this check estimates call-EV from equity vs a WIDE range, which
  // is badly wrong preflop where 3bet/raise ranges are narrow and strong (folding
  // e.g. AJo to a 3bet is often correct). Premium preflop over-folds are still
  // caught by premium_facing_3bet_fold.
  if (!trustGto && street !== "preflop" && toCall > 0 && recommendation.metrics.callEv > 6 && equity > potOdds + 0.12 && foldFreq > 0.5) {
    issues.push(
      issue("warning", "positive_call_ev_high_fold", "High positive call-EV spot is folding too often.", {
        callEv: round(recommendation.metrics.callEv, 2),
        equity: round(equity, 4),
        potOdds: round(potOdds, 4),
        foldFreq: round(foldFreq, 4),
      }),
    );
  }

  if (street !== "preflop" && top?.frequency > 0.985) {
    issues.push(issue("warning", "near_pure_postflop", "Postflop strategy is nearly pure; inspect whether this should be mixed.", { top: top.key, topFreq: round(top.frequency, 4) }));
  }
  if (street !== "preflop" && toCall <= 0 && equity > 0.75 && aggroFreq < 0.35) {
    issues.push(issue("warning", "strong_hand_passive", "Strong postflop hand has low betting frequency.", { equity: round(equity, 4), aggroFreq: round(aggroFreq, 4) }));
  }
  if (street !== "preflop" && equity < 0.12 && aggroFreq > 0.8 && recommendation.rangeModel.blockers < 0.06) {
    issues.push(issue("warning", "low_equity_over_aggression", "Very low equity hand is highly aggressive without clear blockers.", { equity: round(equity, 4), aggroFreq: round(aggroFreq, 4), actor }));
  }

  return issues;
}

function actionIdForPick(picked, recommendation, toCall) {
  if (toCall > 0) {
    if (picked.key === "fold") return "fold";
    if (picked.key === "jam") return "allin";
    if (picked.key === "raise-big" || picked.key === "raise") return "pot";
    if (picked.key === "raise-small") return "half";
    return "check-call";
  }
  if (picked.key === "bet-small") return "third";
  if (picked.key === "bet-mid") return "half";
  if (picked.key === "bet-big" || picked.key === "raise") return "pot";
  if (picked.key === "bet-over") return "overbet";
  return "check-call";
}

function positionForActor(actor) {
  return actor === "hero" ? "BTN" : "BB";
}

function auditRecommendation({ simulator, actor, rng }) {
  const toCall = simulator.getToCall(actor);
  const context = simulator.contextForActor(actor, toCall);
  const position = positionForActor(actor);
  const hole = actor === "hero" ? simulator.heroHole : simulator.aiHole;
  const effectiveStack = Math.max(1, Math.min(simulator.heroStack, simulator.aiStack));
  const rangeWeights = buildRangeWeights({
    style: AI_LEVELS.solver.rangeStyle,
    position,
    context,
    tableSize: 2,
    stackBb: effectiveStack,
  });
  const recommendation = recommendStrategy({
    hero: hole,
    board: simulator.board,
    position,
    context,
    tableSize: 2,
    stackBb: effectiveStack,
    pot: simulator.pot,
    toCall,
    opponents: 1,
    rangeWeights,
    iterations: ITERATIONS,
    rng,
    lineProfile: simulator.lineProfileForActor(actor, toCall),
  });
  const picked = pickAction(recommendation.actions, rng, 1);
  const actionId = actionIdForPick(picked, recommendation, toCall);
  const issues = analyzeDecision({ actor, toCall, context, recommendation });

  return {
    actor,
    street: simulator.street,
    board: [...simulator.board],
    boardText: simulator.board.map(cardLabel).join(" "),
    hole: [...hole],
    holeText: hole.map(cardLabel).join(" "),
    position,
    context,
    pot: round(simulator.pot, 1),
    toCall,
    stacks: {
      hero: round(simulator.heroStack, 1),
      ai: round(simulator.aiStack, 1),
    },
    policySource: recommendation.policySource,
    handCode: recommendation.profile.handCode,
    madeName: recommendation.profile.madeName,
    equity: round(recommendation.equity.equity, 4),
    win: round(recommendation.equity.win, 4),
    potOdds: round(recommendation.metrics.potOdds, 4),
    callEv: round(recommendation.metrics.callEv, 2),
    spr: round(recommendation.metrics.spr, 2),
    rangeRole: recommendation.rangeModel.role,
    blockerScore: round(recommendation.rangeModel.blockers, 4),
    sizing: recommendation.sizing.label,
    topAction: {
      key: recommendation.actions[0]?.key,
      label: recommendation.actions[0]?.label,
      frequency: round(recommendation.actions[0]?.frequency || 0, 4),
    },
    picked: {
      key: picked.key,
      label: picked.label,
      frequency: round(frequency(recommendation.actions, picked.key), 4),
      appliedAction: actionId,
    },
    mix: recommendation.actions.map((action) => ({
      key: action.key,
      label: action.label,
      frequency: round(action.frequency, 4),
    })),
    reasons: recommendation.reasons,
    issues,
  };
}

function summarize(hands) {
  const allIssues = hands.flatMap((hand) =>
    hand.decisions.flatMap((decision) =>
      decision.issues.map((item) => ({
        ...item,
        hand: hand.hand,
        actor: decision.actor,
        street: decision.street,
        handCode: decision.handCode,
        context: decision.context,
      })),
    ),
  );
  const byCode = {};
  for (const item of allIssues) {
    byCode[item.code] = (byCode[item.code] || 0) + 1;
  }
  return {
    hands: hands.length,
    decisions: hands.reduce((sum, hand) => sum + hand.decisions.length, 0),
    showdowns: hands.filter((hand) => hand.showdown).length,
    criticalIssues: allIssues.filter((item) => item.severity === "critical").length,
    warnings: allIssues.filter((item) => item.severity === "warning").length,
    issueCounts: byCode,
    sampleIssues: allIssues.slice(0, 20),
  };
}

function runAudit() {
  const rng = mulberry32(SEED);
  const hands = [];

  for (let hand = 1; hand <= HANDS; hand += 1) {
    const simulator = new HoldemSimulator({ level: "solver", rng });
    const handRecord = {
      hand,
      heroHole: [...simulator.heroHole],
      aiHole: [...simulator.aiHole],
      decisions: [],
      terminal: false,
      terminalReason: null,
    };

    let decisions = 0;
    while (!simulator.terminal && decisions < MAX_DECISIONS_PER_HAND) {
      const actor = simulator.toAct;
      const decision = auditRecommendation({ simulator, actor, rng });
      handRecord.decisions.push(decision);
      simulator.applyAction(actor, decision.picked.appliedAction);
      decisions += 1;
    }

    if (!simulator.terminal) {
      handRecord.decisions.push({
        actor: simulator.toAct,
        street: simulator.street,
        issues: [issue("warning", "max_decisions_exceeded", "Hand did not terminate within max decision budget.")],
      });
    }

    handRecord.terminal = simulator.terminal;
    handRecord.board = [...simulator.board];
    handRecord.boardText = simulator.board.map(cardLabel).join(" ");
    handRecord.finalStacks = {
      hero: round(simulator.heroStack, 1),
      ai: round(simulator.aiStack, 1),
    };
    handRecord.showdown = simulator.showdown
      ? {
          hero: simulator.showdown.hero?.descr,
          ai: simulator.showdown.ai?.descr,
          split: simulator.showdown.split,
        }
      : null;
    handRecord.actionLog = simulator.actions;
    hands.push(handRecord);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    seed: SEED,
    hands: HANDS,
    iterationsPerDecision: ITERATIONS,
    summary: summarize(hands),
    handsDetail: hands,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

const report = runAudit();
console.log(
  `strategy audit passed: hands=${report.summary.hands} decisions=${report.summary.decisions} critical=${report.summary.criticalIssues} warnings=${report.summary.warnings} report=${path.relative(ROOT, REPORT_PATH)}`,
);

assert.equal(report.summary.hands, HANDS);
assert.equal(report.summary.criticalIssues, 0, `critical strategy audit issues: ${JSON.stringify(report.summary.sampleIssues, null, 2)}`);
