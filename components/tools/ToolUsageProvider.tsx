"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import SignUpPromptSheet from "@/components/auth/SignUpPromptSheet";
import { useToolUsagePrompt } from "@/hooks/useToolUsagePrompt";

type ToolUsageContextValue = {
  reportMeaningfulUse: () => void;
};

const ToolUsageContext = createContext<ToolUsageContextValue | null>(null);

export function useReportToolUsage() {
  const context = useContext(ToolUsageContext);
  return context?.reportMeaningfulUse ?? (() => {});
}

function isMeaningfulInteraction(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const el = target.closest(
    "input, textarea, select, button"
  ) as HTMLElement | null;
  if (!el || el.closest("[data-signup-prompt-ignore]")) return false;

  if (el instanceof HTMLTextAreaElement) {
    return el.value.trim().length >= 1;
  }

  if (el instanceof HTMLInputElement) {
    if (el.type === "file") return (el.files?.length ?? 0) > 0;
    if (el.type === "checkbox" || el.type === "radio") return el.checked;
    if (el.type === "range") return true;
    return el.value.trim().length >= 1;
  }

  if (el instanceof HTMLSelectElement) {
    return el.value !== "";
  }

  if (el instanceof HTMLButtonElement) {
    return el.type !== "reset";
  }

  return false;
}

type ToolUsageProviderProps = {
  slug: string;
  children: ReactNode;
};

export default function ToolUsageProvider({
  slug,
  children,
}: ToolUsageProviderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isOpen, dismiss, reportMeaningfulUse, canTrack } =
    useToolUsagePrompt(slug);

  const handleInteraction = useCallback(
    (event: Event) => {
      if (!canTrack) return;
      if (!isMeaningfulInteraction(event.target)) return;
      reportMeaningfulUse();
    },
    [canTrack, reportMeaningfulUse]
  );

  useEffect(() => {
    const node = contentRef.current;
    if (!node || !canTrack) return;

    node.addEventListener("input", handleInteraction);
    node.addEventListener("change", handleInteraction);
    node.addEventListener("click", handleInteraction);

    return () => {
      node.removeEventListener("input", handleInteraction);
      node.removeEventListener("change", handleInteraction);
      node.removeEventListener("click", handleInteraction);
    };
  }, [canTrack, handleInteraction]);

  return (
    <ToolUsageContext.Provider value={{ reportMeaningfulUse }}>
      <div ref={contentRef}>{children}</div>
      <SignUpPromptSheet open={isOpen} onDismiss={dismiss} />
    </ToolUsageContext.Provider>
  );
}
