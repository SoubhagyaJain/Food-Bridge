import Link from "next/link";
import { requireProfile } from "@/lib/auth/session";
import { getDonorStats } from "@/server/queries/stats.queries";
import { DonorDashboardStats } from "@/components/features/donor/DonorDashboardStats";
import { Button } from "@/components/ui/button";

export default async function DonorDashboardPage() {
  const profile = await requireProfile();
  const stats = await getDonorStats(profile.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
          <p className="mt-1 text-muted">Welcome back, {profile.fullName}</p>
        </div>
        <Button asChild>
          <Link href="/donor/donations/new">Post new donation</Link>
        </Button>
      </div>
      <DonorDashboardStats stats={stats} />
    </div>
  );
}