import Link from "next/link";
import { Clock, MapPin, Navigation } from "lucide-react";
import { TaskStatusButton } from "@/components/features/volunteer/pickups/TaskStatusButton";
import { PickupFoodIcon } from "@/components/features/volunteer/pickups/PickupFoodIcon";
import { PortalCard } from "@/components/features/volunteer/portal/PortalCard";
import { formatDistance } from "@/lib/geo/distance";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import {
  formatExpiresIn,
  formatPickupWindow,
  getDonorLabel,
  getUrgency,
} from "@/lib/volunteer/pickup-ui";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  pickup: PickupWithDonation;
};

export function TaskCard({ pickup }: TaskCardProps) {
  const urgency = getUrgency(pickup.expiresAt);
  const isHighUrgency = urgency === "high";

  return (
    <PortalCard
      variant="solid"
      className="relative overflow-hidden p-6 transition-all hover:border-brand-coral/50 hover:shadow-md"
    >
      {isHighUrgency && <div className="absolute left-0 top-0 h-1 w-full bg-red-500" aria-hidden />}

      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border",
            isHighUrgency ? "bg-orange-50 dark:bg-orange-950/40" : "bg-card-muted"
          )}
        >
          <PickupFoodIcon foodType={pickup.foodType} />
        </div>

        <div className="w-full flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-lg font-bold text-foreground">{pickup.title}</h4>
            {isHighUrgency && (
              <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <Clock size={12} aria-hidden /> Expires in {formatExpiresIn(pickup.expiresAt)}
              </span>
            )}
          </div>
          <p className="mb-3 text-sm font-medium text-muted">{getDonorLabel(pickup)}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
            {pickup.distanceMeters != null && (
              <span className="flex items-center gap-1.5 rounded-lg border border-border bg-accent-hover px-3 py-1.5">
                <Navigation size={14} className="text-blue-500" aria-hidden />{" "}
                {formatDistance(pickup.distanceMeters)}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-accent-hover px-3 py-1.5">
              <Clock size={14} className="text-orange-500" aria-hidden />{" "}
              {formatPickupWindow(pickup.expiresAt)}
            </span>
            <span className="flex max-w-[200px] items-center gap-1.5 truncate rounded-lg border border-border bg-accent-hover px-3 py-1.5">
              <MapPin size={14} className="text-muted-soft" aria-hidden /> {pickup.pickupAddress}
            </span>
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto">
          {pickup.status === "assigned" && (
            <TaskStatusButton pickupId={pickup.id} status="assigned" />
          )}
          {pickup.status === "in_transit" && (
            <TaskStatusButton pickupId={pickup.id} status="in_transit" />
          )}
          <Link
            href={`/volunteer/pickups/${pickup.id}`}
            className="py-2 text-center text-xs font-semibold text-muted transition-colors hover:text-foreground"
          >
            View details
          </Link>
        </div>
      </div>
    </PortalCard>
  );
}