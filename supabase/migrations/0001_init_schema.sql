-- =============================================
-- MatchGoal — Schema Supabase (schema isolado "matchgoal")
-- Aplicado no projeto "Junior and Claude" (ref xuwcolzorlcneffpedcm) via MCP.
-- Fica separado do schema "public" (app de finanças) para não misturar.
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

-- Índices para as queries mais comuns
create index if not exists profiles_email_idx on matchgoal.profiles (email);
create index if not exists profiles_status_period_end_idx on matchgoal.profiles (status, period_end);

-- Row Level Security
alter table matchgoal.profiles enable row level security;
alter table matchgoal.processed_transactions enable row level security;

-- Usuário lê/edita apenas o próprio perfil
create policy "Usuário vê próprio perfil"
  on matchgoal.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on matchgoal.profiles for update
  using (auth.uid() = id);

-- processed_transactions: sem policy = apenas service role (backend) acessa.
-- (O linter aponta "RLS sem policy" como INFO — é o comportamento desejado.)

-- NOTA: para o cliente JS acessar o schema "matchgoal" via PostgREST, adicione
-- "matchgoal" em Settings → API → Exposed schemas no painel do Supabase.
