"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  convertUnit,
  getCategoryUnits,
  unitCategories,
  type UnitCategory,
} from "@/lib/calculators/unit-converter";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("unit-converter")!;

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnitId, setFromUnitId] = useState("m");
  const [toUnitId, setToUnitId] = useState("ft");
  const [value, setValue] = useState("1");

  const units = useMemo(() => getCategoryUnits(category), [category]);

  const fromUnit = units.find((u) => u.id === fromUnitId) ?? units[0];
  const toUnit = units.find((u) => u.id === toUnitId) ?? units[1] ?? units[0];

  const result = useMemo(() => {
    if (!fromUnit || !toUnit) return null;
    return convertUnit(parseFloat(value), fromUnit, toUnit);
  }, [value, fromUnit, toUnit]);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const catUnits = getCategoryUnits(cat);
    setFromUnitId(catUnits[0]?.id ?? "");
    setToUnitId(catUnits[1]?.id ?? catUnits[0]?.id ?? "");
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">Convert units across categories</h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Switch between length, weight, temperature, speed, and area units. Enter a
              value and select source and target units for instant conversion.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap gap-sm mb-xl">
          {unitCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "px-md py-sm rounded-lg font-label text-label transition-all",
                category === cat.id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl items-end">
          <div className="space-y-sm">
            <label htmlFor="uc-value" className="font-label text-label font-bold text-on-surface uppercase">
              Value
            </label>
            <input
              id="uc-value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="uc-from" className="font-label text-label font-bold text-on-surface uppercase">
              From
            </label>
            <select
              id="uc-from"
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-sm">
            <label htmlFor="uc-to" className="font-label text-label font-bold text-on-surface uppercase">
              To
            </label>
            <select
              id="uc-to"
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {result !== null && fromUnit && toUnit && (
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-xl text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">Result</p>
            <p className="font-display text-h1 text-primary-container">
              {result.toLocaleString()} {toUnit.label}
            </p>
            <p className="font-small text-small text-on-surface-variant mt-sm">
              {value} {fromUnit.label} =
            </p>
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
