"use client";

import { useActionState } from "react";
import { ChevronRight } from "lucide-react";
import { acceptPickupAction } from "@/server/actions/volunteer.actions";
import { cn } from "@/lib/utils";

type AcceptPickupButtonProps = {
  pickupId: string;
  className?: string;
  fullWidth?: boolean;
};

type ActionState = { error?: string } | null;

export function AcceptPickupButton({ pickupId, className, fullWidth }: AcceptPickupButtonProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, _formData: FormData): Promise<ActionState> => {
      const result = await acceptPickupAction(pickupId);
      return result.error ? { error: result.error } : null;
    },
    null
  );

  return (
    <div className={cn(fullWidth && "w-full md:w-auto", className)}>
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral disabled:opacity-60 dark:bg-foreground dark:text-background dark:hover:bg-brand-coral",
            fullWidth ? "w-full md:w-auto" : "flex-1 md:flex-none"
          )}
        >
          {pending ? "Claiming…" : "Claim"} <ChevronRight size={16} aria-hidden />
        </button>
      </form>
      {state?.error && (
        <p role="alert" className="mt-1 text-sm text-error">
          {state.error}
        </p>
      )}
    </div>
  );
}