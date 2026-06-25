# Texas GTO Lab

A local Texas Hold'em strategy lab with an equity calculator, GTO-inspired mixed strategy engine, editable range matrix, and a real-time AI/multiplayer battle table.

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

## Notes

The engine uses `pokersolver` for 5-7 card hand evaluation and Monte Carlo sampling for equity. The strategy layer produces practical mixed frequencies from equity, pot odds, SPR, draw texture, range pressure, and position. It is designed to be upgraded with real solver exports or a backend CFR solver.
