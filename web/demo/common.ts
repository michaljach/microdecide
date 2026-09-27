import type { Backend, Device, ModelConfig } from "../src";

/** Site root ("/" locally, "/microdecide/" on GitHub Pages). Every asset URL goes through url(). */
export const BASE = import.meta.env.BASE_URL;
export const url = (path: string) => BASE + path.replace(/^\/+/, "");
export const ORT_WASM = url("ort/");

export const params = new URLSearchParams(location.search);
export const MODEL_URL = params.get("model") ?? url("models/comment_moderation/v2");

export interface ModelEntry {
  id: string;
  path: string;
  tier: ModelConfig["tier"];
  base: string;
  downloadMB: number;
}

export async function modelIndex(): Promise<ModelEntry[]> {
  try {
    const entries: ModelEntry[] = await (await fetch(url("models/index.json"))).json();
    return entries.map((e) => ({ ...e, path: url(e.path) }));
  } catch {
    return [];
  }
}

export interface Config {
  name: string;
  backend: Backend;
  device?: Device;
  dtype?: "q8" | "fp32";
  /** compared against parity.jsonl (the exported artifact's Python predictions) */
  parity: boolean;
}

export const CONFIGS: Record<ModelConfig["tier"], Config[]> = {
  static: [
    { name: "static (plain JS)", backend: "static", parity: true },
    { name: "onnx · wasm", backend: "onnx", device: "wasm", parity: true },
    { name: "onnx · webgpu", backend: "onnx", device: "webgpu", parity: true },
  ],
  encoder: [
    { name: "transformers.js · wasm · q8", backend: "onnx", device: "wasm", dtype: "q8", parity: true },
    { name: "transformers.js · webgpu · q8", backend: "onnx", device: "webgpu", dtype: "q8", parity: true },
    { name: "transformers.js · webgpu · fp32", backend: "onnx", device: "webgpu", dtype: "fp32", parity: false },
  ],
};

/** Reads microdecide.json via the library's model cache first (playground models live only there). */
export async function modelConfig(model = MODEL_URL): Promise<ModelConfig> {
  const file = new URL(`${model.replace(/\/+$/, "")}/microdecide.json`, location.href).href;
  const hit = typeof caches !== "undefined" ? await (await caches.open("microdecide-models-v1")).match(file) : undefined;
  return (await (hit ?? (await fetch(file))).json()) as ModelConfig;
}

export async function modelTier(model = MODEL_URL): Promise<ModelConfig["tier"]> {
  return (await modelConfig(model)).tier;
}

/** Backend configs for a model, minus ones whose files aren't deployed (e.g. the fp32 encoder). */
export async function configsFor(model = MODEL_URL): Promise<Config[]> {
  const cfg = await modelConfig(model);
  return CONFIGS[cfg.tier].filter((c) => c.dtype !== "fp32" || (cfg.tier !== "static" && !!cfg.onnx.fp32_file));
}

/** Vendor/architecture of the WebGPU adapter (tells a real GPU from a software fallback). */
export async function gpuAdapterInfo(): Promise<Record<string, string> | null> {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<{ info?: Record<string, string> } | null> } }).gpu;
  try {
    const info = (await gpu?.requestAdapter())?.info;
    return info ? { vendor: info.vendor, architecture: info.architecture, device: info.device, description: info.description } : null;
  } catch {
    return null;
  }
}

export async function webgpuAvailable(): Promise<boolean> {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
  try {
    return !!gpu && (await gpu.requestAdapter()) != null;
  } catch {
    return false;
  }
}

export interface ParityRow {
  text: string;
  label: string;
  probabilities: Record<string, number>;
}

export async function parityRows(model = MODEL_URL): Promise<ParityRow[]> {
  const res = await fetch(`${model}/parity.jsonl`);
  return (await res.text())
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
}

export function percentile(xs: number[], q: number): number {
  const s = [...xs].sort((a, b) => a - b);
  const i = (s.length - 1) * q;
  const lo = Math.floor(i);
  return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo);
}

export const fmt = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : "—");
