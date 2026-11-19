-- =====================================================================
-- Decisión humana del reclutador (refuerza RQ-SOP-02: el puntaje es apoyo,
-- la decisión la toma una persona y queda registrada con autor y fecha).
-- =====================================================================
alter table public.postulaciones
  add column decision text check (decision in ('preseleccionado', 'descartado')),
  add column decision_nota text check (length(decision_nota) <= 1000),
  add column decision_en timestamptz,
  add column decidido_por uuid references public.perfiles (id);

-- Permiso por COLUMNA: el reclutador solo puede escribir los campos de decisión,
-- nunca el puntaje, el estado ni los datos extraídos.
grant update (decision, decision_nota, decision_en, decidido_por) on public.postulaciones to authenticated;

create policy "reclutador registra decisiones en sus ofertas" on public.postulaciones
  for update to authenticated
  using (exists (
    select 1 from public.ofertas o
    where o.id = oferta_id and o.reclutador_id = (select auth.uid())
  ))
  with check (
    decidido_por = (select auth.uid())
    and exists (
      select 1 from public.ofertas o
      where o.id = oferta_id and o.reclutador_id = (select auth.uid())
    )
  );
