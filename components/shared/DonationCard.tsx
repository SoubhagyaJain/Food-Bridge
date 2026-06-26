import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Donation } from "@/types/donation";

type DonationCardProps = {
  donation: Donation;
  href?: string;
};

export function DonationCard({ donation, href }: DonationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{donation.title}</CardTitle>
          <StatusBadge status={donation.status} />
        </div>
      </CardHeader>
      {donation.photoUrl && (
        <div className="relative mx-6 mb-2 aspect-video overflow-hidden rounded-lg">
          <Image
            src={donation.photoUrl}
            alt={donation.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      <CardContent className="space-y-2 text-sm text-muted">
        <p>{donation.foodType} · {donation.quantity} {donation.unit}</p>
        <p>{donation.pickupAddress}</p>
        <p>Expires {formatDate(donation.expiresAt)}</p>
      </CardContent>
      {href && (
        <CardFooter>
          <Link href={href} className="text-sm font-medium text-brand-sage hover:underline">
            View details
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}