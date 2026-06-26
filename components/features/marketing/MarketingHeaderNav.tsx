"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "@/components/shared/Wordmark";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { ROLE_ROUTE_PREFIX, type Role } from "@/lib/constants";
import { MARKETING_NAV } from "@/lib/navigation";
import { signOutAction } from "@/server/actions/auth.actions";

type MarketingHeaderNavProps = {
  user?: {
    fullName: string;
    role: Role;
  } | null;
};

function primaryCtaForRole(role: Role) {
  if (role === "donor") return { label: "Post Donation", href: "/donor/donations/new" };
  if (role === "ngo") return { label: "Browse Food", href: "/ngo/donations" };
  return { label: "View Pickups", href: "/volunteer/pickups" };
}

export function MarketingHeaderNav({ user }: MarketingHeaderNavProps) {
  const [open, setOpen] = useState(false);
  const isLoggedIn = Boolean(user);
  const dashboardHref = user ? `${ROLE_ROUTE_PREFIX[user.role]}/dashboard` : "/login";
  const cta = user ? primaryCtaForRole(user.role) : { label: "Donate Now", href: "/login" };

  const authLinks = (
    <>
      {isLoggedIn ? (
        <>
          <span className="hidden text-sm text-muted lg:inline">
            {user!.fullName.split(" ")[0]} · {ROLE_LABELS[user!.role]}
          </span>
          <Link
            href={dashboardHref}
            className="rounded-full px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-hover"
          >
            Dashboard
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-hover"
            >
              Logout
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-full px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-hover"
        >
          Login
        </Link>
      )}
      <Link
        href={cta.href}
        className="rounded-full bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-hover"
      >
        {cta.label}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="rounded-sm transition-colors hover:text-brand-coral-hover">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-brand-sage"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {authLinks}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="rounded-md p-2 text-foreground hover:bg-accent-hover"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border px-6 py-4 md:hidden">
          <ul className="space-y-1">
            {MARKETING_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent-hover"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li className="px-3 py-2 text-sm text-muted">
                Signed in as {user!.fullName} ({ROLE_LABELS[user!.role]})
              </li>
            )}
            <li className="flex flex-col gap-2 pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="rounded-full px-5 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent-hover"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="w-full rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-hover"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent-hover"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                href={cta.href}
                className="rounded-full bg-brand-coral px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-coral-hover"
                onClick={() => setOpen(false)}
              >
                {cta.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}