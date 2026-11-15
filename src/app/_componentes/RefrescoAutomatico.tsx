"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Mientras haya CVs procesándose, vuelve a pedir los datos al servidor cada pocos segundos. */
export function RefrescoAutomatico({ activo, cadaMs = 3000 }: { activo: boolean; cadaMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!activo) return;
    const intervalo = setInterval(() => router.refresh(), cadaMs);
    return () => clearInterval(intervalo);
  }, [activo, cadaMs, router]);
  return null;
}
