"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerWebMcpTools } from "@/lib/webmcp/register-tools";

export default function WebMcpProvider() {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    void registerWebMcpTools({
      navigate: (url) => router.push(url),
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [router]);

  return null;
}
