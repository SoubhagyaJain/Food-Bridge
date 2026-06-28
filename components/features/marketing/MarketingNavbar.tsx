"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ROLE_ROUTE_PREFIX, type Role } from "@/lib/constants";
import { MARKETING_NAV } from "@/lib/navigation";
import {
  mktNavLogo,
  mktNavLogoOnBar,
  mktNavText,
  mktNavTextOnBar,
} from "@/lib/marketing/typography";
import { MaterialIcon } from "./MaterialIcon";
import { MarketingMobileMenu } from "./MarketingMobileMenu";
import { ProfileMenu } from "./ProfileMenu";
import { cn } from "@/lib/utils";

type MarketingNavbarProps = {
  user?: {
    fullName: string;
    role: Role;
  } | null;
};

export function MarketingNavbar({ user }: MarketingNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const listSurplusHref = user?.role === "donor" ? "/donor/donations/new" : "/login";
  const dashboardHref = user ? `${ROLE_ROUTE_PREFIX[user.role]}/dashboard` : "/login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isBlogPage = pathname === "/blog" || pathname.startsWith("/blog/");
  const useHeroNav = !isBlogPage;
  const onScrolledBar = useHeroNav && scrolled;

  const resolveNavHref = (label: string, href: string) => {
    if (label === "Home") return pathname === "/" ? "/#home" : "/";
    return href;
  };

  const isActive = (label: string, href: string) => {
    const resolved = resolveNavHref(label, href);
    if (resolved.startsWith("/#")) return pathname === "/";
    return pathname === resolved || pathname.startsWith(`${resolved}/`);
  };

  return (
    <header
      className={cn(
        "site-nav fixed left-0 top-0 z-50 w-full py-3 transition-all duration-300",
        isBlogPage && "blog-nav",
        useHeroNav && !scrolled && "bg-transparent",
        useHeroNav && scrolled && "header-scrolled"
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-margin-mobile md:flex-row md:px-margin-desktop">
        <Link
          href="/"
          className={cn(
            "transition-opacity hover:opacity-80",
            isBlogPage ? "blog-nav-logo font-script text-4xl lowercase tracking-widest" : onScrolledBar ? mktNavLogoOnBar : mktNavLogo
          )}
        >
          FoodBridge
        </Link>

        <nav
          className={cn(
            "ml-0 flex w-full flex-1 items-center justify-between md:ml-gutter",
            !isBlogPage && (onScrolledBar ? mktNavTextOnBar : mktNavText)
          )}
        >
          <div className="hidden items-center gap-gutter lg:flex">
            {MARKETING_NAV.map((item) => {
              const href = resolveNavHref(item.label, item.href);

              return (
                <Link
                  key={item.label}
                  href={href}
                  prefetch
                  className={cn(
                    "transition-colors duration-200",
                    isBlogPage && "blog-nav-link border-b-2 border-transparent pb-0.5",
                    !isBlogPage &&
                      (onScrolledBar
                        ? "hover:text-white dark:hover:text-hero-nav"
                        : "hover:text-on-surface dark:hover:text-hero-nav"),
                    isBlogPage && isActive(item.label, item.href) && "is-active",
                    !isBlogPage &&
                      isActive(item.label, item.href) &&
                      (onScrolledBar
                        ? "font-semibold text-white underline-offset-4 dark:text-hero-nav"
                        : "font-semibold text-primary underline-offset-4 dark:text-hero-nav")
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <Link
              href={listSurplusHref}
              className="hover-shimmer hidden rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase tracking-wider text-on-primary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#700016] sm:inline-block"
            >
              List Surplus Food
            </Link>

            <button
              type="button"
              aria-label="Notifications"
              className={cn(
                "hidden items-center transition-colors sm:flex",
                isBlogPage
                  ? "blog-nav-icon"
                  : onScrolledBar
                    ? "text-white/90 hover:text-white dark:text-hero-nav-muted dark:hover:text-hero-nav"
                    : "text-on-surface-variant hover:text-on-surface dark:text-hero-nav-muted dark:hover:text-hero-nav"
              )}
            >
              <MaterialIcon name="notifications" className="text-xl" />
            </button>

            <ProfileMenu isBlogPage={isBlogPage} onScrolledBar={onScrolledBar} user={user} dashboardHref={dashboardHref} />

            {!isBlogPage && (
              <ThemeToggle
                variant="marketing"
                className={
                  onScrolledBar
                    ? "border-white/40 bg-white/10 text-white hover:bg-white/20 dark:border-hero-nav-border dark:bg-hero-nav/10 dark:text-hero-nav dark:hover:bg-hero-nav/20"
                    : "border-outline-variant bg-surface-container-low/90 text-on-surface-variant hover:bg-surface-container-high dark:border-hero-nav-border dark:bg-hero-nav/10 dark:text-hero-nav dark:hover:bg-hero-nav/20"
                }
              />
            )}

            <button
              type="button"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border transition-colors lg:hidden",
                isBlogPage
                  ? "blog-nav-menu-btn"
                  : onScrolledBar
                    ? "border-white/40 text-white/90 hover:bg-white/20 hover:text-white dark:border-hero-nav-border dark:text-hero-nav-muted dark:hover:bg-hero-nav/10 dark:hover:text-hero-nav"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface dark:border-hero-nav-border dark:text-hero-nav-muted dark:hover:bg-hero-nav/10 dark:hover:text-hero-nav"
              )}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <MarketingMobileMenu
          isBlogPage={isBlogPage}
          user={user}
          dashboardHref={dashboardHref}
          listSurplusHref={listSurplusHref}
          resolveNavHref={resolveNavHref}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}