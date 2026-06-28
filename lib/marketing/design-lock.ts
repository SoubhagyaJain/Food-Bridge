/**
 * DESIGN LOCK — marketing landing page (v1)
 *
 * Typography, scroll backgrounds, hero, section alignment, and card treatments
 * are frozen. CI runs `npm run design:verify` on every push.
 *
 * Intentional visual change:
 *   1. Edit the component/token files
 *   2. npm run design:lock
 *   3. Commit design-lock/marketing.v1.json with your code
 */

export const MARKETING_DESIGN_LOCK_VERSION = "marketing-v1" as const;

/** Landing section DOM ids — order matters for scroll backgrounds */
export const MARKETING_SECTION_IDS = [
  "home",
  "impact",
  "how-it-works",
  "community",
  "stories",
  "cta",
] as const;

export type MarketingSectionId = (typeof MARKETING_SECTION_IDS)[number];

/** Do not add hover background/border shifts on community role cards */
export const ROLE_CARD_STATIC_SURFACE =
  "border-primary/25 bg-white/80 dark:border-[#6b4f45]/70 dark:bg-[#3d2f28]/98" as const;

/** Hero + CTA primary button — white fill must persist on interaction */
export const HERO_CTA_WHITE_INTERACTION = "hover:bg-white active:bg-white" as const;