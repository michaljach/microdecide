import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { crc32, zip } from "../src/zip";

describe("zip", () => {
  it("crc32 matches the standard check value", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
  });
  it("produces an archive python's zipfile can read", () => {
    const bytes = zip({ "m/a.json": new TextEncoder().encode('{"x":1}'), "m/static/b.bin": new Uint8Array([1, 2, 3, 255]) });
    const path = join(mkdtempSync(join(tmpdir(), "zip-")), "t.zip");
    writeFileSync(path, bytes);
    const out = execFileSync("python3", ["-c", `import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print(z.namelist(), z.read('m/static/b.bin').hex(), z.read('m/a.json').decode())`, path]).toString();
    expect(out.trim()).toBe(`['m/a.json', 'm/static/b.bin'] 010203ff {"x":1}`);
  });
});
