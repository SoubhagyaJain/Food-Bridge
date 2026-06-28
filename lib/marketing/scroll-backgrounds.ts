import { STITCH_IMAGES } from "@/lib/marketing/stitch-images";

export type ScrollBackgroundSection = {
  /** Matches the section element id on the landing page */
  id: string;
  src: string;
  alt: string;
  priority?: boolean;
};

export const IMPACT_SECTION_ID = "impact";

/** Section IDs tracked by IntersectionObserver (DOM order) */
export const TRACKED_MARKETING_SECTION_IDS = [
  IMPACT_SECTION_ID,
  "how-it-works",
  "community",
  "stories",
  "cta",
] as const;

/**
 * Post-hero sections — Hero keeps its own slideshow.
 * Impact is first: shown as soon as the user scrolls past the hero.
 */
export const SCROLL_BACKGROUND_SECTIONS: ScrollBackgroundSection[] = [
  {
    id: IMPACT_SECTION_ID,
    src: STITCH_IMAGES.impactBg,
    alt: "Community impact",
    priority: true,
  },
  {
    id: "how-it-works",
    src: STITCH_IMAGES.howItWorksBg,
    alt: "How Foodbridge works",
  },
  {
    id: "community",
    src: STITCH_IMAGES.rolesBg,
    alt: "Community volunteers",
    priority: true,
  },
  {
    id: "stories",
    src: STITCH_IMAGES.testimonialsBg,
    alt: "Community stories",
  },
  {
    id: "cta",
    src: STITCH_IMAGES.ctaBg,
    alt: "Join Foodbridge",
  },
];