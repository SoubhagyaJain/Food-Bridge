import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "..");
export const LOCK_PATH = resolve(ROOT, "design-lock", "marketing.v1.json");

/** Files that define the frozen marketing landing design (2026-06-28). */
export const LOCKED_FILES = [
  "lib/marketing/typography.ts",
  "lib/marketing/scroll-backgrounds.ts",
  "lib/marketing/scroll-background-motion.ts",
  "lib/marketing/design-lock.ts",
  "components/features/marketing/HeroSection.tsx",
  "components/features/marketing/HowItWorksSection.tsx",
  "components/features/marketing/ImpactStatsSection.tsx",
  "components/features/marketing/RoleCardsSection.tsx",
  "components/features/marketing/CtaBannerSection.tsx",
  "components/features/marketing/ScrollBackground.tsx",
  "components/features/marketing/ScrollBackgroundProvider.tsx",
  "components/features/marketing/MarketingPageShell.tsx",
  "app/globals.css",
  "tailwind.config.ts",
];

export const DESIGN_CONTRACTS = {
  lockVersion: "marketing-v1",
  sectionOrder: ["impact", "how-it-works", "community", "stories", "cta"],
  heroSectionId: "home",
  heroHeadline: "Turn Surplus Food\nInto Real Impact",
  howItWorksHeadline: "Four Simple Steps.\nOne Shared Mission.",
  ctaGetStartedUsesHeroCtaClass: "hero-cta-primary",
  /** Role cards must stay static on touch — no hover background shifts */
  roleCardForbiddenPatterns: [
    "hover:bg-white/90",
    "hover:border-primary/45",
    "dark:hover:bg-[#4a382f]",
    "dark:hover:border-[#8b6f63]",
  ],
  howItWorksHeaderMustInclude: ["!text-white", "text-shadow-dark"],
  heroCtaMustInclude: ["hover:bg-white", "active:bg-white"],
};

export function sha256File(relativePath) {
  const absolute = resolve(ROOT, relativePath);
  if (!existsSync(absolute)) {
    throw new Error(`Locked file missing: ${relativePath}`);
  }
  const content = readFileSync(absolute, "utf8");
  return createHash("sha256").update(content).digest("hex");
}

export function readLockFile() {
  if (!existsSync(LOCK_PATH)) {
    throw new Error(`Design lock not found at ${LOCK_PATH}. Run: npm run design:lock`);
  }
  return JSON.parse(readFileSync(LOCK_PATH, "utf8"));
}

export function buildLockManifest() {
  const files = {};
  for (const relativePath of LOCKED_FILES) {
    files[relativePath] = sha256File(relativePath);
  }
  return {
    version: DESIGN_CONTRACTS.lockVersion,
    lockedAt: "2026-06-28",
    description:
      "Frozen FoodBridge marketing landing design. Run `npm run design:lock` only after intentional visual changes, then commit this file.",
    files,
    contracts: DESIGN_CONTRACTS,
  };
}

export function writeLockManifest(manifest) {
  mkdirSync(resolve(ROOT, "design-lock"), { recursive: true });
  writeFileSync(LOCK_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export function assertContracts() {
  const errors = [];

  const read = (relativePath) => readFileSync(resolve(ROOT, relativePath), "utf8");

  const roleCards = read("components/features/marketing/RoleCardsSection.tsx");
  if (!roleCards.includes("ROLE_CARD_STATIC_SURFACE")) {
    errors.push("RoleCardsSection must use ROLE_CARD_STATIC_SURFACE from design-lock");
  }
  for (const pattern of DESIGN_CONTRACTS.roleCardForbiddenPatterns) {
    if (roleCards.includes(pattern)) {
      errors.push(`RoleCardsSection must not include hover color pattern: ${pattern}`);
    }
  }

  const howItWorks = read("components/features/marketing/HowItWorksSection.tsx");
  for (const pattern of DESIGN_CONTRACTS.howItWorksHeaderMustInclude) {
    if (!howItWorks.includes(pattern)) {
      errors.push(`HowItWorksSection header missing required class: ${pattern}`);
    }
  }

  const cta = read("components/features/marketing/CtaBannerSection.tsx");
  if (!cta.includes(DESIGN_CONTRACTS.ctaGetStartedUsesHeroCtaClass)) {
    errors.push("CtaBannerSection Get Started must use hero-cta-primary class");
  }

  const typography = read("lib/marketing/typography.ts");
  if (!typography.includes("hover:bg-white active:bg-white")) {
    errors.push("Hero primary CTA must keep white background on hover/active");
  }

  const hero = read("components/features/marketing/HeroSection.tsx");
  if (!hero.includes("Turn Surplus Food") || !hero.includes("Into Real Impact")) {
    errors.push("Hero headline copy/layout contract broken");
  }

  const scrollBg = read("lib/marketing/scroll-backgrounds.ts");
  for (const id of DESIGN_CONTRACTS.sectionOrder) {
    if (!scrollBg.includes(`"${id}"`)) {
      errors.push(`Scroll background missing section id: ${id}`);
    }
  }

  const impact = read("components/features/marketing/ImpactStatsSection.tsx");
  if (impact.includes("SectionBackground")) {
    errors.push("ImpactStatsSection must use shared ScrollBackground, not SectionBackground");
  }

  if (roleCards.includes("SectionBackground")) {
    errors.push("RoleCardsSection must use shared ScrollBackground, not SectionBackground");
  }

  return errors;
}

export function verifyLock() {
  const manifest = readLockFile();
  const errors = [];

  if (manifest.version !== DESIGN_CONTRACTS.lockVersion) {
    errors.push(`Lock version mismatch: expected ${DESIGN_CONTRACTS.lockVersion}`);
  }

  for (const relativePath of LOCKED_FILES) {
    const expected = manifest.files?.[relativePath];
    if (!expected) {
      errors.push(`Lock manifest missing entry for ${relativePath}`);
      continue;
    }
    const actual = sha256File(relativePath);
    if (actual !== expected) {
      errors.push(
        `Design drift in ${relativePath}\n  expected: ${expected}\n  actual:   ${actual}\n  → Run npm run design:lock if this change was intentional.`
      );
    }
  }

  errors.push(...assertContracts());

  return errors;
}