import { type Decision, MicroDecide } from "../src";
import { fmt, url } from "./common";
import { parseExamples } from "./csv";
import type { Example, Req } from "./playground-worker";

// --- state (persisted per browser) ---------------------------------------------------------------

const STORE = "microdecide-playground-v1";
interface State {
  name: string;
  labels: string[];
  examples: Example[];
}
const state: State = load() ?? { name: "my_task", labels: ["positive", "negative"], examples: [] };
let queue: string[] = [];
let trainedLabels: string[] | null = null;
let threshold = 1;

function load(): State | null {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as State) : null;
  } catch {
    return null;
  }
}
let saveTimer = 0;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
      /* quota / private mode: keep working in memory */
    }
  }, 300);
}

// --- worker RPC ------------------------------------------------------------------------------------

type Distribute<T> = T extends unknown ? Omit<T, "id"> : never;
const worker = new Worker(new URL("./playground-worker.ts", import.meta.url), { type: "module" });
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void; onProgress?: (s: string, f: number) => void }>();
let nextId = 0;
worker.onmessage = (e) => {
  const { id, ok, result, error, progress } = e.data;
  const p = pending.get(id);
  if (!p) return;
  if (progress) return p.onProgress?.(progress.stage, progress.fraction);
  pending.delete(id);
  ok ? p.resolve(result) : p.reject(new Error(error));
};
function call<T>(msg: Distribute<Req>, onProgress?: (s: string, f: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, onProgress });
    worker.postMessage({ ...msg, id });
  });
}

// --- DOM helpers ---------------------------------------------------------------------------------------

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
const COLORS = ["#2563eb", "#9333ea", "#0891b2", "#be185d", "#4d7c0f", "#b45309", "#475569"];
const SEMANTIC: Record<string, string> = {
  ok: "#16a34a", positive: "#16a34a", true: "#16a34a", yes: "#16a34a", safe: "#16a34a",
  spam: "#d97706", neutral: "#d97706",
  toxic: "#dc2626", negative: "#dc2626", false: "#dc2626", no: "#dc2626", unsafe: "#dc2626",
};
const color = (label: string) =>
  SEMANTIC[label.toLowerCase()] ?? COLORS[Math.max(0, state.labels.filter((l) => !SEMANTIC[l.toLowerCase()]).indexOf(label)) % COLORS.length];

// --- 1 · task ------------------------------------------------------------------------------------------

function renderLabels() {
  $("labels").innerHTML = state.labels
    .map((l) => `<span class="chip" style="border-color:${color(l)}">${esc(l)}<button data-remove="${esc(l)}" title="remove">×</button></span>`)
    .join("");
  $<HTMLSelectElement>("one-label").innerHTML = state.labels.map((l) => `<option>${esc(l)}</option>`).join("");
  renderQueue();
}

function addLabel(raw: string) {
  const l = raw.trim();
  if (l && !state.labels.includes(l)) state.labels.push(l);
}

$("labels").addEventListener("click", (e) => {
  const l = (e.target as HTMLElement).dataset.remove;
  if (!l) return;
  const n = state.examples.filter((ex) => ex.label === l).length;
  if (n && !confirm(`Remove "${l}" and its ${n} examples?`)) return;
  state.labels = state.labels.filter((x) => x !== l);
  state.examples = state.examples.filter((ex) => ex.label !== l);
  persist();
  renderAll();
});
$("add-label").onclick = () => {
  addLabel($<HTMLInputElement>("new-label").value);
  $<HTMLInputElement>("new-label").value = "";
  persist();
  renderAll();
};
$<HTMLInputElement>("new-label").addEventListener("keydown", (e) => e.key === "Enter" && $("add-label").click());
$<HTMLInputElement>("name").value = state.name;
$<HTMLInputElement>("name").addEventListener("input", (e) => {
  state.name = slug((e.target as HTMLInputElement).value) || "my_task";
  persist();
});

// --- 2 · examples ----------------------------------------------------------------------------------

function addExamples(rows: { text: string; label?: string; weight?: number }[]): number {
  const seen = new Set(state.examples.map((ex) => ex.text));
  let added = 0;
  for (const r of rows) {
    if (!r.label || seen.has(r.text)) continue;
    addLabel(r.label);
    state.examples.push({ text: r.text, label: r.label, ...(r.weight !== undefined && Number.isFinite(r.weight) ? { weight: r.weight } : {}) });
    seen.add(r.text);
    added++;
  }
  if (rows.length > 1) state.labels.sort((a, b) => a.localeCompare(b)); // stable, matches Python's order
  persist();
  renderAll();
  return added;
}

function renderExamples() {
  const counts = new Map(state.labels.map((l) => [l, 0]));
  for (const ex of state.examples) counts.set(ex.label, (counts.get(ex.label) ?? 0) + 1);
  $("count").textContent = `${state.examples.length} labeled`;
  $("per-label").innerHTML = [...counts]
    .map(([l, n]) => `<span><b style="color:${color(l)}">${esc(l)}</b> ${n}${n < 5 ? " (need ≥ 5)" : ""}</span>`)
    .join(" · ");
  const recent = state.examples.slice(-8).reverse();
  $("examples").innerHTML = recent.length
    ? `<tr><th>text</th><th>label</th><th></th></tr>` +
      recent
        .map((ex) => `<tr><td class="text" title="${esc(ex.text)}">${esc(ex.text)}</td><td style="color:${color(ex.label)}">${esc(ex.label)}</td><td><button data-del="${esc(ex.text)}">×</button></td></tr>`)
        .join("") +
      (state.examples.length > 8 ? `<tr><td colspan="3" class="muted">… and ${state.examples.length - 8} more</td></tr>` : "")
    : `<tr><td class="muted">No examples yet — load the example dataset, upload a file, or add some below.</td></tr>`;
}

$("examples").addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).dataset.del;
  if (t === undefined) return;
  state.examples = state.examples.filter((ex) => ex.text !== t);
  persist();
  renderAll();
});
$("load-example").onclick = async () => {
  const text = await (await fetch(url("examples/comment_moderation.csv"))).text();
  if (state.examples.length === 0) state.labels = [];
  const added = addExamples(parseExamples(text));
  if (state.name === "my_task") {
    state.name = "comment_moderation";
    $<HTMLInputElement>("name").value = state.name;
  }
  toast(`added ${added} examples`);
};
$<HTMLInputElement>("upload").onchange = async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const rows = parseExamples(await file.text());
  const labeled = rows.filter((r) => r.label);
  toast(`added ${addExamples(labeled)} labeled examples`);
  const unlabeled = rows.filter((r) => !r.label).map((r) => r.text);
  if (unlabeled.length) startQueue(unlabeled);
};
$("toggle-paste").onclick = () => ($("paste").hidden = !$("paste").hidden);
$("import-labeled").onclick = () => {
  try {
    toast(`added ${addExamples(parseExamples($<HTMLTextAreaElement>("paste-text").value))} examples`);
  } catch (err) {
    toast(`could not parse: ${(err as Error).message}`);
  }
};
$("queue-lines").onclick = () => {
  const lines = $<HTMLTextAreaElement>("paste-text").value.split("\n").map((l) => l.trim()).filter(Boolean);
  startQueue(lines);
};
$("clear").onclick = () => {
  if (!state.examples.length || !confirm(`Delete all ${state.examples.length} examples?`)) return;
  state.examples = [];
  persist();
  renderAll();
};
$("add-one").onclick = () => {
  const t = $<HTMLInputElement>("one-text");
  if (t.value.trim()) addExamples([{ text: t.value.trim(), label: $<HTMLSelectElement>("one-label").value }]);
  t.value = "";
  t.focus();
};
$<HTMLInputElement>("one-text").addEventListener("keydown", (e) => e.key === "Enter" && $("add-one").click());

// labeling queue: one text at a time, click a label or press 1–9, s to skip
function startQueue(lines: string[]) {
  queue = lines.filter((l) => !state.examples.some((ex) => ex.text === l));
  renderQueue();
}
function renderQueue() {
  $("queue").hidden = queue.length === 0;
  if (!queue.length) return;
  $("queue-progress").textContent = `${queue.length} left to label · keys 1–${Math.min(9, state.labels.length)}, s = skip`;
  $("queue-text").textContent = queue[0];
  $("queue-buttons").innerHTML =
    state.labels.map((l, i) => `<button data-label="${esc(l)}" style="border-color:${color(l)}">${i < 9 ? `${i + 1} · ` : ""}${esc(l)}</button>`).join("") +
    `<button data-skip="1">skip</button>`;
}
function answerQueue(label: string | null) {
  const text = queue.shift();
  if (text && label) addExamples([{ text, label }]);
  else renderQueue();
}
$("queue-buttons").addEventListener("click", (e) => {
  const el = e.target as HTMLElement;
  if (el.dataset.label) answerQueue(el.dataset.label);
  else if (el.dataset.skip) answerQueue(null);
});
document.addEventListener("keydown", (e) => {
  if (!queue.length || (e.target as HTMLElement).matches("input, textarea")) return;
  const n = Number(e.key);
  if (n >= 1 && n <= Math.min(9, state.labels.length)) answerQueue(state.labels[n - 1]);
  else if (e.key === "s") answerQueue(null);
});

// --- 3 · train ------------------------------------------------------------------------------------------

interface TrainResult {
  C: number;
  valMacroF1ByC: Record<string, number>;
  counts: Record<string, number>;
  test: { n: number; accuracy: number; macroF1: number; perLabel: { precision: number; recall: number; f1: number; support: number }[]; confusion: number[][] };
  calibration: { temperature: number; testEceBefore: number; testEceAfter: number };
  escalation: { threshold: number; targetPrecision: number; reached: boolean; testCoverage: number; testAccuracyOnCovered: number | null };
  ms: { embed: number; fit: number; calibrate: number; total: number };
  predictions: { text: string; label: string; predicted: string; confidence: number; probabilities: number[] }[];
}

let loadedBase = "";
async function ensureBase() {
  const baseUrl = url($<HTMLSelectElement>("base").value);
  if (baseUrl === loadedBase) return;
  setProgress("loading embeddings", 0);
  const info = await call<{ model: string; mb: number }>({ type: "loadBase", url: baseUrl });
  loadedBase = baseUrl;
  $("train-meta").dataset.base = `${info.model} (${fmt(info.mb, 1)} MB)`;
}

function setProgress(stage: string, f: number) {
  $("progress").hidden = false;
  ($("progress").firstElementChild as HTMLElement).style.width = `${Math.round(f * 100)}%`;
  $("progress").querySelector("span")!.textContent = `${stage} ${Math.round(f * 100)}%`;
}

$("train").onclick = async () => {
  const btn = $<HTMLButtonElement>("train");
  const usable = state.labels.filter((l) => state.examples.filter((ex) => ex.label === l).length >= 5);
  if (usable.length < 2) return toast("need at least 2 labels with ≥ 5 examples each");
  btn.disabled = true;
  try {
    await ensureBase();
    const examples = state.examples.filter((ex) => usable.includes(ex.label));
    const r = await call<TrainResult>(
      {
        type: "train",
        examples,
        labels: usable,
        name: state.name,
        seed: Number($<HTMLInputElement>("seed").value) || 42,
        targetPrecision: Number($<HTMLInputElement>("target").value) || 0.97,
      },
      (stage, f) => setProgress(stage, f),
    );
    trainedLabels = usable;
    renderResults(r);
    $<HTMLButtonElement>("save").disabled = $<HTMLButtonElement>("download").disabled = false;
    (window as unknown as { __playground: object }).__playground = { MicroDecide, result: r };
    void tryIt();
  } catch (err) {
    toast(`training failed: ${(err as Error).message}`);
  } finally {
    btn.disabled = false;
    $("progress").hidden = true;
  }
};

function renderResults(r: TrainResult) {
  const labels = trainedLabels!;
  const e = r.escalation;
  threshold = e.threshold;
  $("results").hidden = false;
  const tiles: [string, string][] = [
    [fmt(r.test.macroF1, 3), "macro F1 (test)"],
    [`${fmt(r.test.accuracy * 100, 1)}%`, "accuracy (test)"],
    [`${fmt(e.testCoverage * 100, 0)}%`, `handled alone, ${e.testAccuracyOnCovered == null ? "—" : fmt(e.testAccuracyOnCovered * 100, 1) + "%"} accurate`],
    [fmt(r.calibration.testEceAfter, 3), `calibration error (was ${fmt(r.calibration.testEceBefore, 3)})`],
    [`${fmt(r.ms.total / 1000, 2)} s`, "training time"],
  ];
  $("tiles").innerHTML = tiles.map(([v, l]) => `<tr><td>${l}</td><td class="num"><b>${v}</b></td></tr>`).join("");
  $("per-label-table").innerHTML =
    `<tr><th>label</th><th class="num">precision</th><th class="num">recall</th><th class="num">F1</th><th class="num">n</th></tr>` +
    r.test.perLabel
      .map((m, k) => `<tr><td style="color:${color(labels[k])}">${esc(labels[k])}</td><td class="num">${fmt(m.precision, 3)}</td><td class="num">${fmt(m.recall, 3)}</td><td class="num">${fmt(m.f1, 3)}</td><td class="num">${m.support}</td></tr>`)
      .join("");
  $("confusion").innerHTML =
    `<tr><th></th>${labels.map((l) => `<th class="num">${esc(l)}</th>`).join("")}</tr>` +
    r.test.confusion.map((row, k) => `<tr><th>${esc(labels[k])}</th>${row.map((v, j) => `<td class="num"${j === k ? ' style="font-weight:600"' : ""}>${v}</td>`).join("")}</tr>`).join("");
  const wrong = r.predictions.filter((p) => p.predicted !== p.label).sort((a, b) => b.confidence - a.confidence).slice(0, 8);
  $("errors").innerHTML = wrong.length
    ? `<tr><th class="num">conf</th><th>true → predicted</th><th>text</th></tr>` +
      wrong.map((p) => `<tr><td class="num">${fmt(p.confidence, 2)}</td><td>${esc(p.label)} → ${esc(p.predicted)}</td><td class="text" title="${esc(p.text)}">${esc(p.text)}</td></tr>`).join("")
    : `<tr><td class="muted">No mistakes on the test split.</td></tr>`;
  $("train-meta").textContent =
    `${$("train-meta").dataset.base ?? ""} · train/val/test ${r.counts.train}/${r.counts.val}/${r.counts.test} · C=${r.C} · temperature ${fmt(r.calibration.temperature, 2)} · ` +
    `threshold ${fmt(e.threshold, 3)} for ${fmt(e.targetPrecision * 100, 0)}% precision${e.reached ? "" : " (not reached on val)"} · ` +
    `embed ${fmt(r.ms.embed, 0)} ms, fit ${fmt(r.ms.fit, 0)} ms, calibrate ${fmt(r.ms.calibrate, 0)} ms`;
}

// --- 4 · try it -------------------------------------------------------------------------------------------

let trySeq = 0;
async function tryIt() {
  if (!trainedLabels) return;
  const text = $<HTMLTextAreaElement>("try").value;
  const mine = ++trySeq;
  const d = await call<Decision>({ type: "predict", text });
  if (mine !== trySeq) return;
  $("try-result").hidden = false;
  $("try-empty").hidden = true;
  const pct = (x: number) => `${fmt(x * 100, 1)}%`;
  $("try-esc").innerHTML =
    d.confidence >= threshold
      ? `<b>${esc(d.label)}</b> with ${pct(d.confidence)} confidence, handled in the browser.`
      : `<b>${esc(d.label)}</b> with ${pct(d.confidence)} confidence, <span class="esc">below the calibrated threshold of ${pct(threshold)}</span>: this one would go to the teacher.`;
  $("try-bars").innerHTML = Object.entries(d.probabilities)
    .map(
      ([k, p]) =>
        `<tr${k === d.label ? ' class="best"' : ""}><td>${esc(k)}</td><td class="num">${fmt(p * 100, 1)}%</td><td><span class="bar" style="width:calc(${p.toFixed(4)} * min(200px, 30vw))"></span></td></tr>`,
    )
    .join("");
}
$("try").addEventListener("input", () => void tryIt());

// --- 5 · use it --------------------------------------------------------------------------------------------

$("save").onclick = async () => {
  const target = url(`playground-models/${state.name}`);
  const { url: saved, bytes } = await call<{ url: string; bytes: number }>({ type: "save", name: state.name, url: target });
  $("save-status").innerHTML = `saved ${fmt(bytes / 1e6, 1)} MB · <a href="./index.html?model=${encodeURIComponent(saved)}">open in demo</a>`;
  $("snippet").hidden = false;
  $("snippet").textContent = `import { MicroDecide } from "microdecide-web";\n\n// same origin, this browser (Cache API) — works offline\nconst m = await MicroDecide.load("${saved}");\nconst d = await m.decide("some text");`;
  (window as unknown as { __playground: { saved?: string } }).__playground.saved = saved;
};
$("download").onclick = async () => {
  const bytes = await call<Uint8Array>({ type: "zip", name: state.name });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/zip" }));
  a.download = `${state.name}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  $("save-status").textContent = `downloaded ${state.name}.zip — unzip next to your app and MicroDecide.load("/path/${state.name}")`;
};

// --- misc ----------------------------------------------------------------------------------------------------

function toast(msg: string) {
  $("ex-status").textContent = msg;
}

function renderAll() {
  renderLabels();
  renderExamples();
}
renderAll();
if ("serviceWorker" in navigator && !import.meta.env.DEV) void navigator.serviceWorker.register(url("sw.js"));
