"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import { parseNumbers } from "@/lib/calculators/average";
import type { AverageResult } from "@/lib/calculators/average";

export default function AverageCalculator() {
  const [input, setInput] = useState("10, 20, 30, 20, 15");

  const requestBody = useMemo(() => {
    const values = parseNumbers(input);
    if (values.length === 0) return null;
    return { values };
  }, [input]);

  const { data: result, error } = useToolApi<AverageResult>(
    "average-calculator",
    requestBody
  );

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

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

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
        !error && (
          <p className="font-body text-body text-on-surface-variant text-center">
            Enter at least one valid number to see results.
          </p>
        )
      )}
    </>
  );
}
