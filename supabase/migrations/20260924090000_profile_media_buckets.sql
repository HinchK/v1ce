-- Public profile media buckets. Writes remain scoped to each authenticated user.
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('coin-photos', 'coin-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public profile media is readable" on storage.objects;
create policy "Public profile media is readable"
on storage.objects
for select
to public
using (bucket_id in ('avatars', 'coin-photos'));

drop policy if exists "Users upload their own profile media" on storage.objects;
create policy "Users upload their own profile media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('avatars', 'coin-photos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users update their own profile media" on storage.objects;
create policy "Users update their own profile media"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('avatars', 'coin-photos')
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id in ('avatars', 'coin-photos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users delete their own profile media" on storage.objects;
create policy "Users delete their own profile media"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('avatars', 'coin-photos')
  and owner_id = (select auth.uid()::text)
);
