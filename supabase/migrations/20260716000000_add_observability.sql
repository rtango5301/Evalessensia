-- Additive observability schema. This migration intentionally does not alter
-- any existing Evalessensia table, policy, function, trigger, or data.

do $$
begin
  if to_regclass('auth.users') is null then
    raise exception 'Required relation auth.users is missing';
  end if;
  if to_regclass('public.api_keys') is null then
    raise exception 'Required relation public.api_keys is missing';
  end if;
  if to_regclass('public.projects') is not null
     or to_regclass('public.traces') is not null
     or to_regclass('public.runs') is not null then
    raise exception 'Observability table collision detected';
  end if;
end;
$$;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(100) not null check (length(btrim(name)) > 0),
  description text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.traces (
  trace_id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  thread_id uuid,
  root_run_id uuid not null,
  status varchar(20) check (status in ('pending', 'running', 'success', 'error')),
  start_time timestamptz,
  end_time timestamptz,
  latency_ms integer check (latency_ms >= 0),
  input_tokens integer check (input_tokens >= 0),
  output_tokens integer check (output_tokens >= 0),
  total_tokens integer check (total_tokens >= 0),
  total_cost double precision check (total_cost >= 0),
  created_at timestamptz not null default now(),
  unique (trace_id, root_run_id)
);

create table public.runs (
  id uuid primary key,
  trace_id uuid not null,
  parent_run_id uuid,
  name varchar(150),
  run_type varchar(50),
  status varchar(20) check (status in ('pending', 'running', 'success', 'error')),
  start_time timestamptz,
  end_time timestamptz,
  latency_ms integer check (latency_ms >= 0),
  input jsonb,
  output jsonb,
  error text,
  metadata jsonb,
  attributes jsonb,
  tags text[],
  input_tokens integer check (input_tokens >= 0),
  output_tokens integer check (output_tokens >= 0),
  cost double precision check (cost >= 0),
  unique (trace_id, id),
  constraint runs_trace_fk
    foreign key (trace_id) references public.traces(trace_id) on delete cascade
    deferrable initially deferred,
  constraint runs_parent_same_trace_fk
    foreign key (trace_id, parent_run_id) references public.runs(trace_id, id)
    on delete restrict deferrable initially deferred
);

alter table public.traces
  add constraint traces_root_same_trace_fk
  foreign key (trace_id, root_run_id) references public.runs(trace_id, id)
  deferrable initially deferred;

create function public.validate_observability_trace_root()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  checked_trace_id uuid;
  checked_root_id uuid;
  checked_parent_id uuid;
begin
  if tg_table_name = 'traces' then
    checked_trace_id := new.trace_id;
    checked_root_id := new.root_run_id;
    select parent_run_id into checked_parent_id
      from public.runs
      where trace_id = checked_trace_id and id = checked_root_id;
  else
    select trace_id, root_run_id into checked_trace_id, checked_root_id
      from public.traces
      where trace_id = new.trace_id and root_run_id = new.id;
    if not found then
      return new;
    end if;
    checked_parent_id := new.parent_run_id;
  end if;

  if checked_parent_id is not null then
    raise exception 'A trace root run cannot have a parent';
  end if;
  return new;
end;
$$;

create constraint trigger traces_validate_root
after insert or update of trace_id, root_run_id on public.traces
deferrable initially deferred
for each row execute function public.validate_observability_trace_root();

create constraint trigger runs_validate_root
after insert or update of trace_id, parent_run_id on public.runs
deferrable initially deferred
for each row execute function public.validate_observability_trace_root();

create index idx_projects_user_id on public.projects(user_id);
create index idx_traces_project_start on public.traces(project_id, start_time desc);
create index idx_traces_project_status on public.traces(project_id, status);
create index idx_runs_trace_start on public.runs(trace_id, start_time);
create index idx_runs_parent on public.runs(parent_run_id);
create index idx_runs_type on public.runs(run_type);
create index idx_runs_status on public.runs(status);

alter table public.projects enable row level security;
alter table public.traces enable row level security;
alter table public.runs enable row level security;

create policy "Users can select own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

create policy "Users can select own traces" on public.traces
  for select using (
    exists (select 1 from public.projects
      where projects.id = traces.project_id and projects.user_id = auth.uid())
  );
create policy "Users can insert own traces" on public.traces
  for insert with check (
    exists (select 1 from public.projects
      where projects.id = traces.project_id and projects.user_id = auth.uid())
  );
create policy "Users can update own traces" on public.traces
  for update using (
    exists (select 1 from public.projects
      where projects.id = traces.project_id and projects.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.projects
      where projects.id = traces.project_id and projects.user_id = auth.uid())
  );
create policy "Users can delete own traces" on public.traces
  for delete using (
    exists (select 1 from public.projects
      where projects.id = traces.project_id and projects.user_id = auth.uid())
  );

create policy "Users can select own runs" on public.runs
  for select using (
    exists (select 1 from public.traces
      join public.projects on projects.id = traces.project_id
      where traces.trace_id = runs.trace_id and projects.user_id = auth.uid())
  );
create policy "Users can insert own runs" on public.runs
  for insert with check (
    exists (select 1 from public.traces
      join public.projects on projects.id = traces.project_id
      where traces.trace_id = runs.trace_id and projects.user_id = auth.uid())
  );
create policy "Users can update own runs" on public.runs
  for update using (
    exists (select 1 from public.traces
      join public.projects on projects.id = traces.project_id
      where traces.trace_id = runs.trace_id and projects.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.traces
      join public.projects on projects.id = traces.project_id
      where traces.trace_id = runs.trace_id and projects.user_id = auth.uid())
  );
create policy "Users can delete own runs" on public.runs
  for delete using (
    exists (select 1 from public.traces
      join public.projects on projects.id = traces.project_id
      where traces.trace_id = runs.trace_id and projects.user_id = auth.uid())
  );

grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.traces to authenticated;
grant select, insert, update, delete on public.runs to authenticated;
