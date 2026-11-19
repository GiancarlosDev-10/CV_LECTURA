/**
 * Reinicia los datos de prueba de un proyecto Supabase (npm run seed).
 * Crea 2 reclutadores, 3 postulantes y 3 ofertas. Todos los datos son ficticios (dominio example.com).
 * Dev:  SEED_PERMITIR=dev npm run seed
 * Prod: SEED_ARCHIVO_ENV=.env.prod.local SEED_PERMITIR=prod npm run seed  (contraseña privada SEED_CLAVE)
 */
import { createClient } from "@supabase/supabase-js";
import { PESOS_POR_DEFECTO, RequisitosOfertaSchema, type RequisitosOferta } from "../src/dominio/entidades/oferta";

// Por defecto .env.local (dev). Para prod: SEED_ARCHIVO_ENV=.env.prod.local SEED_PERMITIR=prod
process.loadEnvFile?.(process.env.SEED_ARCHIVO_ENV ?? ".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const claveSecreta = process.env.SUPABASE_SECRET_KEY;
const entorno = process.env.ENTORNO ?? "";
if (!url || !claveSecreta || !entorno) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY o ENTORNO en el archivo de entorno");
  process.exit(1);
}
// Doble confirmación: el entorno declarado en el archivo debe coincidir con el que se autoriza
if (process.env.SEED_PERMITIR !== entorno) {
  console.error(`Por seguridad, ejecuta con SEED_PERMITIR=${entorno} (confirma que el archivo apunta a ${entorno}).`);
  process.exit(1);
}
// En prod la contraseña de las cuentas de prueba NO puede ser la publicada en el repo
if (entorno === "prod" && !process.env.SEED_CLAVE) {
  console.error("En prod se requiere SEED_CLAVE (contraseña privada de las cuentas de prueba).");
  process.exit(1);
}

const db = createClient(url, claveSecreta, { auth: { persistSession: false } });
const CLAVE_PRUEBA = process.env.SEED_CLAVE ?? "Prueba#2026";

const RECLUTADORES = [
  { email: "reclutador1@example.com", nombre: "Reclutador Uno" },
  { email: "reclutador2@example.com", nombre: "Reclutador Dos" },
];
const POSTULANTES = [
  { email: "postulante1@example.com", nombre: "Postulante Uno" },
  { email: "postulante2@example.com", nombre: "Postulante Dos" },
  { email: "postulante3@example.com", nombre: "Postulante Tres" },
];

const OFERTAS: { titulo: string; descripcion: string; requisitos: RequisitosOferta }[] = [
  {
    titulo: "Desarrollador Full Stack Junior",
    descripcion: "Desarrollo de aplicaciones web con React y Node.js.",
    requisitos: {
      habilidadesObligatorias: ["JavaScript", "React", "Node.js", "SQL"],
      habilidadesDeseables: ["TypeScript", "Docker"],
      aniosExperiencia: 2,
      nivelEducativo: "tecnico",
      idiomas: [{ idioma: "Inglés", nivel: "B1" }],
      pesos: PESOS_POR_DEFECTO,
    },
  },
  {
    titulo: "Analista de Datos",
    descripcion: "Análisis y visualización de datos para el área comercial.",
    requisitos: {
      habilidadesObligatorias: ["Python", "SQL", "Power BI", "Excel"],
      habilidadesDeseables: ["Pandas", "Estadística"],
      aniosExperiencia: 3,
      nivelEducativo: "universitario",
      idiomas: [{ idioma: "Inglés", nivel: "B2" }],
      pesos: { obligatorias: 45, deseables: 15, experiencia: 20, educacion: 10, idiomas: 10 },
    },
  },
  {
    titulo: "Asistente de Recursos Humanos",
    descripcion: "Apoyo en reclutamiento y gestión de planillas.",
    requisitos: {
      habilidadesObligatorias: ["Reclutamiento", "Gestión de planillas", "Excel"],
      habilidadesDeseables: ["SAP", "Comunicación efectiva"],
      aniosExperiencia: 1,
      nivelEducativo: "tecnico",
      idiomas: [],
      pesos: { obligatorias: 40, deseables: 20, experiencia: 25, educacion: 15, idiomas: 0 },
    },
  },
];

async function eliminarUsuariosDePrueba() {
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const deSeed = data.users.filter((u) => u.email?.endsWith("@example.com"));
  const ids = deSeed.map((u) => u.id);
  if (ids.length === 0) return;

  // Orden por claves foráneas: archivos → postulaciones (cascade con ofertas) → ofertas →
  // registro de vistas (apunta al reclutador, sin cascade) → usuarios
  const { data: archivos } = await db.storage.from("cvs").list("", { limit: 1000 });
  for (const carpeta of archivos ?? []) {
    if (!ids.includes(carpeta.name)) continue;
    const { data: pdfs } = await db.storage.from("cvs").list(carpeta.name);
    await db.storage.from("cvs").remove((pdfs ?? []).map((f) => `${carpeta.name}/${f.name}`));
  }
  await db.from("ofertas").delete().in("reclutador_id", ids);
  const { error: errorAccesos } = await db.from("accesos_cv").delete().in("reclutador_id", ids);
  if (errorAccesos) throw errorAccesos;
  for (const id of ids) {
    const { error: e } = await db.auth.admin.deleteUser(id);
    if (e) throw e;
  }
  console.log(`  eliminados ${ids.length} usuarios de prueba previos`);
}

async function crearUsuario(email: string, nombre: string): Promise<string> {
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: CLAVE_PRUEBA,
    email_confirm: true,
    user_metadata: { nombre },
  });
  if (error || !data.user) throw error ?? new Error(`No se creó ${email}`);
  return data.user.id;
}

async function main() {
  console.log(`Seed ${entorno.toUpperCase()} →`, url);
  await eliminarUsuariosDePrueba();

  const idsReclutadores: string[] = [];
  for (const r of RECLUTADORES) {
    const id = await crearUsuario(r.email, r.nombre);
    // El rol solo se asigna con la clave secreta (no existe política de UPDATE para usuarios)
    const { error } = await db.from("perfiles").update({ rol: "reclutador" }).eq("id", id);
    if (error) throw error;
    idsReclutadores.push(id);
  }
  for (const p of POSTULANTES) await crearUsuario(p.email, p.nombre);

  const filas = OFERTAS.map((o, i) => ({
    reclutador_id: idsReclutadores[i % idsReclutadores.length],
    titulo: o.titulo,
    descripcion: o.descripcion,
    requisitos: RequisitosOfertaSchema.parse(o.requisitos),
  }));
  const { error } = await db.from("ofertas").insert(filas);
  if (error) throw error;

  console.log(`  ${RECLUTADORES.length} reclutadores, ${POSTULANTES.length} postulantes, ${OFERTAS.length} ofertas`);
  console.log(
    entorno === "prod"
      ? "  contraseña de las cuentas de prueba: la de SEED_CLAVE en .env.prod.local"
      : `  contraseña de todas las cuentas de prueba: ${CLAVE_PRUEBA}`,
  );
}

main().catch((error) => {
  console.error("Seed fallido:", error);
  process.exit(1);
});
