import { SITE_URL } from "@/lib/config";
import { implementedToolSlugs } from "@/components/tools/tool-registry";
import { getToolBySlug } from "@/constants/tools";

const toolApiResponse = {
  "200": {
    description: "Successful calculation",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", enum: [true] },
            result: { type: "object" },
          },
        },
      },
    },
  },
  "400": { description: "Validation error" },
  "404": { description: "Tool not found" },
  "413": { description: "Request body exceeds 256 KB limit" },
  "429": {
    description: "Rate limit exceeded (120 req/min per IP, 60 req/min per tool)",
  },
};

function buildToolApiPaths() {
  const paths: Record<string, unknown> = {};

  for (const slug of implementedToolSlugs) {
    const tool = getToolBySlug(slug);
    if (!tool) continue;

    paths[`/api/tools/${slug}`] = {
      get: {
        summary: `Get ${tool.title} API metadata`,
        operationId: `get${slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}Meta`,
        tags: ["Tools"],
        responses: toolApiResponse,
      },
      post: {
        summary: tool.title,
        description: tool.description,
        operationId: `run${slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}`,
        tags: ["Tools"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: toolApiResponse,
      },
    };
  }

  return paths;
}

export function buildOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Toolsify API",
      version: "1.0.0",
      description:
        "Public HTTP APIs for Toolsify tools, contact submissions, and tool requests.",
    },
    servers: [{ url: SITE_URL }],
    tags: [{ name: "Tools", description: "Calculator and utility tool endpoints" }],
    paths: {
      "/api/tools-index": {
        get: {
          summary: "List all tools with agent metadata",
          operationId: "listTools",
          tags: ["Tools"],
          responses: {
            "200": {
              description: "Tool registry",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      site: { type: "string" },
                      description: { type: "string" },
                      toolCount: { type: "integer" },
                      tools: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            slug: { type: "string" },
                            description: { type: "string" },
                            category: { type: "string" },
                            apiEndpoint: { type: "string", format: "uri" },
                            url: { type: "string", format: "uri" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      ...buildToolApiPaths(),
      "/api/contact": {
        post: {
          summary: "Submit a contact form message",
          operationId: "submitContact",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "message"],
                  properties: {
                    name: { type: "string", minLength: 2 },
                    email: { type: "string", format: "email" },
                    subject: { type: "string" },
                    message: { type: "string", minLength: 10 },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Message sent successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { success: { type: "boolean" } },
                  },
                },
              },
            },
            "400": { description: "Validation error" },
            "429": { description: "Rate limit exceeded" },
            "503": { description: "Email service not configured" },
          },
        },
      },
      "/api/request-tool": {
        post: {
          summary: "Request a new tool",
          operationId: "requestTool",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["toolName"],
                  properties: {
                    toolName: { type: "string", minLength: 3 },
                    description: { type: "string" },
                    email: { type: "string", format: "email" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Request submitted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { success: { type: "boolean" } },
                  },
                },
              },
            },
            "400": { description: "Validation error" },
            "503": { description: "Email service not configured" },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "API health check",
          operationId: "healthCheck",
          responses: {
            "200": {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", enum: ["ok"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}
