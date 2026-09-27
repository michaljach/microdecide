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

