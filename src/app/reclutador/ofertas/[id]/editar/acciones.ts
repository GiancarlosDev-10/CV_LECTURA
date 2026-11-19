"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirRol } from "@/app/_lib/sesion";
import { MENSAJE_OFERTA_CON_POSTULACIONES, leerFormularioOferta, type EstadoOferta } from "../../_formulario/leerFormularioOferta";

/**
 * Edita una oferta solo mientras no tenga postulaciones (RQ-FUN-03: el puntaje
 * se calcula una vez con los requisitos vigentes). La BD lo vuelve a verificar
 * con un disparador, y la RLS impide editar ofertas de otro reclutador.
 */
export async function editarOferta(ofertaId: string, _previo: EstadoOferta, formData: FormData): Promise<EstadoOferta> {
  const { db, usuarioId } = await requerirRol("reclutador");

  const datos = leerFormularioOferta(formData);
  if (!datos.success) return { error: datos.error.issues[0].message };

  const { data, error } = await db
    .from("ofertas")
    .update({ ...datos.data, actualizado_en: new Date().toISOString() })
    .eq("id", ofertaId)
    .eq("reclutador_id", usuarioId)
    .select("id");
  if (error?.message.includes("OFERTA_CON_POSTULACIONES")) return { error: MENSAJE_OFERTA_CON_POSTULACIONES };
  if (error) return { error: "No se pudo guardar la oferta. Inténtalo de nuevo." };
  if (!data?.length) return { error: "La oferta no existe o no es tuya." };

  revalidatePath(`/reclutador/ofertas/${ofertaId}`);
  revalidatePath("/reclutador");
  redirect(`/reclutador/ofertas/${ofertaId}`);
}
