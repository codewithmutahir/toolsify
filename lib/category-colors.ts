import { ToolCategory } from "@/types/tool";

export interface CategoryColorClasses {
  badge: string;
  iconBg: string;
  iconHover: string;
}

/** Vibrant category styles matching reference design (category cards + popular tool badges) */
export const categoryHomeStyles: Record<
  ToolCategory,
  {
    iconBg: string;
    iconText: string;
    iconHover: string;
    badgeBg: string;
    badgeText: string;
    badgeCountText: string;
  }
> = {
  math: {
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    iconHover: "group-hover:bg-blue-200",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    badgeCountText: "text-blue-700",
  },
  finance: {
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    iconHover: "group-hover:bg-green-200",
    badgeBg: "bg-green-50",
    badgeText: "text-green-600",
    badgeCountText: "text-green-700",
  },
  fitness: {
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    iconHover: "group-hover:bg-red-200",
    badgeBg: "bg-red-50",
    badgeText: "text-red-600",
    badgeCountText: "text-red-700",
  },
  text: {
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    iconHover: "group-hover:bg-amber-200",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    badgeCountText: "text-amber-700",
  },
  color: {
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    iconHover: "group-hover:bg-purple-200",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
    badgeCountText: "text-purple-700",
  },
  converter: {
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
    iconHover: "group-hover:bg-cyan-200",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-600",
    badgeCountText: "text-cyan-700",
  },
  developer: {
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
    iconHover: "group-hover:bg-gray-200",
    badgeBg: "bg-gray-50",
    badgeText: "text-gray-600",
    badgeCountText: "text-gray-700",
  },
};

export const categoryColorMap: Record<ToolCategory, CategoryColorClasses> = {
  math: {
    badge: `${categoryHomeStyles.math.badgeBg} ${categoryHomeStyles.math.badgeText}`,
    iconBg: `${categoryHomeStyles.math.iconBg} ${categoryHomeStyles.math.iconText}`,
    iconHover: categoryHomeStyles.math.iconHover,
  },
  finance: {
    badge: `${categoryHomeStyles.finance.badgeBg} ${categoryHomeStyles.finance.badgeText}`,
    iconBg: `${categoryHomeStyles.finance.iconBg} ${categoryHomeStyles.finance.iconText}`,
    iconHover: categoryHomeStyles.finance.iconHover,
  },
  fitness: {
    badge: "bg-tertiary-container/10 text-tertiary-container",
    iconBg: `${categoryHomeStyles.fitness.iconBg} ${categoryHomeStyles.fitness.iconText}`,
    iconHover: categoryHomeStyles.fitness.iconHover,
  },
  text: {
    badge: `${categoryHomeStyles.text.badgeBg} ${categoryHomeStyles.text.badgeText}`,
    iconBg: `${categoryHomeStyles.text.iconBg} ${categoryHomeStyles.text.iconText}`,
    iconHover: categoryHomeStyles.text.iconHover,
  },
  color: {
    badge: `${categoryHomeStyles.color.badgeBg} ${categoryHomeStyles.color.badgeText}`,
    iconBg: `${categoryHomeStyles.color.iconBg} ${categoryHomeStyles.color.iconText}`,
    iconHover: categoryHomeStyles.color.iconHover,
  },
  converter: {
    badge: `${categoryHomeStyles.converter.badgeBg} ${categoryHomeStyles.converter.badgeText}`,
    iconBg: `${categoryHomeStyles.converter.iconBg} ${categoryHomeStyles.converter.iconText}`,
    iconHover: categoryHomeStyles.converter.iconHover,
  },
  developer: {
    badge: `${categoryHomeStyles.developer.badgeBg} ${categoryHomeStyles.developer.badgeText}`,
    iconBg: `${categoryHomeStyles.developer.iconBg} ${categoryHomeStyles.developer.iconText}`,
    iconHover: categoryHomeStyles.developer.iconHover,
  },
};

export function getCategoryTitle(category: ToolCategory): string {
  const titles: Record<ToolCategory, string> = {
    math: "Math & Calculators",
    finance: "Finance",
    fitness: "Fitness & Health",
    text: "Text Tools",
    color: "Color & Design",
    converter: "Unit Converters",
    developer: "Developer Tools",
  };
  return titles[category];
}

export const categoryShortNames: Record<ToolCategory, string> = {
  math: "Math",
  finance: "Finance",
  fitness: "Fitness",
  text: "Text Tools",
  color: "Design",
  converter: "Converters",
  developer: "Developer",
};

/** @deprecated use categoryHomeStyles */
export const categoryCardStyles = categoryHomeStyles;

export const categoryShortLabels: Record<ToolCategory, string> = {
  math: "Math",
  finance: "Finance",
  fitness: "Fitness",
  text: "Text",
  color: "Design",
  converter: "Converter",
  developer: "Dev",
};
