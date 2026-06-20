"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AdBanner from "@/components/ads/AdBanner";
import ToolSearch from "@/components/search/ToolSearch";
import CategoryCard from "@/components/home/CategoryCard";
import StatsBar from "@/components/home/StatsBar";
import RequestToolCta from "@/components/tools/RequestToolCta";
import JsonLd from "@/components/seo/JsonLd";
import ToolCard from "@/components/tools/ToolCard";
import { categories } from "@/constants/categories";
import { images } from "@/constants/images";
import type { Tool } from "@/types/tool";

interface HomeContentProps {
  featuredTools: Tool[];
  totalTools: number;
}

export default function HomeContent({
  featuredTools,
  totalTools,
}: HomeContentProps) {
  const t = useTranslations("home");
  const tMeta = useTranslations("metadata.site");

  const suggestionPills = [
    { label: t("suggestionPills.bmiCalculator"), href: "/bmi-calculator" },
    { label: t("suggestionPills.wordCounter"), href: "/word-counter" },
    { label: t("suggestionPills.emiCalculator"), href: "/emi-calculator" },
    {
      label: t("suggestionPills.percentageCalculator"),
      href: "/percentage-calculator",
    },
    { label: t("suggestionPills.colorConverter"), href: "/color-converter" },
  ];

  const howItWorksSteps = [
    {
      icon: "search",
      title: t("howItWorksSteps.search.title"),
      description: t("howItWorksSteps.search.description"),
    },
    {
      icon: "flash_on",
      title: t("howItWorksSteps.use.title"),
      description: t("howItWorksSteps.use.description"),
    },
    {
      icon: "task_alt",
      title: t("howItWorksSteps.results.title"),
      description: t("howItWorksSteps.results.description"),
    },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toolsify",
    url: "https://toolsify.online",
    description: tMeta("description"),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://toolsify.online/en/tools?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={websiteSchema} />

      <section className="relative z-20 pt-2xl pb-2xl overflow-visible">
        <div className="max-w-container-max mx-auto px-gutter relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          <div className="lg:col-span-7 text-left">
            <h1 className="font-display text-display mb-md text-on-background">
              {t("heroTitle")}
            </h1>
            <p className="font-body text-body text-on-surface-variant mb-xl max-w-xl">
              {t("heroDescription")}
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
              alt={t("heroImageAlt")}
              width={500}
              height={400}
              className="w-full h-auto max-w-md lg:max-w-full"
              priority
            />
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-gutter mb-2xl">
        <AdBanner slot="homepage-leaderboard" format="leaderboard" />
      </div>

      <section className="py-2xl bg-surface-bright">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-h1 text-h1 text-on-background">
                {t("browseByCategory")}
              </h2>
              <p className="font-body text-body text-on-surface-variant">
                {t("browseByCategoryDescription")}
              </p>
            </div>
            <Link
              href="/tools"
              className="text-primary font-bold flex items-center gap-sm group shrink-0"
            >
              {t("viewAllTools", { count: totalTools })}
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

      <section className="py-2xl">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-h1 text-h1 text-on-background mb-xl text-center">
            {t("popularTools")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="homepage" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-2xl bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-h1 text-h1 text-on-background text-center mb-2xl">
            {t("howItWorks")}
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

      <StatsBar />
    </>
  );
}
