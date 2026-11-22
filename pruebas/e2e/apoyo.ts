import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Page } from "@playwright/test";

process.loadEnvFile?.(".env.prod.local");

/** Cliente con la clave secreta: solo para preparar y verificar datos, nunca para la interfaz. */
export const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false },
});

export const CLAVE_SEED = process.env.SEED_CLAVE!;

export async function ingresar(pagina: Page, email: string, clave: string) {
  await pagina.goto("/ingresar");
  await pagina.waitForLoadState("networkidle");
  await pagina.fill("#email", email);
  await pagina.fill("#clave", clave);
  await pagina.press("#clave", "Enter");
  await pagina.waitForURL((url) => !url.pathname.startsWith("/ingresar"));
}

/** Postulante ficticio de un solo uso (se elimina al terminar la prueba). */
export async function crearPostulanteTemporal(perfil: string) {
  const email = `e2e-${perfil}-${Date.now()}@example.com`;
  const clave = randomBytes(18).toString("base64url");
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: clave,
    email_confirm: true,
    user_metadata: { nombre: `E2E ${perfil}` },
  });
  if (error || !data.user) throw error ?? new Error("No se creó el postulante temporal");
  return { id: data.user.id, email, clave };
}

export async function eliminarUsuario(id: string) {
  const { data: archivos } = await db.storage.from("cvs").list(id);
  if (archivos?.length) await db.storage.from("cvs").remove(archivos.map((a) => `${id}/${a.name}`));
  await db.auth.admin.deleteUser(id);
}

export async function idOferta(titulo: string): Promise<string> {
  const { data, error } = await db.from("ofertas").select("id").eq("titulo", titulo).eq("estado", "abierta").single();
  if (error) throw error;
  return data.id;
}
