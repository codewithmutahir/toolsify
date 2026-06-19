"use client";

import { useMemo, useState } from "react";
import { useToolApi } from "@/hooks/useToolApi";

type TextRepeaterResult = { output: string };

export default function TextRepeater() {
  const [text, setText] = useState("Hello");
  const [count, setCount] = useState("5");
  const [separator, setSeparator] = useState(", ");

  const requestBody = useMemo(() => {
    if (!text.trim()) return null;
    const parsedCount = parseInt(count, 10);
    if (Number.isNaN(parsedCount) || parsedCount < 1) return null;
    return { text, count: parsedCount, separator };
  }, [text, count, separator]);

  const { data, error } = useToolApi<TextRepeaterResult>(
    "text-repeater",
    requestBody
  );

  const output = data?.output ?? "";

  return (
    <>
      <div className="space-y-lg mb-xl">
        <div className="space-y-sm">
          <label
            htmlFor="repeater-text"
            className="font-label text-label font-bold text-on-surface uppercase"
          >
            Text to repeat
          </label>
          <input
            id="repeater-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="space-y-sm">
            <label
              htmlFor="repeater-count"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              Repeat count
            </label>
            <input
              id="repeater-count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
          <div className="space-y-sm">
            <label
              htmlFor="repeater-separator"
              className="font-label text-label font-bold text-on-surface uppercase"
            >
              Separator
            </label>
            <input
              id="repeater-separator"
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder=", "
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-body text-body focus:ring-2 focus:ring-primary-container outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg">
        <p className="font-label text-label text-on-surface-variant uppercase font-bold mb-sm">
          Output
        </p>
        <textarea
          readOnly
          value={output}
          rows={6}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-md font-body text-body outline-none resize-y"
        />
      </div>
    </>
  );
}
