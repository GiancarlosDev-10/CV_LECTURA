import Link from "next/link";
import { BotonEnlace, Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";

export const metadata = { title: "Mis ofertas · CV Lectura" };

export default async function PaginaMisOfertas() {
  const { db, usuarioId } = await requerirRol("reclutador");
  const { data: ofertas } = await db
    .from("ofertas")
    .select("id, titulo, estado, creado_en, postulaciones(count)")
    .eq("reclutador_id", usuarioId)
    .order("creado_en", { ascending: false });

  return (
    <>
      <TituloPagina titulo="Mis ofertas" acciones={<BotonEnlace href="/reclutador/ofertas/nueva">Nueva oferta</BotonEnlace>} />
      {(ofertas ?? []).length === 0 ? (
        <Tarjeta>Aún no publicaste ofertas.</Tarjeta>
      ) : (
        <Tarjeta className="p-0">
          <ul className="divide-y divide-borde">
            {(ofertas ?? []).map((o) => {
              const total = (o.postulaciones as unknown as { count: number }[])[0]?.count ?? 0;
              return (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <Link href={`/reclutador/ofertas/${o.id}`} className="font-semibold hover:text-primario">
                      {o.titulo}
                    </Link>
                    <p className="text-xs text-texto-2">Publicada el {formatoFecha(o.creado_en)}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="tabular-nums text-texto-2">{total} postulaciones</span>
                    <span className={o.estado === "abierta" ? "font-semibold text-exito" : "text-texto-2"}>
                      {o.estado === "abierta" ? "Abierta" : "Cerrada"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Tarjeta>
      )}
    </>
  );
}
