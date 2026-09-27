// Catalog entries from models/index.json (written by scripts/sync-model.mjs) with the card fields
// the Models and model pages show.
import { type ModelEntry, modelIndex } from "./common";

export interface LabelMetrics {
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export interface CatalogEntry extends ModelEntry {
  task: string;
  version: string;
  description: string;
  labels: Record<string, string>;
  threshold: number;
  created: string;
  data: { train: number; val: number; test: number };
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

export async function loadCatalog(): Promise<CatalogEntry[]> {
  return (await modelIndex()).filter((m): m is CatalogEntry => "task" in m && "labels" in m);
}

/** support_triage → Support triage */
export const title = (task: string) => task.charAt(0).toUpperCase() + task.slice(1).replaceAll("_", " ");

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const pct = (x: number | null | undefined, d = 1) => (x == null ? "—" : `${(x * 100).toFixed(d)}%`);

export const modelPage = (m: ModelEntry) => `./model.html?model=${encodeURIComponent(m.path)}`;
