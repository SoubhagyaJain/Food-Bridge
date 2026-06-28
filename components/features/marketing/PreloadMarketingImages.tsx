"use client";

import { useEffect } from "react";
import { preloadMarketingLandingImages } from "@/lib/marketing/preload-marketing-images";

/** Runs once on landing page mount — warms all section background caches. */
export function PreloadMarketingImages() {
  useEffect(() => {
    void preloadMarketingLandingImages();
  }, []);

  return null;
}