-- Google OAuth onboarding support
-- Run in Supabase SQL Editor after schema.sql

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default true;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
  user_full_name text;
  needs_onboarding boolean;
begin
  user_role := new.raw_user_meta_data->>'role';
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    ''
  );

  -- Email/password signup includes role in metadata; OAuth (Google) does not
  needs_onboarding := user_role is null or user_role = '';

  insert into public.profiles (id, email, full_name, role, onboarding_completed)
  values (
    new.id,
    new.email,
    user_full_name,
    coalesce(nullif(user_role, ''), 'donor'),
    not needs_onboarding
  );

  return new;
end;
$$;