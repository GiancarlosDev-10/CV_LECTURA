import type { RequisitosOferta } from "../entidades/oferta";
import type { MotivoRevisionManual } from "../entidades/postulacion";
import type { CvExtraido } from "../entidades/cvExtraido";
import type { ResultadoPuntaje } from "../puntaje/calcularPuntaje";

/** Convierte el PDF en texto plano. Lanza ErrorPdfIlegible si el archivo no se puede leer. */
export interface LectorPdf {
  extraerTexto(pdf: Uint8Array): Promise<string>;
}

/**
 * Pide a la IA los datos del CV. Devuelve la respuesta sin validar (unknown):
 * la validación la hace el caso de uso contra CvExtraidoSchema (RQ-COM-01).
 */
export interface ExtractorCv {
  readonly modelo: string;
  extraer(textoCv: string): Promise<unknown>;
}

export interface AlmacenArchivos {
  subir(ruta: string, contenido: Uint8Array, tipo: string): Promise<void>;
  descargar(ruta: string): Promise<Uint8Array>;
  eliminar(rutas: string[]): Promise<void>;
}

export interface PostulacionParaProcesar {
  id: string;
  rutaCv: string;
  requisitos: RequisitosOferta;
}

export interface ResultadoProcesamiento {
  textoCv: string;
  cv: CvExtraido;
  puntaje: ResultadoPuntaje;
  modeloIa: string;
  finalizadoEn: Date;
}

export interface RevisionManual {
  motivo: MotivoRevisionManual;
  detalle: string;
  modeloIa: string | null;
  finalizadoEn: Date;
}

export interface RepositorioPostulaciones {
  obtenerParaProcesar(id: string): Promise<PostulacionParaProcesar | null>;
  marcarProcesando(id: string, inicio: Date): Promise<void>;
  guardarResultado(id: string, resultado: ResultadoProcesamiento): Promise<void>;
  marcarRevisionManual(id: string, revision: RevisionManual): Promise<void>;
}

export class ErrorPdfIlegible extends Error {
  constructor(causa?: unknown) {
    super("No se pudo leer el PDF", { cause: causa });
    this.name = "ErrorPdfIlegible";
  }
}

export type Reloj = () => Date;
