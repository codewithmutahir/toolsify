import { parse, HTMLElement } from "node-html-parser";
import TurndownService from "turndown";

const REMOVE_SELECTORS = [
  "nav",
  "header",
  "footer",
  "script",
  "style",
  "noscript",
  "[data-no-markdown]",
];

function yamlValue(value: string): string {
  if (/[:#\n\r]/.test(value) || value.startsWith(" ") || value.endsWith(" ")) {
    return JSON.stringify(value);
  }
  return value;
}

function buildFrontmatter(meta: {
  title?: string;
  description?: string;
  image?: string;
}): string | null {
  const lines: string[] = [];
  if (meta.title) lines.push(`title: ${yamlValue(meta.title)}`);
  if (meta.description) lines.push(`description: ${yamlValue(meta.description)}`);
  if (meta.image) lines.push(`image: ${yamlValue(meta.image)}`);
  if (lines.length === 0) return null;
  return `---\n${lines.join("\n")}\n---`;
}

function metaContent(root: HTMLElement, selector: string): string | undefined {
  return root.querySelector(selector)?.getAttribute("content")?.trim();
}

export function htmlToMarkdown(html: string): string {
  const root = parse(html);

  const title =
    metaContent(root, 'meta[name="title"]') ||
    root.querySelector("title")?.text?.trim() ||
    metaContent(root, 'meta[property="og:title"]');
  const description =
    metaContent(root, 'meta[name="description"]') ||
    metaContent(root, 'meta[property="og:description"]');
  const image = metaContent(root, 'meta[property="og:image"]');

  const jsonLdBlocks: string[] = [];
  root.querySelectorAll('script[type="application/ld+json"]').forEach((element) => {
    const content = element.text?.trim();
    if (content) jsonLdBlocks.push(content);
  });

  for (const selector of REMOVE_SELECTORS) {
    root.querySelectorAll(selector).forEach((element) => element.remove());
  }

  const contentRoot = root.querySelector("main") ?? root.querySelector("body") ?? root;
  const contentHtml = contentRoot.innerHTML.trim();

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });
  const body = turndown.turndown(contentHtml).trim();

  const parts: string[] = [];
  const frontmatter = buildFrontmatter({ title, description, image });
  if (frontmatter) parts.push(frontmatter);
  if (body) parts.push(body);
  if (jsonLdBlocks.length > 0) {
    parts.push(`\`\`\`json\n${jsonLdBlocks.join("\n")}\n\`\`\``);
  }

  return parts.join("\n\n").trim();
}
