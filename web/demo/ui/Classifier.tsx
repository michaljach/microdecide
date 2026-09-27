import { type ReactNode, useEffect, useState } from "react";
import { type Decision, MicroDecide } from "../../src";
import { type Config, ORT_WASM, demoConfig, fmt } from "../common";
import { DecisionView } from "./DecisionView";

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));

/**
 * Try a model: input on the left, result on the right. Re-mount with `key={model}` to switch models.
 * Runs on the fastest backend for the model (demoConfig). Keeps the ids the headless checks use
 * (#text, #status) and exposes the last answer as window.__last.
 */
export function Classifier({ model, examples, heading = "h2", picker }: { model: string; examples: string[]; heading?: "h2" | "h3"; picker?: ReactNode }) {
  const H = heading;
  const [text, setText] = useState(examples[0] ?? "");
  const [loaded, setLoaded] = useState<MicroDecide | null>(null);
  const [status, setStatus] = useState("loading…");
  const [decision, setDecision] = useState<Decision | null>(null);

  useEffect(() => {
    let live = true;
    let m: MicroDecide | null = null;
    demoConfig(model)
      .then((cfg: Config) =>
        MicroDecide.load(model, { backend: cfg.backend, device: cfg.device, dtype: cfg.dtype, ortWasmPaths: ORT_WASM }).then((x) => {
          if (!live) return x.dispose();
          m = x;
          const i = x.info;
          setStatus(`${i.model} · ${i.tier} · ${i.backend}/${i.device}${cfg.dtype ? "/" + cfg.dtype : ""} · ${fmt(i.downloadBytes / 1e6, 1)} MB · loaded in ${fmt(i.loadMs, 0)} ms`);
          setLoaded(x);
        }),
      )
      .catch((err) => live && setStatus(`failed: ${message(err)}`));
    return () => {
      live = false;
      m?.dispose();
    };
  }, [model]);

  useEffect(() => {
    if (!loaded) return;
    let live = true;
    loaded.decide(text).then(
      (d) => {
        if (!live) return;
        setDecision(d);
        (window as unknown as { __last: Decision }).__last = d;
      },
      () => {}, // model disposed mid-flight (model switch)
    );
    return () => void (live = false);
  }, [loaded, text]);

  return (
    <div className={heading === "h3" ? "cols tight" : "cols"}>
      <section>
        <H>Input</H>
        {picker && <div className="controls">{picker}</div>}
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
