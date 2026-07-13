#!/usr/bin/env bash
# Deploy the locally-built app to the shared server (port 10086).
#
# The server runs an older Node, so the build runs on YOUR machine and only the
# prebuilt dist/ is shipped; the server just runs `npm run serve`. Validation is
# local (npm test + npm run build run here before anything is sent).
#
# Auth: set SSHPASS and have sshpass installed for password auth
#   (SSHPASS='...' scripts/deploy-shared.sh), or use an SSH key / interactive
#   prompt. The password is never stored in this script.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_HOST="${REMOTE_HOST:-waple@47.93.224.109}"
REMOTE_DIR="${REMOTE_DIR:-/home/waple/apps/texas-gto-lab}"
SESSION="${SESSION:-texas_gto_lab}"
PORT="${PORT:-10086}"

cd "$ROOT_DIR"

npm test
npm run build

EXPECTED_JS="$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' dist/index.html | head -n 1)"
if [ -z "$EXPECTED_JS" ]; then
  echo "could not determine the built JavaScript asset" >&2
  exit 1
fi

SSH=(ssh -o StrictHostKeyChecking=no)
SCP=(scp -o StrictHostKeyChecking=no)
if command -v sshpass >/dev/null 2>&1 && [ -n "${SSHPASS:-}" ]; then
  SSH=(sshpass -e "${SSH[@]}")
  SCP=(sshpass -e "${SCP[@]}")
fi

TARBALL="$(mktemp -t tgl-deploy-XXXX).tar.gz"
trap 'rm -f "$TARBALL"' EXIT
COPYFILE_DISABLE=1 tar czf "$TARBALL" \
  --exclude node_modules --exclude .git --exclude .DS_Store .

"${SCP[@]}" "$TARBALL" "$REMOTE_HOST:/tmp/tgl-deploy.tar.gz"
"${SSH[@]}" "$REMOTE_HOST" "
  set -e
  mkdir -p '$REMOTE_DIR'
  tar xzf /tmp/tgl-deploy.tar.gz -C '$REMOTE_DIR'
  rm -f /tmp/tgl-deploy.tar.gz
  cd '$REMOTE_DIR'
  # deps are usually unchanged (prebuilt dist is shipped); install if needed:
  [ -d node_modules ] || npm install --no-audit --no-fund
  tmux kill-session -t '$SESSION' 2>/dev/null || true
  sleep 1
  if ss -H -ltn 'sport = :$PORT' | grep -q .; then
    echo 'port $PORT is still occupied after stopping tmux session $SESSION' >&2
    ss -ltn 'sport = :$PORT' >&2 || true
    exit 1
  fi
  tmux new-session -d -s '$SESSION' -c '$REMOTE_DIR' 'HOST=0.0.0.0 PORT=$PORT npm run serve'
  sleep 2
  REMOTE_INDEX=\$(curl -fsS http://127.0.0.1:$PORT/)
  if ! printf '%s' \"\$REMOTE_INDEX\" | grep -Fq '$EXPECTED_JS'; then
    echo 'deployment asset mismatch: expected $EXPECTED_JS' >&2
    exit 1
  fi
  curl -fsS -o /dev/null -w 'deployed asset=$EXPECTED_JS http_code=%{http_code}\n' http://127.0.0.1:$PORT/health
"
echo "deployed to http://${REMOTE_HOST#*@}:$PORT/"
