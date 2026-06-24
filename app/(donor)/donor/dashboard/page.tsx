import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DonorDashboardStats } from "@/components/features/donor/DonorDashboardStats";

export default function DonorDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
          <p className="mt-1 text-muted">Manage your food donations</p>
        </div>
        <Button asChild>
          <Link href="/donor/donations/new">Post new donation</Link>
        </Button>
      </div>
      <DonorDashboardStats />
    </div>
  );
}