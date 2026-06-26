#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRangeWeights, cardLabel, mulberry32, round } from "../src/poker-core.js";
import { AI_LEVELS, HoldemSimulator } from "../src/simulator.js";
import { pickAction, recommendStrategy } from "../src/strategy-engine.js";

const DEFAULTS = {
  hands: 100,
  seed: 20260625,
  level: "solver",
  temperature: 1,
  noise: 0,
  samples: null,
  out: "reports/heads-up-validation.md",
  maxActions: 120,
  carryStacks: false,
};

const BET_KEYS = new Set(["bet-small", "bet-mid", "bet-big", "bet-over", "raise", "raise-small", "raise-big", "jam"]);
const AGGRESSIVE_TYPES = new Set(["bet", "raise", "allin"]);
const PASSIVE_TYPES = new Set(["check", "call"]);

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const [rawKey, inlineValue] = item.slice(2).split("=");
    const value = inlineValue ?? argv[index + 1];
    if (inlineValue == null) index += 1;
    if (rawKey === "hands") args.hands = Number(value);
    else if (rawKey === "seed") args.seed = Number(value);
    else if (rawKey === "level") args.level = value;
    else if (rawKey === "temperature") args.temperature = Number(value);
    else if (rawKey === "noise") args.noise = Number(value);
    else if (rawKey === "samples") args.samples = Number(value);
    else if (rawKey === "out") args.out = value;
    else if (rawKey === "max-actions") args.maxActions = Number(value);
    else if (rawKey === "carry-stacks") {
      args.carryStacks = value == null || !["0", "false", "no"].includes(String(value).toLowerCase());
      if (inlineValue == null && value?.startsWith?.("--")) index -= 1;
    }
  }
  args.hands = Math.max(1, Math.floor(args.hands || DEFAULTS.hands));
  args.seed = Number.isFinite(args.seed) ? args.seed : DEFAULTS.seed;
  args.temperature = Number.isFinite(args.temperature) ? args.temperature : DEFAULTS.temperature;
  args.noise = Number.isFinite(args.noise) ? args.noise : DEFAULTS.noise;
  args.samples = Number.isFinite(args.samples) && args.samples > 0 ? Math.floor(args.samples) : null;
  args.maxActions = Math.max(20, Math.floor(args.maxActions || DEFAULTS.maxActions));
  if (!AI_LEVELS[args.level]) args.level = DEFAULTS.level;
  return args;
}

function actorPosition(sim, actor) {
  if (sim.street === "preflop") return actor === "hero" ? "SB" : "BB";
  return actor === "hero" ? "BTN" : "BB";
}

function actorHole(sim, actor) {
  return actor === "hero" ? sim.heroHole : sim.aiHole;
}

function actorStack(sim, actor) {
  return actor === "hero" ? sim.heroStack : sim.aiStack;
}

function recommendForActor(sim, actor, profile, args) {
  const toCall = sim.getToCall(actor);
  const position = actorPosition(sim, actor);
  const context = sim.contextForActor(actor, toCall);
  const stackBb = Math.max(1, actorStack(sim, actor));
  const rangeWeights = buildRangeWeights({
    style: profile.rangeStyle,
    position,
    context,
    tableSize: 2,
    stackBb,
  });
  return recommendStrategy({
    hero: actorHole(sim, actor),
    board: sim.board,
    position,
    context,
    tableSize: 2,
    stackBb,
    pot: sim.pot,
    toCall,
    opponents: 1,
    rangeWeights,
    iterations: args.samples || profile.samples,
    rng: sim.rng,
  });
}

function actionForPicked(picked, toCall) {
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

function legalFallbackKeys(toCall) {
  return toCall > 0 ? ["fold", "call", "raise-small", "raise-big", "jam"] : ["check", "bet-small", "bet-mid", "bet-big", "bet-over"];
}

function choosePolicyAction(sim, actor, profile, args) {
  const recommendation = recommendForActor(sim, actor, profile, args);
  let picked = pickAction(recommendation.actions, sim.rng, args.temperature);
  if (args.noise > 0 && sim.rng() < args.noise) {
    const legal = legalFallbackKeys(sim.getToCall(actor));
    picked = { key: legal[Math.floor(sim.rng() * legal.length)], frequency: null };
  }
  const toCall = sim.getToCall(actor);
  return {
    recommendation,
    picked,
    actionType: actionForPicked(picked, toCall),
    toCall,
  };
}

function actionSummary(actions) {
  const voluntary = actions.filter((action) => action.type !== "blind");
  const line = voluntary
    .map((action) => `${action.street}:${action.actor}:${action.label}${action.amount ? ` ${action.amount}bb` : ""}`)
    .join("; ");
  return line.length > 260 ? `${line.slice(0, 257)}...` : line;
}

function streetReached(actions, street) {
  return actions.some((action) => action.street === street);
}

function summarizeHand(sim, startHero, startAi, decisionRows, capped) {
  const heroDelta = round(sim.heroStack - startHero, 1);
  const aiDelta = round(sim.aiStack - startAi, 1);
  const winner = heroDelta > aiDelta ? "Hero" : aiDelta > heroDelta ? "AI" : "Split";
  const maxPot = Math.max(0, ...sim.actions.map((action) => Number(action.pot || 0)));
  const voluntary = sim.actions.filter((action) => action.type !== "blind");
  const preflop = voluntary.filter((action) => action.street === "preflop");
  const firstRaise = preflop.find((action) => action.type === "raise" || action.type === "allin");
  return {
    hand: sim.handNumber,
    heroHole: sim.heroHole.map(cardLabel).join(" "),
    aiHole: sim.aiHole.map(cardLabel).join(" "),
    board: sim.board.map(cardLabel).join(" "),
    winner,
    heroDelta,
    aiDelta,
    maxPot: round(maxPot, 1),
    showdown: Boolean(sim.showdown),
    endedStreet: sim.street,
    actions: voluntary.length,
    capped,
    preflopRaises: preflop.filter((action) => action.type === "raise" || action.type === "allin").length,
    firstRaiseActor: firstRaise?.actor || "",
    line: actionSummary(sim.actions),
    decisionRows,
  };
}

function emptyActorStats() {
  return {
    decisions: 0,
    checks: 0,
    calls: 0,
    folds: 0,
    bets: 0,
    raises: 0,
    allins: 0,
    betLikeFrequencySum: 0,
    preflopOpenOpportunities: 0,
    preflopRaises: 0,
    vpipHands: new Set(),
    pfrHands: new Set(),
    streetDecisions: { preflop: 0, flop: 0, turn: 0, river: 0 },
    policySources: {},
    pickedKeys: {},
  };
}

function addCount(map, key, amount = 1) {
  map[key] = (map[key] || 0) + amount;
}

function updateActorStats(stats, row, handNumber, action) {
  const actor = stats[row.actor];
  actor.decisions += 1;
  actor.streetDecisions[row.street] = (actor.streetDecisions[row.street] || 0) + 1;
  addCount(actor.policySources, row.policySource);
  addCount(actor.pickedKeys, row.pickedKey);
  actor.betLikeFrequencySum += row.betLikeFrequency;

  if (row.street === "preflop" && row.context === "unopened") actor.preflopOpenOpportunities += 1;
  if (action.street === "preflop" && ["call", "bet", "raise", "allin"].includes(action.type)) actor.vpipHands.add(handNumber);
  if (action.street === "preflop" && (action.type === "raise" || action.type === "allin")) {
    actor.pfrHands.add(handNumber);
    actor.preflopRaises += 1;
  }

  if (action.type === "check") actor.checks += 1;
  else if (action.type === "call") actor.calls += 1;
  else if (action.type === "fold") actor.folds += 1;
  else if (action.type === "bet") actor.bets += 1;
  else if (action.type === "raise") actor.raises += 1;
  else if (action.type === "allin") actor.allins += 1;
}

function betLikeFrequency(actions) {
  return actions.filter((action) => BET_KEYS.has(action.key)).reduce((sum, action) => sum + action.frequency, 0);
}

function topMix(actions) {
  return actions
    .slice(0, 3)
    .map((action) => `${action.key}:${Math.round(action.frequency * 100)}%`)
    .join(" ");
}

function playHand(sim, profile, args) {
  const startHero = sim.heroStack + 0.5;
  const startAi = sim.aiStack + 1;
  const decisionRows = [];
  let capped = false;

  for (let step = 0; step < args.maxActions && !sim.terminal; step += 1) {
    const actor = sim.toAct;
    if (!actor) break;
    const street = sim.street;
    const context = sim.contextForActor(actor, sim.getToCall(actor));
    const chosen = choosePolicyAction(sim, actor, profile, args);
    const beforeCount = sim.actions.length;
    sim.applyAction(actor, chosen.actionType);
    const action = sim.actions[beforeCount];
    decisionRows.push({
      hand: sim.handNumber,
      actor,
      street,
      context,
      toCall: chosen.toCall,
      policySource: `${chosen.recommendation.policySource.type}:${chosen.recommendation.policySource.version}`,
      pickedKey: chosen.picked.key,
      pickedFrequency: chosen.picked.frequency,
      betLikeFrequency: betLikeFrequency(chosen.recommendation.actions),
      topMix: topMix(chosen.recommendation.actions),
      actionType: chosen.actionType,
      executed: action ? action.type : "none",
      amount: action ? action.amount : 0,
      pot: action ? action.pot : sim.pot,
    });
    if (!sim.terminal && (sim.heroStack <= 0.01 || sim.aiStack <= 0.01)) {
      const actorToAct = sim.toAct;
      const blockedActor = actorToAct && actorStack(sim, actorToAct) <= 0.01;
      const noPendingCall = actorToAct ? sim.getToCall(actorToAct) <= 0.01 : true;
      if (blockedActor || noPendingCall) sim.runoutAndShowdown();
    }
  }

  if (!sim.terminal) {
    capped = true;
    sim.runoutAndShowdown();
  }
  return summarizeHand(sim, startHero, startAi, decisionRows, capped);
}

function pct(value, digits = 1) {
  return `${round(value * 100, digits)}%`;
}

function formatMap(map, limit = 6) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => `${key} ${value}`)
    .join(", ");
}

function buildReport({ args, hands, actorStats }) {
  const totalHero = hands.reduce((sum, hand) => sum + hand.heroDelta, 0);
  const showdowns = hands.filter((hand) => hand.showdown).length;
  const capped = hands.filter((hand) => hand.capped).length;
  const avgPot = hands.reduce((sum, hand) => sum + hand.maxPot, 0) / hands.length;
  const heroWins = hands.filter((hand) => hand.winner === "Hero").length;
  const aiWins = hands.filter((hand) => hand.winner === "AI").length;
  const splits = hands.filter((hand) => hand.winner === "Split").length;

  const lines = [];
  lines.push(`# Heads-Up Strategy Validation`);
  lines.push("");
  lines.push(`Generated with \`npm run validate:heads-up -- --hands ${args.hands} --seed ${args.seed}\`.`);
  lines.push("");
  lines.push(`- Hands: ${hands.length}`);
  lines.push(`- Seed: ${args.seed}`);
  lines.push(`- Level profile: ${args.level}`);
  lines.push(`- Temperature: ${args.temperature}`);
  lines.push(`- Noise: ${args.noise}`);
  lines.push(`- Samples per decision: ${args.samples || AI_LEVELS[args.level].samples}`);
  lines.push(`- Stack mode: ${args.carryStacks ? "carry stacks across hands" : "reset to 100bb each hand"}`);
  lines.push(`- Hero result: ${round(totalHero, 1)}bb (${round(totalHero / hands.length, 2)}bb/hand)`);
  lines.push(`- Results: Hero ${heroWins}, AI ${aiWins}, split ${splits}`);
  lines.push(`- Showdowns: ${showdowns}/${hands.length} (${pct(showdowns / hands.length)})`);
  lines.push(`- Average max pot: ${round(avgPot, 1)}bb`);
  if (capped) lines.push(`- Capped hands: ${capped}`);
  lines.push("");

  lines.push(`## Actor Style Summary`);
  lines.push("");
  lines.push(`| Actor | Decisions | VPIP | PFR | Agg actions | Passive actions | Fold share | Avg recommended bet/raise freq | Policy sources | Top picked keys |`);
  lines.push(`| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |`);
  for (const actorName of ["hero", "ai"]) {
    const stat = actorStats[actorName];
    const aggressive = stat.bets + stat.raises + stat.allins;
    const passive = stat.checks + stat.calls;
    lines.push(
      `| ${actorName} | ${stat.decisions} | ${pct(stat.vpipHands.size / hands.length)} | ${pct(stat.pfrHands.size / hands.length)} | ${aggressive} | ${passive} | ${pct(stat.folds / Math.max(1, stat.decisions))} | ${pct(stat.betLikeFrequencySum / Math.max(1, stat.decisions))} | ${formatMap(stat.policySources, 4)} | ${formatMap(stat.pickedKeys, 8)} |`,
    );
  }
  lines.push("");

  lines.push(`## Hand Table`);
  lines.push("");
  lines.push(`| # | Hero | AI | Board | Winner | Hero bb | Max pot | SD | PFR | Line |`);
  lines.push(`| ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |`);
  for (const hand of hands) {
    lines.push(
      `| ${hand.hand} | ${hand.heroHole} | ${hand.aiHole} | ${hand.board || "-"} | ${hand.winner} | ${hand.heroDelta} | ${hand.maxPot} | ${hand.showdown ? "Y" : "N"} | ${hand.firstRaiseActor || "-"} | ${hand.line || "-"} |`,
    );
  }
  lines.push("");

  lines.push(`## Decision Sample`);
  lines.push("");
  lines.push(`| Hand | Actor | Street | Context | Picked | Executed | Amount | Top mix | Source |`);
  lines.push(`| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |`);
  for (const row of hands.flatMap((hand) => hand.decisionRows).slice(0, 80)) {
    lines.push(
      `| ${row.hand} | ${row.actor} | ${row.street} | ${row.context} | ${row.pickedKey} | ${row.executed} | ${row.amount} | ${row.topMix} | ${row.policySource} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = { ...AI_LEVELS[args.level], temperature: args.temperature, noise: args.noise };
  const sim = new HoldemSimulator({ level: args.level, rng: mulberry32(args.seed) });
  sim.handNumber = 0;
  const hands = [];
  const actorStats = { hero: emptyActorStats(), ai: emptyActorStats() };

  for (let index = 0; index < args.hands; index += 1) {
    if (!args.carryStacks) {
      sim.heroStack = 100;
      sim.aiStack = 100;
    }
    sim.newHand();
    const summary = playHand(sim, profile, args);
    hands.push(summary);
    for (const row of summary.decisionRows) {
      updateActorStats(actorStats, row, summary.hand, { street: row.street, type: row.executed });
    }
  }

  const report = buildReport({ args, hands, actorStats });
  const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", args.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, report, "utf8");
  console.log(report);
  console.error(`\nReport written to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
