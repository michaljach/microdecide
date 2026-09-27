import { type ReactNode, useLayoutEffect } from "react";

export type Page = "home" | "models" | "train" | "bench" | "parity" | "model";

const NAV: [Page, string, string][] = [
  ["models", "Models", "./models.html"],
  ["train", "Train your own", "./playground.html"],
  ["bench", "Benchmark", "./bench.html"],
  ["parity", "Parity", "./parity.html"],
];

/** Site chrome: nav + footer. `model` carries ?model= over to the Benchmark and Parity links. */
export function Layout({ page, wide, model, children }: { page: Page; wide?: boolean; model?: string; children: ReactNode }) {
  useLayoutEffect(() => void document.body.classList.toggle("wide", !!wide), [wide]);
  const query = model ? `?model=${encodeURIComponent(model)}` : "";
  return (
    <>
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
    </>
  );
}
