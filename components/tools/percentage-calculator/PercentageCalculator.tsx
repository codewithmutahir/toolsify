"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import type { PercentageMode, PercentageResult } from "@/lib/calculators/percentage";
import { cn } from "@/lib/utils";

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

  const requestBody = useMemo(() => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (Number.isNaN(aNum) || Number.isNaN(bNum)) return null;
    if (mode === "of" && bNum === 0 && aNum === 0) return null;
    if (mode === "what-percent" && bNum === 0) return null;
    if (mode === "change" && aNum === 0) return null;
    return { mode, a: aNum, b: bNum };
  }, [mode, a, b]);

  const { data: result, error } = useToolApi<PercentageResult>(
    "percentage-calculator",
    requestBody
  );

  return (
    <>
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

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

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
    </>
  );
}
