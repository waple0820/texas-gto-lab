import "./styles.css";
import { createIcons, icons } from "lucide";
import {
  ACTION_CONTEXTS,
  POSITIONS,
  RANGE_STYLES,
  RANKS,
  SUITS,
  buildRangeWeights,
  cardLabel,
  clamp,
  comboCountForCode,
  handCodeFromCards,
  makeDeck,
  matrixCode,
  pct,
  rangeCoverage,
  round,
  shuffle,
  suitTone,
  validateCards,
} from "./poker-core.js";
import { preflopStrategyActions } from "./preflop-policy.js";
import { recommendStrategy } from "./strategy-engine.js";
import { AI_LEVELS, HoldemSimulator, STREET_LABELS } from "./simulator.js";

const app = document.querySelector("#app");

const CONTEXT_LABELS = {
  unopened: "首先开池 (RFI)",
  "check-option": "过牌选项",
  "facing-open": "面对开池",
  "blind-defense": "盲注防守",
  "facing-3bet": "面对 3bet",
  "single-raised": "单加注池",
  "three-bet-pot": "3bet 池",
  "facing-bet": "面对下注",
  "facing-raise": "面对加注",
  "limped-pot": "跛入池",
};

const labState = {
  hero: [],
  board: [],
  target: "hero",
  rangeWeights: null,
  rangeKey: "",
};

let simulator = new HoldemSimulator();
let aiTimer = null;
const mpState = {
  ws: null,
  connected: false,
  joined: false,
  state: null,
  name: localStorage.getItem("texas-gto-name") || "",
  reviewActorId: null,
  reviewHandNumber: null,
  sessionReviews: [],
  sessionSeen: new Set(),
  pendingQuickStart: false,
  autoContinue: true,
  autoReadyTimer: null,
};

const PRACTICE_SPOTS = [
  { id: "utg-rfi", label: "UTG RFI", position: "UTG", context: "unopened" },
  { id: "hj-rfi", label: "HJ RFI", position: "HJ", context: "unopened" },
  { id: "co-rfi", label: "CO RFI", position: "CO", context: "unopened" },
  { id: "btn-rfi", label: "BTN RFI", position: "BTN", context: "unopened" },
  { id: "sb-rfi", label: "SB RFI", position: "SB", context: "unopened" },
  { id: "hj-vs-utg", label: "HJ vs UTG open", position: "HJ", context: "facing-open", aggressorPosition: "UTG" },
  { id: "co-vs-utg", label: "CO vs UTG open", position: "CO", context: "facing-open", aggressorPosition: "UTG" },
  { id: "co-vs-hj", label: "CO vs HJ open", position: "CO", context: "facing-open", aggressorPosition: "HJ" },
  { id: "btn-vs-utg", label: "BTN vs UTG open", position: "BTN", context: "facing-open", aggressorPosition: "UTG" },
  { id: "btn-vs-hj", label: "BTN vs HJ open", position: "BTN", context: "facing-open", aggressorPosition: "HJ" },
  { id: "btn-vs-co", label: "BTN vs CO open", position: "BTN", context: "facing-open", aggressorPosition: "CO" },
  { id: "sb-vs-btn", label: "SB vs BTN open", position: "SB", context: "blind-defense", aggressorPosition: "BTN" },
  { id: "bb-vs-utg", label: "BB vs UTG open", position: "BB", context: "blind-defense", aggressorPosition: "UTG" },
  { id: "bb-vs-co", label: "BB vs CO open", position: "BB", context: "blind-defense", aggressorPosition: "CO" },
  { id: "bb-vs-btn", label: "BB vs BTN open", position: "BB", context: "blind-defense", aggressorPosition: "BTN" },
  { id: "bb-vs-sb", label: "BB vs SB open", position: "BB", context: "blind-defense", aggressorPosition: "SB" },
  { id: "utg-vs-btn-3bet", label: "UTG vs BTN 3bet", position: "UTG", context: "facing-3bet", aggressorPosition: "BTN" },
  { id: "co-vs-btn-3bet", label: "CO vs BTN 3bet", position: "CO", context: "facing-3bet", aggressorPosition: "BTN" },
  { id: "btn-vs-sb-3bet", label: "BTN vs SB 3bet", position: "BTN", context: "facing-3bet", aggressorPosition: "SB" },
  { id: "sb-vs-bb-3bet", label: "SB vs BB 3bet", position: "SB", context: "facing-3bet", aggressorPosition: "BB" },
  { id: "btn-sqz-utg-co", label: "BTN squeeze vs UTG + CO", position: "BTN", context: "squeeze", aggressorPosition: "UTG", callerPositions: ["CO"] },
];

const practiceState = {
  current: null,
  answered: false,
  selectedKey: null,
  total: 0,
  correct: 0,
  streak: 0,
  history: [],
};

app.innerHTML = `
  <div class="app-shell">
    <div class="welcome-overlay" id="welcome-overlay" hidden>
      <div class="welcome-card">
        <div class="welcome-brand"><span class="brand-mark">GTO</span><span>Texas GTO Lab</span></div>
        <h2 class="welcome-title">和 GTO 对战,边打边纠错</h2>
        <p class="welcome-sub">你的 AI 扑克教练 —— 和 GTO 机器人实战,每个决策即时打分,打完自动生成你的<strong>漏洞报告</strong>。</p>
        <div class="welcome-modes">
          <div class="welcome-mode hot"><i data-lucide="zap"></i><b>对战桌</b><span>实战 + 即时纠错 + 漏洞报告</span></div>
          <div class="welcome-mode"><i data-lucide="dumbbell"></i><b>翻前练习</b><span>刷翻前范围,快速练手感</span></div>
          <div class="welcome-mode"><i data-lucide="calculator"></i><b>策略台</b><span>查任意局面的 GTO 策略与范围</span></div>
        </div>
        <div class="welcome-cta">
          <button class="primary-action" id="welcome-start"><i data-lucide="zap"></i><span>立即开始对战</span></button>
          <button class="ghost-action" id="welcome-skip"><span>随便逛逛</span></button>
        </div>
      </div>
    </div>
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">GTO</span>
        <div>
          <h1>Texas GTO Lab</h1>
          <span>Hold'em strategy workstation</span>
        </div>
      </div>
      <nav class="tabs" aria-label="Views">
        <button class="tab-button is-active" data-tab="lab"><i data-lucide="calculator"></i><span>策略台</span></button>
        <button class="tab-button" data-tab="practice"><i data-lucide="dumbbell"></i><span>翻前练习</span></button>
        <button class="tab-button" data-tab="multi"><i data-lucide="users"></i><span>对战桌</span></button>
      </nav>
    </header>

    <main>
      <section class="view is-active" data-view="lab">
        <div class="lab-grid">
          <section class="panel input-panel">
            <div class="panel-head">
              <h2>局面</h2>
              <div class="mini-actions">
                <button class="icon-button" id="random-scenario" title="随机局面"><i data-lucide="shuffle"></i></button>
                <button class="icon-button" id="reset-cards" title="清空牌面"><i data-lucide="rotate-ccw"></i></button>
              </div>
            </div>

            <div class="slot-block">
              <div class="slot-title">Hero</div>
              <div class="card-slots" id="hero-slots"></div>
            </div>

            <div class="slot-block">
              <div class="slot-title">Board</div>
              <div class="card-slots board-slots" id="board-slots"></div>
            </div>

            <div class="segmented target-tabs">
              <button class="is-active" data-target="hero">选手牌</button>
              <button data-target="board">选公共牌</button>
            </div>

            <div class="deck-grid" id="deck-grid" aria-label="Card picker"></div>
          </section>

          <section class="panel controls-panel">
            <div class="panel-head">
              <h2>参数</h2>
              <i data-lucide="sliders-horizontal"></i>
            </div>
            <div class="form-grid">
              <label>位置
                <select id="position"></select>
              </label>
              <label>行动线
                <select id="context"></select>
              </label>
              <label>牌桌人数
                <input id="table-size" type="number" min="2" max="9" value="6" />
              </label>
              <label>有效筹码 BB
                <input id="stack-bb" type="number" min="1" max="500" value="100" />
              </label>
              <label>底池 BB
                <input id="pot-size" type="number" min="0" max="1000" step="0.5" value="6" />
              </label>
              <label>需跟注 BB
                <input id="to-call" type="number" min="0" max="1000" step="0.5" value="0" />
              </label>
              <label>对手人数
                <input id="opponents" type="number" min="1" max="8" value="1" />
              </label>
              <label>采样数
                <input id="iterations" type="number" min="100" max="12000" step="100" value="1600" />
              </label>
              <label>对手范围
                <select id="range-style"></select>
              </label>
            </div>
            <button class="primary-action" id="run-calc"><i data-lucide="target"></i><span>计算策略</span></button>
            <div class="status-line" id="lab-status"></div>
          </section>

          <section class="panel output-panel">
            <div class="panel-head">
              <h2>建议</h2>
              <span id="sample-count">Ready</span>
            </div>
            <div class="policy-source-row" id="policy-source-row" hidden></div>
            <div class="advice-hero" id="lab-advice-hero" hidden></div>
            <div id="action-mix" class="action-mix empty-state">选择手牌并计算</div>
            <div class="metric-grid" id="metric-grid"></div>
            <div class="sizing-tree" id="sizing-tree"></div>
            <div class="tag-row" id="reason-tags"></div>
            <div class="distribution" id="distribution"></div>
          </section>

          <section class="panel range-panel">
            <div class="panel-head">
              <h2>范围矩阵</h2>
              <span id="range-meta"></span>
            </div>
            <div class="range-summary" id="range-summary"></div>
            <div class="range-matrix" id="range-matrix"></div>
          </section>
        </div>
      </section>

      <section class="view" data-view="practice">
        <div class="practice-grid">
          <section class="panel practice-question">
            <div class="panel-head">
              <h2>翻前题面</h2>
              <button class="icon-button" id="practice-next" title="下一题"><i data-lucide="shuffle"></i></button>
            </div>
            <div class="practice-spot" id="practice-spot"></div>
            <div class="practice-cards" id="practice-cards"></div>
            <div class="practice-actions" id="practice-actions"></div>
            <div class="practice-result" id="practice-result"></div>
          </section>

          <section class="panel practice-info">
            <div class="panel-head">
              <h2>统计</h2>
              <i data-lucide="chart-no-axes-column"></i>
            </div>
            <div class="practice-stats" id="practice-stats"></div>
            <div class="practice-mix" id="practice-mix"></div>
          </section>

          <section class="panel practice-history-panel">
            <div class="panel-head">
              <h2>最近题目</h2>
              <button class="icon-button" id="practice-reset" title="重置统计"><i data-lucide="rotate-ccw"></i></button>
            </div>
            <div class="practice-history" id="practice-history"></div>
          </section>
        </div>
      </section>

      <section class="view" data-view="sim">
        <div class="sim-grid">
          <section class="table-panel">
            <div class="poker-table">
              <div class="seat seat-ai">
                <div class="seat-name">AI</div>
                <div class="stack" id="ai-stack"></div>
                <div class="last-action" id="ai-last-action"></div>
                <div class="mini-cards" id="ai-cards"></div>
              </div>
              <div class="board-zone">
                <div class="pot" id="sim-pot"></div>
                <div class="board-cards" id="sim-board"></div>
                <div class="street" id="sim-street"></div>
              </div>
              <div class="seat seat-hero">
                <div class="mini-cards" id="hero-cards"></div>
                <div class="seat-name">Hero</div>
                <div class="stack" id="hero-stack"></div>
                <div class="last-action" id="hero-last-action"></div>
              </div>
            </div>
          </section>

          <aside class="panel sim-controls">
            <div class="panel-head">
              <h2>对战</h2>
              <button class="icon-button" id="new-hand" title="新一手"><i data-lucide="refresh-cw"></i></button>
            </div>
            <label>AI 强度
              <select id="ai-level"></select>
            </label>
            <div class="sim-actions" id="sim-actions"></div>
            <div class="ai-readout" id="ai-readout"></div>
            <div class="action-line-shell">
              <div class="subhead">
                <strong>行动线</strong>
                <span id="action-count">0 actions</span>
              </div>
              <div class="action-line" id="action-line"></div>
            </div>
            <div class="review-shell">
              <div class="subhead">
                <strong>复盘</strong>
                <span id="review-count">0 decisions</span>
              </div>
              <div class="review-list" id="review-list"></div>
            </div>
            <div class="hand-log" id="hand-log"></div>
          </aside>
        </div>
      </section>

      <section class="view" data-view="multi">
        <div class="multi-grid">
          <section class="table-panel">
            <div class="multiplayer-table">
              <div class="mp-seats" id="mp-seats"></div>
              <div class="mp-center">
                <div class="pot" id="mp-pot">Pot 0bb</div>
                <div class="board-cards" id="mp-board"></div>
                <div class="street" id="mp-street">等待</div>
                <div class="mp-event" id="mp-event"></div>
                <div class="mp-ready-board" id="mp-ready-board"></div>
                <button class="mp-table-ready" id="mp-table-ready">举手准备</button>
              </div>
              <div class="mp-floating-action">
                <div class="mp-floating-head">
                  <strong>本手行动</strong>
                  <span id="mp-table-action-count">0</span>
                </div>
                <div class="mp-table-action-line" id="mp-table-action-line"></div>
              </div>
              <div class="mp-hero-hand" id="mp-hero-hand"></div>
            </div>
          </section>

          <aside class="panel multi-controls">
            <div class="panel-head">
              <h2>对战桌</h2>
              <span id="mp-status">未连接</span>
            </div>
            <div class="join-box" id="join-box">
              <label>用户名
                <input id="mp-name" maxlength="18" autocomplete="off" placeholder="留空自动取名" />
              </label>
              <button class="primary-action" id="mp-quick"><i data-lucide="zap"></i><span>快速开始</span></button>
              <button class="ghost-action" id="mp-join"><i data-lucide="log-in"></i><span>仅入座 · 自己配桌</span></button>
              <p class="join-hint">一键坐下,自动配 3 个 GTO 电脑、立即发牌 —— 每个决策都有即时纠错。</p>
            </div>
            <div class="mp-toolbar">
              <button id="mp-ready">举手准备</button>
              <button id="mp-leave">离桌</button>
              <button id="mp-add-ai">添加电脑</button>
              <button id="mp-autocontinue" class="toggle is-on"><i data-lucide="repeat"></i><span>自动下一手</span></button>
              <button id="mp-copy-link">复制邀请链接</button>
            </div>
            <div class="mp-advice" id="mp-advice" hidden>
              <div class="subhead">
                <strong>GTO 建议</strong>
                <span class="policy-badge" id="mp-advice-badge"></span>
              </div>
              <div class="advice-hero" id="mp-advice-hero"></div>
              <div class="advice-coach" id="mp-advice-coach"></div>
              <div class="action-mix" id="mp-advice-mix"></div>
              <div class="metric-grid" id="mp-advice-metrics"></div>
              <div class="advice-note" id="mp-advice-note"></div>
            </div>
            <div class="sim-actions" id="mp-actions"></div>
            <div class="showdown-shell" id="mp-showdown-shell" hidden>
              <div class="subhead">
                <strong>摊牌</strong>
                <span id="mp-showdown-count">0 hands</span>
              </div>
              <div class="mp-showdown-cards" id="mp-showdown-cards"></div>
            </div>
            <div class="mp-feed">
              <div class="mp-feed-tabs" role="tablist">
                <button class="mp-feed-tab is-active" data-feed="line"><i data-lucide="activity"></i><span>行动线</span><em id="mp-action-count">0</em></button>
                <button class="mp-feed-tab" data-feed="range"><i data-lucide="grid-3x3"></i><span>范围</span></button>
                <button class="mp-feed-tab" data-feed="review"><i data-lucide="git-compare"></i><span>复盘</span><em id="mp-review-count">0</em></button>
                <button class="mp-feed-tab" data-feed="chat"><i data-lucide="message-circle"></i><span>聊天</span><em id="mp-chat-count">0</em></button>
              </div>
              <div class="mp-feed-panel is-active" data-feed-panel="line">
                <div class="action-line" id="mp-action-line"></div>
              </div>
              <div class="mp-feed-panel" data-feed-panel="range">
                <div class="mp-range-head"><span id="mp-range-meta">入座后显示你的 GTO 范围</span></div>
                <div class="mp-range-matrix" id="mp-range-matrix"></div>
              </div>
              <div class="mp-feed-panel" data-feed-panel="review">
                <div class="mp-report" id="mp-report"></div>
                <div class="review-tabs" id="mp-review-tabs" hidden></div>
                <div class="review-list" id="mp-review-list"></div>
              </div>
              <div class="mp-feed-panel" data-feed-panel="chat">
                <div class="chat-list" id="mp-chat-list"></div>
                <div class="chat-form">
                  <input id="mp-chat-input" maxlength="180" autocomplete="off" placeholder="说点什么" />
                  <button id="mp-chat-send"><i data-lucide="send"></i><span>发送</span></button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
`;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function hydrateIcons() {
  createIcons({ icons });
}

function optionMarkup(items, selected) {
  return items
    .map((item) => {
      const value = typeof item === "string" ? item : item.id;
      const label = typeof item === "string" ? item : item.label;
      return `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`;
    })
    .join("");
}

function setupControls() {
  $("#position").innerHTML = optionMarkup(POSITIONS, "CO");
  $("#context").innerHTML = optionMarkup(ACTION_CONTEXTS, "unopened");
  $("#range-style").innerHTML = optionMarkup(RANGE_STYLES, "balanced");
  $("#ai-level").innerHTML = optionMarkup(
    Object.entries(AI_LEVELS).map(([id, profile]) => ({ id, label: profile.label })),
    "regular",
  );
}

function selectedCards() {
  return [...labState.hero, ...labState.board];
}

function renderSlots() {
  $("#hero-slots").innerHTML = [0, 1]
    .map((index) => renderSlot(labState.hero[index], "hero", index, "H"))
    .join("");
  $("#board-slots").innerHTML = [0, 1, 2, 3, 4]
    .map((index) => renderSlot(labState.board[index], "board", index, "B"))
    .join("");
  $$(".card-slot").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.slotTarget;
      const index = Number(button.dataset.index);
      if (button.dataset.card) {
        labState[target].splice(index, 1);
      } else {
        labState.target = target;
      }
      renderLab();
    });
  });
}

function renderSlot(card, target, index, prefix) {
  const content = card ? cardLabel(card) : `${prefix}${index + 1}`;
  const tone = card ? suitTone(card) : "empty";
  return `
    <button class="card-slot ${tone}" data-slot-target="${target}" data-index="${index}" data-card="${card || ""}">
      ${content}
    </button>
  `;
}

function renderDeck() {
  const used = new Set(selectedCards());
  $("#deck-grid").innerHTML = RANKS.map((rank) =>
    SUITS.map((suit) => {
      const card = `${rank}${suit.id}`;
      const disabled = used.has(card) ? "disabled" : "";
      return `<button class="deck-card ${suit.tone}" data-card="${card}" ${disabled}>${rank}${suit.glyph}</button>`;
    }).join(""),
  ).join("");

  $$(".deck-card").forEach((button) => {
    button.addEventListener("click", () => {
      addCard(button.dataset.card);
    });
  });
}

function addCard(card) {
  const target = labState.target;
  const max = target === "hero" ? 2 : 5;
  if (selectedCards().includes(card)) return;
  if (labState[target].length >= max) return;
  labState[target].push(card);
  renderLab();
}

function renderTargetTabs() {
  $$(".target-tabs button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === labState.target);
  });
}

function controlsKey() {
  return [
    $("#position").value,
    $("#context").value,
    $("#table-size").value,
    $("#stack-bb").value,
    $("#range-style").value,
  ].join("|");
}

function resetRangeFromControls() {
  labState.rangeKey = controlsKey();
  labState.rangeWeights = buildRangeWeights({
    style: $("#range-style").value,
    position: $("#position").value,
    context: $("#context").value,
    tableSize: Number($("#table-size").value),
    stackBb: Number($("#stack-bb").value),
  });
}

function ensureRange() {
  if (!labState.rangeWeights || labState.rangeKey !== controlsKey()) resetRangeFromControls();
  return labState.rangeWeights;
}

function formatCellFrequency(weight) {
  if (weight <= 0) return "0";
  if (weight >= 0.995) return "100";
  return `${round(weight * 100, 0)}`;
}

function formatContribution(code, weight) {
  const contribution = (comboCountForCode(code) * weight) / 1326;
  if (contribution <= 0) return "0.00";
  return contribution < 0.001 ? "<0.10" : round(contribution * 100, 2).toFixed(2);
}

function renderRangeMatrix() {
  const weights = ensureRange();
  const coverage = rangeCoverage(weights);
  $("#range-meta").textContent = `总范围 ${round(coverage.percent * 100, 1)}% / ${coverage.combos} combos`;
  $("#range-summary").innerHTML = `
    <div>
      <span>格内数字</span>
      <strong>该手牌类别频率</strong>
    </div>
    <div>
      <span>总范围</span>
      <strong>按 combo 数加权</strong>
    </div>
    <div>
      <span>点击格子</span>
      <strong>0 / 25 / 50 / 75 / 100</strong>
    </div>
  `;
  const rows = [];
  for (let row = 0; row < RANKS.length; row += 1) {
    for (let col = 0; col < RANKS.length; col += 1) {
      const code = matrixCode(row, col);
      const weight = Number(weights[code] || 0);
      const combos = comboCountForCode(code);
      const frequency = formatCellFrequency(weight);
      const contribution = formatContribution(code, weight);
      const isPartial = weight > 0 && weight < 0.995;
      const cellType = row === col ? "cell-pair" : row < col ? "cell-suited" : "cell-offsuit";
      rows.push(`
        <button
          class="range-cell ${cellType} ${weight <= 0 ? "is-empty" : ""} ${isPartial ? "is-partial" : ""}"
          data-code="${code}"
          style="--weight:${weight}"
          title="${code}: ${frequency}% frequency, ${combos} combos, ${contribution}% of all starting hands"
        >
          <span class="range-code">${code}</span>
          <strong class="range-frequency">${frequency}</strong>
          <span class="range-contribution">${combos}c · ${contribution}%</span>
        </button>
      `);
    }
  }
  $("#range-matrix").innerHTML = rows.join("");
  $$(".range-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const code = cell.dataset.code;
      const current = Number(labState.rangeWeights[code] || 0);
      const steps = [0, 0.25, 0.5, 0.75, 1];
      const currentIndex = steps.findIndex((value) => value === current);
      const next =
        currentIndex >= 0
          ? steps[(currentIndex + 1) % steps.length]
          : (steps.find((value) => value > current) ?? 0);
      labState.rangeWeights[code] = next;
      renderRangeMatrix();
    });
  });
}

function renderLab() {
  renderSlots();
  renderDeck();
  renderTargetTabs();
  renderRangeMatrix();
  hydrateIcons();
}

function setStatus(message, tone = "") {
  const el = $("#lab-status");
  el.textContent = message;
  el.className = `status-line ${tone}`;
}

function readLabInputs() {
  return {
    position: $("#position").value,
    context: $("#context").value,
    tableSize: Number($("#table-size").value),
    stackBb: Number($("#stack-bb").value),
    pot: Number($("#pot-size").value),
    toCall: Number($("#to-call").value),
    opponents: Number($("#opponents").value),
    iterations: Number($("#iterations").value),
    rangeStyle: $("#range-style").value,
  };
}

async function runCalculation() {
  if (labState.hero.length !== 2) {
    setStatus("需要两张手牌", "warn");
    return;
  }
  if (![0, 3, 4, 5].includes(labState.board.length)) {
    setStatus("公共牌数量需要是 0 / 3 / 4 / 5", "warn");
    return;
  }
  const validation = validateCards([...labState.hero, ...labState.board]);
  if (!validation.ok) {
    setStatus(`重复牌: ${validation.duplicates.join(", ")}`, "warn");
    return;
  }
  setStatus("计算中...");
  $("#run-calc").disabled = true;
  await new Promise((resolve) => requestAnimationFrame(resolve));

  try {
    const inputs = readLabInputs();
    const result = recommendStrategy({
      hero: labState.hero,
      board: labState.board,
      ...inputs,
      rangeWeights: ensureRange(),
    });
    renderRecommendation(result);
    setStatus("已更新", "ok");
  } catch (error) {
    setStatus(error.message, "warn");
  } finally {
    $("#run-calc").disabled = false;
    hydrateIcons();
  }
}

const POLICY_BADGES = {
  solved: { label: "GTO 精确解", note: "CFR 求解的均衡策略", kind: "gto" },
  distilled: { label: "GTO 泛化", note: "蒸馏 GTO 神经网络", kind: "gto" },
  preflop: { label: "翻前范围表", note: "位置范围表策略", kind: "info" },
  trained: { label: "训练策略", note: "自博弈训练策略", kind: "info" },
  heuristic: { label: "启发式", note: "范围角色启发式", kind: "muted" },
};

function renderPolicySource(policySource) {
  const row = $("#policy-source-row");
  const badge = POLICY_BADGES[policySource?.type] || POLICY_BADGES.heuristic;
  row.hidden = false;
  row.className = `policy-source-row ${badge.kind}`;
  const version = policySource?.version ? ` · ${policySource.version}` : "";
  row.innerHTML = `<span class="policy-badge">${badge.label}</span><span class="policy-note">${badge.note}${version}</span>`;
}

function renderRecommendation(result) {
  $("#sample-count").textContent = `${result.equity.iterations} samples`;
  renderPolicySource(result.policySource);
  // hero callout — the GTO-preferred action, consistent with the battle decision station
  const sorted = [...result.actions].sort((a, b) => b.frequency - a.frequency);
  const top = sorted[0];
  const mixed = sorted.filter((a) => a.frequency >= 0.12).length > 1;
  const hero = $("#lab-advice-hero");
  if (hero && top) {
    hero.hidden = false;
    hero.innerHTML = `
      <div class="advice-hero-main ${top.tone || ""}">
        <span class="advice-hero-label">建议</span>
        <strong>${escapeHtml(top.label)}</strong>
        <span class="advice-hero-freq">${pct(top.frequency, 0)}</span>
      </div>
      <span class="advice-hero-tag">${mixed ? "混合策略" : "纯策略"}</span>`;
  }
  $("#action-mix").classList.remove("empty-state");
  $("#action-mix").innerHTML = result.actions
    .map(
      (action) => `
        <div class="mix-row ${action.tone}">
          <div class="mix-label">
            <strong>${action.label}</strong>
            <span>${pct(action.frequency, 1)}</span>
          </div>
          <div class="mix-bar"><span style="width:${action.frequency * 100}%"></span></div>
        </div>
      `,
    )
    .join("");

  $("#metric-grid").innerHTML = [
    ["权益", pct(result.equity.equity, 1)],
    ["胜率", pct(result.equity.win, 1)],
    ["平局", pct(result.equity.tie, 1)],
    ["Pot Odds", pct(result.metrics.potOdds, 1)],
    ["Call EV", `${round(result.metrics.callEv, 2)}bb`],
    ["SPR", round(result.metrics.spr, 1)],
    ["MDF", pct(result.metrics.mdf, 1)],
    ["尺度", result.sizing.label],
  ]
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  renderSizingTree(result.sizing);

  $("#reason-tags").innerHTML = result.reasons.map((reason) => `<span>${reason}</span>`).join("");
  $("#distribution").innerHTML = result.equity.distribution
    .slice(0, 7)
    .map(
      (item) => `
        <div class="dist-row">
          <span>${item.name}</span>
          <div><span style="width:${item.percent * 100}%"></span></div>
          <strong>${pct(item.percent, 1)}</strong>
        </div>
      `,
    )
    .join("");
}

function renderSizingTree(sizing) {
  const options = sizing?.options || [];
  if (!options.length) {
    $("#sizing-tree").innerHTML = "";
    return;
  }
  $("#sizing-tree").innerHTML = `
    <div class="subhead">
      <strong>尺度树</strong>
      <span>${escapeHtml(sizing.note || "")}</span>
    </div>
    <div class="size-grid">
      ${options
        .map(
          (option) => `
            <div class="size-chip ${option.recommended ? "is-primary" : ""}">
              <strong>${escapeHtml(option.label)}</strong>
              <span>${round(option.amount, 1)}bb</span>
              <em>${escapeHtml(option.role || "")}</em>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function randomScenario() {
  const deck = shuffle(makeDeck());
  labState.hero = [deck.pop(), deck.pop()];
  const boardCount = [0, 3, 4, 5][Math.floor(Math.random() * 4)];
  labState.board = Array.from({ length: boardCount }, () => deck.pop());
  labState.target = boardCount < 5 ? "board" : "hero";
  renderLab();
}

function resetCards() {
  labState.hero = [];
  labState.board = [];
  labState.target = "hero";
  setStatus("");
  renderLab();
}

function practiceSpotLabel(spot) {
  if (!spot) return "";
  if (spot.context === "unopened") return `${spot.position} 首入池`;
  if (spot.context === "facing-3bet") return `${spot.position} 面对 ${spot.aggressorPosition} 3bet`;
  if (spot.context === "squeeze") return `${spot.position} squeeze vs ${spot.aggressorPosition} + ${(spot.callerPositions || []).join("/")}`;
  return `${spot.position} 面对 ${spot.aggressorPosition} open`;
}

function practiceContextMeta(spot) {
  if (!spot) return "";
  if (spot.context === "unopened") return "6-max 100bb · RFI";
  if (spot.context === "facing-3bet") return "6-max 100bb · open 后面对 3bet";
  if (spot.context === "squeeze") return "6-max 100bb · open + cold call 后 squeeze";
  return "6-max 100bb · opener-specific 防守";
}

function generatePracticeQuestion() {
  const deck = shuffle(makeDeck());
  const cards = [deck.pop(), deck.pop()];
  const spot = PRACTICE_SPOTS[Math.floor(Math.random() * PRACTICE_SPOTS.length)];
  const handCode = handCodeFromCards(cards);
  const actions = preflopStrategyActions({
    handCode,
    position: spot.position,
    context: spot.context,
    aggressorPosition: spot.aggressorPosition,
    callerPositions: spot.callerPositions,
    tableSize: 6,
    stackBb: 100,
  });

  practiceState.current = {
    ...spot,
    cards,
    handCode,
    actions,
  };
  practiceState.answered = false;
  practiceState.selectedKey = null;
  renderPractice();
}

function practiceActionFrequency(actions, key) {
  if (key === "raise") {
    return actions
      .filter((action) => ["raise", "raise-small", "raise-big"].includes(action.key))
      .reduce((sum, action) => sum + action.frequency, 0);
  }
  return actions.find((action) => action.key === key)?.frequency || 0;
}

function practiceVerdict(actions, key) {
  const best = actions[0];
  const chosenFrequency = practiceActionFrequency(actions, key);
  const bestFrequency = best?.frequency || 0;
  const correct = chosenFrequency >= 0.35 || bestFrequency - chosenFrequency <= 0.12;
  if (correct && chosenFrequency < 0.55) return { correct, label: "可混合", tone: "mix", chosenFrequency, best };
  if (correct) return { correct, label: "合理", tone: "good", chosenFrequency, best };
  return { correct, label: "偏离", tone: "leak", chosenFrequency, best };
}

function answerPractice(key) {
  if (!practiceState.current || practiceState.answered) return;
  const verdict = practiceVerdict(practiceState.current.actions, key);
  practiceState.answered = true;
  practiceState.selectedKey = key;
  practiceState.total += 1;
  if (verdict.correct) {
    practiceState.correct += 1;
    practiceState.streak += 1;
  } else {
    practiceState.streak = 0;
  }
  practiceState.history.unshift({
    spot: practiceSpotLabel(practiceState.current),
    cards: practiceState.current.cards,
    handCode: practiceState.current.handCode,
    picked: key,
    verdict,
  });
  practiceState.history = practiceState.history.slice(0, 12);
  renderPractice();
}

function resetPracticeStats() {
  practiceState.total = 0;
  practiceState.correct = 0;
  practiceState.streak = 0;
  practiceState.history = [];
  renderPractice();
}

function renderPracticeActions(question) {
  const buttons = [
    { key: "fold", label: "弃牌" },
    { key: "call", label: "跟注" },
    { key: "raise", label: question?.context === "unopened" ? "Open" : question?.context === "facing-3bet" ? "4bet" : question?.context === "squeeze" ? "Squeeze" : "3bet" },
    { key: "jam", label: "Jam" },
  ];
  $("#practice-actions").innerHTML = buttons
    .map((item) => {
      const freq = question ? practiceActionFrequency(question.actions, item.key) : 0;
      const isPicked = practiceState.selectedKey === item.key;
      return `
        <button
          class="${isPicked ? "is-picked" : ""}"
          data-practice-action="${item.key}"
          ${practiceState.answered ? "disabled" : ""}
          title="${practiceState.answered ? `GTO 频率 ${pct(freq, 0)}` : item.label}"
        >
          <strong>${item.label}</strong>
          <span>${practiceState.answered ? pct(freq, 0) : "?"}</span>
        </button>
      `;
    })
    .join("");
  $$("#practice-actions button").forEach((button) => {
    button.addEventListener("click", () => answerPractice(button.dataset.practiceAction));
  });
}

function renderPracticeResult(question) {
  if (!question || !practiceState.answered) {
    $("#practice-result").innerHTML = `<div class="waiting">选择一个动作后显示答案</div>`;
    return;
  }
  const verdict = practiceVerdict(question.actions, practiceState.selectedKey);
  $("#practice-result").innerHTML = `
    <div class="practice-verdict ${verdict.tone}">
      <strong>${verdict.label}</strong>
      <span>你的动作频率 ${pct(verdict.chosenFrequency, 0)} · 最高频 ${verdict.best.label} ${pct(verdict.best.frequency, 0)}</span>
    </div>
    <button class="primary-action" id="practice-next-inline"><i data-lucide="arrow-right"></i><span>下一题</span></button>
  `;
  $("#practice-next-inline").addEventListener("click", generatePracticeQuestion);
}

function renderPracticeMix(question) {
  if (!question) {
    $("#practice-mix").innerHTML = "";
    return;
  }
  if (!practiceState.answered) {
    $("#practice-mix").innerHTML = `
      <div class="subhead">
        <strong>GTO 混合</strong>
        <span>${question.handCode}</span>
      </div>
      <div class="practice-locked">答题后显示完整频率</div>
    `;
    return;
  }
  $("#practice-mix").innerHTML = `
    <div class="subhead">
      <strong>GTO 混合</strong>
      <span>${question.handCode}</span>
    </div>
    ${question.actions
      .map(
        (action) => `
          <div class="mix-row ${action.tone}">
            <div class="mix-label">
              <strong>${action.label}</strong>
              <span>${pct(action.frequency, 1)}</span>
            </div>
            <div class="mix-bar"><span style="width:${action.frequency * 100}%"></span></div>
          </div>
        `,
      )
      .join("")}
  `;
}

function renderPracticeStats() {
  const accuracy = practiceState.total ? practiceState.correct / practiceState.total : 0;
  $("#practice-stats").innerHTML = [
    ["题数", practiceState.total],
    ["正确", practiceState.correct],
    ["正确率", practiceState.total ? pct(accuracy, 1) : "-"],
    ["连中", practiceState.streak],
  ]
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderPracticeHistory() {
  if (!practiceState.history.length) {
    $("#practice-history").innerHTML = `<div class="review-empty">还没有答题记录</div>`;
    return;
  }
  $("#practice-history").innerHTML = practiceState.history
    .map(
      (item) => `
        <article class="practice-history-item ${item.verdict.tone}">
          <div>
            <strong>${escapeHtml(item.spot)}</strong>
            <span>${item.cards.map(cardLabel).join(" ")} · ${item.handCode}</span>
          </div>
          <em>${item.verdict.label} · ${item.picked}</em>
        </article>
      `,
    )
    .join("");
}

function renderPractice() {
  const question = practiceState.current;
  if (!question) {
    $("#practice-spot").innerHTML = `<span>点击下一题开始</span>`;
    $("#practice-cards").innerHTML = "";
    $("#practice-actions").innerHTML = "";
    $("#practice-result").innerHTML = `<div class="waiting">准备随机题目</div>`;
    renderPracticeStats();
    renderPracticeMix(null);
    renderPracticeHistory();
    return;
  }
  $("#practice-spot").innerHTML = `
    <span>${practiceContextMeta(question)}</span>
    <strong>${practiceSpotLabel(question)}</strong>
  `;
  $("#practice-cards").innerHTML = `
    <div>${question.cards.map((card) => cardPip(card)).join("")}</div>
    <strong>${question.handCode}</strong>
  `;
  renderPracticeActions(question);
  renderPracticeResult(question);
  renderPracticeStats();
  renderPracticeMix(question);
  renderPracticeHistory();
  hydrateIcons();
}

// Color-code action buttons by type for at-a-glance poker reads.
function actionTone(id = "") {
  const key = String(id).toLowerCase();
  if (key.includes("fold")) return "act-fold";
  if (key.includes("allin") || key.includes("jam") || key.includes("all-in")) return "act-allin";
  if (key.includes("check") || key.includes("call")) return "act-call";
  return "act-bet"; // bets and raises (third/half/two-thirds/pot/overbet/raise/...)
}

function cardPip(card, hidden = false) {
  if (hidden) return `<span class="mini-card hidden">?</span>`;
  return `<span class="mini-card ${suitTone(card)}">${cardLabel(card)}</span>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function actorDisplay(actor) {
  return actor === "hero" ? "Hero" : "AI";
}

function actionText(action, compact = false) {
  const amount = action.amount > 0 ? ` ${round(action.amount, 1)}bb` : "";
  const actor = compact ? actorDisplay(action.actor)[0] : actorDisplay(action.actor);
  return `${actor} ${action.label}${amount}`;
}

function streetActionGroups() {
  const groups = [];
  for (const street of ["preflop", "flop", "turn", "river"]) {
    const actions = (simulator.actions || []).filter((action) => action.street === street);
    if (actions.length) groups.push({ street, actions });
  }
  return groups;
}

function lastActionFor(actor) {
  return [...(simulator.actions || [])].reverse().find((action) => action.actor === actor && action.type !== "blind");
}

function heroReviewContext(toCall) {
  if (simulator.street === "preflop") {
    if (simulator.currentBet > 2.5) return "facing-3bet";
    if (toCall <= 0) return "check-option";
    return "unopened";
  }
  if (toCall > 0 && simulator.currentBet >= simulator.pot * 0.55) return "facing-bet";
  if (toCall > 0) return "facing-raise";
  return "single-raised";
}

function actionKeyForReview(type, toCall, street = simulator.street) {
  if (type === "fold") return "fold";
  if (type === "check-call") return toCall > 0 ? "call" : "check";
  if (toCall > 0) {
    if (type === "allin") return "jam";
    if (type === "pot" || type === "overbet") return "raise-big";
    if (type === "third" || type === "half" || type === "two-thirds") return "raise-small";
  }
  if (street === "preflop") {
    if (["third", "half", "two-thirds", "pot", "overbet", "allin"].includes(type)) return "raise";
  }
  if (type === "third") return "bet-small";
  if (type === "half" || type === "two-thirds") return "bet-mid";
  if (type === "pot") return "bet-big";
  if (type === "overbet" || type === "allin") return "bet-over";
  return "check";
}

function actionLabelForReview(type, toCall, street = simulator.street) {
  if (type === "fold") return "弃牌";
  if (type === "check-call") return toCall > 0 ? "跟注" : "过牌";
  if (type === "third") return toCall > 0 || street === "preflop" ? "小加注" : "1/3 pot";
  if (type === "half") return toCall > 0 || street === "preflop" ? "小加注" : "1/2 pot";
  if (type === "two-thirds") return toCall > 0 || street === "preflop" ? "中加注" : "2/3 pot";
  if (type === "pot") return toCall > 0 || street === "preflop" ? "大加注" : "Pot";
  if (type === "overbet") return "Overbet";
  if (type === "allin") return "All-in";
  return type;
}

function reviewFrequency(actions, key) {
  const exact = actions.find((action) => action.key === key);
  if (exact) return exact.frequency;
  if (key === "raise") return actions.filter((action) => ["raise", "raise-small", "raise-big", "jam"].includes(action.key)).reduce((sum, action) => sum + action.frequency, 0);
  if (key === "raise-small" || key === "raise-big" || key === "jam") return actions.find((action) => action.key === "raise")?.frequency || 0;
  if (key === "bet-small") return actions.find((action) => action.key === "bet-mid")?.frequency || actions.find((action) => action.key === "bet-big")?.frequency || 0;
  if (key === "bet-mid") return actions.find((action) => action.key === "bet-small")?.frequency || actions.find((action) => action.key === "bet-big")?.frequency || 0;
  if (key === "bet-big") return actions.find((action) => action.key === "bet-mid")?.frequency || actions.find((action) => action.key === "bet-small")?.frequency || 0;
  if (key === "bet-over") return actions.find((action) => action.key === "bet-big")?.frequency || 0;
  return 0;
}

function reviewVerdict(chosenFrequency, bestFrequency) {
  const gap = bestFrequency - chosenFrequency;
  if (chosenFrequency >= 0.45 || gap <= 0.12) {
    return { label: "合理", tone: "good" };
  }
  if (chosenFrequency >= 0.18) {
    return { label: "可混合", tone: "mix" };
  }
  return { label: "偏离", tone: "leak" };
}

function captureHeroDecision(type) {
  const toCall = simulator.getToCall("hero");
  const context = heroReviewContext(toCall);
  const effectiveStack = Math.max(1, Math.min(simulator.heroStack, simulator.aiStack));
  const rangeWeights = buildRangeWeights({
    style: AI_LEVELS[simulator.level].rangeStyle,
    position: "BB",
    context,
    tableSize: 2,
    stackBb: effectiveStack,
  });
  const recommendation = recommendStrategy({
    hero: simulator.heroHole,
    board: simulator.board,
    position: "BTN",
    context,
    tableSize: 2,
    stackBb: effectiveStack,
    pot: simulator.pot,
    toCall,
    opponents: 1,
    rangeWeights,
    iterations: 700,
    lineProfile: simulator.lineProfileForActor("hero", toCall),
  });
  const chosenKey = actionKeyForReview(type, toCall, simulator.street);
  const chosenFrequency = reviewFrequency(recommendation.actions, chosenKey);
  const best = recommendation.actions[0];
  const verdict = reviewVerdict(chosenFrequency, best.frequency);

  simulator.review.push({
    street: simulator.street,
    board: [...simulator.board],
    hero: [...simulator.heroHole],
    pot: simulator.pot,
    toCall,
    actionType: type,
    chosenKey,
    chosenLabel: actionLabelForReview(type, toCall, simulator.street),
    chosenFrequency,
    bestLabel: best.label,
    bestFrequency: best.frequency,
    verdict,
    equity: recommendation.equity.equity,
    potOdds: recommendation.metrics.potOdds,
    sizing: recommendation.sizing.label,
    sizingOptions: recommendation.sizing.options || [],
    mix: recommendation.actions.map((action) => ({
      key: action.key,
      label: action.label,
      frequency: action.frequency,
      tone: action.tone,
    })),
    reasons: recommendation.reasons.slice(0, 4),
  });
}

function renderSimulator() {
  $("#hero-stack").textContent = `${round(simulator.heroStack, 1)}bb`;
  $("#ai-stack").textContent = `${round(simulator.aiStack, 1)}bb`;
  $("#sim-pot").textContent = `Pot ${round(simulator.pot, 1)}bb`;
  $("#sim-street").textContent = simulator.terminal ? "Showdown" : simulator.street;
  $("#hero-cards").innerHTML = simulator.heroHole.map((card) => cardPip(card)).join("");
  const aiLast = lastActionFor("ai");
  const heroLast = lastActionFor("hero");
  $("#ai-last-action").textContent = aiLast ? actionText(aiLast) : "等待行动";
  $("#hero-last-action").textContent = heroLast ? actionText(heroLast) : "等待行动";
  const revealAi = simulator.terminal && simulator.showdown;
  $("#ai-cards").innerHTML = revealAi
    ? simulator.aiHole.map((card) => cardPip(card)).join("")
    : simulator.aiHole.map(() => cardPip(null, true)).join("");
  $("#sim-board").innerHTML = [0, 1, 2, 3, 4]
    .map((index) => (simulator.board[index] ? cardPip(simulator.board[index]) : `<span class="mini-card empty">${index + 1}</span>`))
    .join("");

  renderSimActions();
  renderAiReadout();
  renderActionLine();
  renderReview();
  $("#hand-log").innerHTML = simulator.log
    .slice()
    .reverse()
    .map((line) => `<div>${line}</div>`)
    .join("");
  hydrateIcons();
}

function renderSimActions() {
  const toCall = simulator.getToCall("hero");
  const noCallPreflop = toCall <= 0 && simulator.street === "preflop";
  if (simulator.terminal) {
    $("#sim-actions").innerHTML = `<button class="primary-action" data-sim="new"><i data-lucide="play"></i><span>下一手</span></button>`;
  } else if (simulator.toAct !== "hero") {
    $("#sim-actions").innerHTML = `<div class="waiting">AI thinking...</div>`;
  } else if (toCall <= 0 && simulator.street !== "preflop") {
    $("#sim-actions").innerHTML = `
      <button class="${actionTone("check-call")}" data-sim="check-call">过牌</button>
      <button class="${actionTone("third")}" data-sim="third">1/3 pot</button>
      <button class="${actionTone("half")}" data-sim="half">1/2 pot</button>
      <button class="${actionTone("two-thirds")}" data-sim="two-thirds">2/3 pot</button>
      <button class="${actionTone("pot")}" data-sim="pot">Pot</button>
      <button class="${actionTone("overbet")}" data-sim="overbet">Overbet</button>
      <button class="${actionTone("allin")}" data-sim="allin">All-in</button>
    `;
  } else {
    $("#sim-actions").innerHTML = `
      <button class="${actionTone("fold")}" ${toCall <= 0 ? "disabled" : ""} data-sim="fold">弃牌</button>
      <button class="${actionTone("check-call")}" data-sim="check-call">${toCall > 0 ? `跟注 ${toCall}bb` : "过牌"}</button>
      <button class="${actionTone("half")}" data-sim="half">${toCall > 0 || noCallPreflop ? "小加注" : "下注 1/2 pot"}</button>
      <button class="${actionTone("pot")}" data-sim="pot">${toCall > 0 || noCallPreflop ? "大加注" : "下注 pot"}</button>
      <button class="${actionTone("allin")}" data-sim="allin">All-in</button>
    `;
  }
  $$("#sim-actions button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.sim === "new") {
        simulator.newHand();
      } else {
        captureHeroDecision(button.dataset.sim);
        simulator.playerAction(button.dataset.sim);
      }
      renderSimulator();
      queueAiIfNeeded();
    });
  });
}

function renderActionLine() {
  const groups = streetActionGroups();
  const actionCount = (simulator.actions || []).filter((action) => action.type !== "blind").length;
  $("#action-count").textContent = `${actionCount} actions`;
  if (!groups.length) {
    $("#action-line").innerHTML = `<div class="action-empty">本手牌还没有行动</div>`;
    return;
  }
  $("#action-line").innerHTML = groups
    .map(
      (group) => `
        <section class="street-line">
          <strong>${STREET_LABELS[group.street] || group.street}</strong>
          <div>
            ${group.actions
              .map(
                (action) => `
                  <span class="action-chip ${action.actor} ${action.type}">
                    ${actionText(action)}
                  </span>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function renderAiReadout() {
  if (!simulator.lastRecommendation) {
    $("#ai-readout").innerHTML = `<span>${AI_LEVELS[simulator.level].label}</span>`;
    return;
  }
  const top = simulator.lastRecommendation.actions[0];
  $("#ai-readout").innerHTML = `
    <span>${AI_LEVELS[simulator.level].label}</span>
    <strong>${top.label} ${pct(top.frequency, 0)}</strong>
    <em>Eq ${pct(simulator.lastRecommendation.equity.equity, 0)}</em>
  `;
}

function renderReview() {
  const reviews = simulator.review || [];
  $("#review-count").textContent = `${reviews.length} decisions`;
  if (!reviews.length) {
    $("#review-list").innerHTML = `<div class="review-empty">本手牌还没有 Hero 决策</div>`;
    return;
  }
  const orderedReviews = reviews.slice().reverse();
  $("#review-list").innerHTML = orderedReviews
    .map(
      (item, index) => `
        <article class="review-item ${item.verdict.tone}">
          <div class="review-title">
            <strong>${reviews.length - index}. ${item.street} · ${item.chosenLabel}</strong>
            <span>${item.verdict.label} ${pct(item.chosenFrequency, 0)}</span>
          </div>
          <div class="review-meta">
            <span>最优 ${item.bestLabel} ${pct(item.bestFrequency, 0)}</span>
            <span>Eq ${pct(item.equity, 0)}</span>
            <span>Odds ${pct(item.potOdds, 0)}</span>
            <span>${item.sizing}</span>
          </div>
          ${renderReviewSizes(item)}
          <div class="review-mix">
            ${item.mix
              .map(
                (action) => `
                  <div class="${action.tone}">
                    <span>${action.label}</span>
                    <strong>${pct(action.frequency, 0)}</strong>
                    <i style="width:${action.frequency * 100}%"></i>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div class="review-tags">
            ${item.reasons.map((reason) => `<span>${reason}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderReviewSizes(item) {
  const options = item.sizingOptions || [];
  if (!options.length) return "";
  return `
    <div class="review-sizes">
      ${options
        .slice(0, 5)
        .map(
          (option) => `
            <span class="${option.recommended ? "is-primary" : ""}">
              ${escapeHtml(option.label)} · ${round(option.amount, 1)}bb
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function wsUrl() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/ws`;
}

function randomGuestName() {
  return `牌手${Math.floor(1000 + Math.random() * 9000)}`;
}

// Auto-continue: after a showdown, re-ready the hero automatically (after a short
// pause so the result is visible) so practice play flows hand-after-hand without
// clicking 举手准备 every time. Toggle off to stop and review at your own pace.
function maybeAutoContinue(state) {
  const me = state?.me;
  const showdown = state?.phase === "showdown";
  if (mpState.autoContinue && showdown && me && !me.ready && !mpState.autoReadyTimer) {
    mpState.autoReadyTimer = setTimeout(() => {
      mpState.autoReadyTimer = null;
      const s = mpState.state;
      if (mpState.autoContinue && s?.phase === "showdown" && s?.me && !s.me.ready) {
        mpSend({ type: "ready" });
      }
    }, 2600);
  }
  if (!showdown && mpState.autoReadyTimer) {
    clearTimeout(mpState.autoReadyTimer);
    mpState.autoReadyTimer = null;
  }
}

// Switch the active top-level view (tab). Used by the nav and the welcome overlay.
function switchTab(name) {
  $$(".tab-button").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === name));
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.dataset.view === name));
  hydrateIcons();
}

// First-run welcome overlay — orients a new visitor and routes them straight into
// the core loop (play vs GTO). Shown once per browser.
function setupWelcome() {
  const overlay = $("#welcome-overlay");
  if (!overlay) return;
  const dismiss = () => {
    overlay.hidden = true;
    try { localStorage.setItem("tgl-welcomed", "1"); } catch { /* ignore */ }
  };
  if (!localStorage.getItem("tgl-welcomed")) {
    overlay.hidden = false;
    hydrateIcons();
  }
  $("#welcome-skip")?.addEventListener("click", dismiss);
  $("#welcome-start")?.addEventListener("click", () => {
    dismiss();
    switchTab("multi");
    $("#mp-quick")?.click();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) dismiss();
  });
}

function connectMultiplayer(name) {
  if (mpState.ws) mpState.ws.close();
  mpState.name = name.trim();
  localStorage.setItem("texas-gto-name", mpState.name);
  mpState.ws = new WebSocket(wsUrl());
  mpState.connected = false;
  mpState.joined = false;
  renderMultiplayer();

  mpState.ws.onopen = () => {
    mpState.connected = true;
    mpSend({ type: "join", name: mpState.name });
    renderMultiplayer();
  };
  mpState.ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "state") {
      mpState.joined = true;
      mpState.state = message.state;
      // Fire the queued one-click quick-start once we're seated and idle.
      if (mpState.pendingQuickStart && message.state?.me && message.state.phase !== "playing") {
        mpState.pendingQuickStart = false;
        mpSend({ type: "quick_start" });
      }
      renderMultiplayer();
    }
    if (message.type === "error") {
      $("#mp-status").textContent = message.message;
    }
  };
  mpState.ws.onclose = () => {
    mpState.connected = false;
    renderMultiplayer();
  };
  mpState.ws.onerror = () => {
    $("#mp-status").textContent = "连接失败";
  };
}

function mpSend(payload) {
  if (mpState.ws?.readyState === WebSocket.OPEN) {
    mpState.ws.send(JSON.stringify(payload));
  }
}

function renderMultiplayer() {
  const state = mpState.state;
  $("#mp-name").value = mpState.name;
  $("#mp-status").textContent = mpState.connected ? (state ? `${state.streetLabel} · Hand ${state.handNumber}` : "已连接") : "未连接";
  $("#join-box").hidden = Boolean(state?.me);
  $("#mp-ready").disabled = !state?.me || state.me.ready;
  $("#mp-ready").textContent = state?.me?.ready ? "已准备" : "准备";
  $("#mp-leave").disabled = !state?.me;
  $("#mp-add-ai").disabled = !state?.me || !state.canAddAi;

  bindMpFeedTabs();
  setupMpHotkeys();
  renderMpSeats(state);
  renderMpCenter(state);
  renderMpHeroHand(state);
  renderMpAdvice(state);
  renderMpActions(state);
  renderMpActionLine(state);
  renderMpRange(state);
  maybeAutoContinue(state);
  accumulateSessionReviews(state);
  renderMpReport(state);
  renderMpReview(state);
  renderMpChat(state);
  hydrateIcons();
}

// Range matrix in the battle view — the iconic solver visualization. Colors every
// hand by its GTO ACTION (raise=red / call=green / fold=grey split by frequency),
// with the hero's hand ringed. Preflop reads the exact policy tables instantly;
// postflop runs a client-side per-hand strategy sweep (cached per spot, lazy,
// chunked so the UI stays responsive) to color the flop/turn/river range too.
function renderMpRange(state) {
  const me = state?.me;
  const meta = $("#mp-range-meta");
  const grid = $("#mp-range-matrix");
  if (!me || !me.position || !me.context) {
    meta.textContent = me ? "本手未参与 / 等待发牌" : "入座后显示你的 GTO 范围";
    grid.innerHTML = "";
    return;
  }
  const weights = buildRangeWeights({
    style: "balanced",
    position: me.position,
    context: me.context,
    tableSize: me.tableSize || 2,
    stackBb: me.stackBb || 100,
  });
  const heroCode = me.hole?.length === 2 ? handCodeFromCards(me.hole) : null;
  const coverage = me.position ? rangeCoverage(weights) : null;
  const ctxLabel = CONTEXT_LABELS[me.context] || me.context;
  const preflop = !state.board || state.board.length === 0;
  // Postflop strategy coloring is available only once the async sweep for THIS
  // exact spot has finished (cached). Until then we show presence coloring.
  const sig = preflop ? null : mpRangeSpotSig(state, me);
  const postflopMix = !preflop && mpRangeStrat.sig === sig ? mpRangeStrat.mix : null;
  const strategyMode = preflop || Boolean(postflopMix);
  const computing = !preflop && !postflopMix && mpRangeStrat.computing === sig;
  meta.innerHTML = `<strong>${me.position} · ${escapeHtml(ctxLabel)}</strong>` +
    (coverage ? ` <span>${round(coverage.percent * 100, 1)}% · ${coverage.combos} combos</span>` : "") +
    (heroCode ? ` <em>你: ${heroCode}</em>` : "") +
    (strategyMode
      ? ` <span class="mp-range-legend"><i class="lg-raise"></i>加注 <i class="lg-call"></i>跟注 <i class="lg-fold"></i>弃牌</span>`
      : "") +
    (computing ? ` <span class="mp-range-loading">求解中…</span>` : "");
  const cells = [];
  for (let row = 0; row < RANKS.length; row += 1) {
    for (let col = 0; col < RANKS.length; col += 1) {
      const code = matrixCode(row, col);
      const cellType = row === col ? "cell-pair" : row < col ? "cell-suited" : "cell-offsuit";
      const isHero = code === heroCode;
      if (preflop) {
        cells.push(strategyCellHtml(code, preflopActionMix(code, me), cellType, isHero));
      } else if (postflopMix) {
        cells.push(strategyCellHtml(code, postflopMix[code] || { raise: 0, call: 0, fold: 1 }, cellType, isHero));
      } else {
        const weight = Number(weights[code] || 0);
        cells.push(
          `<div class="mp-range-cell ${cellType} ${weight <= 0 ? "is-empty" : ""} ${isHero ? "is-hero" : ""}" style="--weight:${weight}" title="${code} ${Math.round(weight * 100)}%"><span>${code}</span></div>`,
        );
      }
    }
  }
  grid.innerHTML = cells.join("");
  // Kick off the postflop strategy sweep lazily — only when the range tab is the
  // one on screen (don't burn CPU solving a view nobody is looking at).
  if (!preflop && !postflopMix && mpRangeTabActive()) {
    startMpRangeSolve(state, me, sig, weights);
  }
}

// Drop sub-threshold action slivers (neural-net / MC fitting noise) and renormalize
// so the matrix shows clean color bands. We DON'T snap to 5% steps — real solvers
// (GTO Wizard) display precise frequencies, so snapping would look less authentic;
// we only suppress the <2.5% noise that clutters a 169-cell scan.
function tidyMix(mix, threshold = 0.025) {
  const r = (mix.raise || 0) >= threshold ? mix.raise : 0;
  const c = (mix.call || 0) >= threshold ? mix.call : 0;
  const f = (mix.fold || 0) >= threshold ? mix.fold : 0;
  const total = r + c + f;
  if (total <= 0) return { raise: mix.raise || 0, call: mix.call || 0, fold: mix.fold || 0 };
  return { raise: r / total, call: c / total, fold: f / total };
}

// One range cell colored by its action mix: raise(red) | call(green) | fold(grey)
// as a horizontal frequency gradient — the GTO Wizard signature.
function strategyCellHtml(code, rawMix, cellType, isHero) {
  const mix = tidyMix(rawMix);
  const rp = Math.round((mix.raise || 0) * 100);
  const cp = Math.round(((mix.raise || 0) + (mix.call || 0)) * 100);
  const grad = `linear-gradient(90deg, var(--red) 0 ${rp}%, var(--green-2) ${rp}% ${cp}%, rgba(120,130,124,0.18) ${cp}% 100%)`;
  const empty = (mix.raise || 0) + (mix.call || 0) < 0.02;
  return `<div class="mp-range-cell strategy ${cellType} ${empty ? "is-empty" : ""} ${isHero ? "is-hero" : ""}" style="background:${grad}" title="${code} — 加注${rp}% 跟注${cp - rp}% 弃牌${100 - cp}%"><span>${code}</span></div>`;
}

// Collapse a strategy's action list into raise/call/fold fractions for coloring.
// Aggressive (bet/raise/jam/sizes) → raise; passive (call/check/limp) → call.
function categorizeActionMix(actions) {
  const out = { raise: 0, call: 0, fold: 0 };
  if (!actions || !actions.length) { out.fold = 1; return out; }
  for (const a of actions) {
    const k = String(a.key || "").toLowerCase();
    const f = a.frequency || 0;
    if (k.includes("fold")) out.fold += f;
    else if (k.includes("call") || k.includes("limp") || k.includes("check")) out.call += f;
    else out.raise += f;
  }
  const total = out.raise + out.call + out.fold || 1;
  out.raise /= total; out.call /= total; out.fold /= total;
  return out;
}

// Per-hand preflop GTO action mix from the exact policy tables.
function preflopActionMix(handCode, me) {
  return categorizeActionMix(
    preflopStrategyActions({
      handCode,
      position: me.position,
      context: me.context,
      tableSize: me.tableSize || 2,
      stackBb: me.stackBb || 100,
    }),
  );
}

// ---- Postflop strategy-range sweep (client-side, cached, chunked) ----
// Cache holds the mix map for one spot; `computing` is the sig currently solving.
const mpRangeStrat = { sig: null, mix: null, computing: null };

// A spot fingerprint: same board/position/context/pot/toCall → reuse the solve.
function mpRangeSpotSig(state, me) {
  return [
    me.position,
    me.context,
    (state.board || []).join(""),
    Math.round(Number(state.pot) || 0),
    Math.round(Number(me.toCall) || 0),
    Math.round(Number(me.stackBb) || 0),
  ].join("|");
}

function mpCurrentRangeSig() {
  const s = mpState.state;
  return s && s.me && s.me.position && s.me.context && s.board && s.board.length
    ? mpRangeSpotSig(s, s.me)
    : null;
}

function mpRangeTabActive() {
  const tab = document.querySelector('.mp-feed-tab[data-feed="range"]');
  return Boolean(tab && tab.classList.contains("is-active"));
}

// Pick a representative 2-card combo for a hand class, avoiding board cards.
function representativeCombo(code, dead) {
  const r1 = code[0];
  const r2 = code[1];
  const suited = code[2] === "s";
  const pair = r1 === r2;
  const suits = ["s", "h", "d", "c"];
  if (pair || !suited) {
    for (const a of suits) {
      const c1 = r1 + a;
      if (dead.has(c1)) continue;
      for (const b of suits) {
        if (b === a) continue;
        const c2 = r2 + b;
        if (dead.has(c2)) continue;
        return [c1, c2];
      }
    }
  } else {
    for (const a of suits) {
      const c1 = r1 + a;
      const c2 = r2 + a;
      if (dead.has(c1) || dead.has(c2)) continue;
      return [c1, c2];
    }
  }
  return null; // fully blocked by the board
}

function startMpRangeSolve(state, me, sig, weights) {
  if (mpRangeStrat.computing === sig) return; // already solving this spot
  mpRangeStrat.computing = sig;
  // Re-render so the "求解中…" indicator appears, then solve in the background.
  renderMpRange(state);
  solveMpRangeStrategy(state, me, sig, weights);
}

// Sweep all 169 classes through recommendStrategy on the current board, in small
// chunks with setTimeout yields so WebSocket updates and clicks keep flowing.
// Aborts if the spot changes mid-solve; caches + re-renders on completion.
async function solveMpRangeStrategy(state, me, sig, weights) {
  const dead = new Set(state.board || []);
  const pot = Number(state.pot) || 6;
  const toCall = Number(me.toCall) || 0;
  const codes = [];
  for (let row = 0; row < RANKS.length; row += 1) {
    for (let col = 0; col < RANKS.length; col += 1) codes.push(matrixCode(row, col));
  }
  const mix = {};
  for (let i = 0; i < codes.length; i += 1) {
    if (mpCurrentRangeSig() !== sig) {
      if (mpRangeStrat.computing === sig) mpRangeStrat.computing = null;
      return; // spot moved on — discard this solve
    }
    const code = codes[i];
    const combo = representativeCombo(code, dead);
    if (!combo) {
      mix[code] = { raise: 0, call: 0, fold: 1 };
    } else {
      const rec = recommendStrategy({
        hero: combo,
        board: state.board,
        position: me.position,
        context: me.context,
        tableSize: me.tableSize || 2,
        stackBb: me.stackBb || 100,
        pot,
        toCall,
        opponents: 1,
        rangeWeights: weights,
        iterations: 120,
      });
      mix[code] = categorizeActionMix(rec.actions);
    }
    if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
  }
  if (mpCurrentRangeSig() !== sig) {
    if (mpRangeStrat.computing === sig) mpRangeStrat.computing = null;
    return;
  }
  mpRangeStrat.sig = sig;
  mpRangeStrat.mix = mix;
  mpRangeStrat.computing = null;
  if (mpState.state) renderMpRange(mpState.state);
}

// Keyboard shortcuts for the action buttons (F fold / C check-call / A all-in /
// digits for bet sizes) — fast play like a pro tool. Bound once; ignores typing.
let mpHotkeysBound = false;
function setupMpHotkeys() {
  if (mpHotkeysBound) return;
  mpHotkeysBound = true;
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const view = document.querySelector('.view[data-view="multi"]');
    if (!view || !view.classList.contains("is-active")) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    const key = e.key.toLowerCase();
    const btn = document.querySelector(`#mp-actions button[data-key="${key}"]`);
    if (btn) {
      e.preventDefault();
      btn.classList.add("key-press");
      setTimeout(() => btn.classList.remove("key-press"), 150);
      btn.click();
    }
  });
}

// Tabbed sidebar feed (行动线 / 复盘 / 聊天) — one panel at a time, no scroll fatigue.
function bindMpFeedTabs() {
  const tabs = $$(".mp-feed-tab");
  if (!tabs.length || tabs[0].dataset.bound) return;
  tabs.forEach((tab) => {
    tab.dataset.bound = "1";
    tab.addEventListener("click", () => {
      const feed = tab.dataset.feed;
      $$(".mp-feed-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.feed === feed));
      $$(".mp-feed-panel").forEach((p) => p.classList.toggle("is-active", p.dataset.feedPanel === feed));
      // Opening the range tab triggers the postflop strategy solve on demand.
      if (feed === "range" && mpState.state) renderMpRange(mpState.state);
    });
  });
}

// Poker-tracker HUD per seat: VPIP / PFR / AF, tone-colored so you can read a
// table at a glance (loose maniac vs tight nit). The bots' play is unchanged —
// this is pure read-the-opponent telemetry, the GTO baseline stays untouched.
function seatHudHtml(stats) {
  if (!stats) return "";
  const tone = stats.vpip >= 45 ? "loose" : stats.vpip <= 22 ? "tight" : "balanced";
  return `<div class="seat-hud ${tone}" title="VPIP ${stats.vpip}% 主动入池 · PFR ${stats.pfr}% 翻前加注 · AF ${stats.af} 激进系数 · 样本 ${stats.hands} 手">
    <span><i>V</i>${stats.vpip}</span><span><i>P</i>${stats.pfr}</span><span><i>AF</i>${stats.af}</span>
  </div>`;
}

function renderMpSeats(state) {
  const players = state?.players || [];
  const slots = Array.from({ length: 6 }, (_, index) => players[index] || null);
  $("#mp-seats").innerHTML = slots
    .map((player, index) => {
      if (!player) {
        return `
          <div class="mp-seat mp-seat-${index} empty">
            <div class="mp-seat-shell">
              <strong>Seat ${index + 1}</strong>
              <span>空位</span>
            </div>
          </div>
        `;
      }
      const isMe = state.me?.id === player.id;
      const isTurn = state.turnId === player.id;
      const badges = [
        player.id === state.dealerId ? "D" : "",
        player.id === state.smallBlindId ? "SB" : "",
        player.id === state.bigBlindId ? "BB" : "",
      ].filter(Boolean);
      const seatState = [
        isTurn ? "turn" : "",
        isMe ? "me" : "",
        player.ready ? "ready" : "",
        player.folded ? "folded" : "",
        player.allIn ? "allin" : "",
        !player.connected && player.type === "human" ? "offline" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const hole =
        player.hole?.length
          ? player.hole.map((card) => cardPip(card)).join("")
          : player.inHand
            ? [cardPip(null, true), cardPip(null, true)].join("")
            : "";
      const lastAction = player.lastAction
        ? `${escapeHtml(player.lastAction.label)}${player.lastAction.amount ? ` ${player.lastAction.amount}bb` : ""}`
        : player.ready
          ? "已举手"
          : player.inHand
            ? "等待"
            : "在桌";
      return `
        <div class="mp-seat mp-seat-${index} ${player.type} ${seatState}">
          <div class="mp-seat-shell">
            <div class="mp-seat-head">
              <strong>${escapeHtml(player.name)}</strong>
              <span>${player.type === "ai" ? "AI" : isMe ? "你" : "玩家"}</span>
              ${player.style ? `<span class="seat-style">${escapeHtml(player.style)}</span>` : ""}
            </div>
            <div class="mp-seat-meta">
              <span class="stack">${round(player.stack, 1)}bb</span>
              <span>${player.connected || player.type === "ai" ? "在线" : "离线"}</span>
            </div>
            ${seatHudHtml(player.stats)}
            <div class="mini-cards">${hole}</div>
            <div class="seat-tags">
              ${badges.map((badge) => `<span class="blind-tag">${badge}</span>`).join("")}
              ${player.ready ? "<span class=\"ready-tag\">已举手</span>" : ""}
              ${isTurn ? "<span class=\"turn-tag\">行动中</span>" : ""}
              ${player.folded ? "<span>已弃牌</span>" : ""}
              ${player.allIn ? "<span>All-in</span>" : ""}
              ${state.phase === "showdown" && player.hole?.length ? "<span>已亮牌</span>" : ""}
            </div>
            <div class="last-action">${lastAction}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderMpCenter(state) {
  $("#mp-pot").textContent = `Pot ${round(state?.pot || 0, 1)}bb`;
  $("#mp-street").textContent = state?.streetLabel || "等待";
  $("#mp-event").textContent = state?.lastEvent || "";
  $("#mp-board").innerHTML = [0, 1, 2, 3, 4]
    .map((index) => (state?.board?.[index] ? cardPip(state.board[index]) : `<span class="mini-card empty">${index + 1}</span>`))
    .join("");
  renderMpReadyBoard(state);
  renderMpShowdownCards(state);
}

function renderMpReadyBoard(state) {
  const players = state?.players || [];
  const readyPlayers = players.filter((player) => player.type === "human" && player.ready);
  const waitingPlayers = players.filter((player) => player.type === "human" && player.connected && !player.ready && state?.phase !== "playing");
  $("#mp-ready-board").innerHTML = players.length
    ? `
        <div class="ready-pills">
          ${readyPlayers.map((player) => `<span class="ready">${escapeHtml(player.name)}</span>`).join("")}
          ${waitingPlayers.map((player) => `<span>${escapeHtml(player.name)}</span>`).join("")}
        </div>
      `
    : "";
  $("#mp-table-ready").hidden = !state?.me || state.me.ready;
  $("#mp-table-ready").disabled = !state?.me || state.me.ready;
  $("#mp-table-ready").textContent = state?.me?.ready ? "已准备" : "准备";
}

function renderMpHeroHand(state) {
  const me = state?.me;
  const shell = $("#mp-hero-hand");
  if (!me) {
    shell.innerHTML = "";
    shell.hidden = true;
    return;
  }
  shell.hidden = false;
  const cards = me.hole?.length ? me.hole.map((card) => cardPip(card)).join("") : [cardPip(null, true), cardPip(null, true)].join("");
  shell.innerHTML = `
    <div class="mp-hero-cards">${cards}</div>
    <div class="mp-hero-hand-meta">
      <strong>${escapeHtml(me.name || "Hero")}</strong>
      <span>${me.hole?.length === 2 ? handCodeFromCards(me.hole) : "等待发牌"}</span>
    </div>
  `;
}

function renderMpShowdownCards(state) {
  const shell = $("#mp-showdown-shell");
  if (state?.phase !== "showdown") {
    shell.hidden = true;
    $("#mp-showdown-count").textContent = "0 hands";
    $("#mp-showdown-cards").innerHTML = "";
    return;
  }
  const shownPlayers = (state.players || []).filter((player) => player.hole?.length);
  $("#mp-showdown-count").textContent = `${shownPlayers.length} hands`;
  if (!shownPlayers.length) {
    shell.hidden = true;
    $("#mp-showdown-cards").innerHTML = "";
    return;
  }
  shell.hidden = false;
  const hands = state.showdownHands || [];
  const byId = Object.fromEntries(hands.map((h) => [h.id, h]));
  // winners first, then by hand strength order they were revealed
  const ordered = [...shownPlayers].sort((a, b) => (byId[b.id]?.won ? 1 : 0) - (byId[a.id]?.won ? 1 : 0));
  const meId = state.me?.id;
  $("#mp-showdown-cards").innerHTML = ordered
    .map((player) => {
      const info = byId[player.id];
      const won = info?.won;
      const isMe = player.id === meId;
      // result chip — make the hero's own win/loss unmistakable at a glance
      const chip = won
        ? `<span class="show-win">${isMe ? "你赢了 " : ""}+${info.amount}bb</span>`
        : isMe
          ? `<span class="show-lose">本手未中</span>`
          : "";
      return `
        <div class="show-card-row${won ? " won" : ""}${isMe ? " is-me" : ""}">
          <div class="show-card-top">
            <strong>${escapeHtml(player.name)}${isMe ? ` <span class="show-me">你</span>` : ""}</strong>
            ${chip}
          </div>
          <div class="show-card-cards">${player.hole.map((card) => cardPip(card)).join("")}</div>
          ${info?.hand ? `<div class="show-card-hand">${escapeHtml(info.hand)}</div>` : ""}
        </div>
      `;
    })
    .join("");
}

// A plain-language coach note synthesized from data we TRUST — the GTO action plus
// equity-vs-pot-odds and ahead/behind. Every branch states only facts; when a fact
// would be false (e.g. equity actually beats the odds on a fold) it falls back to a
// safe generic line rather than asserting something wrong. Teaches the WHY in-the-moment.
function coachLine(top, advice, me, state) {
  if (!top) return "";
  const eq = Math.round((advice.equity || 0) * 100);
  const odds = Math.round((advice.potOdds || 0) * 100);
  const k = String(top.key || "").toLowerCase();
  const isFold = k.includes("fold");
  const isPassive = k.includes("call") || k.includes("check") || k.includes("limp");
  const isAggro = !isFold && !isPassive; // bet / raise / jam
  const preflop = !state?.board || state.board.length === 0;
  const toCall = Number(me?.toCall) || 0;

  if (preflop) {
    const code = me?.hole?.length === 2 ? handCodeFromCards(me.hole) : "这手牌";
    const ctx = CONTEXT_LABELS[me?.context] || "这个位置";
    const act = isFold ? "弃牌" : isAggro ? "加注" : "跟注";
    return `${code}(${me?.position || ""} ${ctx}):GTO 倾向「${act}」。`;
  }
  if (toCall > 0) {
    if (isFold) {
      return eq < odds
        ? `权益 ${eq}% 低于跟注所需的底池赔率 ${odds}%,所以 GTO 弃牌。`
        : `综合你的范围与位置,GTO 在这里倾向弃牌。`;
    }
    if (isPassive) {
      return eq >= odds
        ? `权益 ${eq}% 高于底池赔率 ${odds}%,跟注长期有利可图。`
        : `用足够权益 + 后续牌力潜力跟注防守。`;
    }
    return eq >= 55
      ? `你的权益领先(${eq}%),GTO 用加注向对手要价值。`
      : `权益 ${eq}%,GTO 以加注施压、把弱牌打出底池(半诈唬)。`;
  }
  // no bet to face (open / checked-to)
  if (isPassive) return `GTO 过牌:控制底池、保护你的过牌范围。`;
  return eq >= 55
    ? `你领先(权益 ${eq}%),GTO 下注获取价值、保护牌力。`
    : `GTO 下注:以较低权益施压,迫使对手弃掉更好的牌(诈唬/半诈唬)。`;
}

function renderMpAdvice(state) {
  const advice = state?.me?.advice;
  const shell = $("#mp-advice");
  if (!advice || !advice.actions?.length) {
    shell.hidden = true;
    shell.dataset.shown = "";
    return;
  }
  // one-shot entrance animation when the station first appears (your turn begins)
  if (shell.hidden || !shell.dataset.shown) {
    shell.classList.remove("advice-enter");
    void shell.offsetWidth; // reflow to restart the animation
    shell.classList.add("advice-enter");
    shell.dataset.shown = "1";
  }
  shell.hidden = false;
  const badge = POLICY_BADGES[advice.policySource?.type] || POLICY_BADGES.heuristic;
  const sorted = [...advice.actions].sort((a, b) => b.frequency - a.frequency);
  const top = sorted[0];
  const mixed = sorted.filter((a) => a.frequency >= 0.12).length > 1;
  shell.className = `mp-advice ${badge.kind}`;
  $("#mp-advice-badge").textContent = badge.label;
  $("#mp-advice-badge").className = `policy-badge`;
  // Hero callout: the GTO-preferred action, big and glanceable (pure mix => "混合").
  $("#mp-advice-hero").innerHTML = `
    <div class="advice-hero-main ${top?.tone || ""}">
      <span class="advice-hero-label">建议</span>
      <strong>${escapeHtml(top?.label || "—")}</strong>
      <span class="advice-hero-freq">${pct(top?.frequency || 0, 0)}</span>
    </div>
    <span class="advice-hero-tag">${mixed ? "混合策略" : "纯策略"}</span>
  `;
  const coach = coachLine(top, advice, state?.me, state);
  $("#mp-advice-coach").innerHTML = coach ? `<i data-lucide="message-square-text"></i><span>${escapeHtml(coach)}</span>` : "";
  $("#mp-advice-coach").hidden = !coach;
  const version = advice.policySource?.version ? ` · ${advice.policySource.version.split("+")[0]}` : "";
  $("#mp-advice-note").textContent = `${badge.note}${version}`;
  $("#mp-advice-mix").innerHTML = sorted
    .map(
      (action) => `
        <div class="mix-row ${action.tone || ""}">
          <div class="mix-label"><strong>${escapeHtml(action.label)}</strong><span>${pct(action.frequency, 0)}</span></div>
          <div class="mix-bar"><span style="width:${action.frequency * 100}%"></span></div>
        </div>
      `,
    )
    .join("");
  $("#mp-advice-metrics").innerHTML = [
    ["权益", pct(advice.equity, 0)],
    ["Pot Odds", advice.potOdds > 0 ? pct(advice.potOdds, 0) : "—"],
    ["SPR", round(advice.spr, 1)],
    ["MDF", advice.mdf > 0 ? pct(advice.mdf, 0) : "—"],
    ["Call EV", `${round(advice.callEv, 1)}bb`],
    ["尺度", advice.sizing || "—"],
  ]
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

// Map the GTO action-mix onto the concrete action buttons present this turn, so the
// strategy reads directly on the buttons (like GTO Wizard): each advice action's
// frequency is assigned to the first candidate button that exists.
const ACTION_TO_BUTTON = {
  fold: ["fold"],
  check: ["check-call"],
  call: ["check-call"],
  "bet-small": ["third", "half"],
  "bet-mid": ["half", "two-thirds"],
  "bet-big": ["pot"],
  "bet-over": ["overbet", "allin"],
  "raise-small": ["half", "pot"],
  "raise-big": ["pot", "overbet"],
  jam: ["allin", "pot"],
  raise: ["pot", "half"],
};
const BUTTON_ICON = { "act-fold": "x", "act-call": "check", "act-bet": "coins", "act-allin": "flame" };

function gtoFreqForButtons(advice, options) {
  const freq = {};
  if (!advice?.actions) return freq;
  for (const action of advice.actions) {
    const cands = ACTION_TO_BUTTON[action.key] || [];
    const targetOption =
      options.find((option) => option.gtoKeys?.includes(action.key)) ||
      options.find((option) => cands.includes(option.id)) ||
      options.find((option) => option.id === "check-call" && (action.key === "check" || action.key === "call"));
    const target = targetOption?.id;
    if (target) freq[target] = (freq[target] || 0) + (action.frequency || 0);
  }
  return freq;
}

function renderMpActions(state) {
  const options = state?.me?.actionOptions || [];
  // has-actions drives the mobile sticky action bar (pinned to the bottom so you
  // never have to scroll past the table to act on your turn).
  $("#mp-actions").classList.toggle("has-actions", options.length > 0);
  if (!state?.me) {
    $("#mp-actions").innerHTML = `<div class="waiting">输入用户名后入座</div>`;
    return;
  }
  if (options.length) {
    const gto = gtoFreqForButtons(state.me.advice, options);
    const bestId = Object.keys(gto).sort((a, b) => gto[b] - gto[a])[0];
    const bestFreq = bestId ? gto[bestId] : 0;
    let sizeDigit = 0; // 1..n for the bet/raise sizing buttons, in order
    $("#mp-actions").innerHTML = options
      .map((option, index) => {
        const tone = actionTone(option.id);
        const f = gto[option.id] || 0;
        const isGto = option.id === bestId && bestFreq > 0;
        const badge = f > 0 ? `<em class="act-freq">${pct(f, 0)}</em>` : "";
        // hotkey: F fold / C check-call / A all-in / digits for sizings
        const key = tone === "act-fold" ? "f" : tone === "act-call" ? "c" : tone === "act-allin" ? "a" : String(++sizeDigit);
        const amount = Number.isFinite(Number(option.amount)) && option.amount > 0 ? `<small>${round(option.amount, 1)}bb</small>` : "";
        return `<button class="${tone} ${isGto ? "is-gto" : ""} ${option.recommended ? "is-size-primary" : ""}" data-mp-action-index="${index}" data-key="${key}">
          <kbd class="act-key">${key.toUpperCase()}</kbd><i data-lucide="${BUTTON_ICON[tone] || "circle"}"></i><span>${escapeHtml(option.label)}</span>${amount}${badge}
        </button>`;
      })
      .join("");
  } else if (state.phase === "playing") {
    $("#mp-actions").innerHTML = `<div class="waiting">${state.turnId ? "等待其他玩家行动" : "等待发牌"}</div>`;
  } else {
    $("#mp-actions").innerHTML = `<div class="waiting">准备后自动开下一把</div>`;
  }
  $$("#mp-actions button").forEach((button) => {
    button.addEventListener("click", () => {
      const option = options[Number(button.dataset.mpActionIndex)];
      mpSend({ type: "action", action: option?.action ?? option?.id });
    });
  });
}

function renderMpActionLine(state) {
  const actions = state?.actions || [];
  const nonBlindCount = actions.filter((action) => action.type !== "blind").length;
  $("#mp-action-count").textContent = `${nonBlindCount}`;
  $("#mp-table-action-count").textContent = `${actions.length}`;
  renderMpFloatingActionLine(actions);
  if (!actions.length) {
    $("#mp-action-line").innerHTML = `<div class="action-empty">还没有行动</div>`;
    return;
  }
  const groups = [];
  for (const street of ["preflop", "flop", "turn", "river", "showdown"]) {
    const streetActions = actions.filter((action) => action.street === street);
    if (streetActions.length) groups.push({ street, actions: streetActions });
  }
  $("#mp-action-line").innerHTML = groups
    .map(
      (group) => `
        <section class="street-line">
          <strong>${STREET_LABELS[group.street] || group.street}</strong>
          <div>
            ${group.actions
              .map(
                (action) => `
                  <span class="action-chip ${action.actorType === "ai" ? "ai" : "hero"} ${action.type}">
                    ${escapeHtml(action.actor)} ${escapeHtml(action.label)}${action.amount ? ` ${action.amount}bb` : ""}
                  </span>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function renderMpFloatingActionLine(actions) {
  const container = $("#mp-table-action-line");
  if (!actions.length) {
    container.innerHTML = `<div class="table-action-empty">等待入座和发牌</div>`;
    return;
  }
  container.innerHTML = actions
    .slice(-8)
    .map(
      (action) => `
        <div class="table-action-row ${action.actorType === "ai" ? "ai" : "hero"} ${action.type}">
          <span>${action.order}</span>
          <strong>${escapeHtml(action.actor)}</strong>
          <em>${escapeHtml(action.label)}${action.amount ? ` ${action.amount}bb` : ""}</em>
          <small>${STREET_LABELS[action.street] || action.street}</small>
        </div>
      `,
    )
    .join("");
}

// Accumulate the hero's own per-decision reviews across the whole session, so we
// can aggregate them into a leak report. Each decision is deduped by hand+order.
function accumulateSessionReviews(state) {
  const own = state?.me?.review || [];
  for (const r of own) {
    if (r.actorId && state?.me?.id && r.actorId !== state.me.id) continue;
    const key = `${r.handNumber}:${r.actionOrder ?? r.street + r.chosenLabel}`;
    if (mpState.sessionSeen.has(key)) continue;
    mpState.sessionSeen.add(key);
    mpState.sessionReviews.push(r);
    foldIntoLifetime(r);
  }
}

// Lifetime stats persisted in localStorage (no login) — so progress survives reloads
// and the report can show a "this session vs your lifetime" trend (the retention hook).
function loadLifetime() {
  try {
    const s = JSON.parse(localStorage.getItem("tgl-leak-stats"));
    if (s && typeof s.decisions === "number") return s;
  } catch { /* ignore */ }
  return { decisions: 0, sumMatch: 0, leaks: 0 };
}
function foldIntoLifetime(r) {
  const cum = mpState.lifetime || (mpState.lifetime = loadLifetime());
  cum.decisions += 1;
  cum.sumMatch += r.chosenFrequency || 0;
  if ((r.chosenFrequency || 0) < 0.18 && (r.bestFrequency || 0) - (r.chosenFrequency || 0) > 0.12) cum.leaks += 1;
  try { localStorage.setItem("tgl-leak-stats", JSON.stringify(cum)); } catch { /* ignore */ }
}

const STREET_LABEL = { preflop: "翻前", flop: "翻牌", turn: "转牌", river: "河牌" };
const STREET_ORDER = ["preflop", "flop", "turn", "river"];

// Session leak report — the "find your leaks" hook. Aggregates the hero's decisions
// into a GTO-match score, per-street deviation, and the biggest concrete leaks.
function renderMpReport(state) {
  const box = $("#mp-report");
  if (!box) return;
  const rows = mpState.sessionReviews;
  if (rows.length < 4) {
    // Returning player with saved history: greet them with their lifetime progress
    // immediately (the retention payoff), instead of a cold "play a few hands" hint.
    const cum = mpState.lifetime || loadLifetime();
    if (cum && cum.decisions >= 8) {
      const cumPct = Math.round((cum.sumMatch / cum.decisions) * 100);
      const grade = cumPct >= 70 ? "good" : cumPct >= 50 ? "mix" : "leak";
      box.innerHTML = `
        <div class="mp-report-head"><span class="mp-report-title">你的练习进度</span><span class="mp-report-pro">PRO</span></div>
        <div class="mp-report-score ${grade}">
          <div class="mp-report-ring" style="--score:${cumPct}"><strong>${cumPct}</strong><em>GTO 吻合</em></div>
          <div class="mp-report-kpis">
            <div><b>${cum.decisions.toLocaleString()}</b><span>累计决策</span></div>
            <div><b>${cum.leaks.toLocaleString()}</b><span>累计漏洞</span></div>
          </div>
        </div>
        <div class="mp-report-empty">本节再打几手,生成新的漏洞报告并和累计对比。</div>`;
      return;
    }
    box.innerHTML = `<div class="mp-report-empty">打几手后这里会生成你的<strong>漏洞报告</strong>:GTO 吻合度、各街偏离、最大漏洞。</div>`;
    return;
  }
  const n = rows.length;
  const matchAvg = rows.reduce((s, r) => s + (r.chosenFrequency || 0), 0) / n;
  const leaks = rows.filter((r) => (r.chosenFrequency || 0) < 0.18 && (r.bestFrequency || 0) - (r.chosenFrequency || 0) > 0.12);
  // per-street average GTO frequency (higher = closer to GTO)
  const byStreet = STREET_ORDER.map((st) => {
    const sr = rows.filter((r) => r.street === st);
    return { st, n: sr.length, match: sr.length ? sr.reduce((s, r) => s + (r.chosenFrequency || 0), 0) / sr.length : null };
  }).filter((x) => x.n > 0);
  // Dedupe leaks by spot (street+hand+action) so we show distinct mistakes, worst first.
  const leakBySpot = new Map();
  for (const r of leaks) {
    const key = `${r.street}:${r.handCode || ""}:${r.chosenLabel || ""}`;
    const prev = leakBySpot.get(key);
    if (!prev || (r.chosenFrequency || 0) < (prev.chosenFrequency || 0)) leakBySpot.set(key, r);
  }
  const topLeaks = [...leakBySpot.values()]
    .sort((a, b) => (a.chosenFrequency || 0) - (b.chosenFrequency || 0))
    .slice(0, 3);
  const score = Math.round(matchAvg * 100);
  const grade = score >= 70 ? "good" : score >= 50 ? "mix" : "leak";
  const me = state?.players?.find((p) => p.id === state?.me?.id);
  const stat = me?.stats;

  box.innerHTML = `
    <div class="mp-report-head">
      <span class="mp-report-title">本节漏洞报告</span>
      <span class="mp-report-pro">PRO</span>
    </div>
    <div class="mp-report-score ${grade}">
      <div class="mp-report-ring" style="--score:${score}"><strong>${score}</strong><em>GTO 吻合</em></div>
      <div class="mp-report-kpis">
        <div><b>${n}</b><span>决策</span></div>
        <div><b>${leaks.length}</b><span>漏洞</span></div>
        ${stat ? `<div><b>${stat.vpip}/${stat.pfr}</b><span>VPIP/PFR</span></div>` : ""}
      </div>
    </div>
    <div class="mp-report-streets">
      ${byStreet.map((s) => {
        const pct = Math.round((s.match || 0) * 100);
        const tone = pct >= 70 ? "good" : pct >= 50 ? "mix" : "leak";
        return `<div class="mp-report-street"><span>${STREET_LABEL[s.st] || s.st}</span>
          <div class="mp-report-bar"><i class="${tone}" style="width:${pct}%"></i></div>
          <em>${pct}%</em></div>`;
      }).join("")}
    </div>
    ${topLeaks.length ? `<div class="mp-report-leaks">
      <div class="mp-report-leaks-h">最大漏洞</div>
      ${topLeaks.map((r) => `<div class="mp-report-leak">
        <span class="leak-spot">${STREET_LABEL[r.street] || r.street}${r.handCode ? ` · ${r.handCode}` : ""}</span>
        <span class="leak-detail">你「${escapeHtml(r.chosenLabel || "-")}」(${Math.round((r.chosenFrequency || 0) * 100)}%) · GTO 倾向「${escapeHtml(r.bestLabel || "-")}」(${Math.round((r.bestFrequency || 0) * 100)}%)</span>
      </div>`).join("")}
    </div>` : `<div class="mp-report-clean">暂无明显漏洞,继续保持 👍</div>`}
    ${lifetimeLine(score, rows.length)}
  `;
}

// Persistent lifetime line under the report — total decisions practiced + the
// lifetime GTO-match average, with a this-session-vs-lifetime delta chip. Only shown
// once there's history beyond the current session, so it reads as real progress.
function lifetimeLine(sessionScore, sessionN) {
  const cum = mpState.lifetime || loadLifetime();
  if (!cum || cum.decisions < sessionN + 8) return "";
  const cumPct = Math.round((cum.sumMatch / cum.decisions) * 100);
  const delta = sessionScore - cumPct;
  const dir = delta >= 0 ? "up" : "down";
  const arrow = delta >= 0 ? "▲" : "▼";
  return `<div class="mp-report-cum">
    <span>累计 <b>${cum.decisions.toLocaleString()}</b> 决策 · 平均吻合 <b>${cumPct}%</b></span>
    <span class="cum-delta ${dir}">本节 ${sessionScore}% ${arrow}${Math.abs(delta)}</span>
  </div>`;
}

function renderMpReview(state) {
  const tableReviews = state?.tableReview || [];
  const ownReviews = state?.me?.review || [];
  const showingTable = state?.phase === "showdown";
  let reviews = ownReviews;
  const tabs = $("#mp-review-tabs");

  if (!showingTable) {
    mpState.reviewActorId = state?.me?.id || null;
    mpState.reviewHandNumber = null;
    tabs.hidden = true;
    tabs.innerHTML = "";
  } else {
    const actors = reviewActorsFor(state, tableReviews);
    if (mpState.reviewHandNumber !== state.handNumber) {
      mpState.reviewActorId = actors.some((actor) => actor.id === state?.me?.id) ? state.me.id : actors[0]?.id || null;
      mpState.reviewHandNumber = state.handNumber;
    }
    if (!actors.some((actor) => actor.id === mpState.reviewActorId)) {
      mpState.reviewActorId = actors[0]?.id || null;
    }

    tabs.hidden = actors.length <= 1;
    tabs.innerHTML = actors
      .map(
        (actor) => `
          <button class="${actor.id === mpState.reviewActorId ? "is-active" : ""}" data-review-actor="${actor.id}">
            <span>${escapeHtml(actor.name)}</span>
            <strong>${actor.count}</strong>
          </button>
        `,
      )
      .join("");
    $$("#mp-review-tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        mpState.reviewActorId = button.dataset.reviewActor;
        renderMpReview(mpState.state);
      });
    });

    reviews = tableReviews.filter((item) => item.actorId === mpState.reviewActorId);
  }

  $("#mp-review-count").textContent = `${reviews.length}`;
  if (!reviews.length) {
    const message = showingTable ? "这个玩家本手没有可复盘决策" : "对局中只显示你的即时复盘，本手结束后可切换查看其他玩家";
    $("#mp-review-list").innerHTML = `<div class="review-empty">${message}</div>`;
    return;
  }
  const orderedReviews = reviews.slice().sort((a, b) => (b.actionOrder || 0) - (a.actionOrder || 0));
  $("#mp-review-list").innerHTML = orderedReviews
    .map(
      (item, index) => {
        const badge = POLICY_BADGES[item.policySource?.type] || POLICY_BADGES.heuristic;
        const metrics = [
          ["选择", `${escapeHtml(item.chosenLabel)} ${pct(item.chosenFrequency, 0)}`],
          ["最优", `${escapeHtml(item.bestLabel)} ${pct(item.bestFrequency, 0)}`],
          ["权益", pct(item.equity, 0)],
          ["赔率", item.potOdds > 0 ? pct(item.potOdds, 0) : "—"],
          ["SPR", item.spr != null ? round(item.spr, 1) : "—"],
          ["尺度", escapeHtml(item.sizing || "—")],
        ];
        return `
        <article class="review-item ${item.verdict.tone}">
          <div class="review-head">
            <div class="review-head-main">
              <span class="review-order">${item.actionOrder || orderedReviews.length - index}</span>
              <strong>${escapeHtml(item.actor || "Hero")}</strong>
              <span class="review-street">${STREET_LABELS[item.street] || item.street}</span>
            </div>
            <span class="review-verdict ${item.verdict.tone}">${escapeHtml(item.verdict.label)}</span>
          </div>
          <div class="review-metrics">
            ${metrics.map(([k, v]) => `<div class="review-metric"><span>${k}</span><strong>${v}</strong></div>`).join("")}
          </div>
          <div class="review-policy ${badge.kind}"><span class="policy-badge">${badge.label}</span><span>${badge.note}</span></div>
          <div class="review-mix">
            ${item.mix
              .map(
                (action) => `
                  <div class="${action.tone}">
                    <span>${escapeHtml(action.label)}</span>
                    <strong>${pct(action.frequency, 0)}</strong>
                    <i style="width:${action.frequency * 100}%"></i>
                  </div>
                `,
              )
              .join("")}
          </div>
          ${item.reasons.length ? `<div class="review-tags">${item.reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}</div>` : ""}
        </article>
      `;
      },
    )
    .join("");
}

function renderMpChat(state) {
  const messages = state?.chat || [];
  $("#mp-chat-count").textContent = `${messages.length}`;
  $("#mp-chat-input").disabled = !state?.me;
  $("#mp-chat-send").disabled = !state?.me;
  if (!messages.length) {
    $("#mp-chat-list").innerHTML = `<div class="chat-empty">还没有消息</div>`;
    return;
  }
  $("#mp-chat-list").innerHTML = messages
    .slice(-40)
    .map((message) => {
      const isMe = message.actorId === state?.me?.id;
      return `
        <div class="chat-message ${isMe ? "me" : ""}">
          <div>
            <strong>${escapeHtml(message.actor)}</strong>
            <span>Hand ${message.handNumber || 0}</span>
          </div>
          <p>${escapeHtml(message.text)}</p>
        </div>
      `;
    })
    .join("");
  const list = $("#mp-chat-list");
  list.scrollTop = list.scrollHeight;
}

function sendMpChat() {
  const input = $("#mp-chat-input");
  const text = input.value.trim();
  if (!text) return;
  mpSend({ type: "chat", text });
  input.value = "";
}

function reviewActorsFor(state, reviews) {
  const counts = new Map();
  for (const item of reviews) {
    counts.set(item.actorId, (counts.get(item.actorId) || 0) + 1);
  }
  const seen = new Set();
  const actors = [];
  for (const player of state?.players || []) {
    const count = counts.get(player.id) || 0;
    if (!count) continue;
    seen.add(player.id);
    actors.push({
      id: player.id,
      name: player.id === state?.me?.id ? `${player.name}（你）` : player.name,
      type: player.type,
      count,
    });
  }
  for (const item of reviews) {
    if (seen.has(item.actorId)) continue;
    seen.add(item.actorId);
    actors.push({
      id: item.actorId,
      name: item.actor,
      type: item.actorType,
      count: counts.get(item.actorId) || 0,
    });
  }
  return actors;
}

async function copyInviteLink() {
  const url = `${window.location.origin}${window.location.pathname}`;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const input = document.createElement("input");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  $("#mp-status").textContent = "邀请链接已复制";
}

function queueAiIfNeeded() {
  clearTimeout(aiTimer);
  if (simulator.terminal || simulator.toAct !== "ai") return;
  aiTimer = setTimeout(() => {
    simulator.aiAction();
    renderSimulator();
    queueAiIfNeeded();
  }, 520);
}

function wireEvents() {
  $$(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });
  setupWelcome();

  $$(".target-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      labState.target = button.dataset.target;
      renderLab();
    });
  });

  ["position", "context", "table-size", "stack-bb", "range-style"].forEach((id) => {
    $(`#${id}`).addEventListener("change", () => {
      resetRangeFromControls();
      renderRangeMatrix();
    });
  });

  $("#run-calc").addEventListener("click", runCalculation);
  $("#random-scenario").addEventListener("click", randomScenario);
  $("#reset-cards").addEventListener("click", resetCards);
  $("#practice-next").addEventListener("click", generatePracticeQuestion);
  $("#practice-reset").addEventListener("click", resetPracticeStats);
  $("#new-hand").addEventListener("click", () => {
    simulator.newHand();
    renderSimulator();
    queueAiIfNeeded();
  });
  $("#ai-level").addEventListener("change", (event) => {
    simulator.setLevel(event.target.value);
    renderSimulator();
  });
  $("#mp-name").value = mpState.name;
  $("#mp-join").addEventListener("click", () => {
    const name = $("#mp-name").value.trim() || randomGuestName();
    $("#mp-name").value = name;
    connectMultiplayer(name);
  });
  $("#mp-quick").addEventListener("click", () => {
    const name = $("#mp-name").value.trim() || randomGuestName();
    $("#mp-name").value = name;
    if (mpState.connected && mpState.state?.me) {
      mpSend({ type: "quick_start" });
    } else {
      mpState.pendingQuickStart = true;
      connectMultiplayer(name);
    }
  });
  $("#mp-name").addEventListener("keydown", (event) => {
    if (event.key === "Enter") $("#mp-join").click();
  });
  $("#mp-ready").addEventListener("click", () => mpSend({ type: "ready" }));
  $("#mp-table-ready").addEventListener("click", () => mpSend({ type: "ready" }));
  $("#mp-leave").addEventListener("click", () => mpSend({ type: "leave" }));
  $("#mp-add-ai").addEventListener("click", () => mpSend({ type: "add_ai" }));
  $("#mp-autocontinue").addEventListener("click", () => {
    mpState.autoContinue = !mpState.autoContinue;
    $("#mp-autocontinue").classList.toggle("is-on", mpState.autoContinue);
    if (mpState.autoContinue && mpState.state) maybeAutoContinue(mpState.state);
  });
  $("#mp-copy-link").addEventListener("click", copyInviteLink);
  $("#mp-chat-send").addEventListener("click", sendMpChat);
  $("#mp-chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMpChat();
  });
}

setupControls();
resetRangeFromControls();
wireEvents();
renderLab();
generatePracticeQuestion();
renderSimulator();
renderMultiplayer();
hydrateIcons();
