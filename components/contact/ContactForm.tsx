"use client";

import { FormEvent, useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-xl text-center">
        <MaterialIcon
          name="check_circle"
          className="text-[48px] text-tertiary-container mb-md mx-auto"
          filled
        />
        <h2 className="font-h2 text-h2 text-on-surface mb-sm">Message sent!</h2>
        <p className="font-body text-body text-on-surface-variant mb-lg">
          Thanks for reaching out. We&apos;ll get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-label text-label text-primary-container hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg md:p-xl space-y-md"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <label className="flex flex-col gap-xs">
          <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
            Name *
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            maxLength={100}
            className="tool-input"
          />
        </label>
        <label className="flex flex-col gap-xs">
          <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
            Email *
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="tool-input"
          />
        </label>
      </div>

      <label className="flex flex-col gap-xs">
        <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
          Subject
        </span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What is this about?"
          maxLength={200}
          className="tool-input"
        />
      </label>

      <label className="flex flex-col gap-xs">
        <span className="font-label text-label text-on-surface-variant uppercase tracking-wider">
          Message *
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="tool-input resize-y min-h-32"
        />
      </label>

      {status === "error" && (
        <p className="font-small text-small text-error flex items-center gap-xs">
          <MaterialIcon name="error" className="text-[18px]" />
          Something went wrong. Please try again later.
        </p>
      )}

      <button
        type="submit"
        disabled={
          status === "loading" ||
          !name.trim() ||
          !email.trim() ||
          message.trim().length < 10
        }
        className={cn(
          "w-full min-h-12 rounded-lg bg-primary-container text-on-primary font-display font-bold",
          "hover:brightness-110 active:scale-[0.98] transition-all",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
