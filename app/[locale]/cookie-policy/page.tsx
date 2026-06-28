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
import {
  richExternalLink,
  richInternalLink,
  richMailto,
} from "@/lib/i18n/rich-text";

type PageProps = { params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata(
    params.locale as Locale,
    "/cookie-policy",
    "cookies"
  );
}

function renderListItems(items: string[], tags: Record<string, (c: ReactNode) => ReactNode>) {
  return items.map((item) => (
    <li key={item}>{parseRichString(item, tags)}</li>
  ));
}

export default async function CookiePolicyPage({ params }: PageProps) {
  setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const t = await getTranslations("cookiePolicyPage");
  const lastUpdated = formatLocalizedDate(locale, STATIC_PAGE_LAST_UPDATED);

  const bold = (chunks: ReactNode) => <strong>{chunks}</strong>;
  const essentialItems = t.raw("essential.items") as string[];
  const analyticsItems = t.raw("analytics.items") as string[];
  const thirdPartyItems = t.raw("thirdParty.items") as string[];
  const managingItems = t.raw("managing.items") as string[];

  const analyticsTags = {
    bold,
    link: richExternalLink("https://posthog.com/privacy"),
  };
  const analyticsTagsGoogle = {
    bold,
    link: richExternalLink("https://policies.google.com/privacy"),
  };

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
              {t("overview.heading")}
            </h2>
            <p>
              {parseRichString(t("overview.p1"), {
                link: richInternalLink("/privacy-policy"),
              })}
            </p>
            <p>{t("overview.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("howWeUse.heading")}
            </h2>
            <p>{t("howWeUse.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("types.heading")}
            </h2>

            <h3 className="font-h3 text-h3 text-on-surface mb-xs mt-md">
              {t("essential.heading")}
            </h3>
            <p>{t("essential.p")}</p>
            <ul className="list-disc pl-lg space-y-xs">
              {renderListItems(essentialItems, { bold })}
            </ul>

            <h3 className="font-h3 text-h3 text-on-surface mb-xs mt-md">
              {t("analytics.heading")}
            </h3>
            <p>{t("analytics.p")}</p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>{parseRichString(analyticsItems[0], analyticsTags)}</li>
              <li>{parseRichString(analyticsItems[1], analyticsTagsGoogle)}</li>
              <li>{parseRichString(analyticsItems[2], { bold })}</li>
            </ul>

            <h3 className="font-h3 text-h3 text-on-surface mb-xs mt-md">
              {t("advertising.heading")}
            </h3>
            <p>{parseRichString(t("advertising.p1"), { bold })}</p>
            <p>
              {parseRichString(t("advertising.p2"), {
                link: richExternalLink(
                  "https://policies.google.com/technologies/ads"
                ),
                link2: richExternalLink("https://www.google.com/settings/ads"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("thirdParty.heading")}
            </h2>
            <p>{t("thirdParty.p")}</p>
            <ul className="list-disc pl-lg space-y-xs">
              {thirdPartyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{t("thirdParty.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("toolData.heading")}
            </h2>
            <p>{t("toolData.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("managing.heading")}
            </h2>
            <p>{t("managing.p")}</p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>{parseRichString(managingItems[0], { bold })}</li>
              <li>
                {parseRichString(managingItems[1], {
                  bold,
                  link: richExternalLink("https://www.google.com/settings/ads"),
                })}
              </li>
              <li>
                {parseRichString(managingItems[2], {
                  bold,
                  link: richExternalLink("https://optout.aboutads.info"),
                  link2: richExternalLink("https://www.youronlinechoices.eu"),
                })}
              </li>
            </ul>
            <p>{t("managing.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("changes.heading")}
            </h2>
            <p>{t("changes.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("contact.heading")}
            </h2>
            <p>
              {parseRichString(t("contact.contactBody"), {
                mailto: richMailto("privacy@toolsify.online"),
                link: richInternalLink("/contact"),
              })}
            </p>
          </section>
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
