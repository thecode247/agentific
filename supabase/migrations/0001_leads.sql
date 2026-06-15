-- Agentific — lead capture table
-- Run this in your Supabase project (SQL Editor) or via `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  organisation text,
  interest     text,
  message      text,
  source       text default 'website',
  user_agent   text,
  page         text
);

-- Row Level Security: anonymous visitors may INSERT a lead, but may NOT read them.
-- You (the owner) read leads in the Supabase dashboard or via the service-role key.
alter table public.leads enable row level security;

drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- (No SELECT policy for anon → leads are private by default.)

create index if not exists leads_created_at_idx on public.leads (created_at desc);
