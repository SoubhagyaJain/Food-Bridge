"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { MARKETING_NAV } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MarketingMobileMenuProps = {
  isBlogPage: boolean;
  user: { fullName: string; role: string } | null | undefined;
  dashboardHref: string;
  listSurplusHref: string;
  resolveNavHref: (label: string, href: string) => string;
  onClose: () => void;
};

export function MarketingMobileMenu({
  isBlogPage,
  user,
  dashboardHref,
  listSurplusHref,
  resolveNavHref,
  onClose,
}: MarketingMobileMenuProps) {
  return (
    <nav
      className={cn(
        "mx-4 mt-2 rounded-lg border px-4 py-4 backdrop-blur-lg lg:hidden",
        isBlogPage
          ? "border-outline-variant/30 bg-[#2a2424]/95"
          : "border-outline-variant bg-surface-container-highest/95"
      )}
    >
      <ul className="space-y-2">
        {MARKETING_NAV.map((item) => (
          <li key={item.label}>
            <Link
              href={resolveNavHref(item.label, item.href)}
              prefetch
              onClick={onClose}
              className={cn(
                "block py-2 text-xs font-medium uppercase tracking-widest",
                isBlogPage
                  ? "blog-nav-link"
                  : "text-on-surface-variant hover:text-on-surface dark:text-hero-nav-muted dark:hover:text-hero-nav"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}

        {user && (
          <li>
            <Link
              href={dashboardHref}
              onClick={onClose}
              className={cn(
                "block py-2 text-xs font-medium uppercase tracking-widest",
                isBlogPage
                  ? "blog-nav-link"
                  : "text-on-surface-variant hover:text-on-surface dark:text-hero-nav-muted dark:hover:text-hero-nav"
              )}
            >
              Dashboard
            </Link>
          </li>
        )}
        <li>
          {user ? (
            <LogoutButton
              onClick={onClose}
              className={cn(
                "block w-full py-2 text-left text-xs font-medium uppercase tracking-widest",
                isBlogPage ? "blog-nav-link" : "text-error hover:text-error/80"
              )}
            />
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className={cn(
                "block py-2 text-xs font-medium uppercase tracking-widest",
                isBlogPage
                  ? "blog-nav-link"
                  : "text-on-surface-variant hover:text-on-surface dark:text-hero-nav-muted dark:hover:text-hero-nav"
              )}
            >
              Login
            </Link>
          )}
        </li>
        <li className="pt-2">
          <Link
            href={listSurplusHref}
            onClick={onClose}
            className="block rounded-full bg-primary py-2.5 text-center text-xs font-bold uppercase text-white"
          >
            List Surplus Food
          </Link>
        </li>
      </ul>
    </nav>
  );
}