/**
 * Corrida de PREPARACIÓN: pasa los PDFs del dataset por el mismo caso de uso procesarCv
 * (lector, IA, validación del contrato y falla segura) sin base de datos ni Storage.
 * Sirve para probar el comparador y ajustar antes del 27/11; NO es la medición oficial,
 * que se hace en producción (E05 5.7).
 *   npm run corrida:local -- <nombre>           (extractor según EXTRACTOR_IA de .env.local)
 * Escribe dataset/corridas/local-<nombre>.json, listo para npm run comparar.
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { procesarCv } from "../src/aplicacion/procesarCv";
import { PESOS_POR_DEFECTO } from "../src/dominio/entidades/oferta";
import type { ExtractorCv, RepositorioPostulaciones } from "../src/dominio/puertos";
import { entorno } from "../src/infraestructura/entorno";
import { ExtractorCvOpenAi } from "../src/infraestructura/openai/ExtractorCvOpenAi";
import { ExtractorCvSimulado } from "../src/infraestructura/openai/ExtractorCvSimulado";
import { LectorPdfUnpdf } from "../src/infraestructura/pdf/LectorPdfUnpdf";
import type { Corrida } from "./comparador/corrida";
import { leerEsperados } from "./comparador/corrida";

process.loadEnvFile?.(".env.local");

const nombre = process.argv[2];
if (!nombre || !/^[\w-]+$/.test(nombre)) {
  console.error("Uso: npm run corrida:local -- <nombre>   (letras, números y guiones)");
  process.exit(1);
}

function crearExtractor(): ExtractorCv {
  if (entorno.extractorIa() !== "openai") return new ExtractorCvSimulado();
  return new ExtractorCvOpenAi({
    apiKey: entorno.openAiClave(),
    modelo: entorno.openAiModelo(),
    temperatura: entorno.openAiTemperatura(),
  });
}

// Solo los CVs que llegan a procesarse; cv-39 y cv-40 se rechazan antes, en la postulación.
const casos = leerEsperados("dataset/esperados").filter((e) =>
  ["procesada", "pendiente_revision_manual"].includes(e.resultadoEsperado.tipo),
);

async function main() {
  const extractorCv = crearExtractor();
  const lectorPdf = new LectorPdfUnpdf();
  const resultados: Corrida["resultados"] = [];

  for (const caso of casos) {
    // Repositorio en memoria: captura lo que el sistema guardaría en la tabla postulaciones.
    let resultado: Corrida["resultados"][number] | undefined;
    const repositorio: RepositorioPostulaciones = {
      obtenerParaProcesar: async (id) => ({
        id,
        rutaCv: caso.archivo,
        requisitos: {
          habilidadesObligatorias: [],
          habilidadesDeseables: [],
          aniosExperiencia: 0,
          nivelEducativo: null,
          idiomas: [],
          pesos: PESOS_POR_DEFECTO,
        },
      }),
      marcarProcesando: async () => {},
      guardarResultado: async (_id, r) => {
        resultado = { id: caso.id, estado: "procesada", cvExtraido: r.cv };
      },
      marcarRevisionManual: async (_id, r) => {
        resultado = { id: caso.id, estado: "pendiente_revision_manual", motivo: r.motivo };
      },
    };

    const inicio = performance.now();
    await procesarCv(caso.id, {
      repositorio,
      almacen: {
        descargar: async (ruta) => new Uint8Array(readFileSync(join("dataset/pdf", ruta))),
        subir: async () => {},
        eliminar: async () => {},
      },
      lectorPdf,
      extractorCv,
      reloj: () => new Date(),
    });
    if (resultado) resultados.push(resultado);
    console.log(`${caso.id}: ${resultado?.estado ?? "sin resultado"} (${((performance.now() - inicio) / 1000).toFixed(1)} s)`);
  }

  const corrida: Corrida = {
    corrida: `local-${nombre}`,
    entorno: "local",
    modelo: extractorCv.modelo,
    commit: execSync("git rev-parse --short HEAD").toString().trim(),
    fecha: new Date().toISOString(),
    resultados,
  };
  mkdirSync("dataset/corridas", { recursive: true });
  const salida = `dataset/corridas/local-${nombre}.json`;
  writeFileSync(salida, JSON.stringify(corrida, null, 2));
  console.log(`\n${resultados.length} resultados → ${salida}\nSiguiente: npm run comparar -- ${salida}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
