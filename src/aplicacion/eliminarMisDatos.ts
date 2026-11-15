import type { DatosDelPostulante } from "@/dominio/puertos";

/**
 * Derecho de cancelación (Ley 29733, RQ-SEG-04). Primero se borra el PDF y luego la fila:
 * si el borrado del archivo falla, la fila sigue existiendo y el intento se puede repetir.
 */
export async function eliminarPostulacion(
  postulacionId: string,
  datos: DatosDelPostulante,
): Promise<{ ok: true } | { ok: false; error: "NO_ENCONTRADA" }> {
  const ruta = await datos.rutaDelCv(postulacionId);
  if (!ruta) return { ok: false, error: "NO_ENCONTRADA" };

  await datos.eliminarArchivos([ruta]);
  await datos.eliminarPostulacion(postulacionId);
  return { ok: true };
}

/** Borra todos los CV y la cuenta; perfil y postulaciones se eliminan en cascada. */
export async function eliminarMiCuenta(datos: DatosDelPostulante): Promise<void> {
  await datos.eliminarArchivos(await datos.rutasDeTodosMisCv());
  await datos.eliminarCuenta();
}
