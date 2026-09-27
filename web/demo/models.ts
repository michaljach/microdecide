import { type ModelEntry, esc, loadCatalog, modelPage, pct, title } from "./catalog";

function item(m: ModelEntry, older: ModelEntry[]): string {
  const labels = Object.keys(m.labels).map((l) => `<code>${esc(l)}</code>`).join(" ");
  const facts = [
    `${m.tier} tier`,
    m.sizeMB != null ? `${m.sizeMB.toFixed(1)} MB` : null,
    m.metrics && `macro F1 ${m.metrics.macroF1.toFixed(2)}`,
    m.metrics && `handles ${pct(m.metrics.coverage, 0)} alone`,
  ].filter(Boolean);
  const versions = older.length ? ` · older: ${older.map((o) => `<a href="${modelPage(o)}">${esc(o.version)}</a>`).join(", ")}` : "";
  return `<li>
    <h2><a href="${modelPage(m)}">${esc(title(m.task))}</a> <span class="muted">${esc(m.version)}</span></h2>
    <p>${esc(m.description)}</p>
    <p class="small">${labels}</p>
    <p class="muted small">${facts.join(" · ")}${versions}</p>
  </li>`;
}

async function main() {
  const list = document.getElementById("list")!;
  try {
    const models = await loadCatalog();
    // newest version per task first (the catalog is sorted by task, then version descending)
    const byTask = new Map<string, ModelEntry[]>();
    for (const m of models) byTask.set(m.task, [...(byTask.get(m.task) ?? []), m]);
    list.innerHTML = [...byTask.values()].map(([latest, ...older]) => item(latest, older)).join("") || "<li>No models yet.</li>";
  } catch (err) {
    list.innerHTML = `<li class="fail">${esc(err instanceof Error ? err.message : String(err))}</li>`;
  }
}

void main();
