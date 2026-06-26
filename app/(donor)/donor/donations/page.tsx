import Link from "next/link";
import { requireProfile } from "@/lib/auth/session";
import { getDonationsByDonor } from "@/server/queries/donation.queries";
import { DonationCard } from "@/components/shared/DonationCard";
import { Button } from "@/components/ui/button";

export default async function DonorDonationsPage() {
  const profile = await requireProfile();
  const donations = await getDonationsByDonor(profile.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Donations</h1>
        <Button asChild>
          <Link href="/donor/donations/new">New donation</Link>
        </Button>
      </div>

      {donations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          No donations yet. Post your first donation to get started.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              href={`/donor/donations/${donation.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}