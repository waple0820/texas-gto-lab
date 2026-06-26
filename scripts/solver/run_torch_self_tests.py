#!/usr/bin/env python3
"""Run optional torch solver self-tests.

The public/dev server does not need PyTorch to serve the compact JS artifacts.
On training hosts, pass --require-torch so missing PyTorch fails loudly.
"""

from __future__ import annotations

import argparse
import importlib.util
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--require-torch", action="store_true", help="fail instead of skipping when torch is unavailable")
    args = parser.parse_args()

    if importlib.util.find_spec("torch") is None:
        message = "[SKIP] torch solver self-tests skipped: PyTorch is not installed in this environment."
        if args.require_torch:
            print(message, file=sys.stderr)
            return 1
        print(message)
        return 0

    for script in ("scripts/solver/solver_torch.py", "scripts/solver/turn_torch.py"):
        result = subprocess.run([sys.executable, str(ROOT / script), "--self-test"], cwd=ROOT)
        if result.returncode != 0:
            return result.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
