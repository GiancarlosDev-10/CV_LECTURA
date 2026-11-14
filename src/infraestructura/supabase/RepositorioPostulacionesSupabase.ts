import type { SupabaseClient } from "@supabase/supabase-js";
import { RequisitosOfertaSchema } from "@/dominio/entidades/oferta";
import type {
  PostulacionParaProcesar,
  RepositorioPostulaciones,
  ResultadoProcesamiento,
  RevisionManual,
} from "@/dominio/puertos";

export class RepositorioPostulacionesSupabase implements RepositorioPostulaciones {
  constructor(private readonly db: SupabaseClient) {}

  async obtenerParaProcesar(id: string): Promise<PostulacionParaProcesar | null> {
    const { data, error } = await this.db
      .from("postulaciones")
      .select("id, ruta_cv, ofertas!inner(requisitos)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`No se pudo leer la postulación: ${error.message}`);
    if (!data) return null;

    const oferta = Array.isArray(data.ofertas) ? data.ofertas[0] : data.ofertas;
    return {
      id: data.id,
      rutaCv: data.ruta_cv,
      requisitos: RequisitosOfertaSchema.parse(oferta?.requisitos),
    };
  }

  async marcarProcesando(id: string, inicio: Date): Promise<void> {
    await this.actualizar(id, { estado: "procesando", inicio_procesamiento: inicio.toISOString() });
  }

  async guardarResultado(id: string, r: ResultadoProcesamiento): Promise<void> {
    await this.actualizar(id, {
      estado: "procesada",
      texto_cv: r.textoCv,
      cv_extraido: r.cv,
      puntaje: r.puntaje.total,
      desglose: r.puntaje.desglose,
      modelo_ia: r.modeloIa,
      motivo_revision: null,
      detalle_revision: null,
      fin_procesamiento: r.finalizadoEn.toISOString(),
    });
  }

  async marcarRevisionManual(id: string, r: RevisionManual): Promise<void> {
    await this.actualizar(id, {
      estado: "pendiente_revision_manual",
      puntaje: null,
      desglose: null,
      motivo_revision: r.motivo,
      detalle_revision: r.detalle.slice(0, 1000),
      modelo_ia: r.modeloIa,
      fin_procesamiento: r.finalizadoEn.toISOString(),
    });
  }

  private async actualizar(id: string, cambios: Record<string, unknown>): Promise<void> {
    const { error } = await this.db.from("postulaciones").update(cambios).eq("id", id);
    if (error) throw new Error(`No se pudo actualizar la postulación: ${error.message}`);
  }
}
