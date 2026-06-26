#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cardLabel, handCodeFromCards, makeDeck, mulberry32, round, shuffle } from "../src/poker-core.js";
import { preflopStrategyActions, PREFLOP_POLICY_VERSION } from "../src/preflop-policy.js";
import { hasSixMaxPreflopChart, sixMaxPreflopChartKey } from "../src/preflop-sixmax-table.js";
import { pickAction } from "../src/strategy-engine.js";

const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
const DEFAULTS = {
  hands: 6000,
  seed: 20260625,
  stackBb: 100,
  temperature: 1,
  out: "reports/sixmax-preflop-validation-6000.md",
};

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const [key, inlineValue] = item.slice(2).split("=");
    const value = inlineValue ?? argv[index + 1];
    if (inlineValue == null) index += 1;
    if (key === "hands") args.hands = Number(value);
    else if (key === "seed") args.seed = Number(value);
    else if (key === "stack-bb") args.stackBb = Number(value);
    else if (key === "temperature") args.temperature = Number(value);
    else if (key === "out") args.out = value;
  }
  args.hands = Math.max(1, Math.floor(args.hands || DEFAULTS.hands));
  args.seed = Number.isFinite(args.seed) ? args.seed : DEFAULTS.seed;
  args.stackBb = Number.isFinite(args.stackBb) ? args.stackBb : DEFAULTS.stackBb;
  args.temperature = Number.isFinite(args.temperature) ? args.temperature : DEFAULTS.temperature;
  return args;
}

function emptyStats() {
  return {
    hands: 0,
    vpip: 0,
    pfr: 0,
    sawFlop: 0,
    rfiOpp: 0,
    rfiRaise: 0,
    rfiFold: 0,
    facingOpenOpp: 0,
    callVsOpen: 0,
    threeBet: 0,
    foldVsOpen: 0,
    facing3betOpp: 0,
    callVs3bet: 0,
    fourBet: 0,
    foldVs3bet: 0,
    bbWalks: 0,
    tableHits: 0,
    fallbackHits: 0,
  };
}

function openSize(position) {
  if (position === "BTN") return 2.2;
  if (position === "SB") return 3;
  return 2.5;
}

function raiseSize({ actor, currentBet, raiseCount }) {
  if (raiseCount >= 2) return Math.min(100, round(currentBet * 2.25, 1));
  const multiplier = actor === "SB" || actor === "BB" ? 4 : 3.2;
  return Math.min(100, round(currentBet * multiplier, 1));
}

function contextFor(player, raiseCount) {
  if (raiseCount <= 0) return "unopened";
  if (raiseCount === 1) return player.position === "SB" || player.position === "BB" ? "blind-defense" : "facing-open";
  return "facing-3bet";
}

function aggressorForContext(context, opener, threeBettor) {
  if (context === "facing-open" || context === "blind-defense") return opener;
  if (context === "facing-3bet") return threeBettor;
  return null;
}

function choosePreflopAction({ player, context, aggressorPosition, args, rng }) {
  const actions = preflopStrategyActions({
    handCode: player.handCode,
    position: player.position,
    context,
    aggressorPosition,
    tableSize: 6,
    stackBb: args.stackBb,
  });
  const chartParams = { position: player.position, context, aggressorPosition };
  const sourceKey = sixMaxPreflopChartKey(chartParams);
  const tableHit = hasSixMaxPreflopChart(chartParams);
  return {
    actions,
    picked: pickAction(actions, rng, args.temperature),
    sourceKey,
    tableHit,
  };
}

function markVoluntary(stats, player, actionKey) {
  if (actionKey === "call" || actionKey === "raise" || actionKey === "jam") {
    player.vpip = true;
    stats[player.position].vpip += player.vpipCounted ? 0 : 1;
    player.vpipCounted = true;
  }
  if (actionKey === "raise" || actionKey === "jam") {
    player.pfr = true;
    stats[player.position].pfr += player.pfrCounted ? 0 : 1;
    player.pfrCounted = true;
  }
}

function topMix(actions) {
  return actions
    .slice(0, 3)
    .map((action) => `${action.key}:${Math.round(action.frequency * 100)}%`)
    .join(" ");
}

function playHand({ handNumber, rng, args, stats, samples }) {
  const deck = shuffle(makeDeck(), rng);
  const players = POSITIONS.map((position) => ({
    position,
    cards: [deck.pop(), deck.pop()],
    folded: false,
    contribution: position === "SB" ? 0.5 : position === "BB" ? 1 : 0,
    vpip: false,
    pfr: false,
    vpipCounted: false,
    pfrCounted: false,
  }));
  for (const player of players) player.handCode = handCodeFromCards(player.cards);

  let currentBet = 1;
  let raiseCount = 0;
  let opener = null;
  let threeBettor = null;
  let fourBettor = null;
  let index = 0;
  let actions = 0;
  const line = [];

  while (actions < 80) {
    const active = players.filter((player) => !player.folded);
    if (active.length <= 1) break;
    if (raiseCount > 0 && active.every((player) => player.contribution >= currentBet)) break;

    const player = players[index % players.length];
    index += 1;
    if (player.folded) continue;

    const needsAction = raiseCount === 0 ? player.position !== "BB" : player.contribution < currentBet;
    if (!needsAction) {
      if (raiseCount === 0 && player.position === "BB") {
        stats.BB.bbWalks += 1;
        line.push("BB walk");
        break;
      }
      continue;
    }

    const context = contextFor(player, raiseCount);
    const aggressorPosition = aggressorForContext(context, opener, threeBettor);
    const { actions: strategy, picked, sourceKey, tableHit } = choosePreflopAction({
      player,
      context,
      aggressorPosition,
      args,
      rng,
    });
    let key = picked.key;
    if (raiseCount >= 3 && (key === "raise" || key === "jam")) key = "call";

    const posStats = stats[player.position];
    if (tableHit) posStats.tableHits += 1;
    else posStats.fallbackHits += 1;
    if (context === "unopened") {
      posStats.rfiOpp += 1;
      if (key === "raise" || key === "jam") posStats.rfiRaise += 1;
      else posStats.rfiFold += 1;
    } else if (raiseCount === 1) {
      posStats.facingOpenOpp += 1;
      if (key === "call") posStats.callVsOpen += 1;
      else if (key === "raise" || key === "jam") posStats.threeBet += 1;
      else posStats.foldVsOpen += 1;
    } else {
      posStats.facing3betOpp += 1;
      if (key === "call") posStats.callVs3bet += 1;
      else if (key === "raise" || key === "jam") posStats.fourBet += 1;
      else posStats.foldVs3bet += 1;
    }

    if (key === "fold") {
      player.folded = true;
      line.push(`${player.position} fold`);
    } else if (key === "call") {
      markVoluntary(stats, player, key);
      player.contribution = currentBet;
      line.push(`${player.position} call ${round(currentBet, 1)}`);
    } else {
      markVoluntary(stats, player, key);
      if (raiseCount === 0) opener = player.position;
      else if (raiseCount === 1) threeBettor = player.position;
      else fourBettor = player.position;
      currentBet = raiseCount === 0 ? openSize(player.position) : raiseSize({ actor: player.position, currentBet, raiseCount });
      player.contribution = currentBet;
      raiseCount += 1;
      line.push(`${player.position} ${raiseCount === 1 ? "open" : raiseCount === 2 ? "3bet" : "4bet"} ${round(currentBet, 1)}`);
    }

    if (samples.length < 60) {
      samples.push({
        hand: handNumber,
        position: player.position,
        cards: player.cards.map(cardLabel).join(" "),
        handCode: player.handCode,
        context,
        aggressor: aggressorPosition,
        source: tableHit ? sourceKey : "fallback",
        picked: key,
        topMix: topMix(strategy),
      });
    }
    actions += 1;
  }

  const reachedFlop = players.filter((player) => !player.folded);
  if (reachedFlop.length > 1) {
    for (const player of reachedFlop) stats[player.position].sawFlop += 1;
  }

  return {
    hand: handNumber,
    opener,
    threeBettor,
    fourBettor,
    players: reachedFlop.map((player) => player.position).join(" "),
    line: line.join("; "),
  };
}

function pct(numerator, denominator, digits = 1) {
  if (!denominator) return "-";
  return `${round((numerator / denominator) * 100, digits)}%`;
}

function rowFor(position, stats) {
  const item = stats[position];
  const vpipPfrGap = item.hands ? `${round(((item.vpip - item.pfr) / item.hands) * 100, 1)}pp` : "-";
  return [
    position,
    item.hands,
    pct(item.vpip, item.hands),
    pct(item.pfr, item.hands),
    vpipPfrGap,
    pct(item.rfiRaise, item.rfiOpp),
    item.rfiOpp,
    pct(item.callVsOpen, item.facingOpenOpp),
    pct(item.threeBet, item.facingOpenOpp),
    pct(item.foldVsOpen, item.facingOpenOpp),
    pct(item.callVs3bet + item.fourBet, item.facing3betOpp),
    pct(item.fourBet, item.facing3betOpp),
    pct(item.sawFlop, item.hands),
    pct(item.tableHits, item.tableHits + item.fallbackHits),
  ];
}

function buildReport({ args, stats, handSamples, decisionSamples }) {
  const lines = [];
  lines.push("# Six-Max Preflop Validation");
  lines.push("");
  lines.push(`Generated with \`npm run validate:six-max -- --hands ${args.hands} --seed ${args.seed}\`.`);
  lines.push("");
  lines.push(`- Hands: ${args.hands}`);
  lines.push(`- Seed: ${args.seed}`);
  lines.push(`- Stack: ${args.stackBb}bb`);
  lines.push(`- Temperature: ${args.temperature}`);
  lines.push(`- Policy: six-max chart-first lookup with generated fallback; version \`${PREFLOP_POLICY_VERSION}\`.`);
  lines.push("- Scope: preflop-only six-max action tree; postflop EV is intentionally excluded.");
  lines.push("");
  lines.push("## Position Summary");
  lines.push("");
  lines.push("| Pos | Hands | VPIP | PFR | VPIP-PFR | RFI | RFI opp | Call vs open | 3bet vs open | Fold vs open | Continue vs 3bet | 4bet vs 3bet | Saw flop | Table hit |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const position of POSITIONS) {
    lines.push(`| ${rowFor(position, stats).join(" | ")} |`);
  }
  lines.push("");
  lines.push("## Quick Read");
  lines.push("");
  lines.push("- RFI is chart-backed for UTG/HJ/CO/BTN/SB at 100bb.");
  lines.push("- BB has no RFI row because unopened hands end as walks/check options before a voluntary action.");
  lines.push("- Versus-open and versus-3bet nodes are chart-backed when the opener/3bettor position exists in the source table; otherwise they fall back to generated widths.");
  lines.push("- Source `allin` cells are treated as strong aggressive raises in normal 100bb 6-max nodes, not literal open jams.");
  lines.push("- 3bet and defend frequencies should be treated as style diagnostics, not proof of GTO accuracy.");
  lines.push("");
  lines.push("## Hand Samples");
  lines.push("");
  lines.push("| # | Opener | 3bettor | 4bettor | Remaining players | Line |");
  lines.push("| ---: | --- | --- | --- | --- | --- |");
  for (const hand of handSamples.slice(0, 40)) {
    lines.push(`| ${hand.hand} | ${hand.opener || "-"} | ${hand.threeBettor || "-"} | ${hand.fourBettor || "-"} | ${hand.players || "-"} | ${hand.line || "-"} |`);
  }
  lines.push("");
  lines.push("## Decision Samples");
  lines.push("");
  lines.push("| Hand | Pos | Cards | Code | Context | Aggressor | Source | Picked | Top mix |");
  lines.push("| ---: | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const row of decisionSamples) {
    lines.push(`| ${row.hand} | ${row.position} | ${row.cards} | ${row.handCode} | ${row.context} | ${row.aggressor || "-"} | ${row.source} | ${row.picked} | ${row.topMix} |`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rng = mulberry32(args.seed);
  const stats = Object.fromEntries(POSITIONS.map((position) => [position, emptyStats()]));
  const handSamples = [];
  const decisionSamples = [];

  for (let hand = 1; hand <= args.hands; hand += 1) {
    for (const position of POSITIONS) stats[position].hands += 1;
    const summary = playHand({ handNumber: hand, rng, args, stats, samples: decisionSamples });
    if (handSamples.length < 40) handSamples.push(summary);
  }

  const report = buildReport({ args, stats, handSamples, decisionSamples });
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
