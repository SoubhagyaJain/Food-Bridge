import { SCROLL_BACKGROUND_SECTIONS } from "./scroll-backgrounds";
import { STITCH_IMAGES } from "./stitch-images";

const preloaded = new Set<string>();

export function stripCdnSizeParam(url: string) {
  const base = url.split("=")[0];
  return base && base.length > 0 ? base : url;
}

export function preloadImageUrl(url: string): Promise<void> {
  if (preloaded.has(url)) return Promise.resolve();
  preloaded.add(url);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      const fallback = stripCdnSizeParam(url);
      if (fallback !== url) {
        preloadImageUrl(fallback).then(resolve);
        return;
      }
      resolve();
    };
    img.src = url;
  });
}

/** Eagerly fetch every post-hero scroll background (and hero lead slide). */
export function preloadMarketingLandingImages(): Promise<void> {
  const urls = [
    ...SCROLL_BACKGROUND_SECTIONS.map((section) => section.src),
    STITCH_IMAGES.heroSlides[0]?.src,
  ].filter((url): url is string => Boolean(url));

  return Promise.all(urls.map(preloadImageUrl)).then(() => undefined);
}

export function preloadAllScrollBackgrounds(): Promise<void> {
  return Promise.all(SCROLL_BACKGROUND_SECTIONS.map((section) => preloadImageUrl(section.src))).then(
    () => undefined
  );
}

/** Eagerly fetch volunteer portal cinematic backgrounds. */
export function preloadVolunteerPortalImages(): Promise<void> {
  const urls = [
    STITCH_IMAGES.volunteerDashboardBg,
    STITCH_IMAGES.volunteerPickupsBg,
    STITCH_IMAGES.volunteerHistoryBg,
  ];

  return Promise.all(urls.map(preloadImageUrl)).then(() => undefined);
}

/** True when the browser already has bytes for this URL. */
export function isImageCached(url: string): boolean {
  if (typeof window === "undefined") return false;
  const probe = new Image();
  probe.src = url;
  return probe.complete && probe.naturalWidth > 0;
}