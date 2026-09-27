import { MicroDecide, clearModelCache } from "../src";
import { CONFIGS, MODEL_URL, fmt, parityRows, percentile, webgpuAvailable } from "./common";

const N_SINGLE = 200;

interface BenchResult {
  name: string;
  device?: string;
  coldLoadMs?: number;
  warmLoadMs?: number;
  modelMB?: number;
  p50Ms?: number;
  p95Ms?: number;
  engineP50Ms?: number;
  batchMsPerInput?: number;
  memoryMB?: number | null;
  error?: string;
}

async function memoryMB(): Promise<number | null> {
  const perf = performance as Performance & { measureUserAgentSpecificMemory?: () => Promise<{ bytes: number }> };
  if (!perf.measureUserAgentSpecificMemory || !crossOriginIsolated) return null;
  try {
    return (await perf.measureUserAgentSpecificMemory()).bytes / 1e6;
  } catch {
    return null;
  }
}

async function bench(cfg: (typeof CONFIGS)[number], texts: string[]): Promise<BenchResult> {
  await clearModelCache();
  const opts = { backend: cfg.backend, device: cfg.device };
  const cold = await MicroDecide.load(MODEL_URL, opts);
  cold.dispose();
  const m = await MicroDecide.load(MODEL_URL, opts); // warm: model files from the Cache API
  await m.decide(texts[0]);
  const wall: number[] = [];
  const engine: number[] = [];
  for (const t of texts.slice(0, N_SINGLE)) {
    const t0 = performance.now();
    const d = await m.decide(t);
    wall.push(performance.now() - t0);
    engine.push(d.latency_ms);
  }
  const t0 = performance.now();
  await m.decideBatch(texts);
  const batch = (performance.now() - t0) / texts.length;
  const mem = await memoryMB();
  m.dispose();
  return {
    name: cfg.name,
    device: m.info.device,
    coldLoadMs: cold.info.loadMs,
    warmLoadMs: m.info.loadMs,
    modelMB: m.info.downloadBytes / 1e6,
    p50Ms: percentile(wall, 0.5),
    p95Ms: percentile(wall, 0.95),
    engineP50Ms: percentile(engine, 0.5),
    batchMsPerInput: batch,
    memoryMB: mem,
  };
}

async function main() {
  const texts = (await parityRows()).map((r) => r.text);
  const gpu = await webgpuAvailable();
  const results: BenchResult[] = [];
  for (const cfg of CONFIGS) {
    if (cfg.device === "webgpu" && !gpu) {
      results.push({ name: cfg.name, error: "WebGPU not available" });
      continue;
    }
    try {
      results.push(await bench(cfg, texts));
    } catch (err) {
      results.push({ name: cfg.name, error: err instanceof Error ? err.message : String(err) });
    }
    render(results);
  }
  render(results);
  document.getElementById("sub")!.textContent =
    `${MODEL_URL} · ${texts.length} test inputs · crossOriginIsolated=${crossOriginIsolated} · WebGPU=${gpu} · ${navigator.userAgent}`;
  (window as unknown as { __result: unknown }).__result = { results, webgpu: gpu, crossOriginIsolated, userAgent: navigator.userAgent };
}

function render(rs: BenchResult[]) {
  const head = "<tr><th>backend</th><th>cold load</th><th>warm load</th><th>model</th><th>p50</th><th>p95</th><th>engine p50</th><th>batch/input</th><th>memory</th></tr>";
  document.getElementById("table")!.innerHTML =
    head +
    rs
      .map((r) =>
        r.error
          ? `<tr><td>${r.name}</td><td colspan="8" class="meta">${r.error}</td></tr>`
          : `<tr><td>${r.name}</td><td>${fmt(r.coldLoadMs!, 0)} ms</td><td>${fmt(r.warmLoadMs!, 0)} ms</td><td>${fmt(r.modelMB!, 1)} MB</td><td>${fmt(r.p50Ms!)} ms</td><td>${fmt(r.p95Ms!)} ms</td><td>${fmt(r.engineP50Ms!, 3)} ms</td><td>${fmt(r.batchMsPerInput!, 3)} ms</td><td>${r.memoryMB == null ? "—" : fmt(r.memoryMB, 0) + " MB"}</td></tr>`,
      )
      .join("");
}

void main();
