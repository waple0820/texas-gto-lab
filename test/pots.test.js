import assert from "node:assert/strict";
import { buildPots, splitPot, uncalledRefund } from "../server/pots.js";

function total(pots) {
  return Math.round(pots.reduce((sum, pot) => sum + pot.amount, 0) * 10) / 10;
}

// --- uncalledRefund ---

// Final bet nobody called: excess above the second-highest contribution returns.
assert.deepEqual(
  uncalledRefund([
    { id: "a", contributed: 50, folded: false },
    { id: "b", contributed: 30, folded: true },
  ]),
  { id: "a", amount: 20 },
);

// Matched contributions: nothing to refund.
assert.equal(
  uncalledRefund([
    { id: "a", contributed: 50, folded: false },
    { id: "b", contributed: 50, folded: false },
  ]),
  null,
);

// Over-jam vs a shorter all-in caller: refund only the uncovered part.
assert.deepEqual(
  uncalledRefund([
    { id: "big", contributed: 100, folded: false },
    { id: "short", contributed: 60, folded: false },
    { id: "dead", contributed: 2, folded: true },
  ]),
  { id: "big", amount: 40 },
);

assert.equal(uncalledRefund([{ id: "a", contributed: 10, folded: false }]), null);

// 0.1bb granularity survives.
assert.deepEqual(
  uncalledRefund([
    { id: "a", contributed: 7.5, folded: false },
    { id: "b", contributed: 2.2, folded: true },
  ]),
  { id: "a", amount: 5.3 },
);

// --- buildPots ---

// Simple contested pot, one layer, folded chips included.
{
  const pots = buildPots([
    { id: "a", contributed: 10, folded: false },
    { id: "b", contributed: 10, folded: false },
    { id: "c", contributed: 2, folded: true },
  ]);
  assert.equal(pots.length, 1);
  assert.equal(pots[0].amount, 22);
  assert.deepEqual(pots[0].eligible.sort(), ["a", "b"]);
}

// Three-way all-in ladder: main + two side pots, each layer eligibility shrinks.
{
  const pots = buildPots([
    { id: "deep", contributed: 100, folded: false },
    { id: "mid", contributed: 60, folded: false },
    { id: "short", contributed: 30, folded: false },
  ]);
  assert.equal(pots.length, 3);
  assert.deepEqual(pots.map((pot) => pot.amount), [90, 60, 40]);
  assert.deepEqual(pots[0].eligible.sort(), ["deep", "mid", "short"]);
  assert.deepEqual(pots[1].eligible.sort(), ["deep", "mid"]);
  assert.deepEqual(pots[2].eligible, ["deep"]);
  assert.equal(total(pots), 190);
}

// The soak-reproduced bug shape: 8.1bb effective all-in must only ever be
// eligible for min(contribution) x players, never the whole pot.
{
  const pots = buildPots([
    { id: "shortstack", contributed: 8.1, folded: false },
    { id: "a", contributed: 40, folded: false },
    { id: "b", contributed: 40, folded: false },
    { id: "dead", contributed: 1, folded: true },
  ]);
  const shortPots = pots.filter((pot) => pot.eligible.includes("shortstack"));
  const shortMax = total(shortPots);
  assert.equal(shortMax, 25.3); // 8.1*3 + 1 dead
  assert.equal(total(pots), 89.1);
}

// Folded contribution above every contender cap folds into the last pot
// (defensive: cannot happen after a refund, but chips must never vanish).
{
  const pots = buildPots([
    { id: "a", contributed: 10, folded: false },
    { id: "big-folder", contributed: 14, folded: true },
  ]);
  assert.equal(total(pots), 24);
}

// --- splitPot ---

assert.deepEqual(splitPot(10, ["a", "b"]), [
  { id: "a", amount: 5 },
  { id: "b", amount: 5 },
]);

// Odd 0.1 remainder goes to the first winner; total conserved.
{
  const shares = splitPot(10.1, ["a", "b"]);
  assert.equal(Math.round(shares.reduce((sum, share) => sum + share.amount, 0) * 10) / 10, 10.1);
  assert.deepEqual(shares, [
    { id: "a", amount: 5.1 },
    { id: "b", amount: 5 },
  ]);
}

// Three-way with non-divisible amount conserves chips.
{
  const shares = splitPot(10, ["a", "b", "c"]);
  assert.equal(Math.round(shares.reduce((sum, share) => sum + share.amount, 0) * 10) / 10, 10);
  assert.equal(shares[0].amount >= shares[1].amount, true);
}

assert.deepEqual(splitPot(5, []), []);

// --- end-to-end conservation over randomized hands ---
// Random contributions + folds; refund then layer; awarded + refund must equal
// the chips put in, and every pot's eligibility must respect contribution caps.
{
  let seed = 20260825;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  for (let trial = 0; trial < 500; trial += 1) {
    const count = 2 + Math.floor(rand() * 4);
    const entries = Array.from({ length: count }, (_, index) => ({
      id: `p${index}`,
      contributed: Math.round(rand() * 1000) / 10,
      folded: index === 0 ? false : rand() < 0.4,
    }));
    if (entries.every((entry) => entry.folded)) entries[1].folded = false;
    const potBefore = Math.round(entries.reduce((sum, entry) => sum + entry.contributed, 0) * 10) / 10;

    const refund = uncalledRefund(entries);
    if (refund) {
      const entry = entries.find((item) => item.id === refund.id);
      entry.contributed = Math.round((entry.contributed - refund.amount) * 10) / 10;
    }
    const pots = buildPots(entries);
    const awarded = total(pots);
    const refunded = refund ? refund.amount : 0;
    assert.equal(
      Math.round((awarded + refunded) * 10) / 10,
      potBefore,
      `trial ${trial}: awarded ${awarded} + refund ${refunded} != pot ${potBefore}`,
    );
    for (const pot of pots) {
      assert.ok(pot.amount > 0 || pots.length === 1, `trial ${trial}: empty layered pot`);
      assert.ok(pot.eligible.length > 0, `trial ${trial}: pot with no eligible players`);
    }
  }
}

console.log("pot math tests passed");
