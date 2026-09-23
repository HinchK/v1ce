-- Align live schema with V1CE source entities from V1CE_Code.txt / V1CE_daea.txt.

alter table public.profiles add column if not exists birthday date;
alter table public.profiles add column if not exists coin_shape_path text;
alter table public.profiles add column if not exists coin_background text default 'solid';
alter table public.profiles add column if not exists coin_background_color text default '#F5D680';
alter table public.profiles add column if not exists coin_motto text;
alter table public.profiles add column if not exists gifted_count integer default 0;
alter table public.profiles add column if not exists is_premium boolean default false;
alter table public.profiles add column if not exists coin_balance integer default 0;

alter table public.friend_connections add column if not exists is_active_in_lounge boolean default false;
alter table public.friend_connections add column if not exists requester_email text;
alter table public.friend_connections add column if not exists recipient_email text;
alter table public.friend_connections add column if not exists requester_name text;
alter table public.friend_connections add column if not exists recipient_name text;

alter table public.blocked_users add column if not exists blocker_email text;
alter table public.blocked_users add column if not exists blocked_email text;

alter table public.lounge_messages add column if not exists message_type text default 'regular';
alter table public.lounge_messages add column if not exists related_friend text;
alter table public.lounge_messages add column if not exists sender_name text;
alter table public.lounge_messages add column if not exists body text;

create table if not exists public.giveaway_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  entered_by_email text,
  is_winner boolean default false,
  giveaway_month text not null,
  created_at timestamptz default now(),
  unique (email, giveaway_month)
);

alter table public.giveaway_entries enable row level security;

drop policy if exists "Users can insert their giveaway entries" on public.giveaway_entries;
create policy "Users can insert their giveaway entries"
on public.giveaway_entries
for insert
to authenticated
with check (true);

drop policy if exists "Users can read own giveaway entries" on public.giveaway_entries;
create policy "Users can read own giveaway entries"
on public.giveaway_entries
for select
to authenticated
using (email = coalesce((select auth.jwt() ->> 'email'), ''));
