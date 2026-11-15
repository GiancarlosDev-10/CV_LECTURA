"use client";

import { useTransition } from "react";
import { Boton } from "@/app/_componentes/ui";
import { accionEliminarCuenta, accionEliminarPostulacion } from "./acciones";

export function BotonEliminarPostulacion({ postulacionId }: { postulacionId: string }) {
  const [pendiente, iniciar] = useTransition();
  return (
    <Boton
      variante="fantasma"
      disabled={pendiente}
      className="px-2 py-1 text-xs text-error"
      onClick={() => {
        if (confirm("¿Eliminar esta postulación, tu CV y los datos extraídos? No se puede deshacer.")) {
          iniciar(async () => void (await accionEliminarPostulacion(postulacionId)));
        }
      }}
    >
      {pendiente ? "Eliminando…" : "Eliminar mis datos"}
    </Boton>
  );
}

export function BotonEliminarCuenta() {
  const [pendiente, iniciar] = useTransition();
  return (
    <Boton
      variante="peligro"
      disabled={pendiente}
      className="justify-self-start"
      onClick={() => {
        if (confirm("¿Eliminar tu cuenta, todas tus postulaciones y CVs? No se puede deshacer.")) {
          iniciar(() => accionEliminarCuenta());
        }
      }}
    >
      {pendiente ? "Eliminando…" : "Eliminar mi cuenta y todos mis datos"}
    </Boton>
  );
}
