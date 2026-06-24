import Image from "next/image";
import Link from "next/link";

export function HeroCards() {
  return (
    <section id="programs" className="relative z-30 mx-auto -mt-16 max-w-7xl scroll-mt-24 px-6 pb-20 md:px-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex min-h-[220px] flex-col justify-between rounded-2xl bg-[#e8d9b8] p-8 md:p-9">
          <p className="text-xl font-semibold leading-snug text-[#3f2e1e]">
            Today is the day to reach out and lend a helping hand.
          </p>
          <Link href="/login" className="mt-6 w-fit rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#3f2e1e] transition-colors hover:bg-[#3f2e1e] hover:text-white">
            Donate
          </Link>
        </div>

        <div className="relative flex min-h-[220px] items-end overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2070"
            alt="Child sitting outdoors"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 p-8 text-white md:p-9">
            <p className="mb-6 text-xl font-semibold leading-snug">
              Even the smallest of donations can help change a life.
            </p>
            <Link href="/login" className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90">
              Donate
            </Link>
          </div>
        </div>

        <div className="flex min-h-[220px] flex-col justify-between rounded-2xl bg-brand-sage p-8 text-white md:p-9">
          <p className="text-xl font-semibold leading-snug">
            Become a volunteer.
            <br />
            You&apos;ll feel the benefits instantly.
          </p>
          <Link href="/login" className="mt-6 w-fit rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#2e5c42] hover:bg-white/90">
            Donate
          </Link>
        </div>
      </div>
    </section>
  );
}