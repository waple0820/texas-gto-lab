import { buildRangeWeights, cardLabel, clamp, compareSolvedHands, makeDeck, round, shuffle, solveCards } from "./poker-core.js";
import { pickAction, recommendStrategy } from "./strategy-engine.js";

export const AI_LEVELS = {
  beginner: {
    label: "Beginner",
    rangeStyle: "loose",
    samples: 220,
    temperature: 1.75,
    aggression: 0.72,
    noise: 0.28,
  },
  regular: {
    label: "Regular",
    rangeStyle: "balanced",
    samples: 520,
    temperature: 1.18,
    aggression: 0.92,
    noise: 0.14,
  },
  grinder: {
    label: "Grinder",
    rangeStyle: "balanced",
    samples: 950,
    temperature: 1,
    aggression: 1.05,
    noise: 0.07,
  },
  solver: {
    label: "Solver-ish",
    rangeStyle: "tight",
    samples: 1500,
    temperature: 1,
    aggression: 1.16,
    noise: 0.025,
  },
};

export const STREET_LABELS = {
  preflop: "翻前",
  flop: "翻牌",
  turn: "转牌",
  river: "河牌",
  showdown: "摊牌",
};

export class HoldemSimulator {
  constructor({ level = "regular", rng = Math.random } = {}) {
    this.rng = rng;
    this.level = level;
    this.heroStack = 100;
    this.aiStack = 100;
    this.handNumber = 0;
    this.newHand();
  }

  setLevel(level) {
    if (AI_LEVELS[level]) this.level = level;
  }

  newHand() {
    if (this.heroStack < 1 || this.aiStack < 1) {
      this.heroStack = 100;
      this.aiStack = 100;
    }
    this.handNumber += 1;
    this.deck = shuffle(makeDeck(), this.rng);
    this.heroHole = [this.deck.pop(), this.deck.pop()];
    this.aiHole = [this.deck.pop(), this.deck.pop()];
    this.board = [];
    this.street = "preflop";
    this.pot = 1.5;
    this.heroBet = 0.5;
    this.aiBet = 1;
    this.heroStack = round(this.heroStack - 0.5, 1);
    this.aiStack = round(this.aiStack - 1, 1);
    this.currentBet = 1;
    this.toAct = "hero";
    this.acted = new Set();
    this.terminal = false;
    this.showdown = null;
    this.review = [];
    this.actions = [
      { actor: "hero", street: "preflop", type: "blind", label: "小盲", amount: 0.5, pot: 0.5 },
      { actor: "ai", street: "preflop", type: "blind", label: "大盲", amount: 1, pot: 1.5 },
    ];
    this.lastRecommendation = null;
    this.log = [
      `Hand ${this.handNumber}: Hero posts 0.5bb, AI posts 1bb.`,
      `Hero: ${this.heroHole.map(cardLabel).join(" ")}`,
    ];
  }

  get profile() {
    return AI_LEVELS[this.level] || AI_LEVELS.regular;
  }

  getToCall(actor) {
    const actorBet = actor === "hero" ? this.heroBet : this.aiBet;
    return round(Math.max(0, this.currentBet - actorBet), 1);
  }

  other(actor) {
    return actor === "hero" ? "ai" : "hero";
  }

  actorStack(actor) {
    return actor === "hero" ? this.heroStack : this.aiStack;
  }

  actorBet(actor) {
    return actor === "hero" ? this.heroBet : this.aiBet;
  }

  betsSettled() {
    if (this.heroStack <= 0.01 && this.aiStack <= 0.01) return true;
    if (Math.abs(this.heroBet - this.aiBet) <= 0.11 && (this.heroStack <= 0.01 || this.aiStack <= 0.01)) return true;
    return this.heroBet === this.aiBet;
  }

  setActorStack(actor, value) {
    if (actor === "hero") this.heroStack = round(value, 1);
    else this.aiStack = round(value, 1);
  }

  setActorBet(actor, value) {
    if (actor === "hero") this.heroBet = round(value, 1);
    else this.aiBet = round(value, 1);
  }

  commitTo(actor, targetContribution) {
    const current = this.actorBet(actor);
    const stack = this.actorStack(actor);
    const needed = Math.max(0, targetContribution - current);
    const paid = Math.min(stack, needed);
    this.setActorStack(actor, stack - paid);
    this.setActorBet(actor, current + paid);
    this.pot = round(this.pot + paid, 1);
    this.currentBet = round(Math.max(this.currentBet, this.actorBet(actor)), 1);
    return paid;
  }

  recordAction(actor, type, label, amount = 0) {
    const action = {
      actor,
      street: this.street,
      type,
      label,
      amount: round(amount, 1),
      pot: round(this.pot, 1),
      heroStack: round(this.heroStack, 1),
      aiStack: round(this.aiStack, 1),
      board: [...this.board],
      order: this.actions.length + 1,
    };
    this.actions.push(action);
    return action;
  }

  playerAction(type) {
    if (this.terminal || this.toAct !== "hero") return null;
    return this.applyAction("hero", type);
  }

  aiAction() {
    if (this.terminal || this.toAct !== "ai") return null;
    const toCall = this.getToCall("ai");
    const context = this.contextForActor("ai", toCall);
    const rangeWeights = buildRangeWeights({
      style: this.profile.rangeStyle,
      position: this.street === "preflop" ? "BB" : "BB",
      context,
      tableSize: 2,
      stackBb: Math.max(1, this.aiStack),
    });
    const recommendation = recommendStrategy({
      hero: this.aiHole,
      board: this.board,
      position: "BB",
      context,
      tableSize: 2,
      stackBb: Math.max(1, this.aiStack),
      pot: this.pot,
      toCall,
      opponents: 1,
      rangeWeights,
      iterations: this.profile.samples,
      rng: this.rng,
      lineProfile: this.lineProfileForActor("ai", toCall),
    });
    this.lastRecommendation = recommendation;

    let picked = pickAction(recommendation.actions, this.rng, this.profile.temperature);
    if (this.rng() < this.profile.noise) {
      const legal = toCall > 0 ? ["fold", "call", "raise"] : ["check", "bet-small", "bet-big"];
      picked = { key: legal[Math.floor(this.rng() * legal.length)] };
    }

    if (toCall > 0) {
      if (picked.key === "fold" && toCall > 0) return this.applyAction("ai", "fold");
      if (picked.key === "jam") return this.applyAction("ai", "allin");
      if ((picked.key === "raise-big" || picked.key === "raise") && this.aiStack > toCall + 2) return this.applyAction("ai", "pot");
      if (picked.key === "raise-small" && this.aiStack > toCall + 2) return this.applyAction("ai", "half");
      return this.applyAction("ai", "check-call");
    }

    if (picked.key === "bet-small") return this.applyAction("ai", "third");
    if (picked.key === "bet-mid") return this.applyAction("ai", "half");
    if (picked.key === "bet-big" || picked.key === "raise") return this.applyAction("ai", "pot");
    if (picked.key === "bet-over") return this.applyAction("ai", "overbet");
    return this.applyAction("ai", "check-call");
  }

  contextForActor(actor, toCall) {
    if (this.street === "preflop") {
      const position = actor === "hero" ? "SB" : "BB";
      const raises = this.actions.filter((action) => action.street === "preflop" && (action.type === "raise" || action.type === "allin"));
      const hasLimp = this.actions.some((action) => action.street === "preflop" && action.type === "call");

      if (raises.length === 0) {
        if (position === "SB") return "unopened";
        return hasLimp || actor === "ai" ? "check-option" : "unopened";
      }
      if (raises.length === 1) {
        if (toCall <= 0) return "check-option";
        return position === "BB" ? "blind-defense" : "facing-open";
      }
      if (toCall > 0) return "facing-3bet";
      return "check-option";
    }
    if (toCall > 0 && this.currentBet >= this.pot * 0.55) return "facing-bet";
    if (toCall > 0) return "facing-raise";
    return this.currentBet > 0 ? "single-raised" : "single-raised";
  }

  lineProfileForActor(actor, toCall) {
    const streetOrder = ["flop", "turn", "river"];
    const rank = streetOrder.indexOf(this.street);
    if (rank < 0) return { weakProbe: false, currentBetFraction: 0, passiveScore: 0 };
    const opponent = this.other(actor);
    const opponentActions = this.actions.filter((action) => action.actor === opponent && streetOrder.includes(action.street));
    const previous = opponentActions.filter((action) => streetOrder.indexOf(action.street) < rank);
    const aggressive = (action) => ["bet", "raise", "allin"].includes(action?.type);
    const previousAggression = previous.filter(aggressive);
    const previousChecks = previous.filter((action) => action.type === "check").length;
    const currentAggression = opponentActions.findLast((action) => action.street === this.street && aggressive(action));
    const potBeforeCall = Math.max(1, this.pot - toCall);
    const currentBetFraction = toCall > 0 ? toCall / potBeforeCall : 0;
    const passiveScore = Math.max(
      0,
      Math.min(1, (previousAggression.length === 0 ? 0.38 : 0) + Math.min(0.42, previousChecks * 0.18) + (currentBetFraction > 0 && currentBetFraction <= 0.35 ? 0.2 : 0)),
    );
    return {
      weakProbe: toCall > 0 && Boolean(currentAggression) && currentBetFraction <= 0.35 && previousAggression.length === 0 && (rank < 2 || previousChecks >= 1),
      passiveOpponentLine: previousAggression.length === 0,
      previousChecks,
      previousAggression: previousAggression.length,
      currentBetFraction: round(currentBetFraction, 3),
      passiveScore,
    };
  }

  applyAction(actor, type) {
    const toCall = this.getToCall(actor);
    if (type === "fold") {
      return this.fold(actor);
    }
    if (type === "check-call") {
      return this.passive(actor);
    }
    if (type === "third") {
      return this.aggressive(actor, Math.max(1, this.pot * 0.33));
    }
    if (type === "half") {
      return this.aggressive(actor, Math.max(1, this.pot * 0.5));
    }
    if (type === "two-thirds") {
      return this.aggressive(actor, Math.max(1, this.pot * 0.66));
    }
    if (type === "pot") {
      return this.aggressive(actor, Math.max(1, this.pot));
    }
    if (type === "overbet") {
      return this.aggressive(actor, Math.max(1, this.pot * 1.25));
    }
    if (type === "raise") {
      return this.aggressive(actor, Math.max(2.5, this.pot * 0.72));
    }
    if (type === "allin") {
      return this.aggressive(actor, this.actorStack(actor) + toCall);
    }
    return null;
  }

  fold(actor) {
    const winner = this.other(actor);
    this.setActorStack(winner, this.actorStack(winner) + this.pot);
    this.recordAction(actor, "fold", "弃牌", 0);
    this.log.push(`${this.actorLabel(actor)} folds. ${this.actorLabel(winner)} wins ${round(this.pot, 1)}bb.`);
    this.pot = 0;
    this.terminal = true;
    this.toAct = null;
    return { terminal: true };
  }

  passive(actor) {
    const toCall = this.getToCall(actor);
    if (toCall > 0) {
      const paid = this.commitTo(actor, this.currentBet);
      this.recordAction(actor, "call", "跟注", paid);
      this.log.push(`${this.actorLabel(actor)} calls ${round(paid, 1)}bb.`);
    } else {
      this.recordAction(actor, "check", "过牌", 0);
      this.log.push(`${this.actorLabel(actor)} checks.`);
    }
    this.acted.add(actor);
    return this.afterPassive(actor);
  }

  aggressive(actor, size) {
    const toCall = this.getToCall(actor);
    const current = this.actorBet(actor);
    const stack = this.actorStack(actor);
    const scaled = actor === "ai" ? size * this.profile.aggression : size;
    const target = toCall > 0 ? this.currentBet + scaled : current + scaled;
    const cappedTarget = Math.min(current + stack, Math.max(target, this.currentBet + (toCall > 0 ? 1 : 0)));
    const paid = this.commitTo(actor, cappedTarget);
    const allIn = this.actorStack(actor) <= 0.01;
    const isPreflopRaise = this.street === "preflop";
    const actionLabel = allIn ? "全压" : toCall > 0 || isPreflopRaise ? "加注" : "下注";
    this.recordAction(actor, allIn ? "allin" : toCall > 0 || isPreflopRaise ? "raise" : "bet", actionLabel, paid);
    this.log.push(`${this.actorLabel(actor)} ${toCall > 0 ? "raises" : "bets"} ${round(paid, 1)}bb${allIn ? " all-in" : ""}.`);
    this.acted = new Set([actor]);
    if (this.actorStack(this.other(actor)) <= 0.01 || this.actorStack(actor) <= 0.01) {
      if (this.betsSettled()) return this.runoutAndShowdown();
    }
    this.toAct = this.other(actor);
    return { terminal: false };
  }

  afterPassive(actor) {
    if (this.heroBet === this.aiBet && this.acted.size >= 2) {
      return this.advanceStreet();
    }
    if (this.heroStack <= 0.01 || this.aiStack <= 0.01) {
      if (this.betsSettled()) return this.runoutAndShowdown();
    }
    this.toAct = this.other(actor);
    return { terminal: false };
  }

  advanceStreet() {
    this.heroBet = 0;
    this.aiBet = 0;
    this.currentBet = 0;
    this.acted = new Set();

    if (this.street === "preflop") {
      this.board.push(this.deck.pop(), this.deck.pop(), this.deck.pop());
      this.street = "flop";
      this.log.push(`Flop: ${this.board.map(cardLabel).join(" ")}`);
      this.toAct = "ai";
      return { terminal: false };
    }
    if (this.street === "flop") {
      this.board.push(this.deck.pop());
      this.street = "turn";
      this.log.push(`Turn: ${cardLabel(this.board[3])}`);
      this.toAct = "ai";
      return { terminal: false };
    }
    if (this.street === "turn") {
      this.board.push(this.deck.pop());
      this.street = "river";
      this.log.push(`River: ${cardLabel(this.board[4])}`);
      this.toAct = "ai";
      return { terminal: false };
    }
    return this.showdownNow();
  }

  runoutAndShowdown() {
    while (this.board.length < 5) {
      this.board.push(this.deck.pop());
    }
    this.log.push(`Runout: ${this.board.map(cardLabel).join(" ")}`);
    return this.showdownNow();
  }

  showdownNow() {
    while (this.board.length < 5) {
      this.board.push(this.deck.pop());
    }
    const heroSolved = solveCards([...this.heroHole, ...this.board]);
    const aiSolved = solveCards([...this.aiHole, ...this.board]);
    const winners = compareSolvedHands([heroSolved, aiSolved]);
    const split = winners.length > 1;
    if (split) {
      this.heroStack = round(this.heroStack + this.pot / 2, 1);
      this.aiStack = round(this.aiStack + this.pot / 2, 1);
      this.log.push(`Showdown split. Hero ${heroSolved.descr}; AI ${aiSolved.descr}.`);
    } else if (winners[0] === heroSolved) {
      this.heroStack = round(this.heroStack + this.pot, 1);
      this.log.push(`Hero wins ${round(this.pot, 1)}bb with ${heroSolved.descr}. AI had ${this.aiHole.map(cardLabel).join(" ")}.`);
    } else {
      this.aiStack = round(this.aiStack + this.pot, 1);
      this.log.push(`AI wins ${round(this.pot, 1)}bb with ${aiSolved.descr}. AI had ${this.aiHole.map(cardLabel).join(" ")}.`);
    }
    this.showdown = {
      hero: heroSolved,
      ai: aiSolved,
      aiHole: [...this.aiHole],
      split,
    };
    this.pot = 0;
    this.terminal = true;
    this.toAct = null;
    return { terminal: true };
  }

  actorLabel(actor) {
    return actor === "hero" ? "Hero" : "AI";
  }
}
