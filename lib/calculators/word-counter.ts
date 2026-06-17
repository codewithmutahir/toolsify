export interface WordCounterStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  readingLevel: string;
  fleschKincaidGrade: number | null;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const vowels = w.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  if (w.endsWith("e")) count--;
  if (w.endsWith("le") && w.length > 2) count++;
  return Math.max(1, count);
}

function estimateReadingLevel(
  words: number,
  sentences: number,
  syllables: number
): { grade: number | null; label: string } {
  if (words === 0 || sentences === 0) {
    return { grade: null, label: "N/A" };
  }

  const grade =
    0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  const rounded = Math.round(grade * 10) / 10;

  let label: string;
  if (grade <= 6) label = "Easy (elementary)";
  else if (grade <= 9) label = "Moderate (middle school)";
  else if (grade <= 12) label = "Fairly difficult (high school)";
  else if (grade <= 16) label = "Difficult (college)";
  else label = "Very difficult (graduate)";

  return { grade: rounded, label };
}

export function analyzeText(text: string): WordCounterStats {
  const trimmed = text.trim();
  const wordList = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const words = wordList.length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed
    ? (trimmed.match(/[^.!?]+[.!?]+|\S+$/g) ?? []).length
    : 0;
  const paragraphs = trimmed
    ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;
  const readingTimeMinutes = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

  const syllables = wordList.reduce(
    (sum, w) => sum + countSyllables(w),
    0
  );
  const { grade, label } = estimateReadingLevel(words, sentences, syllables);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    readingLevel: label,
    fleschKincaidGrade: grade,
  };
}

export function getLimitProgress(count: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, (count / limit) * 100);
}
