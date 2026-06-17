import { Category } from "@/types/tool";
import { categoryHeroBadges } from "@/lib/category-hero";

interface CategoryHeroProps {
  category: Category;
}

const categoryIconColors: Record<Category["color"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

function getCategoryPageTitle(title: string): string {
  if (
    title.endsWith("Tools") ||
    title.endsWith("Calculators") ||
    title.endsWith("Converters")
  ) {
    return title;
  }
  return `${title} Tools`;
}

export default function CategoryHero({ category }: CategoryHeroProps) {
  const badge = categoryHeroBadges[category.slug];
  const iconColor = categoryIconColors[category.color as Category["color"]];

  return (
    <section className="w-full bg-gradient-to-br from-primary-fixed to-surface-container-low py-2xl mb-2xl">
      <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row items-center gap-xl">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-sm bg-primary-container/10 text-primary px-4 py-1 rounded-full mb-md">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {badge.icon}
            </span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              {badge.label}
            </span>
          </div>
          <h1 className="font-display text-h1-mobile md:text-display text-on-surface mb-md">
            {getCategoryPageTitle(category.title)}
          </h1>
          <p className="font-body text-body text-on-surface-variant max-w-lg mx-auto md:mx-0">
            {category.toolCount} free {category.title.toLowerCase()} for your
            daily calculations. {category.description}
          </p>
        </div>

        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 bg-primary-container opacity-20 blur-3xl rounded-full" />
          <div className="relative bg-white p-xl rounded-2xl shadow-xl border border-outline-variant/30 flex items-center justify-center">
            <span
              className={`material-symbols-outlined text-[80px] md:text-[120px] ${iconColor}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {category.icon}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
