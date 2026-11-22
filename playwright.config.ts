import { defineConfig, devices } from "@playwright/test";

/**
 * CP-024 (RQ-FUN-04, RQ-FLE-01, RQ-SEG-05): flujos de M1–M6 contra producción en 4 perfiles.
 *   npx playwright test        (requiere .env.prod.local con SUPABASE_SECRET_KEY y SEED_CLAVE)
 * El reporte HTML queda en docs/evidencias/e2e/reporte como evidencia.
 */
export default defineConfig({
  testDir: "pruebas/e2e",
  timeout: 90_000,
  workers: 2,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "docs/evidencias/e2e/reporte", open: "never" }]],
  use: {
    baseURL: "https://cv-lectura.vercel.app",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
});
