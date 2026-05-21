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

-- ============================================================
-- 1단계 C: 외부 데이터 매핑 / 캐시 / 스냅샷
-- ============================================================

-- ------------------------------------------------------------
-- stock_mappings
-- 한국 종목코드 ↔ DART corp_code, 미국 ticker ↔ SEC CIK 매핑
-- ------------------------------------------------------------
create table if not exists public.stock_mappings (
  id              uuid primary key default gen_random_uuid(),
  market          text not null check (market in ('kr', 'us')),
  symbol          text not null,
  name            text not null,
  exchange        text,
  country         text,
  dart_corp_code  text,
  sec_cik         text,
  sector          text,
  industry        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint stock_mappings_market_symbol_unique unique (market, symbol)
);

create index if not exists stock_mappings_market_idx
  on public.stock_mappings (market);

alter table public.stock_mappings enable row level security;

-- 읽기는 익명/로그인 사용자 모두 허용 (공개 메타데이터)
drop policy if exists "stock_mappings: read all" on public.stock_mappings;
create policy "stock_mappings: read all"
  on public.stock_mappings for select
  using (true);

-- 쓰기 정책 없음 → service role 로만 쓰기 가능

-- ------------------------------------------------------------
-- api_cache
-- 외부 API 응답 캐시. service role 로만 접근 (RLS 차단)
-- ------------------------------------------------------------
create table if not exists public.api_cache (
  id          uuid primary key default gen_random_uuid(),
  cache_key   text unique not null,
  provider    text not null,
  endpoint    text not null,
  params      jsonb,
  response    jsonb not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists api_cache_expires_at_idx
  on public.api_cache (expires_at);

alter table public.api_cache enable row level security;

-- 정책 없음 → anon/authenticated 클라이언트는 접근 불가. service role 만 사용.

-- ------------------------------------------------------------
-- stock_data_snapshots
-- 종목별 정규화된 리포트 데이터 스냅샷
-- ------------------------------------------------------------
create table if not exists public.stock_data_snapshots (
  id             uuid primary key default gen_random_uuid(),
  market         text not null check (market in ('kr', 'us')),
  symbol         text not null,
  data           jsonb not null,
  source_status  text not null default 'partial'
    check (source_status in ('mock', 'partial', 'real', 'error')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint stock_data_snapshots_market_symbol_unique unique (market, symbol)
);

create index if not exists stock_data_snapshots_updated_at_idx
  on public.stock_data_snapshots (updated_at desc);

alter table public.stock_data_snapshots enable row level security;

-- 읽기는 공개 허용 (정규화·압축된 메타 정보)
drop policy if exists "snapshots: read all" on public.stock_data_snapshots;
create policy "snapshots: read all"
  on public.stock_data_snapshots for select
  using (true);

-- 쓰기 정책 없음 → service role 로만 쓰기 가능

-- ============================================================
-- 시장 일정 캘린더 (초안 — 자동 갱신 단계에서 적용)
-- ============================================================

create table if not exists public.calendar_events (
  id                  uuid primary key default gen_random_uuid(),
  date                date not null,
  title               text not null,
  category            text not null
    check (category in ('earnings','filing','economic','dividend','shareholder_meeting','market','news')),
  market              text not null check (market in ('kr','us','global')),
  company_name        text,
  symbol              text,
  description         text,
  checkpoints         jsonb,
  source_label        text,
  source_url          text,
  source_type         text,
  raw_source_id       text,
  detected_at         timestamptz,
  last_refreshed_at   timestamptz,
  confidence          numeric,
  is_auto_generated   boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists calendar_events_date_idx
  on public.calendar_events (date);
create index if not exists calendar_events_category_market_idx
  on public.calendar_events (category, market);

alter table public.calendar_events enable row level security;

drop policy if exists "calendar_events: read all" on public.calendar_events;
create policy "calendar_events: read all"
  on public.calendar_events for select
  using (true);
-- 쓰기 정책 없음 → service role 로만 쓰기 가능 (cron / ingestion)

create table if not exists public.calendar_refresh_status (
  id           uuid primary key default gen_random_uuid(),
  provider     text unique not null
    check (provider in ('opendart','sec','news','earnings','economic','price')),
  last_run_at  timestamptz,
  next_run_at  timestamptz,
  status       text,
  message      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.calendar_refresh_status enable row level security;
-- 정책 없음 → 서버에서만 조회/갱신
