import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import {
  enforceToolApiRateLimit,
  validateToolRequestSize,
} from "@/lib/api/tools/rate-limit";
import { getToolApiHandler, isToolApiSlug } from "@/lib/api/tools/handlers";
import { getToolBySlug } from "@/constants/tools";

type RouteContext = {
  params: { slug: string };
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { slug } = params;

  if (!isToolApiSlug(slug)) {
    return apiError("Tool API not found.", 404);
  }

  const tool = getToolBySlug(slug);
  if (!tool?.implemented) {
    return apiError("Tool not found.", 404);
  }

  const rateLimited = await enforceToolApiRateLimit(request, slug);
  if (rateLimited) {
    return rateLimited;
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return apiError("Request body must be valid JSON.");
  }

  const sizeError = validateToolRequestSize(request, body);
  if (sizeError) {
    return sizeError;
  }

  const handler = getToolApiHandler(slug);
  if (!handler) {
    return apiError("Tool API not found.", 404);
  }

  try {
    const result = await handler(body);
    return apiSuccess(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Calculation failed.";
    return apiError(message);
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = params;

  if (!isToolApiSlug(slug)) {
    return apiError("Tool API not found.", 404);
  }

  const tool = getToolBySlug(slug);
  if (!tool?.implemented) {
    return apiError("Tool not found.", 404);
  }

  const rateLimited = await enforceToolApiRateLimit(request, slug);
  if (rateLimited) {
    return rateLimited;
  }

  return apiSuccess({
    slug: tool.slug,
    name: tool.title,
    description: tool.description,
    category: tool.category,
    method: "POST",
    contentType: "application/json",
    maxRequestBytes: 262144,
  });
}
