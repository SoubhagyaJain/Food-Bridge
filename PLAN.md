# FoodBridge Release Plan

## Summary

This release delivers the **volunteer portal MVP**, **backend architecture documentation**, **dark mode** across volunteer pages, **dev cache hardening**, and supporting **Supabase migrations** (001–012).

---

## What's included

### Volunteer portal (UI + backend)

| Route | Feature |
|-------|---------|
| `/volunteer/dashboard` | Impact stats, milestone tracker, urgent pickups, getting-started checklist |
| `/volunteer/pickups` | List/map toggle, geo filters, claim flow |
| `/volunteer/tasks` | Active deliveries — mark picked up / delivered |
| `/volunteer/history` | Completed deliveries |
| `/volunteer/profile` | Home address, radius, availability, badges |
| `/volunteer/pickups/[id]` | Pickup detail with status stepper |

### Backend

- `server/queries/pickup.queries.ts` — geo RPC, tasks, history, impact stats
- `server/queries/volunteer.queries.ts` — volunteer profile + home coords
- `server/actions/volunteer.actions.ts` — accept / picked up / delivered / profile update
- `lib/mappers/donation.ts` — `PickupWithDonation`, donor name, geo fields
- `lib/volunteer/` — urgency sorting, badges, pickup UI helpers

### Database (Supabase SQL)

Run in order after base schema:

```
009_fix_rls_recursion.sql
010_role_switching.sql
011_volunteer_portal.sql
012_volunteer_pickup_donor.sql
```

New: `volunteer_profiles`, `picked_up_at`, pickup RPCs, `nearby_open_pickups`, `pickups_with_details` view.

### Documentation

- `README.md` — full backend architecture (schema, RLS, RPCs, auth, workflows)
- `PLAN.md` — this rollout plan

### Dev experience

- `scripts/dev.mjs` — clears stale `.next` before dev start (fixes `Cannot find module './992.js'`)
- `scripts/clean-cache.mjs` — manual cache clear
- `npm run build` — cleans cache before production build

### UI polish

- Volunteer dark mode (semantic theme tokens)
- Dashboard UI aligned with React prototype
- Marketing landing page restored

---

## Pre-deploy checklist

### 1. Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   # required for OAuth onboarding
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### 2. Supabase SQL Editor

1. Run migrations `009` → `012` (or full chain `001`–`012` on fresh project)
2. Verify RPCs: `accept_pickup`, `mark_picked_up`, `complete_pickup`, `nearby_open_pickups`
3. Regenerate types: `npm run gen:types`

### 3. Supabase Auth

- Site URL: `http://localhost:3002` (or production URL)
- Redirect: `{APP_URL}/auth/callback`
- Google OAuth provider enabled (optional)

### 4. Verify locally

```bash
npm install
npm run build
npm run dev
```

| Flow | Steps |
|------|-------|
| Donor | Register → post donation → see on dashboard |
| NGO | Browse donations → claim → see on claims |
| Volunteer | Set home address on profile → browse pickups → claim → tasks → picked up → delivered → history |

---

## Post-merge tasks (not in this PR)

| Item | Priority |
|------|----------|
| Wire `cancel_donation` RPC to donor UI | Medium |
| NGO service area settings UI | Medium |
| `expire_stale_donations` cron job | Medium |
| Notifications UI (`notifications` table) | Low |
| Wire `matching.service.ts` ranking | Low |

---

## Branch strategy

```
main ← feature/volunteer-portal-and-backend-docs (this PR)
```

Single PR containing volunteer portal, docs, dark mode, and dev tooling. Future work should split by feature area.