import { NextResponse } from "next/server";
import { buildMcpServerCard } from "@/lib/mcp-server-card";

const sharedHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  Link: `</.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
};

export async function GET() {
  return NextResponse.json(buildMcpServerCard(), { headers: sharedHeaders });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: sharedHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: sharedHeaders });
}
