import { softmax } from "../text.js";
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

