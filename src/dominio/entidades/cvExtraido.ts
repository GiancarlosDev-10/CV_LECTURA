import { z } from "zod";
import { NIVELES_EDUCATIVOS } from "./niveles";

export const NIVELES_IDIOMA = ["A1", "A2", "B1", "B2", "C1", "C2", "nativo"] as const;

export const IdiomaCvSchema = z.object({
  idioma: z.string().min(1),
  nivel: z.enum(NIVELES_IDIOMA),
});

/**
 * Contrato de los datos que la IA debe devolver para un CV.
 * Los campos ausentes en el CV llegan como null: la IA no debe inventarlos.
 */
export const CvExtraidoSchema = z.object({
  nombre: z.string().min(1).nullable(),
  email: z.string().min(3).nullable(),
  telefono: z.string().min(3).nullable(),
  aniosExperiencia: z.number().min(0).max(70).nullable(),
  nivelEducativo: z.enum(NIVELES_EDUCATIVOS).nullable(),
  habilidades: z.array(z.string().min(1)),
  idiomas: z.array(IdiomaCvSchema),
});

export type CvExtraido = z.infer<typeof CvExtraidoSchema>;
export type IdiomaCv = z.infer<typeof IdiomaCvSchema>;
export type NivelIdioma = (typeof NIVELES_IDIOMA)[number];
