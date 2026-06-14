import { ToolCategory } from "@/types/tool";

export interface CategoryColorClasses {
  badge: string;
  iconBg: string;
  iconHover: string;
}

export const categoryColorMap: Record<ToolCategory, CategoryColorClasses> = {
  math: {
    badge: "bg-secondary-container/10 text-secondary-container",
    iconBg: "bg-secondary-container/10 text-secondary-container",
    iconHover: "group-hover:bg-secondary-container group-hover:text-on-secondary",
  },
  finance: {
    badge: "bg-tertiary-container/10 text-tertiary-container",
    iconBg: "bg-tertiary-container/10 text-tertiary-container",
    iconHover: "group-hover:bg-tertiary-container group-hover:text-on-tertiary",
  },
  fitness: {
    badge: "bg-tertiary/10 text-tertiary",
    iconBg: "bg-tertiary/10 text-tertiary",
    iconHover: "group-hover:bg-tertiary group-hover:text-on-tertiary",
  },
  text: {
    badge: "bg-primary/10 text-primary",
    iconBg: "bg-primary/10 text-primary",
    iconHover: "group-hover:bg-primary group-hover:text-on-primary",
  },
  color: {
    badge: "bg-surface-variant/10 text-on-surface-variant",
    iconBg: "bg-surface-variant/10 text-on-surface-variant",
    iconHover: "group-hover:bg-surface-variant group-hover:text-on-surface",
  },
  converter: {
    badge: "bg-primary-container/10 text-primary-container",
    iconBg: "bg-primary-container/10 text-primary-container",
    iconHover: "group-hover:bg-primary-container group-hover:text-on-primary-container",
  },
  developer: {
    badge: "bg-on-surface/10 text-on-surface",
    iconBg: "bg-on-surface/10 text-on-surface",
    iconHover: "group-hover:bg-on-surface group-hover:text-surface",
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

export const categoryCardStyles: Record<
  ToolCategory,
  { iconBg: string; iconText: string; iconHover: string; badgeBg: string; badgeText: string }
> = {
  math: {
    iconBg: "bg-secondary-container/10",
    iconText: "text-secondary-container",
    iconHover: "group-hover:bg-secondary-container/20",
    badgeBg: "bg-secondary-container/10",
    badgeText: "text-secondary-container",
  },
  finance: {
    iconBg: "bg-tertiary-container/10",
    iconText: "text-tertiary-container",
    iconHover: "group-hover:bg-tertiary-container/20",
    badgeBg: "bg-tertiary-container/10",
    badgeText: "text-tertiary-container",
  },
  fitness: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    iconHover: "group-hover:bg-primary/20",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
  },
  text: {
    iconBg: "bg-primary-container/10",
    iconText: "text-primary-container",
    iconHover: "group-hover:bg-primary-container/20",
    badgeBg: "bg-primary-container/10",
    badgeText: "text-primary-container",
  },
  color: {
    iconBg: "bg-surface-variant/30",
    iconText: "text-on-surface-variant",
    iconHover: "group-hover:bg-surface-variant/50",
    badgeBg: "bg-surface-variant/30",
    badgeText: "text-on-surface-variant",
  },
  converter: {
    iconBg: "bg-tertiary/10",
    iconText: "text-tertiary",
    iconHover: "group-hover:bg-tertiary/20",
    badgeBg: "bg-tertiary/10",
    badgeText: "text-tertiary",
  },
  developer: {
    iconBg: "bg-on-surface-variant/10",
    iconText: "text-on-surface-variant",
    iconHover: "group-hover:bg-on-surface-variant/20",
    badgeBg: "bg-on-surface-variant/10",
    badgeText: "text-on-surface-variant",
  },
};

export const categoryShortLabels: Record<ToolCategory, string> = {
  math: "Math",
  finance: "Finance",
  fitness: "Fitness",
  text: "Text",
  color: "Design",
  converter: "Converter",
  developer: "Dev",
};
