import Link from "next/link";
import { requireProfile } from "@/lib/auth/session";
import { getNgoDashboardStats } from "@/server/queries/stats.queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NgoDashboardPage() {
  const profile = await requireProfile();
  const stats = await getNgoDashboardStats(profile.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        <p className="mt-1 text-muted">Welcome back, {profile.fullName}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">Available donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">Your claims</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.claims}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/ngo/donations">Browse donations</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/ngo/claims">View claims</Link>
        </Button>
      </div>
    </div>
  );
}