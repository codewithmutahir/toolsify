"use client";

import { useEffect, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import CopyButton from "@/components/tools/shared/CopyButton";
import ToolFaq from "@/components/tools/shared/ToolFaq";
import ToolWrapper from "@/components/tools/ToolWrapper";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { hashAll } from "@/lib/developer/hash";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("hash-generator")!;

type InputMode = "text" | "file";

export default function HashGenerator() {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [hashes, setHashes] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedText = useDebouncedValue(text, 200);

  useEffect(() => {
    if (mode !== "text") return;

    let cancelled = false;
    async function compute() {
      if (!debouncedText) {
        setHashes(null);
        return;
      }
      setLoading(true);
      const result = await hashAll(debouncedText);
      if (!cancelled) {
        setHashes(result);
        setLoading(false);
      }
    }
    compute();
    return () => {
      cancelled = true;
    };
  }, [debouncedText, mode]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    setFileBuffer(buffer);
    const result = await hashAll(buffer);
    setHashes(result);
    setLoading(false);
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
              Free Online Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
            </h2>
            <div className="space-y-md font-body text-body text-on-surface-variant leading-relaxed">
              <p>
                Generate cryptographic hashes from text or files instantly in your
                browser. This tool computes MD5, SHA-1, SHA-256, and SHA-512
                digests without uploading your data to any server.
              </p>
              <p>
                Hash generators are useful for checksums, debugging API payloads,
                verifying file integrity, and learning how message digests work.
              </p>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-md mt-xl">How to use</h2>
            <ol className="list-decimal list-inside space-y-sm font-body text-body text-on-surface-variant">
              <li>Choose Text or File mode.</li>
              <li>Paste text or select a file to hash.</li>
              <li>Copy any generated hash with one click.</li>
            </ol>
            <ToolFaq
              items={[
                {
                  question: "Is MD5 secure?",
                  answer:
                    "MD5 is no longer considered secure for passwords or digital signatures. It is still useful for quick checksums and legacy compatibility.",
                },
                {
                  question: "Can I hash a file instead of text?",
                  answer:
                    "Yes. Switch to File mode and select any file. The tool hashes the raw file bytes in your browser.",
                },
                {
                  question: "Does my data leave my browser?",
                  answer:
                    "No. All hashing runs locally using the Web Crypto API and an in-browser MD5 implementation.",
                },
              ]}
            />
          </>
        }
      >
        <div className="flex gap-sm mb-lg">
          {(["text", "file"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={cn(
                "px-md py-sm rounded-full font-label text-label transition-all",
                mode === option
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              )}
            >
              {option === "text" ? "Text" : "File"}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            placeholder="Enter text to hash..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-mono text-small focus:ring-2 focus:ring-primary-container outline-none resize-y mb-lg"
          />
        ) : (
          <label className="block border-2 border-dashed border-outline-variant rounded-xl p-xl text-center cursor-pointer hover:border-primary-container/50 transition-colors mb-lg">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-sm">
              upload_file
            </span>
            <p className="font-body text-body text-on-surface">
              {fileName ?? "Drop or select a file to hash"}
            </p>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        {loading && (
          <p className="font-body text-small text-on-surface-variant mb-lg">
            Computing hashes...
          </p>
        )}

        {hashes && (
          <div className="space-y-md">
            {Object.entries(hashes).map(([algorithm, value]) => (
              <div
                key={algorithm}
                className="bg-surface-container-low border border-outline-variant rounded-xl p-md"
              >
                <div className="flex justify-between items-center mb-sm gap-md">
                  <p className="font-label text-label text-on-surface-variant uppercase font-bold">
                    {algorithm}
                  </p>
                  <CopyButton value={value} />
                </div>
                <p className="font-mono text-small text-on-surface break-all">{value}</p>
              </div>
            ))}
          </div>
        )}

        {mode === "file" && fileBuffer && (
          <p className="mt-md font-small text-small text-on-surface-variant">
            File size: {fileBuffer.byteLength.toLocaleString()} bytes
          </p>
        )}
      </ToolWrapper>
    </>
  );
}
