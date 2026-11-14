import { CvExtraidoSchema } from "@/dominio/entidades/cvExtraido";
import type { MotivoRevisionManual } from "@/dominio/entidades/postulacion";
import {
  ErrorPdfIlegible,
  type AlmacenArchivos,
  type ExtractorCv,
  type LectorPdf,
  type Reloj,
  type RepositorioPostulaciones,
} from "@/dominio/puertos";
import { calcularPuntaje } from "@/dominio/puntaje/calcularPuntaje";

export interface DependenciasProcesarCv {
  repositorio: RepositorioPostulaciones;
  almacen: AlmacenArchivos;
  lectorPdf: LectorPdf;
  extractorCv: ExtractorCv;
  reloj: Reloj;
  tiempoLimiteIaMs?: number;
}

export type ResultadoProcesarCv =
  | { estado: "procesada"; total: number }
  | { estado: "pendiente_revision_manual"; motivo: MotivoRevisionManual };

/** Un PDF con menos caracteres que esto se trata como escaneado (sin capa de texto). */
const MINIMO_CARACTERES_TEXTO = 50;
const TIEMPO_LIMITE_IA_POR_DEFECTO_MS = 60_000;

class FalloControlado extends Error {
  constructor(
    readonly motivo: MotivoRevisionManual,
    detalle: string,
  ) {
    super(detalle);
  }
}

/**
 * PDF → texto → IA → validación del contrato → puntaje → estado.
 * Cualquier fallo deja la postulación en "pendiente_revision_manual" con su motivo:
 * nunca se asigna un puntaje a un CV que no se pudo leer (RQ-SOP-01, RQ-FIA-01).
 */
export async function procesarCv(postulacionId: string, deps: DependenciasProcesarCv): Promise<ResultadoProcesarCv> {
  const { repositorio, almacen, lectorPdf, extractorCv, reloj } = deps;

  const postulacion = await repositorio.obtenerParaProcesar(postulacionId);
  if (!postulacion) {
    throw new Error(`La postulación ${postulacionId} no existe`);
  }

  await repositorio.marcarProcesando(postulacionId, reloj());
  let iaInvocada = false;

  try {
    const pdf = await almacen.descargar(postulacion.rutaCv);
    const textoCv = await leerTexto(lectorPdf, pdf);

    iaInvocada = true;
    const respuesta = await conTiempoLimite(
      extractorCv.extraer(textoCv),
      deps.tiempoLimiteIaMs ?? TIEMPO_LIMITE_IA_POR_DEFECTO_MS,
    ).catch((error: unknown) => {
      if (error instanceof FalloControlado) throw error;
      throw new FalloControlado("IA_ERROR", error instanceof Error ? error.message : String(error));
    });

    const validacion = CvExtraidoSchema.safeParse(respuesta);
    if (!validacion.success) {
      throw new FalloControlado("RESPUESTA_IA_INVALIDA", validacion.error.message);
    }

    const puntaje = calcularPuntaje(validacion.data, postulacion.requisitos);
    await repositorio.guardarResultado(postulacionId, {
      textoCv,
      cv: validacion.data,
      puntaje,
      modeloIa: extractorCv.modelo,
      finalizadoEn: reloj(),
    });
    return { estado: "procesada", total: puntaje.total };
  } catch (error) {
    const motivo = clasificar(error);
    await repositorio.marcarRevisionManual(postulacionId, {
      motivo,
      detalle: error instanceof Error ? error.message : String(error),
      modeloIa: iaInvocada ? extractorCv.modelo : null,
      finalizadoEn: reloj(),
    });
    return { estado: "pendiente_revision_manual", motivo };
  }
}

async function leerTexto(lector: LectorPdf, pdf: Uint8Array): Promise<string> {
  const texto = await lector.extraerTexto(pdf);
  if (texto.replace(/\s/g, "").length < MINIMO_CARACTERES_TEXTO) {
    throw new FalloControlado("PDF_SIN_TEXTO", "El PDF no tiene texto seleccionable (¿escaneado?)");
  }
  return texto;
}

function conTiempoLimite<T>(promesa: Promise<T>, ms: number): Promise<T> {
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<never>((_, rechazar) => {
    temporizador = setTimeout(
      () => rechazar(new FalloControlado("IA_TIEMPO_AGOTADO", `La IA no respondió en ${ms} ms`)),
      ms,
    );
  });
  return Promise.race([promesa, limite]).finally(() => clearTimeout(temporizador));
}

function clasificar(error: unknown): MotivoRevisionManual {
  if (error instanceof FalloControlado) return error.motivo;
  if (error instanceof ErrorPdfIlegible) return "PDF_ILEGIBLE";
  return "ERROR_INESPERADO";
}
