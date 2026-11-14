import { z } from "zod";
import { NIVELES_EDUCATIVOS } from "./niveles";

export const PesosSchema = z
  .object({
    obligatorias: z.number().int().min(0),
    deseables: z.number().int().min(0),
    experiencia: z.number().int().min(0),
    educacion: z.number().int().min(0),
    idiomas: z.number().int().min(0),
  })
  .refine(
    (p) => p.obligatorias + p.deseables + p.experiencia + p.educacion + p.idiomas === 100,
    { message: "Los pesos deben sumar 100" },
  );

export const PESOS_POR_DEFECTO: Pesos = {
  obligatorias: 40,
  deseables: 20,
  experiencia: 20,
  educacion: 10,
  idiomas: 10,
};

export const RequisitosOfertaSchema = z.object({
  habilidadesObligatorias: z.array(z.string().min(1)),
  habilidadesDeseables: z.array(z.string().min(1)),
  aniosExperiencia: z.number().min(0),
  nivelEducativo: z.enum(NIVELES_EDUCATIVOS).nullable(),
  idiomas: z.array(
    z.object({
      idioma: z.string().min(1),
      nivel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
    }),
  ),
  pesos: PesosSchema,
});

export type Pesos = z.infer<typeof PesosSchema>;
export type RequisitosOferta = z.infer<typeof RequisitosOfertaSchema>;
