/**
 * Tabla de alias: la IA extrae las habilidades tal como aparecen en el CV,
 * y el código (no la IA) decide si coinciden con las de la oferta.
 * Ampliarla es una acción de mejora medible (ver PLAN §6).
 */
const ALIAS_HABILIDADES: Record<string, string> = {
  js: "javascript",
  ecmascript: "javascript",
  ts: "typescript",
  node: "node.js",
  nodejs: "node.js",
  "node js": "node.js",
  postgres: "postgresql",
  psql: "postgresql",
  "react.js": "react",
  reactjs: "react",
  "react js": "react",
  "next.js": "nextjs",
  "next js": "nextjs",
  "vue.js": "vue",
  vuejs: "vue",
  "c sharp": "c#",
  csharp: "c#",
  golang: "go",
  k8s: "kubernetes",
  py: "python",
  "amazon web services": "aws",
  "ms excel": "excel",
  "microsoft excel": "excel",
  "power bi": "powerbi",
};

const ALIAS_IDIOMAS: Record<string, string> = {
  english: "ingles",
  castellano: "espanol",
  spanish: "espanol",
  portuguese: "portugues",
  french: "frances",
  german: "aleman",
  italian: "italiano",
  chinese: "chino",
  mandarin: "chino",
};

function limpiar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizarHabilidad(habilidad: string): string {
  const limpia = limpiar(habilidad);
  return ALIAS_HABILIDADES[limpia] ?? limpia;
}

export function normalizarIdioma(idioma: string): string {
  const limpio = limpiar(idioma);
  return ALIAS_IDIOMAS[limpio] ?? limpio;
}
