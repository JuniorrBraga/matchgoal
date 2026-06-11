-- =============================================
-- MatchGoal — Schema Supabase (projeto DEDICADO)
-- Rode no SQL Editor do projeto do MatchGoal.
-- Schema padrão "public" (projeto é só do MatchGoal, sem compartilhar com outro app).
-- =============================================

-- Perfis dos usuários (estende auth.users do Supabase)
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text unique not null,
  status      text not null default 'expired' check (status in ('active', 'expired')),
  period_end  timestamptz,
  created_at  timestamptz default now() not null
);

-- Transações já processadas — garante idempotência nos webhooks
create table if not exists public.processed_transactions (
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
drop policy if exists "Usuário vê próprio perfil" on public.profiles;
create policy "Usuário vê próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- SEGURANÇA: NÃO criar policy de UPDATE para o usuário. Se o usuário pudesse
-- dar UPDATE no próprio perfil, ele se auto-ativaria (status='active') sem pagar.
-- Perfis só são escritos pelo backend (service_role, via webhook/cron).
drop policy if exists "Usuário atualiza próprio perfil" on public.profiles;

-- processed_transactions: sem policy = apenas service role (backend) acessa.
