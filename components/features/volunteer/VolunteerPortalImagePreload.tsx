"use client";

import { useEffect } from "react";
import { preloadVolunteerPortalImages } from "@/lib/marketing/preload-marketing-images";

export function VolunteerPortalImagePreload() {
  useEffect(() => {
    void preloadVolunteerPortalImages();
  }, []);

  return null;
}