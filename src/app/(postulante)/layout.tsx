import { Contenedor, Encabezado } from "@/app/_componentes/Encabezado";
import { requerirRol } from "@/app/_lib/sesion";

export default async function LayoutPostulante({ children }: LayoutProps<"/">) {
  const sesion = await requerirRol("postulante");
  return (
    <>
      <Encabezado sesion={sesion} />
      <Contenedor>{children}</Contenedor>
    </>
  );
}
