import { createBrowserClient } from "@supabase/ssr";

/** Cliente del navegador (clave publicable). Se usa solo para subir el PDF directo a Storage. */
export function clienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
