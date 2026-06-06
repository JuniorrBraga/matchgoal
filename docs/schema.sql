-- =============================================
-- MatchGoal — Schema Supabase (schema isolado "matchgoal")
-- Já aplicado no projeto via MCP. Fonte canônica:
--   supabase/migrations/0001_init_schema.sql
--
-- ⚠️ NÃO use o schema "public": ele pertence a outro app (finanças) no mesmo
-- projeto Supabase. Por isso o MatchGoal vive no schema dedicado "matchgoal".
-- (Versões antigas deste arquivo davam DROP em public.profiles — NÃO faça isso.)
-- =============================================

create schema if not exists matchgoal;

-- Perfis dos usuários (estende auth.users do Supabase)
create table if not exists matchgoal.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text unique not null,
  status      text not null default 'expired' check (status in ('active', 'expired')),
  period_end  timestamptz,
  created_at  timestamptz default now() not null
);

-- Transações já processadas — garante idempotência nos webhooks
create table if not exists matchgoal.processed_transactions (
  id           uuid primary key default gen_random_uuid(),
  checkout_id  text unique not null,
  email        text not null,
  processed_at timestamptz default now() not null
);

create index if not exists profiles_email_idx on matchgoal.profiles (email);
create index if not exists profiles_status_period_end_idx on matchgoal.profiles (status, period_end);

alter table matchgoal.profiles enable row level security;
alter table matchgoal.processed_transactions enable row level security;

create policy "Usuário vê próprio perfil"
  on matchgoal.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on matchgoal.profiles for update
  using (auth.uid() = id);

-- processed_transactions: sem policy = apenas service role (backend) acessa.

-- IMPORTANTE: exponha o schema "matchgoal" em
--   Supabase → Settings → API → Exposed schemas
-- para o cliente JS (PostgREST) conseguir ler/gravar via .from('profiles').
