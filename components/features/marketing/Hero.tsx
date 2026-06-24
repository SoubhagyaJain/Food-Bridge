import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[700px] items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
        alt="Happy children reaching out - foodbridge"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-[-2px] text-white sm:text-6xl md:text-7xl lg:text-[82px]">
            Help The <span className="text-[#f4c95f]">Children</span> in Need
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
            Bridging the gap to ensure no child goes hungry. Join us in nourishing futures today.
          </p>
          <div className="mt-8">
            <Link
              href="#how-it-works"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}