import { ToolCategory } from "@/types/tool";

export const categoryHeroBadges: Record<
  ToolCategory,
  { label: string; icon: string }
> = {
  math: { label: "Math Suite", icon: "functions" },
  finance: { label: "Financial Suite", icon: "account_balance_wallet" },
  fitness: { label: "Health Suite", icon: "fitness_center" },
  text: { label: "Text Suite", icon: "subject" },
  color: { label: "Design Suite", icon: "palette" },
  converter: { label: "Converter Suite", icon: "sync_alt" },
  developer: { label: "Dev Suite", icon: "code" },
};

export const categoryBorderHover: Record<ToolCategory, string> = {
  math: "hover:border-primary/50",
  finance: "hover:border-secondary/50",
  fitness: "hover:border-tertiary/50",
  text: "hover:border-primary/50",
  color: "hover:border-secondary/50",
  converter: "hover:border-tertiary/50",
  developer: "hover:border-primary/50",
};

export const categoryIconHover: Record<ToolCategory, string> = {
  math: "group-hover:bg-primary-container group-hover:text-on-primary",
  finance: "group-hover:bg-secondary-container group-hover:text-on-secondary",
  fitness: "group-hover:bg-tertiary-container group-hover:text-on-tertiary",
  text: "group-hover:bg-primary-container group-hover:text-on-primary",
  color: "group-hover:bg-secondary-container group-hover:text-on-secondary",
  converter: "group-hover:bg-tertiary-container group-hover:text-on-tertiary",
  developer: "group-hover:bg-primary-container group-hover:text-on-primary",
};
