import Link from "next/link";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/auth/roles";
import { ROLES } from "@/lib/constants";

export function RoleLoginPicker() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Choose how you want to sign in</p>
      <div className="grid gap-3">
        {ROLES.map((role) => (
          <Link
            key={role}
            href={`/login?role=${role}`}
            className="rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-brand-sage hover:bg-brand-sage/5"
          >
            <p className="font-semibold text-foreground">{ROLE_LABELS[role]}</p>
            <p className="mt-1 text-sm text-muted">{ROLE_DESCRIPTIONS[role]}</p>
          </Link>
        ))}
      </div>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-medium text-brand-sage hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}