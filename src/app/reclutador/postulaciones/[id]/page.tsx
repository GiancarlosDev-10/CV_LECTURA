import Link from "next/link";
import { notFound } from "next/navigation";
import { AdvertenciaPuntaje, EstadoPostulacion, Puntaje, Tarjeta, TituloPagina, formatoFecha } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import type { CvExtraido } from "@/dominio/entidades/cvExtraido";
import type { EstadoPostulacion as Estado } from "@/dominio/entidades/postulacion";
import type { ResultadoPuntaje } from "@/dominio/puntaje/calcularPuntaje";

const CRITERIOS: { clave: keyof ResultadoPuntaje["desglose"]; texto: string }[] = [
  { clave: "obligatorias", texto: "Habilidades obligatorias" },
  { clave: "deseables", texto: "Habilidades deseables" },
  { clave: "experiencia", texto: "Experiencia" },
  { clave: "educacion", texto: "Educación" },
  { clave: "idiomas", texto: "Idiomas" },
];

export default async function PaginaPostulacion({ params }: PageProps<"/reclutador/postulaciones/[id]">) {
  const { id } = await params;
  const { db, usuarioId } = await requerirRol("reclutador");

  // La RLS solo devuelve la postulación si la oferta es de este reclutador
  const { data: p } = await db
    .from("postulaciones")
    .select("id, estado, puntaje, desglose, cv_extraido, motivo_revision, modelo_ia, subido_en, inicio_procesamiento, fin_procesamiento, ofertas(id, titulo)")
    .eq("id", id)
    .maybeSingle();
  if (!p) notFound();

  // Registro de acceso a datos personales (RQ-SEG-05)
  await db.from("accesos_cv").insert({ postulacion_id: p.id, reclutador_id: usuarioId, accion: "ver_detalle" });

  const oferta = Array.isArray(p.ofertas) ? p.ofertas[0] : p.ofertas;
  const cv = p.cv_extraido as CvExtraido | null;
  const desglose = p.desglose as ResultadoPuntaje["desglose"] | null;
  const segundos =
    p.inicio_procesamiento && p.fin_procesamiento
      ? (new Date(p.fin_procesamiento).getTime() - new Date(p.subido_en).getTime()) / 1000
      : null;

  return (
    <>
      <p className="text-sm">
        <Link href={`/reclutador/ofertas/${oferta?.id}`} className="text-primario hover:underline">
          ← {oferta?.titulo}
        </Link>
      </p>
      <TituloPagina
        titulo={cv?.nombre ?? `Postulación ${p.id.slice(0, 8)}`}
        subtitulo={`Recibida el ${formatoFecha(p.subido_en)}${segundos !== null ? ` · procesada en ${segundos.toFixed(1)} s` : ""}${p.modelo_ia ? ` · modelo: ${p.modelo_ia}` : ""}`}
        acciones={
          <a href={`/reclutador/postulaciones/${p.id}/cv`} target="_blank" rel="noopener" className="inline-flex items-center rounded-lg border border-primario px-4 py-2.5 text-sm font-semibold text-primario hover:bg-primario-suave">
            Ver CV original (PDF)
          </a>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <EstadoPostulacion estado={p.estado as Estado} />
        {p.puntaje !== null && <Puntaje valor={Number(p.puntaje)} />}
      </div>

      {p.estado === "pendiente_revision_manual" && (
        <Tarjeta className="border-aviso/40 bg-aviso/5 text-sm">
          <strong className="text-aviso">Revisión manual necesaria.</strong> El sistema no pudo procesar este CV (motivo: {p.motivo_revision}). Abre el PDF original y evalúalo directamente: no tiene puntaje para no perjudicar al postulante.
        </Tarjeta>
      )}

      {desglose && (
        <>
          <AdvertenciaPuntaje />
          <Tarjeta className="p-0">
            <table className="w-full text-sm">
              <caption className="px-6 pt-5 text-left text-base font-semibold">Desglose del puntaje</caption>
              <thead>
                <tr className="border-b border-borde text-left text-xs uppercase tracking-wide text-texto-2">
                  <th scope="col" className="px-6 py-3 font-semibold">Criterio</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Puntos / peso</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {CRITERIOS.map(({ clave, texto }) => {
                  const c = desglose[clave];
                  const listas = "cumplidas" in c ? c : null;
                  return (
                    <tr key={clave}>
                      <th scope="row" className="px-6 py-3 text-left font-medium">{texto}</th>
                      <td className="px-6 py-3 tabular-nums">
                        {c.puntos.toFixed(2).replace(".", ",")} / {c.peso}
                      </td>
                      <td className="px-6 py-3 text-texto-2">
                        {listas && listas.cumplidas.length > 0 && <span className="text-exito">✓ {listas.cumplidas.join(", ")}</span>}
                        {listas && listas.faltantes.length > 0 && <span className="ml-2">✗ falta: {listas.faltantes.join(", ")}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Tarjeta>
        </>
      )}

      {cv && (
        <Tarjeta className="grid gap-3 text-sm">
          <h2 className="text-base font-semibold">Datos extraídos del CV</h2>
          <dl className="grid gap-2 sm:grid-cols-[180px_1fr]">
            <dt className="font-medium text-texto-2">Correo</dt>
            <dd>{cv.email ?? "—"}</dd>
            <dt className="font-medium text-texto-2">Teléfono</dt>
            <dd>{cv.telefono ?? "—"}</dd>
            <dt className="font-medium text-texto-2">Experiencia</dt>
            <dd>{cv.aniosExperiencia ?? "—"} años</dd>
            <dt className="font-medium text-texto-2">Nivel educativo</dt>
            <dd>{cv.nivelEducativo ?? "—"}</dd>
            <dt className="font-medium text-texto-2">Habilidades</dt>
            <dd>{cv.habilidades.join(", ") || "—"}</dd>
            <dt className="font-medium text-texto-2">Idiomas</dt>
            <dd>{cv.idiomas.map((i) => `${i.idioma} ${i.nivel}`).join(", ") || "—"}</dd>
          </dl>
          <p className="text-xs text-texto-2">Verifica estos datos contra el PDF original: la extracción automática puede contener errores.</p>
        </Tarjeta>
      )}
    </>
  );
}
