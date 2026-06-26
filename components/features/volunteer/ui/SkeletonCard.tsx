export function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center">
      <div className="h-14 w-14 shrink-0 rounded-xl bg-border" />
      <div className="w-full flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-1/3 rounded bg-border" />
          <div className="h-4 w-20 rounded bg-accent-hover" />
        </div>
        <div className="h-4 w-1/4 rounded bg-accent-hover" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded bg-accent-hover" />
          <div className="h-6 w-24 rounded bg-accent-hover" />
        </div>
      </div>
      <div className="mt-4 h-10 w-full rounded-xl bg-border md:mt-0 md:w-24" />
    </div>
  );
}