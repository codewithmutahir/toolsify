"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import posthog from "@/lib/posthog";

type RequestToolModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RequestToolModal({
  isOpen,
  onClose,
}: RequestToolModalProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit() {
    if (!toolName.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/request-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName, description, email }),
      });

      if (res.ok) {
        setStatus("success");
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.capture("tool_requested", { tool_name: toolName });
        }
        setTimeout(() => {
          onClose();
          setToolName("");
          setDescription("");
          setEmail("");
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!isOpen || !isLoaded || !isSignedIn) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-lg">
      <div className="bg-white rounded-xl border border-outline-variant shadow-xl w-full max-w-md p-xl">
        {status === "success" ? (
          <div className="text-center py-lg">
            <span
              className="material-symbols-outlined text-tertiary-container text-[64px] mb-md block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <h3 className="font-h2 text-h2 text-on-surface mb-sm">
              Request Sent!
            </h3>
            <p className="font-body text-body text-on-surface-variant">
              We&apos;ll review your suggestion and add it soon.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-xl">
              <div>
                <h3 className="font-h2 text-h2 text-on-surface">
                  Request a Tool
                </h3>
                <p className="font-small text-small text-on-surface-variant mt-xs">
                  Can&apos;t find what you need? Let us know!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-md">
              <div>
                <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
                  Tool Name *
                </label>
                <input
                  className="tool-input"
                  placeholder="e.g. CSS Minifier, QR Code Generator"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
                  Description
                </label>
                <textarea
                  className="tool-input resize-none h-24"
                  placeholder="What should it do? Any specific features?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
                  Your Email (optional)
                </label>
                <input
                  className="tool-input"
                  type="email"
                  placeholder="Get notified when it's live"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {status === "error" && (
                <p className="font-small text-small text-error">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!toolName.trim() || status === "loading"}
                className="w-full bg-primary-container text-on-primary font-h3 text-h3 py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Submit Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
