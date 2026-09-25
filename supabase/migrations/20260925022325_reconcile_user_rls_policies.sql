alter table public.profiles enable row level security;
alter table public.friend_connections enable row level security;
alter table public.blocked_users enable row level security;
alter table public.giveaway_entries enable row level security;

drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can view their own profile" on public.profiles;

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can create friend requests" on public.friend_connections;
drop policy if exists "Recipients or requesters can update friend requests" on public.friend_connections;
drop policy if exists "Users can view their friend connections" on public.friend_connections;

create policy "Users can create friend requests"
on public.friend_connections for insert
to authenticated
with check ((select auth.uid()) = requester_id);

create policy "Recipients or requesters can update friend requests"
on public.friend_connections for update
to authenticated
using ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id)
with check ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id);

create policy "Users can view their friend connections"
on public.friend_connections for select
to authenticated
using ((select auth.uid()) = requester_id or (select auth.uid()) = recipient_id);

drop policy if exists "Users can create their blocks" on public.blocked_users;
drop policy if exists "Users can delete their blocks" on public.blocked_users;
drop policy if exists "Users can view their blocks" on public.blocked_users;

create policy "Users can create their blocks"
on public.blocked_users for insert
to authenticated
with check ((select auth.uid()) = blocker_id);

create policy "Users can delete their blocks"
on public.blocked_users for delete
to authenticated
using ((select auth.uid()) = blocker_id);

create policy "Users can view their blocks"
on public.blocked_users for select
to authenticated
using ((select auth.uid()) = blocker_id);

drop policy if exists "Users can view their own giveaway entries" on public.giveaway_entries;

create policy "Users can view their own giveaway entries"
on public.giveaway_entries for select
to authenticated
using (
  email = (
    select users.email::text
    from auth.users
    where users.id = (select auth.uid())
  )
);