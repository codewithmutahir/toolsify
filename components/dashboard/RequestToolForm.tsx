"use client";

import { FormEvent, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { categories } from "@/constants/categories";
import {
  getToolRequests,
  submitToolRequest,
  type ToolRequestEntry,
} from "@/lib/user-tool-data";
import { cn } from "@/lib/utils";

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default function RequestToolForm() {
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [requests, setRequests] = useState<ToolRequestEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setRequests(getToolRequests(user.id));
  }, [isLoaded, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const entry = submitToolRequest(user.id, {
      title: title.trim(),
      description: description.trim(),
      category: category || undefined,
    });

    setRequests((current) => [entry, ...current]);
    setTitle("");
    setDescription("");
    setCategory("");
    setSubmitted(true);
    setIsSubmitting(false);

    window.setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg md:p-xl">
        <div className="flex items-start gap-md mb-lg">
          <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
            <MaterialIcon name="lightbulb" className="text-[22px] text-primary" />
          </div>
          <div>
            <h2 className="font-h3 text-h3 text-on-surface mb-xs">
              Suggest a new tool
            </h2>
            <p className="font-body text-body text-on-surface-variant">
              Members can request tools we should build next. We review every
              submission.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <label className="flex flex-col gap-xs">
            <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
              Tool name
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. PDF to Word converter"
              className="tool-input"
              required
              maxLength={120}
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
              Category (optional)
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="tool-input"
            >
              <option value="">Select a category</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
              What should it do?
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the problem it should solve and any must-have features..."
              className="tool-input min-h-32 resize-y"
              required
              maxLength={1000}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className={cn(
              "min-h-12 rounded-lg bg-primary-container text-on-primary font-display font-bold",
              "hover:brightness-110 active:scale-[0.98] transition-all",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit request"}
          </button>

          {submitted && (
            <p className="font-small text-small text-primary font-medium flex items-center gap-xs">
              <MaterialIcon name="check_circle" className="text-[18px]" filled />
              Request received — thanks for helping shape Toolsify!
            </p>
          )}
        </form>
      </div>

      {requests.length > 0 && (
        <section>
          <h2 className="font-h3 text-h3 text-on-surface mb-md">Your requests</h2>
          <div className="flex flex-col gap-sm">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-xl border border-outline-variant bg-surface-container-low p-md"
              >
                <div className="flex items-start justify-between gap-md mb-xs">
                  <h3 className="font-body text-body font-semibold text-on-surface">
                    {request.title}
                  </h3>
                  <span className="font-label text-[10px] uppercase tracking-wider px-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant shrink-0">
                    Received
                  </span>
                </div>
                <p className="font-small text-small text-on-surface-variant mb-sm">
                  {request.description}
                </p>
                <p className="font-label text-label text-outline">
                  {formatDate(request.createdAt)}
                  {request.category ? ` · ${request.category}` : ""}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
