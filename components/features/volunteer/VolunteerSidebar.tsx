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
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#EAF1EB] text-[#2C5E3B] dark:bg-brand-sage/20 dark:text-brand-sage"
                  : "text-muted hover:bg-accent-hover hover:text-foreground"
              )}
            >
              <Icon
                size={18}
                className={isActive ? "text-[#2C5E3B] dark:text-brand-sage" : "text-muted-soft"}
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
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 p-6">
          <Link href="/volunteer/dashboard" className="text-2xl font-bold tracking-tight text-brand-coral">
            foodbridge
          </Link>
        </div>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <span className="text-sm font-semibold">Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-2 py-1 text-muted hover:bg-accent-hover"
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