"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import CopyButton from "@/components/tools/shared/CopyButton";
import JsonTreeView from "@/components/tools/shared/JsonTreeView";
import ToolFaq from "@/components/tools/shared/ToolFaq";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  byteSize,
  formatJson,
  minifyJson,
  parseJson,
} from "@/lib/developer/json";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("json-formatter")!;

const SAMPLE_JSON = `{
  "name": "Toolsify",
  "tools": ["json-formatter", "regex-tester"],
  "meta": { "free": true, "signupRequired": false }
}`;

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationOk, setValidationOk] = useState<boolean | null>(null);
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [showTree, setShowTree] = useState(true);

  const parsed = useMemo(() => parseJson(input), [input]);

  function handleFormat() {
    if (!parsed.ok) {
      setValidationOk(false);
      setValidationMessage(parsed.message);
      return;
    }
    const formatted = formatJson(parsed.data);
    setInput(formatted);
    setOutput(formatted);
    setParsedData(parsed.data);
    setValidationOk(true);
    setValidationMessage("Valid JSON formatted successfully.");
  }

  function handleMinify() {
    if (!parsed.ok) {
      setValidationOk(false);
      setValidationMessage(parsed.message);
      return;
    }
    const minified = minifyJson(parsed.data);
    setInput(minified);
    setOutput(minified);
    setParsedData(parsed.data);
    setValidationOk(true);
    setValidationMessage("Valid JSON minified successfully.");
  }

  function handleValidate() {
    if (!parsed.ok) {
      setValidationOk(false);
      const location =
        parsed.line && parsed.column
          ? ` (line ${parsed.line}, column ${parsed.column})`
          : "";
      setValidationMessage(`${parsed.message}${location}`);
      setParsedData(null);
      return;
    }
    setValidationOk(true);
    setValidationMessage("Valid JSON.");
    setParsedData(parsed.data);
    setOutput(null);
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <JsonLd data={schema} />
      <ToolWrapper
        title={tool.title}
        description={tool.description}
        category={tool.category}
        slug={tool.slug}
        seoContent={
          <>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              Free JSON Formatter, Validator & Viewer
            </h2>
            <div className="space-y-md font-body text-body text-on-surface-variant leading-relaxed">
              <p>
                Format, minify, and validate JSON instantly with a collapsible tree
                view. Perfect for debugging API responses, cleaning config files,
                and inspecting nested data structures.
              </p>
              <p>
                Everything runs in your browser — your JSON never leaves your device.
              </p>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-md mt-xl">How to use</h2>
            <ol className="list-decimal list-inside space-y-sm font-body text-body text-on-surface-variant">
              <li>Paste or type JSON into the editor.</li>
              <li>Click Format, Minify, or Validate.</li>
              <li>Explore the parsed tree view below for nested objects and arrays.</li>
            </ol>
            <ToolFaq
              items={[
                {
                  question: "Is this safe for sensitive JSON data?",
                  answer:
                    "Yes. Parsing and formatting happen entirely in your browser. Nothing is uploaded to a server.",
                },
                {
                  question: "Can I minify JSON here too?",
                  answer:
                    "Yes. Use the Minify button to remove whitespace and produce a compact single-line JSON string.",
                },
                {
                  question: "Will invalid JSON show where the error is?",
                  answer:
                    "When possible, the validator reports the parse error message along with an approximate line and column.",
                },
              ]}
            />
          </>
        }
      >
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
          {output && (
            <CopyButton value={output} label="Copy output" />
          )}
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
      </ToolWrapper>
    </>
  );
}
