"use server";

import { revalidatePath } from "next/cache";
import { requerirRol } from "@/app/_lib/sesion";

export async function cambiarEstadoOferta(ofertaId: string, estado: "abierta" | "cerrada") {
  const { db } = await requerirRol("reclutador");
  // La RLS impide modificar ofertas de otro reclutador
  await db.from("ofertas").update({ estado, actualizado_en: new Date().toISOString() }).eq("id", ofertaId);
  revalidatePath(`/reclutador/ofertas/${ofertaId}`);
  revalidatePath("/reclutador");
}
