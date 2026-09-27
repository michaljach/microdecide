export type Split = "train" | "val" | "test";



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

