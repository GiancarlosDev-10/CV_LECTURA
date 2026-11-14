import { beforeEach, describe, expect, it } from "vitest";
import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import { PESOS_POR_DEFECTO } from "@/dominio/entidades/oferta";
import {
  ErrorPdfIlegible,
  type AlmacenArchivos,
  type LectorPdf,
  type PostulacionParaProcesar,
  type RepositorioPostulaciones,
  type ResultadoProcesamiento,
  type RevisionManual,
} from "@/dominio/puertos";
import { ExtractorCvSimulado } from "@/infraestructura/openai/ExtractorCvSimulado";
import { procesarCv } from "./procesarCv";

const TEXTO_CV =
  "Ana Torres — Desarrolladora web. ana.torres@example.com. 4 años de experiencia con JavaScript, React y PostgreSQL. Inglés C1.";

const CV_VALIDO: CvExtraido = {
  nombre: "Ana Torres",
  email: "ana.torres@example.com",
  telefono: null,
  aniosExperiencia: 4,
  nivelEducativo: "universitario",
  habilidades: ["JavaScript", "React", "PostgreSQL"],
  idiomas: [{ idioma: "Inglés", nivel: "C1" }],
};

class RepositorioEnMemoria implements RepositorioPostulaciones {
  postulaciones = new Map<string, PostulacionParaProcesar>();
  procesando: string[] = [];
  resultados = new Map<string, ResultadoProcesamiento>();
  revisiones = new Map<string, RevisionManual>();

  async obtenerParaProcesar(id: string) {
    return this.postulaciones.get(id) ?? null;
  }
  async marcarProcesando(id: string) {
    this.procesando.push(id);
  }
  async guardarResultado(id: string, resultado: ResultadoProcesamiento) {
    this.resultados.set(id, resultado);
  }
  async marcarRevisionManual(id: string, revision: RevisionManual) {
    this.revisiones.set(id, revision);
  }
}

const almacen: AlmacenArchivos = {
  subir: async () => {},
  descargar: async () => new Uint8Array([1, 2, 3]),
  eliminar: async () => {},
};

const lectorQueDevuelve = (texto: string): LectorPdf => ({ extraerTexto: async () => texto });

const reloj = () => new Date("2026-11-20T10:00:00Z");

let repo: RepositorioEnMemoria;

beforeEach(() => {
  repo = new RepositorioEnMemoria();
  repo.postulaciones.set("p1", {
    id: "p1",
    rutaCv: "ofertas/o1/p1.pdf",
    requisitos: {
      habilidadesObligatorias: ["JavaScript", "React"],
      habilidadesDeseables: [],
      aniosExperiencia: 4,
      nivelEducativo: "universitario",
      idiomas: [{ idioma: "Inglés", nivel: "B2" }],
      pesos: PESOS_POR_DEFECTO,
    },
  });
});

function ejecutar(extractor: ExtractorCvSimulado, lector: LectorPdf = lectorQueDevuelve(TEXTO_CV)) {
  return procesarCv("p1", { repositorio: repo, almacen, lectorPdf: lector, extractorCv: extractor, reloj, tiempoLimiteIaMs: 50 });
}

describe("procesarCv — camino feliz", () => {
  it("guarda los datos extraídos y el puntaje calculado", async () => {
    const resultado = await ejecutar(new ExtractorCvSimulado({ modo: "exito", respuesta: CV_VALIDO }));

    expect(resultado.estado).toBe("procesada");
    expect(repo.procesando).toEqual(["p1"]);
    const guardado = repo.resultados.get("p1");
    expect(guardado?.cv).toEqual(CV_VALIDO);
    expect(guardado?.puntaje.total).toBe(100);
    expect(guardado?.modeloIa).toBe("simulado");
    expect(guardado?.textoCv).toBe(TEXTO_CV);
  });
});

describe("procesarCv — falla segura: todo error termina en revisión manual, nunca con puntaje", () => {
  it.each([
    ["la IA devuelve un JSON que no cumple el contrato", { modo: "json_invalido" } as const, "RESPUESTA_IA_INVALIDA"],
    ["la IA responde con error", { modo: "error" } as const, "IA_ERROR"],
    ["la IA no responde dentro del tiempo límite", { modo: "demora", demoraMs: 500 } as const, "IA_TIEMPO_AGOTADO"],
  ])("cuando %s → %s", async (_caso, config, motivo) => {
    const resultado = await ejecutar(new ExtractorCvSimulado(config));

    expect(resultado.estado).toBe("pendiente_revision_manual");
    expect(repo.revisiones.get("p1")?.motivo).toBe(motivo);
    expect(repo.resultados.has("p1")).toBe(false);
  });

  it("PDF escaneado (sin texto suficiente) → PDF_SIN_TEXTO, sin llamar a la IA", async () => {
    const extractor = new ExtractorCvSimulado({ modo: "exito", respuesta: CV_VALIDO });
    const resultado = await ejecutar(extractor, lectorQueDevuelve("   \n  "));

    expect(resultado.estado).toBe("pendiente_revision_manual");
    expect(repo.revisiones.get("p1")?.motivo).toBe("PDF_SIN_TEXTO");
    expect(extractor.llamadas).toBe(0);
  });

  it("PDF corrupto → PDF_ILEGIBLE", async () => {
    const lectorRoto: LectorPdf = {
      extraerTexto: async () => {
        throw new ErrorPdfIlegible();
      },
    };
    const resultado = await ejecutar(new ExtractorCvSimulado({ modo: "exito", respuesta: CV_VALIDO }), lectorRoto);

    expect(repo.revisiones.get("p1")?.motivo).toBe("PDF_ILEGIBLE");
    expect(resultado.estado).toBe("pendiente_revision_manual");
  });

  it("error inesperado de infraestructura → ERROR_INESPERADO", async () => {
    const lectorQueFalla: LectorPdf = {
      extraerTexto: async () => {
        throw new Error("disco lleno");
      },
    };
    await ejecutar(new ExtractorCvSimulado({ modo: "exito", respuesta: CV_VALIDO }), lectorQueFalla);

    expect(repo.revisiones.get("p1")).toMatchObject({ motivo: "ERROR_INESPERADO", detalle: "disco lleno" });
  });
});

describe("procesarCv — clasificación de errores posteriores a la IA", () => {
  it("si falla el guardado tras una extracción válida → ERROR_INESPERADO, no IA_ERROR", async () => {
    repo.guardarResultado = async () => {
      throw new Error("conexión perdida con la BD");
    };
    await ejecutar(new ExtractorCvSimulado({ modo: "exito", respuesta: CV_VALIDO }));

    expect(repo.revisiones.get("p1")).toMatchObject({ motivo: "ERROR_INESPERADO", modeloIa: "simulado" });
  });
});

describe("procesarCv — postulación inexistente", () => {
  it("lanza un error y no registra nada", async () => {
    await expect(
      procesarCv("no-existe", {
        repositorio: repo,
        almacen,
        lectorPdf: lectorQueDevuelve(TEXTO_CV),
        extractorCv: new ExtractorCvSimulado({ modo: "exito", respuesta: CV_VALIDO }),
        reloj,
      }),
    ).rejects.toThrow(/no existe/);
    expect(repo.procesando).toEqual([]);
  });
});
