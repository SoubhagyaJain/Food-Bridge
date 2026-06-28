import { cn } from "@/lib/utils";

type RouteLoaderProps = {
  variant?: "marketing" | "dashboard" | "auth" | "compact";
  label?: string;
};

export function RouteLoader({ variant = "marketing", label = "Loading" }: RouteLoaderProps) {
  if (variant === "auth") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="route-loader-pulse font-script text-3xl text-primary/80">{label}…</div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="space-y-6 p-6 md:p-10">
        <div className="route-loader-shimmer h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="route-loader-shimmer h-32 rounded-xl" />
          ))}
        </div>
        <div className="route-loader-shimmer h-64 rounded-xl" />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-4 px-6 py-10">
        <div className="route-loader-shimmer h-8 w-56 rounded-lg" />
        <div className="route-loader-shimmer h-40 rounded-xl" />
        <div className="route-loader-shimmer h-24 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-6 px-6 py-16",
        "bg-background"
      )}
    >
      <div className="route-loader-pulse font-script text-4xl lowercase tracking-widest text-primary">
        foodbridge
      </div>
      <div className="route-loader-shimmer h-2 w-40 rounded-full" />
      <p className="font-sans text-sm text-on-surface-variant">{label}…</p>
    </div>
  );
}