"use server";

import { redirect } from "next/navigation";
import { requerirRol } from "@/app/_lib/sesion";
import { leerFormularioOferta, type EstadoOferta } from "../_formulario/leerFormularioOferta";

export async function crearOferta(_previo: EstadoOferta, formData: FormData): Promise<EstadoOferta> {
  const { db, usuarioId } = await requerirRol("reclutador");

  const datos = leerFormularioOferta(formData);
  if (!datos.success) return { error: datos.error.issues[0].message };

  const { data, error } = await db
    .from("ofertas")
    .insert({ reclutador_id: usuarioId, ...datos.data })
    .select("id")
    .single();
  if (error) return { error: "No se pudo guardar la oferta. Inténtalo de nuevo." };

  redirect(`/reclutador/ofertas/${data.id}`);
}
