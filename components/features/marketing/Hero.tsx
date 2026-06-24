import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex h-[600px] items-center justify-center overflow-hidden md:h-[650px]">
      <Image
        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
        alt="Community coming together to help with food donations"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative z-10 max-w-4xl px-6 text-center text-white">
        <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          When We Come Together,
          <br />
          <span className="text-[#F4A261]">No One Goes Hungry</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90 md:text-xl">
          FoodBridge connects people who have extra food with those who need it — through compassion
          and community.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-brand-coral px-8 py-3.5 font-semibold text-white transition-colors hover:bg-brand-coral-hover"
          >
            Donate Now
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white/90 px-8 py-3.5 font-semibold text-[#3D2B1F] transition-colors hover:bg-white"
          >
            Become a Volunteer
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/80">
          Join 500+ volunteers making a difference every week
        </p>
      </div>

      <a
        href="#how-it-works"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:flex"
        aria-label="Scroll to explore"
      >
        <div className="flex flex-col items-center text-sm text-white/70 transition-colors hover:text-white">
          <span>Scroll to explore</span>
          <svg
            className="mt-1 h-5 w-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </a>
    </section>
  );
}