"use client";

import Link from "next/link";
import { StitchImage } from "@/components/features/marketing/StitchImage";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/features/marketing/MaterialIcon";
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  FEATURED_AUTHOR_AVATAR,
  FEATURED_POST,
  MOST_READ,
  type BlogCategoryFilter,
  type BlogPost,
} from "@/lib/marketing/blog-content";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 4;

function matchesFilter(post: BlogPost, query: string, category: BlogCategoryFilter) {
  const q = query.trim().toLowerCase();
  const matchesQuery =
    !q ||
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q) ||
    post.author.toLowerCase().includes(q);
  const matchesCategory =
    category === "All Stories" || post.category === category;
  return matchesQuery && matchesCategory;
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="flex items-center gap-1 rounded-lg bg-surface/95 px-3 py-1.5 font-display text-xs font-semibold text-primary backdrop-blur dark:bg-inverse-surface/95 dark:text-inverse-primary">
      <MaterialIcon name="energy_savings_leaf" className="text-sm" />
      {category}
    </span>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog#${post.slug}`}
      className="blog-warm-shadow group block overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 dark:bg-inverse-surface/80"
    >
      <div className="relative h-56 overflow-hidden">
        <StitchImage
          src={post.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <CategoryBadge category={post.category} />
        </div>
      </div>
      <div className="p-6">
        <h4 className="mb-3 line-clamp-2 font-display text-xl font-semibold text-on-surface transition-colors group-hover:text-[var(--blog-heritage)] dark:text-inverse-on-surface">
          {post.title}
        </h4>
        <p className="mb-6 line-clamp-2 font-sans text-body-md text-on-surface-variant dark:text-outline">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 border-t border-outline-variant/20 pt-4">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[var(--blog-heritage)]/20">
            <StitchImage
              src={FEATURED_AUTHOR_AVATAR}
              alt=""
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <span className="font-display text-xs font-semibold text-secondary dark:text-outline">
            {post.author} • {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogPageView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlogCategoryFilter>("All Stories");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filtered = useMemo(
    () => BLOG_POSTS.filter((p) => matchesFilter(p, query, category)),
    [query, category]
  );

  const visible = filtered.slice(0, visibleCount);
  const showFeatured =
    matchesFilter(FEATURED_POST, query, category) ||
    (category === "All Stories" && !query.trim());

  return (
    <div className="blog-page min-h-screen bg-background pt-24 text-on-surface transition-colors duration-300">
      <main className="mx-auto max-w-container-max px-margin-mobile py-16 md:px-margin-desktop md:py-20">
        {/* Featured story */}
        {showFeatured && (
          <section className="blog-fade-in mb-20">
            <article className="blog-warm-shadow group flex flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest dark:bg-inverse-surface/80 md:flex-row">
              <div className="relative h-64 overflow-hidden md:h-[500px] md:w-3/5">
                <StitchImage
                  src={FEATURED_POST.image}
                  alt="Community sharing meal"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="inline-block rounded-lg bg-[var(--blog-heritage)]/90 px-3 py-1 font-display text-xs font-semibold text-white backdrop-blur">
                    Featured Story
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center bg-surface-container-lowest p-8 md:w-2/5 md:p-12 dark:bg-transparent">
                <h2 className="mb-6 font-display text-3xl font-bold leading-tight text-primary dark:text-white md:text-[40px]">
                  {FEATURED_POST.title}
                </h2>
                <p className="mb-8 line-clamp-4 font-sans text-body-lg text-on-surface-variant dark:text-inverse-on-surface">
                  {FEATURED_POST.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[var(--blog-heritage)]/30">
                      <StitchImage
                        src={FEATURED_AUTHOR_AVATAR}
                        alt={FEATURED_POST.author}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-primary dark:text-white">
                        {FEATURED_POST.author}
                      </p>
                      <p className="flex items-center gap-1 font-display text-xs text-secondary dark:text-outline">
                        <MaterialIcon name="energy_savings_leaf" className="text-sm" />
                        {FEATURED_POST.readTime}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog#${FEATURED_POST.slug}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blog-heritage-container)] text-[var(--blog-heritage-on)] transition-colors hover:bg-[var(--blog-heritage)] hover:text-white"
                    aria-label="Read featured story"
                  >
                    <MaterialIcon name="arrow_forward" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        <div className="blog-mandala-divider mb-12 dark:opacity-50" />

        {/* Search & filters */}
        <div className="blog-fade-in blog-fade-in-delay-1 sticky top-[72px] z-40 mb-12 border-b border-outline-variant/30 bg-background/95 py-4 backdrop-blur-md dark:bg-inverse-surface/95">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <MaterialIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                placeholder="Search stories..."
                className="blog-warm-shadow w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 font-sans text-body-md outline-none transition-all focus:border-[var(--blog-heritage)] focus:ring-1 focus:ring-[var(--blog-heritage)] dark:bg-inverse-surface dark:text-inverse-on-surface"
              />
            </div>
            <div className="hide-scrollbar flex w-full gap-3 overflow-x-auto pb-2 md:w-auto md:pb-0">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-5 py-2.5 font-display text-sm font-semibold transition-colors",
                    category === cat
                      ? "blog-warm-shadow bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
                      : "border border-outline-variant bg-surface-container-lowest text-primary hover:border-[var(--blog-heritage)] dark:bg-inverse-surface dark:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          {/* Main grid */}
          <div className="space-y-20 lg:col-span-8">
            <div>
              <h3 className="mb-8 flex items-center gap-2 font-display text-headline-md text-primary dark:text-white">
                <MaterialIcon name="local_florist" className="text-[var(--blog-heritage)]" />
                Latest Stories
              </h3>

              {visible.length === 0 ? (
                <p className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-8 text-center font-sans text-body-md text-on-surface-variant">
                  No stories match your search. Try a different filter or keyword.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
                  {visible.map((post, i) => (
                    <div
                      key={post.id}
                      className={cn("blog-fade-in", i > 1 && "blog-fade-in-delay-2")}
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              )}

              {visibleCount < filtered.length && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((n) => n + INITIAL_VISIBLE)}
                    className="rounded-lg border-2 border-primary px-8 py-3 font-display text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    Load More Stories
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Newsletter */}
            <div className="blog-warm-shadow relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low p-8 dark:bg-inverse-surface/60">
              <MaterialIcon
                name="spa"
                className="pointer-events-none absolute -right-10 -top-10 text-[120px] text-primary-container/30"
              />
              <div className="relative z-10">
                <h3 className="mb-3 font-display text-xl font-semibold text-primary dark:text-white">
                  Hafte mein ek baar, asli kahaniyan jo dil ko chhoo jaayein
                </h3>
                <p className="mb-6 font-sans text-body-md text-on-surface-variant dark:text-inverse-on-surface">
                  Get inspiring stories and impact updates delivered weekly.
                </p>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest/80 px-4 py-3 font-sans text-body-md backdrop-blur outline-none focus:border-[var(--blog-heritage)] focus:ring-1 focus:ring-[var(--blog-heritage)] dark:bg-inverse-surface dark:text-inverse-on-surface"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[var(--blog-heritage)] py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-[var(--blog-heritage-container)]"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Most read */}
            <div className="blog-warm-shadow rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 dark:bg-inverse-surface/80">
              <h3 className="mb-6 flex items-center gap-2 border-b border-outline-variant/20 pb-4 font-display text-xl font-semibold text-primary dark:text-white">
                <MaterialIcon name="local_fire_department" className="text-[var(--blog-heritage)]" />
                Most Read This Month
              </h3>
              <ul className="space-y-6">
                {MOST_READ.map((item) => (
                  <li key={item.rank}>
                    <Link href="/blog" className="group flex items-start gap-4">
                      <span className="font-display text-[32px] font-bold text-outline-variant transition-colors group-hover:text-[var(--blog-heritage)] dark:text-outline">
                        {String(item.rank).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="mb-1 font-display text-sm font-semibold text-on-surface transition-colors group-hover:text-primary dark:text-inverse-on-surface dark:group-hover:text-primary-fixed">
                          {item.title}
                        </h4>
                        <span className="flex items-center gap-1 font-display text-xs text-secondary dark:text-outline">
                          <MaterialIcon name="energy_savings_leaf" className="text-sm" />
                          {item.category}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Join movement */}
            <div className="blog-warm-shadow rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 dark:bg-inverse-surface/80">
              <h3 className="mb-6 border-b border-outline-variant/20 pb-4 font-display text-xl font-semibold text-primary dark:text-white">
                Join the Movement
              </h3>
              <div className="space-y-4">
                <Link
                  href="/register?role=donor"
                  className="group flex items-center justify-between rounded-lg bg-primary p-4 text-on-primary shadow-sm transition-all hover:bg-primary-container hover:text-on-primary-container"
                >
                  <span className="font-display text-sm font-semibold">List Surplus Food</span>
                  <MaterialIcon
                    name="arrow_forward"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/register?role=volunteer"
                  className="group flex items-center justify-between rounded-lg border-2 border-primary p-4 text-primary transition-all hover:bg-surface-container-low dark:border-primary-fixed dark:text-white dark:hover:bg-inverse-surface"
                >
                  <span className="font-display text-sm font-semibold">
                    Join as a Volunteer – 5 Minutes Mein Shuru Karein
                  </span>
                  <MaterialIcon
                    name="volunteer_activism"
                    className="transition-transform group-hover:scale-110"
                  />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom CTA */}
        <section className="blog-fade-in relative mt-20 overflow-hidden rounded-xl border-b-8 border-[var(--blog-heritage)] bg-primary p-12 text-center text-on-primary dark:bg-primary-container dark:text-on-primary-container">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0zm0 38c9.941 0 18-8.059 18-18S29.941 2 20 2 2 10.059 2 20s8.059 18 18 18zm0-4c7.732 0 14-6.268 14-14S27.732 6 20 6 6 12.268 6 20s6.268 14 14 14zm0-4c5.523 0 10-4.477 10-10S25.523 10 20 10 10 14.477 10 20s4.477 10 10 10zm0-4c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z' fill='%23FFF' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="mb-6 font-display text-display-lg-mobile md:text-display-lg">
              Ready to turn surplus into real impact?
            </h2>
            <p className="mb-10 font-sans text-body-lg opacity-90">
              Join thousands of individuals and businesses making a difference in their communities
              every day.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register?role=donor"
                className="rounded-lg bg-[var(--blog-heritage)] px-8 py-4 font-display text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[var(--blog-heritage-container)]"
              >
                Start Donating
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-lg border-2 border-on-primary/50 px-8 py-4 font-display text-sm font-semibold transition-colors hover:border-on-primary hover:bg-on-primary/10 dark:border-on-primary-container/50 dark:hover:border-on-primary-container dark:hover:bg-on-primary-container/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 bg-background px-margin-mobile py-12 md:flex-row md:px-margin-desktop">
        <div className="font-display text-headline-md font-bold tracking-tight text-primary dark:text-white">
          Foodbridge
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/" className="font-display text-xs text-secondary hover:text-[var(--blog-heritage)] dark:text-outline">
            Home
          </Link>
          <Link href="/register" className="font-display text-xs text-secondary hover:text-[var(--blog-heritage)] dark:text-outline">
            Volunteer Portal
          </Link>
          <a href="mailto:hello@foodbridge.org" className="font-display text-xs text-secondary hover:text-[var(--blog-heritage)] dark:text-outline">
            Contact Us
          </a>
        </div>
        <p className="text-center font-sans text-sm text-secondary/70 dark:text-outline/70 md:text-right">
          © {new Date().getFullYear()} Foodbridge Stories of Connection. All rights reserved.
        </p>
      </footer>
    </div>
  );
}