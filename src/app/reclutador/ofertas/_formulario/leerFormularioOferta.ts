import { z } from "zod";
import { RequisitosOfertaSchema } from "@/dominio/entidades/oferta";

/** Estado que devuelven las acciones de crear y editar oferta al formulario. */
export interface EstadoOferta {
  error?: string;
}

export const MENSAJE_OFERTA_CON_POSTULACIONES =
  "Esta oferta ya tiene postulaciones y no se puede editar: sus puntajes se calcularon con estos requisitos. Ciérrala y publica una nueva.";

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

export type DatosOferta = z.infer<typeof Oferta>;

/** Valida los campos del formulario de oferta (el mismo para crear y para editar). */
export function leerFormularioOferta(formData: FormData) {
  const idiomas = [0, 1, 2]
    .map((i) => ({ idioma: String(formData.get(`idioma_${i}`) ?? "").trim(), nivel: String(formData.get(`nivel_${i}`) ?? "") }))
    .filter((i) => i.idioma);

  return Oferta.safeParse({
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
}
