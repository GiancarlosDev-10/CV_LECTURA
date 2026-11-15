import Link from "next/link";
import { Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import { RequisitosOfertaSchema } from "@/dominio/entidades/oferta";

export const metadata = { title: "Ofertas · CV Lectura" };

export default async function PaginaOfertas() {
  const { db, usuarioId } = await requerirRol("postulante");
  const [{ data: ofertas }, { data: mias }] = await Promise.all([
    db.from("ofertas").select("id, titulo, descripcion, requisitos, creado_en").eq("estado", "abierta").order("creado_en", { ascending: false }),
    db.from("postulaciones").select("oferta_id").eq("postulante_id", usuarioId),
  ]);
  const yaPostule = new Set((mias ?? []).map((p) => p.oferta_id));

  return (
    <>
      <TituloPagina titulo="Ofertas abiertas" subtitulo={`${ofertas?.length ?? 0} ofertas disponibles`} />
      {(ofertas ?? []).length === 0 && <Tarjeta>No hay ofertas abiertas por ahora.</Tarjeta>}
      <div className="grid gap-4">
        {(ofertas ?? []).map((o) => {
          const r = RequisitosOfertaSchema.safeParse(o.requisitos);
          return (
            <Tarjeta key={o.id} className="grid gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  <Link href={`/ofertas/${o.id}`} className="hover:text-primario">
                    {o.titulo}
                  </Link>
                </h2>
                {yaPostule.has(o.id) && <span className="text-xs font-semibold text-exito">✓ Ya postulaste</span>}
              </div>
              <p className="text-sm text-texto-2">{o.descripcion}</p>
              {r.success && (
                <p className="text-sm">
                  <span className="font-medium">Requiere:</span> {r.data.habilidadesObligatorias.join(", ") || "—"} ·{" "}
                  {r.data.aniosExperiencia} años de experiencia
                </p>
              )}
              <p className="text-xs text-texto-2">Publicada el {formatoFecha(o.creado_en)}</p>
            </Tarjeta>
          );
        })}
      </div>
    </>
  );
}
