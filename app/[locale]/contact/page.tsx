import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ContactForm from "@/components/contact/ContactForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type ContactPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ContactPageProps) {
  return generatePageMetadata(
    params.locale as Locale,
    "/contact",
    "contact"
  );
}

export default async function ContactPage({ params }: ContactPageProps) {
  setRequestLocale(params.locale);
  const t = await getTranslations("contactPage");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-gutter py-2xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-xs font-small text-small text-on-surface-variant hover:text-primary-container mb-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t("back")}
        </Link>

        <h1 className="font-h1 text-h1 text-on-surface mb-sm">{t("title")}</h1>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          {t("description")}
        </p>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
