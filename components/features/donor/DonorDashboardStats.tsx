import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonorStats } from "@/server/queries/stats.queries";
import { typeStat, typeStatLabel } from "@/lib/typography";
import { cn } from "@/lib/utils";

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
            <CardTitle className={typeStatLabel}>{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-3xl", typeStat)}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}