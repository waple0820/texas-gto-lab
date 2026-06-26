#!/usr/bin/env bash
# Turn distillation pipeline: wait for dataset gen, train, eval, build/test, A/B.
set -u
cd "$(dirname "$0")/../.."
LOG=/tmp/turn-pipeline.log
: > "$LOG"
echo "[pipeline] waiting for dataset generation..." | tee -a "$LOG"
while pgrep -f gen_turn_dataset >/dev/null 2>&1; do sleep 10; done
echo "[pipeline] generation done. dataset:" | tee -a "$LOG"
python3 -c "import numpy as np; d=np.load('artifacts/turn-dataset.npz',allow_pickle=True); print(' X',d['X'].shape,'Y',d['Y'].shape,'feat',len(d['feature_names']))" 2>&1 | tee -a "$LOG"

echo "[pipeline] === training turn artifact ===" | tee -a "$LOG"
python3 scripts/solver/train_distill.py --data artifacts/turn-dataset.npz \
  --out src/distilled-turn-artifact.js --hidden 160 --epochs 450 \
  --version distill-turn-v1 --applies-to turn --export-name distilledTurnArtifact \
  --facing-actions "fold,call,jam" --max-kl 0.15 2>&1 | tee -a "$LOG"

echo "[pipeline] === held-out generalization (eval_turn) ===" | tee -a "$LOG"
python3 scripts/solver/eval_turn.py --data artifacts/turn-dataset.npz 2>&1 | tee -a "$LOG"

echo "[pipeline] === build + tests ===" | tee -a "$LOG"
npm run build >/dev/null 2>&1 && echo "build OK" | tee -a "$LOG" || echo "BUILD FAILED" | tee -a "$LOG"
npm test 2>&1 | grep -iE "passed|critical=|FAIL" | tee -a "$LOG"

echo "[pipeline] === A/B turn exploitability (ON vs OFF) ===" | tee -a "$LOG"
for BOARD in "Kh 9d 4s 2c" "Qh Js 8d 5c"; do
  echo "--- board: $BOARD ---" | tee -a "$LOG"
  echo "[distill ON]" | tee -a "$LOG"
  ENABLE_DISTILL=1 python3 scripts/solver/engine_turn_exploitability.py --board "$BOARD" 2>&1 | grep -E "ENGINE|Nash|gap" | tee -a "$LOG"
  echo "[distill OFF]" | tee -a "$LOG"
  DISABLE_DISTILL=1 python3 scripts/solver/engine_turn_exploitability.py --board "$BOARD" 2>&1 | grep -E "ENGINE|Nash|gap" | tee -a "$LOG"
done
echo "[pipeline] DONE" | tee -a "$LOG"
