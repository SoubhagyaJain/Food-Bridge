import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/constants";

type NavItem = { label: string; href: string };

const ROLE_NAV: Record<Role, NavItem[]> = {
  donor: [
    { label: "Dashboard", href: "/donor/dashboard" },
    { label: "My Donations", href: "/donor/donations" },
    { label: "Post Donation", href: "/donor/donations/new" },
  ],
  ngo: [
    { label: "Dashboard", href: "/ngo/dashboard" },
    { label: "Browse", href: "/ngo/donations" },
    { label: "Claims", href: "/ngo/claims" },
  ],
  volunteer: [
    { label: "Dashboard", href: "/volunteer/dashboard" },
    { label: "Pickups", href: "/volunteer/pickups" },
  ],
};

export function Navbar({ role }: { role: Role }) {
  const items = ROLE_NAV[role];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link href={`/${role}/dashboard`}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-brand-sage"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Logout</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}