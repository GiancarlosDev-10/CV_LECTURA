import type { SupabaseClient } from "@supabase/supabase-js";
import type { AlmacenArchivos } from "@/dominio/puertos";

export const BUCKET_CVS = "cvs";

export class AlmacenArchivosSupabase implements AlmacenArchivos {
  constructor(private readonly db: SupabaseClient) {}

  async subir(ruta: string, contenido: Uint8Array, tipo: string): Promise<void> {
    const { error } = await this.db.storage.from(BUCKET_CVS).upload(ruta, contenido, { contentType: tipo, upsert: false });
    if (error) throw new Error(`No se pudo subir el archivo: ${error.message}`);
  }

  async descargar(ruta: string): Promise<Uint8Array> {
    const { data, error } = await this.db.storage.from(BUCKET_CVS).download(ruta);
    if (error || !data) throw new Error(`No se pudo descargar el archivo: ${error?.message ?? "vacío"}`);
    return new Uint8Array(await data.arrayBuffer());
  }

  async eliminar(rutas: string[]): Promise<void> {
    if (rutas.length === 0) return;
    const { error } = await this.db.storage.from(BUCKET_CVS).remove(rutas);
    if (error) throw new Error(`No se pudo eliminar el archivo: ${error.message}`);
  }
}
