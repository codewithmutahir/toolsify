import { NextResponse } from "next/server";
import { buildProtectedResourceMetadata } from "@/lib/agent-auth";

const sharedHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  Link: '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
};

export async function GET() {
  return NextResponse.json(buildProtectedResourceMetadata(), {
    headers: sharedHeaders,
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: sharedHeaders });
}
