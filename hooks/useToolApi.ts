"use client";

import { useCallback, useEffect, useState } from "react";

type ToolApiResponse<T> =
  | { success: true; result: T }
  | { success: false; error: string };

export function useToolApi<T>(
  slug: string,
  body: Record<string, unknown> | null,
  debounceMs = 300
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchResult = useCallback(async () => {
    if (!body) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/tools/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as ToolApiResponse<T>;
      if (!json.success) {
        setData(null);
        setError(json.error);
        return;
      }
      setData(json.result);
      setError(null);
    } catch {
      setData(null);
      setError("Unable to reach the calculation API.");
    } finally {
      setLoading(false);
    }
  }, [body, slug]);

  useEffect(() => {
    const timer = window.setTimeout(fetchResult, debounceMs);
    return () => window.clearTimeout(timer);
  }, [debounceMs, fetchResult]);

  return { data, error, loading };
}
