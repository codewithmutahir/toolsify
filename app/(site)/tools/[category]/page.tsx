import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/constants/categories";
import { getToolsByCategory } from "@/constants/tools";
import { generateCategoryMetadata } from "@/lib/seo";
import CategoryHero from "@/components/tools/CategoryHero";
import JsonLd from "@/components/seo/JsonLd";
import NewsletterCta from "@/components/tools/NewsletterCta";
import ToolCard from "@/components/tools/ToolCard";

type CategoryPageProps = {
  params: { category: string };
};

export async function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);
  if (!category) {
    return {};
  }
  return generateCategoryMetadata(category);
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(category.slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://toolsify.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://toolsify.online/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: `https://toolsify.online/tools/${category.slug}`,
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
              Home
            </Link>
          </li>
          <li>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </li>
          <li>
            <Link href="/tools" className="hover:text-primary transition-colors">
              Tools
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
            <span>See all tools</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_right_alt
            </span>
          </Link>
        </div>
      </section>

      <NewsletterCta
        description={`Get notified when we add new ${category.title.toLowerCase()} calculators or utility tools to our platform.`}
      />
    </>
  );
}
