/** Dev/scripts only — not imported by the Next.js app runtime. Use `lib/marketing/stitch-images.ts` for production image URLs. */
import "server-only";

import { Stitch, StitchToolClient } from "@google/stitch-sdk";

function getStitchApiKey(): string {
  const apiKey = process.env.STITCH_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "STITCH_API_KEY is missing. Add it to .env.local — get a key at https://stitch.withgoogle.com/"
    );
  }
  return apiKey;
}

/** Server-only Stitch SDK singleton (reads STITCH_API_KEY). */
export function getStitch() {
  return new Stitch(
    new StitchToolClient({
      apiKey: getStitchApiKey(),
    })
  );
}

export function isStitchConfigured(): boolean {
  return Boolean(process.env.STITCH_API_KEY?.trim());
}