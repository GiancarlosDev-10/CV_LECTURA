import { CheckCircle2, FileStack, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RefrescoAutomatico } from "@/app/_componentes/RefrescoAutomatico";
import { Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { EstadoVacio } from "@/app/_componentes/visual";
import { requerirRol } from "@/app/_lib/sesion";
import type { EstadoPostulacion } from "@/dominio/entidades/postulacion";
import { BotonEliminarCuenta, BotonEliminarPostulacion } from "./BotonesEliminar";
import { LineaDeTiempo } from "./LineaDeTiempo";

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

  const lista = postulaciones ?? [];
  const enCurso = lista.some((p) => p.estado === "recibida" || p.estado === "procesando");

  return (
    <>
      <RefrescoAutomatico activo={enCurso} />
      <TituloPagina titulo="Mis postulaciones" subtitulo="El avance se actualiza solo mientras tu CV se procesa." />
      {enviada && (
        <p role="status" className="flex items-center gap-2 rounded-lg border border-exito/30 bg-exito/5 px-4 py-3 text-sm text-exito">
          <CheckCircle2 aria-hidden className="size-4" /> Postulación enviada. Estamos leyendo tu CV.
        </p>
      )}
      {lista.length === 0 ? (
        <EstadoVacio Icono={FileStack} titulo="Aún no postulaste a ninguna oferta">
          <Link href="/ofertas" className="font-semibold text-primario hover:underline">
            Explora las ofertas abiertas
          </Link>{" "}
          y postula con tu CV en PDF.
        </EstadoVacio>
      ) : (
        <Tarjeta className="p-0">
          <ul className="divide-y divide-borde">
            {lista.map((p) => {
              const oferta = Array.isArray(p.ofertas) ? p.ofertas[0] : p.ofertas;
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                  <div className="grid gap-2">
                    <div>
                      <Link href={`/ofertas/${oferta?.id}`} className="font-semibold hover:text-primario">
                        {oferta?.titulo ?? "Oferta"}
                      </Link>
                      <p className="text-xs text-texto-2">Enviada el {formatoFecha(p.subido_en)}</p>
                    </div>
                    <LineaDeTiempo estado={p.estado as EstadoPostulacion} />
                  </div>
                  <BotonEliminarPostulacion postulacionId={p.id} />
                </li>
              );
            })}
          </ul>
        </Tarjeta>
      )}

      <Tarjeta className="grid gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <ShieldCheck aria-hidden className="size-5 text-primario" /> Tus datos personales
        </h2>
        <p className="text-sm text-texto-2">
          Puedes eliminar en cualquier momento una postulación (con su CV y los datos extraídos) o tu cuenta completa. La eliminación es
          inmediata y no se puede deshacer (derecho de cancelación, Ley N.° 29733).
        </p>
        <BotonEliminarCuenta />
      </Tarjeta>
    </>
  );
}
