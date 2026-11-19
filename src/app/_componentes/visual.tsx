import { Check, CircleSlash, Star, X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ResultadoPuntaje } from "@/dominio/puntaje/calcularPuntaje";

/**
 * Colores del desglose. Todos con contraste ≥ 3:1 sobre blanco
 * (WCAG 1.4.11, objetos gráficos) y siempre acompañados de leyenda o texto.
 */
export const CRITERIOS_DESGLOSE: { clave: keyof ResultadoPuntaje["desglose"]; texto: string; color: string }[] = [
  { clave: "obligatorias", texto: "Obligatorias", color: "#4338ca" },
  { clave: "deseables", texto: "Deseables", color: "#6366f1" },
  { clave: "experiencia", texto: "Experiencia", color: "#0e7490" },
  { clave: "educacion", texto: "Educación", color: "#0891b2" },
  { clave: "idiomas", texto: "Idiomas", color: "#64748b" },
];

/** Barra apilada: cada criterio ocupa sus puntos sobre 100; el fondo gris es lo que faltó. */
export function BarraDesglose({ desglose, compacta = false }: { desglose: ResultadoPuntaje["desglose"]; compacta?: boolean }) {
  const resumen = CRITERIOS_DESGLOSE.map((c) => `${c.texto} ${desglose[c.clave].puntos} de ${desglose[c.clave].peso}`).join(", ");
  return (
    <div role="img" aria-label={`Desglose del puntaje: ${resumen}`} className={`flex overflow-hidden rounded-full bg-slate-100 ${compacta ? "h-2 w-40" : "h-3 w-full"}`}>
      {CRITERIOS_DESGLOSE.map((c) =>
        desglose[c.clave].puntos > 0 ? (
          <span
            key={c.clave}
            title={`${c.texto}: ${desglose[c.clave].puntos.toFixed(2)} / ${desglose[c.clave].peso}`}
            style={{ width: `${desglose[c.clave].puntos}%`, backgroundColor: c.color }}
            className="h-full border-r border-white last:border-r-0"
          />
        ) : null,
      )}
    </div>
  );
}

export function LeyendaDesglose() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-texto-2">
      {CRITERIOS_DESGLOSE.map((c) => (
        <li key={c.clave} className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
          {c.texto}
        </li>
      ))}
    </ul>
  );
}

export function ChipHabilidad({ nombre, cumple }: { nombre: string; cumple: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium ${
        cumple ? "border-exito/30 bg-exito/5 text-exito" : "border-borde bg-slate-50 text-texto-2 line-through decoration-slate-400"
      }`}
    >
      {cumple ? <Check aria-hidden className="size-3" /> : <X aria-hidden className="size-3" />}
      <span className="sr-only">{cumple ? "cumple" : "no cumple"}: </span>
      {nombre}
    </span>
  );
}

export function ChipsHabilidades({ cumplidas, faltantes, maximo = 4 }: { cumplidas: string[]; faltantes: string[]; maximo?: number }) {
  const todas = [...cumplidas.map((n) => ({ n, c: true })), ...faltantes.map((n) => ({ n, c: false }))];
  const visibles = todas.slice(0, maximo);
  return (
    <div className="flex flex-wrap gap-1">
      {visibles.map(({ n, c }) => (
        <ChipHabilidad key={n} nombre={n} cumple={c} />
      ))}
      {todas.length > maximo && <span className="text-xs text-texto-2">+{todas.length - maximo}</span>}
    </div>
  );
}

const DECISIONES = {
  preseleccionado: { texto: "Preseleccionado", Icono: Star, clase: "border-primario/30 bg-primario-suave text-primario-oscuro" },
  descartado: { texto: "Descartado", Icono: CircleSlash, clase: "border-borde bg-slate-100 text-texto-2" },
} as const;

export function InsigniaDecision({ decision }: { decision: keyof typeof DECISIONES | null }) {
  if (!decision) return <span className="text-xs text-texto-2">Sin decidir</span>;
  const { texto, Icono, clase } = DECISIONES[decision];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${clase}`}>
      <Icono aria-hidden className="size-3.5" />
      {texto}
    </span>
  );
}

export function EstadoVacio({ Icono, titulo, children }: { Icono: LucideIcon; titulo: string; children?: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-superficie px-6 py-12 text-center">
      <Icono aria-hidden className="size-10 text-slate-400" strokeWidth={1.5} />
      <p className="font-semibold">{titulo}</p>
      {children && <div className="max-w-md text-sm text-texto-2">{children}</div>}
    </div>
  );
}

export function Esqueleto({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}
