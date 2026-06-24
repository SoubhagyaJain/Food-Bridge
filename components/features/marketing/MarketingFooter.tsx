import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";

const linkClass = "text-[#5C5146] transition-colors hover:text-brand-sage";

export function MarketingFooter() {
  return (
    <footer id="contact" className="border-t border-[#E8E0D5] bg-[#FDF8F3] pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4">
              <Wordmark size="footer" />
            </p>
            <p className="text-sm leading-relaxed text-[#5C5146]">
              Bridging the gap between surplus food and those who need it most.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#3D2B1F]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#home" className={linkClass}>Home</Link></li>
              <li><Link href="#about" className={linkClass}>About Us</Link></li>
              <li><Link href="#programs" className={linkClass}>How It Works</Link></li>
              <li><Link href="#impact" className={linkClass}>Impact Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#3D2B1F]">Get Involved</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className={linkClass}>Donate Food</Link></li>
              <li><Link href="/login" className={linkClass}>Become a Volunteer</Link></li>
              <li><Link href="#contact" className={linkClass}>Partner with Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#3D2B1F]">Contact Us</h4>
            <ul className="space-y-2 text-sm text-[#5C5146]">
              <li><a href="mailto:hello@foodbridge.org" className={linkClass}>hello@foodbridge.org</a></li>
              <li><a href="tel:+919876543210" className={linkClass}>+91 98765 43210</a></li>
              <li>Bhopal, Madhya Pradesh, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-[#E8E0D5] pt-8 text-sm text-[#6B5E52] md:flex-row">
          <p>&copy; 2026 foodbridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}