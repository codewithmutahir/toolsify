"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";
import { caseModes, type CaseMode } from "@/lib/calculators/case-converter";

function CaseModeOutput({
  text,
  mode,
  label,
  copyFeedback,
  onCopy,
}: {
  text: string;
  mode: CaseMode;
  label: string;
  copyFeedback: { id: string; ok: boolean } | null;
  onCopy: (value: string, id: string) => void;
}) {
  const requestBody = useMemo(
    () => (text.trim() ? { text, mode } : null),
    [text, mode]
  );

  const { data: result, error } = useToolApi<string>(
    "case-converter",
    requestBody
  );

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
      <div className="flex justify-between items-center mb-sm">
        <p className="font-label text-label text-on-surface-variant uppercase font-bold">
          {label}
        </p>
        <button
          type="button"
          onClick={() => onCopy(result ?? "", mode)}
          className="text-primary-container font-label text-label font-bold hover:opacity-80 flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-sm">
            {copyFeedback?.id === mode
              ? copyFeedback.ok
                ? "check"
                : "error"
              : "content_copy"}
          </span>
          {copyFeedback?.id === mode
            ? copyFeedback.ok
              ? "Copied"
              : "Copy failed"
            : "Copy"}
        </button>
      </div>
      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-sm">
          {error}
        </p>
      )}
      <p className="font-body text-body text-on-surface break-all">
        {result || "—"}
      </p>
    </div>
  );
}

export default function CaseConverter() {
  const [text, setText] = useState("Hello World Example Text");
  const [copyFeedback, setCopyFeedback] = useState<{
    id: string;
    ok: boolean;
  } | null>(null);

  const copyToClipboard = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback({ id, ok: true });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyFeedback({ id, ok: false });
    }
    window.setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <>
      <label
        htmlFor="case-input"
        className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
      >
        Input text
      </label>
      <textarea
        id="case-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none resize-y mb-xl"
      />

      <div className="space-y-md">
        {caseModes.map((item) => (
          <CaseModeOutput
            key={item.id}
            text={text}
            mode={item.id}
            label={item.label}
            copyFeedback={copyFeedback}
            onCopy={copyToClipboard}
          />
        ))}
      </div>
    </>
  );
}
