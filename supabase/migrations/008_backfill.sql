-- FoodBridge v1: backfill profiles for existing auth users

insert into public.profiles (id, email, full_name, role, organization_name, onboarding_completed)
select
  u.id,
  u.email,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  coalesce(nullif(u.raw_user_meta_data->>'role', '')::user_role, 'donor'::user_role),
  u.raw_user_meta_data->>'organization_name',
  coalesce((u.raw_user_meta_data->>'role') is not null and (u.raw_user_meta_data->>'role') <> '', false)
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
  and u.email is not null
on conflict (id) do nothing;

insert into public.ngo_profiles (profile_id, organization_name)
select
  p.id,
  coalesce(p.organization_name, p.full_name || ' Organization')
from public.profiles p
left join public.ngo_profiles np on np.profile_id = p.id
where p.role = 'ngo'
  and np.profile_id is null
on conflict (profile_id) do nothing;