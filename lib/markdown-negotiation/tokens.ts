/** Rough token estimate (~4 chars per token) for x-markdown-tokens. */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}
