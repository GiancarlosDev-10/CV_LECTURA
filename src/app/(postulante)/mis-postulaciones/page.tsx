import Link from "next/link";
import { EstadoPostulacion, Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import { RefrescoAutomatico } from "@/app/_componentes/RefrescoAutomatico";
import { BotonEliminarCuenta, BotonEliminarPostulacion } from "./BotonesEliminar";

export const metadata = { title: "Mis postulaciones · CV Lectura" };

export default async function PaginaMisPostulaciones({ searchParams }: PageProps<"/mis-postulaciones">) {
  const { enviada } = await searchParams;
  const { db, usuarioId } = await requerirRol("postulante");
  // El postulante ve el estado, no el puntaje (el ranking es interno del reclutador)
  const { data: postulaciones } = await db
    .from("postulaciones")
    .select("id, estado, subido_en, ofertas(id, titulo)")
    .eq("postulante_id", usuarioId)
    .order("subido_en", { ascending: false });

  const enCurso = (postulaciones ?? []).some((p) => p.estado === "recibida" || p.estado === "procesando");

  return (
    <>
      <RefrescoAutomatico activo={enCurso} />
      <TituloPagina titulo="Mis postulaciones" />
      {enviada && (
        <p role="status" className="rounded-lg border border-exito/30 bg-exito/5 px-4 py-3 text-sm text-exito">
          Postulación enviada. Tu CV se está procesando.
        </p>
      )}
      {(postulaciones ?? []).length === 0 ? (
        <Tarjeta>
          Aún no postulaste a ninguna oferta.{" "}
          <Link href="/ofertas" className="font-semibold text-primario hover:underline">
            Ver ofertas
          </Link>
        </Tarjeta>
      ) : (
        <Tarjeta className="p-0">
          <ul className="divide-y divide-borde">
            {(postulaciones ?? []).map((p) => {
              const oferta = Array.isArray(p.ofertas) ? p.ofertas[0] : p.ofertas;
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <p className="font-semibold">{oferta?.titulo ?? "Oferta"}</p>
                    <p className="text-xs text-texto-2">Enviada el {formatoFecha(p.subido_en)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <EstadoPostulacion estado={p.estado} />
                    <BotonEliminarPostulacion postulacionId={p.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Tarjeta>
      )}

      <Tarjeta className="grid gap-3">
        <h2 className="text-base font-semibold">Tus datos personales</h2>
        <p className="text-sm text-texto-2">
          Puedes eliminar en cualquier momento una postulación (con su CV y los datos extraídos) o tu cuenta completa. La
          eliminación es inmediata y no se puede deshacer.
        </p>
        <BotonEliminarCuenta />
      </Tarjeta>
    </>
  );
}
