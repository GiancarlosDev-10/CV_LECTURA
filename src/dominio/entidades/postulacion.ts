/**
 * Ciclo de vida de una postulación.
 * Un CV que no se pudo procesar va a "pendiente_revision_manual" y nunca
 * recibe puntaje 0 (funcionamiento seguro ante fallos, RQ-SOP-01).
 */
export const ESTADOS_POSTULACION = [
  "recibida",
  "procesando",
  "procesada",
  "pendiente_revision_manual",
] as const;

export type EstadoPostulacion = (typeof ESTADOS_POSTULACION)[number];

export const MOTIVOS_REVISION_MANUAL = [
  "PDF_ILEGIBLE",
  "PDF_SIN_TEXTO",
  "IA_TIEMPO_AGOTADO",
  "IA_ERROR",
  "RESPUESTA_IA_INVALIDA",
  "ERROR_INESPERADO",
] as const;

export type MotivoRevisionManual = (typeof MOTIVOS_REVISION_MANUAL)[number];
