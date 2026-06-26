-- Allow specific users to sign in as any role (donor / ngo / volunteer)

alter table public.profiles
  add column if not exists role_switching_enabled boolean not null default false;

comment on column public.profiles.role_switching_enabled is
  'When true, user may log in as donor, ngo, or volunteer; role updates on each login.';

-- Enable for your account
update public.profiles
set role_switching_enabled = true
where email = 'jainsoubhagya632@gmail.com';