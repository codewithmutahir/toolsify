import { NextRequest, NextResponse } from "next/server";
import {
  appendVaryAccept,
  preferredContentType,
  wantsMarkdown,
} from "@/lib/markdown-negotiation/accept";

const MARKDOWN_HANDLER_PREFIX = "/api/markdown";

const EXCLUDED_PREFIXES = [
  "/api/",
  "/_next/",
  "/__clerk/",
  MARKDOWN_HANDLER_PREFIX,
];

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function handleMarkdownNegotiation(
  request: NextRequest
): NextResponse | Response | null {
  if (request.headers.get("x-markdown-internal") === "1") {
    return null;
  }

  const { pathname } = request.nextUrl;
  if (isExcludedPath(pathname)) {
    return null;
  }

  const acceptHeader = request.headers.get("accept");
  const chosen = preferredContentType(acceptHeader);

  if (wantsMarkdown(acceptHeader)) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/"
        ? MARKDOWN_HANDLER_PREFIX
        : `${MARKDOWN_HANDLER_PREFIX}${pathname}`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  if (chosen === null && acceptHeader) {
    return new Response(
      "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept",
        },
      }
    );
  }

  return null;
}
