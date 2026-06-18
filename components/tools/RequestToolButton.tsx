"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import RequestToolModal from "@/components/tools/RequestToolModal";
import { cn } from "@/lib/utils";

type RequestToolButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function RequestToolButton({
  className,
  children = "Request a Tool",
}: RequestToolButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className={cn(
          "bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all shrink-0 inline-flex items-center justify-center",
          className
        )}
      >
        Sign in to request a tool
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all shrink-0",
          className
        )}
      >
        {children}
      </button>
      <RequestToolModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
