import type { SupabaseClient } from "@supabase/supabase-js";
import type { DatosDelPostulante, NuevaPostulacion } from "@/dominio/puertos";
import { BUCKET_CVS } from "./AlmacenArchivosSupabase";

const VIOLACION_UNICIDAD = "23505";

/**
 * Usa el cliente CON la sesión del postulante: la RLS garantiza que solo toca sus datos.
 * La eliminación de la cuenta es la única operación que requiere el cliente de servicio.
 */
export class DatosDelPostulanteSupabase implements DatosDelPostulante {
  constructor(
    private readonly db: SupabaseClient,
    private readonly postulanteId: string,
    private readonly servicio: () => SupabaseClient,
  ) {}

  async leerInicioDelCv(ruta: string, bytes: number): Promise<Uint8Array | null> {
    const { data, error } = await this.db.storage.from(BUCKET_CVS).download(ruta);
    if (error || !data) return null;
    return new Uint8Array(await data.slice(0, bytes).arrayBuffer());
  }

  async crearPostulacion(p: NuevaPostulacion) {
    const { error } = await this.db.from("postulaciones").insert({
      id: p.id,
      oferta_id: p.ofertaId,
      postulante_id: p.postulanteId,
      ruta_cv: p.rutaCv,
      consentimiento_version: p.consentimientoVersion,
      consentimiento_en: p.consentimientoEn.toISOString(),
    });
    if (!error) return "creada" as const;
    if (error.code === VIOLACION_UNICIDAD) return "duplicada" as const;
    // La política de INSERT rechaza ofertas cerradas o inexistentes
    return "oferta_no_disponible" as const;
  }

  async rutaDelCv(postulacionId: string): Promise<string | null> {
    const { data } = await this.db
      .from("postulaciones")
      .select("ruta_cv")
      .eq("id", postulacionId)
      .eq("postulante_id", this.postulanteId)
      .maybeSingle();
    return data?.ruta_cv ?? null;
  }

  async rutasDeTodosMisCv(): Promise<string[]> {
    const { data, error } = await this.db.from("postulaciones").select("ruta_cv").eq("postulante_id", this.postulanteId);
    if (error) throw new Error(`No se pudieron listar los CV: ${error.message}`);
    return data.map((f) => f.ruta_cv);
  }

  async eliminarArchivos(rutas: string[]): Promise<void> {
    if (rutas.length === 0) return;
    const { error } = await this.db.storage.from(BUCKET_CVS).remove(rutas);
    if (error) throw new Error(`No se pudieron eliminar los archivos: ${error.message}`);
  }

  async eliminarPostulacion(postulacionId: string): Promise<void> {
    const { error } = await this.db.from("postulaciones").delete().eq("id", postulacionId);
    if (error) throw new Error(`No se pudo eliminar la postulación: ${error.message}`);
  }

  async eliminarCuenta(): Promise<void> {
    const { error } = await this.servicio().auth.admin.deleteUser(this.postulanteId);
    if (error) throw new Error(`No se pudo eliminar la cuenta: ${error.message}`);
  }
}
