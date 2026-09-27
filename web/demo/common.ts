import type { Backend, Device } from "../src";

export const MODEL_URL = new URLSearchParams(location.search).get("model") ?? "/models/comment_moderation/v1";

export interface Config {
  name: string;
  backend: Backend;
  device?: Device;
}

export const CONFIGS: Config[] = [
  { name: "static (plain JS)", backend: "static" },
  { name: "onnx · wasm", backend: "onnx", device: "wasm" },
  { name: "onnx · webgpu", backend: "onnx", device: "webgpu" },
];

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
