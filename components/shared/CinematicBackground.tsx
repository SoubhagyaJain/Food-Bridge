"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isImageCached,
  preloadImageUrl,
  stripCdnSizeParam,
} from "@/lib/marketing/preload-marketing-images";
import { STITCH_IMAGES } from "@/lib/marketing/stitch-images";
import { cn } from "@/lib/utils";

export type CinematicBackgroundVariant = "dashboard" | "pickups" | "history";

const VARIANTS: Record<
  CinematicBackgroundVariant,
  {
    src: string;
    containerClassName: string;
    imageClassName: string;
    overlayClassName: string;
  }
> = {
  dashboard: {
    src: STITCH_IMAGES.volunteerDashboardBg,
    containerClassName:
      "pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden",
    imageClassName:
      "animate-ken-burns saturate-[1.35] contrast-[1.14] brightness-[1.06] object-cover object-center dark:saturate-125 dark:brightness-[0.88] dark:contrast-[1.18]",
    overlayClassName:
      "bg-gradient-to-b from-white/20 via-white/10 to-white/25 transition-colors duration-300 dark:from-black/30 dark:via-black/15 dark:to-black/40",
  },
  pickups: {
    src: STITCH_IMAGES.volunteerPickupsBg,
    containerClassName:
      "pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden",
    imageClassName: "animate-ken-burns object-cover object-center",
    overlayClassName:
      "bg-gradient-to-r from-background/70 via-background/40 to-transparent transition-colors duration-300 dark:from-gray-900/85 dark:via-gray-900/55 dark:to-transparent",
  },
  history: {
    src: STITCH_IMAGES.volunteerHistoryBg,
    containerClassName:
      "pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden",
    imageClassName: "animate-ken-burns saturate-125 brightness-[0.9] object-cover object-center",
    overlayClassName:
      "bg-gradient-to-b from-black/50 via-black/40 to-black/60 backdrop-blur-[1px] transition-colors duration-300 dark:from-black/60 dark:via-black/45 dark:to-black/70",
  },
};

type CinematicBackgroundProps = {
  variant: CinematicBackgroundVariant;
};

/**
 * Volunteer portal cinematic backgrounds — native <img> for reliable CDN loading.
 */
export function CinematicBackground({ variant }: CinematicBackgroundProps) {
  const { src: initialSrc, containerClassName, imageClassName, overlayClassName } =
    VARIANTS[variant];
  const [src, setSrc] = useState(initialSrc);
  const [loaded, setLoaded] = useState(() =>
    typeof window !== "undefined" ? isImageCached(initialSrc) : false
  );

  useEffect(() => {
    void preloadImageUrl(initialSrc).then(() => setLoaded(true));
  }, [initialSrc]);

  const handleError = useCallback(() => {
    setSrc((current) => {
      const fallback = stripCdnSizeParam(current);
      return fallback !== current ? fallback : current;
    });
  }, []);

  return (
    <div className={cn(containerClassName)} aria-hidden>
      <div
        className="absolute inset-0 bg-surface-container transition-opacity duration-500"
        style={{ opacity: loaded ? 0 : 1 }}
      />
      <img
        src={src}
        alt=""
        decoding="async"
        fetchPriority="high"
        loading="eager"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center",
          imageClassName
        )}
      />
      <div className={cn("absolute inset-0", overlayClassName)} />
    </div>
  );
}