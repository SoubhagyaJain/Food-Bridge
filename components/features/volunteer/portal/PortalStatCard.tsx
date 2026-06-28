import { PortalCard } from "@/components/features/volunteer/portal/PortalCard";

type PortalStatCardProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

export function PortalStatCard({ label, value, icon }: PortalStatCardProps) {
  return (
    <PortalCard
      variant="glass"
      className="flex min-h-[7.5rem] flex-col justify-between p-4 sm:min-h-[8rem] sm:p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="line-clamp-2 text-xs font-semibold leading-snug text-on-surface-variant dark:text-white sm:text-sm">
          {label}
        </span>
        {icon}
      </div>
      <span className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {value}
      </span>
    </PortalCard>
  );
}