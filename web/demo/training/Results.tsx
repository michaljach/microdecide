import { fmt } from "../common";
import type { TrainResult } from "./protocol";

export interface Trained {
  result: TrainResult;
  labels: string[];
  baseInfo: string;
}

export function Results({ t, color }: { t: Trained; color: (l: string) => string }) {
  const { result: r, labels } = t;
  const e = r.escalation;
  const summary: [string, string][] = [
    ["macro F1 (test)", fmt(r.test.macroF1, 3)],
    ["accuracy (test)", `${fmt(r.test.accuracy * 100, 1)}%`],
    ["handled alone", `${fmt(e.testCoverage * 100, 0)}%, ${e.testAccuracyOnCovered == null ? "—" : fmt(e.testAccuracyOnCovered * 100, 1) + "%"} accurate`],
    ["calibration error", `${fmt(r.calibration.testEceAfter, 3)} (was ${fmt(r.calibration.testEceBefore, 3)})`],
    ["training time", `${fmt(r.ms.total / 1000, 2)} s`],
  ];
  const wrong = r.predictions.filter((p) => p.predicted !== p.label).sort((a, b) => b.confidence - a.confidence).slice(0, 8);
  return (
    <div>
      <table className="kv summary">
        <tbody>
          {summary.map(([k, v]) => (
            <tr key={k}><td>{k}</td><td className="num"><b>{v}</b></td></tr>
          ))}
        </tbody>
      </table>
      <div className="cols">
        <section>
          <h3>Per label (test)</h3>
          <div className="scroll">
            <table>
              <tbody>
                <tr><th>label</th><th className="num">precision</th><th className="num">recall</th><th className="num">F1</th><th className="num">n</th></tr>
                {r.test.perLabel.map((m, k) => (
                  <tr key={labels[k]}>
                    <td style={{ color: color(labels[k]) }}>{labels[k]}</td>
                    <td className="num">{fmt(m.precision, 3)}</td>
                    <td className="num">{fmt(m.recall, 3)}</td>
                    <td className="num">{fmt(m.f1, 3)}</td>
                    <td className="num">{m.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h3>Confusion (rows = true)</h3>
          <div className="scroll">
            <table>
              <tbody>
                <tr><th></th>{labels.map((l) => <th key={l} className="num">{l}</th>)}</tr>
                {r.test.confusion.map((row, k) => (
                  <tr key={labels[k]}>
                    <th>{labels[k]}</th>
                    {row.map((v, j) => (
                      <td key={j} className="num" style={j === k ? { fontWeight: 600 } : undefined}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <h3>Most confident mistakes (test)</h3>
      <div className="scroll">
        <table>
          <tbody>
            {wrong.length ? (
              <>
                <tr><th className="num">conf</th><th>true → predicted</th><th>text</th></tr>
                {wrong.map((p) => (
                  <tr key={p.text}>
                    <td className="num">{fmt(p.confidence, 2)}</td>
                    <td>{p.label} → {p.predicted}</td>
                    <td className="text" title={p.text}>{p.text}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr><td className="muted">No mistakes on the test split.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        {t.baseInfo} · train/val/test {r.counts.train}/{r.counts.val}/{r.counts.test} · C={r.C} · temperature {fmt(r.calibration.temperature, 2)} ·
        threshold {fmt(e.threshold, 3)} for {fmt(e.targetPrecision * 100, 0)}% precision{e.reached ? "" : " (not reached on val)"} · embed{" "}
        {fmt(r.ms.embed, 0)} ms, fit {fmt(r.ms.fit, 0)} ms, calibrate {fmt(r.ms.calibrate, 0)} ms
      </p>
    </div>
  );
}

