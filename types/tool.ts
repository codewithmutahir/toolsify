export type ToolCategory =
  | "math"
  | "finance"
  | "fitness"
  | "text"
  | "color"
  | "converter"
  | "developer";

export type SearchVolume = "Very High" | "High" | "Medium";

export type ToolDifficulty = "Hard" | "Medium" | "Doable";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  implemented: boolean;
  featured?: boolean;
  new?: boolean;
  searchVolume?: SearchVolume;
  difficulty?: ToolDifficulty;
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
