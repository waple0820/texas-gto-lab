import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import {
  buildRangeWeights,
  cardLabel,
  compareSolvedHands,
  makeDeck,
  round,
  shuffle,
  solveCards,
} from "../src/poker-core.js";
import { pickAction, recommendStrategy } from "../src/strategy-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 5174);
const MAX_SEATS = 6;
const START_STACK = 100;
const SMALL_BLIND = 0.5;
const BIG_BLIND = 1;
const AI_NAMES = [
  "蜡笔小新",
  "葫芦娃",
  "迪迦奥特曼",
  "哆啦A梦",
  "樱桃小丸子",
  "孙悟空",
  "哪吒",
  "黑猫警长",
  "蓝精灵",
  "海绵宝宝",
  "皮卡丘",
  "阿童木",
];
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

let nextPlayerId = 1;
let nextAiIndex = 1;
let nextChatId = 1;
const clients = new Map();
const pendingAiTimers = new Set();

const table = {
  phase: "waiting",
  handNumber: 0,
  players: [],
  deck: [],
  board: [],
  street: "waiting",
  pot: 0,
  currentBet: 0,
  turnId: null,
  dealerIndex: -1,
  smallBlindId: null,
  bigBlindId: null,
  acted: new Set(),
  actions: [],
  reviews: [],
  chat: [],
  log: [],
  winners: [],
  lastEvent: "等待玩家入座",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/health") {
    json(res, 200, {
      ok: true,
      service: "texas-gto-lab",
      players: table.players.length,
      phase: table.phase,
      handNumber: table.handNumber,
      uptimeSeconds: Math.round(process.uptime()),
    });
    return;
  }
  await serveStatic(url.pathname, res);
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  const client = { ws, playerId: null };
  clients.set(ws, client);

  ws.on("message", (raw) => {
    try {
      const message = JSON.parse(String(raw));
      handleMessage(client, message);
    } catch (error) {
      send(ws, { type: "error", message: "消息格式错误" });
    }
  });

  ws.on("close", () => {
    const player = getPlayer(client.playerId);
    if (player?.type === "human") {
      if (table.phase === "playing" && player.inHand) {
        player.connected = false;
        player.socket = null;
        player.ready = false;
        if (!player.folded && !player.allIn) foldDisconnectedPlayer(player);
      } else {
        removePlayer(player);
        pruneIdleTable();
      }
      table.lastEvent = `${player.name} 离线`;
      broadcast();
    }
    clients.delete(ws);
  });

  send(ws, { type: "hello", maxSeats: MAX_SEATS });
});

server.listen(PORT, HOST, () => {
  console.log(`Texas GTO Lab server listening on http://${HOST}:${PORT}`);
});

async function serveStatic(pathname, res) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(DIST, safePath));
  if (!filePath.startsWith(DIST)) {
    json(res, 403, { ok: false, error: "forbidden" });
    return;
  }
  const target = existsSync(filePath) ? filePath : path.join(DIST, "index.html");
  try {
    const ext = path.extname(target);
    res.writeHead(200, {
      "content-type": MIME[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-store" : "public, max-age=31536000, immutable",
    });
    createReadStream(target).pipe(res);
  } catch {
    const fallback = await readFile(path.join(DIST, "index.html"));
    res.writeHead(200, { "content-type": MIME[".html"], "cache-control": "no-store" });
    res.end(fallback);
  }
}

function handleMessage(client, message) {
  if (message.type === "join") {
    joinHuman(client, message.name);
    return;
  }
  const player = getPlayer(client.playerId);
  if (!player) {
    send(client.ws, { type: "error", message: "请先输入用户名入座" });
    return;
  }
  if (message.type === "ready") {
    player.ready = true;
    table.lastEvent = `${player.name} 举手准备`;
    maybeStartHand();
    broadcast();
    return;
  }
  if (message.type === "add_ai") {
    addAiPlayer();
    maybeStartHand();
    broadcast();
    return;
  }
  if (message.type === "action") {
    handlePlayerAction(player, message.action);
    return;
  }
  if (message.type === "chat") {
    addChatMessage(player, message.text);
    broadcast();
    return;
  }
}

function joinHuman(client, rawName) {
  const name = sanitizeName(rawName);
  let player = table.players.find((seat) => seat.type === "human" && !seat.connected && seat.name === name);
  if (!player) {
    if (table.players.length >= MAX_SEATS) {
      send(client.ws, { type: "error", message: "牌桌已满，最多 6 人" });
      return;
    }
    player = makePlayer(name, "human");
    table.players.push(player);
  }
  player.connected = true;
  player.socket = client.ws;
  client.playerId = player.id;
  table.lastEvent = `${player.name} 入座`;
  ensureDefaultOpponent();
  broadcast();
}

function ensureDefaultOpponent() {
  const seated = table.players.filter((player) => player.type === "human" || player.type === "ai");
  if (seated.length < 2) addAiPlayer();
}

function addAiPlayer() {
  if (table.players.length >= MAX_SEATS) return null;
  const name = pickAiName();
  const player = makePlayer(name, "ai");
  player.ready = true;
  table.players.push(player);
  table.lastEvent = `${player.name} 加入牌桌`;
  return player;
}

function pickAiName() {
  const used = new Set(table.players.map((player) => player.name));
  const available = AI_NAMES.filter((name) => !used.has(name));
  const pool = available.length ? available : AI_NAMES;
  const base = pool[Math.floor(Math.random() * pool.length)] || `AI ${nextAiIndex}`;
  const name = used.has(base) ? `${base} ${nextAiIndex}` : base;
  nextAiIndex += 1;
  return name;
}

function makePlayer(name, type) {
  return {
    id: `p${nextPlayerId++}`,
    name,
    type,
    connected: type === "ai",
    socket: null,
    stack: START_STACK,
    ready: type === "ai",
    inHand: false,
    folded: false,
    allIn: false,
    streetBet: 0,
    totalBet: 0,
    hole: [],
    review: [],
    lastAction: null,
  };
}

function sanitizeName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 18) || `玩家${nextPlayerId}`;
}

function getPlayer(id) {
  return table.players.find((player) => player.id === id);
}

function removePlayer(player) {
  table.players = table.players.filter((seat) => seat.id !== player.id);
}

function pruneIdleTable() {
  const hasOnlineHuman = table.players.some((player) => player.type === "human" && player.connected);
  if (!hasOnlineHuman && table.phase !== "playing") {
    table.players = [];
    table.phase = "waiting";
    table.street = "waiting";
    table.handNumber = 0;
    table.board = [];
    table.pot = 0;
    table.currentBet = 0;
    table.turnId = null;
    table.actions = [];
    table.reviews = [];
    table.winners = [];
    table.chat = [];
    table.lastEvent = "等待玩家入座";
  }
}

function maybeStartHand() {
  if (!["waiting", "showdown"].includes(table.phase)) return;
  const candidates = table.players.filter((player) => canJoinNextHand(player));
  const humanCandidates = candidates.filter((player) => player.type === "human");
  if (candidates.length < 2) return;
  if (humanCandidates.some((player) => !player.ready)) return;
  startHand(candidates);
}

function canJoinNextHand(player) {
  if (player.stack <= 0) player.stack = START_STACK;
  return player.type === "ai" || player.connected;
}

function startHand(players) {
  clearAiTimers();
  table.phase = "playing";
  table.handNumber += 1;
  table.deck = shuffle(makeDeck());
  table.board = [];
  table.street = "preflop";
  table.pot = 0;
  table.currentBet = 0;
  table.acted = new Set();
  table.actions = [];
  table.reviews = [];
  table.log = [];
  table.winners = [];
  table.lastEvent = `第 ${table.handNumber} 手牌开始`;

  for (const player of table.players) {
    player.inHand = players.includes(player);
    player.folded = false;
    player.allIn = false;
    player.streetBet = 0;
    player.totalBet = 0;
    player.hole = player.inHand ? [table.deck.pop(), table.deck.pop()] : [];
    player.review = [];
    player.lastAction = null;
    if (player.type === "human") player.ready = false;
  }

  const active = activePlayers();
  table.dealerIndex = nextDealerIndex(active);
  const dealer = active[table.dealerIndex];
  const sb = active.length === 2 ? dealer : active[nextIndex(active, table.dealerIndex)];
  const bb = active[nextIndex(active, active.indexOf(sb))];
  table.smallBlindId = sb.id;
  table.bigBlindId = bb.id;
  postBlind(sb, SMALL_BLIND, "小盲");
  postBlind(bb, BIG_BLIND, "大盲");
  table.currentBet = Math.max(SMALL_BLIND, BIG_BLIND);
  table.turnId = active[nextIndex(active, active.indexOf(bb))].id;
  broadcast();
  queueAiIfNeeded();
}

function nextDealerIndex(active) {
  if (!active.length) return -1;
  if (table.dealerIndex < 0) return 0;
  const oldDealer = active[table.dealerIndex]?.id;
  const oldIndex = active.findIndex((player) => player.id === oldDealer);
  return nextIndex(active, oldIndex >= 0 ? oldIndex : table.dealerIndex - 1);
}

function nextIndex(list, index) {
  return (index + 1 + list.length) % list.length;
}

function postBlind(player, amount, label) {
  const paid = commit(player, amount);
  recordAction(player, "blind", label, paid);
}

function commit(player, amount) {
  const paid = Math.min(player.stack, Math.max(0, amount));
  player.stack = round(player.stack - paid, 1);
  player.streetBet = round(player.streetBet + paid, 1);
  player.totalBet = round(player.totalBet + paid, 1);
  table.pot = round(table.pot + paid, 1);
  if (player.stack <= 0.01) player.allIn = true;
  return paid;
}

function handlePlayerAction(player, action) {
  if (table.phase !== "playing" || table.turnId !== player.id || player.folded || player.allIn) return;
  const actionCount = table.actions.length;
  const review = buildReview(player, action);
  applyAction(player, action);
  if (table.actions.length > actionCount && review) recordReview(player, review, table.actions.at(-1));
  if (table.phase === "playing") advanceTurnOrStreet(player);
  broadcast();
  queueAiIfNeeded();
}

function applyAction(player, action) {
  const toCall = toCallFor(player);
  if (action === "fold" && toCall > 0) {
    player.folded = true;
    table.acted.add(player.id);
    recordAction(player, "fold", "弃牌", 0);
    return;
  }
  if (action === "check-call") {
    if (toCall > 0) {
      const paid = commit(player, toCall);
      recordAction(player, "call", "跟注", paid);
    } else {
      recordAction(player, "check", "过牌", 0);
    }
    table.acted.add(player.id);
    return;
  }
  const aggressive = action === "half" ? 0.5 : action === "pot" ? 1 : action === "allin" ? "allin" : null;
  if (aggressive) {
    const size = aggressive === "allin" ? player.stack + toCall : Math.max(BIG_BLIND, table.pot * aggressive);
    const target = action === "allin" ? player.streetBet + player.stack : table.currentBet + size;
    const paid = commit(player, Math.max(0, target - player.streetBet));
    table.currentBet = Math.max(table.currentBet, player.streetBet);
    table.acted = new Set([player.id]);
    const type = player.allIn ? "allin" : table.street === "preflop" || toCall > 0 ? "raise" : "bet";
    const label = player.allIn ? "全压" : type === "raise" ? "加注" : "下注";
    recordAction(player, type, label, paid);
  }
}

function toCallFor(player) {
  return round(Math.max(0, table.currentBet - player.streetBet), 1);
}

function advanceTurnOrStreet(lastPlayer) {
  const contenders = activePlayers().filter((player) => !player.folded);
  if (contenders.length === 1) {
    awardWithoutShowdown(contenders[0]);
    return;
  }
  const actors = contenders.filter((player) => !player.allIn);
  if (actors.length <= 1) {
    runoutAndShowdown();
    return;
  }
  const roundDone = actors.every((player) => table.acted.has(player.id) && player.streetBet === table.currentBet);
  if (roundDone) {
    advanceStreet();
    return;
  }
  table.turnId = nextActorAfter(lastPlayer.id);
}

function nextActorAfter(playerId) {
  const active = activePlayers();
  let index = active.findIndex((player) => player.id === playerId);
  for (let i = 0; i < active.length; i += 1) {
    index = nextIndex(active, index);
    const player = active[index];
    if (!player.folded && !player.allIn) return player.id;
  }
  return null;
}

function advanceStreet() {
  for (const player of activePlayers()) player.streetBet = 0;
  table.currentBet = 0;
  table.acted = new Set();

  if (table.street === "preflop") {
    table.board.push(table.deck.pop(), table.deck.pop(), table.deck.pop());
    table.street = "flop";
  } else if (table.street === "flop") {
    table.board.push(table.deck.pop());
    table.street = "turn";
  } else if (table.street === "turn") {
    table.board.push(table.deck.pop());
    table.street = "river";
  } else {
    showdown();
    return;
  }

  const dealer = activePlayers()[table.dealerIndex] || activePlayers()[0];
  table.turnId = nextActorAfter(dealer.id);
  table.lastEvent = `${streetLabel(table.street)} 发出`;
  if (!table.turnId) runoutAndShowdown();
}

function runoutAndShowdown() {
  while (table.board.length < 5) table.board.push(table.deck.pop());
  showdown();
}

function awardWithoutShowdown(winner) {
  winner.stack = round(winner.stack + table.pot, 1);
  table.winners = [{ id: winner.id, name: winner.name, amount: table.pot, hand: "未摊牌" }];
  table.lastEvent = `${winner.name} 赢得 ${round(table.pot, 1)}bb`;
  endHand();
}

function showdown() {
  while (table.board.length < 5) table.board.push(table.deck.pop());
  const contenders = activePlayers().filter((player) => !player.folded);
  const solved = contenders.map((player) => ({
    player,
    solved: solveCards([...player.hole, ...table.board]),
  }));
  const winners = compareSolvedHands(solved.map((item) => item.solved));
  const winnerRows = solved.filter((item) => winners.includes(item.solved));
  const share = table.pot / winnerRows.length;
  for (const row of winnerRows) row.player.stack = round(row.player.stack + share, 1);
  table.winners = winnerRows.map((row) => ({
    id: row.player.id,
    name: row.player.name,
    amount: round(share, 1),
    hand: row.solved.descr,
  }));
  table.lastEvent = `${table.winners.map((winner) => winner.name).join(" / ")} 摊牌获胜`;
  endHand();
}

function endHand() {
  table.phase = "showdown";
  table.street = "showdown";
  table.turnId = null;
  table.pot = 0;
  for (const player of table.players) {
    if (player.type === "human") player.ready = false;
  }
  pruneIdleTable();
}

function foldDisconnectedPlayer(player) {
  player.folded = true;
  table.acted.add(player.id);
  recordAction(player, "fold", "离线弃牌", 0);
  advanceTurnOrStreet(player);
}

function activePlayers() {
  return table.players.filter((player) => player.inHand);
}

function recordAction(player, type, label, amount) {
  const action = {
    order: table.actions.length + 1,
    actorId: player.id,
    actor: player.name,
    actorType: player.type,
    street: table.street,
    type,
    label,
    amount: round(amount || 0, 1),
    pot: round(table.pot, 1),
    board: [...table.board],
  };
  player.lastAction = action;
  table.actions.push(action);
  table.lastEvent = `${player.name} ${label}${action.amount ? ` ${action.amount}bb` : ""}`;
  return action;
}

function buildReview(player, action) {
  const recommendation = recommendFor(player);
  const toCall = toCallFor(player);
  const chosenKey = actionKey(action, toCall, table.street);
  const chosenFrequency = frequencyFor(recommendation.actions, chosenKey);
  const best = recommendation.actions[0];
  const verdict = verdictFor(chosenFrequency, best.frequency);
  return {
    handNumber: table.handNumber,
    actorId: player.id,
    actor: player.name,
    actorType: player.type,
    street: table.street,
    board: [...table.board],
    chosenLabel: actionLabel(action, toCall, table.street),
    chosenFrequency,
    bestLabel: best.label,
    bestFrequency: best.frequency,
    verdict,
    equity: recommendation.equity.equity,
    potOdds: recommendation.metrics.potOdds,
    sizing: recommendation.sizing.label,
    pot: table.pot,
    toCall,
    mix: recommendation.actions.map((item) => ({
      label: item.label,
      key: item.key,
      frequency: item.frequency,
      tone: item.tone,
    })),
    reasons: recommendation.reasons.slice(0, 4),
  };
}

function recordReview(player, review, actionRecord) {
  const row = {
    ...review,
    actionOrder: actionRecord.order,
    amount: actionRecord.amount,
    potAfter: actionRecord.pot,
  };
  player.review.push(row);
  table.reviews.push(row);
}

function addChatMessage(player, rawText) {
  const text = sanitizeChat(rawText);
  if (!text) return;
  const row = {
    id: nextChatId++,
    actorId: player.id,
    actor: player.name,
    actorType: player.type,
    text,
    handNumber: table.handNumber,
    ts: Date.now(),
  };
  table.chat.push(row);
  if (table.chat.length > 80) table.chat = table.chat.slice(-80);
  table.lastEvent = `${player.name}: ${text}`;
}

function sanitizeChat(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 180);
}

function recommendFor(player) {
  const toCall = toCallFor(player);
  const position = positionFor(player);
  const context = contextFor(player, toCall);
  const rangeWeights = buildRangeWeights({
    style: "balanced",
    position,
    context,
    tableSize: activePlayers().length,
    stackBb: Math.max(1, player.stack),
  });
  return recommendStrategy({
    hero: player.hole,
    board: table.board,
    position,
    context,
    tableSize: activePlayers().length,
    stackBb: Math.max(1, player.stack),
    pot: table.pot,
    toCall,
    opponents: Math.max(1, activePlayers().filter((seat) => seat.id !== player.id && !seat.folded).length),
    rangeWeights,
    iterations: player.type === "ai" ? 420 : 700,
  });
}

function positionFor(player) {
  if (player.id === table.smallBlindId) return "SB";
  if (player.id === table.bigBlindId) return "BB";
  const active = activePlayers();
  if (player.id === active[table.dealerIndex]?.id) return "BTN";
  return "CO";
}

function contextFor(player, toCall) {
  if (table.street === "preflop") {
    if (toCall <= 0) {
      if (player.id === table.bigBlindId || table.actions.some((item) => item.street === "preflop" && item.type === "call")) {
        return "check-option";
      }
      return "unopened";
    }
    if (table.currentBet > BIG_BLIND) return "facing-3bet";
    return player.id === table.bigBlindId ? "blind-defense" : "facing-open";
  }
  if (toCall > 0 && table.currentBet >= table.pot * 0.55) return "facing-bet";
  if (toCall > 0) return "facing-raise";
  return "single-raised";
}

function actionKey(action, toCall, street = table.street) {
  if (action === "fold") return "fold";
  if (action === "check-call") return toCall > 0 ? "call" : "check";
  if (action === "half") return toCall > 0 || street === "preflop" ? "raise" : "bet-small";
  if (action === "pot" || action === "allin") return toCall > 0 ? "raise" : "bet-big";
  return "check";
}

function actionLabel(action, toCall, street = table.street) {
  if (action === "fold") return "弃牌";
  if (action === "check-call") return toCall > 0 ? "跟注" : "过牌";
  if (action === "half") return toCall > 0 || street === "preflop" ? "小加注" : "小注";
  if (action === "pot") return toCall > 0 || street === "preflop" ? "大加注" : "大注";
  if (action === "allin") return "All-in";
  return action;
}

function frequencyFor(actions, key) {
  const exact = actions.find((item) => item.key === key);
  if (exact) return exact.frequency;
  if (key === "bet-small") return actions.find((item) => item.key === "bet-big")?.frequency || 0;
  if (key === "bet-big") return actions.find((item) => item.key === "bet-small")?.frequency || 0;
  return 0;
}

function verdictFor(chosen, best) {
  const gap = best - chosen;
  if (chosen >= 0.45 || gap <= 0.12) return { label: "合理", tone: "good" };
  if (chosen >= 0.18) return { label: "可混合", tone: "mix" };
  return { label: "偏离", tone: "leak" };
}

function queueAiIfNeeded() {
  clearAiTimers();
  const player = getPlayer(table.turnId);
  if (table.phase !== "playing" || player?.type !== "ai") return;
  const timer = setTimeout(() => {
    pendingAiTimers.delete(timer);
    const current = getPlayer(table.turnId);
    if (current?.type !== "ai") return;
    const recommendation = recommendFor(current);
    const picked = pickAction(recommendation.actions, Math.random, current.name.includes("Loose") ? 1.45 : 0.9);
    let action = "check-call";
    if (toCallFor(current) > 0) {
      if (picked.key === "fold") action = "fold";
      else if (picked.key === "raise") action = "half";
    } else if (picked.key === "bet-small") {
      action = "half";
    } else if (picked.key === "bet-big" || picked.key === "raise") {
      action = "pot";
    }
    handlePlayerAction(current, action);
  }, 650);
  pendingAiTimers.add(timer);
}

function clearAiTimers() {
  for (const timer of pendingAiTimers) clearTimeout(timer);
  pendingAiTimers.clear();
}

function publicState(forPlayer = null) {
  return {
    phase: table.phase,
    handNumber: table.handNumber,
    street: table.street,
    streetLabel: streetLabel(table.street),
    board: table.board,
    pot: round(table.pot, 1),
    currentBet: table.currentBet,
    turnId: table.turnId,
    dealerId: activePlayers()[table.dealerIndex]?.id || null,
    smallBlindId: table.smallBlindId,
    bigBlindId: table.bigBlindId,
    maxSeats: MAX_SEATS,
    canAddAi: table.players.length < MAX_SEATS,
    lastEvent: table.lastEvent,
    actions: table.actions,
    tableReview: table.phase === "showdown" ? table.reviews : [],
    chat: table.chat,
    winners: table.winners,
    players: table.players.map((player) => ({
      id: player.id,
      name: player.name,
      type: player.type,
      connected: player.connected,
      stack: round(player.stack, 1),
      ready: player.ready,
      inHand: player.inHand,
      folded: player.folded,
      allIn: player.allIn,
      streetBet: player.streetBet,
      lastAction: player.lastAction,
      hole:
        player.id === forPlayer?.id
          ? player.hole
          : table.phase === "showdown" && player.inHand && !player.folded
            ? player.hole
            : [],
    })),
    me: forPlayer
      ? {
          id: forPlayer.id,
          name: forPlayer.name,
          hole: forPlayer.hole,
          ready: forPlayer.ready,
          review: forPlayer.review,
          toCall: table.phase === "playing" && forPlayer.inHand ? toCallFor(forPlayer) : 0,
          isTurn: table.turnId === forPlayer.id,
          actionOptions: actionOptionsFor(forPlayer),
        }
      : null,
  };
}

function actionOptionsFor(player) {
  if (!player || table.phase !== "playing" || table.turnId !== player.id || player.folded || player.allIn) return [];
  const toCall = toCallFor(player);
  const noCallPreflop = toCall <= 0 && table.street === "preflop";
  return [
    ...(toCall > 0 ? [{ id: "fold", label: "弃牌" }] : []),
    { id: "check-call", label: toCall > 0 ? `跟注 ${toCall}bb` : "过牌" },
    { id: "half", label: toCall > 0 || noCallPreflop ? "小加注" : "半池" },
    { id: "pot", label: toCall > 0 || noCallPreflop ? "大加注" : "满池" },
    { id: "allin", label: "All-in" },
  ];
}

function broadcast() {
  for (const player of table.players.filter((seat) => seat.type === "human" && seat.socket)) {
    send(player.socket, { type: "state", state: publicState(player) });
  }
}

function send(ws, payload) {
  if (ws?.readyState === 1) ws.send(JSON.stringify(payload));
}

function json(res, code, payload) {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(payload));
}

function streetLabel(street) {
  return {
    waiting: "等待",
    preflop: "翻前",
    flop: "翻牌",
    turn: "转牌",
    river: "河牌",
    showdown: "摊牌",
  }[street] || street;
}
