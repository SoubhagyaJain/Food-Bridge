import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DonorDashboardStats() {
  const stats = [
    { label: "Active donations", value: "0" },
    { label: "Claimed", value: "0" },
    { label: "Delivered", value: "0" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
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