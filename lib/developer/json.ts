export function formatJson(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent);
}

export function minifyJson(value: unknown): string {
  return JSON.stringify(value);
}

export interface JsonParseResult {
  ok: true;
  data: unknown;
}

export interface JsonParseError {
  ok: false;
  message: string;
  line?: number;
  column?: number;
}

export function parseJson(input: string): JsonParseResult | JsonParseError {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, message: "Input is empty." };
  }

  try {
    return { ok: true, data: JSON.parse(trimmed) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid JSON.";
    const position = extractJsonErrorPosition(message, trimmed);
    return {
      ok: false,
      message,
      line: position?.line,
      column: position?.column,
    };
  }
}

function extractJsonErrorPosition(
  message: string,
  input: string
): { line: number; column: number } | null {
  const positionMatch = message.match(/position\s+(\d+)/i);
  if (!positionMatch) return null;

  const index = Number(positionMatch[1]);
  if (Number.isNaN(index)) return null;

  const before = input.slice(0, index);
  const lines = before.split("\n");
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  };
}

export function byteSize(input: string): number {
  return new TextEncoder().encode(input).length;
}
