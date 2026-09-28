import type { ReactNode } from "react";

export type Page = "home" | "repository" | "docs" | "bench" | "parity" | "model";

const NAV: [Page, string, string][] = [
  ["repository", "Repository", "./repository.html"],
  ["docs", "Docs", "./docs.html"],
];

/** Checks that live in the footer; `model` carries ?model= over to them. */
const FOOTER: [Page, string, string][] = [
  ["bench", "Benchmark", "./bench.html"],
  ["parity", "Parity", "./parity.html"],
];

function Links({ items, page, query = "" }: { items: [Page, string, string][]; page: Page; query?: string }) {
  return items.map(([p, label, href], i) => (
    <span key={p}>
      {i > 0 && " · "}
      {p === page ? <b aria-current="page">{label}</b> : <a href={href + query}>{label}</a>}
    </span>
  ));
}

/** Site chrome: nav + footer. */
export function Layout({ page, wide, model, children }: { page: Page; wide?: boolean; model?: string; children: ReactNode }) {
  const query = model ? `?model=${encodeURIComponent(model)}` : "";
  return (
    <div className={wide ? "app wide" : "app"}>
      <nav aria-label="Main">
        {page === "home" ? <b aria-current="page">nodd</b> : <a href="./">nodd</a>}
        {NAV.map(([p, label, href]) => (p === page ? <b key={p} aria-current="page">{label}</b> : <a key={p} href={href}>{label}</a>))}
        <a href="https://github.com/michaljach/nodd">GitHub</a>
      </nav>
      {children}
      <footer>
        <p>
          <Links items={FOOTER} page={page} query={query} />
        </p>
        <p>Created by <a href="https://jach.me/">Michal Jach</a>.</p>
      </footer>
    </div>
  );
}
