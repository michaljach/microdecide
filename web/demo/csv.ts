/** RFC 4180 CSV (quotes, escaped quotes, newlines in fields) → rows of objects by header. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((f) => f.trim()));
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ""])));
}

/** CSV with header, or JSONL; needs a `text` column, optional `label` and `confidence`. */
export function parseExamples(text: string): { text: string; label?: string; weight?: number }[] {
  const trimmed = text.trim();
  const rows: Record<string, unknown>[] = trimmed.startsWith("{")
    ? trimmed.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l))
    : parseCsv(trimmed);
  return rows
    .filter((r) => typeof r.text === "string" && (r.text as string).trim())
    .map((r) => ({
      text: (r.text as string).trim(),
      label: typeof r.label === "string" && r.label.trim() ? r.label.trim() : undefined,
      weight: r.confidence !== undefined && r.confidence !== "" ? Number(r.confidence) : undefined,
    }));
}
