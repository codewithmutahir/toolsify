"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { initPostHog, isPostHogInitialized } from "@/lib/posthog";

function schedulePostHogInit() {
  if (typeof window === "undefined") return;

  const run = () => initPostHog();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 2000);
  }
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    schedulePostHogInit();
  }, []);

  useEffect(() => {
    if (!pathname || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    const capturePageview = () => {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    };

    if (isPostHogInitialized()) {
      capturePageview();
      return;
    }

    const timer = setInterval(() => {
      if (!isPostHogInitialized()) return;
      clearInterval(timer);
      capturePageview();
    }, 100);

    return () => clearInterval(timer);
  }, [pathname, searchParams]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
