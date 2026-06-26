# Texas GTO Lab

A Texas Hold'em strategy lab with an equity calculator, a mixed strategy engine, an editable range matrix, and a real-time AI/multiplayer battle table.

**Live demo:** http://47.93.224.109:10086/

## GTO solver track

Beyond the heuristic engine, the project has **exact CFR(+) solvers** for the
river, turn, and flop with **measured exploitability** (the real distance-to-GTO
metric), and the solved strategies feed back into the live product:

- **Exact GTO** on covered river spots: the engine plays the equilibrium per
  combo, dropping exploitability from **28.7% to 0.14% of pot** (5 canonical
  textures shipped).
- **Generalized GTO** everywhere else on the river: a network distilled from the
  exact solver plays open *and* facing decisions, generalizing to unseen boards
  (held-out TV ~0.12 from equilibrium). An A/B exploitability test took an unseen
  spot from **29.7% (heuristic) to 9.0% of pot** — 3.3× closer to GTO — so it is
  **enabled by default**, with exploitative line-pressure layered on top.

See [docs/GTO_SOLVER.md](docs/GTO_SOLVER.md) for the full methodology, results, and
`npm run` commands (`test:solver`, `solve:gpu`, `measure:engine`, `export:solved`,
`gen:dataset`, `train:distill`, `eval:unified`).

## Deploy

```bash
scripts/deploy-wf.sh                      # wf@ubuntu preview (key auth)
SSHPASS='...' scripts/deploy-shared.sh    # shared server :10086 (builds locally, ships dist)
```

## Run

```bash
npm install
npm run build
HOST=127.0.0.1 PORT=5174 npm run serve
```

Open http://127.0.0.1:5174/.

For the tmux-backed local preview used during development:

```bash
npm run dev:stable
```

To stop the stable local server:

```bash
npm run dev:stop
```

## Deploy to wf@ubuntu

```bash
scripts/deploy-wf.sh
```

The deploy script syncs the project to `/home/wf/apps/texas-gto-lab`, runs install/test/build remotely, and restarts the `texas_gto_lab` tmux session on port `5174`.

## Battle Table

The `对战桌` tab uses the built-in Node/WebSocket server. Each browser enters a username and joins the same table. The first human seat automatically gets one AI opponent, so heads-up AI practice and multiplayer use the same table. The table supports up to 6 seats, AI seats can be added from the table controls, and the invite link button copies the current table URL for new players.

During a hand, each human client sees only its own immediate review. After the hand ends, the review panel switches into replay mode with player tabs, so users can choose one player or AI at a time and inspect that actor's decisions. Review cards are shown newest-first so the latest decision stays at the top.

The table also has a floating in-table action window for recent actions, a lightweight table chat, visible ready-up status on the table, and showdown card reveal for players who reach showdown. Desktop uses the round-table layout; phone portrait uses a compact stacked table so all controls remain reachable.

## Verify

```bash
npm test
npm run build
```

`npm test` also runs a deterministic 100-hand heads-up strategy audit and writes the latest decision log to `artifacts/strategy-audit-latest.json`. To run only that audit:

```bash
npm run test:strategy-audit
```

## Notes

The engine uses `pokersolver` for 5-7 card hand evaluation and Monte Carlo sampling for equity. The strategy layer uses a table-driven preflop policy plus a compact physical-rollout self-play postflop artifact. That artifact includes 10 range-equity histogram buckets, a precomputed equity-cache training path, and turn/river cascade value oracles for cross-street feedback. It is still not a full no-limit solver; the runtime is designed so deeper CFR/solver exports can replace the current artifact contract later.
