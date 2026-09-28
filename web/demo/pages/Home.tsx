import { useEffect, useState } from "react";
import { catalogOf, useModels } from "../catalog";
import { MODEL_URL, type ModelEntry, fmt } from "../common";
import { BenchPanel } from "../ui/Bench";
import { Classifier } from "../ui/Classifier";
import { Layout } from "../ui/Layout";
import { mount } from "../ui/mount";

// hand-picked inputs for the comment moderation demo; other models use their catalog examples
const EXAMPLES = [
  "Does the new export feature support CSV?",
  "Buy 10,000 real followers for $9.99 at fastfollowz dot example",
  "The devs who shipped this are brain-dead clowns.",
  "This update is terrible, sync is broken again.",
  "Great post! Check my profile for more tips 😉",
  "hi",
];

const SPEC = `task: comment_moderation
input:  {type: text, max_chars: 2000}
output:
  type: choice
  labels:
    ok:    Normal comment. Can be positive, negative or off topic, but harmless.
    spam:  Ads, links to unrelated products or services, SEO junk, scams.
    toxic: Insults, harassment, threats or hate toward people or groups.
targets:    {min_macro_f1: 0.90, deploy: browser, max_download_mb: 30}`;

const USAGE = `import { Nodd } from "@nodd/browser";

const m = await Nodd.load("/models/comment_moderation/v3");
const d = await m.decide("Buy cheap followers at ...");
// d.label is "ok", "spam" or "toxic"`;

const DECISION = `{
  "label": "spam",
  "probabilities": {"ok": 0.04, "spam": 0.93, "toxic": 0.03},
  "confidence": 0.93,
  "escalated": false,
  "source": "micro",
  "model": "comment_moderation@v3",
  "latency_ms": 0.4
}`;

function Home() {
  const index = useModels();
  const catalog = catalogOf(index);
  const [model, setModel] = useState(MODEL_URL);
  const [extra, setExtra] = useState<ModelEntry | null>(null);

  // a model that isn't in the index (opened with ?model=…) still gets an option
  useEffect(() => {
    if (!index || index.some((m) => m.path === MODEL_URL)) return;
    setExtra({ id: MODEL_URL.split("/").pop()!, path: MODEL_URL, base: "", downloadMB: NaN });
  }, [index]);

  const options = [...(extra ? [extra] : []), ...(index ?? [])];
  const entry = catalog.find((m) => m.path === model);
  const examples = entry?.task === "comment_moderation" ? EXAMPLES : (entry?.examples ?? []);

  const picker = (
    <>
      <label htmlFor="model">Model</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
        {options.map((m) => (
          <option key={m.path} value={m.path}>
            {m.id}{Number.isFinite(m.downloadMB) ? ` · ${fmt(m.downloadMB, 1)} MB` : ""}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <Layout page="home">
      <h1>nodd</h1>
      <p>
        Turn one decision into a tiny model that runs in your browser. You describe the <b>input</b> and a fixed set of typed{" "}
        <b>labels</b>, a bigger model labels examples, and nodd trains a small, calibrated classifier for exactly
        that task. Each answer is one forward pass with no text generation, so there's nothing to parse and it can't return a
        label outside your set.
      </p>
      <p>
        <a href="#try">Try the demo</a> · <a href="./repository.html">Browse the model repository</a> ·{" "}
        <a href="./docs.html">Read the docs</a> · <a href="#how">How it works</a>
      </p>

      <section id="try" aria-labelledby="try-heading">
        <h2 id="try-heading">Demo</h2>
        <p className="small">
          The model is downloaded once and runs entirely in this tab, so nothing you type leaves your browser.{" "}
          {entry && (
            <>
              {entry.description} Labels:{" "}
              {Object.keys(entry.labels).map((l, i) => (
                <span key={l}>{i > 0 && ", "}<code>{l}</code></span>
              ))}
              .
            </>
          )}
        </p>
        {index && <Classifier key={model} model={model} examples={examples} heading="h3" picker={picker} />}
        <p className="small">
          See every model with its labels and quality numbers in the <a href="./repository.html">repository</a>.
        </p>
      </section>

      <section id="bench" aria-labelledby="bench-heading">
        <h2 id="bench-heading">Benchmark</h2>
        <p className="small">
          Load time, per-input latency and batch throughput for each browser backend, on the selected model's test inputs.
          Cold load includes the download; warm load reads the model back from the browser cache.
        </p>
        <BenchPanel key={model} model={model} />
      </section>

      <section id="how" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <p>You write a task spec. Label descriptions matter: the labeling model reads them.</p>
        <pre><code>{SPEC}</code></pre>
        <p>
          One command collects inputs, has a larger model label them (every call is cached on disk), trains every model that fits
          your download budget, keeps the best one, calibrates it and exports it for the browser:
        </p>
        <pre><code>uv run nodd run examples/comment_moderation.yaml</code></pre>
        <p>
          Calibration uses temperature scaling on a held-out split, so the confidence it reports matches how often
          it is right.
        </p>

        <h2>Use it</h2>
        <pre><code>{USAGE}</code></pre>
        <p>Every answer has the same shape:</p>
        <pre><code>{DECISION}</code></pre>

        <h2>Models</h2>
        <p>
          Every model is a small sentence encoder fine-tuned with a classification head, exported to ONNX (int8) and run
          with transformers.js. nodd trains every candidate that fits the download budget and keeps the best fit:
          the highest validation F1, or the smaller model when two are practically tied.
        </p>
        <table>
          <thead>
            <tr><th>base</th><th>download</th></tr>
          </thead>
          <tbody>
            <tr><td>paraphrase-MiniLM-L3-v2</td><td>18 MB</td></tr>
            <tr><td>all-MiniLM-L6-v2</td><td>24 MB</td></tr>
            <tr><td>bge-small-en-v1.5</td><td>34 MB</td></tr>
          </tbody>
        </table>
        <p className="small">
          The demos run on WASM. At this size WebGPU is slower per input (the GPU round trip costs more than the math),
          so it's only an opt-in for large batches; the <a href="#bench">benchmark</a> still measures it.
        </p>
      </section>
    </Layout>
  );
}

mount(<Home />);
