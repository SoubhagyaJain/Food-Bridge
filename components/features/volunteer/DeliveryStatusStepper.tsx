import { cn } from "@/lib/utils";

const STEPS = [
  { key: "assigned", label: "Accepted" },
  { key: "in_transit", label: "Picked up" },
  { key: "delivered", label: "Delivered" },
] as const;

const STATUS_ORDER: Record<string, number> = {
  open: -1,
  assigned: 0,
  in_transit: 1,
  delivered: 2,
  cancelled: -1,
};

export function DeliveryStatusStepper({ status }: { status: string }) {
  const currentIndex = STATUS_ORDER[status] ?? -1;

  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((step, index) => {
        const isComplete = currentIndex > index;
        const isCurrent = currentIndex === index;

        return (
          <li key={step.key} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  isComplete && "bg-brand-sage text-white",
                  isCurrent && "border-2 border-brand-sage bg-brand-sage/10 text-brand-sage",
                  !isComplete && !isCurrent && "border border-border bg-accent-hover text-muted"
                )}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent ? "text-brand-sage" : "text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-4 h-0.5 flex-1",
                  currentIndex > index ? "bg-brand-sage" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}