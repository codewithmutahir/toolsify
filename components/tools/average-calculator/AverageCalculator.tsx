"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculateAverage, parseNumbers } from "@/lib/calculators/average";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("average-calculator")!;

export default function AverageCalculator() {
  const [input, setInput] = useState("10, 20, 30, 20, 15");

  const result = useMemo(() => {
    const numbers = parseNumbers(input);
    return calculateAverage(numbers);
  }, [input]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const statItems = result
    ? [
        { label: "Mean", value: result.mean },
        { label: "Median", value: result.median },
        { label: "Mode", value: result.mode.join(", ") || "—" },
        { label: "Min", value: result.min },
        { label: "Max", value: result.max },
        { label: "Count", value: result.count },
      ]
    : [];

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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Find averages from any list</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Paste or type numbers separated by commas, spaces, or new lines. Get
              mean, median, mode, minimum, and maximum values instantly.
            </p>
          </>
        }
      >
        <label htmlFor="average-input" className="font-label text-label font-bold text-on-surface uppercase block mb-sm">
          Numbers
        </label>
        <textarea
          id="average-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter numbers separated by commas or new lines..."
          rows={5}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none resize-y mb-xl"
        />

        {result ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="bg-surface-container-low border border-outline-variant rounded-xl p-md text-center"
              >
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{item.label}</p>
                <p className="font-h2 text-h2 text-primary-container">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-body text-on-surface-variant text-center">
            Enter at least one valid number to see results.
          </p>
        )}
      </ToolWrapper>
    </>
  );
}
