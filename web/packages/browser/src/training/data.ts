import type { Options, Row, Metrics } from "./types.js";

export function random(seed: number) { let s = seed >>> 0; return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; }; }
export function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function validateOptions(o: Options) {
  for (const [name, min, max] of [["epochs", 1, 30], ["batchSize", 1, 8], ["maxTokens", 8, 256], ["seed", 0, 2147483647]] as const) {
    if (!Number.isInteger(o[name]) || o[name] < min || o[name] > max) throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  if (!(o.learningRate >= 1e-6 && o.learningRate <= 0.01) || !(o.targetPrecision > 0 && o.targetPrecision <= 1)) throw new Error("Invalid learning rate or target precision.");
  if (!/^[a-z][a-z0-9_-]{0,63}$/.test(o.task)) throw new Error("Task name must start with a letter and contain only lowercase letters, digits, _ or - (up to 64 characters).");
}
export function dataset(text: string, seed: number): { rows: Row[]; labels: string[]; train: Row[]; val: Row[]; test: Row[] } {
  if (text.length > 20_000_000) throw new Error("Dataset must be smaller than 20 MB.");
  let raw: unknown;
  try { raw = text.trim().startsWith("[") ? JSON.parse(text) : text.trim().split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l)); }
  catch { throw new Error("Use JSONL rows or a JSON array containing text and label."); }
  if (!Array.isArray(raw) || raw.length < 10 || raw.length > 10000) throw new Error("Provide 10–10,000 labeled examples.");
  const seen = new Set<string>();
  const rows: Row[] = raw.map((r, i) => {
    if (!r || typeof r.text !== "string" || !r.text.trim() || r.text.length > 20000 || typeof r.label !== "string" || !r.label.trim() || r.label.length > 100 ||
        (r.split !== undefined && !["train", "val", "test"].includes(r.split)) ||
        (r.confidence !== undefined && !(typeof r.confidence === "number" && r.confidence > 0 && r.confidence <= 1))) throw new Error(`Invalid example on row ${i + 1}.`);
    const key = r.text.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
    if (seen.has(key)) throw new Error(`Duplicate text on row ${i + 1}. Remove duplicates before splitting.`);
    seen.add(key);
    return { text: r.text, label: r.label.trim(), confidence: r.confidence ?? 1, ...(r.split ? { split: r.split } : {}) };
  });
  const labels = [...new Set(rows.map(r => r.label))].sort();
  if (labels.length < 2 || labels.length > 20) throw new Error("Use between 2 and 20 labels.");
  if (rows.some(r => r.split) && rows.some(r => !r.split)) throw new Error("Specify a split on every row, or omit it on every row.");
  if (!rows[0].split) {
    const rng = random(seed);
    for (const label of labels) {
      const group = shuffle(rows.filter(r => r.label === label), rng);
      if (group.length < 5) throw new Error(`Label '${label}' needs at least 5 examples for train/validation/test splits.`);
      const holdout = Math.max(1, Math.floor(group.length * 0.2));
      group.forEach((r, i) => { r.split = i < holdout ? "test" : i < holdout * 2 ? "val" : "train"; });
    }
  }
  const train = rows.filter(r => r.split === "train"), val = rows.filter(r => r.split === "val"), test = rows.filter(r => r.split === "test");
  for (const split of [train, val, test]) {
    if (labels.some(label => !split.some(r => r.label === label))) throw new Error("Each label must appear in train, validation, and test splits.");
  }
  return { rows, labels, train, val, test };
}
export function softmax(row: number[], temperature = 1): number[] {
  const max = Math.max(...row), values = row.map(v => Math.exp((v - max) / temperature)), sum = values.reduce((a, b) => a + b, 0);
  return values.map(v => v / sum);
}
export function metrics(logits: number[][], ys: number[], classes: number, temperature = 1, threshold = 0): Metrics {
  const probs = logits.map(r => softmax(r, temperature)), pred = probs.map(r => r.indexOf(Math.max(...r)));
  const correct = pred.filter((p, i) => p === ys[i]).length;
  let f1 = 0, covered = 0, coveredCorrect = 0;
  for (let c = 0; c < classes; c++) {
    const tp = pred.filter((p, i) => p === c && ys[i] === c).length;
    const denominator = pred.filter(p => p === c).length + ys.filter(y => y === c).length;
    f1 += denominator ? 2 * tp / denominator : 0;
  }
  probs.forEach((p, i) => { if (Math.max(...p) >= threshold) { covered++; if (pred[i] === ys[i]) coveredCorrect++; } });
  return { macroF1: f1 / classes, accuracy: correct / ys.length, count: ys.length, coverage: covered / ys.length, precision: covered ? coveredCorrect / covered : null };
}
export function calibrate(logits: number[][], ys: number[], target: number) {
  // One-dimensional bounded search on log-temperature; validation data only.
  const nll = (logT: number) => logits.reduce((sum, row, i) => sum - Math.log(Math.max(1e-30, softmax(row, Math.exp(logT))[ys[i]])), 0) / ys.length;
  let low = Math.log(0.05), high = Math.log(20);
  for (let i = 0; i < 64; i++) {
    const a = low + (high - low) / 3, b = high - (high - low) / 3;
    if (nll(a) < nll(b)) high = b; else low = a;
  }
  const temperature = Math.exp((low + high) / 2), probs = logits.map(row => softmax(row, temperature));
  let threshold = 1.000001, bestCovered = 0;
  for (const t of new Set(probs.map(p => Math.max(...p)))) {
    let n = 0, correct = 0;
    probs.forEach((p, i) => { if (Math.max(...p) >= t) { n++; if (p.indexOf(Math.max(...p)) === ys[i]) correct++; } });
    if (correct / n >= target && n > bestCovered) { threshold = t; bestCovered = n; }
  }
  return { temperature, threshold, targetReached: bestCovered > 0 };
}
