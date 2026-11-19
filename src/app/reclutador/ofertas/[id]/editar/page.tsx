import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonEnlace, Tarjeta, TituloPagina } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import type { RequisitosOferta } from "@/dominio/entidades/oferta";
import { FormularioOferta } from "../../_formulario/FormularioOferta";
import { MENSAJE_OFERTA_CON_POSTULACIONES } from "../../_formulario/leerFormularioOferta";
import { editarOferta } from "./acciones";

export const metadata = { title: "Editar oferta · CV Lectura" };

export default async function PaginaEditarOferta({ params }: PageProps<"/reclutador/ofertas/[id]/editar">) {
  const { id } = await params;
  const { db, usuarioId } = await requerirRol("reclutador");

  const { data: oferta } = await db
    .from("ofertas")
    .select("id, titulo, descripcion, requisitos")
    .eq("id", id)
    .eq("reclutador_id", usuarioId)
    .maybeSingle();
  if (!oferta) notFound();

  const { count } = await db.from("postulaciones").select("id", { count: "exact", head: true }).eq("oferta_id", id);
  const tienePostulaciones = (count ?? 0) > 0;

  return (
    <>
      <Link href={`/reclutador/ofertas/${id}`} className="inline-flex items-center gap-1 text-sm text-primario hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> Volver a la oferta
      </Link>
      <TituloPagina titulo="Editar oferta" subtitulo="Solo se puede editar mientras la oferta no tenga postulaciones." />
      {tienePostulaciones ? (
        <Tarjeta className="grid justify-items-start gap-3">
          <p className="text-sm">{MENSAJE_OFERTA_CON_POSTULACIONES}</p>
          <BotonEnlace href={`/reclutador/ofertas/${id}`} variante="secundario">
            Volver a la oferta
          </BotonEnlace>
        </Tarjeta>
      ) : (
        <Tarjeta>
          <FormularioOferta
            accion={editarOferta.bind(null, id)}
            inicial={{ titulo: oferta.titulo, descripcion: oferta.descripcion, requisitos: oferta.requisitos as RequisitosOferta }}
            textoBoton="Guardar cambios"
            textoPendiente="Guardando…"
          />
        </Tarjeta>
      )}
    </>
  );
}
