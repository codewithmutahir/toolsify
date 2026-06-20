"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  children,
}: RequestToolButtonProps) {
  const t = useTranslations("home.requestTool");
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
        {t("signInToRequest")}
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
        {children ?? t("button")}
      </button>
      <RequestToolModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
