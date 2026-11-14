import type { CvExtraido } from "../entidades/cvExtraido";
import { rangoEducativo, rangoIdioma } from "../entidades/niveles";
import { PesosSchema, type RequisitosOferta } from "../entidades/oferta";
import { normalizarHabilidad, normalizarIdioma } from "./normalizacion";

export interface CriterioHabilidades {
  puntos: number;
  peso: number;
  cumplidas: string[];
  faltantes: string[];
}

export interface CriterioSimple {
  puntos: number;
  peso: number;
}

export interface ResultadoPuntaje {
  total: number;
  desglose: {
    obligatorias: CriterioHabilidades;
    deseables: CriterioHabilidades;
    experiencia: CriterioSimple;
    educacion: CriterioSimple;
    idiomas: CriterioHabilidades;
  };
}

const redondear = (n: number) => Math.round(n * 100) / 100;

/**
 * Fórmula determinista del PLAN §6. La IA no interviene: solo aporta los datos del CV.
 * Un criterio que la oferta no exige otorga su peso completo.
 */
export function calcularPuntaje(cv: CvExtraido, requisitos: RequisitosOferta): ResultadoPuntaje {
  const pesos = PesosSchema.safeParse(requisitos.pesos);
  if (!pesos.success) {
    throw new Error("Los pesos de la oferta deben sumar 100");
  }
  const p = pesos.data;

  const habilidadesCv = new Set(cv.habilidades.map(normalizarHabilidad));

  const obligatorias = puntuarHabilidades(requisitos.habilidadesObligatorias, habilidadesCv, p.obligatorias);
  const deseables = puntuarHabilidades(requisitos.habilidadesDeseables, habilidadesCv, p.deseables);
  const experiencia = puntuarExperiencia(cv.aniosExperiencia, requisitos.aniosExperiencia, p.experiencia);
  const educacion = puntuarEducacion(cv, requisitos, p.educacion);
  const idiomas = puntuarIdiomas(cv, requisitos, p.idiomas);

  const total = redondear(
    obligatorias.puntos + deseables.puntos + experiencia.puntos + educacion.puntos + idiomas.puntos,
  );

  return { total, desglose: { obligatorias, deseables, experiencia, educacion, idiomas } };
}

function puntuarHabilidades(requeridas: string[], habilidadesCv: Set<string>, peso: number): CriterioHabilidades {
  if (requeridas.length === 0) {
    return { puntos: peso, peso, cumplidas: [], faltantes: [] };
  }
  const cumplidas = requeridas.filter((h) => habilidadesCv.has(normalizarHabilidad(h)));
  const faltantes = requeridas.filter((h) => !habilidadesCv.has(normalizarHabilidad(h)));
  return { puntos: redondear((cumplidas.length / requeridas.length) * peso), peso, cumplidas, faltantes };
}

function puntuarExperiencia(aniosCv: number | null, aniosPedidos: number, peso: number): CriterioSimple {
  if (aniosPedidos === 0) return { puntos: peso, peso };
  if (aniosCv === null) return { puntos: 0, peso };
  return { puntos: redondear(Math.min(aniosCv / aniosPedidos, 1) * peso), peso };
}

function puntuarEducacion(cv: CvExtraido, requisitos: RequisitosOferta, peso: number): CriterioSimple {
  if (requisitos.nivelEducativo === null) return { puntos: peso, peso };
  if (cv.nivelEducativo === null) return { puntos: 0, peso };
  const diferencia = rangoEducativo(requisitos.nivelEducativo) - rangoEducativo(cv.nivelEducativo);
  if (diferencia <= 0) return { puntos: peso, peso };
  if (diferencia === 1) return { puntos: redondear(peso / 2), peso };
  return { puntos: 0, peso };
}

function puntuarIdiomas(cv: CvExtraido, requisitos: RequisitosOferta, peso: number): CriterioHabilidades {
  if (requisitos.idiomas.length === 0) {
    return { puntos: peso, peso, cumplidas: [], faltantes: [] };
  }
  const nivelCv = new Map<string, number>();
  for (const { idioma, nivel } of cv.idiomas) {
    const clave = normalizarIdioma(idioma);
    nivelCv.set(clave, Math.max(nivelCv.get(clave) ?? -1, rangoIdioma(nivel)));
  }
  const cumple = (r: { idioma: string; nivel: string }) =>
    (nivelCv.get(normalizarIdioma(r.idioma)) ?? -1) >= rangoIdioma(r.nivel);

  const etiqueta = (r: { idioma: string; nivel: string }) => `${r.idioma} ${r.nivel}`;
  const cumplidas = requisitos.idiomas.filter(cumple).map(etiqueta);
  const faltantes = requisitos.idiomas.filter((r) => !cumple(r)).map(etiqueta);
  return {
    puntos: redondear((cumplidas.length / requisitos.idiomas.length) * peso),
    peso,
    cumplidas,
    faltantes,
  };
}
