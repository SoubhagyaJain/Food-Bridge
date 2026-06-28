import Link from "next/link";
import { Clock, Info, MapPin } from "lucide-react";
import { AcceptPickupButton } from "@/components/features/volunteer/pickups/AcceptPickupButton";
import { PickupFoodIcon } from "@/components/features/volunteer/pickups/PickupFoodIcon";
import { PortalCard } from "@/components/features/volunteer/portal/PortalCard";
import { formatDistance } from "@/lib/geo/distance";
import type { PickupWithDonation } from "@/lib/mappers/donation";
import {
  formatPickupWindow,
  getDonorLabel,
  getUrgency,
} from "@/lib/volunteer/pickup-ui";
import { cn } from "@/lib/utils";

type PickupListItemProps = {
  pickup: PickupWithDonation;
  showAccept?: boolean;
  variant?: "default" | "dashboard";
};

export function PickupListItem({
  pickup,
  showAccept = false,
  variant = "default",
}: PickupListItemProps) {
  const urgency = getUrgency(pickup.expiresAt);
  const isHighUrgency = urgency === "high";

  return (
    <PortalCard
      variant="solid"
      className="group flex flex-col items-start gap-4 p-5 transition-all hover:shadow-md md:flex-row md:items-center"
    >
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
          isHighUrgency ? "bg-orange-50 dark:bg-orange-950/40" : "bg-card-muted"
        )}
      >
        <PickupFoodIcon foodType={pickup.foodType} />
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
              <Clock size={10} aria-hidden /> Urgent
            </span>
          )}
        </div>
        <p className="mb-2 text-sm text-muted">{getDonorLabel(pickup)}</p>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-soft">
          {pickup.distanceMeters != null && (
            <span className="flex items-center gap-1 rounded-md bg-accent-hover px-2 py-1">
              <MapPin size={12} aria-hidden /> {formatDistance(pickup.distanceMeters)}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-md bg-accent-hover px-2 py-1">
            <Info size={12} aria-hidden /> {formatPickupWindow(pickup.expiresAt)}
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
          <AcceptPickupButton pickupId={pickup.id} fullWidth={variant === "dashboard"} />
        )}
      </div>
    </PortalCard>
  );
}