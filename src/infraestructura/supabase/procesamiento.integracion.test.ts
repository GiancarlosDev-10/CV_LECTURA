/**
 * Flujo completo contra Supabase DEV con los adaptadores reales (Storage, repositorio, unpdf)
 * y el extractor simulado: postulación → procesarCv → estado y puntaje guardados.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { procesarCv } from "@/aplicacion/procesarCv";
import { postularAOferta } from "@/aplicacion/postularAOferta";
import { CONSENTIMIENTO_VIGENTE } from "@/dominio/entidades/consentimiento";
import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import { ExtractorCvSimulado } from "@/infraestructura/openai/ExtractorCvSimulado";
import { LectorPdfUnpdf } from "@/infraestructura/pdf/LectorPdfUnpdf";
import { crearPdfDePrueba } from "@/infraestructura/pdf/pdfDePrueba";
import { AlmacenArchivosSupabase } from "./AlmacenArchivosSupabase";
import { DatosDelPostulanteSupabase } from "./DatosDelPostulanteSupabase";
import { RepositorioPostulacionesSupabase } from "./RepositorioPostulacionesSupabase";

// Dev por defecto; contra prod: INTEGRACION_ARCHIVO_ENV=.env.prod.local npm run test:integracion
process.loadEnvFile?.(process.env.INTEGRACION_ARCHIVO_ENV ?? ".env.local");

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const servicio = createClient(URL_SUPABASE, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });

const CV_DE_PRUEBA: CvExtraido = {
  nombre: "Ana Torres",
  email: "ana.torres@example.com",
  telefono: null,
  aniosExperiencia: 3,
  nivelEducativo: "tecnico",
  habilidades: ["JavaScript", "React", "Node.js", "SQL", "Docker"],
  idiomas: [{ idioma: "Inglés", nivel: "B2" }],
};

let postulante: { db: SupabaseClient; id: string };
// Un postulante solo puede postular una vez por oferta: cada caso usa una oferta distinta.
let ofertas: string[];
const creadas: { id: string; ruta: string }[] = [];

beforeAll(async () => {
  const db = createClient(URL_SUPABASE, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
  const { data } = await db.auth.signInWithPassword({ email: "postulante3@example.com", password: process.env.SEED_CLAVE ?? "Prueba#2026" });
  postulante = { db, id: data.user!.id };
  const { data: lista } = await db.from("ofertas").select("id, titulo").order("titulo");
  // Orden alfabético: Analista de Datos, Asistente de RRHH, Desarrollador Full Stack Junior
  ofertas = lista!.map((o) => o.id);
});

afterAll(async () => {
  for (const { id, ruta } of creadas) {
    await postulante.db.storage.from("cvs").remove([ruta]);
    await postulante.db.from("postulaciones").delete().eq("id", id);
  }
});

async function postularCon(ofertaId: string, pdf: Uint8Array) {
  const id = crypto.randomUUID();
  const ruta = `${postulante.id}/${id}.pdf`;
  creadas.push({ id, ruta });
  await postulante.db.storage.from("cvs").upload(ruta, pdf, { contentType: "application/pdf" });
  const resultado = await postularAOferta(
    { postulanteId: postulante.id, ofertaId, postulacionId: id, aceptaConsentimiento: true, versionConsentimiento: CONSENTIMIENTO_VIGENTE.version },
    { datos: new DatosDelPostulanteSupabase(postulante.db, postulante.id, () => servicio), reloj: () => new Date() },
  );
  expect(resultado).toEqual({ ok: true, postulacionId: id });
  return id;
}

const deps = (extractor: ExtractorCvSimulado) => ({
  repositorio: new RepositorioPostulacionesSupabase(servicio),
  almacen: new AlmacenArchivosSupabase(servicio),
  lectorPdf: new LectorPdfUnpdf(),
  extractorCv: extractor,
  reloj: () => new Date(),
});

describe("procesamiento de un CV de punta a punta (Supabase DEV)", () => {
  it("un PDF con texto queda 'procesada' con puntaje, desglose y marcas de tiempo", async () => {
    const id = await postularCon(
      ofertas[2],
      crearPdfDePrueba(
        "Ana Torres - Desarrolladora web",
        "ana.torres@example.com",
        "3 años de experiencia con JavaScript, React, Node.js y SQL.",
        "Técnico en Computación e Informática. Inglés B2.",
      ),
    );

    const resultado = await procesarCv(id, deps(new ExtractorCvSimulado({ modo: "exito", respuesta: CV_DE_PRUEBA })));
    // 4/4 obligatorias (40) + 1/2 deseables: Docker sí, TypeScript no (10) + experiencia (20) + educación (10) + inglés (10)
    expect(resultado).toEqual({ estado: "procesada", total: 90 });

    const { data } = await servicio.from("postulaciones").select("*").eq("id", id).single();
    expect(data).toMatchObject({ estado: "procesada", puntaje: 90, modelo_ia: "simulado", motivo_revision: null });
    expect(data.texto_cv).toContain("Ana Torres");
    expect(new Date(data.fin_procesamiento).getTime()).toBeGreaterThanOrEqual(new Date(data.inicio_procesamiento).getTime());
  });

  it("un PDF sin texto queda en revisión manual y SIN puntaje (falla segura)", async () => {
    const id = await postularCon(ofertas[1], crearPdfDePrueba(" "));

    const resultado = await procesarCv(id, deps(new ExtractorCvSimulado({ modo: "exito", respuesta: CV_DE_PRUEBA })));
    expect(resultado).toEqual({ estado: "pendiente_revision_manual", motivo: "PDF_SIN_TEXTO" });

    const { data } = await servicio.from("postulaciones").select("estado, puntaje, motivo_revision").eq("id", id).single();
    expect(data).toEqual({ estado: "pendiente_revision_manual", puntaje: null, motivo_revision: "PDF_SIN_TEXTO" });
  });

  it("si la IA devuelve un JSON inválido, queda en revisión manual con el motivo", async () => {
    const id = await postularCon(ofertas[0], crearPdfDePrueba("Luis Quispe", "Analista con 5 años de experiencia en Python, SQL y Power BI. Inglés B2."));

    await procesarCv(id, deps(new ExtractorCvSimulado({ modo: "json_invalido" })));
    const { data } = await servicio.from("postulaciones").select("estado, puntaje, motivo_revision").eq("id", id).single();
    expect(data).toEqual({ estado: "pendiente_revision_manual", puntaje: null, motivo_revision: "RESPUESTA_IA_INVALIDA" });
  });
});
