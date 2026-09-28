/** Slice by Unicode code point, like Python's str[:n] (JS .slice counts UTF-16 units). */
export function sliceCodePoints(text: string, n: number): string {
  let units = 0;
  let count = 0;
  for (const ch of text) {
    if (count === n) return text.slice(0, units);
    units += ch.length;
    count++;
  }
  return text;
}

export function softmax(logits: ArrayLike<number>, temperature = 1): number[] {
  let max = -Infinity;
  for (let i = 0; i < logits.length; i++) max = Math.max(max, logits[i] / temperature);
  const e = Array.from(logits, (z) => Math.exp(z / temperature - max));
  const sum = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / sum);
}

export function argmax(xs: ArrayLike<number>): number {
  let best = 0;
  for (let i = 1; i < xs.length; i++) if (xs[i] > xs[best]) best = i;
  return best;
}
