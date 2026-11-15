"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { obtenerSesion, rutaInicio } from "@/app/_lib/sesion";
import { clienteServidor } from "@/infraestructura/supabase/clienteServidor";

export interface EstadoFormulario {
  error?: string;
  campos?: Record<string, string>;
}

const Ingreso = z.object({
  email: z.email("Ingresa un correo válido"),
  clave: z.string().min(1, "Ingresa tu contraseña"),
});

export async function ingresar(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const datos = Ingreso.safeParse({ email: formData.get("email"), clave: formData.get("clave") });
  if (!datos.success) return { error: datos.error.issues[0].message, campos: { email: String(formData.get("email") ?? "") } };

  const db = await clienteServidor();
  const { error } = await db.auth.signInWithPassword({ email: datos.data.email, password: datos.data.clave });
  // Mensaje genérico: no revela si el correo existe
  if (error) return { error: "Correo o contraseña incorrectos.", campos: { email: datos.data.email } };

  const sesion = await obtenerSesion();
  redirect(sesion ? rutaInicio(sesion.rol) : "/");
}

const Registro = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  email: z.email("Ingresa un correo válido"),
  clave: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe incluir una mayúscula")
    .regex(/[0-9]/, "La contraseña debe incluir un número"),
});

/** Registro público: siempre crea un postulante (el rol reclutador solo se asigna con el seed). */
export async function registrar(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const campos = { nombre: String(formData.get("nombre") ?? ""), email: String(formData.get("email") ?? "") };
  const datos = Registro.safeParse({ ...campos, clave: formData.get("clave") });
  if (!datos.success) return { error: datos.error.issues[0].message, campos };

  const db = await clienteServidor();
  const { error } = await db.auth.signUp({
    email: datos.data.email,
    password: datos.data.clave,
    options: { data: { nombre: datos.data.nombre } },
  });
  if (error) return { error: "No se pudo crear la cuenta. Verifica los datos o usa otro correo.", campos };

  redirect("/ofertas");
}

export async function salir() {
  const db = await clienteServidor();
  await db.auth.signOut();
  redirect("/ingresar");
}
