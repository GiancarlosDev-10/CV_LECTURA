/**
 * Prepara en producción lo que necesitan CP-048 (tarea 3) y CP-050 para que el equipo los haga sin supervisión:
 * un reclutador exclusivo de usabilidad y dos ofertas suyas con CVs ya procesados.
 *   U1 "Asistente de Recursos Humanos — Sede Norte": 5 CVs (CP-048, tarea 3)
 *   U2 "Analista de Datos — Sede Sur": 10 CVs (CP-050, revisión a mano frente al sistema)
 * Son ofertas distintas para que ver el ranking en CP-048 no sesgue la revisión a mano de CP-050.
 *   npm run usabilidad:preparar        (requiere .env.prod.local; idempotente: no repite lo que ya existe)
 * La contraseña del reclutador de usabilidad se genera una vez y se guarda en .env.prod.local (USABILIDAD_CLAVE).
 */
import { randomBytes } from "node:crypto";
import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "@playwright/test";
import { RequisitosOfertaSchema, type RequisitosOferta } from "../src/dominio/entidades/oferta";

process.loadEnvFile?.(".env.prod.local");
if (process.env.ENTORNO !== "prod") throw new Error(".env.prod.local no declara ENTORNO=prod");

const BASE = "https://cv-lectura.vercel.app";
const RECLUTADOR = "reclutador.usabilidad@example.com";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false },
});

const OFERTAS: { clave: string; titulo: string; descripcion: string; requisitos: RequisitosOferta; cvs: string[] }[] = [
  {
    clave: "u1",
    titulo: "Asistente de Recursos Humanos — Sede Norte",
    descripcion: "Apoyo en reclutamiento y gestión de planillas (oferta de la prueba de usabilidad).",
    requisitos: {
      habilidadesObligatorias: ["Reclutamiento", "Gestión de planillas", "Excel"],
      habilidadesDeseables: ["SAP", "Comunicación efectiva"],
      aniosExperiencia: 1,
      nivelEducativo: "tecnico",
      idiomas: [],
      pesos: { obligatorias: 40, deseables: 20, experiencia: 25, educacion: 15, idiomas: 0 },
    },
    cvs: ["cv-06-cambria-barras", "cv-17-docs-azul-tabla", "cv-01-times-centrado", "cv-11-moderno-sans", "cv-25-canva-minimal"],
  },
  {
    clave: "u2",
    titulo: "Analista de Datos — Sede Sur",
    descripcion: "Análisis y visualización de datos para el área comercial (oferta de la revisión de 10 CVs).",
    requisitos: {
      habilidadesObligatorias: ["Python", "SQL", "Power BI", "Excel"],
      habilidadesDeseables: ["Pandas", "Estadística"],
      aniosExperiencia: 3,
      nivelEducativo: "universitario",
      idiomas: [{ idioma: "Inglés", nivel: "B2" }],
      pesos: { obligatorias: 45, deseables: 15, experiencia: 20, educacion: 10, idiomas: 10 },
    },
    cvs: [
      "cv-04-times-centrado", "cv-10-moderno-sans", "cv-16-docs-azul-tabla", "cv-28-dos-columnas", "cv-07-cambria-barras",
      "cv-22-canva-elegante", "cv-34-times-centrado", "cv-03-times-centrado", "cv-13-clasico-numerado", "cv-24-canva-minimal",
    ],
  },
];

async function usuarioPorEmail(email: string) {
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  return data.users.find((u) => u.email === email);
}

async function asegurarReclutador(): Promise<string> {
  let clave = process.env.USABILIDAD_CLAVE;
  if (!clave) {
    clave = `Usab-${randomBytes(9).toString("base64url")}`;
    appendFileSync(".env.prod.local", `\n# Reclutador exclusivo de la prueba de usabilidad (CP-048, CP-050)\nUSABILIDAD_CLAVE=${clave}\n`);
  }
  const existente = await usuarioPorEmail(RECLUTADOR);
  if (existente) return existente.id;
  const { data, error } = await db.auth.admin.createUser({
    email: RECLUTADOR,
    password: clave,
    email_confirm: true,
    user_metadata: { nombre: "Reclutador de Usabilidad" },
  });
  if (error || !data.user) throw error ?? new Error("No se creó el reclutador");
  const { error: e } = await db.from("perfiles").update({ rol: "reclutador" }).eq("id", data.user.id);
  if (e) throw e;
  return data.user.id;
}

async function asegurarOferta(reclutadorId: string, o: (typeof OFERTAS)[number]): Promise<string> {
  const { data } = await db.from("ofertas").select("id").eq("titulo", o.titulo).eq("reclutador_id", reclutadorId).maybeSingle();
  if (data) return data.id;
  const { data: nueva, error } = await db
    .from("ofertas")
    .insert({ reclutador_id: reclutadorId, titulo: o.titulo, descripcion: o.descripcion, requisitos: RequisitosOfertaSchema.parse(o.requisitos) })
    .select("id")
    .single();
  if (error) throw error;
  return nueva.id;
}

async function main() {
  const reclutadorId = await asegurarReclutador();
  const navegador = await chromium.launch();
  const ids: Record<string, string> = {};

  for (const o of OFERTAS) {
    const ofertaId = await asegurarOferta(reclutadorId, o);
    ids[o.clave] = ofertaId;
    for (const cv of o.cvs) {
      const email = `usab-${o.clave}-${cv.slice(0, 5)}@example.com`;
      if (await usuarioPorEmail(email)) continue;
      const clave = randomBytes(18).toString("base64url");
      const { error } = await db.auth.admin.createUser({ email, password: clave, email_confirm: true, user_metadata: { nombre: `Usabilidad ${cv.slice(0, 5)}` } });
      if (error) throw error;

      const contexto = await navegador.newContext();
      const pagina = await contexto.newPage();
      await pagina.goto(`${BASE}/ingresar`);
      await pagina.waitForLoadState("networkidle");
      await pagina.fill("#email", email);
      await pagina.fill("#clave", clave);
      await pagina.press("#clave", "Enter");
      await pagina.waitForURL((url) => !url.pathname.startsWith("/ingresar"));
      await pagina.goto(`${BASE}/ofertas/${ofertaId}`);
      await pagina.waitForLoadState("networkidle");
      await pagina.setInputFiles('input[type="file"]', join("dataset/pdf", `${cv}.pdf`));
      await pagina.getByText(`${cv}.pdf`).waitFor({ timeout: 10_000 });
      await pagina.getByRole("checkbox").check();
      await pagina.getByRole("button", { name: "Enviar postulación" }).click();
      await pagina.waitForURL(/\/mis-postulaciones/, { timeout: 60_000 });
      await contexto.close();
      console.log(`  ${o.clave}: ${cv} enviado`);
    }
  }
  await navegador.close();

  // Espera el procesamiento y muestra el ranking resultante
  for (const o of OFERTAS) {
    for (let i = 0; i < 40; i++) {
      const { data } = await db.from("postulaciones").select("estado").eq("oferta_id", ids[o.clave]);
      if (data && data.length === o.cvs.length && data.every((p) => p.estado !== "recibida" && p.estado !== "procesando")) break;
      await new Promise((r) => setTimeout(r, 3000));
    }
    const { data } = await db.from("postulaciones").select("estado, puntaje, cv_extraido").eq("oferta_id", ids[o.clave]).order("puntaje", { ascending: false });
    console.log(`\n${o.titulo} (${ids[o.clave]}):`);
    for (const p of data ?? []) console.log(`  ${p.puntaje ?? "—"}  ${(p.cv_extraido as { nombre?: string } | null)?.nombre ?? ""}  [${p.estado}]`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
