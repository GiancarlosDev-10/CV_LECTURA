import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerSesion, rutaInicio } from "@/app/_lib/sesion";
import { FormularioRegistro } from "./FormularioRegistro";

export const metadata = { title: "Crear cuenta · CV Lectura" };

export default async function PaginaRegistro() {
  const sesion = await obtenerSesion();
  if (sesion) redirect(rutaInicio(sesion.rol));

  return (
    <main className="mx-auto grid w-full max-w-sm flex-1 content-center gap-6 px-6 py-16">
      <Link href="/" className="text-xl font-extrabold tracking-tight text-primario">
        CV<span className="font-semibold text-texto"> Lectura</span>
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Crear cuenta de postulante</h1>
        <p className="mt-1 text-sm text-texto-2">Con tu cuenta podrás postular a ofertas y eliminar tus datos cuando quieras.</p>
      </div>
      <FormularioRegistro />
      <p className="text-sm text-texto-2">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="font-semibold text-primario hover:underline">
          Ingresa
        </Link>
      </p>
    </main>
  );
}
