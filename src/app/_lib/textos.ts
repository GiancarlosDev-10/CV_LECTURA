/** Explicación legible de cada motivo de revisión manual (dominio/entidades/postulacion). */
export const MOTIVOS_REVISION: Record<string, string> = {
  PDF_ILEGIBLE: "El archivo PDF no se pudo leer",
  PDF_SIN_TEXTO: "El PDF no tiene texto seleccionable (¿escaneado?)",
  IA_TIEMPO_AGOTADO: "La IA no respondió a tiempo",
  IA_ERROR: "El servicio de IA devolvió un error",
  RESPUESTA_IA_INVALIDA: "La IA devolvió datos con formato inválido",
  ERROR_INESPERADO: "Error inesperado al procesar",
};

export const NIVEL_EDUCATIVO: Record<string, string> = {
  secundaria: "Secundaria",
  tecnico: "Técnico",
  universitario: "Universitario",
  maestria: "Maestría",
  doctorado: "Doctorado",
};

/** "1 año", "3 años", "— años" si no se conoce */
export function textoAnios(n: number | null | undefined): string {
  if (n === null || n === undefined) return "— años";
  return `${String(n).replace(".", ",")} ${n === 1 ? "año" : "años"}`;
}
