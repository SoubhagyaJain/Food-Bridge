import { useState } from "react";

export type NavItem = {
  label: string;
  href: string;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#programs" },
  { label: "Impact", href: "#impact" },
  { label: "Volunteer", href: "/login" },
];

function LogoMark() {
  return (
    <svg className="h-11 w-11 shrink-0" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect width="44" height="44" rx="12" fill="#F8F4EF" />
      <path d="M8 28h28" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 28v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4M20 28v-6c0-2.2 1.8-4 4-4s4 1.8 4 4v6"
        stroke="#4a9c6e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M22 14c1.5-2.5 5-2.5 6.5 0" stroke="#D97757" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export type HeaderProps = {
  logoHref?: string;
  loginHref?: string;
  donateHref?: string;
  navItems?: NavItem[];
};

export function Header({
  logoHref = "/",
  loginHref = "/login",
  donateHref = "/login",
  navItems = DEFAULT_NAV,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const linkClass =
    "text-sm font-medium text-[#3D2B1F] transition-colors duration-200 hover:text-[#4a9c6e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a9c6e] rounded-sm cursor-pointer";

  const mobileLinkClass =
    "block rounded-md px-3 py-2.5 text-sm font-medium text-[#3D2B1F] transition-colors duration-200 hover:bg-[#F8F4EF] hover:text-[#4a9c6e] cursor-pointer";

  return (
    <header className="sticky top-0 z-50 border-b border-[#EDE6DC] bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <a
            href={logoHref}
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a9c6e] rounded-sm cursor-pointer"
          >
            <LogoMark />
            <span className="font-serif text-xl font-semibold text-[#3D2B1F]">Food Bridge</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={loginHref}
              className="rounded-full px-5 py-2 text-sm font-medium text-[#3D2B1F] transition-colors duration-200 hover:bg-[#F8F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a9c6e] cursor-pointer"
            >
              Login
            </a>
            <a
              href={donateHref}
              className="rounded-full bg-[#D97757] px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#C45E3E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97757] cursor-pointer"
            >
              Donate Now
            </a>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-[#3D2B1F] hover:bg-[#F8F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4a9c6e] md:hidden cursor-pointer"
            aria-expanded={open}
            aria-controls="mobile-nav"
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
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-[#EDE6DC] bg-white px-6 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={mobileLinkClass} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="flex gap-3 pt-4">
              <a
                href={loginHref}
                className="inline-flex flex-1 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-[#3D2B1F] transition-colors duration-200 hover:bg-[#F8F4EF] cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Login
              </a>
              <a
                href={donateHref}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#D97757] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#C45E3E] cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Donate Now
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}