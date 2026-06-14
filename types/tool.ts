export type ToolCategory =
  | "math"
  | "finance"
  | "fitness"
  | "text"
  | "color"
  | "converter"
  | "developer";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  category: ToolCategory;
  icon: string;
  featured?: boolean;
  new?: boolean;
}

export interface Category {
  slug: ToolCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  toolCount: number;
}
