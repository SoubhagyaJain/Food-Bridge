import { EmptyState } from "@/components/features/volunteer/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { getDonorLabel } from "@/lib/volunteer/pickup-ui";
import { getVolunteerHistory } from "@/server/queries/pickup.queries";

export default async function VolunteerHistoryPage() {
  const profile = await requireProfile();
  const history = await getVolunteerHistory(profile.id);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 md:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Delivery History</h1>
        <p className="font-medium text-muted">Your completed food deliveries and lifetime impact.</p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon="heartHandshake"
          title="Your journey starts here!"
          description="Every single delivery feeds someone in need and reduces carbon emissions. Complete your first pickup to start tracking your amazing impact."
          buttonText="Find My First Pickup"
          buttonHref="/volunteer/pickups"
          colorTheme="orange"
        />
      ) : (
        <div className="space-y-4">
          {history.map((pickup) => (
            <div
              key={pickup.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{pickup.title}</h3>
                  <p className="mt-1 text-sm text-muted">{getDonorLabel(pickup)}</p>
                </div>
                <span className="rounded-full bg-brand-sage/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-sage dark:bg-brand-sage/20">
                  Delivered
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                <span>
                  {pickup.foodType} · {pickup.quantity} {pickup.unit}
                </span>
                <span>{pickup.pickupAddress}</span>
                {pickup.deliveredAt && <span>Delivered {formatDate(pickup.deliveredAt)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}