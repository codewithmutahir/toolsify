"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import UnitToggle from "@/components/tools/UnitToggle";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import type { BMIResult } from "@/lib/calculators/bmi";
import type { HeightUnit, WeightUnit } from "@/lib/calculators/bmi";

const categoryKey: Record<string, string> = {
  Underweight: "categoryUnderweight",
  "Normal weight": "categoryNormal",
  Overweight: "categoryOverweight",
  Obese: "categoryObese",
};

export default function BMICalculator() {
  const t = useToolUi("bmi-calculator");
  const tCommon = useTranslations("common");
  const tUnits = useTranslations("common.units");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");

  const requestBody = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return null;
    return { weight: w, height: h, weightUnit, heightUnit };
  }, [weight, height, weightUnit, heightUnit]);

  const { data: result, error, loading } = useToolApi<BMIResult>(
    "bmi-calculator",
    requestBody
  );

  const unitLabel = (unit: string) => tUnits(unit as "kg" | "lbs" | "cm" | "ft");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
        <div className="space-y-sm">
          <div className="flex justify-between items-end">
            <label
              htmlFor="bmi-weight"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              {t("weight")}
            </label>
            <UnitToggle
              options={["kg", "lbs"] as const}
              value={weightUnit}
              onChange={setWeightUnit}
              getLabel={unitLabel}
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
              {unitLabel(weightUnit)}
            </span>
          </div>
        </div>

        <div className="space-y-sm">
          <div className="flex justify-between items-end">
            <label
              htmlFor="bmi-height"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              {t("height")}
            </label>
            <UnitToggle
              options={["cm", "ft"] as const}
              value={heightUnit}
              onChange={setHeightUnit}
              getLabel={unitLabel}
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
              {unitLabel(heightUnit)}
            </span>
          </div>
        </div>
      </div>

      <section aria-label={t("resultsAriaLabel")} aria-live="polite">
        {error && (
          <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
            {error}
          </p>
        )}

        {loading && !result && requestBody && (
          <p className="font-body text-body text-on-surface-variant text-center">
            {tCommon("calculating")}
          </p>
        )}

        {result && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl text-center">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs font-bold">
              {t("yourBmiIs")}
            </p>
            <div className="font-display text-display text-primary-container mb-sm">
              {result.bmi}
            </div>
            <div className="inline-block bg-tertiary-container/10 text-tertiary-container font-h3 text-h3 px-lg py-xs rounded-full mb-xl">
              {t(categoryKey[result.category] ?? "categoryNormal")}
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
      </section>
    </>
  );
}
