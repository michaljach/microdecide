import { type Decision, MicroDecide } from "../src";
import { fmt } from "./common";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/** Wire the playground markup (#backend, #status, #text, #examples, #result, #probs, #verdict, #lat). */
export function mountPlayground(modelUrl: string, examples: string[]) {
  const text = $<HTMLTextAreaElement>("text");
  const status = $("status");
  let model: MicroDecide | null = null;
  let seq = 0;

  if (!text.value && examples.length) text.value = examples[0];
  for (const ex of examples) {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = ex;
    a.onclick = (e) => {
      e.preventDefault();
      text.value = ex;
      void run();
    };
    const li = document.createElement("li");
    li.append(a);
    $("examples").append(li);
  }

  async function load() {
    const [backend, device] = $<HTMLSelectElement>("backend").value.split(":");
    status.textContent = "loading…";
    model?.dispose();
    model = null;
    try {
      model = await MicroDecide.load(modelUrl, { backend: backend as "static" | "onnx", device: device as "wasm" | "webgpu" | undefined });
      const i = model.info;
      status.textContent = `${i.model} · ${i.backend}/${i.device} · ${fmt(i.downloadBytes / 1e6, 1)} MB · loaded in ${fmt(i.loadMs, 0)} ms`;
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
    $("probs").innerHTML = Object.entries(d.probabilities)
      .map(
        ([k, p]) =>
          `<tr${k === d.label ? ' class="best"' : ""}><td>${k}</td><td class="num">${fmt(p * 100, 1)}%</td><td><span class="bar" style="width:calc(${p.toFixed(4)} * min(200px, 30vw))"></span></td></tr>`,
      )
      .join("");
    const pct = (x: number) => `${fmt(x * 100, 1)}%`;
    $("verdict").innerHTML = m.isConfident(d)
      ? `<b>${d.label}</b> with ${pct(d.confidence)} confidence, handled in the browser.`
      : `<b>${d.label}</b> with ${pct(d.confidence)} confidence, <span class="esc">below the calibrated threshold of ${pct(m.info.threshold)}</span>: this one would go to the teacher.`;
    $("lat").textContent = `inference ${fmt(d.latency_ms, 2)} ms · model ${d.model} · source ${d.source}`;
    (window as unknown as { __last: Decision }).__last = d;
  }

  text.addEventListener("input", () => void run());
  $("backend").addEventListener("change", () => void load());
  void load();
}
