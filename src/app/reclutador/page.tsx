import { BriefcaseBusiness, ChevronRight, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { BotonEnlace, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { EstadoVacio } from "@/app/_componentes/visual";
import { requerirRol } from "@/app/_lib/sesion";

export const metadata = { title: "Mis ofertas · CV Lectura" };

export default async function PaginaMisOfertas() {
  const { db, usuarioId } = await requerirRol("reclutador");
  const { data: ofertas } = await db
    .from("ofertas")
    .select("id, titulo, estado, creado_en, postulaciones(estado)")
    .eq("reclutador_id", usuarioId)
    .order("creado_en", { ascending: false });
  const lista = ofertas ?? [];

  return (
    <>
      <TituloPagina
        titulo="Mis ofertas"
        subtitulo="Abre una oferta para ver el ranking de postulantes."
        acciones={
          <BotonEnlace href="/reclutador/ofertas/nueva">
            <PlusCircle aria-hidden className="size-4" /> Nueva oferta
          </BotonEnlace>
        }
      />
      {lista.length === 0 ? (
        <EstadoVacio Icono={BriefcaseBusiness} titulo="Aún no publicaste ofertas">
          Crea tu primera oferta con sus requisitos y pesos; los postulantes podrán enviar su CV.
        </EstadoVacio>
      ) : (
        <div className="grid gap-3">
          {lista.map((o) => {
            const postulaciones = (o.postulaciones ?? []) as { estado: string }[];
            const revision = postulaciones.filter((p) => p.estado === "pendiente_revision_manual").length;
            return (
              <Link
                key={o.id}
                href={`/reclutador/ofertas/${o.id}`}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-borde bg-superficie px-5 py-4 transition-colors hover:border-primario/50"
              >
                <div className="grid gap-1">
                  <span className="font-semibold group-hover:text-primario">{o.titulo}</span>
                  <span className="text-xs text-texto-2">Publicada el {formatoFecha(o.creado_en)}</span>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <span className="inline-flex items-center gap-1.5 tabular-nums text-texto-2">
                    <Users aria-hidden className="size-4" /> {postulaciones.length}
                  </span>
                  {revision > 0 && <span className="rounded-full bg-aviso/10 px-2 py-0.5 text-xs font-semibold text-aviso">{revision} en revisión manual</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${o.estado === "abierta" ? "bg-exito/10 text-exito" : "bg-slate-100 text-texto-2"}`}>
                    {o.estado === "abierta" ? "Abierta" : "Cerrada"}
                  </span>
                  <ChevronRight aria-hidden className="size-5 text-slate-400 group-hover:text-primario" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
