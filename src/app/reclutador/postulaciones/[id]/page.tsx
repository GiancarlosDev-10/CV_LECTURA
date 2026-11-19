import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdvertenciaPuntaje, EstadoPostulacion, Puntaje, Tarjeta, formatoFecha } from "@/app/_componentes/ui";
import { BarraDesglose, CRITERIOS_DESGLOSE, ChipHabilidad, InsigniaDecision } from "@/app/_componentes/visual";
import { requerirRol } from "@/app/_lib/sesion";
import { MOTIVOS_REVISION, NIVEL_EDUCATIVO, textoAnios } from "@/app/_lib/textos";
import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import type { EstadoPostulacion as Estado } from "@/dominio/entidades/postulacion";
import type { ResultadoPuntaje } from "@/dominio/puntaje/calcularPuntaje";
import { FormularioDecision } from "./FormularioDecision";

export default async function PaginaPostulacion({ params }: PageProps<"/reclutador/postulaciones/[id]">) {
  const { id } = await params;
  const { db, usuarioId } = await requerirRol("reclutador");

  // La RLS solo devuelve la postulación si la oferta es de este reclutador
  const { data: p } = await db
    .from("postulaciones")
    .select("id, estado, puntaje, desglose, cv_extraido, motivo_revision, modelo_ia, subido_en, fin_procesamiento, decision, decision_nota, decision_en, ofertas(id, titulo)")
    .eq("id", id)
    .maybeSingle();
  if (!p) notFound();

  // Registro de acceso a datos personales (RQ-SEG-05)
  await db.from("accesos_cv").insert({ postulacion_id: p.id, reclutador_id: usuarioId, accion: "ver_detalle" });

  const oferta = Array.isArray(p.ofertas) ? p.ofertas[0] : p.ofertas;
  const cv = p.cv_extraido as CvExtraido | null;
  const desglose = p.desglose as ResultadoPuntaje["desglose"] | null;
  const segundos = p.fin_procesamiento ? (new Date(p.fin_procesamiento).getTime() - new Date(p.subido_en).getTime()) / 1000 : null;
  const urlPdf = `/reclutador/postulaciones/${p.id}/cv`;

  return (
    <>
      <Link href={`/reclutador/ofertas/${oferta?.id}`} className="inline-flex items-center gap-1 text-sm text-primario hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> {oferta?.titulo}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{cv?.nombre ?? `Postulación ${p.id.slice(0, 8)}`}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-texto-2">
            <EstadoPostulacion estado={p.estado as Estado} />
            <InsigniaDecision decision={p.decision} />
            <span>Recibida el {formatoFecha(p.subido_en)}</span>
            {segundos !== null && <span>· procesada en {segundos.toFixed(1)} s</span>}
            {p.modelo_ia && <span>· modelo: {p.modelo_ia}</span>}
          </div>
        </div>
        {p.puntaje !== null && (
          <div className="text-right">
            <p className="text-xs font-medium text-texto-2">Puntaje</p>
            <Puntaje valor={Number(p.puntaje)} />
          </div>
        )}
      </div>

      {/* Vista dividida: el PDF original junto a lo que extrajo el sistema, para verificar de un vistazo */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Tarjeta className="grid gap-3 p-3 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">CV original</h2>
            <a href={urlPdf} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-primario hover:underline">
              Abrir en otra pestaña <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </div>
          <iframe src={urlPdf} title={`CV original de ${cv?.nombre ?? "el postulante"}`} className="h-[75vh] w-full rounded-lg border border-borde bg-slate-50" />
        </Tarjeta>

        <div className="grid content-start gap-6">
          {p.estado === "pendiente_revision_manual" && (
            <Tarjeta className="flex gap-3 border-aviso/40 bg-aviso/5 text-sm">
              <AlertTriangle aria-hidden className="size-5 shrink-0 text-aviso" />
              <p>
                <strong className="block text-aviso">Revisión manual necesaria</strong>
                {MOTIVOS_REVISION[p.motivo_revision ?? ""] ?? "El sistema no pudo procesar este CV"}. Evalúa el PDF directamente: no tiene puntaje para no perjudicar al postulante.
              </p>
            </Tarjeta>
          )}

          <Tarjeta className="grid gap-4">
            <h2 className="text-base font-semibold">Tu decisión</h2>
            <FormularioDecision postulacionId={p.id} decisionActual={p.decision} notaActual={p.decision_nota ?? ""} />
            {p.decision_en && <p className="text-xs text-texto-2">Última decisión: {formatoFecha(p.decision_en)}</p>}
          </Tarjeta>

          {desglose && (
            <Tarjeta className="grid gap-4">
              <h2 className="text-base font-semibold">Desglose del puntaje</h2>
              <BarraDesglose desglose={desglose} />
              <ul className="grid gap-3 text-sm">
                {CRITERIOS_DESGLOSE.map(({ clave, texto, color }) => {
                  const c = desglose[clave];
                  const listas = "cumplidas" in c ? c : null;
                  return (
                    <li key={clave} className="grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <span aria-hidden className="size-2.5 rounded-sm" style={{ backgroundColor: color }} />
                          {texto}
                        </span>
                        <span className="tabular-nums text-texto-2">
                          {c.puntos.toFixed(2).replace(".", ",")} / {c.peso}
                        </span>
                      </div>
                      {listas && (listas.cumplidas.length > 0 || listas.faltantes.length > 0) && (
                        <div className="flex flex-wrap gap-1">
                          {listas.cumplidas.map((h) => <ChipHabilidad key={h} nombre={h} cumple />)}
                          {listas.faltantes.map((h) => <ChipHabilidad key={h} nombre={h} cumple={false} />)}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <AdvertenciaPuntaje />
            </Tarjeta>
          )}

          {cv && (
            <Tarjeta className="grid gap-3 text-sm">
              <h2 className="text-base font-semibold">Datos extraídos del CV</h2>
              <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[140px_1fr]">
                <dt className="font-medium text-texto-2">Correo</dt>
                <dd className="break-all">{cv.email ?? "—"}</dd>
                <dt className="font-medium text-texto-2">Teléfono</dt>
                <dd>{cv.telefono ?? "—"}</dd>
                <dt className="font-medium text-texto-2">Experiencia</dt>
                <dd>{textoAnios(cv.aniosExperiencia)}</dd>
                <dt className="font-medium text-texto-2">Nivel educativo</dt>
                <dd>{cv.nivelEducativo ? NIVEL_EDUCATIVO[cv.nivelEducativo] : "—"}</dd>
                <dt className="font-medium text-texto-2">Habilidades</dt>
                <dd className="flex flex-wrap gap-1">
                  {cv.habilidades.length ? cv.habilidades.map((h) => <span key={h} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs">{h}</span>) : "—"}
                </dd>
                <dt className="font-medium text-texto-2">Idiomas</dt>
                <dd>{cv.idiomas.map((i) => `${i.idioma} ${i.nivel}`).join(", ") || "—"}</dd>
              </dl>
              <p className="flex items-center gap-1.5 text-xs text-texto-2">
                <AlertTriangle aria-hidden className="size-3.5" /> Verifica estos datos contra el PDF: la extracción automática puede contener errores.
              </p>
            </Tarjeta>
          )}
        </div>
      </div>
    </>
  );
}
