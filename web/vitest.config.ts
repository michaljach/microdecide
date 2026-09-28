import { defaultServerConditions } from "vite";
import { defineConfig } from "vitest/config";

// @nodd/* resolve to their TypeScript sources (packages/*/src), not dist/
const conditions = ["@nodd/source", ...defaultServerConditions];

export default defineConfig({
  resolve: { conditions },
  ssr: { resolve: { conditions } },
  test: { root: import.meta.dirname, include: ["test/**/*.test.ts"] },
});
