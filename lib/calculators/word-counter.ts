export interface WordCounterStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export function analyzeText(text: string): WordCounterStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed
    ? (trimmed.match(/[^.!?]+[.!?]+|\S+$/g) ?? []).length
    : 0;
  const paragraphs = trimmed
    ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
  };
}

export function getLimitProgress(count: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, (count / limit) * 100);
}
