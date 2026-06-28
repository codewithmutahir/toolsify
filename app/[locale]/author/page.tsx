import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { generatePageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { localePath } from "@/lib/i18n/metadata";
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
  return generatePageMetadata(params.locale as Locale, "/author", "author");
}

export default async function AuthorPage({ params }: PageProps) {
  setRequestLocale(params.locale);
  const locale = params.locale as Locale;
  const t = await getTranslations("authorPage");
  const lastUpdated = formatLocalizedDate(locale, STATIC_PAGE_LAST_UPDATED);
  const skills = t.raw("expertise.skills") as string[];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mutahir Hussain",
    jobTitle: t("schema.jobTitle"),
    description: t("schema.description"),
    url: `${SITE_URL}${localePath(locale, "/author")}`,
    worksFor: {
      "@type": "Organization",
      name: "Toolsify",
      url: SITE_URL,
    },
    knowsAbout: skills,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={personSchema} />
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">{t("title")}</h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          {t("lastUpdated", { date: lastUpdated })}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("intro.heading")}
            </h2>
            <p>{t("intro.p1")}</p>
            <p>{t("intro.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("whyExists.heading")}
            </h2>
            <p>{t("whyExists.p1")}</p>
            <p>{t("whyExists.p2")}</p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("expertise.heading")}
            </h2>
            <ul className="list-disc pl-lg space-y-xs">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("trust.heading")}
            </h2>
            <p>{t("trust.p1")}</p>
            <p>
              {parseRichString(t("trust.getInTouch"), {
                link: richInternalLink("/contact"),
              })}
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              {t("learnMore.heading")}
            </h2>
            <p>
              {parseRichString(t("learnMore.aboutLink"), {
                link: richInternalLink("/about"),
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
