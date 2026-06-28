import type { ReactNode } from "react";

type TagRenderer = (chunks: ReactNode) => ReactNode;

/** Renders simple XML-like tags in translated strings (e.g. `<link>text</link>`). */
export function parseRichString(
  text: string,
  tags: Record<string, TagRenderer>
): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const tagName = match[1];
    const content = match[2];
    const renderer = tags[tagName];
    parts.push(renderer ? renderer(content) : content);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}
