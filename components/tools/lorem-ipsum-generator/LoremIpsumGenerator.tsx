"use client";

import { useCallback, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { generateLoremIpsum } from "@/lib/calculators/lorem-ipsum";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("lorem-ipsum-generator")!;

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState("3");
  const [wrapHtml, setWrapHtml] = useState(false);
  const [output, setOutput] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<"copied" | "error" | null>(
    null
  );

  const generate = useCallback(() => {
    const count = parseInt(paragraphs, 10) || 1;
    setOutput(generateLoremIpsum(count, wrapHtml));
  }, [paragraphs, wrapHtml]);

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopyFeedback("copied");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyFeedback("error");
    }
    window.setTimeout(() => setCopyFeedback(null), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Generate placeholder text</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Create lorem ipsum paragraphs for design mockups and prototypes. Choose
              how many paragraphs to generate and optionally wrap output in HTML tags.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap items-end gap-lg mb-xl">
          <div className="space-y-sm flex-1 min-w-[140px]">
            <label htmlFor="lorem-paragraphs" className="font-label text-label font-bold text-on-surface uppercase">
              Paragraphs
            </label>
            <input
              id="lorem-paragraphs"
              type="number"
              min="1"
              max="20"
              value={paragraphs}
              onChange={(e) => setParagraphs(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <label className="flex items-center gap-sm font-body text-body text-on-surface cursor-pointer pb-md">
            <input
              type="checkbox"
              checked={wrapHtml}
              onChange={(e) => setWrapHtml(e.target.checked)}
              className="rounded border-outline-variant text-primary-container focus:ring-primary-container"
            />
            Wrap in HTML &lt;p&gt; tags
          </label>
          <button
            type="button"
            onClick={generate}
            className="bg-primary-container text-on-primary font-h3 text-h3 px-xl py-md rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Generate
          </button>
        </div>

        {output && (
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-center mb-sm">
              <p className="font-label text-label text-on-surface-variant uppercase font-bold">Output</p>
              <button
                type="button"
                onClick={copyOutput}
                className="text-primary-container font-label text-label font-bold hover:opacity-80"
              >
                {copyFeedback === "copied"
                  ? "Copied"
                  : copyFeedback === "error"
                    ? "Copy failed"
                    : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={10}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-md font-body text-body outline-none resize-y"
            />
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
