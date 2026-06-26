"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  ChevronRight,
  Clock,
  Coffee,
  Info,
  Leaf,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { acceptPickupAction } from "@/server/actions/volunteer.actions";
import { formatDistance } from "@/lib/geo/distance";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import {
  formatPickupWindow,
  getDonorLabel,
  getFoodCategory,
  getUrgency,
} from "@/lib/volunteer/pickup-ui";

type PickupCardProps = {
  pickup: PickupWithDonation;
  showAccept?: boolean;
  variant?: "default" | "dashboard";
};

function FoodIcon({ foodType }: { foodType?: string }) {
  const category = getFoodCategory(foodType);
  if (category === "bakery") return <Coffee size={20} className="text-brand-coral" />;
  if (category === "produce") return <Leaf size={20} className="text-green-600 dark:text-green-400" />;
  return <ShoppingBag size={20} className="text-blue-600 dark:text-blue-400" />;
}

export function PickupCard({ pickup, showAccept = false, variant = "default" }: PickupCardProps) {
  const [pending, startTransition] = useTransition();
  const urgency = getUrgency(pickup.expiresAt);
  const isHighUrgency = urgency === "high";

  const handleAccept = () => {
    startTransition(async () => {
      await acceptPickupAction(pickup.id);
    });
  };

  return (
    <div className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${isHighUrgency ? "bg-orange-50 dark:bg-orange-950/40" : "bg-card-muted"}`}
      >
        <FoodIcon foodType={pickup.foodType} />
      </div>

      <div className="flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Link
            href={`/volunteer/pickups/${pickup.id}`}
            className="font-bold text-foreground transition-colors hover:text-brand-coral"
          >
            {pickup.title}
          </Link>
          {isHighUrgency && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <Clock size={10} /> Urgent
            </span>
          )}
        </div>
        <p className="mb-2 text-sm text-muted">{getDonorLabel(pickup)}</p>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-soft">
          {pickup.distanceMeters != null && (
            <span className="flex items-center gap-1 rounded-md bg-accent-hover px-2 py-1">
              <MapPin size={12} /> {formatDistance(pickup.distanceMeters)}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-md bg-accent-hover px-2 py-1">
            <Info size={12} /> {formatPickupWindow(pickup.expiresAt)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex w-full gap-2 md:mt-0 md:w-auto">
        {variant === "default" && (
          <Link
            href={`/volunteer/pickups/${pickup.id}`}
            className="flex flex-1 items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent-hover md:flex-none"
          >
            Details
          </Link>
        )}
        {showAccept && pickup.status === "open" && (
          <button
            type="button"
            onClick={handleAccept}
            disabled={pending}
            className={`flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-brand-coral disabled:opacity-60 dark:bg-foreground dark:text-background dark:group-hover:bg-brand-coral ${
              variant === "dashboard" ? "w-full md:w-auto" : "flex-1 md:flex-none"
            }`}
          >
            {pending ? "Claiming…" : "Claim"} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}