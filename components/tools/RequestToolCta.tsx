"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import MaterialIcon from "@/components/ui/MaterialIcon";
import RequestToolModal from "@/components/tools/RequestToolModal";
import { cn } from "@/lib/utils";

type RequestToolCtaProps = {
  variant?: "banner" | "compact";
  heading?: string;
  description?: string;
};

export default function RequestToolCta({
  variant = "banner",
  heading = "Request a tool",
  description = "Signed-in members can suggest calculators and utilities we should build next.",
}: RequestToolCtaProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  if (variant === "compact") {
    return (
      <div>
        <h3 className="font-h3 text-h3 text-on-secondary mb-md">{heading}</h3>
        <p className="font-small text-small text-surface-variant mb-md">
          {description}
        </p>
        {isSignedIn ? (
          <>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-label text-label hover:opacity-90 active:scale-95 transition-all"
            >
              Request a tool
            </button>
            <RequestToolModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </>
        ) : (
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-label text-label hover:opacity-90 active:scale-95 transition-all"
          >
            Sign in to request
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <section className="max-w-container-max mx-auto px-gutter mb-2xl">
        <div className="relative overflow-hidden bg-inverse-surface rounded-2xl p-xl flex flex-col lg:flex-row items-center justify-between gap-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-h2 text-h2 text-inverse-on-surface mb-sm">
              {heading}
            </h2>
            <p className="font-body text-body text-surface-variant opacity-80 max-w-md">
              {description}
            </p>
          </div>
          {isSignedIn ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={cn(
                "relative z-10 inline-flex items-center justify-center gap-sm",
                "bg-primary-container text-on-primary-container px-xl py-3 rounded-lg font-label font-bold",
                "hover:opacity-90 transition-opacity shrink-0"
              )}
            >
              <MaterialIcon name="lightbulb" className="text-[20px]" />
              Request a Tool
            </button>
          ) : (
            <Link
              href="/sign-in"
              className={cn(
                "relative z-10 inline-flex items-center justify-center",
                "bg-primary-container text-on-primary-container px-xl py-3 rounded-lg font-label font-bold",
                "hover:opacity-90 transition-opacity shrink-0"
              )}
            >
              Sign in to request a tool
            </Link>
          )}
        </div>
      </section>
      {isSignedIn && (
        <RequestToolModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
