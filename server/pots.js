// Pure pot math for the multiplayer table: uncalled-bet refunds and layered
// side pots. Kept free of table state so it can be unit-tested directly
// (server/index.js starts listening on import, so game math lives here;
// src/poker-core.js is side-effect-free and safe to import).
//
// All amounts are in bb at 0.1 granularity, matching commit()/round(x, 1)
// in server/index.js. Every function is conservation-safe: chips out equal
// chips in, with any odd 0.1 remainder assigned deterministically.

import { round } from "../src/poker-core.js";

const EPS = 1e-9;

function round1(value) {
  return round(value, 1);
}

// entries: [{ id, contributed, folded }] — full-hand contribution per player
// dealt in (folded players included; their chips stay in the pot).
// The final bettor's excess above the second-highest contribution was never
// called by anyone and returns to them. Null when nothing is uncalled.
export function uncalledRefund(entries) {
  if (!entries || entries.length < 2) return null;
  const sorted = [...entries].sort((a, b) => b.contributed - a.contributed);
  const excess = round1(sorted[0].contributed - sorted[1].contributed);
  if (excess <= EPS) return null;
  return { id: sorted[0].id, amount: excess };
}

// Layer the pot at each distinct contender contribution cap. Call AFTER the
// uncalled refund has been applied. Returns [{ amount, eligible: [ids] }]
// ordered main pot first; amounts sum to the total contributions.
export function buildPots(entries) {
  const caps = [...new Set(
    entries.filter((entry) => !entry.folded).map((entry) => entry.contributed),
  )]
    .filter((cap) => cap > EPS)
    .sort((a, b) => a - b);

  const pots = [];
  let prev = 0;
  for (const cap of caps) {
    let amount = 0;
    for (const entry of entries) {
      amount += Math.min(entry.contributed, cap) - Math.min(entry.contributed, prev);
    }
    pots.push({
      amount: round1(amount),
      eligible: entries
        .filter((entry) => !entry.folded && entry.contributed >= cap - EPS)
        .map((entry) => entry.id),
    });
    prev = cap;
  }

  // After a correct refund no contribution exceeds the top contender cap, but
  // guard anyway: any residue folds into the last pot so chips never vanish.
  const topCap = caps.at(-1) ?? 0;
  let residue = 0;
  for (const entry of entries) residue += Math.max(0, entry.contributed - topCap);
  if (residue > EPS && pots.length) {
    pots[pots.length - 1].amount = round1(pots[pots.length - 1].amount + residue);
  }
  return pots;
}

// Split one pot among winners at 0.1bb granularity. The odd remainder goes to
// the first winner in the list (callers pass seat order for the standard
// odd-chip rule). Shares always sum exactly to `amount`.
export function splitPot(amount, winnerIds) {
  const count = winnerIds.length;
  if (!count) return [];
  const base = Math.floor((amount / count) * 10 + EPS) / 10;
  const shares = winnerIds.map((id) => ({ id, amount: base }));
  const remainder = round1(amount - base * count);
  if (remainder > EPS) shares[0].amount = round1(shares[0].amount + remainder);
  return shares;
}
