#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_HOST="${REMOTE_HOST:-wf@ubuntu}"
REMOTE_DIR="${REMOTE_DIR:-/home/wf/apps/texas-gto-lab}"
SESSION="${SESSION:-texas_gto_lab}"
PORT="${PORT:-5174}"

cd "$ROOT_DIR"

npm test
npm run build

ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_DIR'"
rsync -az --delete \
  --exclude node_modules \
  --exclude dist \
  --exclude .dev-server.log \
  --exclude .dev-server.pid \
  --exclude .DS_Store \
  ./ "$REMOTE_HOST:$REMOTE_DIR/"

ssh "$REMOTE_HOST" "
  set -e
  cd '$REMOTE_DIR'
  npm ci
  npm test
  npm run build
  tmux kill-session -t '$SESSION' 2>/dev/null || true
  tmux new-session -d -s '$SESSION' -c '$REMOTE_DIR' 'HOST=0.0.0.0 PORT=$PORT npm run serve'
  sleep 1
  curl -fsS -I http://127.0.0.1:$PORT/ >/dev/null
  tmux capture-pane -t '$SESSION' -p -S -40
"
