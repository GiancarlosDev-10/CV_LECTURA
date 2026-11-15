import { Contenedor, Encabezado } from "@/app/_componentes/Encabezado";
import { requerirRol } from "@/app/_lib/sesion";

export default async function LayoutReclutador({ children }: LayoutProps<"/reclutador">) {
  const sesion = await requerirRol("reclutador");
  return (
    <>
      <Encabezado sesion={sesion} />
      <Contenedor>{children}</Contenedor>
    </>
  );
}
