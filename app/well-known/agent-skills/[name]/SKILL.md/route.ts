import { NextResponse } from "next/server";
import { computeSkillDigest, readSkillArtifact } from "@/lib/agent-skills";

type RouteContext = {
  params: { name: string };
};

function buildSkillHeaders(content: Buffer) {
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    Digest: computeSkillDigest(content),
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const content = readSkillArtifact(params.name);
  if (!content) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(content), {
    headers: buildSkillHeaders(content),
  });
}

export async function HEAD(_request: Request, { params }: RouteContext) {
  const content = readSkillArtifact(params.name);
  if (!content) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: buildSkillHeaders(content),
  });
}
