// The model catalog written by scripts/sync-model.mjs (public/models/index.json).

export interface LabelMetrics {
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export interface ModelEntry {
  id: string;
  task: string;
  version: string;
  url: string;
  description: string;
  labels: Record<string, string>;
  tier: string;
  base: string;
  threshold: number;
  created: string;
  data: { train: number; val: number; test: number };
  sizeMB: number | null;
  metrics: {
    macroF1: number;
    accuracy: number;
    testN: number;
    perLabel: Record<string, LabelMetrics>;
    coverage: number;
    accuracyOnCovered: number | null;
    targetPrecision: number;
    eceBefore: number;
    eceAfter: number;
  } | null;
  examples: string[];
}

export async function loadCatalog(): Promise<ModelEntry[]> {
  const res = await fetch("/models/index.json");
  if (!res.ok) throw new Error("no model catalog — run `npm run sync-model`");
  return ((await res.json()) as { models: ModelEntry[] }).models;
}

/** support_triage → Support triage */
export const title = (task: string) => task.charAt(0).toUpperCase() + task.slice(1).replaceAll("_", " ");

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const pct = (x: number | null | undefined, d = 1) => (x == null ? "—" : `${(x * 100).toFixed(d)}%`);

export const modelPage = (m: ModelEntry) => `./model.html?model=${encodeURIComponent(m.url)}`;
