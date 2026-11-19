import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { entorno } from "@/infraestructura/entorno";

let cliente: SupabaseClient | undefined;

/**
 * Cliente con la clave secreta: salta la RLS. Solo para el procesamiento en servidor
 * (escribir estado y puntaje) y la verificación de disponibilidad (/api/salud, que no devuelve datos);
 * nunca para atender peticiones en nombre de un usuario.
 */
export function clienteServicio(): SupabaseClient {
  cliente ??= createClient(entorno.supabaseUrl(), entorno.supabaseClaveSecreta(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
