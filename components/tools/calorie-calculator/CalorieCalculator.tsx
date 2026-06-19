"use client";

import { useMemo, useState } from "react";
import UnitToggle from "@/components/tools/UnitToggle";
import { useToolApi } from "@/hooks/useToolApi";
import {
  activityLevels,
  type ActivityLevel,
  type CalorieResult,
  type Gender,
} from "@/lib/calculators/calorie";

export default function CalorieCalculator() {
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const requestBody = useMemo(() => {
    const ageNum = parseFloat(age);
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    if (Number.isNaN(ageNum) || Number.isNaN(weightKg) || Number.isNaN(heightCm)) return null;
    if (ageNum < 1 || weightKg <= 0 || heightCm <= 0) return null;
    return { age: ageNum, weightKg, heightCm, gender, activity };
  }, [age, gender, weight, height, activity]);

  const { data: result, error } = useToolApi<CalorieResult>(
    "calorie-calculator",
    requestBody
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
        <div className="space-y-sm">
          <label htmlFor="cal-age" className="font-label text-label font-bold text-on-surface uppercase">
            Age
          </label>
          <input
            id="cal-age"
            type="number"
            min="1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
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
        <div className="space-y-sm">
          <label htmlFor="cal-weight" className="font-label text-label font-bold text-on-surface uppercase">
            Weight (kg)
          </label>
          <input
            id="cal-weight"
            type="number"
            min="1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
        <div className="space-y-sm">
          <label htmlFor="cal-height" className="font-label text-label font-bold text-on-surface uppercase">
            Height (cm)
          </label>
          <input
            id="cal-height"
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
      </div>

      <div className="space-y-sm mb-xl">
        <label htmlFor="cal-activity" className="font-label text-label font-bold text-on-surface uppercase">
          Activity level
        </label>
        <select
          id="cal-activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
        >
          {activityLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">BMR</p>
              <p className="font-h2 text-h2 text-primary-container">{result.bmr.toLocaleString()} cal/day</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center">
              <p className="font-label text-label text-on-surface-variant uppercase mb-xs">TDEE</p>
              <p className="font-h2 text-h2 text-on-surface">{result.tdee.toLocaleString()} cal/day</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {[
              { label: "Lose weight", value: result.loseWeight, sub: "−500 cal" },
              { label: "Maintain", value: result.maintain, sub: "TDEE" },
              { label: "Gain weight", value: result.gainWeight, sub: "+500 cal" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl p-md text-center"
              >
                <p className="font-label text-label text-on-surface-variant uppercase mb-xs">{item.label}</p>
                <p className="font-h3 text-h3 text-tertiary-container">{item.value.toLocaleString()}</p>
                <p className="font-small text-small text-on-surface-variant">{item.sub}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
