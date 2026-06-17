"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useRef, useState } from "react";
import {
  markPromptShown,
  recordMeaningfulUse,
} from "@/lib/tool-usage-tracker";
import { recordToolHistory } from "@/lib/user-tool-data";

export function useToolUsagePrompt(slug: string) {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const reportedThisVisit = useRef(false);
  const sessionPromptShown = useRef(false);

  const reportMeaningfulUse = useCallback(() => {
    if (!isLoaded) return;
    if (reportedThisVisit.current) return;

    reportedThisVisit.current = true;

    if (isSignedIn && userId) {
      recordToolHistory(userId, slug);
      return;
    }

    if (sessionPromptShown.current) return;

    const { shouldPrompt } = recordMeaningfulUse();
    if (shouldPrompt) {
      sessionPromptShown.current = true;
      setIsOpen(true);
      markPromptShown();
    }
  }, [isLoaded, isSignedIn, slug, userId]);

  const dismiss = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    dismiss,
    reportMeaningfulUse,
    canTrack: isLoaded,
  };
}
