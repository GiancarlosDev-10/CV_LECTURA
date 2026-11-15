/**
 * Texto de consentimiento informado (Ley N.° 29733 y su Reglamento).
 * Cada postulación guarda la versión aceptada y la fecha (RQ-SEG-03).
 * Si el texto cambia, se cambia la versión.
 */
export const CONSENTIMIENTO_VIGENTE = {
  version: "v1-2026-11",
  puntos: [
    "Mis datos personales del CV (nombre, contacto, experiencia, educación, habilidades e idiomas) se usarán únicamente para evaluar mi postulación a esta oferta.",
    "El texto de mi CV será procesado por un servicio de inteligencia artificial (OpenAI) para extraer los datos, y se almacenará en servidores ubicados en São Paulo (Brasil). Esto implica un flujo transfronterizo de datos personales.",
    "El puntaje que calcule el sistema es un apoyo para el reclutador; la decisión final la toma una persona.",
    "Puedo eliminar mi postulación, mi CV y mi cuenta en cualquier momento desde «Mis postulaciones» (derecho de cancelación).",
  ],
} as const;
