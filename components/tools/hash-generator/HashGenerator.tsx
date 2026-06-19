"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/tools/shared/CopyButton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useToolApi } from "@/hooks/useToolApi";
import { hashAll } from "@/lib/developer/hash";
import { cn } from "@/lib/utils";

type InputMode = "text" | "file";

export default function HashGenerator() {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileHashes, setFileHashes] = useState<Record<string, string> | null>(
    null
  );
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const debouncedText = useDebouncedValue(text, 200);

  const textRequestBody = useMemo(() => {
    if (mode !== "text" || !debouncedText) return null;
    return { text: debouncedText };
  }, [mode, debouncedText]);

  const {
    data: textHashes,
    loading: textLoading,
  } = useToolApi<Record<string, string>>("hash-generator", textRequestBody, 200);

  const hashes = mode === "text" ? textHashes : fileHashes;
  const loading = mode === "text" ? textLoading : fileLoading;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    setFileError(null);
    setFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      setFileBuffer(buffer);
      const result = await hashAll(buffer);
      setFileHashes(result);
    } catch (error) {
      console.error("Failed to hash file:", error);
      setFileError("Failed to read or hash the selected file.");
      setFileHashes(null);
      setFileBuffer(null);
    } finally {
      setFileLoading(false);
    }
  }

  return (
    <>
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

      {fileError && (
        <p className="font-body text-small text-error mb-lg">{fileError}</p>
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
              <p className="font-mono text-small text-on-surface break-all">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {mode === "file" && fileBuffer && (
        <p className="mt-md font-small text-small text-on-surface-variant">
          File size: {fileBuffer.byteLength.toLocaleString()} bytes
        </p>
      )}
    </>
  );
}
