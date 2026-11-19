"use client";

import { CircleSlash, RotateCcw, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { Boton, MensajeError } from "@/app/_componentes/ui";
import { registrarDecision } from "./acciones";

type Decision = "preseleccionado" | "descartado" | null;

export function FormularioDecision({
  postulacionId,
  decisionActual,
  notaActual,
}: {
  postulacionId: string;
  decisionActual: Decision;
  notaActual: string;
}) {
  const [nota, setNota] = useState(notaActual);
  const [error, setError] = useState<string>();
  const [pendiente, iniciar] = useTransition();

  const decidir = (decision: Decision) =>
    iniciar(async () => {
      setError(undefined);
      const r = await registrarDecision({ postulacionId, decision, nota });
      if (!r.ok) setError(r.mensaje);
    });

  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <label htmlFor="nota" className="text-sm font-semibold">
          Nota del reclutador (opcional)
        </label>
        <textarea
          id="nota"
          rows={2}
          maxLength={1000}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ej.: verificar experiencia en SQL en la entrevista"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Boton type="button" disabled={pendiente} onClick={() => decidir("preseleccionado")} variante={decisionActual === "preseleccionado" ? "primario" : "secundario"}>
          <Star aria-hidden className="size-4" /> Preseleccionar
        </Boton>
        <Boton type="button" disabled={pendiente} onClick={() => decidir("descartado")} variante={decisionActual === "descartado" ? "primario" : "secundario"}>
          <CircleSlash aria-hidden className="size-4" /> Descartar
        </Boton>
        {decisionActual && (
          <Boton type="button" disabled={pendiente} onClick={() => decidir(null)} variante="fantasma">
            <RotateCcw aria-hidden className="size-4" /> Quitar decisión
          </Boton>
        )}
      </div>
      <MensajeError>{error}</MensajeError>
      <p className="text-xs text-texto-2">La decisión queda registrada con tu usuario y la fecha. El sistema nunca decide por ti.</p>
    </div>
  );
}
