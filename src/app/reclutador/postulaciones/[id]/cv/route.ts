import { NextResponse } from "next/server";
import { obtenerSesion } from "@/app/_lib/sesion";
import { BUCKET_CVS } from "@/infraestructura/supabase/AlmacenArchivosSupabase";

/**
 * Entrega el PDF original mediante una URL firmada de 60 s y registra el acceso (RQ-SEG-05).
 * La RLS decide: solo el reclutador dueño de la oferta obtiene la ruta y puede firmarla.
 */
export async function GET(_request: Request, { params }: RouteContext<"/reclutador/postulaciones/[id]/cv">) {
  const { id } = await params;
  const sesion = await obtenerSesion();
  if (!sesion || sesion.rol !== "reclutador") {
    return new NextResponse("No autorizado", { status: 403 });
  }

  const { data: postulacion } = await sesion.db.from("postulaciones").select("id, ruta_cv").eq("id", id).maybeSingle();
  if (!postulacion) return new NextResponse("No encontrado", { status: 404 });

  const { data: firmada, error } = await sesion.db.storage.from(BUCKET_CVS).createSignedUrl(postulacion.ruta_cv, 60);
  if (error || !firmada) return new NextResponse("No encontrado", { status: 404 });

  await sesion.db.from("accesos_cv").insert({ postulacion_id: postulacion.id, reclutador_id: sesion.usuarioId, accion: "descargar_pdf" });
  return NextResponse.redirect(firmada.signedUrl);
}
