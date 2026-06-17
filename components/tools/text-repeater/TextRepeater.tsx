"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { repeatText } from "@/lib/calculators/text-repeater";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("text-repeater")!;

export default function TextRepeater() {
  const [text, setText] = useState("Hello");
  const [count, setCount] = useState("5");
  const [separator, setSeparator] = useState(", ");

  const output = useMemo(
    () => repeatText(text, parseInt(count, 10) || 0, separator),
    [text, count, separator]
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Repeat text with custom separators</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Duplicate any string multiple times with a separator between each copy.
              Useful for generating lists, test data, or patterns.
            </p>
          </>
        }
      >
        <div className="space-y-lg mb-xl">
          <div className="space-y-sm">
            <label htmlFor="repeater-text" className="font-label text-label font-bold text-on-surface uppercase">
              Text to repeat
            </label>
            <input
              id="repeater-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-sm">
              <label htmlFor="repeater-count" className="font-label text-label font-bold text-on-surface uppercase">
                Repeat count
              </label>
              <input
                id="repeater-count"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
              />
            </div>
            <div className="space-y-sm">
              <label htmlFor="repeater-separator" className="font-label text-label font-bold text-on-surface uppercase">
                Separator
              </label>
              <input
                id="repeater-separator"
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                placeholder=", "
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg">
          <p className="font-label text-label text-on-surface-variant uppercase font-bold mb-sm">Output</p>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-md font-body text-body outline-none resize-y"
          />
        </div>
      </ToolWrapper>
    </>
  );
}
