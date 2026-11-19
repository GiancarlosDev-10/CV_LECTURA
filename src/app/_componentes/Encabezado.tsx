import { Briefcase, FileStack, LogOut, PlusCircle, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { salir } from "@/app/_acciones/autenticacion";
import type { Sesion } from "@/app/_lib/sesion";
import { EnlaceNav } from "./EnlaceNav";

const ENLACES = {
  reclutador: [
    { href: "/reclutador", texto: "Mis ofertas", Icono: Briefcase, exacto: true },
    { href: "/reclutador/ofertas/nueva", texto: "Nueva oferta", Icono: PlusCircle, exacto: true },
  ],
  postulante: [
    { href: "/ofertas", texto: "Ofertas", Icono: Search, exacto: false },
    { href: "/mis-postulaciones", texto: "Mis postulaciones", Icono: FileStack, exacto: false },
  ],
} as const;

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-primario">
      <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-primario text-sm font-bold text-white">
        CV
      </span>
      <span>
        CV<span className="font-semibold text-texto"> Lectura</span>
      </span>
    </span>
  );
}

export function Encabezado({ sesion }: { sesion: Sesion }) {
  return (
    <header className="sticky top-0 z-10 border-b border-borde bg-superficie/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" aria-label="CV Lectura — inicio">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap items-center gap-1">
          {ENLACES[sesion.rol].map(({ href, texto, Icono, exacto }) => (
            <EnlaceNav key={href} href={href} exacto={exacto}>
              <Icono aria-hidden className="size-4" />
              {texto}
            </EnlaceNav>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs text-texto-2 md:inline-flex" title={sesion.email}>
            <UserRound aria-hidden className="size-4" />
            {sesion.nombre || sesion.email}
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium capitalize">{sesion.rol}</span>
          </span>
          <form action={salir}>
            <button className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-texto-2 hover:bg-error/5 hover:text-error">
              <LogOut aria-hidden className="size-4" />
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function Contenedor({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6">{children}</main>;
}
