import type { Decision } from "../../src";
import { fmt } from "../common";

const pct = (x: number) => `${fmt(x * 100, 1)}%`;

/** Probabilities as a table with bars (top label in bold) and whether the answer would escalate. */
export function DecisionView({ d, threshold, meta = true }: { d: Decision; threshold: number; meta?: boolean }) {
  return (
    <>
      <table className="probs">
        <tbody>
          {Object.entries(d.probabilities).map(([k, p]) => (
            <tr key={k} className={k === d.label ? "best" : undefined}>
              <td>{k}</td>
              <td className="num">{pct(p)}</td>
              <td>
                <span className="bar" style={{ width: `calc(${p.toFixed(4)} * min(200px, 30vw))` }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small">
        <b>{d.label}</b> with {pct(d.confidence)} confidence
        {d.confidence >= threshold ? (
          ", handled in the browser."
        ) : (
          <>
            , <span className="esc">below the calibrated threshold of {pct(threshold)}</span>: this one would go to the teacher.
          </>
        )}
      </p>
      {meta && (
        <p className="muted small">
          inference {fmt(d.latency_ms, 2)} ms · model {d.model} · source {d.source}
        </p>
      )}
    </>
  );
}
