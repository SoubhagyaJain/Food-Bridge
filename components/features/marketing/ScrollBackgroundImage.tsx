"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type ScrollBackgroundImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

function stripCdnSizeParam(url: string) {
  const base = url.split("=")[0];
  return base && base.length > 0 ? base : url;
}

/** Native img — reliable for Google CDN backgrounds (Next/Image fill fails in fixed layers). */
export function ScrollBackgroundImage({
  src: initialSrc,
  alt,
  priority = false,
  className,
}: ScrollBackgroundImageProps) {
  const [src, setSrc] = useState(initialSrc);

  const handleError = useCallback(() => {
    setSrc((current) => {
      const fallback = stripCdnSizeParam(current);
      return fallback !== current ? fallback : current;
    });
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      loading="eager"
      onError={handleError}
      className={cn("absolute inset-0 h-full w-full object-cover object-center", className)}
    />
  );
}