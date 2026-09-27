import { type ReactNode, useEffect, useState } from "react";
import { type Decision, MicroDecide } from "../../src";
import { type Config, ORT_WASM, configsFor, fmt } from "../common";
import { DecisionView } from "./DecisionView";

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));

/**
 * Try a model: input on the left, result on the right. Re-mount with `key={model}` to switch models.
 * Keeps the ids the headless checks use (#text, #status) and exposes the last answer as window.__last.
 */
export function Classifier({ model, examples, heading = "h2", picker }: { model: string; examples: string[]; heading?: "h2" | "h3"; picker?: ReactNode }) {
  const H = heading;
  const [configs, setConfigs] = useState<Config[] | null>(null);
  const [backend, setBackend] = useState(0);
  const [text, setText] = useState(examples[0] ?? "");
  const [loaded, setLoaded] = useState<MicroDecide | null>(null);
  const [status, setStatus] = useState("loading…");
  const [decision, setDecision] = useState<Decision | null>(null);

  useEffect(() => {
    let live = true;
    configsFor(model).then(
      (c) => live && setConfigs(c),
      (err) => live && setStatus(`failed: ${message(err)}`),
    );
    return () => void (live = false);
  }, [model]);

  useEffect(() => {
    if (!configs) return;
    const cfg = configs[backend] ?? configs[0];
    let live = true;
    let m: MicroDecide | null = null;
    setStatus("loading…");
    setLoaded(null);
    MicroDecide.load(model, { backend: cfg.backend, device: cfg.device, dtype: cfg.dtype, ortWasmPaths: ORT_WASM }).then(
      (x) => {
        if (!live) return x.dispose();
        m = x;
        const i = x.info;
        setStatus(`${i.model} · ${i.tier} · ${i.backend}/${i.device}${cfg.dtype ? "/" + cfg.dtype : ""} · ${fmt(i.downloadBytes / 1e6, 1)} MB · loaded in ${fmt(i.loadMs, 0)} ms`);
        setLoaded(x);
      },
      (err) => live && setStatus(`failed: ${message(err)}`),
    );
    return () => {
      live = false;
      m?.dispose();
    };
  }, [model, configs, backend]);

  useEffect(() => {
    if (!loaded) return;
    let live = true;
    loaded.decide(text).then(
      (d) => {
        if (!live) return;
        setDecision(d);
        (window as unknown as { __last: Decision }).__last = d;
      },
      () => {}, // model disposed mid-flight (backend switch)
    );
    return () => void (live = false);
  }, [loaded, text]);

  return (
    <div className={heading === "h3" ? "cols tight" : "cols"}>
      <section>
        <H>Input</H>
        {picker && <div className="controls">{picker}</div>}
        <div className="controls">
          <label htmlFor="backend">Backend</label>
          <select id="backend" value={backend} onChange={(e) => setBackend(Number(e.target.value))}>
            {configs?.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
          </select>
        </div>
        <textarea id="text" aria-label="Input" placeholder="Type something…" value={text} onChange={(e) => setText(e.target.value)} />
        <ul className="examples" aria-label="Examples">
          {examples.map((ex) => (
            <li key={ex}>
              <a href="#" onClick={(e) => (e.preventDefault(), setText(ex))}>{ex}</a>
            </li>
          ))}
        </ul>
      </section>
      <section aria-live="polite">
        <H>Result</H>
        <p id="status" className="muted small">{status}</p>
        {decision && loaded && <DecisionView d={decision} threshold={loaded.info.threshold} />}
      </section>
    </div>
  );
}
