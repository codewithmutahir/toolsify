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
  return generatePageMetadata(
    params.locale as Locale,
    "/disclaimer",
    "disclaimer"
  );
}

export default async function DisclaimerPage({ params }: PageProps) {
  setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const t = await getTranslations("disclaimerPage");
  const lastUpdated = formatLocalizedDate(locale, STATIC_PAGE_LAST_UPDATED);
  const riskItems = t.raw("useAtOwnRisk.items") as string[];

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
              {t("generalInfo.heading")}
            </h2>
            <p>{t("generalInfo.p1")}</p>
            <p>{t("generalInfo.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("noGuarantee.heading")}
            </h2>
            <p>{t("noGuarantee.p1")}</p>
            <p>{t("noGuarantee.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("useAtOwnRisk.heading")}
            </h2>
            <p>{t("useAtOwnRisk.p")}</p>
            <ul className="list-disc pl-lg space-y-xs">
              {riskItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("noProfessional.heading")}
            </h2>
            <p>{t("noProfessional.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("health.heading")}
            </h2>
            <p>{t("health.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("financial.heading")}
            </h2>
            <p>{t("financial.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("fileData.heading")}
            </h2>
            <p>{t("fileData.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("externalLinks.heading")}
            </h2>
            <p>{t("externalLinks.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("noWarranty.heading")}
            </h2>
            <p>{t("noWarranty.p")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("limitation.heading")}
            </h2>
            <p>{t("limitation.p1")}</p>
            <p>
              {parseRichString(t("limitation.seeTerms"), {
                link: richInternalLink("/terms"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("reporting.heading")}
            </h2>
            <p>
              {parseRichString(t("reporting.reportBody"), {
                link: richInternalLink("/contact"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("changes.heading")}
            </h2>
            <p>{t("changes.p")}</p>
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
