"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { calculateSimpleInterest } from "@/lib/calculators/simple-interest";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("simple-interest-calculator")!;

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("3");

  const result = useMemo(
    () =>
      calculateSimpleInterest(
        parseFloat(principal),
        parseFloat(rate),
        parseFloat(time)
      ),
    [principal, rate, time]
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
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              What is simple interest?
            </h2>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              Simple interest is calculated only on the principal amount. The formula
              is I = P × R × T / 100, where P is principal, R is annual rate (%), and
              T is time in years. Total amount equals principal plus interest.
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
          {[
            { id: "principal", label: "Principal", value: principal, set: setPrincipal, suffix: "" },
            { id: "rate", label: "Rate (%)", value: rate, set: setRate, suffix: "%" },
            { id: "time", label: "Time (years)", value: time, set: setTime, suffix: "yr" },
          ].map((field) => (
            <div key={field.id} className="space-y-sm">
              <label
                htmlFor={field.id}
                className="font-label text-label font-bold text-on-surface uppercase"
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={field.id}
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none"
                />
                {field.suffix && (
                  <span className="absolute right-lg top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                    {field.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                Interest earned
              </p>
              <p className="font-display text-h1 text-primary-container">
                {result.interest.toLocaleString()}
              </p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">
                Total amount
              </p>
              <p className="font-display text-h1 text-tertiary-container">
                {result.total.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
