"use client";

import { useMemo, useRef, useState } from "react";
import createDOMPurify from "dompurify";
import { marked } from "marked";
import CopyButton from "@/components/tools/shared/CopyButton";
import { cn } from "@/lib/utils";

const DEFAULT_MARKDOWN = `# Markdown Editor

Write **bold**, *italic*, and \`inline code\` with live preview.

- Bullet lists
- Numbered lists
- [Links](https://toolsify.online)

\`\`\`js
console.log("Hello Toolsify");
\`\`\`
`;

type ToolbarAction = {
  label: string;
  icon: string;
  before: string;
  after: string;
  placeholder?: string;
};

const toolbarActions: ToolbarAction[] = [
  { label: "Bold", icon: "format_bold", before: "**", after: "**", placeholder: "bold" },
  { label: "Italic", icon: "format_italic", before: "*", after: "*", placeholder: "italic" },
  { label: "Link", icon: "link", before: "[", after: "](https://)", placeholder: "text" },
  { label: "Image", icon: "image", before: "![", after: "](https://)", placeholder: "alt" },
  { label: "Code block", icon: "code", before: "\n```\n", after: "\n```\n", placeholder: "code" },
  { label: "Bullet list", icon: "format_list_bulleted", before: "\n- ", after: "", placeholder: "item" },
  { label: "Numbered list", icon: "format_list_numbered", before: "\n1. ", after: "", placeholder: "item" },
  { label: "Heading", icon: "title", before: "## ", after: "", placeholder: "Heading" },
];

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const html = useMemo(() => {
    const raw = marked.parse(markdown, { async: false }) as string;
    if (typeof window === "undefined") return "";
    return createDOMPurify(window).sanitize(raw);
  }, [markdown]);

  function applyToolbarAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.slice(start, end) || action.placeholder || "";
    const updated =
      markdown.slice(0, start) +
      action.before +
      selected +
      action.after +
      markdown.slice(end);

    setMarkdown(updated);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + action.before.length + selected.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <>
      <div className="flex flex-wrap gap-sm mb-md">
        {toolbarActions.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.label}
            onClick={() => applyToolbarAction(action)}
            className="inline-flex items-center gap-xs px-sm py-sm rounded-lg border border-outline-variant bg-surface-container-low hover:border-primary-container/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {action.icon}
            </span>
            <span className="font-label text-label hidden sm:inline">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-sm mb-lg">
        <CopyButton value={markdown} label="Copy Markdown" />
        <CopyButton value={html} label="Copy as HTML" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div>
          <label
            htmlFor="markdown-input"
            className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
          >
            Markdown
          </label>
          <textarea
            id="markdown-input"
            ref={textareaRef}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            rows={18}
            className="w-full min-h-[360px] bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-mono text-small focus:ring-2 focus:ring-primary-container outline-none resize-y"
          />
        </div>
        <div>
          <p className="font-label text-label font-bold text-on-surface uppercase block mb-sm">
            Preview
          </p>
          <div
            className={cn(
              "min-h-[360px] bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md",
              "prose prose-sm max-w-none text-on-surface",
              "[&_h1]:font-h1 [&_h2]:font-h2 [&_h3]:font-h3",
              "[&_a]:text-primary-container [&_code]:bg-surface-container [&_code]:px-1 [&_code]:rounded"
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  );
}
