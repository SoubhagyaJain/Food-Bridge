import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";
import { MARKETING_NAV } from "@/lib/navigation";

const linkClass = "text-muted transition-colors hover:text-brand-sage";

export function MarketingFooter() {
  return (
    <footer id="contact" className="border-t border-border-soft bg-card-muted pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4">
              <Wordmark size="footer" />
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Bridging the gap between surplus food and those who need it most.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {MARKETING_NAV.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Get Involved</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className={linkClass}>Donate Food</Link></li>
              <li><Link href="/login" className={linkClass}>Become a Volunteer</Link></li>
              <li><Link href="#contact" className={linkClass}>Partner with Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="mailto:hello@foodbridge.org" className={linkClass}>hello@foodbridge.org</a></li>
              <li><a href="tel:+919876543210" className={linkClass}>+91 98765 43210</a></li>
              <li>Bhopal, Madhya Pradesh, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-border-soft pt-8 text-sm text-muted-soft md:flex-row">
          <p>&copy; 2026 foodbridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}