"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  value,
  label = "Copy",
  className,
}: CopyButtonProps) {
  const [feedback, setFeedback] = useState<"copied" | "error" | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setFeedback("copied");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setFeedback("error");
    }
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className={cn(
        "text-primary-container font-label text-label font-bold hover:opacity-80 flex items-center gap-xs disabled:opacity-40",
        className
      )}
    >
      <span className="material-symbols-outlined text-sm">
        {feedback === "copied"
          ? "check"
          : feedback === "error"
            ? "error"
            : "content_copy"}
      </span>
      {feedback === "copied"
        ? "Copied"
        : feedback === "error"
          ? "Copy failed"
          : label}
    </button>
  );
}
