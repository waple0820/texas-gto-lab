# Texas GTO Lab Plan

## Product Target

Build a professional Texas Hold'em decision lab that can answer practical table questions quickly: current hand equity, pot odds, range pressure, EV shape, mixed-action recommendation, and training through AI opponents that use the same strategy engine.

## Important Boundary

This first local version is a GTO-inspired decision engine, not a full PioSolver-class no-limit hold'em tree solver. Exact arbitrary-scenario GTO requires large game trees, abstractions, precomputed node locks, and substantial compute. The app is structured so solver exports or a future CFR backend can be plugged into the strategy layer without rewriting the UI or simulator.

## Implementation Roadmap

1. Core poker engine
   - Card/deck model, range matrix, weighted combo expansion.
   - Monte Carlo equity versus configurable opponent ranges.
   - Pot odds, SPR, MDF, call EV, and raise/bet breakeven metrics.
   - Verified hand evaluation through `pokersolver`.

2. Strategy lab
   - Hero cards, board cards, position, stack, pot, call price, opponents, and range controls.
   - 13x13 range matrix with weighted cells.
   - Mixed strategy output with action frequencies, sizing, EV panel, and reasoning tags.

3. AI simulator
   - Heads-up no-limit hold'em loop with blinds, streets, betting, showdown, stack/pot tracking.
   - AI difficulty levels with different samples, range discipline, aggression, and noise.
   - AI decisions routed through the same strategy engine.

4. Professional extension path
   - Import solver node data by board/line/stack depth.
   - Save scenario library and hand histories.
   - Add server-side CFR jobs for constrained subgames.
   - Add multiway solver abstractions and tournament ICM modules.

## Current Version

Implemented phases 1-3 as a browser app under `texas-gto-lab`.
