/**
 * Verifica la RLS y los permisos de la base de datos real (proyecto DEV) iniciando
 * sesión como cada usuario de prueba del seed. Evidencia de RQ-SEG-01 y RQ-SEG-04.
 * Requiere: .env.local con el proyecto DEV y `SEED_PERMITIR=dev npm run seed`.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

process.loadEnvFile?.(".env.local");

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const CLAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const CLAVE_PRUEBA = process.env.SEED_CLAVE ?? "Prueba#2026";

const nuevoCliente = () => createClient(URL_SUPABASE, CLAVE_PUBLICA, { auth: { persistSession: false } });

async function sesion(email: string): Promise<{ db: SupabaseClient; id: string }> {
  const db = nuevoCliente();
  const { data, error } = await db.auth.signInWithPassword({ email, password: CLAVE_PRUEBA });
  if (error || !data.user) throw new Error(`No se pudo iniciar sesión como ${email}: ${error?.message}`);
  return { db, id: data.user.id };
}

const PDF_MINIMO = new TextEncoder().encode("%PDF-1.4\n%prueba de integracion\n%%EOF");

let anonimo: SupabaseClient;
let reclutador1: Awaited<ReturnType<typeof sesion>>;
let reclutador2: Awaited<ReturnType<typeof sesion>>;
let postulante1: Awaited<ReturnType<typeof sesion>>;
let postulante2: Awaited<ReturnType<typeof sesion>>;
let ofertaDeReclutador1: string;
let postulacionId: string;
let rutaCv: string;

beforeAll(async () => {
  anonimo = nuevoCliente();
  [reclutador1, reclutador2, postulante1, postulante2] = await Promise.all([
    sesion("reclutador1@example.com"),
    sesion("reclutador2@example.com"),
    sesion("postulante1@example.com"),
    sesion("postulante2@example.com"),
  ]);

  const { data: ofertas } = await reclutador1.db.from("ofertas").select("id").eq("reclutador_id", reclutador1.id);
  ofertaDeReclutador1 = ofertas![0].id;

  // Postulación real de postulante1 a una oferta de reclutador1 (CV + fila)
  postulacionId = crypto.randomUUID();
  rutaCv = `${postulante1.id}/${postulacionId}.pdf`;
  const subida = await postulante1.db.storage.from("cvs").upload(rutaCv, PDF_MINIMO, { contentType: "application/pdf" });
  if (subida.error) throw subida.error;
  const { error } = await postulante1.db.from("postulaciones").insert({
    id: postulacionId,
    oferta_id: ofertaDeReclutador1,
    postulante_id: postulante1.id,
    ruta_cv: rutaCv,
    consentimiento_version: "v1-prueba",
    consentimiento_en: new Date().toISOString(),
  });
  if (error) throw error;
});

afterAll(async () => {
  await postulante1?.db.from("postulaciones").delete().eq("id", postulacionId);
  await postulante1?.db.storage.from("cvs").remove([rutaCv]);
});

describe("usuario sin sesión (anon)", () => {
  it("no puede leer ofertas ni postulaciones", async () => {
    const ofertas = await anonimo.from("ofertas").select("id");
    const postulaciones = await anonimo.from("postulaciones").select("id");
    expect(ofertas.data ?? []).toHaveLength(0);
    expect(postulaciones.data ?? []).toHaveLength(0);
  });

  it("no puede descargar un CV aunque conozca la ruta", async () => {
    const { data } = await anonimo.storage.from("cvs").download(rutaCv);
    expect(data).toBeNull();
  });
});

describe("perfiles y roles", () => {
  it("cada usuario ve solo su propio perfil", async () => {
    const { data } = await postulante1.db.from("perfiles").select("id");
    expect(data?.map((p) => p.id)).toEqual([postulante1.id]);
  });

  it("un postulante no puede ascenderse a reclutador", async () => {
    await postulante1.db.from("perfiles").update({ rol: "reclutador" }).eq("id", postulante1.id);
    const { data } = await postulante1.db.from("perfiles").select("rol").single();
    expect(data?.rol).toBe("postulante");
  });
});

describe("ofertas", () => {
  it("un postulante no puede crear ofertas", async () => {
    const { error } = await postulante1.db.from("ofertas").insert({
      reclutador_id: postulante1.id,
      titulo: "Oferta falsa",
      requisitos: {},
    });
    expect(error).not.toBeNull();
  });

  it("un reclutador no puede crear ofertas a nombre de otro", async () => {
    const { error } = await reclutador1.db.from("ofertas").insert({
      reclutador_id: reclutador2.id,
      titulo: "Suplantación",
      requisitos: {},
    });
    expect(error).not.toBeNull();
  });

  it("un reclutador no puede modificar la oferta de otro", async () => {
    await reclutador2.db.from("ofertas").update({ titulo: "Modificada por otro" }).eq("id", ofertaDeReclutador1);
    const { data } = await reclutador1.db.from("ofertas").select("titulo").eq("id", ofertaDeReclutador1).single();
    expect(data?.titulo).not.toBe("Modificada por otro");
  });
});

describe("postulaciones (confidencialidad entre reclutadores y postulantes)", () => {
  it("el reclutador dueño de la oferta ve la postulación", async () => {
    const { data } = await reclutador1.db.from("postulaciones").select("id").eq("id", postulacionId);
    expect(data).toHaveLength(1);
  });

  it("otro reclutador NO ve la postulación", async () => {
    const { data } = await reclutador2.db.from("postulaciones").select("id").eq("id", postulacionId);
    expect(data ?? []).toHaveLength(0);
  });

  it("otro postulante NO ve la postulación", async () => {
    const { data } = await postulante2.db.from("postulaciones").select("id").eq("id", postulacionId);
    expect(data ?? []).toHaveLength(0);
  });

  it("un postulante no puede asignarse puntaje al postular", async () => {
    const { error } = await postulante2.db.from("postulaciones").insert({
      oferta_id: ofertaDeReclutador1,
      postulante_id: postulante2.id,
      ruta_cv: `${postulante2.id}/trampa.pdf`,
      puntaje: 100,
      consentimiento_version: "v1-prueba",
      consentimiento_en: new Date().toISOString(),
    });
    expect(error).not.toBeNull();
  });

  it("un postulante no puede modificar el estado ni el puntaje de su postulación", async () => {
    await postulante1.db.from("postulaciones").update({ puntaje: 100, estado: "procesada" }).eq("id", postulacionId);
    const { data } = await reclutador1.db.from("postulaciones").select("puntaje, estado").eq("id", postulacionId).single();
    expect(data).toEqual({ puntaje: null, estado: "recibida" });
  });
});

describe("archivos de CV (bucket privado)", () => {
  it("el reclutador dueño de la oferta puede descargar el CV", async () => {
    const { data, error } = await reclutador1.db.storage.from("cvs").download(rutaCv);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  it("otro reclutador NO puede descargar el CV", async () => {
    const { data } = await reclutador2.db.storage.from("cvs").download(rutaCv);
    expect(data).toBeNull();
  });

  it("un postulante no puede subir archivos en la carpeta de otro", async () => {
    const { error } = await postulante2.db.storage
      .from("cvs")
      .upload(`${postulante1.id}/intruso.pdf`, PDF_MINIMO, { contentType: "application/pdf" });
    expect(error).not.toBeNull();
  });

  it("el bucket rechaza archivos que no son PDF", async () => {
    const { error } = await postulante2.db.storage
      .from("cvs")
      .upload(`${postulante2.id}/virus.exe`, new Uint8Array([77, 90]), { contentType: "application/x-msdownload" });
    expect(error).not.toBeNull();
  });
});

describe("derecho de cancelación (ARCO)", () => {
  it("el postulante elimina su postulación y su CV; nadie más puede verlos", async () => {
    const id = crypto.randomUUID();
    const ruta = `${postulante2.id}/${id}.pdf`;
    const ofertasAbiertas = await postulante2.db.from("ofertas").select("id").neq("id", ofertaDeReclutador1).limit(1);
    const ofertaId = ofertasAbiertas.data![0].id;

    await postulante2.db.storage.from("cvs").upload(ruta, PDF_MINIMO, { contentType: "application/pdf" });
    const insercion = await postulante2.db.from("postulaciones").insert({
      id,
      oferta_id: ofertaId,
      postulante_id: postulante2.id,
      ruta_cv: ruta,
      consentimiento_version: "v1-prueba",
      consentimiento_en: new Date().toISOString(),
    });
    expect(insercion.error).toBeNull();

    const borrado = await postulante2.db.from("postulaciones").delete().eq("id", id);
    const archivo = await postulante2.db.storage.from("cvs").remove([ruta]);
    expect(borrado.error).toBeNull();
    expect(archivo.error).toBeNull();

    const quedan = await postulante2.db.from("postulaciones").select("id").eq("id", id);
    const descarga = await postulante2.db.storage.from("cvs").download(ruta);
    expect(quedan.data ?? []).toHaveLength(0);
    expect(descarga.data).toBeNull();
  });
});
