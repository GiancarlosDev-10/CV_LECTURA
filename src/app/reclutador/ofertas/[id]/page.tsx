import Link from "next/link";
import { notFound } from "next/navigation";
import { generarRanking } from "@/aplicacion/generarRanking";
import { RefrescoAutomatico } from "@/app/_componentes/RefrescoAutomatico";
import { AdvertenciaPuntaje, Boton, EstadoPostulacion, Puntaje, Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import type { EstadoPostulacion as Estado } from "@/dominio/entidades/postulacion";
import { cambiarEstadoOferta } from "./acciones";

const MOTIVOS: Record<string, string> = {
  PDF_ILEGIBLE: "El archivo PDF no se pudo leer",
  PDF_SIN_TEXTO: "El PDF no tiene texto seleccionable (¿escaneado?)",
  IA_TIEMPO_AGOTADO: "La IA no respondió a tiempo",
  IA_ERROR: "El servicio de IA devolvió un error",
  RESPUESTA_IA_INVALIDA: "La IA devolvió datos con formato inválido",
  ERROR_INESPERADO: "Error inesperado al procesar",
};

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
    .select("id, estado, puntaje, subido_en, cv_extraido, motivo_revision")
    .eq("oferta_id", id);

  const filas = (data ?? []).map((p) => ({
    id: p.id as string,
    estado: p.estado as Estado,
    puntaje: p.puntaje === null ? null : Number(p.puntaje),
    subidoEn: p.subido_en as string,
    cv: p.cv_extraido as CvExtraido | null,
    motivo: p.motivo_revision as string | null,
  }));
  const { clasificadas, enCurso, revisionManual } = generarRanking(filas);
  const nombre = (f: (typeof filas)[number]) => f.cv?.nombre ?? `Postulación ${f.id.slice(0, 8)}`;

  return (
    <>
      <RefrescoAutomatico activo={enCurso.length > 0} />
      <TituloPagina
        titulo={oferta.titulo}
        subtitulo={`${oferta.estado === "abierta" ? "Abierta" : "Cerrada"} · publicada el ${formatoFecha(oferta.creado_en)} · ${filas.length} postulaciones`}
        acciones={
          <form action={cambiarEstadoOferta.bind(null, oferta.id, oferta.estado === "abierta" ? "cerrada" : "abierta")}>
            <Boton variante="secundario">{oferta.estado === "abierta" ? "Cerrar oferta" : "Reabrir oferta"}</Boton>
          </form>
        }
      />

      <AdvertenciaPuntaje />

      <Tarjeta className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <caption className="sr-only">Ranking de postulantes de la oferta {oferta.titulo}</caption>
          <thead>
            <tr className="border-b border-borde text-left text-xs uppercase tracking-wide text-texto-2">
              <th scope="col" className="px-4 py-3 font-semibold">#</th>
              <th scope="col" className="px-4 py-3 font-semibold">Postulante</th>
              <th scope="col" className="px-4 py-3 font-semibold">Puntaje</th>
              <th scope="col" className="px-4 py-3 font-semibold">Ajuste</th>
              <th scope="col" className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {clasificadas.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3 tabular-nums text-texto-2">{f.posicion}</td>
                <td className="px-4 py-3">
                  <Link href={`/reclutador/postulaciones/${f.id}`} className="font-semibold hover:text-primario">
                    {nombre(f)}
                  </Link>
                  <p className="text-xs text-texto-2">
                    {f.cv?.aniosExperiencia ?? "—"} años · {f.cv?.nivelEducativo ?? "educación no indicada"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <Puntaje valor={f.puntaje!} />
                </td>
                <td className="px-4 py-3">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                    <div className="h-full bg-primario" style={{ width: `${f.puntaje}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <EstadoPostulacion estado={f.estado} />
                </td>
              </tr>
            ))}
            {[...revisionManual, ...enCurso].map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3 text-texto-2">—</td>
                <td className="px-4 py-3">
                  <Link href={`/reclutador/postulaciones/${f.id}`} className="font-semibold hover:text-primario">
                    {nombre(f)}
                  </Link>
                  <p className="text-xs text-texto-2">
                    {f.estado === "pendiente_revision_manual" ? (MOTIVOS[f.motivo ?? ""] ?? "Requiere revisión") : `Recibida el ${formatoFecha(f.subidoEn)}`}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm italic text-texto-2">{f.estado === "pendiente_revision_manual" ? "Sin puntaje" : "Calculando…"}</td>
                <td />
                <td className="px-4 py-3">
                  <EstadoPostulacion estado={f.estado} />
                </td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-texto-2">
                  Aún no hay postulaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Tarjeta>
      <p className="text-xs text-texto-2">
        Tono del puntaje: alto ≥ 80 · medio 50–79 · bajo &lt; 50. Los CVs en revisión manual no tienen puntaje y no forman parte del ranking.
      </p>
    </>
  );
}
