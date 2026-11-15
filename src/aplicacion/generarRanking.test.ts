import { describe, expect, it } from "vitest";
import { generarRanking, type FilaPostulacion } from "./generarRanking";

const fila = (id: string, estado: FilaPostulacion["estado"], puntaje: number | null, subidoEn: string): FilaPostulacion => ({
  id,
  estado,
  puntaje,
  subidoEn,
});

describe("generarRanking", () => {
  const filas = [
    fila("revision", "pendiente_revision_manual", null, "2026-11-20T10:00:00Z"),
    fila("medio", "procesada", 71.25, "2026-11-20T10:05:00Z"),
    fila("procesando", "procesando", null, "2026-11-20T10:09:00Z"),
    fila("alto", "procesada", 92.5, "2026-11-20T10:07:00Z"),
    fila("empate-tarde", "procesada", 71.25, "2026-11-20T10:08:00Z"),
    fila("recibida", "recibida", null, "2026-11-20T10:10:00Z"),
  ];

  it("ordena las procesadas por puntaje descendente y les asigna posición", () => {
    const { clasificadas } = generarRanking(filas);
    expect(clasificadas.map((f) => [f.posicion, f.id])).toEqual([
      [1, "alto"],
      [2, "medio"],
      [3, "empate-tarde"],
    ]);
  });

  it("ante empate de puntaje, va primero quien postuló antes", () => {
    const { clasificadas } = generarRanking(filas);
    expect(clasificadas[1].id).toBe("medio");
  });

  it("los CVs sin puntaje no reciben posición ni se mezclan con el ranking", () => {
    const { enCurso, revisionManual } = generarRanking(filas);
    expect(enCurso.map((f) => f.id)).toEqual(["procesando", "recibida"]);
    expect(revisionManual.map((f) => f.id)).toEqual(["revision"]);
  });
});
