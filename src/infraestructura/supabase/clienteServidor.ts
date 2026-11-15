import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { entorno } from "@/infraestructura/entorno";

/**
 * Cliente con la sesión del usuario (clave publicable + cookies).
 * Todas sus consultas pasan por la RLS: es el cliente por defecto del servidor.
 */
export async function clienteServidor() {
  const almacenCookies = await cookies();
  return createServerClient(entorno.supabaseUrl(), entorno.supabaseClavePublica(), {
    cookies: {
      getAll: () => almacenCookies.getAll(),
      setAll: (porEscribir) => {
        try {
          porEscribir.forEach(({ name, value, options }) => almacenCookies.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el proxy ya refresca la sesión.
        }
      },
    },
  });
}
