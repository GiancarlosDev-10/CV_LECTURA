import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "secundario" | "fantasma" | "peligro";

const ESTILO_BOTON: Record<Variante, string> = {
  primario: "bg-primario text-white hover:bg-primario-oscuro border-transparent",
  secundario: "bg-superficie text-primario border-primario hover:bg-primario-suave",
  fantasma: "bg-transparent text-texto-2 border-transparent hover:bg-borde/60",
  peligro: "bg-superficie text-error border-error hover:bg-error/5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export function Boton({ variante = "primario", className = "", ...props }: ComponentProps<"button"> & { variante?: Variante }) {
  return <button className={`${base} ${ESTILO_BOTON[variante]} ${className}`} {...props} />;
}

export function BotonEnlace({ variante = "primario", className = "", ...props }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={`${base} ${ESTILO_BOTON[variante]} ${className}`} {...props} />;
}

export function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-borde bg-superficie p-6 ${className}`}>{children}</section>;
}

export function Campo({
  etiqueta,
  ayuda,
  error,
  id,
  ...props
}: ComponentProps<"input"> & { etiqueta: string; ayuda?: string; error?: string; id: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined}
        className="rounded-lg border border-slate-300 bg-superficie px-3 py-2 text-sm aria-invalid:border-error"
        {...props}
      />
      {ayuda && !error && (
        <p id={`${id}-ayuda`} className="text-xs text-texto-2">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function MensajeError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
      {children}
    </p>
  );
}

const ESTADOS = {
  recibida: { texto: "Recibida", clase: "text-texto-2 bg-slate-100 border-slate-300" },
  procesando: { texto: "Procesando con IA", clase: "text-acento bg-acento/5 border-acento/30" },
  procesada: { texto: "Procesada", clase: "text-exito bg-exito/5 border-exito/30" },
  pendiente_revision_manual: { texto: "Pendiente de revisión manual", clase: "text-aviso bg-aviso/5 border-aviso/30" },
} as const;

export function EstadoPostulacion({ estado }: { estado: keyof typeof ESTADOS }) {
  const { texto, clase } = ESTADOS[estado];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${clase}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {texto}
    </span>
  );
}

/** Escala de un solo color; el número siempre visible (WCAG 1.4.1). Nunca rojo para puntajes bajos. */
export function Puntaje({ valor }: { valor: number }) {
  const clase =
    valor >= 80
      ? "bg-primario text-white"
      : valor >= 50
        ? "bg-primario-suave text-primario-oscuro"
        : "bg-slate-100 text-texto-2 border border-borde";
  return (
    <span className={`inline-block min-w-16 rounded-lg px-2.5 py-1 text-center text-sm font-bold tabular-nums ${clase}`}>
      {valor.toFixed(2).replace(".", ",")}
    </span>
  );
}

export function AdvertenciaPuntaje() {
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-info/25 bg-info/5 px-4 py-3 text-sm text-blue-900">
      <span aria-hidden className="font-bold">
        ⓘ
      </span>
      <p>
        <strong className="block">El puntaje es un apoyo, no una decisión.</strong>
        Se calcula con una fórmula fija a partir de los datos que la IA extrajo del CV. Revisa cada perfil antes de decidir.
      </p>
    </div>
  );
}

export function TituloPagina({ titulo, subtitulo, acciones }: { titulo: string; subtitulo?: ReactNode; acciones?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-texto-2">{subtitulo}</p>}
      </div>
      {acciones}
    </div>
  );
}

export function formatoFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" }).format(new Date(iso));
}
