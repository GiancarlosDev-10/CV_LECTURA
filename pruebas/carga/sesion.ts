/**
 * Inicia sesión en producción con postulante1 del seed (contraseña SEED_CLAVE de .env.prod.local)
 * y guarda las cookies para que k6 visite las páginas con sesión (CP-018).
 *   npx tsx pruebas/carga/sesion.ts      → escribe pruebas/carga/.cookies.json (no se sube al repo)
 */
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

process.loadEnvFile?.(".env.prod.local");

(async () => {
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext();
  const pagina = await contexto.newPage();
  await pagina.goto("https://cv-lectura.vercel.app/ingresar");
  await pagina.fill("#email", "postulante1@example.com");
  await pagina.fill("#clave", process.env.SEED_CLAVE!);
  await pagina.press("#clave", "Enter");
  await pagina.waitForURL((url) => !url.pathname.startsWith("/ingresar"));
  const cookies = (await contexto.cookies()).map(({ name, value }) => ({ name, value }));
  writeFileSync("pruebas/carga/.cookies.json", JSON.stringify(cookies));
  console.log(`Sesión guardada (${cookies.length} cookies)`);
  await navegador.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
