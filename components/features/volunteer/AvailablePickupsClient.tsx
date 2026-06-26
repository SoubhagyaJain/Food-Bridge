"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { List as ListIcon, Map as MapIcon, MapPin, Navigation, Search } from "lucide-react";
import { PickupCard } from "@/components/features/volunteer/PickupCard";
import { EmptyState } from "@/components/features/volunteer/ui/EmptyState";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import { sortByUrgency } from "@/lib/volunteer/pickup-ui";

const VolunteerPickupMap = dynamic(
  () =>
    import("@/components/features/volunteer/VolunteerPickupMap").then((m) => m.VolunteerPickupMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card-muted text-sm text-muted">
        Loading map…
      </div>
    ),
  }
);

type AvailablePickupsClientProps = {
  initialPickups: PickupWithDonation[];
  profileLat?: number;
  profileLng?: number;
  profileRadiusKm: number;
};

const RADIUS_OPTIONS = [10, 25, 50] as const;

export function AvailablePickupsClient({
  initialPickups,
  profileLat,
  profileLng,
  profileRadiusKm,
}: AvailablePickupsClientProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [radiusKm, setRadiusKm] = useState(profileRadiusKm);
  const [sortBy, setSortBy] = useState<"distance" | "expiry">("distance");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    profileLat != null && profileLng != null ? { lat: profileLat, lng: profileLng } : null
  );
  const [geoError, setGeoError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...initialPickups];

    if (radiusKm > 0 && coords) {
      list = list.filter((p) => {
        if (p.distanceMeters == null) return true;
        return p.distanceMeters <= radiusKm * 1000;
      });
    }

    if (sortBy === "distance") {
      list.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
    } else {
      list = sortByUrgency(list);
    }

    return list;
  }, [initialPickups, radiusKm, coords, sortBy]);

  const useMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError("Could not get your location. Using profile location instead.")
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Available Pickups</h1>
          <p className="font-medium text-muted">Open donations ready for pickup near you.</p>
        </div>
        <div className="flex w-fit items-center rounded-xl bg-accent-hover p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
          >
            <ListIcon size={16} /> List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${viewMode === "map" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
          >
            <MapIcon size={16} /> Map
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm font-medium text-muted">
          <MapPin size={16} className="text-brand-coral" />
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="bg-transparent focus:outline-none"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                Radius: {r} km
              </option>
            ))}
          </select>
        </div>
        <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm font-medium text-muted">
          <Search size={16} className="text-muted-soft" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "distance" | "expiry")}
            className="bg-transparent focus:outline-none"
          >
            <option value="distance">Sort by: Distance</option>
            <option value="expiry">Sort by: Expiry</option>
          </select>
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          className="ml-auto flex cursor-pointer items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-2.5 text-sm font-semibold text-brand-coral transition-colors hover:bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/30 dark:hover:bg-orange-950/50"
        >
          <Navigation size={16} />
          Use my location
        </button>
      </div>

      {geoError && <p className="mb-4 text-sm text-brand-coral">{geoError}</p>}

      {viewMode === "map" ? (
        <VolunteerPickupMap
          pickups={filtered}
          userLat={coords?.lat ?? profileLat}
          userLng={coords?.lng ?? profileLng}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="mapPin"
          title="No open pickups right now"
          description="There are currently no active donations matching your filters. Check back later or try expanding your search radius!"
          buttonText="Update profile"
          buttonHref="/volunteer/profile"
          colorTheme="stone"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((pickup) => (
            <PickupCard key={pickup.id} pickup={pickup} showAccept />
          ))}
        </div>
      )}
    </div>
  );
}