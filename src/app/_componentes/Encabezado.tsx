import Link from "next/link";
import { salir } from "@/app/_acciones/autenticacion";
import type { Sesion } from "@/app/_lib/sesion";

const ENLACES = {
  reclutador: [
    { href: "/reclutador", texto: "Mis ofertas" },
    { href: "/reclutador/ofertas/nueva", texto: "Nueva oferta" },
  ],
  postulante: [
    { href: "/ofertas", texto: "Ofertas" },
    { href: "/mis-postulaciones", texto: "Mis postulaciones" },
  ],
} as const;

export function Encabezado({ sesion }: { sesion: Sesion }) {
  return (
    <header className="border-b border-borde bg-superficie">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-primario">
          CV<span className="font-semibold text-texto"> Lectura</span>
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap items-center gap-5 text-sm font-medium">
          {ENLACES[sesion.rol].map((e) => (
            <Link key={e.href} href={e.href} className="text-texto-2 hover:text-primario">
              {e.texto}
            </Link>
          ))}
          <span className="hidden text-xs text-texto-2 sm:inline" title={sesion.email}>
            {sesion.nombre || sesion.email} · {sesion.rol}
          </span>
          <form action={salir}>
            <button className="text-texto-2 hover:text-error">Cerrar sesión</button>
          </form>
        </nav>
      </div>
    </header>
  );
}

export function Contenedor({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8">{children}</main>;
}
