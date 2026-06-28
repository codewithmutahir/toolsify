import { categories } from "@/constants/categories";
import {
  getImplementedTools,
  getToolBySlug,
  getToolsByCategory,
} from "@/constants/tools";
import { getCategoryTitle } from "@/lib/category-colors";
import { SITE_URL } from "@/lib/config";
import { searchTools } from "@/lib/search-tools";
import { Tool, ToolCategory } from "@/types/tool";

const TOOL_CATEGORIES: ToolCategory[] = [
  "math",
  "finance",
  "fitness",
  "text",
  "color",
  "converter",
  "developer",
];

function getModelContext(): WebMcpModelContext | undefined {
  if (typeof document !== "undefined" && document.modelContext) {
    return document.modelContext;
  }

  if (typeof navigator !== "undefined" && navigator.modelContext) {
    return navigator.modelContext;
  }

  return undefined;
}

function formatToolSummary(tool: Tool) {
  return {
    slug: tool.slug,
    title: tool.title,
    description: tool.shortDesc,
    category: tool.category,
    categoryLabel: getCategoryTitle(tool.category),
    url: `${SITE_URL}/${tool.slug}`,
    implemented: tool.implemented,
    featured: Boolean(tool.featured),
    tags: tool.tags,
  };
}

export interface RegisterWebMcpToolsOptions {
  navigate: (url: string) => void;
  signal: AbortSignal;
}

export async function registerWebMcpTools({
  navigate,
  signal,
}: RegisterWebMcpToolsOptions): Promise<void> {
  const modelContext = getModelContext();

  if (!modelContext || typeof modelContext.registerTool !== "function") {
    return;
  }

  const registerOptions = { signal };

  await Promise.all([
    modelContext.registerTool(
      {
        name: "search-tools",
        title: "Search Tools",
        description:
          "Search Toolsify for digital tools and productivity utilities by keyword. Returns matching tools with titles, descriptions, categories, and URLs.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "Search query (minimum 2 characters), e.g. BMI, JSON, percentage.",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 20,
              description: "Maximum number of results to return (default 10).",
            },
            implementedOnly: {
              type: "boolean",
              description:
                "When true, only return tools that are currently available on the site.",
            },
          },
          required: ["query"],
        },
        annotations: { readOnlyHint: true },
        async execute({ query, limit = 10, implementedOnly = true }) {
          const results = searchTools(String(query), {
            limit: Number(limit),
            implementedOnly: Boolean(implementedOnly),
          });

          return {
            query,
            count: results.length,
            tools: results.map(formatToolSummary),
          };
        },
      },
      registerOptions
    ),

    modelContext.registerTool(
      {
        name: "get-tool-details",
        title: "Get Tool Details",
        description:
          "Get detailed information about a specific Toolsify tool by its slug.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description:
                "Tool slug, e.g. bmi-calculator, word-counter, json-formatter.",
            },
          },
          required: ["slug"],
        },
        annotations: { readOnlyHint: true },
        async execute({ slug }) {
          const tool = getToolBySlug(String(slug));

          if (!tool) {
            return {
              found: false,
              slug,
              message: `No tool found with slug "${slug}".`,
            };
          }

          return {
            found: true,
            tool: {
              ...formatToolSummary(tool),
              fullDescription: tool.description,
            },
          };
        },
      },
      registerOptions
    ),

    modelContext.registerTool(
      {
        name: "list-tools",
        title: "List Tools",
        description:
          "List available Toolsify tools, optionally filtered by category.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: TOOL_CATEGORIES,
              description:
                "Optional category filter: math, finance, fitness, text, color, converter, or developer.",
            },
          },
        },
        annotations: { readOnlyHint: true },
        async execute({ category } = {}) {
          const tools = category
            ? getToolsByCategory(category as ToolCategory).filter(
                (tool) => tool.implemented
              )
            : getImplementedTools();

          return {
            count: tools.length,
            category: category ?? null,
            tools: tools.map(formatToolSummary),
          };
        },
      },
      registerOptions
    ),

    modelContext.registerTool(
      {
        name: "list-categories",
        title: "List Categories",
        description:
          "List all Toolsify tool categories with descriptions and browse URLs.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        annotations: { readOnlyHint: true },
        async execute() {
          return {
            count: categories.length,
            categories: categories.map((category) => ({
              slug: category.slug,
              title: category.title,
              description: category.description,
              toolCount: category.toolCount,
              url: `${SITE_URL}/tools/${category.slug}`,
            })),
          };
        },
      },
      registerOptions
    ),

    modelContext.registerTool(
      {
        name: "navigate-to-tool",
        title: "Navigate to Tool",
        description:
          "Open a Toolsify tool page in the browser. Use after searching or listing tools to take the user to a specific calculator or utility.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description:
                "Tool slug to open, e.g. bmi-calculator or emi-calculator.",
            },
          },
          required: ["slug"],
        },
        annotations: { readOnlyHint: false },
        async execute({ slug }) {
          const tool = getToolBySlug(String(slug));

          if (!tool) {
            return {
              success: false,
              slug,
              message: `No tool found with slug "${slug}".`,
            };
          }

          if (!tool.implemented) {
            return {
              success: false,
              slug,
              message: `"${tool.title}" is not yet available on Toolsify.`,
            };
          }

          const url = `/${tool.slug}`;
          navigate(url);

          return {
            success: true,
            slug: tool.slug,
            title: tool.title,
            url: `${SITE_URL}${url}`,
          };
        },
      },
      registerOptions
    ),
  ]);
}
