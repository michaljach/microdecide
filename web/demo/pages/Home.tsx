import { useEffect, useState } from "react";
import { catalogOf, useModels } from "../catalog";
import { MODEL_URL, type ModelEntry, fmt, modelTier } from "../common";
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

const USAGE = `import { MicroDecide } from "microdecide-web";

const m = await MicroDecide.load("/models/comment_moderation/v3");
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

  // a model that isn't in the index (e.g. saved from the training playground) still gets an option
  useEffect(() => {
    if (!index || index.some((m) => m.path === MODEL_URL)) return;
    void modelTier()
      .catch(() => "static" as const)
      .then((tier) => setExtra({ id: MODEL_URL.split("/").pop()!, path: MODEL_URL, tier, base: "", downloadMB: NaN }));
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
            {m.id} · {m.tier}{Number.isFinite(m.downloadMB) ? ` · ${fmt(m.downloadMB, 1)} MB` : ""}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <Layout page="home">
      <h1>microdecide</h1>
      <p>
        Turn one decision into a tiny model that runs in your browser. You describe the <b>input</b> and a fixed set of typed{" "}
        <b>labels</b>, a bigger model labels examples, and microdecide trains a small, calibrated classifier for exactly
        that task. Each answer is one forward pass with no text generation, so there's nothing to parse and it can't return a
        label outside your set.
      </p>
      <p>
        <a href="#try">Try the demo</a> · <a href="./repository.html">Browse the model repository</a> ·{" "}
        <a href="./playground.html">Train your own in the browser</a> · <a href="#how">How it works</a>
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
        <pre><code>uv run microdecide run examples/comment_moderation.yaml</code></pre>
        <p>
          Calibration uses temperature scaling on a held-out split, so the confidence it reports matches how often
          it is right.
        </p>

        <h2>Use it</h2>
        <pre><code>{USAGE}</code></pre>
        <p>Every answer has the same shape:</p>
        <pre><code>{DECISION}</code></pre>

        <h2>Tiers</h2>
        <table>
          <thead>
            <tr><th>tier</th><th>model</th><th>trains on</th><th>runs in the browser as</th></tr>
          </thead>
          <tbody>
            <tr><td>static</td><td>static embeddings (model2vec) + logistic regression</td><td>CPU, or in the browser</td><td>plain JS</td></tr>
            <tr><td>encoder</td><td>small sentence-transformer (MiniLM), fine-tuned</td><td>CPU</td><td>transformers.js, ONNX q8 on WASM</td></tr>
          </tbody>
        </table>
        <p className="small">
          With <code>tier: auto</code>, microdecide trains every candidate that fits the download budget and keeps the
          best fit: the highest validation F1, or the smaller model when two are practically tied.
        </p>
        <p className="small">
          The demos run static models in plain JS and encoders on WASM. At this size WebGPU is slower per input (the
          GPU round trip costs more than the math), so it's only an opt-in for large batches; the{" "}
          <a href="#bench">benchmark</a> still measures it.
        </p>
      </section>
    </Layout>
  );
}

mount(<Home />);
