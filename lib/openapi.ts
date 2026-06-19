import { SITE_URL } from "@/lib/config";

export function buildOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Toolsify API",
      version: "1.0.0",
      description:
        "Public HTTP APIs for Toolsify — contact submissions and tool requests.",
    },
    servers: [{ url: SITE_URL }],
    paths: {
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
