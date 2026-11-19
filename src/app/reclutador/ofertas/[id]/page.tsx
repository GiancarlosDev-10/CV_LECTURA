import { ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generarRanking } from "@/aplicacion/generarRanking";
import { RefrescoAutomatico } from "@/app/_componentes/RefrescoAutomatico";
import { AdvertenciaPuntaje, Boton, BotonEnlace, EstadoPostulacion, Puntaje, Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { BarraDesglose, ChipsHabilidades, EstadoVacio, InsigniaDecision, LeyendaDesglose } from "@/app/_componentes/visual";
import { requerirRol } from "@/app/_lib/sesion";
import { MOTIVOS_REVISION, NIVEL_EDUCATIVO, textoAnios } from "@/app/_lib/textos";
import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import type { EstadoPostulacion as Estado } from "@/dominio/entidades/postulacion";
import type { ResultadoPuntaje } from "@/dominio/puntaje/calcularPuntaje";
import { cambiarEstadoOferta } from "./acciones";

export default async function PaginaRanking({ params }: PageProps<"/reclutador/ofertas/[id]">) {
  const { id } = await params;
  const { db, usuarioId } = await requerirRol("reclutador");

  const { data: oferta } = await db
    .from("ofertas")
    .select("id, titulo, estado, creado_en")
    .eq("id", id)
    .eq("reclutador_id", usuarioId)
    .maybeSingle();
  if (!oferta) notFound();

  const { data } = await db
    .from("postulaciones")
    .select("id, estado, puntaje, desglose, subido_en, cv_extraido, motivo_revision, decision")
    .eq("oferta_id", id);

  const filas = (data ?? []).map((p) => ({
    id: p.id as string,
    estado: p.estado as Estado,
    puntaje: p.puntaje === null ? null : Number(p.puntaje),
    subidoEn: p.subido_en as string,
    cv: p.cv_extraido as CvExtraido | null,
    desglose: p.desglose as ResultadoPuntaje["desglose"] | null,
    motivo: p.motivo_revision as string | null,
    decision: p.decision as "preseleccionado" | "descartado" | null,
  }));
  const { clasificadas, enCurso, revisionManual } = generarRanking(filas);
  const preseleccionados = filas.filter((f) => f.decision === "preseleccionado").length;
  const nombre = (f: (typeof filas)[number]) => f.cv?.nombre ?? `Postulación ${f.id.slice(0, 8)}`;

  return (
    <>
      <RefrescoAutomatico activo={enCurso.length > 0} />
      <Link href="/reclutador" className="inline-flex items-center gap-1 text-sm text-primario hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> Mis ofertas
      </Link>
      <TituloPagina
        titulo={oferta.titulo}
        subtitulo={`${oferta.estado === "abierta" ? "Abierta" : "Cerrada"} · publicada el ${formatoFecha(oferta.creado_en)}`}
        acciones={
          <div className="flex flex-wrap gap-2">
            {/* Con postulaciones la oferta queda fija: sus puntajes dependen de estos requisitos */}
            {filas.length === 0 && (
              <BotonEnlace href={`/reclutador/ofertas/${oferta.id}/editar`} variante="secundario">
                Editar oferta
              </BotonEnlace>
            )}
            <form action={cambiarEstadoOferta.bind(null, oferta.id, oferta.estado === "abierta" ? "cerrada" : "abierta")}>
              <Boton variante="secundario">{oferta.estado === "abierta" ? "Cerrar oferta" : "Reabrir oferta"}</Boton>
            </form>
          </div>
        }
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Postulaciones", filas.length],
          ["En el ranking", clasificadas.length],
          ["Revisión manual", revisionManual.length],
          ["Preseleccionados", preseleccionados],
        ].map(([texto, valor]) => (
          <div key={texto} className="rounded-xl border border-borde bg-superficie px-4 py-3">
            <dt className="text-xs font-medium text-texto-2">{texto}</dt>
            <dd className="text-2xl font-bold tabular-nums">{valor}</dd>
          </div>
        ))}
      </dl>

      <AdvertenciaPuntaje />

      {filas.length === 0 ? (
        <EstadoVacio Icono={Inbox} titulo="Aún no hay postulaciones">
          Cuando un postulante envíe su CV, aparecerá aquí con su puntaje y el desglose por criterio.
        </EstadoVacio>
      ) : (
        <Tarjeta className="overflow-x-auto p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borde px-4 py-3">
            <h2 className="text-sm font-semibold">Ranking de postulantes</h2>
            <LeyendaDesglose />
          </div>
          <table className="w-full min-w-[760px] text-sm">
            <caption className="sr-only">Ranking de postulantes de la oferta {oferta.titulo}</caption>
            <thead>
              <tr className="border-b border-borde text-left text-xs uppercase tracking-wide text-texto-2">
                <th scope="col" className="px-4 py-3 font-semibold">#</th>
                <th scope="col" className="px-4 py-3 font-semibold">Postulante y habilidades obligatorias</th>
                <th scope="col" className="px-4 py-3 font-semibold">Puntaje y desglose</th>
                <th scope="col" className="px-4 py-3 font-semibold">Decisión</th>
                <th scope="col" className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {clasificadas.map((f) => (
                <tr key={f.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-3 text-base font-bold tabular-nums text-texto-2">{f.posicion}</td>
                  <td className="grid gap-1.5 px-4 py-3">
                    <Link href={`/reclutador/postulaciones/${f.id}`} className="font-semibold hover:text-primario">
                      {nombre(f)}
                    </Link>
                    <span className="text-xs text-texto-2">
                      {textoAnios(f.cv?.aniosExperiencia)} · {f.cv?.nivelEducativo ? NIVEL_EDUCATIVO[f.cv.nivelEducativo] : "educación no indicada"}
                    </span>
                    {f.desglose && <ChipsHabilidades cumplidas={f.desglose.obligatorias.cumplidas} faltantes={f.desglose.obligatorias.faltantes} />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="grid gap-2">
                      <Puntaje valor={f.puntaje!} />
                      {f.desglose && <BarraDesglose desglose={f.desglose} compacta />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <InsigniaDecision decision={f.decision} />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoPostulacion estado={f.estado} />
                  </td>
                </tr>
              ))}
              {[...revisionManual, ...enCurso].map((f) => (
                <tr key={f.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-3 text-texto-2">—</td>
                  <td className="grid gap-1 px-4 py-3">
                    <Link href={`/reclutador/postulaciones/${f.id}`} className="font-semibold hover:text-primario">
                      {nombre(f)}
                    </Link>
                    <span className="text-xs text-texto-2">
                      {f.estado === "pendiente_revision_manual" ? (MOTIVOS_REVISION[f.motivo ?? ""] ?? "Requiere revisión") : `Recibida el ${formatoFecha(f.subidoEn)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm italic text-texto-2">{f.estado === "pendiente_revision_manual" ? "Sin puntaje" : "Calculando…"}</td>
                  <td className="px-4 py-3">
                    <InsigniaDecision decision={f.decision} />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoPostulacion estado={f.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tarjeta>
      )}
      <p className="text-xs text-texto-2">
        Tono del puntaje: alto ≥ 80 · medio 50–79 · bajo &lt; 50. Los CVs en revisión manual no tienen puntaje y no forman parte del ranking.
      </p>
    </>
  );
}
