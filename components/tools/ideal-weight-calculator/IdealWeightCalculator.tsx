"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import UnitToggle from "@/components/tools/UnitToggle";
import { calculateIdealWeight } from "@/lib/calculators/ideal-weight";
import type { Gender } from "@/lib/calculators/calorie";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("ideal-weight-calculator")!;

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState("175");
  const [gender, setGender] = useState<Gender>("male");

  const result = useMemo(
    () => calculateIdealWeight(parseFloat(height), gender),
    [height, gender]
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "HealthApplication",
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Find your ideal weight range</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Compare four established formulas — Devine, Robinson, Miller, and Hamwi —
              to estimate ideal body weight based on height and gender.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          <div className="space-y-sm">
            <label htmlFor="iw-height" className="font-label text-label font-bold text-on-surface uppercase">
              Height (cm)
            </label>
            <input
              id="iw-height"
              type="number"
              min="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <div className="flex justify-between items-end">
              <span className="font-label text-label font-bold text-on-surface uppercase">Gender</span>
              <UnitToggle
                options={["male", "female"] as const}
                value={gender}
                onChange={setGender}
              />
            </div>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-primary-container/10 border border-primary-container/30 rounded-xl p-lg text-center mb-xl">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Recommended range</p>
              <p className="font-h2 text-h2 text-primary-container">
                {result.rangeKg.min} – {result.rangeKg.max} kg
              </p>
              <p className="font-small text-small text-on-surface-variant mt-xs">
                ({result.rangeLbs.min} – {result.rangeLbs.max} lbs)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {result.formulas.map((formula) => (
                <div
                  key={formula.name}
                  className="bg-surface-container-low border border-outline-variant rounded-xl p-md"
                >
                  <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                    {formula.name}
                  </p>
                  <p className="font-h3 text-h3 text-on-surface">
                    {formula.weightKg} kg
                    <span className="font-small text-small text-on-surface-variant ml-sm">
                      ({formula.weightLbs} lbs)
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </ToolWrapper>
    </>
  );
}
