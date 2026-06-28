import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeliveryStatusStepper } from "@/components/features/volunteer/DeliveryStatusStepper";
import { PickupDetailActions } from "@/components/features/volunteer/PickupDetailActions";
import { PickupStatusBadge } from "@/components/features/volunteer/PickupStatusBadge";
import { PickupLocationMap } from "@/components/features/volunteer/maps/PickupLocationMap";
import { VolunteerPageShell } from "@/components/features/volunteer/portal/VolunteerPageShell";
import { Map } from "@/components/shared/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentProfile } from "@/lib/auth/session";
import { getPickupById } from "@/server/queries/pickup.queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PickupDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const pickup = await getPickupById(id);
  if (!pickup) notFound();

  const hasCoords = pickup.pickupLat != null && pickup.pickupLng != null;

  return (
    <VolunteerPageShell variant="solid" contentClassName="max-w-3xl space-y-6 pt-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/volunteer/pickups">← Back</Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{pickup.title}</h1>
          <p className="mt-1 text-muted">{pickup.pickupAddress}</p>
        </div>
        <PickupStatusBadge status={pickup.status} />
      </div>

      {pickup.status !== "open" && pickup.status !== "delivered" && (
        <DeliveryStatusStepper status={pickup.status} />
      )}

      {pickup.photoUrl && (
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={pickup.photoUrl}
            alt={pickup.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Donation details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          {pickup.description && <p>{pickup.description}</p>}
          <p>
            {pickup.foodType} · {pickup.quantity} {pickup.unit}
          </p>
          {pickup.expiresAt && <p>Expires {formatDate(pickup.expiresAt)}</p>}
          {pickup.assignedAt && <p>Accepted {formatDate(pickup.assignedAt)}</p>}
          {pickup.pickedUpAt && <p>Picked up {formatDate(pickup.pickedUpAt)}</p>}
          {pickup.deliveredAt && <p>Delivered {formatDate(pickup.deliveredAt)}</p>}
        </CardContent>
      </Card>

      {pickup.ngo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">NGO contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{pickup.ngo.organizationName}</p>
            <p className="text-muted">{pickup.ngo.contactName}</p>
            {pickup.ngo.phone && (
              <p>
                <a href={`tel:${pickup.ngo.phone}`} className="text-brand-sage hover:underline">
                  {pickup.ngo.phone}
                </a>
              </p>
            )}
            <p>
              <a href={`mailto:${pickup.ngo.email}`} className="text-brand-sage hover:underline">
                {pickup.ngo.email}
              </a>
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Pickup location</h2>
        {hasCoords ? (
          <PickupLocationMap pickup={pickup} className="min-h-[280px]" />
        ) : (
          <Map address={pickup.pickupAddress} className="min-h-[280px]" />
        )}
      </div>

      {pickup.status !== "delivered" && pickup.status !== "cancelled" && (
        <PickupDetailActions
          pickupId={pickup.id}
          status={pickup.status}
          volunteerId={pickup.volunteerId}
          currentUserId={profile.id}
        />
      )}
    </VolunteerPageShell>
  );
}