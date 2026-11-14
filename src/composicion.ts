import "server-only";
import type { DependenciasProcesarCv } from "@/aplicacion/procesarCv";
import type { ExtractorCv } from "@/dominio/puertos";
import { entorno } from "@/infraestructura/entorno";
import { ExtractorCvOpenAi } from "@/infraestructura/openai/ExtractorCvOpenAi";
import { ExtractorCvSimulado } from "@/infraestructura/openai/ExtractorCvSimulado";
import { LectorPdfUnpdf } from "@/infraestructura/pdf/LectorPdfUnpdf";
import { AlmacenArchivosSupabase } from "@/infraestructura/supabase/AlmacenArchivosSupabase";
import { clienteServicio } from "@/infraestructura/supabase/clienteServicio";
import { RepositorioPostulacionesSupabase } from "@/infraestructura/supabase/RepositorioPostulacionesSupabase";

/** Único punto donde se eligen las implementaciones concretas de los puertos. */
export function crearExtractorCv(): ExtractorCv {
  if (entorno.extractorIa() === "openai") {
    return new ExtractorCvOpenAi({
      apiKey: entorno.openAiClave(),
      modelo: entorno.openAiModelo(),
      temperatura: entorno.openAiTemperatura(),
    });
  }
  return new ExtractorCvSimulado();
}

export function dependenciasProcesarCv(): DependenciasProcesarCv {
  const db = clienteServicio();
  return {
    repositorio: new RepositorioPostulacionesSupabase(db),
    almacen: new AlmacenArchivosSupabase(db),
    lectorPdf: new LectorPdfUnpdf(),
    extractorCv: crearExtractorCv(),
    reloj: () => new Date(),
  };
}
