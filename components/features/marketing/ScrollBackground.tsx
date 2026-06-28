"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IMPACT_SECTION_ID, SCROLL_BACKGROUND_SECTIONS } from "@/lib/marketing/scroll-backgrounds";
import {
  opacityForSection,
  SCROLL_BG_EASE,
  SCROLL_BG_SETTLE_MS,
  type ScrollBackgroundBlend,
} from "@/lib/marketing/scroll-background-motion";
import { preloadAllScrollBackgrounds } from "@/lib/marketing/preload-marketing-images";
import { cn } from "@/lib/utils";
import { ScrollBackgroundImage } from "./ScrollBackgroundImage";

const IMAGE_FILTERS =
  "saturate-150 contrast-[1.12] brightness-[0.92] dark:brightness-[0.88] dark:contrast-[1.1]";

const IMPACT_IMAGE_FILTERS =
  "saturate-150 contrast-[1.12] brightness-[0.9] dark:brightness-[0.88]";

type ScrollBackgroundProps = {
  blend: ScrollBackgroundBlend;
};

export function ScrollBackground({ blend }: ScrollBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  const parallaxY = useTransform(scrollY, [0, 4000], [0, reduceMotion ? 0 : 48]);
  const isVisible = blend.heroExitProgress > 0.02;
  const isImpact = blend.activeId === IMPACT_SECTION_ID;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    void preloadAllScrollBackgrounds();
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        {SCROLL_BACKGROUND_SECTIONS.map((section) => {
          const targetOpacity = opacityForSection(section.id, blend);
          const isPrimary = blend.activeId === section.id && targetOpacity > 0.35;
          const isCommunity = section.id === "community";

          return (
            <motion.div
              key={section.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: targetOpacity,
                scale: reduceMotion
                  ? 1
                  : isPrimary
                    ? 1 + (1 - targetOpacity) * 0.02
                    : 1.03 - targetOpacity * 0.03,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: SCROLL_BG_SETTLE_MS, ease: SCROLL_BG_EASE }
              }
              style={{
                zIndex: targetOpacity > 0 ? Math.round(targetOpacity * 10) + 1 : 0,
              }}
            >
              <ScrollBackgroundImage
                src={section.src}
                alt={section.alt}
                priority={Boolean(section.priority || section.id === IMPACT_SECTION_ID)}
                className={cn(
                  section.id === IMPACT_SECTION_ID ? IMPACT_IMAGE_FILTERS : IMAGE_FILTERS,
                  !reduceMotion &&
                    isPrimary &&
                    section.id !== IMPACT_SECTION_ID &&
                    "animate-ken-burns"
                )}
              />

              {(isImpact || isCommunity) && targetOpacity > 0.2 && (
                <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-transparent to-primary/35 mix-blend-multiply" />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Warm readability wash — consistent across all story beats */}
      <motion.div
        className={cn(
          "absolute inset-0",
          isImpact ? "bg-black/48 dark:bg-black/52" : "bg-black/38 dark:bg-black/50"
        )}
        style={{ zIndex: 20 }}
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: SCROLL_BG_SETTLE_MS, ease: SCROLL_BG_EASE }
        }
      />

      {/* Soft vignette — hopeful, not harsh */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(42,12,8,0.45)_100%)]"
        style={{ zIndex: 21 }}
      />
    </div>,
    document.body
  );
}