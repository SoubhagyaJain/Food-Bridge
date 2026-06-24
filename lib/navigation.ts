export type MarketingNavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation — keep simple and meaningful. */
export const MARKETING_NAV: MarketingNavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#programs" },
  { label: "Impact", href: "#impact" },
  { label: "Volunteer", href: "/login" },
];