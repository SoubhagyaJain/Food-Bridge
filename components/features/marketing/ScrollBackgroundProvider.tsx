"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  IMPACT_SECTION_ID,
  TRACKED_MARKETING_SECTION_IDS,
} from "@/lib/marketing/scroll-backgrounds";
import {
  clamp01,
  computeScrollBackgroundBlend,
  type ScrollBackgroundBlend,
} from "@/lib/marketing/scroll-background-motion";
import { ScrollBackground } from "./ScrollBackground";

const SECTION_OBSERVER_OPTIONS: Record<string, IntersectionObserverInit> = {
  [IMPACT_SECTION_ID]: {
    threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
    rootMargin: "30% 0px 30% 0px",
  },
  default: {
    threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
    rootMargin: "18% 0px 18% 0px",
  },
};

const EMPTY_BLEND: ScrollBackgroundBlend = {
  activeId: null,
  fromId: null,
  toId: null,
  progress: 0,
  heroExitProgress: 0,
};

/**
 * Tracks scroll position + section visibility for scrollytelling background crossfades.
 */
export function ScrollBackgroundProvider({ children }: { children: ReactNode }) {
  const [ratioMap, setRatioMap] = useState<Record<string, number>>({});
  const [heroExitProgress, setHeroExitProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const observers: IntersectionObserver[] = [];
    const observed = new Set<string>();

    const setSectionRatio = (id: string, ratio: number) => {
      setRatioMap((prev) => {
        if (prev[id] === ratio) return prev;
        return { ...prev, [id]: ratio };
      });
    };

    const updateHeroExit = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      const { bottom } = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = clamp01(1 - bottom / (vh * 0.92));
      setHeroExitProgress(progress);
    };

    const attachObservers = () => {
      if (cancelled) return;

      for (const sectionId of TRACKED_MARKETING_SECTION_IDS) {
        if (observed.has(sectionId)) continue;

        const el = document.getElementById(sectionId);
        if (!el) continue;

        observed.add(sectionId);
        const options =
          SECTION_OBSERVER_OPTIONS[sectionId] ?? SECTION_OBSERVER_OPTIONS.default;
        const observer = new IntersectionObserver(
          ([entry]) => setSectionRatio(sectionId, entry.intersectionRatio),
          options
        );
        observer.observe(el);
        observers.push(observer);
      }

      if (observed.size < TRACKED_MARKETING_SECTION_IDS.length) {
        requestAnimationFrame(attachObservers);
      }
    };

    updateHeroExit();
    attachObservers();

    const onScroll = () => updateHeroExit();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelled = true;
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const blend = useMemo(
    () => computeScrollBackgroundBlend(ratioMap, heroExitProgress) ?? EMPTY_BLEND,
    [heroExitProgress, ratioMap]
  );

  return (
    <>
      <ScrollBackground blend={blend} />
      {children}
    </>
  );
}