import { PortalCard } from "@/components/features/volunteer/portal/PortalCard";
import { SkeletonCard } from "@/components/features/volunteer/ui/SkeletonCard";

export function DashboardStatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <PortalCard key={i} variant="glass" className="flex min-h-[8rem] animate-pulse flex-col justify-between p-5">
          <div className="h-4 w-2/3 rounded bg-border" />
          <div className="h-8 w-1/2 rounded bg-border" />
        </PortalCard>
      ))}
    </div>
  );
}

export function UrgentPickupsSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse px-4 pb-12 pt-6 md:px-8">
      <div className="mb-8 h-10 w-64 rounded-lg bg-border" />
      <div className="mb-4 h-5 w-96 max-w-full rounded bg-accent-hover" />
      <DashboardStatsSkeleton />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="h-48 rounded-2xl bg-border lg:col-span-2" />
        <div className="h-64 rounded-2xl bg-border" />
      </div>
    </div>
  );
}

export function PickupsPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse px-4 pb-12 pt-6 md:px-8">
      <div className="mb-8 h-10 w-72 rounded-lg bg-border" />
      <div className="mb-6 h-24 rounded-2xl bg-border" />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div
      className="flex min-h-[400px] animate-pulse items-center justify-center rounded-2xl border border-border bg-card-muted"
      aria-busy="true"
      aria-label="Loading map"
    />
  );
}