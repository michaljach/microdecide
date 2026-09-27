import { type ReactNode, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { type Decision, MicroDecide } from "../../src";
import { fmt, url } from "../common";
import { parseExamples } from "../csv";
import { useTask, withExamples, slug, type Row } from "../training/task";
import { Results, type Trained } from "../training/Results";
import type { TrainResult } from "../training/protocol";
import { useTrainingClient } from "../training/client";
import { DecisionView } from "../ui/DecisionView";
import { Download, type DownloadFile } from "../ui/Download";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Layout } from "../ui/Layout";
import { mount } from "../ui/mount";

const COLORS = ["#2563eb", "#9333ea", "#0891b2", "#be185d", "#4d7c0f", "#b45309", "#475569"];
const SEMANTIC: Record<string, string> = {
  ok: "#16a34a", positive: "#16a34a", true: "#16a34a", yes: "#16a34a", safe: "#16a34a",
  spam: "#d97706", neutral: "#d97706",
  toxic: "#dc2626", negative: "#dc2626", false: "#dc2626", no: "#dc2626", unsafe: "#dc2626",
};
const colorOf = (labels: string[], label: string) =>
  SEMANTIC[label.toLowerCase()] ?? COLORS[Math.max(0, labels.filter((l) => !SEMANTIC[l.toLowerCase()]).indexOf(label)) % COLORS.length];

type Playground = { MicroDecide: typeof MicroDecide; result: TrainResult; saved?: string };
const exposed = () => window as unknown as { __playground: Playground };

// --- page --------------------------------------------------------------------------------------------

function Train() {
  const [task, setTask] = useTask();
  const call = useTrainingClient();
  const [nameInput, setNameInput] = useState(task.name);
  const [newLabel, setNewLabel] = useState("");
  const [status, setStatus] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [queue, setQueue] = useState<string[]>([]);
  const [oneText, setOneText] = useState("");
  const [oneLabel, setOneLabel] = useState("");
  const [base, setBase] = useState("bases/potion-base-8M");
  const [target, setTarget] = useState("0.97");
  const [seed, setSeed] = useState("42");
  const [progress, setProgress] = useState<{ stage: string; f: number } | null>(null);
  const [training, setTraining] = useState(false);
  const [trained, setTrained] = useState<Trained | null>(null);
  const [tryText, setTryText] = useState("");
  const [tryD, setTryD] = useState<Decision | null>(null);
  const [saveStatus, setSaveStatus] = useState<ReactNode>(null);
  const [downloadFile, setDownloadFile] = useState<DownloadFile | null>(null);
  const [confirmation, setConfirmation] = useState<{ kind: "clear" } | { kind: "label"; label: string } | null>(null);
  const queuePanel = useRef<HTMLDivElement>(null);
  const [snippet, setSnippet] = useState("");
  const loadedBase = useRef({ url: "", info: "" });
  const color = (l: string) => colorOf(task.labels, l);

  function add(rows: Row[], replaceLabels = false): number {
    const [next, added] = withExamples(replaceLabels ? { ...task, labels: [] } : task, rows);
    setTask(next);
    return added;
  }

  // 1 · task
  function addLabel() {
    const l = newLabel.trim();
    if (l && !task.labels.includes(l)) setTask({ ...task, labels: [...task.labels, l] });
    setNewLabel("");
  }
  function removeLabel(l: string) {
    const n = task.examples.filter((ex) => ex.label === l).length;
    if (n) setConfirmation({ kind: "label", label: l });
    else setTask((t) => ({ ...t, labels: t.labels.filter((x) => x !== l) }));
  }

  // 2 · examples
  async function loadExample() {
    const text = await (await fetch(url("examples/comment_moderation.csv"))).text();
    const added = add(parseExamples(text), task.examples.length === 0);
    if (task.name === "my_task") {
      setTask((t) => ({ ...t, name: "comment_moderation" }));
      setNameInput("comment_moderation");
    }
    setStatus(`added ${added} examples`);
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    const rows = parseExamples(await file.text());
    setStatus(`added ${add(rows.filter((r) => r.label))} labeled examples`);
    startQueue(rows.filter((r) => !r.label).map((r) => r.text));
  }
  function importPasted() {
    try {
      setStatus(`added ${add(parseExamples(pasteText))} examples`);
    } catch (err) {
      setStatus(`could not parse: ${(err as Error).message}`);
    }
  }
  function clearAll() {
    if (task.examples.length) setConfirmation({ kind: "clear" });
  }
  const labelForOne = task.labels.includes(oneLabel) ? oneLabel : (task.labels[0] ?? "");
  function addOne() {
    if (oneText.trim() && labelForOne) add([{ text: oneText.trim(), label: labelForOne }]);
    setOneText("");
  }

  // labeling queue: one text at a time, click a label or press 1–9, s to skip
  function startQueue(lines: string[]) {
    setQueue(lines.filter((l) => !task.examples.some((ex) => ex.text === l)));
  }
  function answer(label: string | null) {
    const [text, ...rest] = queue;
    setQueue(rest);
    if (text && label) add([{ text, label }]);
  }
  const hasQueue = queue.length > 0;
  useEffect(() => {
    if (hasQueue) queuePanel.current?.focus();
  }, [hasQueue]);
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasQueue || confirmation || event.altKey || event.ctrlKey || event.metaKey) return;
    if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
    const n = Number(event.key);
    if (n >= 1 && n <= Math.min(9, task.labels.length)) {
      event.preventDefault();
      answer(task.labels[n - 1]);
    } else if (event.key === "s") {
      event.preventDefault();
      answer(null);
    }
  }

  function confirmDelete() {
    if (!confirmation) return;
    if (confirmation.kind === "clear") setTask((t) => ({ ...t, examples: [] }));
    else {
      const label = confirmation.label;
      setTask((t) => ({ ...t, labels: t.labels.filter((l) => l !== label), examples: t.examples.filter((ex) => ex.label !== label) }));
    }
    setConfirmation(null);
  }

  // 3 · train
  async function train() {
    const usable = task.labels.filter((l) => task.examples.filter((ex) => ex.label === l).length >= 5);
    if (usable.length < 2) return setStatus("need at least 2 labels with ≥ 5 examples each");
    setTraining(true);
    try {
      const baseUrl = url(base);
      if (baseUrl !== loadedBase.current.url) {
        setProgress({ stage: "loading embeddings", f: 0 });
        const info = await call({ type: "loadBase", url: baseUrl });
        loadedBase.current = { url: baseUrl, info: `${info.model} (${fmt(info.mb, 1)} MB)` };
      }
      const result = await call(
        {
          type: "train",
          examples: task.examples.filter((ex) => usable.includes(ex.label)),
          labels: usable,
          name: task.name,
          seed: Number(seed) || 42,
          targetPrecision: Number(target) || 0.97,
        },
        (stage, f) => setProgress({ stage, f }),
      );
      setTrained({ result, labels: usable, baseInfo: loadedBase.current.info });
      exposed().__playground = { MicroDecide, result };
    } catch (err) {
      setStatus(`training failed: ${(err as Error).message}`);
    } finally {
      setTraining(false);
      setProgress(null);
    }
  }

  // 4 · try it
  useEffect(() => {
    if (!trained) return;
    let live = true;
    call({ type: "predict", text: tryText }).then(
      (d) => live && setTryD(d),
      () => {},
    );
    return () => void (live = false);
  }, [trained, tryText]);

  // 5 · use it
  async function save() {
    const { url: saved, bytes } = await call({ type: "save", name: task.name, url: url(`playground-models/${task.name}`) });
    const q = `?model=${encodeURIComponent(saved)}`;
    setSaveStatus(
      <>
        saved {fmt(bytes / 1e6, 1)} MB · <a href={`./index.html${q}`}>open in demo</a> · <a href={`./model.html${q}`}>open on its own page</a>
      </>,
    );
    setSnippet(`import { MicroDecide } from "microdecide-web";\n\n// same origin, this browser (Cache API) — works offline\nconst m = await MicroDecide.load("${saved}");\nconst d = await m.decide("some text");`);
    exposed().__playground.saved = saved;
  }
  async function download() {
    const bytes = await call({ type: "zip", name: task.name });
    setDownloadFile({ blob: new Blob([bytes as BlobPart], { type: "application/zip" }), name: `${task.name}.zip` });
    setSaveStatus(`downloaded ${task.name}.zip — unzip next to your app and MicroDecide.load("/path/${task.name}")`);
  }

  const counts = new Map(task.labels.map((l) => [l, 0]));
  for (const ex of task.examples) counts.set(ex.label, (counts.get(ex.label) ?? 0) + 1);
  const recent = task.examples.slice(-8).reverse();

  return (
    <Layout page="train" wide onKeyDown={onKeyDown}>
      <Download file={downloadFile} />
      {confirmation && <ConfirmDialog
        message={confirmation.kind === "clear"
          ? `Delete all ${task.examples.length} examples?`
          : `Remove "${confirmation.label}" and its ${task.examples.filter((ex) => ex.label === confirmation.label).length} examples?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmation(null)}
      />}
      <h1>Train your own</h1>
      <p>
        Train a text classifier in your browser. Define labels, add examples, train in a few seconds, then try it, save it
        in this browser or download it. Your data never leaves this page.
      </p>

      <h2>1. Task</h2>
      <div className="controls">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          spellCheck={false}
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
            setTask({ ...task, name: slug(e.target.value) || "my_task" });
          }}
        />
      </div>
      <div className="controls">
        <label htmlFor="new-label">Labels</label>
        <span className="chips">
          {task.labels.map((l) => (
            <span key={l} className="chip" style={{ borderColor: color(l) }}>
              {l}
              <button title="remove" aria-label={`Remove ${l}`} onClick={() => removeLabel(l)}>×</button>
            </span>
          ))}
        </span>
        <input id="new-label" placeholder="add label…" size={12} spellCheck={false} value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLabel()} />
        <button onClick={addLabel}>Add</button>
      </div>

      <h2>2. Examples <span id="count" className="muted">{task.examples.length} labeled</span></h2>
      <div className="controls">
        <button id="load-example" onClick={loadExample}>Load example dataset</button>
        <label className="button">
          Upload CSV / JSONL
          <input type="file" accept=".csv,.jsonl,.txt" hidden onChange={(e) => void upload(e.target.files?.[0])} />
        </label>
        <button className="secondary" onClick={() => setPasteOpen(!pasteOpen)}>Paste…</button>
        <button className="secondary" onClick={clearAll}>Clear</button>
        <span className="muted small">{status}</span>
      </div>
      {pasteOpen && (
        <div>
          <textarea placeholder="CSV with a header (text,label[,confidence]) or JSONL, or plain lines to label one by one"
            value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
          <div className="controls">
            <button onClick={importPasted}>Import labeled CSV / JSONL</button>
            <button className="secondary" onClick={() => startQueue(pasteText.split("\n").map((l) => l.trim()).filter(Boolean))}>
              Queue lines for labeling
            </button>
          </div>
        </div>
      )}
      {queue.length > 0 && (
        <div className="queue" ref={queuePanel} tabIndex={-1} aria-label="Labeling queue">
          <p className="muted small">{queue.length} left to label · keys 1–{Math.min(9, task.labels.length)}, s = skip</p>
          <p className="queue-text">{queue[0]}</p>
          <div className="controls queue-buttons">
            {task.labels.map((l, i) => (
              <button key={l} style={{ borderColor: color(l) }} onClick={() => answer(l)}>
                {i < 9 ? `${i + 1} · ` : ""}{l}
              </button>
            ))}
            <button onClick={() => answer(null)}>skip</button>
          </div>
        </div>
      )}
      <div className="controls add-one">
        <input placeholder="Type an example…" aria-label="New example" value={oneText}
          onChange={(e) => setOneText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOne()} />
        <select aria-label="Its label" value={labelForOne} onChange={(e) => setOneLabel(e.target.value)}>
          {task.labels.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button onClick={addOne}>Add</button>
      </div>
      <p className="counts small">
        {[...counts].map(([l, n]) => (
          <span key={l}><b style={{ color: color(l) }}>{l}</b> {n}{n < 5 ? " (need ≥ 5)" : ""}</span>
        ))}
      </p>
      <div className="scroll">
        <table className="examples-table">
          <tbody>
            {recent.length ? (
              <>
                <tr><th>text</th><th>label</th><th></th></tr>
                {recent.map((ex) => (
                  <tr key={ex.text}>
                    <td className="text" title={ex.text}>{ex.text}</td>
                    <td style={{ color: color(ex.label) }}>{ex.label}</td>
                    <td><button title="delete" onClick={() => setTask({ ...task, examples: task.examples.filter((x) => x.text !== ex.text) })}>×</button></td>
                  </tr>
                ))}
                {task.examples.length > 8 && <tr><td colSpan={3} className="muted">… and {task.examples.length - 8} more</td></tr>}
              </>
            ) : (
              <tr><td className="muted">No examples yet. Load the example dataset, upload a file, or add some above.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2>3. Train</h2>
      <div className="controls">
        <label htmlFor="base">Embeddings</label>
        <select id="base" value={base} onChange={(e) => setBase(e.target.value)}>
          <option value="bases/potion-base-8M">potion-base-8M · 8 MB · fastest</option>
          <option value="bases/potion-base-32M">potion-base-32M · 33 MB · more accurate</option>
        </select>
        <label htmlFor="target">Escalation precision</label>
        <input id="target" type="number" min="0.5" max="1" step="0.01" style={{ width: "5em" }} value={target} onChange={(e) => setTarget(e.target.value)} />
        <label htmlFor="seed">Seed</label>
        <input id="seed" type="number" style={{ width: "5em" }} value={seed} onChange={(e) => setSeed(e.target.value)} />
        <button id="train" onClick={train} disabled={training}>{training ? "Training…" : "Train"}</button>
      </div>
      {progress && (
        <div className="progress">
          <div style={{ width: `${Math.round(progress.f * 100)}%` }} />
          <span>{progress.stage} {Math.round(progress.f * 100)}%</span>
        </div>
      )}
      {trained && <Results t={trained} color={color} />}

      <div className="cols try">
        <section>
          <h2>4. Try it</h2>
          <textarea aria-label="Input" placeholder="Train a model, then type here…" value={tryText} onChange={(e) => setTryText(e.target.value)} />
        </section>
        <section aria-live="polite">
          <h2>Result</h2>
          {trained && tryD ? (
            <DecisionView d={tryD} threshold={trained.result.escalation.threshold} meta={false} />
          ) : (
            <p className="muted small">Train a model to see its answers here.</p>
          )}
        </section>
      </div>

      <h2>5. Use it</h2>
      <div className="controls">
        <button id="save" disabled={!trained} onClick={save}>Save in this browser</button>
        <button id="download" className="secondary" disabled={!trained} onClick={download}>Download .zip</button>
        <span className="muted small">{saveStatus}</span>
      </div>
      {snippet && <pre>{snippet}</pre>}
    </Layout>
  );
}

mount(<Train />);
