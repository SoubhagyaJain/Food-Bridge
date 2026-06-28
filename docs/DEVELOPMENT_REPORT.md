# FoodBridge Development Report

**Date:** June 28, 2026  
**Repository:** [SoubhagyaJain/Food-Bridge](https://github.com/SoubhagyaJain/Food-Bridge)  
**Branch:** `main`

---

## Executive Summary

This session delivered a full marketing landing page redesign aligned with Stitch design references, scroll-triggered scrollytelling backgrounds, volunteer portal Phase 1 modernization, typography and motion polish, interaction fixes, and a **marketing design lock** system so future builds cannot silently regress today’s UI.

---

## 1. Marketing Landing Page

### Hero Section (`HeroSection.tsx`)
- Cinematic slideshow with Ken Burns, crossfade, and scroll parallax
- Typography aligned with **“Four Simple Steps. One Shared Mission.”** (Caveat script)
- Two-line headline: *Turn Surplus Food / Into Real Impact*
- Playfair-style supporting hierarchy via shared photo tokens
- Stitch-matched overlays (warm multiply gradient + radial vignette)
- Light/dark photo treatments preserved separately
- Framer Motion entrance with `prefers-reduced-motion` support
- Refined CTAs and trust line

### Scroll-Triggered Backgrounds (Scrollytelling)
- `ScrollBackgroundProvider` + `ScrollBackground` fixed portal system
- Progress-based crossfade between sections (not hard cuts)
- Hero → Impact gentle handoff tied to scroll position
- Warm easing, subtle parallax, Ken Burns on active scene
- Sections: Impact → How It Works → Community → Stories → CTA
- Removed duplicate `SectionBackground` from Impact & Community (single canvas)

**Key files:**
- `lib/marketing/scroll-backgrounds.ts`
- `lib/marketing/scroll-background-motion.ts`
- `components/features/marketing/ScrollBackground*.tsx`

### Section Components
| Section | Component | Highlights |
|---------|-----------|------------|
| Impact | `ImpactStatsSection` | Full-viewport stats, white on photo |
| How It Works | `HowItWorksSection` | White headline/subhead in light mode |
| Community | `RoleCardsSection` | Brown dark-mode cards, static on touch |
| Stories | `TestimonialsSection` | Marquee testimonials |
| CTA | `CtaBannerSection` | Glass panel, fixed Get Started button |

### Typography System (`lib/marketing/typography.ts`)
- Centralized tokens: hero, section titles, cards, community, footer
- Photo-on-background variants (`text-shadow-dark`, white script)
- Community card cream/brown dark-mode palette

### Global Styles (`app/globals.css`, `tailwind.config.ts`)
- `text-shadow-hero`, hero CTA shadows
- `hero-cta-primary` dark-mode exception (burgundy on white button)
- `hero.cream` color tokens
- Volunteer nav contrast classes

---

## 2. Interaction & UX Fixes

| Issue | Fix |
|-------|-----|
| Get Started invisible in dark mode (CTA) | `hero-cta-primary` class + CSS override |
| Get Started turns brown on click | `hover:bg-white active:bg-white` + global rule |
| Role cards change color on touch | Removed hover bg/border shifts; `ROLE_CARD_STATIC_SURFACE` |
| How It Works text low contrast | `!text-white text-shadow-dark` on headers |

---

## 3. Marketing Design Lock (Regression Prevention)

**Purpose:** Freeze today’s marketing design so future feature work cannot accidentally change styles or alignment.

| Artifact | Role |
|----------|------|
| `design-lock/marketing.v1.json` | SHA-256 fingerprints of 14 critical files |
| `lib/marketing/design-lock.ts` | Version, section IDs, frozen constants |
| `scripts/verify-design-lock.mjs` | CI verification |
| `scripts/update-design-lock.mjs` | Update lock after intentional design changes |

**Commands:**
```bash
npm run design:verify   # Check design integrity (runs before build)
npm run design:lock     # Update lock after intentional visual changes
```

**CI:** New `design-lock` job in `.github/workflows/ci.yml`

---

## 4. Volunteer Portal — Phase 1

### Architecture
- Server-first pages with client islands
- New `components/features/volunteer/portal/` primitives
- URL-driven pickup filters via search params + Suspense

### New Structure
```
portal/
  PortalCard, PortalStatCard, VolunteerPageShell, VolunteerPageHeader
dashboard/
  DashboardView, DashboardStats, UrgentPickups
pickups/
  PickupsView, PickupListItem, PickupFilters, AcceptPickupButton
lib/volunteer/
  portal-tokens, pickup-search-params, filter-pickups, get-volunteer-open-pickups
```

### Removed (replaced)
- `VolunteerDashboardView.tsx`
- `AvailablePickupsClient.tsx`

### Other Volunteer Improvements
- `CinematicBackground` for dashboard/pickups/history
- Volunteer nav typography (light/dark readable)
- `VolunteerSidebar` / `VolunteerTopBar` contrast tokens
- Server-side random factoid for `FactoidCard`
- Leaflet map with server coords (`PickupLocationMap`)

---

## 5. Shared Infrastructure

- `NavigationShell`, `NavigationProgress`, `RouteLoader`
- `MarketingPageShell` with scroll background provider
- `PreloadMarketingImages` + stitch image CDN utilities
- `ForceDarkMode`, theme toggle polish
- Auth screen shell (`AuthScreenShell`)
- Blog page scaffold (`BlogPageView`)
- Dev scripts: `dev:fresh`, `kill-port`, design lock scripts

---

## 6. Stitch Integration

- `lib/marketing/stitch-images.ts` — CDN image map
- `stitch-export/` — HTML exports from Stitch screens
- `scripts/stitch-fetch-screen.mjs` — screen fetch utility
- Reference screen: `6035132037090274343` (hero localhost capture)

---

## 7. Scripts & Tooling

| Script | Purpose |
|--------|---------|
| `npm run dev:fresh` | Clean cache + dev on port 3002 |
| `npm run design:verify` | Marketing design lock check |
| `npm run design:lock` | Update design fingerprints |
| `npm run typecheck` | TypeScript validation |
| `prebuild` | Runs `design:verify` before production build |

---

## 8. Files Changed (Summary)

- **~50 modified** existing files (layouts, auth, volunteer, shared UI)
- **~60 new** files (marketing sections, portal, design lock, lib/marketing)
- **2 deleted** legacy volunteer components
- **CI** updated with design-lock job

---

## 9. How to Run Locally

```bash
cd FoodBridge
npm install
npm run dev:fresh
# → http://localhost:3002
```

---

## 10. Intentional Design Changes (Going Forward)

1. Edit locked marketing files
2. `npm run design:lock`
3. Commit code + `design-lock/marketing.v1.json`
4. Push — CI verifies fingerprints match

---

## 11. Not Included / Future Work

- Google Maps integration (discussed, not implemented)
- Volunteer portal Phase 2 (folder migration, Radix Select, history motion)
- Playwright visual regression (design lock uses file fingerprints instead)

---

*Report generated at end of development session — June 28, 2026.*