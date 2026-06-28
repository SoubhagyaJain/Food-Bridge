export type MarketingNavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation — anchor links resolve on home; blog is a route. */
export const MARKETING_NAV: MarketingNavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Community", href: "/#community" },
  { label: "Impact", href: "/#impact" },
  { label: "Stories", href: "/#stories" },
  { label: "Blog", href: "/blog" },
];