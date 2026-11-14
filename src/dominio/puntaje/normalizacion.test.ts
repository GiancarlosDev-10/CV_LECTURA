import { describe, expect, it } from "vitest";
import { normalizarHabilidad, normalizarIdioma } from "./normalizacion";

describe("normalizarHabilidad", () => {
  it.each([
    ["JavaScript", "javascript"],
    ["JS", "javascript"],
    ["  Node.JS ", "node.js"],
    ["NodeJS", "node.js"],
    ["Postgres", "postgresql"],
    ["React.js", "react"],
    ["TS", "typescript"],
    ["C Sharp", "c#"],
    ["Golang", "go"],
    ["K8s", "kubernetes"],
  ])("'%s' se normaliza como '%s'", (entrada, esperado) => {
    expect(normalizarHabilidad(entrada)).toBe(esperado);
  });

  it("ignora tildes, mayúsculas y espacios repetidos", () => {
    expect(normalizarHabilidad("Gestión   de  Proyectos")).toBe("gestion de proyectos");
  });

  it("deja igual una habilidad sin alias", () => {
    expect(normalizarHabilidad("Figma")).toBe("figma");
  });
});

describe("normalizarIdioma", () => {
  it.each([
    ["Inglés", "ingles"],
    ["English", "ingles"],
    ["Español", "espanol"],
    ["Castellano", "espanol"],
    ["Portuguese", "portugues"],
  ])("'%s' se normaliza como '%s'", (entrada, esperado) => {
    expect(normalizarIdioma(entrada)).toBe(esperado);
  });
});
