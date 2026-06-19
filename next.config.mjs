/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

/** Clerk FAPI host is embedded in the publishable key (dev + prod instances differ). */
function getClerkFapiOrigin() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return null;

  const encoded = key.replace(/^pk_(test|live)_/, "");
  try {
    const host = Buffer.from(encoded, "base64")
      .toString("utf-8")
      .replace(/\$$/, "");
    if (!host) return null;
    return host.startsWith("http") ? host : `https://${host}`;
  } catch {
    return null;
  }
}

const clerkFapiOrigin = getClerkFapiOrigin();
const clerkOrigins = [
  "https://*.clerk.accounts.dev",
  "https://*.clerk.com",
  ...(clerkFapiOrigin ? [clerkFapiOrigin] : []),
].join(" ");

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isProduction ? [] : ["'unsafe-eval'"]),
  clerkOrigins,
  "https://challenges.cloudflare.com",
  "https://us-assets.i.posthog.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://pagead2.googlesyndication.com",
  "https://va.vercel-scripts.com",
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://img.clerk.com https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `connect-src 'self' ${clerkOrigins} https://clerk-telemetry.com https://*.clerk-telemetry.com https://us.i.posthog.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://pagead2.googlesyndication.com https://vitals.vercel-insights.com`,
  `frame-src 'self' ${clerkOrigins} https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' ${clerkOrigins}`,
  "frame-ancestors 'none'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const agentDiscoveryLinkHeader = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
  '</auth.md>; rel="agent-auth"; type="text/markdown"',
  '</.well-known/openid-configuration>; rel="openid-configuration"',
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
  '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
  '</llms.txt>; rel="service-doc"; type="text/plain"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
].join(", ");

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["node-html-parser", "turndown"],
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/:path*",
        destination: "/well-known/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Link", value: agentDiscoveryLinkHeader }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), tools=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/ads.txt",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/auth.md",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/.well-known/api-catalog",
        headers: [
          {
            key: "Content-Type",
            value:
              'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/.well-known/mcp/server-card.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)\\.(svg|ico|webp|avif|png|jpg|jpeg|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source:
          "/(.*)\\.([0-9a-f]{8,})\\.(svg|ico|webp|avif|png|jpg|jpeg|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source:
          "/(.*)-([0-9a-f]{8,})\\.(svg|ico|webp|avif|png|jpg|jpeg|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
