import { type Decision, MicroDecide } from "../src";
import { MODEL_URL, fmt } from "./common";

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

async function load() {
  const [backend, device] = $<HTMLSelectElement>("backend").value.split(":");
  status.textContent = "loading…";
  model?.dispose();
  model = null;
  try {
    model = await MicroDecide.load(MODEL_URL, { backend: backend as "static" | "onnx", device: device as "wasm" | "webgpu" | undefined });
    const i = model.info;
    status.textContent = `${i.model} · ${i.backend}/${i.device} · loaded in ${fmt(i.loadMs, 0)} ms · ${fmt(i.downloadBytes / 1e6, 1)} MB`;
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
$("backend").addEventListener("change", () => void load());
void load();

if ("serviceWorker" in navigator && !import.meta.env.DEV) void navigator.serviceWorker.register("/sw.js");
