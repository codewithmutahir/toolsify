import type { Metadata } from "next";
import CategoryCard from "@/components/home/CategoryCard";
import { categories } from "@/constants/categories";

export const metadata: Metadata = {
  title: "Browse Tool Categories — Calculators, Converters & More | Toolsify",
  description:
    "Browse free online tools by category: math, finance, fitness, text, design, converters, and developer utilities.",
  alternates: {
    canonical: "https://toolsify.online/tools/categories",
  },
  robots: { index: true, follow: true },
};

export default function CategoriesPage() {
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
