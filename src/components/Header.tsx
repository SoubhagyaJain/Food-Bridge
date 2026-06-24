import { useState } from "react";

export type NavItem = {
  label: string;
  href: string;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Popular Charity", href: "#programs" },
  { label: "Services", href: "#impact" },
  { label: "Contact", href: "#contact" },
];

export type HeaderProps = {
  logoHref?: string;
  donateHref?: string;
  navItems?: NavItem[];
};

export function Header({
  logoHref = "/",
  donateHref = "/login",
  navItems = DEFAULT_NAV,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const linkClass =
    "text-[13px] font-medium text-white/90 transition-colors duration-200 hover:text-[#c5a26f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a26f] rounded-sm cursor-pointer";

  const donateClass =
    "inline-flex shrink-0 items-center justify-center rounded-full bg-[#c5a26f] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#3c2f2f] transition-colors duration-200 hover:bg-[#b08d55] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#3c2f2f] text-white shadow-md">
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between gap-4 px-5 lg:px-8">
        <a
          href={logoHref}
          className="font-serif text-[1.35rem] font-semibold tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a26f] cursor-pointer"
        >
          Food Bridge
        </a>

        <nav
          className="hidden items-center gap-7 xl:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={donateHref} className={`${donateClass} hidden sm:inline-flex`}>
            Donate Now
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c5a26f] xl:hidden cursor-pointer"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-[#3c2f2f] px-5 py-4 xl:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-[#c5a26f] cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href={donateHref} className={`${donateClass} w-full`} onClick={() => setOpen(false)}>
                Donate Now
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}