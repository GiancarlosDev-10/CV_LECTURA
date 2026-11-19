import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/app/_componentes/Encabezado";
import { obtenerSesion, rutaInicio } from "@/app/_lib/sesion";
import { FormularioIngreso } from "./FormularioIngreso";

export const metadata = { title: "Ingresar · CV Lectura" };

export default async function PaginaIngresar() {
  const sesion = await obtenerSesion();
  if (sesion) redirect(rutaInicio(sesion.rol));

  return (
    <main className="mx-auto grid w-full max-w-sm flex-1 content-center gap-6 px-6 py-16">
      <Link href="/" aria-label="CV Lectura — inicio">
        <Logo />
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Ingresar</h1>
      <FormularioIngreso />
      <p className="text-sm text-texto-2">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-primario hover:underline">
          Regístrate como postulante
        </Link>
      </p>
    </main>
  );
}
