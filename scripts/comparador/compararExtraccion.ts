/**
 * Comparador de la extracción (E05 5.5): decide si cada dato extraído por la IA
 * coincide con la respuesta esperada del dataset. Mide RQ-FUN-01 y RQ-FUN-02.
 * Las reglas se congelan con los umbrales (etiqueta umbrales-v1.0): no cambiarlas
 * sin control de cambios.
 */
import type { CvExtraido } from "../../src/dominio/entidades/cvExtraido";
import { normalizarHabilidad, normalizarIdioma } from "../../src/dominio/puntaje/normalizacion";

export const CAMPOS_SIMPLES = ["nombre", "email", "telefono", "aniosExperiencia", "nivelEducativo"] as const;
export type CampoSimple = (typeof CAMPOS_SIMPLES)[number];

const TOLERANCIA_ANIOS = 0.5;
const EPSILON = 1e-9;

export interface CasoEsperado {
  id: string;
  esperado: CvExtraido;
}

export type ResultadoObtenido =
  | { id: string; estado: "procesada"; cvExtraido: CvExtraido }
  | { id: string; estado: "pendiente_revision_manual"; motivo: string };

export interface ConteoLista {
  aciertos: number;
  extraidos: number;
  esperados: number;
  faltantes: string[];
  inventados: string[];
}

export interface DetalleCv {
  id: string;
  estado: "procesada" | "pendiente_revision_manual" | "sin_resultado";
  motivo?: string;
  campos: Record<CampoSimple, boolean>;
  habilidades: ConteoLista;
  idiomas: ConteoLista;
}

export interface ResultadoCorrida {
  camposCorrectos: number;
  camposEvaluados: number;
  porcentajeCampos: number;
  porCampo: Record<CampoSimple, number>;
  listas: { aciertos: number; extraidos: number; esperados: number };
  precision: number;
  exhaustividad: number;
  f1: number;
  sinResultado: string[];
  detalle: DetalleCv[];
}

function sinTildes(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const normalizarNombre = (v: string) => sinTildes(v).toLowerCase().replace(/\s+/g, " ").trim();
const normalizarEmail = (v: string) => v.trim().toLowerCase();

/** Solo dígitos y sin el prefijo de Perú (+51) cuando antecede a un número de 9 dígitos. */
function normalizarTelefono(v: string): string {
  const digitos = v.replace(/\D/g, "");
  return digitos.length === 11 && digitos.startsWith("51") ? digitos.slice(2) : digitos;
}

/** Ausente (null) solo coincide con ausente; si ambos existen, se comparan normalizados. */
function igualesTexto(esperado: string | null, obtenido: string | null, normalizar: (v: string) => string): boolean {
  if (esperado === null || obtenido === null) return esperado === obtenido;
  return normalizar(esperado) === normalizar(obtenido);
}

function igualesAnios(esperado: number | null, obtenido: number | null): boolean {
  if (esperado === null || obtenido === null) return esperado === obtenido;
  return Math.abs(esperado - obtenido) <= TOLERANCIA_ANIOS + EPSILON;
}

export function compararCampos(esperado: CvExtraido, obtenido: CvExtraido): Record<CampoSimple, boolean> {
  return {
    nombre: igualesTexto(esperado.nombre, obtenido.nombre, normalizarNombre),
    email: igualesTexto(esperado.email, obtenido.email, normalizarEmail),
    telefono: igualesTexto(esperado.telefono, obtenido.telefono, normalizarTelefono),
    aniosExperiencia: igualesAnios(esperado.aniosExperiencia, obtenido.aniosExperiencia),
    nivelEducativo: esperado.nivelEducativo === obtenido.nivelEducativo,
  };
}

function contarConjuntos(esperados: string[], extraidos: string[]): ConteoLista {
  const e = new Set(esperados);
  const o = new Set(extraidos);
  const faltantes = [...e].filter((x) => !o.has(x)).sort((a, b) => a.localeCompare(b));
  const inventados = [...o].filter((x) => !e.has(x)).sort((a, b) => a.localeCompare(b));
  return { aciertos: e.size - faltantes.length, extraidos: o.size, esperados: e.size, faltantes, inventados };
}

const claveIdioma = (i: CvExtraido["idiomas"][number]) => `${normalizarIdioma(i.idioma)} ${i.nivel}`;

export function compararListas(esperado: CvExtraido, obtenido: CvExtraido): { habilidades: ConteoLista; idiomas: ConteoLista } {
  return {
    habilidades: contarConjuntos(esperado.habilidades.map(normalizarHabilidad), obtenido.habilidades.map(normalizarHabilidad)),
    idiomas: contarConjuntos(esperado.idiomas.map(claveIdioma), obtenido.idiomas.map(claveIdioma)),
  };
}

const VACIO: CvExtraido = {
  nombre: null,
  email: null,
  telefono: null,
  aniosExperiencia: null,
  nivelEducativo: null,
  habilidades: [],
  idiomas: [],
};
const TODOS_INCORRECTOS = Object.fromEntries(CAMPOS_SIMPLES.map((c) => [c, false])) as Record<CampoSimple, boolean>;

function compararCaso(caso: CasoEsperado, obtenido: ResultadoObtenido | undefined): DetalleCv {
  if (obtenido?.estado === "procesada") {
    return {
      id: caso.id,
      estado: "procesada",
      campos: compararCampos(caso.esperado, obtenido.cvExtraido),
      ...compararListas(caso.esperado, obtenido.cvExtraido),
    };
  }
  // Revisión manual o sin resultado: todos los campos incorrectos y nada extraído (E05 5.5).
  return {
    id: caso.id,
    estado: obtenido ? "pendiente_revision_manual" : "sin_resultado",
    motivo: obtenido?.motivo,
    campos: TODOS_INCORRECTOS,
    ...compararListas(caso.esperado, VACIO),
  };
}

const dividir = (a: number, b: number) => (b === 0 ? 0 : a / b);

/** Compara una corrida completa. Solo se evalúan los casos esperados; el resto se ignora. */
export function compararCorrida(casos: CasoEsperado[], obtenidos: ResultadoObtenido[]): ResultadoCorrida {
  const porId = new Map(obtenidos.map((o) => [o.id, o]));
  const detalle = casos.map((c) => compararCaso(c, porId.get(c.id)));

  const porCampo = Object.fromEntries(
    CAMPOS_SIMPLES.map((campo) => [campo, detalle.filter((d) => d.campos[campo]).length]),
  ) as Record<CampoSimple, number>;
  const camposCorrectos = CAMPOS_SIMPLES.reduce((suma, c) => suma + porCampo[c], 0);
  const camposEvaluados = detalle.length * CAMPOS_SIMPLES.length;

  const listas = { aciertos: 0, extraidos: 0, esperados: 0 };
  for (const d of detalle) {
    for (const l of [d.habilidades, d.idiomas]) {
      listas.aciertos += l.aciertos;
      listas.extraidos += l.extraidos;
      listas.esperados += l.esperados;
    }
  }
  const precision = dividir(listas.aciertos, listas.extraidos);
  const exhaustividad = dividir(listas.aciertos, listas.esperados);

  return {
    camposCorrectos,
    camposEvaluados,
    porcentajeCampos: dividir(camposCorrectos, camposEvaluados) * 100,
    porCampo,
    listas,
    precision,
    exhaustividad,
    f1: dividir(2 * precision * exhaustividad, precision + exhaustividad),
    sinResultado: detalle.filter((d) => d.estado === "sin_resultado").map((d) => d.id),
    detalle,
  };
}

export interface Estadistico {
  promedio: number;
  desviacion: number;
}

function estadistico(valores: number[]): Estadistico {
  const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
  if (valores.length < 2) return { promedio, desviacion: 0 };
  const varianza = valores.reduce((a, v) => a + (v - promedio) ** 2, 0) / (valores.length - 1);
  return { promedio, desviacion: Math.sqrt(varianza) };
}

/** Promedio y desviación estándar muestral de las corridas (E05 5.5). */
export function resumirCorridas(corridas: Pick<ResultadoCorrida, "porcentajeCampos" | "f1">[]) {
  return {
    porcentajeCampos: estadistico(corridas.map((c) => c.porcentajeCampos)),
    f1: estadistico(corridas.map((c) => c.f1)),
  };
}
