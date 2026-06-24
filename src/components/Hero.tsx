'use client';

import React from 'react';

function ArrowLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[700px] items-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
        alt="Happy children reaching out - Food Bridge"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-bold leading-[1.05] tracking-[-2px] text-white md:text-7xl lg:text-[82px]">
            Help The <span className="text-[#f4c95f]">Children</span> in Need
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
            Bridging the gap to ensure no child goes hungry. Join us in nourishing futures today.
          </p>

          <div className="mt-8">
            <a
              href="#programs"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              View More
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 p-3 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
        aria-label="Previous slide"
      >
        <ArrowLeftIcon />
      </button>
      <button
        type="button"
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 p-3 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
        aria-label="Next slide"
      >
        <ArrowRightIcon />
      </button>
    </section>
  );
}