"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import UnitToggle from "@/components/tools/UnitToggle";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import type { Gender } from "@/lib/calculators/calorie";
import type { IdealWeightResult } from "@/lib/calculators/ideal-weight";

const formulaKey: Record<string, string> = {
  Devine: "formulaDevine",
  Robinson: "formulaRobinson",
  Miller: "formulaMiller",
  Hamwi: "formulaHamwi",
};

export default function IdealWeightCalculator() {
  const t = useToolUi("ideal-weight-calculator");
  const tUnits = useTranslations("common.units");
  const [height, setHeight] = useState("175");
  const [gender, setGender] = useState<Gender>("male");

  const requestBody = useMemo(() => {
    const heightCm = parseFloat(height);
    if (Number.isNaN(heightCm) || heightCm <= 0) return null;
    return { heightCm, gender };
  }, [height, gender]);

  const { data: result, error } = useToolApi<IdealWeightResult>(
    "ideal-weight-calculator",
    requestBody
  );

  const genderLabel = (value: Gender) => tUnits(value);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
        <div className="space-y-sm">
          <label htmlFor="iw-height" className="font-label text-label font-bold text-on-surface uppercase">
            {t("heightCm")}
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
            <span className="font-label text-label font-bold text-on-surface uppercase">{t("gender")}</span>
            <UnitToggle
              options={["male", "female"] as const}
              value={gender}
              onChange={setGender}
              getLabel={genderLabel}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result && (
        <>
          <div className="bg-primary-container/10 border border-primary-container/30 rounded-xl p-lg text-center mb-xl">
            <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{t("recommendedRange")}</p>
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
                  {t(formulaKey[formula.name] ?? "formulaDevine")}
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
    </>
  );
}
