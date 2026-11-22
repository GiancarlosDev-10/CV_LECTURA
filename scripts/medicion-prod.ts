/**
 * Corrida OFICIAL de extracción en producción (E05 5.7, CP-016 y CP-017).
 * Por cada CV del dataset crea un postulante ficticio (medicion-c<N>-cv-NN@example.com), entra a
 * https://cv-lectura.vercel.app con Playwright como lo haría una persona, sube el PDF con su
 * consentimiento y espera a que producción (Vercel + OpenAI) lo procese. Luego lee de la BD el
 * resultado y los tiempos y escribe dataset/corridas/prod-corrida-<N>.json, listo para npm run comparar.
 *   npm run medicion -- <N>        (N = 1, 2 o 3)
 * Requiere .env.prod.local (clave secreta de Supabase prod) y el Chromium de Playwright.
 * Ojo: el seed de prod borra todos los usuarios @example.com, incluidos estos; no correrlo después de medir.
 */
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "@playwright/test";
import type { Corrida } from "./comparador/corrida";

process.loadEnvFile?.(".env.prod.local");

const BASE = "https://cv-lectura.vercel.app";
const ESPERA_MAXIMA_MS = 5 * 60 * 1000;

const numero = process.argv[2];
if (!numero || !/^\d+$/.test(numero)) {
  console.error("Uso: npm run medicion -- <número de corrida>");
  process.exit(1);
}
if (process.env.ENTORNO !== "prod") {
  console.error(".env.prod.local no declara ENTORNO=prod");
  process.exit(1);
}

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false },
});

interface Caso {
  id: string;
  archivo: string;
  oferta: string;
  resultadoEsperado: { tipo: string };
}

// Igual que la corrida local: solo los CVs que llegan a procesarse (cv-39 y cv-40 se rechazan antes).
const casos: Caso[] = Array.from({ length: 38 }, (_, i) => `cv-${String(i + 1).padStart(2, "0")}`).map(
  (id) => JSON.parse(readFileSync(join("dataset/esperados", `${id}.json`), "utf8")) as Caso,
);

function verificarCommitDesplegado(): string {
  const local = execSync("git rev-parse --short HEAD").toString().trim();
  const remoto = execSync("git rev-parse --short origin/main").toString().trim();
  if (local !== remoto || execSync("git status --porcelain -- src").toString().trim()) {
    throw new Error(`El código local (${local}) no es el desplegado (origin/main ${remoto}) o hay cambios sin subir en src/`);
  }
  return local;
}

async function idsDeOfertas(): Promise<Map<string, string>> {
  const { data, error } = await db.from("ofertas").select("id, titulo").eq("estado", "abierta");
  if (error) throw error;
  return new Map(data.map((o) => [o.titulo, o.id]));
}

async function crearPostulante(email: string, clave: string): Promise<string> {
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: clave,
    email_confirm: true,
    user_metadata: { nombre: `Medición ${email.split("@")[0]}` },
  });
  if (error || !data.user) throw error ?? new Error(`No se creó ${email}`);
  return data.user.id;
}

async function main() {
  const commit = verificarCommitDesplegado();
  const ofertas = await idsDeOfertas();
  const navegador = await chromium.launch();
  const postulantes = new Map<string, string>(); // id del CV → id del postulante

  console.log(`Corrida ${numero} en producción (commit ${commit}) — subiendo ${casos.length} CVs`);
  for (const caso of casos) {
    const ofertaId = ofertas.get(caso.oferta);
    if (!ofertaId) throw new Error(`No existe la oferta abierta "${caso.oferta}"`);
    const email = `medicion-c${numero}-${caso.id}@example.com`;
    const clave = randomBytes(18).toString("base64url");
    const postulanteId = await crearPostulante(email, clave);

    const contexto = await navegador.newContext();
    const pagina = await contexto.newPage();
    try {
      await pagina.goto(`${BASE}/ingresar`);
      await pagina.fill("#email", email);
      await pagina.fill("#clave", clave);
      await pagina.press("#clave", "Enter");
      await pagina.waitForURL((url) => !url.pathname.startsWith("/ingresar"));

      // Esperar a que React se hidrate: si se elige el archivo antes, el formulario no lo registra
      await pagina.goto(`${BASE}/ofertas/${ofertaId}`);
      await pagina.waitForLoadState("networkidle");
      await pagina.setInputFiles('input[type="file"]', join("dataset/pdf", caso.archivo));
      await pagina.getByText(caso.archivo).waitFor({ timeout: 10_000 });
      await pagina.getByRole("checkbox").check();
      await pagina.getByRole("button", { name: "Enviar postulación" }).click();
      await pagina.waitForURL(/\/mis-postulaciones/, { timeout: 60_000 });
      postulantes.set(caso.id, postulanteId);
      console.log(`  ${caso.id}: enviada`);
    } catch (error) {
      console.error(`  ${caso.id}: no se pudo postular`, error instanceof Error ? error.message : error);
    } finally {
      await contexto.close();
    }
  }
  await navegador.close();

  console.log("Esperando el procesamiento en producción…");
  const limite = Date.now() + ESPERA_MAXIMA_MS;
  type Fila = {
    postulante_id: string;
    estado: string;
    motivo_revision: string | null;
    cv_extraido: unknown;
    modelo_ia: string | null;
    subido_en: string;
    fin_procesamiento: string | null;
  };
  let filas: Fila[] = [];
  for (;;) {
    const { data, error } = await db
      .from("postulaciones")
      .select("postulante_id, estado, motivo_revision, cv_extraido, modelo_ia, subido_en, fin_procesamiento")
      .in("postulante_id", [...postulantes.values()]);
    if (error) throw error;
    filas = data as Fila[];
    const pendientes = filas.filter((f) => f.estado === "recibida" || f.estado === "procesando").length;
    if (pendientes === 0 || Date.now() > limite) break;
    await new Promise((r) => setTimeout(r, 5000));
  }

  const porPostulante = new Map(filas.map((f) => [f.postulante_id, f]));
  const resultados: Corrida["resultados"] = [];
  const tiempos: { id: string; segundos: number }[] = [];
  for (const [id, postulanteId] of postulantes) {
    const f = porPostulante.get(postulanteId);
    if (!f) continue;
    if (f.estado === "procesada") resultados.push({ id, estado: "procesada", cvExtraido: f.cv_extraido as never });
    else if (f.estado === "pendiente_revision_manual") resultados.push({ id, estado: "pendiente_revision_manual", motivo: f.motivo_revision ?? "" });
    if (f.fin_procesamiento) {
      tiempos.push({ id, segundos: (Date.parse(f.fin_procesamiento) - Date.parse(f.subido_en)) / 1000 });
    }
  }

  const modelos = [...new Set(filas.map((f) => f.modelo_ia).filter(Boolean))];
  const corrida = {
    corrida: `prod-corrida-${numero}`,
    entorno: "prod" as const,
    modelo: modelos.join(", ") || "desconocido",
    commit,
    fecha: new Date().toISOString(),
    resultados,
    tiempos,
  };
  mkdirSync("dataset/corridas", { recursive: true });
  const salida = `dataset/corridas/prod-corrida-${numero}.json`;
  writeFileSync(salida, JSON.stringify(corrida, null, 2));
  const sinTerminar = filas.filter((f) => f.estado === "recibida" || f.estado === "procesando").length;
  console.log(`\n${resultados.length} resultados (${sinTerminar} sin terminar) → ${salida}\nSiguiente: npm run comparar -- ${salida}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
