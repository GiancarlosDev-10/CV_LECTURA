import type { EstadoPostulacion } from "@/dominio/entidades/postulacion";

export interface FilaPostulacion {
  id: string;
  estado: EstadoPostulacion;
  puntaje: number | null;
  subidoEn: string;
}

export interface Ranking<T extends FilaPostulacion> {
  clasificadas: (T & { posicion: number })[];
  enCurso: T[];
  revisionManual: T[];
}

/**
 * Solo los CVs procesados entran al ranking. Los que están en curso o en revisión manual
 * se muestran aparte y sin posición: nunca quedan "al fondo" como si tuvieran puntaje 0 (RQ-SOP-01).
 */
export function generarRanking<T extends FilaPostulacion>(filas: T[]): Ranking<T> {
  const porFecha = (a: T, b: T) => a.subidoEn.localeCompare(b.subidoEn);

  const clasificadas = filas
    .filter((f) => f.estado === "procesada" && f.puntaje !== null)
    .sort((a, b) => b.puntaje! - a.puntaje! || porFecha(a, b))
    .map((f, i) => ({ ...f, posicion: i + 1 }));

  return {
    clasificadas,
    enCurso: filas.filter((f) => f.estado === "recibida" || f.estado === "procesando").sort(porFecha),
    revisionManual: filas.filter((f) => f.estado === "pendiente_revision_manual").sort(porFecha),
  };
}
