/**
 * Train a static-tier head in the browser — the same recipe as microdecide/static.py + train.py:
 * standardize (folded into the weights), class-balanced + sample-weighted multinomial logistic
 * regression with C chosen by val macro F1, temperature scaling on val, escalation threshold at a
 * target precision. Pure TS, no dependencies; ~1k examples train in about a second.
 */
import { softmax } from "./text.js";

import { type Split, stratifiedSplit } from "./training/split.js";
import { fitLogReg } from "./training/optimize.js";
import { argmaxRow, classification, ece } from "./training/metrics.js";
import { fitTemperature, pickThreshold } from "./training/calibrate.js";
export * from "./training/split.js";
export * from "./training/optimize.js";
export * from "./training/metrics.js";
export * from "./training/calibrate.js";
export const C_GRID = [0.003, 0.01, 0.03, 0.1, 0.3, 1, 3];

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
