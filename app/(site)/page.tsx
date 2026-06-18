import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";
import ToolSearch from "@/components/search/ToolSearch";
import CategoryCard from "@/components/home/CategoryCard";
import StatsBar from "@/components/home/StatsBar";
import RequestToolCta from "@/components/tools/RequestToolCta";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { categories } from "@/constants/categories";
import { images } from "@/constants/images";
import { getFeaturedTools, tools } from "@/constants/tools";

export const metadata: Metadata = {
  title: "Free Online Tools — Calculators, Converters & More | Toolsify",
  description:
    "Free online tools including BMI calculator, percentage calculator, word counter, EMI calculator, and 50+ more. No signup required. Fast and accurate.",
  keywords: [
    "free online tools",
    "calculator",
    "converter",
    "BMI calculator",
    "word counter",
    "EMI calculator",
    "toolsify",
  ],
  openGraph: {
    title: "Free Online Tools — Calculators, Converters & More | Toolsify",
    description:
      "Free online tools including BMI calculator, percentage calculator, word counter, EMI calculator, and 50+ more. No signup required.",
    url: "https://toolsify.online",
    siteName: "Toolsify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools | Toolsify",
    description:
      "Free online calculators, converters, and utility tools. No signup required.",
  },
  alternates: {
    canonical: "https://toolsify.online",
  },
  robots: { index: true, follow: true },
};

const suggestionPills = [
  { label: "BMI Calculator", href: "/bmi-calculator" },
  { label: "Word Counter", href: "/word-counter" },
  { label: "EMI Calculator", href: "/emi-calculator" },
  { label: "Percentage Calculator", href: "/percentage-calculator" },
  { label: "Color Converter", href: "/color-converter" },
];

const howItWorksSteps = [
  {
    icon: "search",
    title: "1. Search",
    description:
      "Find the perfect tool from our extensive library using the search bar or categories.",
  },
  {
    icon: "flash_on",
    title: "2. Use Instantly",
    description:
      "Enter your data or upload files. No accounts or waiting times involved.",
  },
  {
    icon: "task_alt",
    title: "3. Get Results",
    description:
      "Download your processed files or copy your results immediately with one click.",
  },
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Toolsify",
  url: "https://toolsify.online",
  description:
    "Free online calculators, converters, and utility tools. Fast, accurate, and no signup required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://toolsify.online/tools?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  const featuredTools = getFeaturedTools().slice(0, 8);
  const totalTools = tools.length;

  return (
    <>
      <JsonLd data={websiteSchema} />

      {/* HERO SECTION */}
      <section className="relative z-20 pt-2xl pb-2xl overflow-visible">
        <div className="max-w-container-max mx-auto px-gutter relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          <div className="lg:col-span-7 text-left">
            <h1 className="font-display text-display mb-md text-on-background">
              Free Online Tools for Everyone
            </h1>
            <p className="font-body text-body text-on-surface-variant mb-xl max-w-xl">
              Fast, free, and easy-to-use. No signup required. Access a
              professional suite of document, math, and developer tools
              instantly.
            </p>

            <div className="relative z-30 mb-lg">
              <ToolSearch variant="hero" />
            </div>

            <div className="flex flex-wrap gap-sm">
              {suggestionPills.map((pill) => (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className="px-md py-sm bg-primary-container/10 text-primary-container rounded-full font-label text-label cursor-pointer hover:bg-primary-container/20 transition-all border border-primary-container/20"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center hero-float">
            <Image
              src={images.heroIllustration}
              alt="Toolsify hero illustration"
              width={500}
              height={400}
              className="w-full h-auto max-w-md lg:max-w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* Ad below hero */}
      <div className="max-w-container-max mx-auto px-gutter mb-2xl">
        <AdBanner slot="homepage-leaderboard" format="leaderboard" />
      </div>

      {/* CATEGORIES SECTION */}
      <section className="py-2xl bg-surface-bright">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-h1 text-h1 text-on-background">
                Browse by Category
              </h2>
              <p className="font-body text-body text-on-surface-variant">
                Find the right tool for your specific task
              </p>
            </div>
            <Link
              href="/tools"
              className="text-primary font-bold flex items-center gap-sm group shrink-0"
            >
              View all {totalTools}+ Tools
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-md">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS SECTION */}
      <section className="py-2xl">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-h1 text-h1 text-on-background mb-xl text-center">
            Popular Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="homepage" />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-2xl bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-h1 text-h1 text-on-background text-center mb-2xl">
            How Toolsify Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className="text-center relative">
                <div className="w-16 h-16 bg-surface-container-lowest shadow-md border border-outline-variant rounded-full flex items-center justify-center mx-auto mb-lg relative z-10 transition-transform hover:rotate-12">
                  <span className="material-symbols-outlined text-primary-container text-h1">
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-h2 text-h3 text-on-background mb-md">
                  {step.title}
                </h3>
                <p className="font-body text-body text-on-surface-variant px-md">
                  {step.description}
                </p>
              </div>
            ))}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-outline-variant to-transparent -z-0" />
          </div>
        </div>
      </section>

      <RequestToolCta />

      {/* STATS BAR */}
      <StatsBar />
    </>
  );
}
