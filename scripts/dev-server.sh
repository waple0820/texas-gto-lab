#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

cd "/Users/avatar/Desktop/projects/games/texas-gto-lab"
exec /opt/homebrew/bin/npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
