interface WebMcpToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

interface WebMcpToolDefinition<TInput extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  execute: (input: TInput) => Promise<unknown> | unknown;
  annotations?: WebMcpToolAnnotations;
}

interface WebMcpRegisterToolOptions {
  signal?: AbortSignal;
  exposedTo?: string[];
}

interface WebMcpModelContext extends EventTarget {
  registerTool(
    tool: WebMcpToolDefinition,
    options?: WebMcpRegisterToolOptions
  ): Promise<void>;
  getTools?(options?: { fromOrigins?: string[] }): Promise<WebMcpToolDefinition[]>;
  executeTool?(
    tool: WebMcpToolDefinition,
    input: string,
    options?: { signal?: AbortSignal }
  ): Promise<unknown>;
}

interface Navigator {
  modelContext?: WebMcpModelContext;
}

interface Document {
  modelContext?: WebMcpModelContext;
}
