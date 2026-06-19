import { NextResponse } from "next/server";
import { buildAgentIndex } from "@/lib/agent-discovery";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

export async function GET() {
  return NextResponse.json(buildAgentIndex(), { headers: CACHE_HEADERS });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...CACHE_HEADERS,
      "Content-Type": "application/json",
    },
  });
}
