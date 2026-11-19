"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Boton } from "@/app/_componentes/ui";
import { accionEliminarCuenta, accionEliminarPostulacion } from "./acciones";

export function BotonEliminarPostulacion({ postulacionId }: { postulacionId: string }) {
  const [pendiente, iniciar] = useTransition();
  return (
    <Boton
      variante="peligro"
      disabled={pendiente}
      className="px-2.5 py-1.5 text-xs"
      onClick={() => {
        if (confirm("¿Eliminar esta postulación, tu CV y los datos extraídos? No se puede deshacer.")) {
          iniciar(async () => void (await accionEliminarPostulacion(postulacionId)));
        }
      }}
    >
      <Trash2 aria-hidden className="size-3.5" />
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
      <Trash2 aria-hidden className="size-4" />
      {pendiente ? "Eliminando…" : "Eliminar mi cuenta y todos mis datos"}
    </Boton>
  );
}
