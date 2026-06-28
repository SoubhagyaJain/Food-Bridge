import Link from "next/link";
import { MaterialIcon } from "@/components/features/marketing/MaterialIcon";
import { cn } from "@/lib/utils";
import {
  mktFooterBody,
  mktFooterHeading,
  mktFooterLink,
} from "@/lib/marketing/typography";
import { MARKETING_NAV } from "@/lib/navigation";

const getInvolved = [
  { label: "For Donors", href: "/register?role=donor" },
  { label: "For Volunteers", href: "/register?role=volunteer" },
  { label: "For NGOs", href: "/register?role=ngo" },
  { label: "Partner with Us", href: "/#community" },
] as const;

const company = [
  { label: "About Us", href: "/#how-it-works" },
  { label: "Our Impact", href: "/#impact" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/#cta" },
] as const;

export function MarketingFooter() {
  return (
    <footer
      id="contact"
      className="relative z-20 w-full border-t border-outline-variant/30 bg-surface py-24 text-on-surface dark:text-white"
    >
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="mb-6 font-script text-4xl font-bold lowercase tracking-widest text-primary dark:text-white">
              foodbridge
            </div>
            <p className={mktFooterBody}>
              Connecting surplus food with people who need it — simply and with dignity.
            </p>
          </div>

          <div>
            <h4 className={cn("mb-6", mktFooterHeading)}>Quick Links</h4>
            <ul className="mt-6 space-y-4">
              {MARKETING_NAV.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={mktFooterLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={cn("mb-6", mktFooterHeading)}>Get Involved</h4>
            <ul className="mt-6 space-y-4">
              {getInvolved.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={mktFooterLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={cn("mb-6", mktFooterHeading)}>Company</h4>
            <ul className="mt-6 space-y-4">
              {company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={mktFooterLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={cn("mb-6", mktFooterHeading)}>Contact</h4>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-2">
                <MaterialIcon name="mail" className="text-sm text-primary dark:text-white" />
                <a href="mailto:hello@foodbridge.org" className={mktFooterLink}>
                  hello@foodbridge.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MaterialIcon name="call" className="text-sm text-primary dark:text-white" />
                <a href="tel:+919876543210" className={mktFooterLink}>
                  +91 98765 43210
                </a>
              </li>
              <li className={cn("flex items-center gap-2", mktFooterBody)}>
                <MaterialIcon name="location_on" className="text-sm text-primary dark:text-white" />
                <span>Bhopal, MP</span>
              </li>
              <li className="flex items-center gap-4 pt-2">
                <a href="#" className="text-on-surface-variant transition-colors hover:text-primary dark:text-white dark:hover:text-white/80" aria-label="Instagram">
                  <MaterialIcon name="photo_camera" />
                </a>
                <a href="#" className="text-on-surface-variant transition-colors hover:text-primary dark:text-white dark:hover:text-white/80" aria-label="LinkedIn">
                  <MaterialIcon name="work" />
                </a>
                <a href="#" className="text-on-surface-variant transition-colors hover:text-primary dark:text-white dark:hover:text-white/80" aria-label="Twitter">
                  <MaterialIcon name="close" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 pt-8 md:flex-row">
          <p className="font-sans text-xs font-semibold text-on-surface-variant dark:text-white">
            &copy; 2026 Foodbridge. All rights reserved.
          </p>
          <nav className="flex gap-8 font-button text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-white">
            <Link href="#" className="transition-colors duration-200 hover:text-primary dark:hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors duration-200 hover:text-primary dark:hover:text-white/80">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors duration-200 hover:text-primary dark:hover:text-white/80">
              Refund Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}