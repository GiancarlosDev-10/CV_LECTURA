"use client";

import { useActionState } from "react";
import { ingresar } from "@/app/_acciones/autenticacion";
import { Boton, Campo, MensajeError } from "@/app/_componentes/ui";

export function FormularioIngreso() {
  const [estado, accion, pendiente] = useActionState(ingresar, {});
  return (
    <form action={accion} className="grid gap-4">
      <Campo id="email" name="email" type="email" etiqueta="Correo" autoComplete="email" required defaultValue={estado.campos?.email} />
      <Campo id="clave" name="clave" type="password" etiqueta="Contraseña" autoComplete="current-password" required />
      <MensajeError>{estado.error}</MensajeError>
      <Boton type="submit" disabled={pendiente}>
        {pendiente ? "Ingresando…" : "Ingresar"}
      </Boton>
    </form>
  );
}
