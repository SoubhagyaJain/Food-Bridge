# FoodBridge Setup Checklist (Week 1–2)

Track onboarding tasks for new contributors. Status as of project setup.

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| 1 | Recommended folder structure | Must | **Done** | `app/`, `components/`, `lib/`, `server/`, `types/`, `supabase/` |
| 2 | Tailwind CSS + shadcn/ui | Must | **Done** | `tailwind.config.ts`, `components/ui/`, `components.json` |
| 3 | React Hook Form + Zod | Must | **Done** | `react-hook-form`, `@hookform/resolvers`, `components/ui/form.tsx` |
| 4 | Leaflet for maps | Must | **Done** | `components/shared/LeafletMap.tsx`, dynamic `Map.tsx` |
| 5 | `env.ts` for environment variables | Must | **Done** | [`env.ts`](env.ts), [`.env.example`](.env.example) |
| 6 | ESLint / Prettier | Should | **Done** | `eslint.config.mjs`, `.prettierrc`, `npm run format` |
| 7 | Initial README.md | Must | **Done** | [`README.md`](README.md) |
| 8 | Create Supabase project | Must | **Done** | Project: `thilwunymjbdlawvnqmt` |
| 9 | Supabase client (`client.ts` & `server.ts`) | Must | **Done** | [`lib/supabase/`](lib/supabase/) |
| 10 | `profiles` table | Must | **Done** | [`supabase/schema.sql`](supabase/schema.sql) |
| 11 | `donations` table | Must | **Done** | Includes `photo_url` in migration 003 |
| 12 | `claims` table | Must | **Done** | NGO claims on donations |
| 13 | `volunteer_pickups` table | Must | **Done** | Table: `pickups`; view alias: `volunteer_pickups` |
| 14 | Row Level Security (RLS) | Must | **Done** | `schema.sql` + [`002_rls_updates.sql`](supabase/migrations/002_rls_updates.sql) |
| 15 | `database.types.ts` | Must | **Done** | [`types/database.types.ts`](types/database.types.ts); regen: `npm run gen:types` |
| 16 | Supabase Storage for photos | Must | **Done** | Storage + photo upload in [`NewDonationForm.tsx`](components/features/donor/NewDonationForm.tsx) |
| 17 | Supabase Auth (Email + Password) | Must | **Done** | Login, register, callback, middleware |
| 18 | Google Sign-In (optional OAuth) | Must | **Done** | `GoogleSignInButton`, `/auth/onboarding`, migration 004 |

## SQL to run (in order)

1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/migrations/002_rls_updates.sql`](supabase/migrations/002_rls_updates.sql)
3. [`supabase/migrations/003_storage.sql`](supabase/migrations/003_storage.sql)
4. [`supabase/migrations/004_google_auth.sql`](supabase/migrations/004_google_auth.sql)

## Google Sign-In setup

1. **Google Cloud Console** → Credentials → OAuth 2.0 Client ID (Web)
   - Redirect URI: `https://thilwunymjbdlawvnqmt.supabase.co/auth/v1/callback`
2. **Supabase** → [Authentication → Providers → Google](https://supabase.com/dashboard/project/thilwunymjbdlawvnqmt/auth/providers) — enable + paste Client ID/Secret
3. **Supabase** → URL Configuration — add `http://localhost:3000/auth/callback`
4. Run migration `004_google_auth.sql` in SQL Editor

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://thilwunymjbdlawvnqmt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   # server only, never commit
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Useful commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # TypeScript
npm run gen:types    # Regenerate Supabase types
```