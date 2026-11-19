"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requerirRol } from "@/app/_lib/sesion";

const Decision = z.object({
  postulacionId: z.uuid(),
  decision: z.enum(["preseleccionado", "descartado"]).nullable(),
  nota: z.string().trim().max(1000),
});

/**
 * Registra la decisión humana sobre una postulación. La base de datos solo permite
 * escribir las columnas de decisión, solo al reclutador dueño de la oferta y solo a su nombre.
 */
export async function registrarDecision(entrada: z.input<typeof Decision>): Promise<{ ok: boolean; mensaje?: string }> {
  const { db, usuarioId } = await requerirRol("reclutador");
  const datos = Decision.safeParse(entrada);
  if (!datos.success) return { ok: false, mensaje: "La decisión no es válida." };

  const { postulacionId, decision, nota } = datos.data;
  const { data, error } = await db
    .from("postulaciones")
    .update({
      decision,
      decision_nota: nota || null,
      decision_en: decision ? new Date().toISOString() : null,
      decidido_por: usuarioId,
    })
    .eq("id", postulacionId)
    .select("oferta_id")
    .maybeSingle();
  if (error || !data) return { ok: false, mensaje: "No se pudo guardar la decisión." };

  revalidatePath(`/reclutador/postulaciones/${postulacionId}`);
  revalidatePath(`/reclutador/ofertas/${data.oferta_id}`);
  return { ok: true };
}
