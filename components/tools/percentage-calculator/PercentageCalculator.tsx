"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  calculatePercentage,
  type PercentageMode,
} from "@/lib/calculators/percentage";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("percentage-calculator")!;

const tabs: { id: PercentageMode; label: string; aLabel: string; bLabel: string }[] = [
  { id: "of", label: "X% of Y", aLabel: "Percentage (X)", bLabel: "Number (Y)" },
  { id: "what-percent", label: "X is what % of Y?", aLabel: "Number (X)", bLabel: "Number (Y)" },
  { id: "change", label: "% change", aLabel: "From (X)", bLabel: "To (Y)" },
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");

  const activeTab = tabs.find((t) => t.id === mode)!;
  const result = useMemo(() => {
    return calculatePercentage(mode, parseFloat(a), parseFloat(b));
  }, [mode, a, b]);

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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              How to use the Percentage Calculator
            </h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Switch between tabs to find a percentage of a number, determine what
              percent one number is of another, or calculate percentage increase or
              decrease between two values. Results update instantly as you type.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap gap-sm mb-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={cn(
                "px-md py-sm rounded-lg font-label text-label transition-all",
                mode === tab.id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          <div className="space-y-sm">
            <label
              htmlFor="percentage-input-a"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              {activeTab.aLabel}
            </label>
            <input
              id="percentage-input-a"
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="tool-input font-h3 text-h3 rounded-xl"
            />
          </div>
          <div className="space-y-sm">
            <label
              htmlFor="percentage-input-b"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              {activeTab.bLabel}
            </label>
            <input
              id="percentage-input-b"
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="tool-input font-h3 text-h3 rounded-xl"
            />
          </div>
        </div>

        {result && (
          <div className="tool-result">
            <p className="tool-result-label mb-sm">Result</p>
            <p className="tool-result-value mb-sm">
              {mode === "of"
                ? result.value.toLocaleString()
                : `${result.value}%`}
            </p>
            <p className="font-body text-body text-on-surface-variant">{result.label}</p>
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
