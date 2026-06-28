"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export interface FeedbackWidgetProps {
  toolName: string;
  toolSlug: string;
}

const STORAGE_PREFIX = "feedback_";

function RatingButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-xs rounded-lg border px-md py-sm text-sm transition-all active:scale-[0.98]",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-outline-variant bg-background text-on-surface-variant hover:bg-surface-container-low"
      )}
    >
      {children}
    </button>
  );
}

export default function FeedbackWidget({ toolName, toolSlug }: FeedbackWidgetProps) {
  const { user } = useUser();
  const [selected, setSelected] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(`${STORAGE_PREFIX}${toolSlug}`)) {
        setAlreadySubmitted(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [toolSlug]);

  async function handleSubmit() {
    if (!selected || loading) return;

    setLoading(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName,
          toolSlug,
          rating: selected,
          comment: comment.trim() || undefined,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });
    } catch {
      // silent fail — still thank the user
    }

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${toolSlug}`, "1");
    } catch {
      // localStorage unavailable
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (alreadySubmitted || submitted) {
    return (
      <div
        className="mt-lg pt-lg border-t border-outline-variant/40"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground text-center">
          Thanks for your feedback! 🙌
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-lg pt-lg border-t border-outline-variant/40"
      data-signup-prompt-ignore
    >
      <p className="text-sm text-muted-foreground mb-sm">Was this tool helpful?</p>

      <div className="flex flex-wrap items-center gap-sm">
        <RatingButton selected={selected === "up"} onClick={() => setSelected("up")}>
          👍 Yes
        </RatingButton>
        <RatingButton
          selected={selected === "down"}
          onClick={() => setSelected("down")}
        >
          👎 No
        </RatingButton>
      </div>

      {selected && (
        <div className="mt-md space-y-sm">
          <label
            htmlFor={`feedback-comment-${toolSlug}`}
            className="block text-xs text-muted-foreground"
          >
            Tell us more (optional)
          </label>
          <textarea
            id={`feedback-comment-${toolSlug}`}
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            placeholder="What did you like / what can we improve?"
            rows={3}
            className="tool-input resize-none text-sm"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-primary-container px-md py-sm text-sm font-medium text-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
