/** Clerk Frontend API origin derived from the publishable key (dev + prod differ). */
export function getClerkFapiOrigin(): string | null {
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
