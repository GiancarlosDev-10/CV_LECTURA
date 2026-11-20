/** Formato de un archivo de corrida (dataset/corridas/*.json) y lectura del dataset esperado. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { CvExtraidoSchema } from "../../src/dominio/entidades/cvExtraido";
import type { CasoEsperado } from "./compararExtraccion";

export const CorridaSchema = z.object({
  corrida: z.string().min(1),
  entorno: z.enum(["local", "dev", "prod"]),
  modelo: z.string().min(1),
  commit: z.string().min(1),
  fecha: z.string().min(1),
  resultados: z.array(
    z.discriminatedUnion("estado", [
      z.object({ id: z.string(), estado: z.literal("procesada"), cvExtraido: CvExtraidoSchema }),
      z.object({ id: z.string(), estado: z.literal("pendiente_revision_manual"), motivo: z.string() }),
    ]),
  ),
});

export type Corrida = z.infer<typeof CorridaSchema>;

/** Alcance de RQ-FUN-01 y RQ-FUN-02 (E05 5.3): cv-01 a cv-34 que deben terminar procesados. */
const ULTIMO_CV_DEL_ALCANCE = 34;

const EsperadoSchema = z.object({
  id: z.string(),
  archivo: z.string(),
  resultadoEsperado: z.object({ tipo: z.string() }),
  esperado: CvExtraidoSchema.nullish(),
});

export type EsperadoDataset = z.infer<typeof EsperadoSchema>;

export function leerEsperados(directorio: string): EsperadoDataset[] {
  return readdirSync(directorio)
    .filter((f) => /^cv-\d+\.json$/.test(f))
    .sort()
    .map((f) => EsperadoSchema.parse(JSON.parse(readFileSync(join(directorio, f), "utf8"))));
}

export function casosDelAlcance(esperados: EsperadoDataset[]): CasoEsperado[] {
  return esperados
    .filter((e) => Number(e.id.slice(3)) <= ULTIMO_CV_DEL_ALCANCE && e.resultadoEsperado.tipo === "procesada")
    .map((e) => {
      if (!e.esperado) throw new Error(`${e.id} debe terminar procesado pero no tiene "esperado"`);
      return { id: e.id, esperado: e.esperado };
    });
}

export function leerCorrida(ruta: string): Corrida {
  const resultado = CorridaSchema.safeParse(JSON.parse(readFileSync(ruta, "utf8")));
  if (!resultado.success) {
    throw new Error(`${ruta} no tiene el formato de una corrida:\n${z.prettifyError(resultado.error)}`);
  }
  return resultado.data;
}
