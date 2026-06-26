"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  CheckCircle,
  Clock,
  Coffee,
  Leaf,
  MapPin,
  Navigation,
  ShoppingBag,
} from "lucide-react";
import { completePickupAction, markPickedUpAction } from "@/server/actions/volunteer.actions";
import { formatDistance } from "@/lib/geo/distance";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import {
  formatExpiresIn,
  formatPickupWindow,
  getDonorLabel,
  getFoodCategory,
  getUrgency,
} from "@/lib/volunteer/pickup-ui";

type TaskCardProps = {
  pickup: PickupWithDonation;
};

function FoodIcon({ foodType }: { foodType?: string }) {
  const category = getFoodCategory(foodType);
  if (category === "bakery") return <Coffee size={20} className="text-brand-coral" />;
  if (category === "produce") return <Leaf size={20} className="text-green-600 dark:text-green-400" />;
  return <ShoppingBag size={20} className="text-blue-600 dark:text-blue-400" />;
}

export function TaskCard({ pickup }: TaskCardProps) {
  const [pending, startTransition] = useTransition();
  const urgency = getUrgency(pickup.expiresAt);
  const isHighUrgency = urgency === "high";

  const handlePickedUp = () => {
    startTransition(async () => {
      await markPickedUpAction(pickup.id);
    });
  };

  const handleDelivered = () => {
    startTransition(async () => {
      await completePickupAction(pickup.id);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-brand-coral/50 hover:shadow-md">
      {isHighUrgency && <div className="absolute left-0 top-0 h-1 w-full bg-red-500" />}

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border ${isHighUrgency ? "bg-orange-50 dark:bg-orange-950/40" : "bg-card-muted"}`}
        >
          <FoodIcon foodType={pickup.foodType} />
        </div>

        <div className="w-full flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-lg font-bold text-foreground">{pickup.title}</h4>
            {isHighUrgency && (
              <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <Clock size={12} /> Expires in {formatExpiresIn(pickup.expiresAt)}
              </span>
            )}
          </div>
          <p className="mb-3 text-sm font-medium text-muted">{getDonorLabel(pickup)}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
            {pickup.distanceMeters != null && (
              <span className="flex items-center gap-1.5 rounded-lg border border-border bg-accent-hover px-3 py-1.5">
                <Navigation size={14} className="text-blue-500" />{" "}
                {formatDistance(pickup.distanceMeters)}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-accent-hover px-3 py-1.5">
              <Clock size={14} className="text-orange-500" /> {formatPickupWindow(pickup.expiresAt)}
            </span>
            <span className="flex max-w-[200px] items-center gap-1.5 truncate rounded-lg border border-border bg-accent-hover px-3 py-1.5">
              <MapPin size={14} className="text-muted-soft" /> {pickup.pickupAddress}
            </span>
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto">
          {pickup.status === "assigned" && (
            <button
              type="button"
              onClick={handlePickedUp}
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-sage/90 hover:shadow-md disabled:opacity-60"
            >
              <CheckCircle size={18} /> Mark Picked Up
            </button>
          )}
          {pickup.status === "in_transit" && (
            <button
              type="button"
              onClick={handleDelivered}
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-sage/90 hover:shadow-md disabled:opacity-60"
            >
              <CheckCircle size={18} /> Mark Delivered
            </button>
          )}
          <Link
            href={`/volunteer/pickups/${pickup.id}`}
            className="py-2 text-center text-xs font-semibold text-muted transition-colors hover:text-foreground"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}