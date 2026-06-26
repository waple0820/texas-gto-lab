#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allHandCodes, cardLabel, clamp, comboCountForCode, handCodeFromCards, makeDeck, mulberry32, round, shuffle } from "../src/poker-core.js";
import { preflopStrategyActions, PREFLOP_POLICY_VERSION } from "../src/preflop-policy.js";
import { hasSixMaxPreflopChart, resolveSixMaxPreflopChartSource, sixMaxPreflopChartKey } from "../src/preflop-sixmax-table.js";
import { SIXMAX_DEEPFOLD_CHARTS } from "../src/preflop-sixmax-deepfold.js";
import { SIXMAX_GTO_WIZARD_CHARTS } from "../src/preflop-sixmax-gtowizard.js";
import { SIXMAX_GREENLINE_CHARTS } from "../src/preflop-sixmax-greenline.js";
import { SIXMAX_PEKARSTAS_CHARTS } from "../src/preflop-sixmax-pekarstas.js";
import { SIXMAX_POKERCOACHING_CHARTS } from "../src/preflop-sixmax-pokercoaching.js";
import { SIXMAX_W0UF_CHARTS } from "../src/preflop-sixmax-w0uf.js";
import { pickAction } from "../src/strategy-engine.js";

const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
const SOURCE_POSITION = {
  UTG: "UTG",
  HJ: "MP",
  MP: "MP",
  CO: "CO",
  BTN: "BTN",
  SB: "SB",
  BB: "BB",
};
const DEFAULTS = {
  hands: 6000,
  seed: 20260625,
  stackBb: 100,
  temperature: 1,
  out: "reports/sixmax-preflop-validation-6000.md",
};
const ACTION_KEYS = ["fold", "call", "raise", "jam"];

function sourcePosition(position) {
  return SOURCE_POSITION[position] || position;
}

function amountToken(value) {
  return `${round(value, 1).toFixed(1)}bb`;
}

function sourcePreflopLine(sourceEvents, actorPosition) {
  if (!sourceEvents.length) return null;
  return [...sourceEvents, sourcePosition(actorPosition)].join(" ");
}

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
    facing4betOpp: 0,
    callVs4bet: 0,
    fiveBet: 0,
    foldVs4bet: 0,
    bbWalks: 0,
    tableHits: 0,
    fallbackHits: 0,
  };
}

function emptyDiagnostics() {
  return {
    decisions: 0,
    sourceModes: { exact: 0, alias: 0, fallback: 0, unkeyed: 0 },
    spotTypes: {},
    nodes: {},
    aliasMappings: {},
    providerHits: {},
    fallbackNodes: {},
    lineHits: 0,
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
  if (raiseCount === 2) return "facing-3bet";
  return "facing-4bet";
}

function aggressorForContext(context, opener, threeBettor, fourBettor) {
  if (context === "facing-open" || context === "blind-defense") return opener;
  if (context === "facing-3bet") return threeBettor;
  if (context === "facing-4bet") return fourBettor;
  return null;
}

function choosePreflopAction({ player, context, aggressorPosition, callerPositions = [], preflopLine, args, rng }) {
  const actions = preflopStrategyActions({
    handCode: player.handCode,
    position: player.position,
    context,
    aggressorPosition,
    callerPositions,
    preflopLine,
    tableSize: 6,
    stackBb: args.stackBb,
  });
  const chartParams = { position: player.position, context, aggressorPosition, callerPositions, preflopLine };
  const requestedKey = sixMaxPreflopChartKey(chartParams);
  const resolvedSource = resolveSixMaxPreflopChartSource(chartParams);
  const resolvedKey = resolvedSource?.key || null;
  const tableHit = hasSixMaxPreflopChart(chartParams);
  const sourceMode = !requestedKey ? "unkeyed" : !tableHit ? "fallback" : requestedKey === resolvedKey ? "exact" : "alias";
  return {
    actions,
    picked: pickAction(actions, rng, args.temperature),
    requestedKey,
    resolvedKey,
    resolvedProvider: resolvedSource?.provider || null,
    lineKey: resolvedSource?.lineKey || null,
    sourceKey: resolvedSource?.lineKey
      ? `${resolvedSource.provider}:${resolvedSource.lineKey}`
      : resolvedKey && resolvedKey !== requestedKey
        ? `${requestedKey}->${resolvedSource.provider}:${resolvedKey}`
        : `${resolvedSource?.provider || "none"}:${requestedKey}`,
    sourceMode,
    tableHit,
  };
}

function increment(map, key, amount = 1) {
  map[key || "-"] = (map[key || "-"] || 0) + amount;
}

function noteNode(diagnostics, { spotType, sourceMode, requestedKey, resolvedKey, resolvedProvider, lineKey, position, context, aggressorPosition }) {
  diagnostics.decisions += 1;
  increment(diagnostics.sourceModes, sourceMode);
  increment(diagnostics.spotTypes, spotType);
  if (resolvedProvider) increment(diagnostics.providerHits, resolvedProvider);
  if (lineKey) diagnostics.lineHits += 1;

  const nodeKey = requestedKey || `unkeyed:${spotType}`;
  const node = diagnostics.nodes[nodeKey] || {
    requestedKey: requestedKey || "-",
    resolvedKey: resolvedKey || "-",
    resolvedProvider: resolvedProvider || "-",
    spotType,
    position,
    context,
    aggressorPosition,
    decisions: 0,
    exact: 0,
    alias: 0,
    fallback: 0,
    unkeyed: 0,
  };
  node.decisions += 1;
  node[sourceMode] += 1;
  if (resolvedKey) node.resolvedKey = resolvedKey;
  if (resolvedProvider) node.resolvedProvider = resolvedProvider;
  diagnostics.nodes[nodeKey] = node;

  if (sourceMode === "alias") increment(diagnostics.aliasMappings, `${requestedKey}->${resolvedProvider}:${resolvedKey}`);
  if (sourceMode === "fallback") increment(diagnostics.fallbackNodes, nodeKey);
}

function spotTypeFor({ player, context, opener, threeBettor, raiseCount, coldCallers, threeBetWasSqueeze }) {
  if (context === "unopened") return "unopened";
  if (context === "facing-open" || context === "blind-defense") {
    return coldCallers.size > 0 && player.position !== opener ? "squeeze-opportunity" : context;
  }
  if (context === "facing-3bet") {
    if (threeBetWasSqueeze) return "facing-squeeze";
    if (player.position === opener) return "opener-facing-3bet";
    return "cold-facing-3bet";
  }
  if (context === "facing-4bet") {
    if (player.position === threeBettor) return "threebettor-facing-4bet";
    return raiseCount > 3 ? "facing-5bet-plus" : "cold-facing-4bet";
  }
  return context;
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

function actionVector(actions) {
  const vector = Object.fromEntries(ACTION_KEYS.map((key) => [key, 0]));
  for (const action of actions || []) {
    if (action.key in vector) vector[action.key] += Number(action.frequency || action.weight || 0);
  }
  return vector;
}

function sourceCellVector(cell, { context } = {}) {
  const vector = Object.fromEntries(ACTION_KEYS.map((key) => [key, 0]));
  const literalJam = context === "facing-4bet";

  function add(action, frequency) {
    const key = action === "allin" ? (literalJam ? "jam" : "raise") : action;
    if (key in vector) vector[key] += frequency;
  }

  if (!cell) {
    vector.fold = 1;
  } else if (typeof cell === "string") {
    add(cell, 1);
  } else if (Array.isArray(cell)) {
    const share = 1 / cell.length;
    for (const action of cell) add(action, share);
  } else if (typeof cell === "object") {
    const rangeWeight = clamp(Number(cell.weight || 0) / 100, 0, 1);
    vector.fold += 1 - rangeWeight;
    for (const [action, frequency] of Object.entries(cell.actions || {})) {
      add(action, rangeWeight * clamp(Number(frequency || 0) / 100, 0, 1));
    }
  }

  return vector;
}

function chartByProvider(provider) {
  if (provider === "gtowizard") return SIXMAX_GTO_WIZARD_CHARTS;
  if (provider === "deepfold") return SIXMAX_DEEPFOLD_CHARTS;
  if (provider === "pekarstas") return SIXMAX_PEKARSTAS_CHARTS;
  if (provider === "greenline") return SIXMAX_GREENLINE_CHARTS;
  if (provider === "pokercoaching") return SIXMAX_POKERCOACHING_CHARTS;
  if (provider === "w0uf") return SIXMAX_W0UF_CHARTS;
  return null;
}

function chartMaeForNode(node, args) {
  const sourceCharts = chartByProvider(node.resolvedProvider);
  if (!node.requestedKey || node.requestedKey !== node.resolvedKey || !sourceCharts?.[node.requestedKey]) return null;
  let weightedError = 0;
  let weightedActions = 0;
  for (const handCode of allHandCodes()) {
    const combos = comboCountForCode(handCode);
    const expected = sourceCellVector(sourceCharts[node.requestedKey][handCode], { context: node.context });
    const actual = actionVector(
      preflopStrategyActions({
        handCode,
        position: node.position,
        context: node.context,
        aggressorPosition: node.aggressorPosition,
        tableSize: 6,
        stackBb: args.stackBb,
      }),
    );
    for (const key of ACTION_KEYS) weightedError += combos * Math.abs(expected[key] - actual[key]);
    weightedActions += combos * ACTION_KEYS.length;
  }
  return weightedActions ? weightedError / weightedActions : null;
}

function sortedCounts(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function playHand({ handNumber, rng, args, stats, samples, diagnostics }) {
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
  let threeBetWasSqueeze = false;
  const coldCallers = new Set();
  let index = 0;
  let actions = 0;
  const line = [];
  const sourceEvents = [];

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
    const aggressorPosition = aggressorForContext(context, opener, threeBettor, fourBettor);
    const callerPositions = [...coldCallers];
    const preflopLine = sourcePreflopLine(sourceEvents, player.position);
    const spotTypeBeforeAction = spotTypeFor({ player, context, opener, threeBettor, raiseCount, coldCallers, threeBetWasSqueeze });
    const lookupContext =
      raiseCount === 1 && coldCallers.size > 0 && player.position !== opener
        ? "squeeze"
        : spotTypeBeforeAction === "cold-facing-3bet" || spotTypeBeforeAction === "facing-squeeze"
          ? spotTypeBeforeAction
          : context;
    const { actions: strategy, picked, requestedKey, resolvedKey, resolvedProvider, lineKey, sourceKey, sourceMode, tableHit } = choosePreflopAction({
      player,
      context: lookupContext,
      aggressorPosition,
      callerPositions,
      preflopLine,
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
    } else if (context === "facing-3bet") {
      posStats.facing3betOpp += 1;
      if (key === "call") posStats.callVs3bet += 1;
      else if (key === "raise" || key === "jam") posStats.fourBet += 1;
      else posStats.foldVs3bet += 1;
    } else {
      posStats.facing4betOpp += 1;
      if (key === "call") posStats.callVs4bet += 1;
      else if (key === "raise" || key === "jam") posStats.fiveBet += 1;
      else posStats.foldVs4bet += 1;
    }

    const squeeze = raiseCount === 1 && (key === "raise" || key === "jam") && coldCallers.size > 0;
    const spotType = squeeze ? "squeeze" : spotTypeBeforeAction;
    noteNode(diagnostics, { spotType, sourceMode, requestedKey, resolvedKey, resolvedProvider, lineKey, position: player.position, context: lookupContext, aggressorPosition });

    if (key === "fold") {
      player.folded = true;
      if (raiseCount >= 2) sourceEvents.push(`${sourcePosition(player.position)} FOLD`);
      line.push(`${player.position} fold`);
    } else if (key === "call") {
      markVoluntary(stats, player, key);
      player.contribution = currentBet;
      if (raiseCount === 1 && player.position !== opener) {
        coldCallers.add(player.position);
        sourceEvents.push(`${sourcePosition(player.position)} Call`);
      } else if (raiseCount >= 2) {
        sourceEvents.push(`${sourcePosition(player.position)} Call`);
      }
      line.push(`${player.position} call ${round(currentBet, 1)}`);
    } else {
      markVoluntary(stats, player, key);
      if (raiseCount === 0) opener = player.position;
      else if (raiseCount === 1) {
        threeBettor = player.position;
        threeBetWasSqueeze = squeeze;
      }
      else fourBettor = player.position;
      currentBet = raiseCount === 0 ? openSize(player.position) : raiseSize({ actor: player.position, currentBet, raiseCount });
      sourceEvents.push(`${sourcePosition(player.position)} ${amountToken(currentBet)}`);
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
        context: lookupContext,
        spotType,
        aggressor: aggressorPosition,
        sourceMode,
        source: tableHit ? sourceKey : "fallback",
        lineKey,
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

function buildReport({ args, stats, handSamples, decisionSamples, diagnostics }) {
  const lines = [];
  const exact = diagnostics.sourceModes.exact || 0;
  const alias = diagnostics.sourceModes.alias || 0;
  const fallback = diagnostics.sourceModes.fallback || 0;
  const unkeyed = diagnostics.sourceModes.unkeyed || 0;
  const chartDecisions = exact + alias + fallback + unkeyed;
  const nodeRows = Object.values(diagnostics.nodes).sort((a, b) => b.decisions - a.decisions || a.requestedKey.localeCompare(b.requestedKey));
  const maeRows = nodeRows
    .filter((node) => node.exact > 0 && chartByProvider(node.resolvedProvider)?.[node.requestedKey])
    .map((node) => ({ ...node, mae: chartMaeForNode(node, args) }))
    .sort((a, b) => b.decisions - a.decisions || b.mae - a.mae)
    .slice(0, 12);

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
  lines.push("- Versus-open, opener-facing-3bet, cold-facing-3bet, facing-squeeze, and facing-4bet nodes use exact source charts first when a verified chart exists; unresolved nodes fall back explicitly instead of aliasing across contexts.");
  lines.push(`- Observed source coverage: exact ${pct(exact, chartDecisions)}, alias ${pct(alias, chartDecisions)}, fallback ${pct(fallback, chartDecisions)}, unkeyed ${pct(unkeyed, chartDecisions)}.`);
  lines.push(`- Exact source-line hits: ${diagnostics.lineHits} decisions; other line-capable source decisions use aggregate charts for the requested runtime key.`);
  lines.push("- Decision samples show aliases as `requested-key->source-key`; only unresolvable nodes fall back to generated widths.");
  lines.push("- Chart MAE is calculated only when the requested exact source chart exists. Alias nodes are reported as data gaps because there is no target chart to diff against.");
  lines.push("- Source `allin` cells are treated as strong aggressive raises in normal 100bb 6-max nodes, not literal open jams.");
  lines.push("- 3bet and defend frequencies should be treated as style diagnostics, not proof of GTO accuracy.");
  lines.push("");
  lines.push("## Source Coverage");
  lines.push("");
  lines.push("| Source mode | Decisions | Share | Meaning |");
  lines.push("| --- | ---: | ---: | --- |");
  lines.push(`| exact | ${exact} | ${pct(exact, chartDecisions)} | Requested node has an exact source chart. |`);
  lines.push(`| alias | ${alias} | ${pct(alias, chartDecisions)} | Requested node is mapped to a nearby source chart. |`);
  lines.push(`| fallback | ${fallback} | ${pct(fallback, chartDecisions)} | No source chart resolved; generated range fallback was used. |`);
  lines.push(`| unkeyed | ${unkeyed} | ${pct(unkeyed, chartDecisions)} | No chart key exists for the spot. |`);
  lines.push("");
  lines.push("## Provider Coverage");
  lines.push("");
  lines.push("| Provider | Decisions | Share |");
  lines.push("| --- | ---: | ---: |");
  const providerRows = sortedCounts(diagnostics.providerHits);
  if (!providerRows.length) lines.push("| - | 0 | - |");
  for (const [provider, count] of providerRows) {
    lines.push(`| ${provider} | ${count} | ${pct(count, diagnostics.decisions)} |`);
  }
  lines.push("");
  lines.push("## Spot Breakdown");
  lines.push("");
  lines.push("| Spot | Decisions | Share |");
  lines.push("| --- | ---: | ---: |");
  for (const [spot, count] of sortedCounts(diagnostics.spotTypes)) {
    lines.push(`| ${spot} | ${count} | ${pct(count, diagnostics.decisions)} |`);
  }
  lines.push("");
  lines.push("## Chart Node Coverage");
  lines.push("");
  lines.push("| Requested node | Source | Provider | Spot | Decisions | Exact | Alias | Fallback | MAE |");
  lines.push("| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |");
  for (const node of nodeRows.slice(0, 24)) {
    const mae = node.exact > 0 ? chartMaeForNode(node, args) : null;
    lines.push(
      `| ${node.requestedKey} | ${node.resolvedKey} | ${node.resolvedProvider} | ${node.spotType} | ${node.decisions} | ${node.exact} | ${node.alias} | ${node.fallback} | ${mae == null ? "n/a" : round(mae, 4)} |`,
    );
  }
  lines.push("");
  lines.push("## Alias Mappings");
  lines.push("");
  lines.push("| Mapping | Decisions | Share |");
  lines.push("| --- | ---: | ---: |");
  const aliasRows = sortedCounts(diagnostics.aliasMappings);
  if (!aliasRows.length) lines.push("| - | 0 | - |");
  for (const [mapping, count] of aliasRows.slice(0, 20)) {
    lines.push(`| ${mapping} | ${count} | ${pct(count, diagnostics.decisions)} |`);
  }
  lines.push("");
  lines.push("## Fallback Nodes");
  lines.push("");
  lines.push("| Node | Decisions | Share |");
  lines.push("| --- | ---: | ---: |");
  const fallbackRows = sortedCounts(diagnostics.fallbackNodes);
  if (!fallbackRows.length) lines.push("| - | 0 | - |");
  for (const [node, count] of fallbackRows.slice(0, 20)) {
    lines.push(`| ${node} | ${count} | ${pct(count, diagnostics.decisions)} |`);
  }
  lines.push("");
  lines.push("## Exact Chart MAE Check");
  lines.push("");
  lines.push("| Node | Decisions | Combo-weighted action MAE |");
  lines.push("| --- | ---: | ---: |");
  for (const node of maeRows) {
    lines.push(`| ${node.requestedKey} | ${node.decisions} | ${round(node.mae, 5)} |`);
  }
  if (!maeRows.length) lines.push("| - | 0 | - |");
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
  lines.push("| Hand | Pos | Cards | Code | Context | Spot | Aggressor | Mode | Source | Picked | Top mix |");
  lines.push("| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const row of decisionSamples) {
    lines.push(
      `| ${row.hand} | ${row.position} | ${row.cards} | ${row.handCode} | ${row.context} | ${row.spotType} | ${row.aggressor || "-"} | ${row.sourceMode} | ${row.source} | ${row.picked} | ${row.topMix} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rng = mulberry32(args.seed);
  const stats = Object.fromEntries(POSITIONS.map((position) => [position, emptyStats()]));
  const diagnostics = emptyDiagnostics();
  const handSamples = [];
  const decisionSamples = [];

  for (let hand = 1; hand <= args.hands; hand += 1) {
    for (const position of POSITIONS) stats[position].hands += 1;
    const summary = playHand({ handNumber: hand, rng, args, stats, samples: decisionSamples, diagnostics });
    if (handSamples.length < 40) handSamples.push(summary);
  }

  const report = buildReport({ args, stats, handSamples, decisionSamples, diagnostics });
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
