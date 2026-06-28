"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ISSUE_TYPE_OPTIONS = [
  { value: "bug", label: "Bug / Not Working" },
  { value: "ui", label: "UI / Display Problem" },
  { value: "performance", label: "Slow / Performance Issue" },
  { value: "wrong_output", label: "Wrong Output" },
  { value: "other", label: "Other" },
] as const;

type IssueType = (typeof ISSUE_TYPE_OPTIONS)[number]["value"];

type ReportIssueModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReportIssueModal({
  isOpen,
  onClose,
}: ReportIssueModalProps) {
  const { user, isLoaded } = useUser();
  const [toolUrl, setToolUrl] = useState("");
  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const clerkEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  useEffect(() => {
    if (isOpen) {
      setToolUrl(window.location.href);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isLoaded && clerkEmail) {
      setEmail(clerkEmail);
    }
  }, [isLoaded, clerkEmail]);

  function resetForm() {
    setIssueType("");
    setDescription("");
    setEmail(clerkEmail);
  }

  async function handleSubmit() {
    if (!issueType) {
      toast.error("Please select an issue type.");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolUrl,
          issueType,
          description: description.trim(),
          userEmail: email.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to send report");
      }

      toast.success("Report sent. Thank you for your feedback!");
      onClose();
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md bg-white p-xl gap-0">
        <DialogHeader className="mb-xl text-left">
          <DialogTitle className="font-h2 text-h2 text-on-surface">
            Report Issue
          </DialogTitle>
          <DialogDescription className="font-small text-small text-on-surface-variant">
            Found a problem with this tool? Let us know.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-md">
          <div>
            <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
              Tool URL
            </label>
            <input
              className="tool-input bg-surface-container-low"
              value={toolUrl}
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="report-issue-type"
              className="font-label text-label text-on-surface-variant uppercase mb-xs block"
            >
              Issue Type
            </label>
            <select
              id="report-issue-type"
              className="tool-input"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as IssueType)}
            >
              <option value="" disabled>
                Select issue type
              </option>
              {ISSUE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="report-description"
              className="font-label text-label text-on-surface-variant uppercase mb-xs block"
            >
              Description
            </label>
            <textarea
              id="report-description"
              className="tool-input resize-none h-24"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="report-email"
              className="font-label text-label text-on-surface-variant uppercase mb-xs block"
            >
              Email (optional)
            </label>
            <input
              id="report-email"
              className="tool-input"
              type="email"
              placeholder="your@email.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!clerkEmail}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || description.trim().length < 10 || !issueType}
            className="w-full bg-primary-container text-on-primary font-h3 text-h3 py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 inline-flex items-center justify-center gap-sm"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                Sending...
              </>
            ) : (
              "Send Report"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
