'use client';

import React from 'react';

function HeartIcon() {
  return (
    <svg className="h-6 w-6 text-[#4a9c6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6 text-[#4a9c6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg className="h-6 w-6 text-[#4a9c6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  );
}

export default function BuildingBridgesTogether() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
            alt="Woman embracing a young child - representing care and support"
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </div>

        <div>
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Building Bridges Together
            </h2>
            <p className="mt-3 text-lg font-medium text-[#4a9c6e]">
              We Listen. We Empower. We Nourish.
            </p>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
            <p>
              At Food Bridge, we believe the most powerful change happens when we connect with those who are already transforming their communities. Rather than reinventing the wheel, we partner with local heroes to amplify their impact and bridge the gap between resources and those who need them most.
            </p>
            <p>
              Our heart lies in protecting and nurturing children. Thanks to the deep generosity of our sponsors, we are able to provide more than just financial aid—we deliver hope. From bringing essential humanitarian relief to offering legal advocacy and emotional support, we wrap our arms around vulnerable families worldwide. Whether we are supporting a struggling household or breathing new life into under-resourced schools and kindergartens, our mission remains the same: to build a bridge to a brighter, safer future where every child can thrive.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-[#f4f4f4] p-3">
                  <HeartIcon />
                </div>
              </div>
              <div className="text-3xl font-semibold text-gray-900">2354+</div>
              <div className="mt-1 text-sm text-gray-600">Donations</div>
            </div>

            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-[#f4f4f4] p-3">
                  <UsersIcon />
                </div>
              </div>
              <div className="text-3xl font-semibold text-gray-900">3500+</div>
              <div className="mt-1 text-sm text-gray-600">Helped People</div>
            </div>

            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-[#f4f4f4] p-3">
                  <HandshakeIcon />
                </div>
              </div>
              <div className="text-3xl font-semibold text-gray-900">500+</div>
              <div className="mt-1 text-sm text-gray-600">Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}