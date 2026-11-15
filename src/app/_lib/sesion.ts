import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { clienteServidor } from "@/infraestructura/supabase/clienteServidor";

export type Rol = "reclutador" | "postulante";

export interface Sesion {
  db: Awaited<ReturnType<typeof clienteServidor>>;
  usuarioId: string;
  email: string;
  rol: Rol;
  nombre: string;
}

/** Sesión verificada contra Supabase Auth (no solo la cookie). Se reutiliza en la misma petición. */
export const obtenerSesion = cache(async (): Promise<Sesion | null> => {
  const db = await clienteServidor();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data: perfil } = await db.from("perfiles").select("rol, nombre").eq("id", user.id).single();
  if (!perfil) return null;

  return { db, usuarioId: user.id, email: user.email ?? "", rol: perfil.rol as Rol, nombre: perfil.nombre };
});

/** Autorización por rol en cada página (además de la RLS en la base de datos). */
export async function requerirRol(rol: Rol): Promise<Sesion> {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/ingresar");
  if (sesion.rol !== rol) redirect(rutaInicio(sesion.rol));
  return sesion;
}

export function rutaInicio(rol: Rol): string {
  return rol === "reclutador" ? "/reclutador" : "/ofertas";
}
