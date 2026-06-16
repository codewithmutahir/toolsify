"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ToolWrapper from "@/components/tools/ToolWrapper";
import UnitToggle from "@/components/tools/UnitToggle";
import {
  calculateBMI,
  type HeightUnit,
  type WeightUnit,
} from "@/lib/calculators/bmi";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("bmi-calculator")!;

export default function BMICalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    return calculateBMI(w, h, weightUnit, heightUnit);
  }, [weight, height, weightUnit, heightUnit]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <JsonLd data={schema} />
      <ToolWrapper
        title={tool.title}
        description="Calculate your Body Mass Index instantly. Free, accurate, no signup required."
        category={tool.category}
        slug={tool.slug}
        seoContent={
          <>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">What is BMI?</h2>
            <div className="space-y-md font-body text-body text-on-surface-variant leading-relaxed">
              <p>
                Body Mass Index (BMI) is a simple numerical measurement of a
                person&apos;s thickness or thinness based on their height and weight.
                It is intended to quantify tissue mass and is widely used as a
                general indicator of whether a person has a healthy body weight
                for their height. Specifically, the value obtained from the
                calculation of BMI is used to categorize whether a person is
                underweight, normal weight, overweight, or obese depending on what
                range the value falls between.
              </p>
              <p>
                While BMI is a useful tool for identifying weight categories that
                may lead to health problems, it is important to remember that it is
                not a direct diagnostic tool for body fatness or overall health.
                Factors such as age, muscle mass, and bone density are not
                accounted for in BMI calculations, which is why athletes often have
                high BMI scores despite having very low body fat.
              </p>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          <div className="space-y-sm">
            <div className="flex justify-between items-end">
              <label
                htmlFor="bmi-weight"
                className="font-label text-label font-bold text-on-surface uppercase"
              >
                Weight
              </label>
              <UnitToggle
                options={["kg", "lbs"] as const}
                value={weightUnit}
                onChange={setWeightUnit}
              />
            </div>
            <div className="relative">
              <input
                id="bmi-weight"
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all outline-none"
              />
              <span className="absolute right-lg top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                {weightUnit}
              </span>
            </div>
          </div>

          <div className="space-y-sm">
            <div className="flex justify-between items-end">
              <label
                htmlFor="bmi-height"
                className="font-label text-label font-bold text-on-surface uppercase"
              >
                Height
              </label>
              <UnitToggle
                options={["cm", "ft"] as const}
                value={heightUnit}
                onChange={setHeightUnit}
              />
            </div>
            <div className="relative">
              <input
                id="bmi-height"
                type="number"
                min="0"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-h3 text-h3 focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all outline-none"
              />
              <span className="absolute right-lg top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                {heightUnit}
              </span>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs font-bold">
              Your BMI is
            </p>
            <div className="font-display text-display text-primary-container mb-sm">
              {result.bmi}
            </div>
            <div className="inline-block bg-tertiary-container/10 text-tertiary-container font-h3 text-h3 px-lg py-xs rounded-full mb-xl">
              {result.category}
            </div>
            <div className="space-y-sm relative pt-4">
              <div className="bmi-gradient h-3 w-full rounded-full relative">
                <div
                  className="absolute top-0 flex flex-col items-center"
                  style={{
                    left: `${result.position}%`,
                    transform: "translateX(-50%) translateY(-100%)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-on-surface -mb-2"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-on-surface-variant font-label text-[10px] uppercase font-bold px-1">
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>35.0</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          className="w-full mt-xl bg-primary-container text-on-primary font-h3 text-h3 py-lg rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={() => {
            setWeight(weight);
            setHeight(height);
          }}
        >
          Recalculate BMI
        </button>
      </ToolWrapper>
    </>
  );
}
