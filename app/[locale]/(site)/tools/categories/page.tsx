import { setRequestLocale } from "next-intl/server";
import CategoryCard from "@/components/home/CategoryCard";
import { categories } from "@/constants/categories";
import { generatePageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type CategoriesPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: CategoriesPageProps) {
  return generatePageMetadata(
    params.locale as Locale,
    "/tools/categories",
    "categories"
  );
}

export default function CategoriesPage({ params }: CategoriesPageProps) {
  setRequestLocale(params.locale);

  return (
    <main>
      <section className="max-w-container-max mx-auto px-gutter pt-xl pb-lg text-center">
        <h1 className="font-display text-h1-mobile md:text-h1 text-on-surface mb-md">
          Browse by Category
        </h1>
        <p className="font-body text-body text-on-surface-variant max-w-2xl mx-auto">
          Find the right calculator or converter for your task across{" "}
          {categories.length} categories.
        </p>
      </section>

      <section className="max-w-container-max mx-auto px-gutter pb-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-md">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </main>
  );
}
