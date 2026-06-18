import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

type RateLimitWindow = `${number} s` | `${number} m` | `${number} h` | `${number} d`;

export type RateLimitOutcome =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

const limiterCache = new Map<string, Ratelimit>();

function isRateLimitConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function getLimiter(prefix: string, limit: number, window: RateLimitWindow) {
  const cacheKey = `${prefix}:${limit}:${window}`;
  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix,
    });
    limiterCache.set(cacheKey, limiter);
  }
  return limiter;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function checkRateLimit(
  identifier: string,
  options: { prefix: string; limit: number; window: RateLimitWindow }
): Promise<RateLimitOutcome> {
  if (!isRateLimitConfigured()) {
    return { allowed: true };
  }

  const limiter = getLimiter(options.prefix, options.limit, options.window);
  const { success, reset } = await limiter.limit(identifier);

  if (success) {
    return { allowed: true };
  }

  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { allowed: false, retryAfter };
}

export function rateLimitResponse(retryAfter: number) {
  return {
    error: "Too many requests. Please try again later.",
    retryAfter,
  };
}
