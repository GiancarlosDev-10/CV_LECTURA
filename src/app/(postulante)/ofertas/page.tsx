import { Briefcase, CheckCircle2, ChevronRight, GraduationCap, SearchX } from "lucide-react";
import Link from "next/link";
import { TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { EstadoVacio } from "@/app/_componentes/visual";
import { requerirRol } from "@/app/_lib/sesion";
import { NIVEL_EDUCATIVO } from "@/app/_lib/textos";
import { RequisitosOfertaSchema } from "@/dominio/entidades/oferta";

export const metadata = { title: "Ofertas · CV Lectura" };

export default async function PaginaOfertas() {
  const { db, usuarioId } = await requerirRol("postulante");
  const [{ data: ofertas }, { data: mias }] = await Promise.all([
    db.from("ofertas").select("id, titulo, descripcion, requisitos, creado_en").eq("estado", "abierta").order("creado_en", { ascending: false }),
    db.from("postulaciones").select("oferta_id").eq("postulante_id", usuarioId),
  ]);
  const yaPostule = new Set((mias ?? []).map((p) => p.oferta_id));
  const lista = ofertas ?? [];

  return (
    <>
      <TituloPagina titulo="Ofertas abiertas" subtitulo={`${lista.length} ${lista.length === 1 ? "oferta disponible" : "ofertas disponibles"}`} />
      {lista.length === 0 ? (
        <EstadoVacio Icono={SearchX} titulo="No hay ofertas abiertas por ahora">
          Vuelve más tarde: las nuevas ofertas aparecerán aquí.
        </EstadoVacio>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lista.map((o) => {
            const r = RequisitosOfertaSchema.safeParse(o.requisitos);
            return (
              <Link
                key={o.id}
                href={`/ofertas/${o.id}`}
                className="group grid gap-3 rounded-xl border border-borde bg-superficie p-5 transition-colors hover:border-primario/50 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold group-hover:text-primario">{o.titulo}</h2>
                  {yaPostule.has(o.id) ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-exito">
                      <CheckCircle2 aria-hidden className="size-4" /> Ya postulaste
                    </span>
                  ) : (
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-slate-400 group-hover:text-primario" />
                  )}
                </div>
                <p className="line-clamp-2 text-sm text-texto-2">{o.descripcion}</p>
                {r.success && (
                  <>
                    <div className="flex flex-wrap gap-1">
                      {r.data.habilidadesObligatorias.slice(0, 5).map((h) => (
                        <span key={h} className="rounded-md bg-primario-suave px-2 py-0.5 text-xs font-medium text-primario-oscuro">
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-texto-2">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase aria-hidden className="size-3.5" /> {r.data.aniosExperiencia} años de experiencia
                      </span>
                      {r.data.nivelEducativo && (
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap aria-hidden className="size-3.5" /> {NIVEL_EDUCATIVO[r.data.nivelEducativo]}
                        </span>
                      )}
                    </div>
                  </>
                )}
                <p className="text-xs text-texto-2">Publicada el {formatoFecha(o.creado_en)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
