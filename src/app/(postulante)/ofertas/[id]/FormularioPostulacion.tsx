"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton, MensajeError } from "@/app/_componentes/ui";
import { clienteNavegador } from "@/infraestructura/supabase/clienteNavegador";
import { postular } from "./acciones";

const TAMANO_MAXIMO = 5 * 1024 * 1024;

export function FormularioPostulacion({
  ofertaId,
  postulanteId,
  consentimiento,
}: {
  ofertaId: string;
  postulanteId: string;
  consentimiento: { version: string; puntos: string[] };
}) {
  const router = useRouter();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setError(undefined);
    // Validaciones de usabilidad; las reales están en Storage (RLS, tipo, tamaño) y en el servidor (firma %PDF-)
    if (!archivo) return setError("Selecciona tu CV en PDF.");
    if (archivo.type !== "application/pdf") return setError("El archivo debe ser un PDF.");
    if (archivo.size > TAMANO_MAXIMO) return setError("El PDF no puede superar 5 MB.");
    if (!acepta) return setError("Debes aceptar el tratamiento de tus datos para postular.");

    setEnviando(true);
    const postulacionId = crypto.randomUUID();
    const ruta = `${postulanteId}/${postulacionId}.pdf`;
    const { error: errorSubida } = await clienteNavegador()
      .storage.from("cvs")
      .upload(ruta, archivo, { contentType: "application/pdf", upsert: false });
    if (errorSubida) {
      setEnviando(false);
      return setError("No se pudo subir el archivo. Verifica que sea un PDF de máximo 5 MB.");
    }

    const resultado = await postular({ ofertaId, postulacionId, aceptaConsentimiento: acepta, versionConsentimiento: consentimiento.version });
    if (!resultado.ok) {
      setEnviando(false);
      return setError(resultado.mensaje);
    }
    router.push("/mis-postulaciones?enviada=1");
  }

  return (
    <form onSubmit={enviar} className="grid gap-5">
      <div className="grid gap-1.5">
        <label htmlFor="cv" className="text-sm font-semibold">
          CV en PDF
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          className="text-sm file:mr-3 file:rounded-lg file:border file:border-primario file:bg-superficie file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primario"
        />
        <p className="text-xs text-texto-2">Máximo 5 MB. El PDF debe tener texto seleccionable (no una foto escaneada).</p>
      </div>

      <fieldset className="grid gap-3 rounded-xl border border-borde bg-fondo p-4">
        <legend className="px-1 text-sm font-semibold">Consentimiento para el tratamiento de datos personales (Ley N.° 29733)</legend>
        <ul className="grid list-disc gap-1.5 pl-5 text-sm text-texto-2">
          {consentimiento.puntos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <label className="flex items-start gap-2 text-sm font-medium">
          <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 size-4 accent-primario" />
          He leído y acepto el tratamiento de mis datos personales para esta postulación.
        </label>
        <p className="text-xs text-texto-2">Versión del texto: {consentimiento.version}</p>
      </fieldset>

      <MensajeError>{error}</MensajeError>
      <Boton type="submit" disabled={enviando} className="justify-self-start">
        {enviando ? "Enviando…" : "Enviar postulación"}
      </Boton>
    </form>
  );
}
