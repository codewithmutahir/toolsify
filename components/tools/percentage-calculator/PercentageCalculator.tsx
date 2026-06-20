"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useToolApi } from "@/hooks/useToolApi";
import { useToolUi } from "@/hooks/useToolUi";
import type { PercentageMode, PercentageResult } from "@/lib/calculators/percentage";
import { cn } from "@/lib/utils";

export default function PercentageCalculator() {
  const t = useToolUi("percentage-calculator");
  const tCommon = useTranslations("common");
  const [mode, setMode] = useState<PercentageMode>("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");

  const tabs: {
    id: PercentageMode;
    label: string;
    aLabel: string;
    bLabel: string;
  }[] = [
    {
      id: "of",
      label: t("tabOf"),
      aLabel: t("labelPercentageX"),
      bLabel: t("labelNumberY"),
    },
    {
      id: "what-percent",
      label: t("tabWhatPercent"),
      aLabel: t("labelNumberX"),
      bLabel: t("labelNumberY"),
    },
    {
      id: "change",
      label: t("tabChange"),
      aLabel: t("labelFromX"),
      bLabel: t("labelToY"),
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === mode)!;

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

  const resultDescription =
    result && mode === "of"
      ? t("resultOf", { a, b, value: result.value })
      : result && mode === "what-percent"
        ? t("resultWhatPercent", { a, b, value: result.value })
        : result
          ? t("resultChange", { a, b, value: result.value })
          : "";

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
          <p className="tool-result-label mb-sm">{tCommon("result")}</p>
          <p className="tool-result-value mb-sm">
            {mode === "of"
              ? result.value.toLocaleString()
              : `${result.value}%`}
          </p>
          <p className="font-body text-body text-on-surface-variant">{resultDescription}</p>
        </div>
      )}
    </>
  );
}
