import { z } from "zod";
import { CONSENTIMIENTO_VIGENTE } from "@/dominio/entidades/consentimiento";
import type { DatosDelPostulante, Reloj } from "@/dominio/puertos";

export interface SolicitudPostulacion {
  postulanteId: string;
  ofertaId: string;
  postulacionId: string;
  aceptaConsentimiento: boolean;
  versionConsentimiento: string;
}

export type ErrorPostulacion =
  | "SOLICITUD_INVALIDA"
  | "CONSENTIMIENTO_REQUERIDO"
  | "CONSENTIMIENTO_DESACTUALIZADO"
  | "ARCHIVO_NO_ENCONTRADO"
  | "ARCHIVO_NO_ES_PDF"
  | "YA_POSTULO"
  | "OFERTA_NO_DISPONIBLE";

export type ResultadoPostulacion = { ok: true; postulacionId: string } | { ok: false; error: ErrorPostulacion };

/** Todo PDF válido empieza con estos bytes ("%PDF-"); la extensión del archivo no basta. */
const FIRMA_PDF = [0x25, 0x50, 0x44, 0x46, 0x2d];

const Identificadores = z.object({
  postulanteId: z.uuid(),
  ofertaId: z.uuid(),
  postulacionId: z.uuid(),
});

/**
 * El navegador ya subió el PDF a {postulanteId}/{postulacionId}.pdf. Aquí se verifica
 * el consentimiento (RQ-SEG-03) y la firma real del archivo antes de registrar la postulación.
 * Si algo falla, el archivo subido se borra para no dejar datos personales huérfanos.
 */
export async function postularAOferta(
  s: SolicitudPostulacion,
  deps: { datos: DatosDelPostulante; reloj: Reloj },
): Promise<ResultadoPostulacion> {
  const { datos, reloj } = deps;

  if (!Identificadores.safeParse(s).success) {
    return { ok: false, error: "SOLICITUD_INVALIDA" };
  }
  const rutaCv = `${s.postulanteId}/${s.postulacionId}.pdf`;
  const rechazar = async (error: ErrorPostulacion): Promise<ResultadoPostulacion> => {
    await datos.eliminarArchivos([rutaCv]);
    return { ok: false, error };
  };

  if (!s.aceptaConsentimiento) return rechazar("CONSENTIMIENTO_REQUERIDO");
  if (s.versionConsentimiento !== CONSENTIMIENTO_VIGENTE.version) return rechazar("CONSENTIMIENTO_DESACTUALIZADO");

  const inicio = await datos.leerInicioDelCv(rutaCv, FIRMA_PDF.length);
  if (!inicio) return { ok: false, error: "ARCHIVO_NO_ENCONTRADO" };
  if (!FIRMA_PDF.every((byte, i) => inicio[i] === byte)) return rechazar("ARCHIVO_NO_ES_PDF");

  const resultado = await datos.crearPostulacion({
    id: s.postulacionId,
    ofertaId: s.ofertaId,
    postulanteId: s.postulanteId,
    rutaCv,
    consentimientoVersion: s.versionConsentimiento,
    consentimientoEn: reloj(),
  });
  if (resultado === "duplicada") return rechazar("YA_POSTULO");
  if (resultado === "oferta_no_disponible") return rechazar("OFERTA_NO_DISPONIBLE");

  return { ok: true, postulacionId: s.postulacionId };
}
