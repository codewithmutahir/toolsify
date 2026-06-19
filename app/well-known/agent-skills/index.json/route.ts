import { NextResponse } from "next/server";
import { buildAgentSkillsIndex } from "@/lib/agent-skills";

const sharedHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  Link: '</.well-known/agent-skills/index.json>; rel="agent-skills"',
};

export async function GET() {
  return NextResponse.json(buildAgentSkillsIndex(), { headers: sharedHeaders });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: sharedHeaders });
}
