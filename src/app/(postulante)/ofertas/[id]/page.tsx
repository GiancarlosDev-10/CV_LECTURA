import { notFound } from "next/navigation";
import { BotonEnlace, Tarjeta, TituloPagina } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import { CONSENTIMIENTO_VIGENTE } from "@/dominio/entidades/consentimiento";
import { RequisitosOfertaSchema } from "@/dominio/entidades/oferta";
import { FormularioPostulacion } from "./FormularioPostulacion";

// El procesamiento del CV (IA) corre con after() dentro de esta ruta.
export const maxDuration = 60;

const NIVEL_EDUCATIVO: Record<string, string> = {
  secundaria: "Secundaria",
  tecnico: "Técnico",
  universitario: "Universitario",
  maestria: "Maestría",
  doctorado: "Doctorado",
};

export default async function PaginaOferta({ params }: PageProps<"/ofertas/[id]">) {
  const { id } = await params;
  const { db, usuarioId } = await requerirRol("postulante");

  const [{ data: oferta }, { data: postulacion }] = await Promise.all([
    db.from("ofertas").select("id, titulo, descripcion, requisitos, estado").eq("id", id).maybeSingle(),
    db.from("postulaciones").select("id").eq("oferta_id", id).eq("postulante_id", usuarioId).maybeSingle(),
  ]);
  if (!oferta) notFound();
  const r = RequisitosOfertaSchema.parse(oferta.requisitos);

  return (
    <>
      <TituloPagina titulo={oferta.titulo} subtitulo={oferta.descripcion} />
      <Tarjeta className="grid gap-3 text-sm">
        <h2 className="text-base font-semibold">Requisitos</h2>
        <dl className="grid gap-2 sm:grid-cols-[200px_1fr]">
          <dt className="font-medium text-texto-2">Habilidades obligatorias</dt>
          <dd>{r.habilidadesObligatorias.join(", ") || "—"}</dd>
          <dt className="font-medium text-texto-2">Habilidades deseables</dt>
          <dd>{r.habilidadesDeseables.join(", ") || "—"}</dd>
          <dt className="font-medium text-texto-2">Experiencia</dt>
          <dd>{r.aniosExperiencia} años</dd>
          <dt className="font-medium text-texto-2">Nivel educativo</dt>
          <dd>{r.nivelEducativo ? NIVEL_EDUCATIVO[r.nivelEducativo] : "No se exige"}</dd>
          <dt className="font-medium text-texto-2">Idiomas</dt>
          <dd>{r.idiomas.map((i) => `${i.idioma} ${i.nivel}`).join(", ") || "No se exigen"}</dd>
        </dl>
      </Tarjeta>

      {postulacion ? (
        <Tarjeta className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <span className="font-semibold text-exito">✓ Ya postulaste a esta oferta.</span> Puedes ver el estado o eliminar tus datos.
          </p>
          <BotonEnlace href="/mis-postulaciones" variante="secundario">
            Mis postulaciones
          </BotonEnlace>
        </Tarjeta>
      ) : oferta.estado !== "abierta" ? (
        <Tarjeta>Esta oferta ya no recibe postulaciones.</Tarjeta>
      ) : (
        <Tarjeta>
          <h2 className="mb-4 text-base font-semibold">Postular con tu CV</h2>
          <FormularioPostulacion
            ofertaId={oferta.id}
            postulanteId={usuarioId}
            consentimiento={{ version: CONSENTIMIENTO_VIGENTE.version, puntos: [...CONSENTIMIENTO_VIGENTE.puntos] }}
          />
        </Tarjeta>
      )}
    </>
  );
}
