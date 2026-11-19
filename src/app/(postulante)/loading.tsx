import { Esqueleto } from "@/app/_componentes/visual";

export default function Cargando() {
  return (
    <div role="status" aria-label="Cargando" className="grid gap-4">
      <Esqueleto className="h-8 w-64" />
      <Esqueleto className="h-28 w-full" />
      <Esqueleto className="h-28 w-full" />
      <Esqueleto className="h-28 w-full" />
    </div>
  );
}
