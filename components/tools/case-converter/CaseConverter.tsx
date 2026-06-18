"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { caseModes, convertCase } from "@/lib/calculators/case-converter";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("case-converter")!;

export default function CaseConverter() {
  const [text, setText] = useState("Hello World Example Text");

  const outputs = useMemo(
    () =>
      caseModes.map((mode) => ({
        ...mode,
        result: convertCase(text, mode.id),
      })),
    [text]
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const [copyFeedback, setCopyFeedback] = useState<{
    id: string;
    ok: boolean;
  } | null>(null);

  const copyToClipboard = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback({ id, ok: true });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyFeedback({ id, ok: false });
    }
    window.setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <>
      <JsonLd data={schema} />
      <ToolWrapper
        title={tool.title}
        description={tool.description}
        category={tool.category}
        slug={tool.slug}
        seoContent={
          <>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Convert text between 7 case styles</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Transform text to uppercase, lowercase, title case, sentence case,
              camelCase, snake_case, or kebab-case. Copy any output with one click.
            </p>
          </>
        }
      >
        <label htmlFor="case-input" className="font-label text-label font-bold text-on-surface uppercase block mb-sm">
          Input text
        </label>
        <textarea
          id="case-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none resize-y mb-xl"
        />

        <div className="space-y-md">
          {outputs.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low border border-outline-variant rounded-xl p-md"
            >
              <div className="flex justify-between items-center mb-sm">
                <p className="font-label text-label text-on-surface-variant uppercase font-bold">
                  {item.label}
                </p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.result, item.id)}
                  className="text-primary-container font-label text-label font-bold hover:opacity-80 flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copyFeedback?.id === item.id
                      ? copyFeedback.ok
                        ? "check"
                        : "error"
                      : "content_copy"}
                  </span>
                  {copyFeedback?.id === item.id
                    ? copyFeedback.ok
                      ? "Copied"
                      : "Copy failed"
                    : "Copy"}
                </button>
              </div>
              <p className="font-body text-body text-on-surface break-all">{item.result || "—"}</p>
            </div>
          ))}
        </div>
      </ToolWrapper>
    </>
  );
}
