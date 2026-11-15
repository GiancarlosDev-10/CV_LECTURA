"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eliminarMiCuenta, eliminarPostulacion } from "@/aplicacion/eliminarMisDatos";
import { requerirRol } from "@/app/_lib/sesion";
import { DatosDelPostulanteSupabase } from "@/infraestructura/supabase/DatosDelPostulanteSupabase";
import { clienteServicio } from "@/infraestructura/supabase/clienteServicio";

async function datosDelPostulante() {
  const sesion = await requerirRol("postulante");
  return { sesion, datos: new DatosDelPostulanteSupabase(sesion.db, sesion.usuarioId, clienteServicio) };
}

export async function accionEliminarPostulacion(postulacionId: string) {
  const { datos } = await datosDelPostulante();
  const resultado = await eliminarPostulacion(postulacionId, datos);
  revalidatePath("/mis-postulaciones");
  return resultado;
}

export async function accionEliminarCuenta() {
  const { sesion, datos } = await datosDelPostulante();
  await eliminarMiCuenta(datos);
  await sesion.db.auth.signOut();
  redirect("/?cuenta-eliminada=1");
}
