import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { ClaimWithDonation } from "@/lib/mappers/donation";

export function ClaimsList({ claims }: { claims: ClaimWithDonation[] }) {
  if (claims.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        No claims yet. Browse available donations to claim food for your community.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <Card key={claim.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base">{claim.donationTitle}</CardTitle>
              <Badge variant="default">{claim.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted">
            <p>{claim.pickupAddress}</p>
            <p>Donation status: {claim.donationStatus}</p>
            {claim.notes && <p>Notes: {claim.notes}</p>}
            <p>Claimed {formatDate(claim.createdAt)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}