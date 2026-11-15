"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requerirRol } from "@/app/_lib/sesion";
import { RequisitosOfertaSchema } from "@/dominio/entidades/oferta";

export interface EstadoOferta {
  error?: string;
}

const lista = (valor: FormDataEntryValue | null) =>
  String(valor ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const Oferta = z.object({
  titulo: z.string().trim().min(3, "El título debe tener al menos 3 caracteres").max(150),
  descripcion: z.string().trim().max(2000),
  requisitos: RequisitosOfertaSchema,
});

export async function crearOferta(_previo: EstadoOferta, formData: FormData): Promise<EstadoOferta> {
  const { db, usuarioId } = await requerirRol("reclutador");

  const idiomas = [0, 1, 2]
    .map((i) => ({ idioma: String(formData.get(`idioma_${i}`) ?? "").trim(), nivel: String(formData.get(`nivel_${i}`) ?? "") }))
    .filter((i) => i.idioma);

  const datos = Oferta.safeParse({
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion") ?? "",
    requisitos: {
      habilidadesObligatorias: lista(formData.get("obligatorias")),
      habilidadesDeseables: lista(formData.get("deseables")),
      aniosExperiencia: Number(formData.get("anios") ?? 0),
      nivelEducativo: formData.get("nivelEducativo") || null,
      idiomas,
      pesos: {
        obligatorias: Number(formData.get("peso_obligatorias")),
        deseables: Number(formData.get("peso_deseables")),
        experiencia: Number(formData.get("peso_experiencia")),
        educacion: Number(formData.get("peso_educacion")),
        idiomas: Number(formData.get("peso_idiomas")),
      },
    },
  });
  if (!datos.success) return { error: datos.error.issues[0].message };

  const { data, error } = await db
    .from("ofertas")
    .insert({ reclutador_id: usuarioId, ...datos.data })
    .select("id")
    .single();
  if (error) return { error: "No se pudo guardar la oferta. Inténtalo de nuevo." };

  redirect(`/reclutador/ofertas/${data.id}`);
}
