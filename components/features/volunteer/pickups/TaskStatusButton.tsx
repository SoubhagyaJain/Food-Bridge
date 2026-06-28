"use client";

import { useActionState } from "react";
import { CheckCircle } from "lucide-react";
import {
  completePickupAction,
  markPickedUpAction,
} from "@/server/actions/volunteer.actions";

type TaskStatusButtonProps = {
  pickupId: string;
  status: "assigned" | "in_transit";
};

type ActionState = { error?: string } | null;

export function TaskStatusButton({ pickupId, status }: TaskStatusButtonProps) {
  const action = status === "assigned" ? markPickedUpAction : completePickupAction;
  const label = status === "assigned" ? "Mark Picked Up" : "Mark Delivered";

  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, _formData: FormData): Promise<ActionState> => {
      const result = await action(pickupId);
      return result.error ? { error: result.error } : null;
    },
    null
  );

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-sage/90 hover:shadow-md disabled:opacity-60"
        >
          <CheckCircle size={18} aria-hidden />
          {pending ? "Updating…" : label}
        </button>
      </form>
      {state?.error && (
        <p role="alert" className="mt-1 text-center text-xs text-error">
          {state.error}
        </p>
      )}
    </div>
  );
}