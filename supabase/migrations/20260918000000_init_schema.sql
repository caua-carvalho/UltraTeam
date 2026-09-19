-- Schema for UltraTeam Tracker
-- High-performance team training tracking for ultramarathon runners

-- 1. Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  created_at timestamptz default now()
);

-- 2. Activities Table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  distance_km numeric not null check (distance_km > 0),
  duration_min integer check (duration_min is null or duration_min > 0),
  activity_type text not null check (activity_type in ('tiro', 'longo', 'leve', 'curto')),
  scheduled_date date not null,
  completed boolean default false not null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Weekly Goals Table
create table if not exists public.weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  target_km numeric not null check (target_km > 0),
  week_start date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, week_start)
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.weekly_goals enable row level security;

-- 5. RLS Policies: Profiles
-- Any authenticated user can view all profiles (needed for team mural)
create policy "Allow authenticated users to read profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can insert/update their own profile
create policy "Allow users to insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Allow users to update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 6. RLS Policies: Activities
-- Any authenticated user can read activities (for team mural and member transparency)
create policy "Allow authenticated users to read activities"
  on public.activities for select
  to authenticated
  using (true);

-- Only owners can insert, update, or delete their own activities
create policy "Allow users to insert own activities"
  on public.activities for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Allow users to update own activities"
  on public.activities for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Allow users to delete own activities"
  on public.activities for delete
  to authenticated
  using (auth.uid() = user_id);

-- 7. RLS Policies: Weekly Goals
-- Any authenticated user can view goals for mural
create policy "Allow authenticated users to read weekly goals"
  on public.weekly_goals for select
  to authenticated
  using (true);

-- Only owners can insert, update, or delete their own goals
create policy "Allow users to insert own weekly goals"
  on public.weekly_goals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Allow users to update own weekly goals"
  on public.weekly_goals for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Allow users to delete own weekly goals"
  on public.weekly_goals for delete
  to authenticated
  using (auth.uid() = user_id);

-- 8. Auto-create profile trigger on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update set
    name = coalesce(excluded.name, profiles.name),
    email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();
