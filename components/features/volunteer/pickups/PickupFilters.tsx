"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Navigation, Search } from "lucide-react";
import type { PickupSearchParams } from "@/lib/volunteer/pickup-search-params";
import { pickupSearchToString } from "@/lib/volunteer/pickup-search-params";

const RADIUS_OPTIONS = [10, 25, 50] as const;

type PickupFiltersProps = {
  params: PickupSearchParams;
  profileLat?: number;
  profileLng?: number;
};

export function PickupFilters({ params, profileLat, profileLng }: PickupFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const updateParams = useCallback(
    (patch: Partial<PickupSearchParams>) => {
      const next: PickupSearchParams = { ...params, ...patch };
      const query = pickupSearchToString(next);
      startTransition(() => {
        router.push(`${pathname}?${query}`, { scroll: false });
      });
    },
    [params, pathname, router]
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateParams({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        if (profileLat != null && profileLng != null) {
          updateParams({ lat: profileLat, lng: profileLng });
        }
      }
    );
  };

  return (
      <div
        className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-md"
        aria-busy={pending}
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card-muted px-4 py-2.5">
          <MapPin size={16} className="text-brand-coral" aria-hidden />
          <label htmlFor="pickup-radius" className="sr-only">
            Search radius
          </label>
          <select
            id="pickup-radius"
            value={params.radius}
            onChange={(e) => updateParams({ radius: Number(e.target.value) })}
            className="bg-transparent text-sm font-medium text-muted focus:outline-none"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                Radius: {r} km
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card-muted px-4 py-2.5">
          <Search size={16} className="text-muted-soft" aria-hidden />
          <label htmlFor="pickup-sort" className="sr-only">
            Sort order
          </label>
          <select
            id="pickup-sort"
            value={params.sort}
            onChange={(e) => updateParams({ sort: e.target.value as PickupSearchParams["sort"] })}
            className="bg-transparent text-sm font-medium text-muted focus:outline-none"
          >
            <option value="distance">Sort by: Distance</option>
            <option value="expiry">Sort by: Expiry</option>
          </select>
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          className="ml-auto flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-2.5 text-sm font-semibold text-brand-coral transition-colors hover:bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/30 dark:hover:bg-orange-950/50"
        >
          <Navigation size={16} aria-hidden />
          Use my location
        </button>
        {searchParams.get("lat") && (
          <p className="w-full text-xs text-muted" aria-live="polite">
            Using custom location from your device or profile.
          </p>
        )}
      </div>
  );
}