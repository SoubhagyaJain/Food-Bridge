# foodbridge

Next.js app for bridging surplus food to those who need it — donors, NGOs, and volunteers.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (auth + database)
- **Zod** (validation)
- **shadcn/ui**-style components

## Quick start

```bash
git clone https://github.com/SoubhagyaJain/Food-Bridge.git
cd Food-Bridge
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
foodbridge/
├── app/
│   ├── (auth)/              # /login, /register
│   ├── (marketing)/         # Public landing at /
│   ├── (donor)/donor/       # /donor/dashboard, /donor/donations/...
│   ├── (ngo)/ngo/           # /ngo/dashboard, /ngo/donations, /ngo/claims
│   ├── (volunteer)/volunteer/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn-style primitives
│   ├── shared/              # DonationCard, Navbar, Map, etc.
│   └── features/            # marketing, donor, ngo, volunteer
├── lib/                     # supabase, validations, utils
├── server/                  # actions, queries, services
├── types/
├── middleware.ts            # Auth + role-based route protection
└── env.ts
```

> **Note:** Route groups like `(donor)` provide layouts without affecting the URL. Role prefixes (`/donor`, `/ngo`, `/volunteer`) are required so dashboard routes don't conflict.

## Routes

| URL | Description |
|-----|-------------|
| `/` | Marketing landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/donor/dashboard` | Donor home |
| `/donor/donations/new` | Post donation |
| `/ngo/donations` | Browse available food |
| `/volunteer/pickups` | Pickup assignments |

## Legacy static site

The original HTML/CSS prototype lives in `legacy/` for reference.

## Environment variables

See `.env.example` for required Supabase keys.