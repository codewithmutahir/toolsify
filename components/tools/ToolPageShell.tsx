import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import ToolHeader from "@/components/tools/ToolHeader";
import ToolExamples from "@/components/tools/ToolExamples";
import ToolHowTo from "@/components/tools/ToolHowTo";
import ToolFaq from "@/components/tools/shared/ToolFaq";
import RelatedTools from "@/components/tools/RelatedTools";
import ToolUsageProvider from "@/components/tools/ToolUsageProvider";
import { getLocalizedToolPageContent } from "@/lib/i18n/tool-content";
import { buildToolPageJsonLd } from "@/lib/seo/json-ld";
import { areAdsEnabled } from "@/lib/ads";
import type { ImplementedToolSlug } from "@/components/tools/tool-registry";
import type { Locale } from "@/i18n/routing";
import type { Tool } from "@/types/tool";
import { cn } from "@/lib/utils";

const AdBanner = dynamic(() => import("@/components/ads/AdBanner"), {
  ssr: false,
});
const FavoriteButton = dynamic(
  () => import("@/components/tools/FavoriteButton"),
  { ssr: false }
);
const ReportIssueButton = dynamic(
  () => import("@/components/report-issue-button"),
  { ssr: false }
);

interface ToolPageShellProps {
  tool: Tool;
  slug: ImplementedToolSlug;
  children: ReactNode;
}

export default async function ToolPageShell({
  tool,
  slug,
  children,
}: ToolPageShellProps) {
  const content = await getLocalizedToolPageContent(slug, tool);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("toolPage");
  const jsonLd = buildToolPageJsonLd(tool, locale, content.faqs, content.howToSteps);
  const adsEnabled = areAdsEnabled();

  return (
    <>
      {jsonLd.map((schema, index) => (
        <JsonLd key={index} data={schema as object} />
      ))}

      <main className="max-w-container-max mx-auto px-gutter md:px-xl py-lg">
        <article>
          <ToolHeader
            title={tool.title}
            description={content.introduction}
            category={tool.category}
          />

          <FavoriteButton slug={slug} />

          {adsEnabled && (
            <AdBanner
              slot="leaderboard-top"
              format="leaderboard"
              className="mb-xl"
            />
          )}

          <div
            className={cn(
              "grid grid-cols-1 w-full items-start gap-xl",
              adsEnabled && "lg:grid-cols-[1fr_160px]"
            )}
          >
            <div className="w-full max-w-[700px] mx-auto lg:mx-0 lg:max-w-none">
              <section aria-label={t("toolInterface")}>
                <ToolUsageProvider slug={slug}>
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm">
                    {children}
                  </div>
                </ToolUsageProvider>
              </section>

              {adsEnabled && (
                <AdBanner
                  slot="rectangle-result"
                  format="rectangle"
                  className="mt-xl w-full max-w-none"
                />
              )}

              {content.article && (
                <section
                  aria-label={t("aboutTool")}
                  className="mt-2xl bg-surface-container-low rounded-2xl p-xl border border-outline-variant/30"
                >
                  <p className="font-body text-body text-on-surface-variant leading-relaxed">
                    {content.article}
                  </p>
                </section>
              )}

              <ToolHowTo steps={content.howToSteps} />
              <ToolExamples examples={content.examples} />
              <ToolFaq items={content.faqs} />
            </div>

            {adsEnabled && (
              <aside className="hidden lg:block w-[160px] shrink-0 sticky top-24">
                <AdBanner
                  slot="skyscraper-side"
                  format="skyscraper"
                  className="w-full"
                />
              </aside>
            )}
          </div>
        </article>

        <RelatedTools category={tool.category} currentSlug={slug} />
      </main>

      <ReportIssueButton />
    </>
  );
}
