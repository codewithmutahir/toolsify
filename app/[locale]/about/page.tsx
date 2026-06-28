import type { ReactNode } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import {
  formatLocalizedDate,
  STATIC_PAGE_LAST_UPDATED,
} from "@/lib/i18n/format-date";
import { parseRichString } from "@/lib/i18n/render-rich-string";
import { richInternalLink } from "@/lib/i18n/rich-text";

type PageProps = { params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata(params.locale as Locale, "/about", "about");
}

export default async function AboutPage({ params }: PageProps) {
  setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const t = await getTranslations("aboutPage");
  const lastUpdated = formatLocalizedDate(locale, STATIC_PAGE_LAST_UPDATED);
  const toolsList = t.raw("whatYouCanUse.toolsList") as string[];
  const values = t.raw("whatWeCare.values") as string[];

  const bold = (chunks: ReactNode) => <strong>{chunks}</strong>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">{t("title")}</h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          {t("lastUpdated", { date: lastUpdated })}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("whatIs.heading")}
            </h2>
            <p>{t("whatIs.p1")}</p>
            <p>{t("whatIs.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("whatYouCanUse.heading")}
            </h2>
            <ul className="list-disc pl-lg space-y-xs">
              {toolsList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-sm">
              {parseRichString(t("whatYouCanUse.browseTools"), {
                link: richInternalLink("/tools"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("whatWeCare.heading")}
            </h2>
            <ul className="list-disc pl-lg space-y-xs">
              {values.map((item) => (
                <li key={item}>{parseRichString(item, { bold })}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("whoBuilds.heading")}
            </h2>
            <p>{t("whoBuilds.p1")}</p>
            <p>
              {parseRichString(t("whoBuilds.learnAuthor"), {
                link: richInternalLink("/author"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("accuracy.heading")}
            </h2>
            <p>{t("accuracy.p1")}</p>
            <p>
              {parseRichString(t("accuracy.seeDisclaimer"), {
                link: richInternalLink("/disclaimer"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("privacy.heading")}
            </h2>
            <p>{t("privacy.p1")}</p>
            <p>
              {parseRichString(t("privacy.policies"), {
                link: richInternalLink("/privacy-policy"),
                cookie: richInternalLink("/cookie-policy"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("helpImprove.heading")}
            </h2>
            <p>{t("helpImprove.p1")}</p>
            <p>
              {parseRichString(t("helpImprove.contact"), {
                link: richInternalLink("/contact"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("alwaysGrowing.heading")}
            </h2>
            <p>
              {parseRichString(t("alwaysGrowing.alwaysGrowingBody"), {
                link: richInternalLink("/tools"),
              })}
            </p>
          </section>

          <blockquote className="border-l-4 border-primary-container pl-md py-sm text-on-surface-variant italic">
            {t("quote")}
          </blockquote>
        </div>

        <p className="mt-xl font-small text-small text-on-surface-variant">
          <Link href="/" className="text-primary-container hover:underline">
            {t("back")}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
