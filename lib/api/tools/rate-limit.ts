import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { apiError } from "@/lib/api/response";

/** Max JSON body size for tool API requests (bytes). */
export const MAX_TOOL_REQUEST_BYTES = 256 * 1024;

const IP_LIMIT = 120;
const IP_WINDOW = "1 m" as const;
const SLUG_LIMIT = 60;
const SLUG_WINDOW = "1 m" as const;

export async function enforceToolApiRateLimit(
  request: NextRequest,
  slug: string
): Promise<NextResponse | null> {
  const ip = getClientIp(request);

  const ipLimit = await checkRateLimit(ip, {
    prefix: "tools:ip",
    limit: IP_LIMIT,
    window: IP_WINDOW,
  });

  if (!ipLimit.allowed) {
    return NextResponse.json(rateLimitResponse(ipLimit.retryAfter), {
      status: 429,
      headers: { "Retry-After": String(ipLimit.retryAfter) },
    });
  }

  const slugLimit = await checkRateLimit(`${ip}:${slug}`, {
    prefix: "tools:slug",
    limit: SLUG_LIMIT,
    window: SLUG_WINDOW,
  });

  if (!slugLimit.allowed) {
    return NextResponse.json(rateLimitResponse(slugLimit.retryAfter), {
      status: 429,
      headers: { "Retry-After": String(slugLimit.retryAfter) },
    });
  }

  return null;
}

export function validateToolRequestSize(
  request: NextRequest,
  body: Record<string, unknown>
): NextResponse | null {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_TOOL_REQUEST_BYTES) {
    return apiError("Request body too large.", 413);
  }

  try {
    const serialized = JSON.stringify(body);
    if (serialized.length > MAX_TOOL_REQUEST_BYTES) {
      return apiError("Request body too large.", 413);
    }
  } catch {
    return apiError("Invalid request body.", 400);
  }

  return null;
}
