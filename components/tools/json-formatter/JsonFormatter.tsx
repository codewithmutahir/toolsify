"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/tools/shared/CopyButton";
import JsonTreeView from "@/components/tools/shared/JsonTreeView";
import { byteSize } from "@/lib/developer/json";
import { cn } from "@/lib/utils";

const SAMPLE_JSON = `{
  "name": "Toolsify",
  "tools": ["json-formatter", "regex-tester"],
  "meta": { "free": true, "signupRequired": false }
}`;

type JsonApiResponse =
  | { success: true; result: { valid: true; output: string; data: unknown } }
  | { success: false; error: string };

async function callJsonApi(
  input: string,
  action: "format" | "minify"
): Promise<JsonApiResponse> {
  const response = await fetch("/api/tools/json-formatter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, action }),
  });
  return response.json() as Promise<JsonApiResponse>;
}

export default function JsonFormatter() {
  const tApi = useTranslations("toolApi");
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationOk, setValidationOk] = useState<boolean | null>(null);
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [showTree, setShowTree] = useState(true);

  async function handleFormat() {
    try {
      const json = await callJsonApi(input, "format");
      if (!json.success) {
        setValidationOk(false);
        setValidationMessage(json.error);
        return;
      }
      setInput(json.result.output);
      setOutput(json.result.output);
      setParsedData(json.result.data);
      setValidationOk(true);
      setValidationMessage("Valid JSON formatted successfully.");
    } catch {
      setValidationOk(false);
      setValidationMessage(tApi("networkError"));
    }
  }

  async function handleMinify() {
    try {
      const json = await callJsonApi(input, "minify");
      if (!json.success) {
        setValidationOk(false);
        setValidationMessage(json.error);
        return;
      }
      setInput(json.result.output);
      setOutput(json.result.output);
      setParsedData(json.result.data);
      setValidationOk(true);
      setValidationMessage("Valid JSON minified successfully.");
    } catch {
      setValidationOk(false);
      setValidationMessage(tApi("networkError"));
    }
  }

  async function handleValidate() {
    try {
      const json = await callJsonApi(input, "format");
      if (!json.success) {
        setValidationOk(false);
        setValidationMessage(json.error);
        setParsedData(null);
        return;
      }
      setValidationOk(true);
      setValidationMessage("Valid JSON.");
      setParsedData(json.result.data);
      setOutput(null);
    } catch {
      setValidationOk(false);
      setValidationMessage(tApi("networkError"));
      setParsedData(null);
    }
  }

  return (
    <>
      <label
        htmlFor="json-input"
        className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
      >
        JSON input
      </label>
      <textarea
        id="json-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={12}
        spellCheck={false}
        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-mono text-small focus:ring-2 focus:ring-primary-container outline-none resize-y mb-md"
      />

      <div className="flex flex-wrap gap-sm mb-md">
        {[
          { label: "Format", action: handleFormat },
          { label: "Minify", action: handleMinify },
          { label: "Validate", action: handleValidate },
        ].map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.action}
            className="bg-primary-container text-on-primary px-lg py-sm rounded-lg font-label text-label font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-md mb-lg">
        <p className="font-small text-small text-on-surface-variant">
          Size: {byteSize(input).toLocaleString()} bytes
        </p>
        {output && <CopyButton value={output} label="Copy output" />}
      </div>

      {validationMessage && (
        <p
          className={cn(
            "font-body text-small mb-lg rounded-lg px-md py-sm",
            validationOk
              ? "bg-tertiary/10 text-tertiary"
              : "bg-error-container text-on-error-container"
          )}
        >
          {validationMessage}
        </p>
      )}

      {parsedData !== null && (
        <div className="space-y-md">
          <button
            type="button"
            onClick={() => setShowTree((prev) => !prev)}
            className="flex items-center gap-xs font-label text-label font-bold text-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showTree ? "expand_less" : "expand_more"}
            </span>
            Tree view
          </button>
          {showTree && <JsonTreeView data={parsedData} />}
        </div>
      )}
    </>
  );
}
