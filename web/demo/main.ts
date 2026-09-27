import { type BenchResult, benchTable, runBench } from "./bench";
import { esc, loadCatalog } from "./catalog";
import { MODEL_URL, fmt, modelIndex, modelTier, url } from "./common";
import { mountClassifier } from "./classify";
import { paritySummary, parityTable, runParity } from "./parity";

// hand-picked inputs for the comment moderation demo; other models use their catalog examples
const EXAMPLES = [
  "Does the new export feature support CSV?",
  "Buy 10,000 real followers for $9.99 at fastfollowz dot example",
  "The devs who shipped this are brain-dead clowns.",
  "This update is terrible, sync is broken again.",
  "Great post! Check my profile for more tips 😉",
  "hi",
];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const modelSel = $<HTMLSelectElement>("model");
const entries = await modelIndex();
const catalog = await loadCatalog();
if (!entries.some((m) => m.path === MODEL_URL)) {
  // e.g. a model saved from the training playground, served from the Cache API
  entries.unshift({ id: MODEL_URL.split("/").pop()!, path: MODEL_URL, tier: await modelTier().catch(() => "static" as const), base: "", downloadMB: NaN });
}
modelSel.innerHTML = entries
  .map((m) => `<option value="${esc(m.path)}">${esc(m.id)} · ${m.tier}${Number.isFinite(m.downloadMB) ? ` · ${fmt(m.downloadMB, 1)} MB` : ""}</option>`)
  .join("");
modelSel.value = MODEL_URL;
const selected = () => modelSel.value;

function examplesFor(model: string): string[] {
  const c = catalog.find((m) => m.path === model);
  return c?.task === "comment_moderation" ? EXAMPLES : (c?.examples ?? []);
}

function describe(model: string) {
  const c = catalog.find((m) => m.path === model);
  $("demo-desc").innerHTML = c
    ? `${esc(c.description)} Labels: ${Object.keys(c.labels).map((l) => `<code>${esc(l)}</code>`).join(", ")}.`
    : "";
}

const classifier = mountClassifier(selected(), examplesFor(selected()));
describe(selected());
modelSel.addEventListener("change", () => {
  describe(selected());
  void classifier.setModel(selected(), examplesFor(selected()));
  void showRecordedBench();
  $("parity-sub").textContent = "";
  $("parity-table").innerHTML = "";
});

// Benchmark: show the recorded headless-Chromium run (if the export has one), or run it here.
async function showRecordedBench() {
  $("bench-table").innerHTML = "";
  try {
    const res = await fetch(`${selected()}/bench.json`);
    if (!res.ok) throw new Error();
    const r = (await res.json()) as { results: BenchResult[]; date?: string };
    $("bench-table").innerHTML = benchTable(r.results);
    $("bench-sub").textContent = `Recorded in headless Chromium${r.date ? ` on ${r.date.slice(0, 10)}` : ""}. Run it to measure your own browser.`;
  } catch {
    $("bench-sub").textContent = "No recorded run for this model yet.";
  }
}
void showRecordedBench();

async function busy(btn: HTMLButtonElement, label: string, work: () => Promise<void>) {
  const idle = btn.textContent;
  btn.disabled = true;
  btn.textContent = label;
  try {
    await work();
  } finally {
    btn.disabled = false;
    btn.textContent = idle;
  }
}

$<HTMLButtonElement>("bench-run").onclick = (e) =>
  busy(e.currentTarget as HTMLButtonElement, "Running…", async () => {
    $("bench-sub").textContent = "Running in this browser. The model is re-downloaded for each cold load.";
    try {
      const r = await runBench(selected(), (rs) => ($("bench-table").innerHTML = benchTable(rs)));
      $("bench-sub").textContent = `This browser · ${r.n} test inputs · crossOriginIsolated=${r.crossOriginIsolated} · WebGPU=${r.webgpu}`;
    } catch (err) {
      $("bench-sub").textContent = `failed: ${err instanceof Error ? err.message : err}`;
    }
  });

$<HTMLButtonElement>("parity-run").onclick = (e) =>
  busy(e.currentTarget as HTMLButtonElement, "Checking…", async () => {
    $("parity-sub").textContent = "Checking…";
    try {
      const r = await runParity(selected());
      $("parity-sub").innerHTML = paritySummary(r);
      $("parity-table").innerHTML = parityTable(r.results);
    } catch (err) {
      $("parity-sub").textContent = `failed: ${err instanceof Error ? err.message : err}`;
    }
  });

for (const id of ["bench-page", "parity-page"]) {
  $<HTMLAnchorElement>(id).onclick = (e) => {
    const a = e.currentTarget as HTMLAnchorElement;
    a.href = `${a.href.split("?")[0]}?model=${encodeURIComponent(selected())}`;
  };
}

if ("serviceWorker" in navigator && !import.meta.env.DEV) void navigator.serviceWorker.register(url("sw.js"));
