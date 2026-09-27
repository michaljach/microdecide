import { type ModelEntry, esc, loadCatalog, pct, title } from "./catalog";
import { MODEL_URL } from "./common";
import { mountPlayground } from "./playground";

const $ = (id: string) => document.getElementById(id)!;

function render(m: ModelEntry) {
  document.title = `microdecide · ${title(m.task)}`;
  $("title").innerHTML = `${esc(title(m.task))} <span class="muted">${esc(m.version)}</span>`;
  $("description").textContent = m.description;
  $("facts").textContent = [
    m.id,
    `${m.tier} tier`,
    m.base,
    m.sizeMB != null ? `${m.sizeMB.toFixed(1)} MB` : null,
    `trained ${m.created.slice(0, 10)}`,
  ].filter(Boolean).join(" · ");

  const per = m.metrics?.perLabel ?? {};
  $("labels").innerHTML =
    "<tr><th>label</th><th>meaning</th><th>F1</th><th>test n</th></tr>" +
    Object.entries(m.labels)
      .map(([k, d]) => `<tr><td><code>${esc(k)}</code></td><td style="white-space:normal">${esc(d)}</td><td class="num">${per[k] ? per[k].f1.toFixed(2) : "—"}</td><td class="num">${per[k]?.support ?? "—"}</td></tr>`)
      .join("");

  const q = m.metrics;
  if (q) {
    $("quality-note").textContent =
      `On ${q.testN} held-out test inputs. Answers below ${pct(m.threshold)} confidence go to the teacher; the threshold was picked on the validation split to reach ${pct(q.targetPrecision, 0)} precision.`;
    const rows: [string, string][] = [
      ["macro F1", q.macroF1.toFixed(3)],
      ["accuracy", pct(q.accuracy)],
      ["handled in the browser", pct(q.coverage)],
      ["accuracy on those", pct(q.accuracyOnCovered)],
      ["calibration error (ECE)", `${q.eceBefore.toFixed(3)} → ${q.eceAfter.toFixed(3)}`],
      ["train / val / test", `${m.data.train} / ${m.data.val} / ${m.data.test}`],
    ];
    $("quality").innerHTML = rows.map(([k, v]) => `<tr><td>${k}</td><td class="num">${v}</td></tr>`).join("");
  } else {
    $("quality-note").textContent = "No evaluation report was synced for this model.";
  }

  $("usage").textContent = `import { MicroDecide } from "microdecide-web";

const m = await MicroDecide.load("${m.url}");
const d = await m.decide(${JSON.stringify(m.examples[0] ?? "…")});
// d.label is one of: ${Object.keys(m.labels).join(", ")}
if (!m.isConfident(d)) { /* below ${pct(m.threshold)}: escalate */ }`;

  const q2 = `?model=${encodeURIComponent(m.url)}`;
  for (const id of ["bench", "nav-bench"]) $(id).setAttribute("href", `./bench.html${q2}`);
  for (const id of ["parity", "nav-parity"]) $(id).setAttribute("href", `./parity.html${q2}`);
  $("report").setAttribute("href", `${m.url}/report.md`);
}

async function main() {
  let entry: ModelEntry | undefined;
  try {
    entry = (await loadCatalog()).find((m) => m.url === MODEL_URL);
  } catch {
    // no catalog: still playable, just without the card
  }
  if (entry) render(entry);
  else $("description").textContent = `${MODEL_URL} is not in the model catalog.`;
  mountPlayground(MODEL_URL, entry?.examples ?? []);
}

void main();
