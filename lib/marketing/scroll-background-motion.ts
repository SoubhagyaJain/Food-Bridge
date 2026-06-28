import {
  IMPACT_SECTION_ID,
  SCROLL_BACKGROUND_SECTIONS,
} from "./scroll-backgrounds";

/** Warm, human crossfade — never snappy or mechanical */
export const SCROLL_BG_EASE = [0.33, 1, 0.45, 1] as const;

/** Soft follow when scroll-linked; used only when not dragging scroll */
export const SCROLL_BG_SETTLE_MS = 0.45;

export type ScrollBackgroundBlend = {
  /** Primary section for Ken Burns / overlays */
  activeId: string | null;
  fromId: string | null;
  toId: string | null;
  /** 0 = fully `fromId`, 1 = fully `toId` */
  progress: number;
  /** 0–1 fade-in while leaving the hero */
  heroExitProgress: number;
};

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Scrollytelling blend — crossfade between adjacent sections when both are visible.
 */
export function computeScrollBackgroundBlend(
  ratioMap: Record<string, number>,
  heroExitProgress: number
): ScrollBackgroundBlend {
  const heroFade = clamp01(heroExitProgress);

  if (heroFade <= 0.02) {
    return {
      activeId: null,
      fromId: null,
      toId: null,
      progress: 0,
      heroExitProgress: heroFade,
    };
  }

  const sections = SCROLL_BACKGROUND_SECTIONS;

  for (let i = 0; i < sections.length - 1; i++) {
    const from = sections[i];
    const to = sections[i + 1];
    const fromRatio = ratioMap[from.id] ?? 0;
    const toRatio = ratioMap[to.id] ?? 0;

    if (fromRatio > 0.06 && toRatio > 0.06) {
      const progress = clamp01(toRatio / (fromRatio + toRatio));
      return {
        activeId: progress >= 0.5 ? to.id : from.id,
        fromId: from.id,
        toId: to.id,
        progress,
        heroExitProgress: heroFade,
      };
    }
  }

  let bestId = IMPACT_SECTION_ID;
  let bestRatio = ratioMap[IMPACT_SECTION_ID] ?? 0;

  for (const section of sections) {
    const ratio = ratioMap[section.id] ?? 0;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = section.id;
    }
  }

  if (bestRatio <= 0.03 && heroFade < 1) {
    return {
      activeId: IMPACT_SECTION_ID,
      fromId: IMPACT_SECTION_ID,
      toId: IMPACT_SECTION_ID,
      progress: 1,
      heroExitProgress: heroFade,
    };
  }

  return {
    activeId: bestId,
    fromId: bestId,
    toId: bestId,
    progress: 1,
    heroExitProgress: heroFade,
  };
}

export function opacityForSection(
  sectionId: string,
  blend: ScrollBackgroundBlend
): number {
  const { fromId, toId, progress, heroExitProgress } = blend;

  if (!fromId || !toId) return 0;

  // Hero handoff — impact gently rises as the hero recedes
  if (heroExitProgress < 0.92) {
    return sectionId === IMPACT_SECTION_ID ? heroExitProgress : 0;
  }

  let opacity = 0;
  if (fromId === toId) {
    opacity = sectionId === fromId ? 1 : 0;
  } else if (sectionId === fromId) {
    opacity = 1 - progress;
  } else if (sectionId === toId) {
    opacity = progress;
  }

  return clamp01(opacity);
}