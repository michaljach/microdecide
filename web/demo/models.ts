import { type CatalogEntry, esc, loadCatalog, modelPage, pct, title } from "./catalog";

function item(m: CatalogEntry, older: CatalogEntry[]): string {
  const labels = Object.keys(m.labels).map((l) => `<code>${esc(l)}</code>`).join(" ");
  const facts = [
    `${m.tier} tier`,
    Number.isFinite(m.downloadMB) ? `${m.downloadMB.toFixed(1)} MB` : null,
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
    // one item per task, newest version first
    const vnum = (m: CatalogEntry) => Number(m.version.replace(/\D/g, "")) || 0;
    const byTask = new Map<string, CatalogEntry[]>();
    for (const m of [...models].sort((a, b) => vnum(b) - vnum(a))) byTask.set(m.task, [...(byTask.get(m.task) ?? []), m]);
    list.innerHTML = [...byTask.values()].map(([latest, ...older]) => item(latest, older)).join("") || "<li>No models yet.</li>";
  } catch (err) {
    list.innerHTML = `<li class="fail">${esc(err instanceof Error ? err.message : String(err))}</li>`;
  }
}

void main();
