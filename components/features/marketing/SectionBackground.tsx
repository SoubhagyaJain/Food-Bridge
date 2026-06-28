"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isImageCached,
  preloadImageUrl,
  stripCdnSizeParam,
} from "@/lib/marketing/preload-marketing-images";
import { cn } from "@/lib/utils";

type SectionBackgroundProps = {
  src: string;
  alt?: string;
  priority?: boolean;
  overlayClassName?: string;
  imageClassName?: string;
  /** impact = Stitch cinematic hero/impact (black wash, photo-forward) */
  variant?: "cinematic" | "subtle" | "impact";
};

const VARIANT_FILTERS: Record<NonNullable<SectionBackgroundProps["variant"]>, string> = {
  impact: "saturate-150 contrast-[1.12] brightness-[0.9]",
  cinematic: "saturate-150 contrast-125 brightness-110 dark:brightness-[0.85] dark:contrast-[1.1]",
  subtle: "",
};

const VARIANT_OVERLAY: Record<NonNullable<SectionBackgroundProps["variant"]>, string> = {
  impact: "bg-black/50",
  cinematic: "bg-white/60 dark:bg-black/60",
  subtle: "bg-white/60 dark:bg-black/60",
};

/**
 * Full-bleed section background — native <img> for reliable CDN loading.
 * Next/Image fill was failing silently in stacked absolute layouts.
 */
export function SectionBackground({
  src: initialSrc,
  alt = "",
  priority = false,
  overlayClassName,
  imageClassName,
  variant = "cinematic",
}: SectionBackgroundProps) {
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
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Warm base while image loads — avoids white/black flash */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          variant === "impact" ? "bg-primary-container/40" : "bg-surface-container"
        )}
        style={{ opacity: loaded ? 0 : 1 }}
      />

      <img
        src={src}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center",
          VARIANT_FILTERS[variant],
          imageClassName
        )}
      />

      {/* Editorial depth — claret tint on impact only */}
      {variant === "impact" && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-transparent to-primary/35 mix-blend-multiply" />
      )}

      <div
        className={cn(
          "absolute inset-0",
          overlayClassName ?? VARIANT_OVERLAY[variant]
        )}
      />
    </div>
  );
}