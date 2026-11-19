"use client";

import { useActionState, useState } from "react";
import { Boton, Campo, MensajeError } from "@/app/_componentes/ui";
import { PESOS_POR_DEFECTO, type Pesos } from "@/dominio/entidades/oferta";
import type { DatosOferta, EstadoOferta } from "./leerFormularioOferta";

const CRITERIOS: { clave: keyof Pesos; texto: string }[] = [
  { clave: "obligatorias", texto: "Habilidades obligatorias" },
  { clave: "deseables", texto: "Habilidades deseables" },
  { clave: "experiencia", texto: "Experiencia" },
  { clave: "educacion", texto: "Educación" },
  { clave: "idiomas", texto: "Idiomas" },
];

const NIVELES_MCER = ["A1", "A2", "B1", "B2", "C1", "C2"];

/** Formulario de oferta: vacío para publicar una nueva o con `inicial` para editar una existente. */
export function FormularioOferta({
  accion: accionServidor,
  inicial,
  textoBoton,
  textoPendiente,
}: {
  accion: (previo: EstadoOferta, formData: FormData) => Promise<EstadoOferta>;
  inicial?: DatosOferta;
  textoBoton: string;
  textoPendiente: string;
}) {
  const [estado, accion, pendiente] = useActionState(accionServidor, {});
  const [pesos, setPesos] = useState(inicial?.requisitos.pesos ?? PESOS_POR_DEFECTO);
  const r = inicial?.requisitos;
  const suma = Object.values(pesos).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

  return (
    <form action={accion} className="grid gap-6">
      <Campo id="titulo" name="titulo" etiqueta="Título" required maxLength={150} placeholder="Desarrollador Full Stack Junior" defaultValue={inicial?.titulo} />
      <div className="grid gap-1.5">
        <label htmlFor="descripcion" className="text-sm font-semibold">
          Descripción
        </label>
        <textarea id="descripcion" name="descripcion" rows={3} maxLength={2000} defaultValue={inicial?.descripcion} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="obligatorias" name="obligatorias" etiqueta="Habilidades obligatorias" ayuda="Separadas por comas: JavaScript, React, SQL" defaultValue={r?.habilidadesObligatorias.join(", ")} />
        <Campo id="deseables" name="deseables" etiqueta="Habilidades deseables" ayuda="Separadas por comas: Docker, AWS" defaultValue={r?.habilidadesDeseables.join(", ")} />
        <Campo id="anios" name="anios" type="number" min={0} max={40} step={0.5} defaultValue={r?.aniosExperiencia ?? 2} etiqueta="Años de experiencia" required />
        <div className="grid gap-1.5">
          <label htmlFor="nivelEducativo" className="text-sm font-semibold">
            Nivel educativo mínimo
          </label>
          <select id="nivelEducativo" name="nivelEducativo" defaultValue={r?.nivelEducativo ?? ""} className="rounded-lg border border-slate-300 bg-superficie px-3 py-2 text-sm">
            <option value="">No se exige</option>
            <option value="secundaria">Secundaria</option>
            <option value="tecnico">Técnico</option>
            <option value="universitario">Universitario</option>
            <option value="maestria">Maestría</option>
            <option value="doctorado">Doctorado</option>
          </select>
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-2 text-sm font-semibold">Idiomas requeridos (opcional)</legend>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <input name={`idioma_${i}`} aria-label={`Idioma ${i + 1}`} placeholder="Inglés" defaultValue={r?.idiomas[i]?.idioma} className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name={`nivel_${i}`} aria-label={`Nivel del idioma ${i + 1}`} defaultValue={r?.idiomas[i]?.nivel ?? "B1"} className="rounded-lg border border-slate-300 bg-superficie px-3 py-2 text-sm">
              {NIVELES_MCER.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-2 text-sm font-semibold">Pesos del puntaje (deben sumar 100)</legend>
        <div className="grid gap-3 sm:grid-cols-5">
          {CRITERIOS.map(({ clave, texto }) => (
            <Campo
              key={clave}
              id={`peso_${clave}`}
              name={`peso_${clave}`}
              type="number"
              min={0}
              max={100}
              etiqueta={texto}
              value={Number.isFinite(pesos[clave]) ? pesos[clave] : ""}
              onChange={(e) => setPesos({ ...pesos, [clave]: e.target.valueAsNumber })}
            />
          ))}
        </div>
        <p role="status" className={`text-sm font-semibold tabular-nums ${suma === 100 ? "text-exito" : "text-aviso"}`}>
          Suma: {suma} / 100
        </p>
      </fieldset>

      <MensajeError>{estado.error}</MensajeError>
      <Boton type="submit" disabled={pendiente || suma !== 100} className="justify-self-start">
        {pendiente ? textoPendiente : textoBoton}
      </Boton>
    </form>
  );
}
