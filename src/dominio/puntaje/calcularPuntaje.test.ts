import { describe, expect, it } from "vitest";
import type { CvExtraido } from "../entidades/cvExtraido";
import { PESOS_POR_DEFECTO, type RequisitosOferta } from "../entidades/oferta";
import { calcularPuntaje } from "./calcularPuntaje";

function oferta(parcial: Partial<RequisitosOferta> = {}): RequisitosOferta {
  return {
    habilidadesObligatorias: ["JavaScript", "React", "PostgreSQL", "Git"],
    habilidadesDeseables: ["Docker", "AWS"],
    aniosExperiencia: 4,
    nivelEducativo: "universitario",
    idiomas: [{ idioma: "Inglés", nivel: "B2" }],
    pesos: PESOS_POR_DEFECTO,
    ...parcial,
  };
}

function cv(parcial: Partial<CvExtraido> = {}): CvExtraido {
  return {
    nombre: "Ana Torres",
    email: "ana.torres@example.com",
    telefono: "+51 900 000 001",
    aniosExperiencia: 4,
    nivelEducativo: "universitario",
    habilidades: ["JS", "React.js", "Postgres", "Git", "Docker", "AWS"],
    idiomas: [{ idioma: "English", nivel: "C1" }],
    ...parcial,
  };
}

describe("calcularPuntaje — candidato que cumple todo", () => {
  it("obtiene 100 puntos", () => {
    expect(calcularPuntaje(cv(), oferta()).total).toBe(100);
  });

  it("reconoce habilidades escritas con alias", () => {
    const { desglose } = calcularPuntaje(cv(), oferta());
    expect(desglose.obligatorias.faltantes).toEqual([]);
  });
});

describe("habilidades obligatorias (peso 40)", () => {
  it("3 de 4 cumplidas → 30 puntos", () => {
    const resultado = calcularPuntaje(cv({ habilidades: ["JavaScript", "React", "Git"] }), oferta());
    expect(resultado.desglose.obligatorias.puntos).toBe(30);
    expect(resultado.desglose.obligatorias.faltantes).toEqual(["PostgreSQL"]);
  });

  it("ninguna cumplida → 0 puntos", () => {
    const resultado = calcularPuntaje(cv({ habilidades: [] }), oferta());
    expect(resultado.desglose.obligatorias.puntos).toBe(0);
  });

  it("si la oferta no exige habilidades obligatorias, otorga el peso completo", () => {
    const resultado = calcularPuntaje(cv({ habilidades: [] }), oferta({ habilidadesObligatorias: [] }));
    expect(resultado.desglose.obligatorias.puntos).toBe(40);
  });
});

describe("habilidades deseables (peso 20)", () => {
  it("1 de 2 cumplidas → 10 puntos", () => {
    const resultado = calcularPuntaje(cv({ habilidades: ["Docker"] }), oferta());
    expect(resultado.desglose.deseables.puntos).toBe(10);
  });
});

describe("experiencia (peso 20)", () => {
  it("2 de 4 años pedidos → 10 puntos", () => {
    expect(calcularPuntaje(cv({ aniosExperiencia: 2 }), oferta()).desglose.experiencia.puntos).toBe(10);
  });

  it("más años de los pedidos no supera el peso", () => {
    expect(calcularPuntaje(cv({ aniosExperiencia: 12 }), oferta()).desglose.experiencia.puntos).toBe(20);
  });

  it("experiencia no encontrada en el CV → 0 puntos", () => {
    expect(calcularPuntaje(cv({ aniosExperiencia: null }), oferta()).desglose.experiencia.puntos).toBe(0);
  });

  it("si la oferta pide 0 años, otorga el peso completo", () => {
    const resultado = calcularPuntaje(cv({ aniosExperiencia: null }), oferta({ aniosExperiencia: 0 }));
    expect(resultado.desglose.experiencia.puntos).toBe(20);
  });
});

describe("educación (peso 10)", () => {
  it("alcanza el nivel pedido → 10", () => {
    expect(calcularPuntaje(cv(), oferta()).desglose.educacion.puntos).toBe(10);
  });

  it("supera el nivel pedido → 10", () => {
    expect(calcularPuntaje(cv({ nivelEducativo: "maestria" }), oferta()).desglose.educacion.puntos).toBe(10);
  });

  it("le falta un nivel → 5", () => {
    expect(calcularPuntaje(cv({ nivelEducativo: "tecnico" }), oferta()).desglose.educacion.puntos).toBe(5);
  });

  it("le faltan dos o más niveles → 0", () => {
    expect(calcularPuntaje(cv({ nivelEducativo: "secundaria" }), oferta()).desglose.educacion.puntos).toBe(0);
  });

  it("nivel no encontrado en el CV → 0", () => {
    expect(calcularPuntaje(cv({ nivelEducativo: null }), oferta()).desglose.educacion.puntos).toBe(0);
  });

  it("si la oferta no exige nivel, otorga el peso completo", () => {
    const resultado = calcularPuntaje(cv({ nivelEducativo: null }), oferta({ nivelEducativo: null }));
    expect(resultado.desglose.educacion.puntos).toBe(10);
  });
});

describe("idiomas (peso 10)", () => {
  it("nivel inferior al pedido → 0", () => {
    const resultado = calcularPuntaje(cv({ idiomas: [{ idioma: "Inglés", nivel: "B1" }] }), oferta());
    expect(resultado.desglose.idiomas.puntos).toBe(0);
  });

  it("'nativo' equivale a C2 y cumple cualquier nivel", () => {
    const resultado = calcularPuntaje(cv({ idiomas: [{ idioma: "inglés", nivel: "nativo" }] }), oferta());
    expect(resultado.desglose.idiomas.puntos).toBe(10);
  });

  it("1 de 2 idiomas cumplidos → 5", () => {
    const requisitos = oferta({
      idiomas: [
        { idioma: "Inglés", nivel: "B2" },
        { idioma: "Portugués", nivel: "B1" },
      ],
    });
    expect(calcularPuntaje(cv(), requisitos).desglose.idiomas.puntos).toBe(5);
  });
});

describe("pesos personalizados y redondeo", () => {
  it("aplica los pesos de la oferta", () => {
    const requisitos = oferta({
      pesos: { obligatorias: 70, deseables: 0, experiencia: 30, educacion: 0, idiomas: 0 },
    });
    const resultado = calcularPuntaje(cv({ habilidades: ["JavaScript"], aniosExperiencia: 4 }), requisitos);
    expect(resultado.total).toBe(47.5);
  });

  it("redondea a 2 decimales y el total es la suma exacta del desglose", () => {
    const resultado = calcularPuntaje(
      cv({ habilidades: ["JavaScript"], aniosExperiencia: 1 }),
      oferta({ habilidadesObligatorias: ["JavaScript", "React", "Git"], aniosExperiencia: 3 }),
    );
    const { obligatorias, deseables, experiencia, educacion, idiomas } = resultado.desglose;
    expect(obligatorias.puntos).toBe(13.33);
    expect(experiencia.puntos).toBe(6.67);
    expect(resultado.total).toBe(
      Math.round(
        (obligatorias.puntos + deseables.puntos + experiencia.puntos + educacion.puntos + idiomas.puntos) * 100,
      ) / 100,
    );
  });

  it("rechaza pesos que no suman 100", () => {
    const requisitos = oferta({
      pesos: { obligatorias: 50, deseables: 50, experiencia: 50, educacion: 0, idiomas: 0 },
    });
    expect(() => calcularPuntaje(cv(), requisitos)).toThrow(/sumar 100/);
  });
});
