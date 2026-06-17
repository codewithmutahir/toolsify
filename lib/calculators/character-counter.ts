export interface CharacterCounterStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
}

export interface PlatformLimit {
  label: string;
  limit: number;
}

export const platformLimits: PlatformLimit[] = [
  { label: "Twitter / X", limit: 280 },
  { label: "LinkedIn post", limit: 3000 },
  { label: "Meta description", limit: 160 },
];

export function analyzeCharacters(text: string): CharacterCounterStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const lines = text.length === 0 ? 0 : text.split("\n").length;

  return { characters, charactersNoSpaces, words, lines };
}

export function getCharacterLimitProgress(count: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, (count / limit) * 100);
}
