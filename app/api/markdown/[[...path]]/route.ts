import { appendVaryAccept } from "@/lib/markdown-negotiation/accept";
import { htmlToMarkdown } from "@/lib/markdown-negotiation/convert";
import { estimateTokenCount } from "@/lib/markdown-negotiation/tokens";
import { SITE_URL } from "@/lib/config";

export const runtime = "nodejs";

const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=86400";

function pathnameFromSegments(segments?: string[]): string {
  if (!segments || segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

function getLocalBaseUrl(request: Request): string | null {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return null;

  const hostname = host.split(":")[0] ?? host;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  if (!isLocalhost) {
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }

  const port = host.includes(":") ? host.split(":")[1] : "3000";
  return `http://127.0.0.1:${port}`;
}

function buildFetchOrigins(request: Request): string[] {
  const origins = new Set<string>();
  const local = getLocalBaseUrl(request);
  if (local) origins.add(local);
  origins.add(SITE_URL);
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }
  return [...origins];
}

async function fetchPageHtml(
  request: Request,
  pathname: string,
  origin: string
): Promise<{ html: string; status: number }> {
  const url = `${origin.replace(/\/$/, "")}${pathname}`;
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  headers.set("Accept", "text/html");
  headers.set("x-markdown-internal", "1");

  const response = await fetch(url, {
    headers,
    redirect: "follow",
    cache: "no-store",
  });
  const html = await response.text();
  return { html, status: response.status };
}

async function fetchPageHtmlWithFallback(
  request: Request,
  pathname: string
): Promise<{ html: string; status: number }> {
  let lastError: unknown;

  for (const origin of buildFetchOrigins(request)) {
    try {
      const result = await fetchPageHtml(request, pathname, origin);
      if (result.status >= 200 && result.status < 300) {
        return result;
      }
      if (result.status === 404) {
        return result;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error("Failed to fetch page");
}

async function buildMarkdownResponse(
  request: Request,
  pathname: string
): Promise<Response> {
  let html: string;
  let status: number;

  try {
    ({ html, status } = await fetchPageHtmlWithFallback(request, pathname));
  } catch {
    return new Response("Failed to fetch page", { status: 502 });
  }

  if (status === 404) {
    return new Response("Not found", { status: 404 });
  }

  if (status < 200 || status >= 300) {
    return new Response("Failed to fetch page", { status: status || 502 });
  }

  let markdown: string;
  try {
    markdown = htmlToMarkdown(html);
  } catch {
    return new Response("Failed to convert page", { status: 500 });
  }

  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": CACHE_CONTROL,
    "x-markdown-tokens": String(estimateTokenCount(markdown)),
    "x-original-tokens": String(estimateTokenCount(html)),
  });
  appendVaryAccept(headers);

  return new Response(markdown, { status: 200, headers });
}

export async function HEAD(
  request: Request,
  context: { params: { path?: string[] } }
) {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { path?: string[] } }
) {
  const pathname = pathnameFromSegments(params.path);
  return buildMarkdownResponse(request, pathname);
}
