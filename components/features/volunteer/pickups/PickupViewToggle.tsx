"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { List as ListIcon, Map as MapIcon } from "lucide-react";
import type { PickupSearchParams } from "@/lib/volunteer/pickup-search-params";
import { pickupSearchToString } from "@/lib/volunteer/pickup-search-params";

type PickupViewToggleProps = {
  params: PickupSearchParams;
};

export function PickupViewToggle({ params }: PickupViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const setView = useCallback(
    (view: PickupSearchParams["view"]) => {
      const query = pickupSearchToString({ ...params, view });
      startTransition(() => router.push(`${pathname}?${query}`, { scroll: false }));
    },
    [params, pathname, router]
  );

  return (
    <div
      className="flex w-fit items-center rounded-xl bg-accent-hover p-1"
      role="radiogroup"
      aria-label="View mode"
    >
      <button
        type="button"
        role="radio"
        aria-checked={params.view === "list"}
        onClick={() => setView("list")}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${params.view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
      >
        <ListIcon size={16} aria-hidden /> List
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={params.view === "map"}
        onClick={() => setView("map")}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${params.view === "map" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
      >
        <MapIcon size={16} aria-hidden /> Map
      </button>
    </div>
  );
}