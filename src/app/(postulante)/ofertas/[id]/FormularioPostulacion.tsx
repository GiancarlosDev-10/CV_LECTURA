"use client";

import { CheckCircle2, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Boton, MensajeError } from "@/app/_componentes/ui";
import { clienteNavegador } from "@/infraestructura/supabase/clienteNavegador";
import { postular } from "./acciones";

const TAMANO_MAXIMO = 5 * 1024 * 1024;
type Paso = "inactivo" | "subiendo" | "verificando" | "listo";

const formatoTamano = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

/** Validación de usabilidad: las reales están en Storage (RLS, tipo, tamaño) y en el servidor (firma %PDF-). */
function validar(archivo: File): string | undefined {
  if (archivo.type !== "application/pdf" && !archivo.name.toLowerCase().endsWith(".pdf")) return "El archivo debe ser un PDF.";
  if (archivo.size > TAMANO_MAXIMO) return `El PDF pesa ${formatoTamano(archivo.size)}; el máximo es 5 MB.`;
  if (archivo.size === 0) return "El archivo está vacío.";
}

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
  const entrada = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState<string>();
  const [paso, setPaso] = useState<Paso>("inactivo");
  const enviando = paso !== "inactivo";

  function elegir(nuevo: File | undefined) {
    setError(undefined);
    if (!nuevo) return;
    const problema = validar(nuevo);
    if (problema) {
      setArchivo(null);
      return setError(problema);
    }
    setArchivo(nuevo);
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setError(undefined);
    if (!archivo) return setError("Selecciona o arrastra tu CV en PDF.");
    if (!acepta) return setError("Debes aceptar el tratamiento de tus datos para postular.");

    setPaso("subiendo");
    const postulacionId = crypto.randomUUID();
    const { error: errorSubida } = await clienteNavegador()
      .storage.from("cvs")
      .upload(`${postulanteId}/${postulacionId}.pdf`, archivo, { contentType: "application/pdf", upsert: false });
    if (errorSubida) {
      setPaso("inactivo");
      return setError("No se pudo subir el archivo. Verifica que sea un PDF de máximo 5 MB e inténtalo de nuevo.");
    }

    setPaso("verificando");
    const resultado = await postular({ ofertaId, postulacionId, aceptaConsentimiento: acepta, versionConsentimiento: consentimiento.version });
    if (!resultado.ok) {
      setPaso("inactivo");
      return setError(resultado.mensaje);
    }
    setPaso("listo");
    router.push("/mis-postulaciones?enviada=1");
  }

  return (
    <form onSubmit={enviar} className="grid gap-5">
      <div className="grid gap-2">
        <span id="etiqueta-cv" className="text-sm font-semibold">
          Tu CV en PDF
        </span>
        <div
          role="button"
          tabIndex={0}
          aria-labelledby="etiqueta-cv"
          aria-describedby="ayuda-cv"
          onClick={() => !enviando && entrada.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !enviando && (e.preventDefault(), entrada.current?.click())}
          onDragOver={(e) => (e.preventDefault(), setArrastrando(true))}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => (e.preventDefault(), setArrastrando(false), !enviando && elegir(e.dataTransfer.files[0]))}
          className={`grid cursor-pointer justify-items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            arrastrando ? "border-primario bg-primario-suave" : "border-slate-300 bg-fondo hover:border-primario/60"
          }`}
        >
          {archivo ? (
            <div className="flex items-center gap-3 text-left">
              <FileText aria-hidden className="size-9 text-primario" strokeWidth={1.5} />
              <div>
                <p className="font-semibold">{archivo.name}</p>
                <p className="text-xs text-texto-2">{formatoTamano(archivo.size)} · PDF</p>
              </div>
              {!enviando && (
                <button
                  type="button"
                  aria-label="Quitar archivo"
                  onClick={(e) => (e.stopPropagation(), setArchivo(null))}
                  className="ml-2 rounded-md p-1 text-texto-2 hover:bg-slate-200"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <UploadCloud aria-hidden className="size-9 text-slate-400" strokeWidth={1.5} />
              <p className="text-sm">
                <span className="font-semibold text-primario">Haz clic para elegir</span> o arrastra tu CV aquí
              </p>
            </>
          )}
          <p id="ayuda-cv" className="text-xs text-texto-2">
            PDF de máximo 5 MB, con texto seleccionable (no una foto escaneada).
          </p>
        </div>
        <input ref={entrada} type="file" accept="application/pdf,.pdf" className="sr-only" tabIndex={-1} onChange={(e) => elegir(e.target.files?.[0])} />
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

      {enviando && (
        <ol aria-live="polite" className="grid gap-1.5 text-sm">
          {(
            [
              ["subiendo", "Subiendo tu CV de forma segura"],
              ["verificando", "Verificando el archivo y registrando tu postulación"],
            ] as const
          ).map(([clave, texto], i) => {
            const hecho = (paso === "verificando" && i === 0) || paso === "listo";
            const actual = paso === clave;
            return (
              <li key={clave} className={`flex items-center gap-2 ${hecho || actual ? "text-texto" : "text-texto-2"}`}>
                {hecho ? <CheckCircle2 aria-hidden className="size-4 text-exito" /> : actual ? <Loader2 aria-hidden className="size-4 animate-spin text-primario" /> : <span className="size-4" />}
                {texto}
              </li>
            );
          })}
        </ol>
      )}

      <Boton type="submit" disabled={enviando} className="justify-self-start">
        {enviando ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <UploadCloud aria-hidden className="size-4" />}
        {enviando ? "Enviando…" : "Enviar postulación"}
      </Boton>
    </form>
  );
}
