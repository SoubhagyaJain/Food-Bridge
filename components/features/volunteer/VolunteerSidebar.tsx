"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { History, Home, ListTodo, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/volunteer/dashboard", icon: Home },
  { label: "Available Pickups", href: "/volunteer/pickups", icon: MapPin },
  { label: "My Tasks", href: "/volunteer/tasks", icon: ListTodo },
  { label: "History", href: "/volunteer/history", icon: History },
  { label: "Profile", href: "/volunteer/profile", icon: User },
] as const;

type VolunteerSidebarProps = {
  userInitial: string;
};

function NavLinks({ userInitial, onNavigate }: { userInitial: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="mt-4 flex-1 space-y-2 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/volunteer/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "volunteer-nav-link flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "is-active bg-[#EAF1EB] text-[#2C5E3B] dark:bg-brand-sage/25 dark:text-[#8fd4a8]"
                  : "text-[#544341] hover:bg-accent-hover hover:text-[#201a1a] dark:text-[#e8e0d8] dark:hover:bg-accent-hover dark:hover:text-[#f5f0e8]"
              )}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-[#2C5E3B] dark:text-[#8fd4a8]"
                    : "text-[#877270] dark:text-[#c9bfb3]"
                }
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/volunteer/profile"
          onClick={onNavigate}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground font-bold text-background transition-colors hover:bg-foreground/90"
        >
          {userInitial}
        </Link>
      </div>
    </>
  );
}

export function VolunteerSidebar({ userInitial }: VolunteerSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-sage text-white shadow-lg md:hidden"
        aria-label="Open navigation"
      >
        ☰
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        aria-label="Volunteer navigation"
        className={cn(
          "volunteer-nav fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 p-6">
          <Link
            href="/volunteer/dashboard"
            className="volunteer-nav-logo text-2xl font-bold tracking-tight text-brand-coral"
          >
            foodbridge
          </Link>
        </div>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <span className="text-sm font-semibold text-[#201a1a] dark:text-[#f5f0e8]">Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-2 py-1 text-[#544341] hover:bg-accent-hover hover:text-[#201a1a] dark:text-[#e8e0d8] dark:hover:text-[#f5f0e8]"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <NavLinks userInitial={userInitial} onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}