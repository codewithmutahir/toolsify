"use client";

import { useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";

type LoremIpsumResult = { text: string };

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState("3");
  const [wrapHtml, setWrapHtml] = useState(false);
  const [requestBody, setRequestBody] = useState<{
    paragraphs: number;
    wrapHtml: boolean;
  } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<"copied" | "error" | null>(
    null
  );

  const { data, error } = useToolApi<LoremIpsumResult>(
    "lorem-ipsum-generator",
    requestBody
  );

  const output = data?.text ?? "";

  const generate = () => {
    const count = parseInt(paragraphs, 10) || 1;
    setRequestBody({ paragraphs: count, wrapHtml });
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopyFeedback("copied");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyFeedback("error");
    }
    window.setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <>
      <div className="flex flex-wrap items-end gap-lg mb-xl">
        <div className="space-y-sm flex-1 min-w-[140px]">
          <label
            htmlFor="lorem-paragraphs"
            className="font-label text-label font-bold text-on-surface uppercase"
          >
            Paragraphs
          </label>
          <input
            id="lorem-paragraphs"
            type="number"
            min="1"
            max="20"
            value={paragraphs}
            onChange={(e) => setParagraphs(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
        <label className="flex items-center gap-sm font-body text-body text-on-surface cursor-pointer pb-md">
          <input
            type="checkbox"
            checked={wrapHtml}
            onChange={(e) => setWrapHtml(e.target.checked)}
            className="rounded border-outline-variant text-primary-container focus:ring-primary-container"
          />
          Wrap in HTML &lt;p&gt; tags
        </label>
        <button
          type="button"
          onClick={generate}
          className="bg-primary-container text-on-primary font-h3 text-h3 px-xl py-md rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Generate
        </button>
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {output && (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-sm">
            <p className="font-label text-label text-on-surface-variant uppercase font-bold">
              Output
            </p>
            <button
              type="button"
              onClick={copyOutput}
              className="text-primary-container font-label text-label font-bold hover:opacity-80"
            >
              {copyFeedback === "copied"
                ? "Copied"
                : copyFeedback === "error"
                  ? "Copy failed"
                  : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-md font-body text-body outline-none resize-y"
          />
        </div>
      )}
    </>
  );
}
