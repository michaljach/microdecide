import { type Decision, MicroDecide } from "../src";
import { type Config, ORT_WASM, configsFor, fmt } from "./common";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/**
 * Wire the try-it markup (#backend, #status, #text, #examples, #result, #probs, #verdict, #lat)
 * to a model. `setModel` switches to another one (backends and examples follow).
 */
export function mountClassifier(modelUrl: string, examples: string[]) {
  const text = $<HTMLTextAreaElement>("text");
  const status = $("status");
  const backendSel = $<HTMLSelectElement>("backend");
  let model: MicroDecide | null = null;
  let configs: Config[] = [];
  let seq = 0;

  function showExamples(exs: string[]) {
    $("examples").replaceChildren(
      ...exs.map((ex) => {
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
        return li;
      }),
    );
  }

  async function load() {
    const cfg = configs[Number(backendSel.value) || 0];
    status.textContent = "loading…";
    model?.dispose();
    model = null;
    try {
      model = await MicroDecide.load(modelUrl, { backend: cfg.backend, device: cfg.device, dtype: cfg.dtype, ortWasmPaths: ORT_WASM });
      const i = model.info;
      status.textContent = `${i.model} · ${i.tier} · ${i.backend}/${i.device}${cfg.dtype ? "/" + cfg.dtype : ""} · ${fmt(i.downloadBytes / 1e6, 1)} MB · loaded in ${fmt(i.loadMs, 0)} ms`;
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

  async function setModel(url: string, exs?: string[]) {
    modelUrl = url;
    if (exs) {
      showExamples(exs);
      if (exs.length) text.value = exs[0];
    }
    try {
      configs = await configsFor(url);
    } catch (err) {
      status.textContent = `failed: ${err instanceof Error ? err.message : err}`;
      return;
    }
    backendSel.innerHTML = configs.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
    await load();
  }

  if (!text.value && examples.length) text.value = examples[0];
  showExamples(examples);
  text.addEventListener("input", () => void run());
  backendSel.addEventListener("change", () => void load());
  void setModel(modelUrl);
  return { setModel };
}
