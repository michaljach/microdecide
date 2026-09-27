import { type BenchResult, benchTable, runBench } from "./bench";
import { esc, loadCatalog, modelPage, title } from "./catalog";
import { MODEL_URL, fmt } from "./common";
import { paritySummary, parityTable, runParity } from "./parity";
import { mountPlayground } from "./playground";

const EXAMPLES = [
  "Does the new export feature support CSV?",
  "Buy 10,000 real followers for $9.99 at fastfollowz dot example",
  "The devs who shipped this are brain-dead clowns.",
  "This update is terrible, sync is broken again.",
  "Great post! Check my profile for more tips 😉",
  "hi",
];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

mountPlayground(MODEL_URL, EXAMPLES);

// Link the other models in the catalog (latest version of each task).
void loadCatalog()
  .then((models) => {
    const seen = new Set<string>();
    const links = models
      .filter((m) => m.url !== MODEL_URL && !seen.has(m.task) && seen.add(m.task))
      .map((m) => `<a href="${modelPage(m)}">${esc(title(m.task).toLowerCase())}</a>`);
    if (links.length) $("more").innerHTML = `${links.join(", ")} · <a href="./models.html">all models</a>`;
  })
  .catch(() => {});

// Benchmark: show the recorded headless-Chromium run (if the export has one), or run it here.
async function showRecordedBench() {
  try {
    const res = await fetch(`${MODEL_URL}/bench.json`);
    if (!res.ok) throw new Error();
    const r = (await res.json()) as { results: BenchResult[]; date?: string; crossOriginIsolated?: boolean };
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
      const r = await runBench((rs) => ($("bench-table").innerHTML = benchTable(rs)));
      $("bench-sub").textContent = `This browser · ${r.n} test inputs · crossOriginIsolated=${r.crossOriginIsolated} · WebGPU=${r.webgpu}`;
    } catch (err) {
      $("bench-sub").textContent = `failed: ${err instanceof Error ? err.message : err}`;
    }
  });

$<HTMLButtonElement>("parity-run").onclick = (e) =>
  busy(e.currentTarget as HTMLButtonElement, "Checking…", async () => {
    $("parity-sub").textContent = "Checking…";
    try {
      const r = await runParity();
      $("parity-sub").innerHTML = paritySummary(r);
      $("parity-table").innerHTML = parityTable(r.results);
    } catch (err) {
      $("parity-sub").textContent = `failed: ${err instanceof Error ? err.message : err}`;
    }
  });

if ("serviceWorker" in navigator && !import.meta.env.DEV) void navigator.serviceWorker.register("/sw.js");
