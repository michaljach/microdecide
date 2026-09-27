import { Fragment } from "react";
import { type CatalogEntry, byVersionDesc, catalogOf, modelPage, pct, title, useModels } from "../catalog";
import { Layout } from "../ui/Layout";
import { mount } from "../ui/mount";

function Item({ m, older }: { m: CatalogEntry; older: CatalogEntry[] }) {
  const facts = [
    `${m.tier} tier`,
    Number.isFinite(m.downloadMB) ? `${m.downloadMB.toFixed(1)} MB` : null,
    m.metrics && `macro F1 ${m.metrics.macroF1.toFixed(2)}`,
    m.metrics && `handles ${pct(m.metrics.coverage, 0)} alone`,
  ].filter(Boolean);
  return (
    <li>
      <h2>
        <a href={modelPage(m)}>{title(m.task)}</a> <span className="muted">{m.version}</span>
      </h2>
      <p>{m.description}</p>
      <p className="small">
        {Object.keys(m.labels).map((l) => (
          <Fragment key={l}><code>{l}</code> </Fragment>
        ))}
      </p>
      <p className="muted small">
        {facts.join(" · ")}
        {older.length > 0 && (
          <>
            {" · older: "}
            {older.map((o, i) => (
              <span key={o.id}>{i > 0 && ", "}<a href={modelPage(o)}>{o.version}</a></span>
            ))}
          </>
        )}
      </p>
    </li>
  );
}

function Repository() {
  const index = useModels();
  const byTask = new Map<string, CatalogEntry[]>();
  for (const m of catalogOf(index).sort(byVersionDesc)) byTask.set(m.task, [...(byTask.get(m.task) ?? []), m]);
  const groups = [...byTask.values()].sort((a, b) => a[0].task.localeCompare(b[0].task));

  return (
    <Layout page="repository">
      <h1>Repository</h1>
      <p>
        Ready-made models for common decisions. Each one is a small fine-tuned encoder (about 24 MB) that runs in your
        browser, trained with microdecide from a task spec in <code>examples/</code>. Open one to try it.
      </p>
      <ul className="model-list">
        {!index && <li className="muted">loading…</li>}
        {index && !groups.length && <li>No models yet.</li>}
        {groups.map(([latest, ...older]) => (
          <Item key={latest.task} m={latest} older={older} />
        ))}
      </ul>
      <p className="muted small">
        The training data is synthetic and small, so expect lower accuracy on real inputs. To add your own, write a spec,
        run <code>uv run microdecide run &lt;spec&gt;</code>, then <code>npm run sync-model</code>. Or{" "}
        <a href="./playground.html">train one in the browser</a>.
      </p>
    </Layout>
  );
}

mount(<Repository />);
