import { z } from "zod";

export const pickupSearchSchema = z.object({
  radius: z.coerce.number().min(10).max(50).default(25),
  sort: z.enum(["distance", "expiry"]).default("distance"),
  view: z.enum(["list", "map"]).default("list"),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

export type PickupSearchParams = z.infer<typeof pickupSearchSchema>;

export function parsePickupSearchParams(
  raw: Record<string, string | string[] | undefined>
): PickupSearchParams {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") normalized[key] = value;
  }
  return pickupSearchSchema.parse(normalized);
}

export function pickupSearchToString(params: PickupSearchParams): string {
  const search = new URLSearchParams();
  search.set("radius", String(params.radius));
  search.set("sort", params.sort);
  search.set("view", params.view);
  if (params.lat != null && params.lng != null) {
    search.set("lat", String(params.lat));
    search.set("lng", String(params.lng));
  }
  return search.toString();
}