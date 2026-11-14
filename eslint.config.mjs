import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Regla de dependencias de la arquitectura hexagonal (PLAN §5, RQ-MAN-03):
// Presentación e Infraestructura → Aplicación → Dominio. Nunca hacia afuera.
const EXTERNOS = ["next", "next/*", "react", "react-dom", "@supabase/*", "openai", "openai/*", "unpdf"];
const capa = (nombres) => nombres.flatMap((n) => [`@/${n}`, `@/${n}/**`, `**/${n}`, `**/${n}/**`]);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/dominio/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: capa(["aplicacion", "infraestructura", "app"]),
              message: "El dominio no puede depender de otras capas.",
            },
            { group: EXTERNOS, message: "El dominio es TypeScript puro: sin frameworks ni servicios externos." },
          ],
        },
      ],
    },
  },
  {
    files: ["src/aplicacion/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: capa(["infraestructura", "app"]),
              message: "La aplicación solo depende del dominio (usa los puertos).",
            },
            { group: EXTERNOS, message: "La aplicación no usa frameworks ni servicios externos directamente." },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
]);

export default eslintConfig;
