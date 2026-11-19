"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Enlace de navegación que marca la sección actual (aria-current) */
export function EnlaceNav({ href, exacto = false, children }: { href: string; exacto?: boolean; children: ReactNode }) {
  const ruta = usePathname();
  const activo = exacto ? ruta === href : ruta === href || ruta.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        activo ? "bg-primario-suave text-primario-oscuro" : "text-texto-2 hover:bg-slate-100 hover:text-texto"
      }`}
    >
      {children}
    </Link>
  );
}
