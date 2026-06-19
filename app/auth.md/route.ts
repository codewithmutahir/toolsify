import { NextResponse } from "next/server";
import { buildAuthMdDocument } from "@/lib/agent-auth";

const sharedHeaders = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  Link: '</auth.md>; rel="agent-auth"; type="text/markdown"',
};

export async function GET() {
  return new NextResponse(buildAuthMdDocument(), { headers: sharedHeaders });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: sharedHeaders });
}
