import { describe, expect, it } from "vitest";
import type { CvExtraido } from "../../src/dominio/entidades/cvExtraido";
import {
  compararCampos,
  compararCorrida,
  compararListas,
  resumirCorridas,
  type CasoEsperado,
} from "./compararExtraccion";

const BASE: CvExtraido = {
  nombre: "Lucía Pérez Ríos",
  email: "lucia.perez@example.com",
  telefono: "(+51) 900-000-101",
  aniosExperiencia: 3.5,
  nivelEducativo: "universitario",
  habilidades: ["JavaScript", "React", "SQL"],
  idiomas: [{ idioma: "Inglés", nivel: "B1" }],
};

const con = (cambios: Partial<CvExtraido>): CvExtraido => ({ ...BASE, ...cambios });

describe("compararCampos (E05 5.5, RQ-FUN-01)", () => {
  it("un CV idéntico tiene los 5 campos correctos", () => {
    const r = compararCampos(BASE, BASE);
    expect(Object.values(r).every(Boolean)).toBe(true);
    expect(Object.keys(r)).toHaveLength(5);
  });

  it("nombre: ignora mayúsculas, tildes y espacios repetidos", () => {
    expect(compararCampos(BASE, con({ nombre: "  LUCIA  PEREZ   RIOS " })).nombre).toBe(true);
    expect(compararCampos(BASE, con({ nombre: "Lucía Pérez" })).nombre).toBe(false);
  });

  it("email: coincidencia exacta en minúsculas", () => {
    expect(compararCampos(BASE, con({ email: "Lucia.Perez@Example.com" })).email).toBe(true);
    expect(compararCampos(BASE, con({ email: "lucia.perez@example.org" })).email).toBe(false);
  });

  it("teléfono: solo dígitos, sin el prefijo +51", () => {
    expect(compararCampos(BASE, con({ telefono: "900000101" })).telefono).toBe(true);
    expect(compararCampos(BASE, con({ telefono: "+51 900 000 101" })).telefono).toBe(true);
    expect(compararCampos(BASE, con({ telefono: "51900000101" })).telefono).toBe(true);
    expect(compararCampos(BASE, con({ telefono: "900000102" })).telefono).toBe(false);
  });

  it("teléfono: un 51 que es parte del número de 9 dígitos no se quita", () => {
    const esperado = con({ telefono: "510 000 101" });
    expect(compararCampos(esperado, con({ telefono: "510000101" })).telefono).toBe(true);
    expect(compararCampos(esperado, con({ telefono: "0000101" })).telefono).toBe(false);
  });

  it("años de experiencia: tolerancia de ± 0,5 años", () => {
    expect(compararCampos(BASE, con({ aniosExperiencia: 3 })).aniosExperiencia).toBe(true);
    expect(compararCampos(BASE, con({ aniosExperiencia: 4 })).aniosExperiencia).toBe(true);
    expect(compararCampos(BASE, con({ aniosExperiencia: 2.9 })).aniosExperiencia).toBe(false);
    expect(compararCampos(BASE, con({ aniosExperiencia: 4.1 })).aniosExperiencia).toBe(false);
  });

  it("años de experiencia: si el esperado es null, solo null es correcto", () => {
    const sinExperiencia = con({ aniosExperiencia: null });
    expect(compararCampos(sinExperiencia, con({ aniosExperiencia: null })).aniosExperiencia).toBe(true);
    expect(compararCampos(sinExperiencia, con({ aniosExperiencia: 0 })).aniosExperiencia).toBe(false);
    expect(compararCampos(BASE, con({ aniosExperiencia: null })).aniosExperiencia).toBe(false);
  });

  it("nivel educativo: coincidencia exacta", () => {
    expect(compararCampos(BASE, con({ nivelEducativo: "maestria" })).nivelEducativo).toBe(false);
  });

  it("un campo de texto ausente (null) solo es correcto si el esperado también es null", () => {
    expect(compararCampos(con({ telefono: null }), con({ telefono: null })).telefono).toBe(true);
    expect(compararCampos(BASE, con({ telefono: null })).telefono).toBe(false);
    expect(compararCampos(con({ email: null }), BASE).email).toBe(false);
  });
});

describe("compararListas (E05 5.5, RQ-FUN-02)", () => {
  it("habilidades: se comparan como conjuntos después de la tabla de alias", () => {
    const r = compararListas(BASE, con({ habilidades: ["JS", "ReactJS", "sql", "sql"] }));
    expect(r.habilidades).toMatchObject({ aciertos: 3, extraidos: 3, esperados: 3 });
  });

  it("habilidades: cuenta las faltantes y las inventadas", () => {
    const r = compararListas(BASE, con({ habilidades: ["JavaScript", "Docker"] }));
    expect(r.habilidades).toMatchObject({ aciertos: 1, extraidos: 2, esperados: 3 });
    expect(r.habilidades.faltantes).toEqual(["react", "sql"]);
    expect(r.habilidades.inventados).toEqual(["docker"]);
  });

  it("idiomas: deben coincidir el idioma normalizado y el nivel MCER", () => {
    expect(compararListas(BASE, con({ idiomas: [{ idioma: "English", nivel: "B1" }] })).idiomas.aciertos).toBe(1);
    expect(compararListas(BASE, con({ idiomas: [{ idioma: "Inglés", nivel: "B2" }] })).idiomas.aciertos).toBe(0);
  });
});

const caso = (id: string, esperado: CvExtraido = BASE): CasoEsperado => ({ id, esperado });

describe("compararCorrida", () => {
  it("calcula el % de campos correctos y el F1 de toda la corrida", () => {
    const r = compararCorrida(
      [caso("cv-01"), caso("cv-02")],
      [
        { id: "cv-01", estado: "procesada", cvExtraido: BASE },
        // 2 campos mal; habilidades: 2 de 3, sin inventadas
        { id: "cv-02", estado: "procesada", cvExtraido: con({ email: null, aniosExperiencia: 6, habilidades: ["JS", "SQL"] }) },
      ],
    );
    expect(r.camposCorrectos).toBe(8);
    expect(r.camposEvaluados).toBe(10);
    expect(r.porcentajeCampos).toBeCloseTo(80);
    // aciertos 7, extraídos 7, esperados 8 → P = 1, R = 0,875
    expect(r.listas).toMatchObject({ aciertos: 7, extraidos: 7, esperados: 8 });
    expect(r.f1).toBeCloseTo((2 * 1 * 0.875) / 1.875);
  });

  it("un CV en revisión manual cuenta con todos sus campos incorrectos (no se excluye)", () => {
    const r = compararCorrida(
      [caso("cv-01"), caso("cv-02")],
      [
        { id: "cv-01", estado: "procesada", cvExtraido: BASE },
        { id: "cv-02", estado: "pendiente_revision_manual", motivo: "IA_TIEMPO_AGOTADO" },
      ],
    );
    expect(r.porcentajeCampos).toBeCloseTo(50);
    expect(r.listas).toMatchObject({ aciertos: 4, extraidos: 4, esperados: 8 });
    expect(r.detalle.find((d) => d.id === "cv-02")?.estado).toBe("pendiente_revision_manual");
  });

  it("un CV sin resultado en la corrida cuenta como incorrecto y queda señalado", () => {
    const r = compararCorrida([caso("cv-01"), caso("cv-02")], [{ id: "cv-01", estado: "procesada", cvExtraido: BASE }]);
    expect(r.porcentajeCampos).toBeCloseTo(50);
    expect(r.sinResultado).toEqual(["cv-02"]);
  });

  it("F1 es 0 cuando no hay ningún acierto", () => {
    const r = compararCorrida([caso("cv-01")], [{ id: "cv-01", estado: "pendiente_revision_manual", motivo: "IA_ERROR" }]);
    expect(r.f1).toBe(0);
  });

  it("ignora resultados de CVs que no están en el alcance", () => {
    const r = compararCorrida([caso("cv-01")], [
      { id: "cv-01", estado: "procesada", cvExtraido: BASE },
      { id: "cv-37", estado: "procesada", cvExtraido: con({ nombre: "Otro" }) },
    ]);
    expect(r.camposEvaluados).toBe(5);
    expect(r.porcentajeCampos).toBe(100);
  });
});

describe("resumirCorridas", () => {
  it("promedia y calcula la desviación estándar muestral", () => {
    const r = resumirCorridas([
      { porcentajeCampos: 90, f1: 0.8 },
      { porcentajeCampos: 92, f1: 0.9 },
      { porcentajeCampos: 94, f1: 0.85 },
    ]);
    expect(r.porcentajeCampos.promedio).toBeCloseTo(92);
    expect(r.porcentajeCampos.desviacion).toBeCloseTo(2);
    expect(r.f1.promedio).toBeCloseTo(0.85);
    expect(r.f1.desviacion).toBeCloseTo(0.05);
  });

  it("con una sola corrida la desviación es 0", () => {
    expect(resumirCorridas([{ porcentajeCampos: 90, f1: 0.8 }]).f1.desviacion).toBe(0);
  });
});
