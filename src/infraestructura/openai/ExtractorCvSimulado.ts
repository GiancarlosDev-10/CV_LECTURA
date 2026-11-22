import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import type { ExtractorCv } from "@/dominio/puertos";

export type ConfigSimulado =
  | { modo: "exito"; respuesta?: CvExtraido }
  | { modo: "json_invalido" }
  | { modo: "error" }
  | { modo: "demora"; demoraMs: number };

/**
 * Sustituto de OpenAI para desarrollo y pruebas: sin costo y repetible.
 * Permite provocar los fallos de la IA a voluntad (RQ-FIA-01).
 */
export class ExtractorCvSimulado implements ExtractorCv {
  readonly modelo = "simulado";
  llamadas = 0;

  constructor(private readonly config: ConfigSimulado = { modo: "exito" }) {}

  async extraer(textoCv: string): Promise<unknown> {
    this.llamadas++;
    const config = this.config;
    switch (config.modo) {
      case "exito":
        return config.respuesta ?? extraccionBasica(textoCv);
      case "json_invalido":
        return { nombre: 123, habilidades: "no es una lista" };
      case "error":
        throw new Error("Error 500 simulado del proveedor de IA");
      case "demora":
        await new Promise((resolver) => setTimeout(resolver, config.demoraMs));
        return extraccionBasica(textoCv);
    }
  }
}

/** Extracción mínima por expresiones regulares, solo para desarrollo local sin IA. */
function extraccionBasica(texto: string): CvExtraido {
  const primeraLinea = texto.split("\n").map((l) => l.trim()).find(Boolean) ?? null;
  const anios = texto.match(/(\d{1,2})\s+años de experiencia/i);
  return {
    nombre: primeraLinea ? primeraLinea.slice(0, 80) : null,
    email: texto.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)?.[0] ?? null,
    telefono: texto.match(/\+?\d[\d\s-]{7,}\d/)?.[0] ?? null,
    aniosExperiencia: anios ? Number(anios[1]) : null,
    nivelEducativo: null,
    habilidades: [],
    idiomas: [],
  };
}
