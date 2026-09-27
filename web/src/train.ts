/**
 * Train a static-tier head in the browser — the same recipe as microdecide/static.py + train.py:
 * standardize (folded into the weights), class-balanced + sample-weighted multinomial logistic
 * regression with C chosen by val macro F1, temperature scaling on val, escalation threshold at a
 * target precision. Pure TS, no dependencies; ~1k examples train in about a second.
 */
import { softmax } from "./text.js";

export type Split = "train" | "val" | "test";

export const C_GRID = [0.003, 0.01, 0.03, 0.1, 0.3, 1, 3];

// --- deterministic randomness + split (mirrors data.stratified_split) -----------------------

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function stratifiedSplit(y: number[], seed = 42, fractions = { train: 0.7, val: 0.15, test: 0.15 }): Split[] {
  const rand = mulberry32(seed);
  const byLabel = new Map<number, number[]>();
  y.forEach((l, i) => byLabel.set(l, [...(byLabel.get(l) ?? []), i]));
  const out: Split[] = new Array(y.length).fill("train");
  for (const label of [...byLabel.keys()].sort((a, b) => a - b)) {
    const idx = byLabel.get(label)!;
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const n = idx.length;
    let nTest = Math.round(n * fractions.test);
    let nVal = Math.round(n * fractions.val);
    if (n >= 3) {
      nTest = Math.max(1, nTest);
      nVal = Math.max(1, nVal);
    }
    idx.forEach((i, k) => (out[i] = k < nTest ? "test" : k < nTest + nVal ? "val" : "train"));
  }
  return out;
}

// --- L-BFGS ------------------------------------------------------------------------------------

type Objective = (x: Float64Array, grad: Float64Array) => number;

export function lbfgs(f: Objective, x0: Float64Array, maxIter = 1000, m = 10, gtol = 1e-7): { x: Float64Array; iters: number; value: number } {
  const n = x0.length;
  const x = Float64Array.from(x0);
  const g = new Float64Array(n);
  let fx = f(x, g);
  const S: Float64Array[] = [];
  const Y: Float64Array[] = [];
  const rho: number[] = [];
  const d = new Float64Array(n);
  const xNew = new Float64Array(n);
  const gNew = new Float64Array(n);
  let iter = 0;
  for (; iter < maxIter; iter++) {
    if (maxAbs(g) < gtol) break;
    // two-loop recursion: d = -H g
    d.set(g);
    const alpha: number[] = [];
    for (let k = S.length - 1; k >= 0; k--) {
      alpha[k] = rho[k] * dot(S[k], d);
      axpy(-alpha[k], Y[k], d);
    }
    if (S.length) {
      const last = S.length - 1;
      scale(d, dot(S[last], Y[last]) / dot(Y[last], Y[last]));
    }
    for (let k = 0; k < S.length; k++) axpy(alpha[k] - rho[k] * dot(Y[k], d), S[k], d);
    scale(d, -1);
    let slope = dot(g, d);
    if (slope >= 0) {
      // not a descent direction: reset to steepest descent
      d.set(g);
      scale(d, -1);
      slope = dot(g, d);
      S.length = Y.length = rho.length = 0;
    }
    // backtracking Armijo line search
    let step = iter === 0 ? Math.min(1, 1 / Math.max(1e-12, Math.sqrt(dot(g, g)))) : 1;
    let fNew = Infinity;
    for (let ls = 0; ls < 40; ls++) {
      for (let i = 0; i < n; i++) xNew[i] = x[i] + step * d[i];
      fNew = f(xNew, gNew);
      if (fNew <= fx + 1e-4 * step * slope) break;
      step /= 2;
    }
    const s = new Float64Array(n);
    const yv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      s[i] = xNew[i] - x[i];
      yv[i] = gNew[i] - g[i];
    }
    const sy = dot(s, yv);
    const done = Math.abs(fx - fNew) <= 1e-10 * Math.max(1, Math.abs(fx));
    x.set(xNew);
    g.set(gNew);
    fx = fNew;
    if (sy > 1e-12) {
      S.push(s);
      Y.push(yv);
      rho.push(1 / sy);
      if (S.length > m) {
        S.shift();
        Y.shift();
        rho.shift();
      }
    }
    if (done) break;
  }
  return { x, iters: iter, value: fx };
}

function dot(a: Float64Array, b: Float64Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function axpy(a: number, x: Float64Array, y: Float64Array) {
  for (let i = 0; i < x.length; i++) y[i] += a * x[i];
}
function scale(x: Float64Array, a: number) {
  for (let i = 0; i < x.length; i++) x[i] *= a;
}
function maxAbs(x: Float64Array): number {
  let m = 0;
  for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i]));
  return m;
}

// --- logistic regression -----------------------------------------------------------------------

/** Multinomial LR on standardized rows Z: minimizes Σ sᵢ·CEᵢ + ‖W‖²/(2C) (sklearn's objective),
 *  scaled by 1/Σs. Returns [W (K×D row-major), b (K)] packed in one array. */
export function fitLogReg(Z: Float64Array[], y: number[], s: number[], K: number, C: number, x0?: Float64Array): Float64Array {
  const D = Z[0].length;
  const S = s.reduce((a, b) => a + b, 0);
  const z = new Float64Array(K);
  const f: Objective = (x, grad) => {
    grad.fill(0);
    let loss = 0;
    for (let i = 0; i < Z.length; i++) {
      const zi = Z[i];
      let max = -Infinity;
      for (let k = 0; k < K; k++) {
        let v = x[K * D + k];
        const off = k * D;
        for (let j = 0; j < D; j++) v += x[off + j] * zi[j];
        z[k] = v;
        if (v > max) max = v;
      }
      let sum = 0;
      for (let k = 0; k < K; k++) sum += Math.exp(z[k] - max);
      const lse = max + Math.log(sum);
      loss += s[i] * (lse - z[y[i]]);
      for (let k = 0; k < K; k++) {
        const diff = s[i] * (Math.exp(z[k] - lse) - (k === y[i] ? 1 : 0));
        if (diff === 0) continue;
        const off = k * D;
        for (let j = 0; j < D; j++) grad[off + j] += diff * zi[j];
        grad[K * D + k] += diff;
      }
    }
    let reg = 0;
    for (let i = 0; i < K * D; i++) {
      reg += x[i] * x[i];
      grad[i] += x[i] / C;
    }
    for (let i = 0; i < grad.length; i++) grad[i] /= S;
    return (loss + reg / (2 * C)) / S;
  };
  return lbfgs(f, x0 ?? new Float64Array(K * D + K)).x;
}

// --- metrics + calibration (mirror calibrate.py / evaluate.py) ---------------------------------

export function argmaxRow(p: ArrayLike<number>): number {
  let b = 0;
  for (let i = 1; i < p.length; i++) if (p[i] > p[b]) b = i;
  return b;
}

export interface LabelMetrics {
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export function classification(y: number[], pred: number[], K: number) {
  const confusion = Array.from({ length: K }, () => new Array(K).fill(0));
  y.forEach((t, i) => confusion[t][pred[i]]++);
  const perLabel: LabelMetrics[] = [];
  for (let k = 0; k < K; k++) {
    const tp = confusion[k][k];
    const fp = confusion.reduce((a, row, t) => a + (t === k ? 0 : row[k]), 0);
    const fn = confusion[k].reduce((a, v, p) => a + (p === k ? 0 : v), 0);
    const precision = tp + fp ? tp / (tp + fp) : 0;
    const recall = tp + fn ? tp / (tp + fn) : 0;
    const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    perLabel.push({ precision, recall, f1, support: tp + fn });
  }
  const correct = y.filter((t, i) => t === pred[i]).length;
  return {
    n: y.length,
    accuracy: y.length ? correct / y.length : 0,
    macroF1: perLabel.reduce((a, m) => a + m.f1, 0) / K,
    perLabel,
    confusion,
  };
}

export function ece(probs: number[][], y: number[], bins = 15): number {
  let total = 0;
  for (let b = 0; b < bins; b++) {
    const lo = b / bins;
    const hi = (b + 1) / bins;
    let n = 0;
    let acc = 0;
    let conf = 0;
    probs.forEach((p, i) => {
      const k = argmaxRow(p);
      const c = p[k];
      if (c > lo && c <= hi) {
        n++;
        conf += c;
        if (k === y[i]) acc++;
      }
    });
    if (n) total += (n / probs.length) * Math.abs(acc / n - conf / n);
  }
  return total;
}

function nll(logits: Float64Array[], y: number[], T: number): number {
  let s = 0;
  logits.forEach((z, i) => (s -= Math.log(Math.max(1e-12, softmax(z, T)[y[i]]))));
  return s / logits.length;
}

/** Temperature minimizing val NLL, golden-section search on log T ∈ [log 0.05, log 20]. */
export function fitTemperature(logits: Float64Array[], y: number[]): number {
  let a = Math.log(0.05);
  let b = Math.log(20);
  const phi = (Math.sqrt(5) - 1) / 2;
  let c = b - phi * (b - a);
  let d = a + phi * (b - a);
  let fc = nll(logits, y, Math.exp(c));
  let fd = nll(logits, y, Math.exp(d));
  for (let i = 0; i < 80; i++) {
    if (fc < fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - phi * (b - a);
      fc = nll(logits, y, Math.exp(c));
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + phi * (b - a);
      fd = nll(logits, y, Math.exp(d));
    }
  }
  return Math.exp((a + b) / 2);
}

/** Lowest threshold with accuracy on {conf ≥ t} ≥ target (= calibrate.pick_threshold). */
export function pickThreshold(conf: number[], correct: boolean[], target: number) {
  const order = conf.map((_, i) => i).sort((i, j) => conf[j] - conf[i] || i - j);
  let hits = 0;
  let best = -1;
  let bestPrecision = 0;
  order.forEach((i, k) => {
    if (correct[i]) hits++;
    const cut = k + 1 === order.length || conf[order[k + 1]] < conf[i];
    if (cut && hits / (k + 1) >= target) {
      best = k;
      bestPrecision = hits / (k + 1);
    }
  });
  if (best < 0) return { threshold: 1 + 1e-9, coverage: 0, precision: null as number | null, reached: false };
  return { threshold: conf[order[best]], coverage: (best + 1) / conf.length, precision: bestPrecision, reached: true };
}

// --- the full recipe -----------------------------------------------------------------------------

export interface TrainInput {
  X: Float64Array[];
  y: number[];
  labels: string[];
  /** Per-example weight (e.g. label confidence). Default 1. */
  weights?: number[];
  /** Precomputed split; default stratified 70/15/15 with `seed`. */
  split?: Split[];
  seed?: number;
  cGrid?: number[];
  targetPrecision?: number;
  onProgress?: (stage: string, fraction: number) => void;
}

export interface TrainedHead {
  labels: string[];
  coef: number[][];
  intercept: number[];
  temperature: number;
  threshold: number;
}

export interface TrainReport {
  head: TrainedHead;
  C: number;
  valMacroF1ByC: Record<string, number>;
  counts: Record<Split, number>;
  split: Split[];
  test: ReturnType<typeof classification>;
  calibration: { temperature: number; valEceBefore: number; valEceAfter: number; testEceBefore: number; testEceAfter: number };
  escalation: { threshold: number; targetPrecision: number; reached: boolean; valCoverage: number; testCoverage: number; testAccuracyOnCovered: number | null };
  /** Calibrated probabilities for every example, in input order (for parity checks / error browsing). */
  probs: number[][];
  ms: { fit: number; calibrate: number };
}

export function trainStaticHead(input: TrainInput): TrainReport {
  const { X, y, labels } = input;
  const K = labels.length;
  const D = X[0]?.length ?? 0;
  if (K < 2) throw new Error("need at least 2 labels");
  const split = input.split ?? stratifiedSplit(y, input.seed ?? 42);
  const idx = (s: Split) => split.flatMap((v, i) => (v === s ? [i] : []));
  const [tr, va, te] = [idx("train"), idx("val"), idx("test")];
  if (!tr.length || !va.length) throw new Error("need examples in both train and val (add more data per label)");
  for (let k = 0; k < K; k++) if (!tr.some((i) => y[i] === k)) throw new Error(`label "${labels[k]}" has no training examples`);
  const progress = input.onProgress ?? (() => {});
  const t0 = performance.now();

  // standardize on train
  const mean = new Float64Array(D);
  const std = new Float64Array(D);
  for (const i of tr) for (let j = 0; j < D; j++) mean[j] += X[i][j] / tr.length;
  for (const i of tr) for (let j = 0; j < D; j++) std[j] += (X[i][j] - mean[j]) ** 2 / tr.length;
  for (let j = 0; j < D; j++) std[j] = Math.sqrt(std[j]) || 1;
  const standardize = (v: Float64Array) => Float64Array.from(v, (x, j) => (x - mean[j]) / std[j]);
  const Ztr = tr.map((i) => standardize(X[i]));
  const Zva = va.map((i) => standardize(X[i]));
  const ytr = tr.map((i) => y[i]);
  const yva = va.map((i) => y[i]);
  // class_weight="balanced" × sample weight; like sklearn ≥ 1.8, class frequencies are weighted
  const w = input.weights ?? y.map(() => 1);
  const classW = new Array(K).fill(0);
  tr.forEach((i) => (classW[y[i]] += w[i]));
  const totalW = classW.reduce((a, b) => a + b, 0);
  const s = tr.map((i) => w[i] * (totalW / (K * classW[y[i]])));

  const grid = input.cGrid ?? C_GRID;
  const byC: Record<string, number> = {};
  let best: { f1: number; C: number; x: Float64Array } | null = null;
  let warm: Float64Array | undefined;
  grid.forEach((C, g) => {
    const x = fitLogReg(Ztr, ytr, s, K, C, warm);
    warm = x;
    const pred = Zva.map((z) => argmaxRow(linear(x, z, K, D)));
    const f1 = classification(yva, pred, K).macroF1;
    byC[String(C)] = Math.round(f1 * 1e4) / 1e4;
    if (!best || f1 > best.f1) best = { f1, C, x };
    progress("fit", (g + 1) / grid.length);
  });
  const { C, x } = best!;
  // fold the scaler into the head: logits = coef · emb + intercept
  const coef = Array.from({ length: K }, (_, k) => Array.from({ length: D }, (_, j) => x[k * D + j] / std[j]));
  const intercept = Array.from({ length: K }, (_, k) => {
    let b = x[K * D + k];
    for (let j = 0; j < D; j++) b -= (x[k * D + j] * mean[j]) / std[j];
    return b;
  });
  const t1 = performance.now();

  const logits = X.map((v) => headLogits(v, coef, intercept));
  const T = fitTemperature(va.map((i) => logits[i]), yva);
  const probs = logits.map((z) => softmax(z, T));
  const raw = logits.map((z) => softmax(z));
  const target = input.targetPrecision ?? 0.97;
  const conf = (i: number) => Math.max(...probs[i]);
  const thr = pickThreshold(va.map(conf), va.map((i) => argmaxRow(probs[i]) === y[i]), target);
  const yte = te.map((i) => y[i]);
  const predTe = te.map((i) => argmaxRow(probs[i]));
  const covered = te.filter((i) => conf(i) >= thr.threshold);
  progress("calibrate", 1);

  return {
    head: { labels, coef, intercept, temperature: T, threshold: thr.threshold },
    C,
    valMacroF1ByC: byC,
    counts: { train: tr.length, val: va.length, test: te.length },
    split,
    test: classification(yte, predTe, K),
    calibration: {
      temperature: T,
      valEceBefore: ece(va.map((i) => raw[i]), yva),
      valEceAfter: ece(va.map((i) => probs[i]), yva),
      testEceBefore: te.length ? ece(te.map((i) => raw[i]), yte) : NaN,
      testEceAfter: te.length ? ece(te.map((i) => probs[i]), yte) : NaN,
    },
    escalation: {
      threshold: thr.threshold,
      targetPrecision: target,
      reached: thr.reached,
      valCoverage: thr.coverage,
      testCoverage: te.length ? covered.length / te.length : 0,
      testAccuracyOnCovered: covered.length ? covered.filter((i) => argmaxRow(probs[i]) === y[i]).length / covered.length : null,
    },
    probs,
    ms: { fit: t1 - t0, calibrate: performance.now() - t1 },
  };
}

function linear(x: Float64Array, z: Float64Array, K: number, D: number): Float64Array {
  const out = new Float64Array(K);
  for (let k = 0; k < K; k++) {
    let v = x[K * D + k];
    for (let j = 0; j < D; j++) v += x[k * D + j] * z[j];
    out[k] = v;
  }
  return out;
}

function headLogits(v: Float64Array, coef: number[][], intercept: number[]): Float64Array {
  const out = new Float64Array(intercept.length);
  for (let k = 0; k < out.length; k++) {
    let z = intercept[k];
    const w = coef[k];
    for (let j = 0; j < v.length; j++) z += v[j] * w[j];
    out[k] = z;
  }
  return out;
}
