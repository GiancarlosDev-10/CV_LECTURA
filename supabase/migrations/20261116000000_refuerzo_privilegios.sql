-- =====================================================================
-- Refuerzo de mínimo privilegio, independiente de la configuración del
-- proyecto ("Automatically expose new tables"). Garantiza el mismo estado
-- de permisos en dev y prod aunque prod se haya creado por CLI.
-- =====================================================================

-- anon (sin sesión) no tiene ningún permiso sobre el esquema público
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;

-- authenticated: se eliminan los permisos por defecto y se otorgan solo los necesarios
revoke all on public.perfiles, public.ofertas, public.postulaciones, public.accesos_cv from authenticated;
alter default privileges in schema public revoke all on tables from authenticated;

grant select on public.perfiles to authenticated;
grant select, insert, update on public.ofertas to authenticated;
grant select, insert, delete on public.postulaciones to authenticated;
grant select, insert on public.accesos_cv to authenticated;
