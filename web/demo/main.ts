import { type Decision, MicroDecide } from "../src";
import { CONFIGS, MODEL_URL, fmt, modelIndex, modelTier } from "./common";

const COLORS: Record<string, string> = { ok: "var(--ok)", spam: "var(--spam)", toxic: "var(--toxic)" };
const EXAMPLES = [
  "Does the new export feature support CSV?",
  "Buy 10,000 real followers for $9.99 at fastfollowz dot example",
  "The devs who shipped this are brain-dead clowns.",
  "This update is terrible, sync is broken again.",
  "Great post! Check my profile for more tips 😉",
  "hi",
];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const text = $<HTMLTextAreaElement>("text");
const status = $("status");
let model: MicroDecide | null = null;
let seq = 0;

for (const ex of EXAMPLES) {
  const b = document.createElement("button");
  b.textContent = ex;
  b.onclick = () => {
    text.value = ex;
    void run();
  };
  $("examples").append(b);
}

const modelSel = $<HTMLSelectElement>("model");
const backendSel = $<HTMLSelectElement>("backend");

async function setupModels() {
  const models = await modelIndex();
  const entries = models.length ? models : [{ id: MODEL_URL, path: MODEL_URL, tier: await modelTier(), base: "", downloadMB: NaN }];
  modelSel.innerHTML = entries
    .map((m) => `<option value="${m.path}">${m.id} · ${m.tier}${Number.isFinite(m.downloadMB) ? ` · ${fmt(m.downloadMB, 1)} MB` : ""}</option>`)
    .join("");
  modelSel.value = entries.some((m) => m.path === MODEL_URL) ? MODEL_URL : entries[0].path;
  await setupBackends();
}

async function setupBackends() {
  const tier = await modelTier(modelSel.value);
  backendSel.innerHTML = CONFIGS[tier].map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
  for (const id of ["bench-link", "parity-link"]) {
    const a = $<HTMLAnchorElement>(id);
    a.href = `${a.href.split("?")[0]}?model=${encodeURIComponent(modelSel.value)}`;
  }
}

async function load() {
  const tier = await modelTier(modelSel.value);
  const cfg = CONFIGS[tier][Number(backendSel.value) || 0];
  status.textContent = "loading…";
  model?.dispose();
  model = null;
  try {
    model = await MicroDecide.load(modelSel.value, { backend: cfg.backend, device: cfg.device, dtype: cfg.dtype });
    const i = model.info;
    status.textContent = `${i.model} · ${i.tier} · ${i.backend}/${i.device}${cfg.dtype ? "/" + cfg.dtype : ""} · loaded in ${fmt(i.loadMs, 0)} ms · ${fmt(i.downloadBytes / 1e6, 1)} MB`;
    await run();
  } catch (err) {
    status.textContent = `failed: ${err instanceof Error ? err.message : err}`;
  }
}

async function run() {
  if (!model) return;
  const mine = ++seq;
  const d = await model.decide(text.value);
  if (mine === seq) render(d, model);
}

function render(d: Decision, m: MicroDecide) {
  $("result").hidden = false;
  const label = $("label");
  label.textContent = d.label;
  label.style.color = COLORS[d.label] ?? "var(--fg)";
  const esc = $("esc");
  const confident = m.isConfident(d);
  esc.textContent = confident
    ? `confident (${fmt(d.confidence * 100, 1)}%)`
    : `would escalate (${fmt(d.confidence * 100, 1)}% < ${fmt(m.info.threshold * 100, 1)}%)`;
  esc.className = confident ? "badge" : "badge esc";
  $("bars").innerHTML = Object.entries(d.probabilities)
    .map(
      ([k, p]) => `<div class="bar"><span>${k}</span><div class="track"><div class="fill" style="width:${(p * 100).toFixed(1)}%;background:${COLORS[k] ?? "var(--accent)"}"></div></div><span>${fmt(p * 100, 1)}%</span></div>`,
    )
    .join("");
  $("lat").textContent = `inference ${fmt(d.latency_ms, 2)} ms · model ${d.model} · source ${d.source}`;
  (window as unknown as { __last: Decision }).__last = d;
}

text.addEventListener("input", () => void run());
backendSel.addEventListener("change", () => void load());
modelSel.addEventListener("change", async () => {
  await setupBackends();
  await load();
});
void setupModels().then(load);

if ("serviceWorker" in navigator && !import.meta.env.DEV) void navigator.serviceWorker.register("/sw.js");
