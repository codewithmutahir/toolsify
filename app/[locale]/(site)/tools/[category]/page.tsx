import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { categories } from "@/constants/categories";
import { getToolsByCategory } from "@/constants/tools";
import { generateCategoryMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { localePath } from "@/lib/i18n/metadata";
import { getLocalizedCategoryBySlug, getLocalizedTools } from "@/lib/i18n/server";
import { Link } from "@/i18n/navigation";
import CategoryHero from "@/components/tools/CategoryHero";
import JsonLd from "@/components/seo/JsonLd";
import RequestToolCta from "@/components/tools/RequestToolCta";
import ToolCard from "@/components/tools/ToolCard";
import { routing, type Locale } from "@/i18n/routing";

type CategoryPageProps = {
  params: { locale: string; category: string };
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      category: category.slug,
    }))
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getLocalizedCategoryBySlug(params.category);
  if (!category) {
    return {};
  }
  return generateCategoryMetadata(
    category,
    params.locale as Locale,
    `/tools/${params.category}`
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  setRequestLocale(params.locale);

  const category = await getLocalizedCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const t = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const categoryTools = await getLocalizedTools(
    getToolsByCategory(category.slug)
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
        item: `${SITE_URL}${localePath(params.locale as Locale)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("allTools"),
        item: `${SITE_URL}${localePath(params.locale as Locale, "/tools")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: `${SITE_URL}${localePath(params.locale as Locale, `/tools/${category.slug}`)}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <nav className="w-full max-w-container-max mx-auto px-gutter py-md">
        <ol className="flex items-center gap-xs font-small text-on-surface-variant flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {t("home")}
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </li>
          <li>
            <Link href="/tools" className="hover:text-primary transition-colors">
              {tNav("allTools")}
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </li>
          <li className="font-semibold text-on-surface">{category.title}</li>
        </ol>
      </nav>

      <CategoryHero category={category} />

      <section className="max-w-container-max mx-auto px-gutter mb-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="listing" />
          ))}
        </div>

        <div className="mt-xl flex justify-center">
          <Link
            href="/tools"
            className="group flex items-center gap-sm px-xl py-md bg-white border border-outline-variant rounded-full font-label text-primary hover:bg-primary-fixed transition-colors"
          >
            <span>{tNav("allTools")}</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_right_alt
            </span>
          </Link>
        </div>
      </section>

      <RequestToolCta />
    </>
  );
}
