-- Migration: 20260919000000_training_weeks_and_mission_integrity.sql
-- Evolution of weekly planning and mission integrity for UltraTeam Tracker

-- 1. Create training_weeks table
create table if not exists public.training_weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_start date not null,
  week_end date not null,
  title text,
  target_km numeric check (target_km is null or target_km > 0),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint uq_training_weeks_user_start unique (user_id, week_start),
  constraint chk_training_weeks_monday check (extract(isodow from week_start) = 1),
  constraint chk_training_weeks_span check (week_end = week_start + interval '6 days')
);

-- 2. Migrate existing weekly_goals into training_weeks
insert into public.training_weeks (user_id, week_start, week_end, title, target_km, created_at, updated_at)
select 
  user_id, 
  week_start, 
  (week_start + interval '6 days')::date as week_end, 
  title, 
  target_km, 
  created_at, 
  updated_at
from public.weekly_goals
on conflict (user_id, week_start) 
do update set 
  title = excluded.title,
  target_km = excluded.target_km,
  updated_at = excluded.updated_at;

-- 3. Ensure training_weeks exists for all current activities' dates and users
insert into public.training_weeks (
  user_id,
  week_start,
  week_end,
  title,
  target_km
)
select distinct
  a.user_id,
  date_trunc('week', a.scheduled_date::timestamp)::date as week_start,
  (
    date_trunc('week', a.scheduled_date::timestamp)::date
    + 6
  ) as week_end,
  'Semana de Treino'::text as title,
  null::numeric as target_km
from public.activities a
on conflict (user_id, week_start) do nothing;

-- 4. Add week_id column to activities
alter table public.activities 
  add column if not exists week_id uuid references public.training_weeks(id) on delete cascade;

-- 5. Backfill week_id for existing activities
update public.activities a
set week_id = tw.id
from public.training_weeks tw
where tw.user_id = a.user_id
  and a.scheduled_date >= tw.week_start
  and a.scheduled_date <= tw.week_end
  and a.week_id is null;

-- 6. Trigger to automatically resolve or validate week_id and ensure date integrity
create or replace function public.validate_and_assign_activity_week()
returns trigger as $$
declare
  v_week_start date;
  v_week_end date;
  v_week_user_id uuid;
  v_target_week_id uuid;
begin
  -- Calculate Monday of the scheduled date
  v_week_start := (date_trunc('week', NEW.scheduled_date::timestamp))::date;
  v_week_end := (v_week_start + interval '6 days')::date;

  -- If week_id is not provided, find or create the training_weeks record for this user & week
  if NEW.week_id is null then
    select id into v_target_week_id
    from public.training_weeks
    where user_id = NEW.user_id and week_start = v_week_start;

    if v_target_week_id is null then
      insert into public.training_weeks (user_id, week_start, week_end, title)
      values (NEW.user_id, v_week_start, v_week_end, 'Semana ' || to_char(v_week_start, 'DD/MM'))
      returning id into v_target_week_id;
    end if;

    NEW.week_id := v_target_week_id;
  else
    -- If week_id IS provided, strictly validate that it belongs to the user and covers the scheduled_date
    select user_id, week_start, week_end
    into v_week_user_id, v_week_start, v_week_end
    from public.training_weeks
    where id = NEW.week_id;

    if not found then
      raise exception 'A semana especificada (%) não existe.', NEW.week_id;
    end if;

    if v_week_user_id != NEW.user_id then
      raise exception 'Acesso negado: a semana associada pertence a outro operador.';
    end if;

    if NEW.scheduled_date < v_week_start or NEW.scheduled_date > v_week_end then
      raise exception 'Data inválida: a data da missão (%) deve estar entre % e % (semana associada).',
        NEW.scheduled_date, v_week_start, v_week_end;
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists trg_validate_and_assign_activity_week on public.activities;
create trigger trg_validate_and_assign_activity_week
  before insert or update of scheduled_date, week_id, user_id
  on public.activities
  for each row
  execute function public.validate_and_assign_activity_week();

-- Now make week_id not null
alter table public.activities alter column week_id set not null;

-- 7. Indexes for performant calendar queries
create index if not exists idx_training_weeks_user_dates 
  on public.training_weeks(user_id, week_start, week_end);

create index if not exists idx_activities_week_id 
  on public.activities(week_id);

create index if not exists idx_activities_user_scheduled 
  on public.activities(user_id, scheduled_date);

-- 8. Enable RLS on training_weeks
alter table public.training_weeks enable row level security;

-- 9. RLS Policies: training_weeks
-- Authenticated users can view all weeks (for mural / team visibility)
create policy "Allow authenticated users to read training weeks"
  on public.training_weeks for select
  to authenticated
  using (true);

-- Only owners can insert, update, or delete their own training weeks
create policy "Allow users to insert own training weeks"
  on public.training_weeks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Allow users to update own training weeks"
  on public.training_weeks for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Allow users to delete own training weeks"
  on public.training_weeks for delete
  to authenticated
  using (auth.uid() = user_id);

-- 10. Sync trigger between training_weeks and weekly_goals for backwards compatibility
create or replace function public.sync_training_weeks_to_weekly_goals()
returns trigger as $$
begin
  if NEW.target_km is not null and NEW.title is not null then
    insert into public.weekly_goals (user_id, week_start, title, target_km, updated_at)
    values (NEW.user_id, NEW.week_start, NEW.title, NEW.target_km, NEW.updated_at)
    on conflict (user_id, week_start)
    do update set
      title = excluded.title,
      target_km = excluded.target_km,
      updated_at = excluded.updated_at;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_training_weeks_to_weekly_goals on public.training_weeks;
create trigger trg_sync_training_weeks_to_weekly_goals
  after insert or update on public.training_weeks
  for each row
  execute function public.sync_training_weeks_to_weekly_goals();
