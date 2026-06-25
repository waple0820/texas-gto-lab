import os
for v in ("OMP_NUM_THREADS","OPENBLAS_NUM_THREADS","MKL_NUM_THREADS","NUMEXPR_NUM_THREADS"):
    os.environ[v] = "1"
import sys, numpy as np, multiprocessing as mp
sys.path.insert(0, "scripts/solver")
from gen_solved_dataset import (BET_SIZES, FEATURE_NAMES, exact_equities,
    equity_histogram, board_texture, build_features, random_board, POSITION_SIGNALS)
from river_cfr import RiverSolver, build_range, all_combos
np.seterr(over="ignore", invalid="ignore", divide="ignore")
POT, STACK, ITERS = 10.0, 20.0, 1000

def gen_one(seed):
    rng = np.random.default_rng(seed)
    board = list(random_board(rng))
    combos = all_combos(board)
    w = np.ones(len(combos))
    ro = build_range(board, combos, w.copy()); ri = build_range(board, combos, w.copy())
    s = RiverSolver(board, ro, ri, POT, STACK, BET_SIZES)
    s.solve(ITERS)
    avg = s.average_strategy()
    eq = exact_equities(ro.strength.astype(np.int64), s.valid)
    hist = equity_histogram(eq)
    wet, pa, mo, co = board_texture(board)
    pos = float(rng.choice(POSITION_SIGNALS))
    X = build_features(combos, board, eq, hist, wet, pa, mo, co, POT, STACK, pos)
    return X.astype(np.float32), avg[0].astype(np.float32)

if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else 28
    seeds = [20260626 + i for i in range(n)]
    Xs, Ys, done = [], [], 0
    with mp.Pool(workers) as p:
        for X, Y in p.imap_unordered(gen_one, seeds):
            Xs.append(X); Ys.append(Y); done += 1
            if done % 20 == 0 or done == n:
                print(f"{done}/{n} boards", flush=True)
    X = np.concatenate(Xs); Y = np.concatenate(Ys)
    np.savez_compressed("artifacts/solved-river-dataset.npz", X=X, Y=Y,
        feature_names=np.array(FEATURE_NAMES),
        action_names=np.array(["check","bet-small","bet-mid","bet-big","bet-over"]))
    print("DONE", X.shape, Y.shape, flush=True)
