export interface JwtDecodeResult {
  ok: true;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface JwtDecodeError {
  ok: false;
  message: string;
}

export function decodeJwt(token: string): JwtDecodeResult | JwtDecodeError {
  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, message: "Paste a JWT to decode." };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      message: "Invalid JWT format. Expected three dot-separated parts.",
    };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as Record<
      string,
      unknown
    >;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<
      string,
      unknown
    >;
    return {
      ok: true,
      header,
      payload,
      signature: parts[2],
    };
  } catch {
    return { ok: false, message: "Unable to decode JWT header or payload." };
  }
}

export function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const decoded = atob(padded);
  const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function formatUnixClaim(value: unknown): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return new Date(value * 1000).toLocaleString();
}

export function relativeTimeFromNow(unixSeconds: number): string {
  const diffMs = unixSeconds * 1000 - Date.now();
  const abs = Math.abs(diffMs);
  const minutes = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);

  if (minutes < 60) {
    return diffMs >= 0
      ? `in ${minutes} minute${minutes === 1 ? "" : "s"}`
      : `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (hours < 48) {
    return diffMs >= 0
      ? `in ${hours} hour${hours === 1 ? "" : "s"}`
      : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  return diffMs >= 0
    ? `in ${days} day${days === 1 ? "" : "s"}`
    : `${days} day${days === 1 ? "" : "s"} ago`;
}

export function isExpired(exp?: unknown): boolean | null {
  if (typeof exp !== "number") return null;
  return exp * 1000 < Date.now();
}
