import type { Backend, Device, ModelConfig } from "../src";

export const params = new URLSearchParams(location.search);
export const MODEL_URL = params.get("model") ?? "/models/comment_moderation/v1";

export interface ModelEntry {
  id: string;
  path: string;
  tier: ModelConfig["tier"];
  base: string;
  downloadMB: number;
}

export async function modelIndex(): Promise<ModelEntry[]> {
  try {
    return await (await fetch("/models/index.json")).json();
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
export async function modelTier(url = MODEL_URL): Promise<ModelConfig["tier"]> {
  const file = new URL(`${url.replace(/\/+$/, "")}/microdecide.json`, location.href).href;
  const hit = typeof caches !== "undefined" ? await (await caches.open("microdecide-models-v1")).match(file) : undefined;
  return (await (hit ?? (await fetch(file))).json()).tier;
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

export async function parityRows(): Promise<ParityRow[]> {
  const res = await fetch(`${MODEL_URL}/parity.jsonl`);
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
