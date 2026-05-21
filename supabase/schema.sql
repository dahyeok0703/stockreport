-- ============================================================
-- Stockreport — 1단계 B 스키마
-- 회원, 관심종목, 일일 사용량 + RLS 정책
-- ============================================================

-- pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  plan        text not null default 'free' check (plan in ('free', 'basic', 'pro')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger: 회원가입 시 자동으로 profiles row 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- watchlist_items
-- ------------------------------------------------------------
create table if not exists public.watchlist_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  market      text not null,
  symbol      text not null,
  name        text not null,
  exchange    text,
  sector      text,
  created_at  timestamptz not null default now(),
  constraint watchlist_items_unique_per_user unique (user_id, market, symbol)
);

create index if not exists watchlist_items_user_id_idx
  on public.watchlist_items (user_id, created_at desc);

alter table public.watchlist_items enable row level security;

drop policy if exists "watchlist: select own" on public.watchlist_items;
create policy "watchlist: select own"
  on public.watchlist_items for select
  using (auth.uid() = user_id);

drop policy if exists "watchlist: insert own" on public.watchlist_items;
create policy "watchlist: insert own"
  on public.watchlist_items for insert
  with check (auth.uid() = user_id);

drop policy if exists "watchlist: delete own" on public.watchlist_items;
create policy "watchlist: delete own"
  on public.watchlist_items for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- daily_usage
-- ------------------------------------------------------------
create table if not exists public.daily_usage (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  usage_date    date not null,
  report_views  int not null default 0,
  ai_summaries  int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint daily_usage_user_date_unique unique (user_id, usage_date)
);

create index if not exists daily_usage_user_date_idx
  on public.daily_usage (user_id, usage_date desc);

alter table public.daily_usage enable row level security;

-- 사용자는 자기 사용량만 볼 수 있음
drop policy if exists "usage: select own" on public.daily_usage;
create policy "usage: select own"
  on public.daily_usage for select
  using (auth.uid() = user_id);

-- 사용량 증가는 본인 row에 한해서만 insert/update 허용
-- (서버 액션에서 user_id 검증 후 upsert)
drop policy if exists "usage: insert own" on public.daily_usage;
create policy "usage: insert own"
  on public.daily_usage for insert
  with check (auth.uid() = user_id);

drop policy if exists "usage: update own" on public.daily_usage;
create policy "usage: update own"
  on public.daily_usage for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
