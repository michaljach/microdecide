import { type ReactNode, type KeyboardEventHandler } from "react";

export type Page = "home" | "repository" | "train" | "bench" | "parity" | "model";

const NAV: [Page, string, string][] = [
  ["repository", "Repository", "./repository.html"],
  ["train", "Train your own", "./playground.html"],
  ["bench", "Benchmark", "./bench.html"],
  ["parity", "Parity", "./parity.html"],
];

/** Site chrome: nav + footer. `model` carries ?model= over to the Benchmark and Parity links. */
export function Layout({ page, wide, model, children, onKeyDown }: { page: Page; wide?: boolean; model?: string; children: ReactNode; onKeyDown?: KeyboardEventHandler<HTMLDivElement> }) {
  const query = model ? `?model=${encodeURIComponent(model)}` : "";
  return (
    <div className={wide ? "app wide" : "app"} onKeyDown={onKeyDown}>
      <nav aria-label="Main">
        {page === "home" ? <b aria-current="page">microdecide</b> : <a href="./">microdecide</a>}
        {NAV.map(([p, label, href]) =>
          p === page ? (
            <b key={p} aria-current="page">{label}</b>
          ) : (
            <a key={p} href={p === "bench" || p === "parity" ? href + query : href}>{label}</a>
          ),
        )}
      </nav>
      {children}
      <footer>
        <p>Created by <a href="https://jach.me/">Michal Jach</a>.</p>
      </footer>
    </div>
  );
}
