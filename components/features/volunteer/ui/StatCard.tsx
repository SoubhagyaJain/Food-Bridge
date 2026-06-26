type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:min-h-[8rem] sm:p-5 md:p-6">
      <span className="line-clamp-2 text-xs font-medium leading-snug text-muted sm:text-sm">{label}</span>
      <span className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {value}
      </span>
    </div>
  );
}