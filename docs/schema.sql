-- =============================================
-- MatchGoal — Schema Supabase
-- Rode no SQL Editor do painel do Supabase
-- =============================================

-- Garante estado limpo antes de recriar (seguro para re-execuções)
drop table if exists public.processed_transactions cascade;
drop table if exists public.profiles cascade;

-- Perfis dos usuários (estende auth.users do Supabase)
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text unique not null,
  status      text not null default 'expired' check (status in ('active', 'expired')),
  period_end  timestamptz,
  created_at  timestamptz default now() not null
);

-- Transações já processadas — garante idempotência nos webhooks
create table public.processed_transactions (
  id           uuid primary key default gen_random_uuid(),
  checkout_id  text unique not null,
  email        text not null,
  processed_at timestamptz default now() not null
);

-- Índices para as queries mais comuns
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_status_period_end_idx on public.profiles (status, period_end);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.processed_transactions enable row level security;

-- Usuário lê/edita apenas o próprio perfil
create policy "Usuário vê próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- processed_transactions: apenas service role (backend) pode inserir/ler
-- (nenhuma policy = apenas service role tem acesso)
