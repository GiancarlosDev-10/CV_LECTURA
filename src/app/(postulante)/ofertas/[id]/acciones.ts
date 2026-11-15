"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { procesarCv } from "@/aplicacion/procesarCv";
import { postularAOferta, type ErrorPostulacion } from "@/aplicacion/postularAOferta";
import { requerirRol } from "@/app/_lib/sesion";
import { dependenciasProcesarCv } from "@/composicion";
import { DatosDelPostulanteSupabase } from "@/infraestructura/supabase/DatosDelPostulanteSupabase";
import { clienteServicio } from "@/infraestructura/supabase/clienteServicio";

const MENSAJES: Record<ErrorPostulacion, string> = {
  SOLICITUD_INVALIDA: "La solicitud no es válida. Recarga la página e inténtalo de nuevo.",
  CONSENTIMIENTO_REQUERIDO: "Debes aceptar el tratamiento de tus datos para postular.",
  CONSENTIMIENTO_DESACTUALIZADO: "El texto de consentimiento cambió. Recarga la página para leer la versión vigente.",
  ARCHIVO_NO_ENCONTRADO: "No se encontró el archivo subido. Inténtalo de nuevo.",
  ARCHIVO_NO_ES_PDF: "El archivo no es un PDF válido.",
  YA_POSTULO: "Ya postulaste a esta oferta.",
  OFERTA_NO_DISPONIBLE: "Esta oferta ya no recibe postulaciones.",
};

export async function postular(entrada: {
  ofertaId: string;
  postulacionId: string;
  aceptaConsentimiento: boolean;
  versionConsentimiento: string;
}): Promise<{ ok: true } | { ok: false; mensaje: string }> {
  const sesion = await requerirRol("postulante");
  const datos = new DatosDelPostulanteSupabase(sesion.db, sesion.usuarioId, clienteServicio);

  const resultado = await postularAOferta(
    { ...entrada, postulanteId: sesion.usuarioId },
    { datos, reloj: () => new Date() },
  );
  if (!resultado.ok) return { ok: false, mensaje: MENSAJES[resultado.error] };

  // La extracción con IA corre después de responder: el postulante no espera.
  after(async () => {
    try {
      await procesarCv(resultado.postulacionId, dependenciasProcesarCv());
    } catch (error) {
      console.error("procesarCv falló fuera del flujo controlado", resultado.postulacionId, error);
    }
  });

  revalidatePath("/mis-postulaciones");
  return { ok: true };
}
