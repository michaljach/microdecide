/** L-BFGS and weighted multinomial logistic regression. */
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

