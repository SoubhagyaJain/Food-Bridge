import Link from "next/link";
import { MaterialIcon } from "@/components/features/marketing/MaterialIcon";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/auth/roles";
import { ROLES, type Role } from "@/lib/constants";
import { typeBody, typeHeadline } from "@/lib/typography";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<Role, string> = {
  donor: "storefront",
  ngo: "diversity_3",
  volunteer: "local_shipping",
};

export function RoleLoginPicker() {
  return (
    <div className="auth-role-grid">
      {ROLES.map((role) => (
        <Link
          key={role}
          href={`/login?role=${role}`}
          className="auth-glass-card auth-role-card group flex h-full w-full flex-col items-center justify-start rounded-xl p-8 text-center"
        >
          <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-transform duration-300 group-hover:scale-110">
            <MaterialIcon name={ROLE_ICONS[role]} className="text-3xl" />
          </div>
          <h2
            className={cn(
              "mb-3 min-h-[2.25rem] shrink-0 text-primary dark:text-white",
              typeHeadline
            )}
          >
            {ROLE_LABELS[role]}
          </h2>
          <p className={cn(typeBody, "flex-1 text-balance leading-relaxed")}>
            {ROLE_DESCRIPTIONS[role]}
          </p>
        </Link>
      ))}
    </div>
  );
}