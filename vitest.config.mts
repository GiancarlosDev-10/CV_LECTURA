import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.integracion.test.ts", "node_modules/**"],
    environment: "node",
    coverage: {
      provider: "v8",
      // RQ-MAN-01: la cobertura se mide sobre el núcleo (dominio + aplicación).
      include: ["src/dominio/**/*.ts", "src/aplicacion/**/*.ts"],
      exclude: ["**/*.test.ts", "src/dominio/puertos/**"],
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "coverage",
      thresholds: { lines: 80 },
    },
  },
});
