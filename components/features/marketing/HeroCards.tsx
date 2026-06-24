import Link from "next/link";

const CARDS = [
  {
    text: "Today is the day to reach out and lend a helping hand.",
    className: "bg-[#F5EDE3] text-[#5C5146] dark:bg-card-muted dark:text-muted",
    buttonClass: "bg-white text-foreground hover:bg-gray-100 dark:bg-card dark:hover:bg-accent-hover",
  },
  {
    text: "Even the smallest of donations can help change a life.",
    className: "bg-[#2C2522] text-white",
    buttonClass: "bg-white text-[#2C2522] hover:bg-gray-100",
  },
  {
    text: "Become a volunteer. You'll feel the benefits instantly.",
    className: "bg-brand-sage text-white",
    buttonClass: "bg-white text-brand-sage hover:bg-gray-100",
    multiline: true,
  },
] as const;

export function HeroCards() {
  return (
    <section className="relative z-20 -mt-10 bg-card-muted py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div key={card.text} className={`rounded-2xl p-7 ${card.className}`}>
              <p className="mb-6 leading-relaxed">
                {"multiline" in card && card.multiline ? (
                  <>
                    Become a volunteer.
                    <br />
                    You&apos;ll feel the benefits instantly.
                  </>
                ) : (
                  card.text
                )}
              </p>
              <Link
                href="/login"
                className={`inline-block rounded-full px-5 py-2 text-sm font-medium transition-colors ${card.buttonClass}`}
              >
                Donate
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}