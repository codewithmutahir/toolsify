import fs from "node:fs";
import { getImplementedTools } from "./constants/tools.ts";
import { SITE_URL } from "./lib/config.ts";

const tools = getImplementedTools();
const byCategory = new Map<string, typeof tools>();

for (const tool of tools) {
  const list = byCategory.get(tool.category) ?? [];
  list.push(tool);
  byCategory.set(tool.category, list);
}

const categoryTitles: Record<string, string> = {
  math: "Math & Calculators",
  finance: "Finance",
  fitness: "Fitness & Health",
  text: "Text Tools",
  color: "Design & Color",
  converter: "Converters",
  developer: "Developer Tools",
};

let output = `# Toolsify

> Free online calculators, converters, and utility tools. Fast, accurate, and no signup required.

Toolsify provides browser-based tools for math, finance, fitness, text, design, converters, and developers. Each implemented tool has a public JSON API at \`/api/tools/{slug}\`. Discover all tools via [\`/api/tools-index\`](${SITE_URL}/api/tools-index).

## Main pages

- [Home](${SITE_URL}/)
- [All Tools](${SITE_URL}/tools)
- [Browse Categories](${SITE_URL}/tools/categories)
- [Contact](${SITE_URL}/contact)
- [Privacy Policy](${SITE_URL}/privacy-policy)

## Categories

`;

for (const [slug, title] of Object.entries(categoryTitles)) {
  output += `- [${title}](${SITE_URL}/tools/${slug})\n`;
}

output += `\n## All tools (${tools.length})\n\n`;

for (const [category, categoryTools] of byCategory) {
  output += `### ${categoryTitles[category] ?? category}\n\n`;
  for (const tool of categoryTools) {
    output += `- [${tool.title}](${SITE_URL}/${tool.slug}) — API: \`${SITE_URL}/api/tools/${tool.slug}\`\n`;
  }
  output += "\n";
}

output += `## Agent discovery

- [Tool registry API](${SITE_URL}/api/tools-index)
- [OpenAPI spec](${SITE_URL}/api/openapi)
- [auth.md](${SITE_URL}/auth.md) — agent registration instructions

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml)
- [Robots](${SITE_URL}/robots.txt)
`;

fs.writeFileSync("public/llms.txt", output);
console.log(`Wrote public/llms.txt with ${tools.length} tools`);
