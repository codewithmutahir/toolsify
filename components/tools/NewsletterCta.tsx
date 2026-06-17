"use client";

interface NewsletterCtaProps {
  heading?: string;
  description?: string;
}

export default function NewsletterCta({
  heading = "Stay Updated",
  description = "Get notified when we add new calculators or utility tools to our platform.",
}: NewsletterCtaProps) {
  return (
    <section className="max-w-container-max mx-auto px-gutter mb-2xl">
      <div className="relative overflow-hidden bg-inverse-surface rounded-2xl p-xl flex flex-col lg:flex-row items-center justify-between gap-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10">
          <h2 className="font-h2 text-h2 text-inverse-on-surface mb-sm">
            {heading}
          </h2>
          <p className="font-body text-body text-surface-variant opacity-80 max-w-md">
            {description}
          </p>
        </div>
        <form
          className="relative z-10 flex w-full max-w-md gap-sm"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow bg-white/10 border border-white/20 rounded-lg px-lg py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-container outline-none"
          />
          <button
            type="submit"
            className="bg-primary-container text-on-primary-container px-xl py-3 rounded-lg font-label font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
