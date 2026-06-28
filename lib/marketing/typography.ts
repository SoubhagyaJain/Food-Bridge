/**
 * Marketing typography — Caveat for hero/display; Montserrat bold for cards and UI.
 * DESIGN LOCK (marketing-v1): do not edit without `npm run design:lock` + CI verify.
 * Light: white hero/nav on photos; primary + on-surface on washed overlays.
 * Dark: all page text white; navbar keeps --hero-nav-text (red) via mktNav* tokens.
 */

/** Hero headline — matches “Four Simple Steps. One Shared Mission.” on photo */
export const mktHeroTitle =
  "font-script text-5xl font-black leading-tight tracking-tight text-white text-shadow-dark sm:text-6xl md:text-7xl lg:text-8xl";

/** Hero subhead — matches How It Works supporting line on photo */
export const mktHeroSubtitle =
  "mx-auto max-w-3xl font-script text-2xl font-bold leading-snug text-white text-shadow-dark md:text-3xl md:leading-relaxed lg:text-4xl lg:leading-relaxed";

/** Hero trust line — sophisticated uppercase label */
export const mktHeroLabel =
  "mt-8 w-full font-button text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/85 text-shadow-dark md:text-xs md:tracking-[0.28em]";

/** Hero primary CTA — same shape/position, crisper contrast */
export const mktHeroCtaPrimary =
  "hero-cta-primary mt-6 rounded-full bg-white px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.14em] text-primary shadow-[0_4px_24px_rgba(0,0,0,0.38)] ring-1 ring-white/25 transition-all duration-300 hover:scale-105 hover:bg-white active:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.42)]";

/** Hero secondary CTA */
export const mktHeroCtaSecondary =
  "mt-6 rounded-full border border-white/70 bg-black/25 px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white hover:bg-white/15";

/** Nav bar — keeps red accent in dark mode (excluded from site-wide white) */
export const mktNavText =
  "font-button text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-hero-nav-muted dark:text-shadow-dark";

export const mktNavTextOnBar =
  "font-button text-xs font-bold uppercase tracking-widest text-white text-shadow-dark dark:text-hero-nav-muted";

export const mktNavLogo =
  "font-script text-4xl font-bold lowercase tracking-widest text-primary dark:text-hero-nav dark:text-shadow-dark dark:drop-shadow-sm";

export const mktNavLogoOnBar =
  "font-script text-4xl font-bold lowercase tracking-widest text-white text-shadow-dark dark:text-hero-nav";

/** Section H2 over scroll backgrounds */
export const mktSectionTitle =
  "font-script text-3xl font-black uppercase tracking-widest text-primary text-shadow-subtle md:text-5xl dark:text-white dark:text-shadow-dark";

export const mktSectionTitleLg =
  "font-script text-5xl font-black leading-tight tracking-tight text-primary text-shadow-subtle md:text-7xl dark:text-white dark:text-shadow-dark";

export const mktSectionTitleImpact =
  "font-script text-4xl font-black uppercase leading-tight tracking-tight text-white text-shadow-dark sm:text-5xl md:text-6xl lg:text-7xl";

/** Section subtitle — Caveat, larger script line */
export const mktSectionSubtitle =
  "font-script text-2xl font-bold leading-snug text-on-surface text-shadow-subtle md:text-3xl dark:text-white dark:text-shadow-dark";

/** Subtitle on cinematic photo backgrounds (impact, hero-adjacent) */
export const mktSectionSubtitleOnPhoto =
  "font-script text-2xl font-bold leading-snug text-white text-shadow-dark md:text-3xl lg:text-4xl";

export const mktSectionCaptionOnPhoto =
  "font-sans text-sm font-bold italic text-white text-shadow-dark dark:text-white";

export const mktSectionSubtitleLg =
  "font-script text-2xl font-bold leading-snug text-on-surface text-shadow-subtle md:text-3xl lg:text-4xl dark:text-white dark:text-shadow-dark";

/** Small meta / caption under section titles */
export const mktSectionCaption =
  "font-sans text-sm font-bold italic text-on-surface-variant text-shadow-subtle dark:text-white dark:text-shadow-dark";

/** Cards on cinematic / glass backgrounds */
export const mktCardTitle =
  "font-display text-xl font-bold text-mkt-text";

export const mktCardBody =
  "font-sans text-sm font-semibold leading-relaxed text-mkt-text-muted";

export const mktCardQuote =
  "font-sans text-sm font-bold italic text-primary dark:text-white";

export const mktCardMeta =
  "font-sans text-xs font-semibold text-mkt-text-subtle";

/** Community section role cards — warm brown palette in dark mode */
export const mktCommunityCardTitle =
  "font-display text-xl font-bold text-[#201a1a] dark:text-[#fff8f7]";

export const mktCommunityCardBody =
  "font-sans text-sm font-semibold leading-relaxed text-[#544341] dark:text-[#e8ddd4]";

export const mktCommunityCardMeta =
  "font-sans text-xs font-semibold text-[#877270] dark:text-[#d9cdc3]";

export const mktStatLabel =
  "font-button text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white";

export const mktStatValue =
  "font-display text-5xl font-extrabold tabular-nums text-on-surface md:text-6xl dark:text-white";

export const mktStatSub =
  "font-sans text-xs font-semibold italic text-on-surface-variant dark:text-white";

/** Testimonials title — Montserrat display in light Stitch */
export const mktTestimonialsTitle =
  "font-display text-5xl font-black leading-tight text-on-surface text-shadow-subtle md:text-6xl lg:text-7xl dark:text-white dark:text-shadow-dark";

export const mktTestimonialsSubtitle =
  "font-sans text-xl font-bold leading-relaxed text-on-surface text-shadow-subtle md:text-2xl dark:text-white dark:text-shadow-dark";

/** Role cards community title — script italic */
export const mktCommunityTitle =
  "font-script text-5xl font-black italic leading-tight tracking-wide text-primary text-shadow-subtle md:text-7xl dark:text-white dark:text-shadow-dark";

/** Community / volunteers section — white on cinematic photo */
export const mktCommunityTitleOnPhoto =
  "font-script text-5xl font-black italic leading-tight tracking-wide text-white text-shadow-dark md:text-7xl";

/** Footer */
export const mktFooterHeading =
  "font-button text-sm font-bold uppercase tracking-widest text-on-surface dark:text-white";

export const mktFooterBody =
  "font-sans text-sm font-semibold leading-relaxed text-on-surface-variant dark:text-white";

export const mktFooterLink =
  "font-sans text-sm font-semibold text-on-surface-variant transition-colors duration-300 hover:text-primary dark:text-white dark:hover:text-white/80";