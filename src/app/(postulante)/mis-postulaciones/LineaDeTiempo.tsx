import { CheckCircle2, CircleDashed, Eye, Loader2, Send } from "lucide-react";
import type { EstadoPostulacion } from "@/dominio/entidades/postulacion";

/**
 * Lo que el postulante ve de su postulación. No ve el puntaje: el ranking es
 * interno del reclutador. Un CV en revisión manual se comunica sin alarmar.
 */
export function LineaDeTiempo({ estado }: { estado: EstadoPostulacion }) {
  const indice = { recibida: 1, procesando: 1, procesada: 2, pendiente_revision_manual: 2 }[estado];
  const final =
    estado === "pendiente_revision_manual"
      ? { texto: "Un reclutador revisará tu CV directamente", Icono: Eye }
      : { texto: "En evaluación por el reclutador", Icono: CheckCircle2 };

  const pasos = [
    { texto: "Enviada", Icono: Send },
    { texto: estado === "procesando" || estado === "recibida" ? "Leyendo tu CV…" : "CV leído", Icono: estado === "procesando" || estado === "recibida" ? Loader2 : CheckCircle2 },
    final,
  ];

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" aria-label="Avance de la postulación">
      {pasos.map(({ texto, Icono }, i) => {
        const hecho = i < indice || (i === indice && i === 2);
        const actual = i === indice && i !== 2;
        return (
          <li key={texto} className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 font-medium ${hecho ? "text-exito" : actual ? "text-acento" : "text-texto-2"}`}>
              {hecho || actual ? (
                <Icono aria-hidden className={`size-3.5 ${actual && Icono === Loader2 ? "animate-spin" : ""}`} />
              ) : (
                <CircleDashed aria-hidden className="size-3.5" />
              )}
              {texto}
            </span>
            {i < pasos.length - 1 && <span aria-hidden className={`h-px w-6 ${i < indice ? "bg-exito" : "bg-slate-300"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
