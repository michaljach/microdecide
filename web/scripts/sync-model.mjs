// Copy onnxruntime-web's wasm runtime and exported models into public/, so the demo is served
// entirely from its own origin (no CDN) and works offline once cached. Writes public/models/index.json,
// the catalog behind the model picker and the Models page.
//   node scripts/sync-model.mjs [export dirs...]   (default: every ../runs/*/v*/export)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runs = join(web, "../runs");
const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
let exports = process.argv.slice(2).map((p) => resolve(p));
const syncAll = !exports.length;
if (syncAll && existsSync(runs)) {
  for (const task of readdirSync(runs)) {
    const dir = join(runs, task);
    if (!statSync(dir).isDirectory()) continue;
    for (const v of readdirSync(dir).filter((v) => /^v\d+$/.test(v))) exports.push(join(dir, v, "export"));
  }
}
exports = exports.filter((d) => existsSync(join(d, "microdecide.json")));
if (!exports.length) {
  console.error("no exports found — run `uv run microdecide export runs/<task>/<version>` first");
  process.exit(1);
}

const ortDist = join(web, "node_modules/onnxruntime-web/dist");
const ortOut = join(web, "public/ort");
mkdirSync(ortOut, { recursive: true });
for (const f of readdirSync(ortDist).filter((f) => /^ort-wasm.*\.(wasm|mjs)$/.test(f))) cpSync(join(ortDist, f), join(ortOut, f));

// Demo inputs from the test split: the most confident short one per label, plus the least
// confident one (it shows escalation).
function examples(dir) {
  const f = join(dir, "parity.jsonl");
  if (!existsSync(f)) return [];
  const rows = readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l))
    .filter((r) => r.text.length <= 120)
    .map((r) => ({ ...r, conf: Math.max(...Object.values(r.probabilities)) }));
  const byLabel = new Map();
  for (const r of [...rows].sort((a, b) => b.conf - a.conf)) if (!byLabel.has(r.label)) byLabel.set(r.label, r.text);
  const unsure = [...rows].sort((a, b) => a.conf - b.conf)[0];
  return [...byLabel.values(), ...(unsure ? [unsure.text] : [])];
}

// a full sync mirrors runs/: models deleted there must not linger in public/ (or the deployed site)
if (syncAll) rmSync(join(web, "public/models"), { recursive: true, force: true });

const index = [];
for (const src of exports) {
  const cfg = readJson(join(src, "microdecide.json"));
  if (cfg.format !== "microdecide" || cfg.format_version !== 2) {
    console.warn(`skip ${src}: old export format (re-run microdecide export)`);
    continue;
  }
  const card = readJson(join(src, "model_card.json"));
  if (card.export?.failed) {
    console.warn(`skip ${src}: export failed its parity check (${card.export.failed})`);
    continue;
  }
  const [task, version] = cfg.model.split("@");
  const dest = join(web, "public/models", task, version);
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  // the evaluation report lives next to the export in the run folder; the model page links it
  for (const f of ["report.json", "report.md"]) {
    if (existsSync(join(src, "..", f))) cpSync(join(src, "..", f), join(dest, f));
  }
  const report = existsSync(join(dest, "report.json")) ? readJson(join(dest, "report.json")) : null;
  const e = card.export;
  index.push({
    id: cfg.model,
    path: `models/${task}/${version}`, // relative to the site root (works under a sub-path)
    tier: cfg.tier,
    base: card.base,
    downloadMB: cfg.tier === "static" ? e.static_download_mb : e.onnx_download_mb,
    task,
    version,
    description: card.spec.description.trim(),
    labels: card.spec.output.labels,
    threshold: card.threshold,
    created: card.created,
    data: card.data,
    metrics: report && {
      macroF1: report.test.macro_f1,
      accuracy: report.test.accuracy,
      testN: report.test.n,
      perLabel: report.test.per_label,
      coverage: report.escalation.coverage,
      accuracyOnCovered: report.escalation.accuracy_on_covered,
      targetPrecision: report.escalation.target_precision,
      eceBefore: report.calibration.test_ece_before,
      eceAfter: report.calibration.test_ece_after,
    },
    examples: examples(dest),
  });
  console.log(`model ${cfg.model} (${cfg.tier}) → public/models/${task}/${version}`);
}

index.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
writeFileSync(join(web, "public/models/index.json"), JSON.stringify(index, null, 2));
console.log(`onnxruntime wasm → public/ort; ${index.length} models in public/models/index.json`);
