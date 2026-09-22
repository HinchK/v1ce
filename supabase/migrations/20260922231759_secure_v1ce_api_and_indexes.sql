-- Lock down public RPC exposure and keep the app RPCs authenticated-only.
revoke execute on function public.find_profile_by_email(text) from public, anon;
grant execute on function public.find_profile_by_email(text) to authenticated;

revoke execute on function public.get_lounge_messages() from public, anon;
grant execute on function public.get_lounge_messages() to authenticated;

revoke execute on function public.get_my_friend_connections() from public, anon;
grant execute on function public.get_my_friend_connections() to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Cover foreign keys used by friends, blocks, and lounge queries.
create index if not exists blocked_users_blocked_id_idx on public.blocked_users(blocked_id);
create index if not exists friend_connections_recipient_id_idx on public.friend_connections(recipient_id);
create index if not exists lounge_messages_sender_id_idx on public.lounge_messages(sender_id);

-- Avoid re-evaluating auth.uid() once per lounge row.
drop policy if exists "Accepted friends can view lounge messages" on public.lounge_messages;
create policy "Accepted friends can view lounge messages"
on public.lounge_messages
for select
to authenticated
using (
  (sender_id = (select auth.uid()))
  or exists (
    select 1
    from public.friend_connections f
    where f.status = 'accepted'
      and (
        (f.requester_id = (select auth.uid()) and f.recipient_id = lounge_messages.sender_id)
        or
        (f.recipient_id = (select auth.uid()) and f.requester_id = lounge_messages.sender_id)
      )
  )
);

drop policy if exists "Accepted friends can send lounge messages" on public.lounge_messages;
create policy "Accepted friends can send lounge messages"
on public.lounge_messages
for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1
    from public.friend_connections f
    where f.status = 'accepted'
      and (
        f.requester_id = (select auth.uid())
        or f.recipient_id = (select auth.uid())
      )
  )
);
