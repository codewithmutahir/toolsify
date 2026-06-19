import { NextResponse } from "next/server";
import { getOpenIdConfiguration } from "@/lib/oauth-discovery";

const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

function discoveryHeaders() {
  return {
    "Content-Type": "application/json",
    "Cache-Control": CACHE_CONTROL,
    Link: '</.well-known/openid-configuration>; rel="openid-configuration"',
  };
}

export async function GET() {
  const config = await getOpenIdConfiguration();

  if (!config) {
    return NextResponse.json(
      { error: "OAuth discovery is not configured" },
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return NextResponse.json(config, { headers: discoveryHeaders() });
}

export async function HEAD() {
  const config = await getOpenIdConfiguration();

  return new NextResponse(null, {
    status: config ? 200 : 503,
    headers: discoveryHeaders(),
  });
}
