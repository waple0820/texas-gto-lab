// Inference-time temperature for the distilled softmax.
//
// The behavior-cloned MLPs reproduce the solver's *modal* action well but come out
// OVER-SHARPENED: spots the true GTO mixes (c-bet ~70/check ~30, thin call/raise
// blends) collapse to near-pure 95-99%. A held-out audit found ~19 near-pure c-bets
// and ~40 near-pure calls that should mix — the "model-like / too pure" play an
// external reviewer flagged. Dividing the logits by T>1 before softmax softens those
// distributions back toward the solver's mixed targets. T=1 is the raw model.
//
// T is CALIBRATED PER STREET, not guessed, and not shared — calibration is
// street-specific because the streets have different mixing. Swept on the dual-5090
// host against converged solver baselines (the deep-SPR evals an external reviewer
// couldn't run — no local torch).
//
// FLOP (deeper, SPR ~13): GTO is genuinely MIXED, so the behavior-cloned MLP's
// over-sharpening hurts. Softening helps — 6-board deep-SPR A/B avg: T1.0 11.73% ->
// T1.25 11.36% (flat-to-better on every board) -> T1.5 11.30% (over-softens dry
// boards). At T=1.25 the audit's over-purity collapses (warnings 41->16, pure c-bets
// 19->5, pure calls 40->18). CHOSEN T=1.25.
//
// TURN (shallower, SPR ~4): GTO is SHARPER/more polarized, so softening pushes the
// model AWAY from correct. Measured: T1.0 25.7% -> T1.25 28.9% -> T1.5 32.6% pot —
// temperature strictly HURTS. CHOSEN T=1.0 (raw). The turn's real weakness (it's the
// weakest street) needs dataset/abstraction work, not temperature.
//
// RIVER: last street, polarized value/bluff — calibrated below from the exact CFR+
// river harness. CHOSEN per measurement.
//
// Override any street via globalThis.__DISTILL_TEMP__ / env DISTILL_TEMP for sweeps.
export const DISTILL_TEMPERATURE = {
  flop: 1.25,
  turn: 1.0,
  river: 1.0,
};

export function distillTemperature(street) {
  const g = Number(globalThis.__DISTILL_TEMP__);
  if (Number.isFinite(g) && g > 0) return g;
  if (typeof process !== "undefined" && process.env && process.env.DISTILL_TEMP) {
    const e = Number(process.env.DISTILL_TEMP);
    if (Number.isFinite(e) && e > 0) return e;
  }
  return DISTILL_TEMPERATURE[street] || 1.0;
}
