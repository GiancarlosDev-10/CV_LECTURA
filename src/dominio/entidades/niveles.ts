/** Niveles educativos en orden ascendente; el índice es su rango. */
export const NIVELES_EDUCATIVOS = [
  "secundaria",
  "tecnico",
  "universitario",
  "maestria",
  "doctorado",
] as const;

export type NivelEducativo = (typeof NIVELES_EDUCATIVOS)[number];

export function rangoEducativo(nivel: NivelEducativo): number {
  return NIVELES_EDUCATIVOS.indexOf(nivel);
}

/** Niveles MCER en orden ascendente. "nativo" equivale a C2. */
const ORDEN_MCER = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export function rangoIdioma(nivel: string): number {
  const normalizado = nivel === "nativo" ? "C2" : nivel;
  return ORDEN_MCER.indexOf(normalizado as (typeof ORDEN_MCER)[number]);
}
