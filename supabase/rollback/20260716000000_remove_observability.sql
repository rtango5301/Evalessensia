-- Explicit rollback for 20260716000000_add_observability.sql.
-- Run only after confirming that these three tables were created by that migration.

begin;

drop trigger if exists runs_validate_root on public.runs;
drop trigger if exists traces_validate_root on public.traces;
drop function if exists public.validate_observability_trace_root();

drop table if exists public.runs;
drop table if exists public.traces;
drop table if exists public.projects;

commit;
