import { useState } from "react";

export interface Usage {
  label: string;
  install: string;
  code: string;
}

/** The same model from each runtime: one tab per language, install line above the code. */
export function UsageTabs({ usages }: { usages: Usage[] }) {
  const [active, setActive] = useState(0);
  const u = usages[active];
  return (
    <div className="usage">
      <div role="tablist" aria-label="Language" className="tabs">
        {usages.map((x, i) => (
          <button
            key={x.label}
            role="tab"
            id={`usage-tab-${i}`}
            aria-selected={i === active}
            aria-controls="usage-panel"
            onClick={() => setActive(i)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="usage-panel" aria-labelledby={`usage-tab-${active}`}>
        <pre><code>{u.install}</code></pre>
        <pre><code>{u.code}</code></pre>
      </div>
    </div>
  );
}
