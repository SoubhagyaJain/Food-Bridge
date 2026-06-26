import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonorStats } from "@/server/queries/stats.queries";

export function DonorDashboardStats({ stats }: { stats: DonorStats }) {
  const items = [
    { label: "Active donations", value: stats.active },
    { label: "Claimed", value: stats.claimed },
    { label: "Delivered", value: stats.delivered },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}