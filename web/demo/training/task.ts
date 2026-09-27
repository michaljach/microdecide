import { useEffect, useState } from "react";
import type { Example } from "./protocol";

const STORE = "microdecide-playground-v1";
export interface Task {
  name: string;
  labels: string[];
  examples: Example[];
}
export type Row = { text: string; label?: string; weight?: number };

function loadTask(): Task {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return JSON.parse(raw) as Task;
  } catch {
    /* private mode / blocked storage */
  }
  return { name: "my_task", labels: ["positive", "negative"], examples: [] };
}

/** Add labeled rows (skipping duplicates); returns the new task and how many were added. */
export function withExamples(t: Task, rows: Row[]): [Task, number] {
  const seen = new Set(t.examples.map((ex) => ex.text));
  const labels = [...t.labels];
  const examples = [...t.examples];
  let added = 0;
  for (const r of rows) {
    if (!r.label || seen.has(r.text)) continue;
    if (!labels.includes(r.label)) labels.push(r.label);
    examples.push({ text: r.text, label: r.label, ...(r.weight !== undefined && Number.isFinite(r.weight) ? { weight: r.weight } : {}) });
    seen.add(r.text);
    added++;
  }
  if (rows.length > 1) labels.sort((a, b) => a.localeCompare(b)); // stable display order
  return [{ ...t, labels, examples }, added];
}

export const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");

export function useTask() {
  const [task, setTask] = useState<Task>(loadTask);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORE, JSON.stringify(task));
      } catch {
        /* quota / private mode: keep working in memory */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [task]);

  return [task, setTask] as const;
}
