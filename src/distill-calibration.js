// Inference-time temperature for the distilled softmax.
//
// The behavior-cloned MLPs reproduce the solver's *modal* action well but come out
// OVER-SHARPENED: spots the true GTO mixes (c-bet ~70/check ~30, thin call/raise
// blends) collapse to near-pure 95-99%. A held-out audit found ~19 near-pure c-bets
// and ~40 near-pure calls that should mix — the "model-like / too pure" play an
// external reviewer flagged. Dividing the logits by T>1 before softmax softens those
// distributions back toward the solver's mixed targets. T=1 is the raw model.
//
// T is CALIBRATED, not guessed. Swept on the dual-5090 host against the converged
// FlopVectorizedSolver baseline (the deterministic, fully-enumerated Nash that an
// external reviewer couldn't run — no local torch). Deep-SPR flop A/B over 6 boards,
// avg engine exploitability:
//   T=1.0  11.73% pot   (raw, over-sharpened)
//   T=1.25 11.36% pot   <- chosen: flat-to-better on EVERY board
//   T=1.5  11.30% pot   (avg best, but regresses dry boards e.g. Kh9d4s +1pp —
//                        over-softens genuinely-pure value c-bets)
// Meanwhile the local strategy audit's over-purity drops sharply at T=1.25:
// near-pure warnings 41->16, pure c-bets 19->5, pure calls 40->18 (0 critical).
// So 1.25 buys substantially more natural / mixed play at NO exploitability cost
// (slightly better, in fact) — the right operating point. Overridable via
// globalThis.__DISTILL_TEMP__ / env DISTILL_TEMP for future re-calibration sweeps.
export const DISTILL_TEMPERATURE = 1.25;

export function distillTemperature() {
  const g = Number(globalThis.__DISTILL_TEMP__);
  if (Number.isFinite(g) && g > 0) return g;
  if (typeof process !== "undefined" && process.env && process.env.DISTILL_TEMP) {
    const e = Number(process.env.DISTILL_TEMP);
    if (Number.isFinite(e) && e > 0) return e;
  }
  return DISTILL_TEMPERATURE;
}
