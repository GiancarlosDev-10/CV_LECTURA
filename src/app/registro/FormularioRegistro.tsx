"use client";

import { useActionState } from "react";
import { registrar } from "@/app/_acciones/autenticacion";
import { Boton, Campo, MensajeError } from "@/app/_componentes/ui";

export function FormularioRegistro() {
  const [estado, accion, pendiente] = useActionState(registrar, {});
  return (
    <form action={accion} className="grid gap-4">
      <Campo id="nombre" name="nombre" etiqueta="Nombre completo" autoComplete="name" required defaultValue={estado.campos?.nombre} />
      <Campo id="email" name="email" type="email" etiqueta="Correo" autoComplete="email" required defaultValue={estado.campos?.email} />
      <Campo
        id="clave"
        name="clave"
        type="password"
        etiqueta="Contraseña"
        autoComplete="new-password"
        ayuda="Mínimo 8 caracteres, con una mayúscula y un número."
        required
        minLength={8}
      />
      <MensajeError>{estado.error}</MensajeError>
      <Boton type="submit" disabled={pendiente}>
        {pendiente ? "Creando cuenta…" : "Crear cuenta"}
      </Boton>
    </form>
  );
}
