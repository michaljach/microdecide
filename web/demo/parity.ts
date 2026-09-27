import { MicroDecide } from "../src";
import { MODEL_URL, ORT_WASM, configsFor, fmt, modelTier, parityRows, webgpuAvailable } from "./common";

const MIN_AGREEMENT = 0.995;

interface ParityResult {
  name: string;
  device?: string;
  agreement?: number;
  maxProbDiff?: number;
  pass?: boolean;
  skipped?: string;
}

async function main() {
  const rows = await parityRows();
  const gpu = await webgpuAvailable();
  const tier = await modelTier();
  const results: ParityResult[] = [];
  for (const cfg of await configsFor()) {
    if (!cfg.parity) continue;
    if (cfg.device === "webgpu" && !gpu) {
      results.push({ name: cfg.name, skipped: "WebGPU not available" });
      continue;
    }
    const m = await MicroDecide.load(MODEL_URL, { backend: cfg.backend, device: cfg.device, dtype: cfg.dtype, ortWasmPaths: ORT_WASM });
    const ds = await m.decideBatch(rows.map((r) => r.text));
    let same = 0;
    let maxDiff = 0;
    ds.forEach((d, i) => {
      if (d.label === rows[i].label) same++;
      for (const [k, v] of Object.entries(rows[i].probabilities)) maxDiff = Math.max(maxDiff, Math.abs(v - d.probabilities[k]));
    });
    const agreement = same / rows.length;
    results.push({ name: cfg.name, device: m.info.device, agreement, maxProbDiff: maxDiff, pass: agreement >= MIN_AGREEMENT });
    m.dispose();
  }
  const pass = results.every((r) => r.skipped || r.pass);
  document.getElementById("sub")!.innerHTML =
    `${rows.length} test inputs vs Python · target ≥ ${MIN_AGREEMENT * 100}% · <b class="${pass ? "pass" : "fail"}">${pass ? "PASS" : "FAIL"}</b>`;
  document.getElementById("table")!.innerHTML =
    "<tr><th>backend</th><th>device</th><th>label agreement</th><th>max |Δp|</th><th></th></tr>" +
    results
      .map((r) =>
        r.skipped
          ? `<tr><td>${r.name}</td><td colspan="4" class="meta">${r.skipped}</td></tr>`
          : `<tr><td>${r.name}</td><td>${r.device}</td><td>${fmt(r.agreement! * 100, 2)}%</td><td>${r.maxProbDiff!.toExponential(2)}</td><td class="${r.pass ? "pass" : "fail"}">${r.pass ? "✓" : "✗"}</td></tr>`,
      )
      .join("");
  (window as unknown as { __result: unknown }).__result = { model: MODEL_URL, tier, n: rows.length, results, pass, webgpu: gpu };
}

void main();
