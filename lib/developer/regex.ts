export type RegexFlag = "g" | "i" | "m" | "s" | "u";

export interface RegexMatchInfo {
  index: number;
  end: number;
  match: string;
  groups: string[];
}

export interface RegexEvaluation {
  ok: true;
  matches: RegexMatchInfo[];
}

export interface RegexError {
  ok: false;
  message: string;
}

export const COMMON_REGEX_PATTERNS = [
  {
    label: "Email",
    pattern: String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`,
  },
  {
    label: "URL",
    pattern: String.raw`https?:\/\/[^\s]+`,
  },
  {
    label: "Phone number",
    pattern: String.raw`\+?\d[\d\s().-]{7,}\d`,
  },
  {
    label: "IPv4",
    pattern: String.raw`\b(?:\d{1,3}\.){3}\d{1,3}\b`,
  },
  {
    label: "Hex color",
    pattern: String.raw`#(?:[0-9a-fA-F]{3}){1,2}\b`,
  },
] as const;

export function evaluateRegex(
  pattern: string,
  flags: RegexFlag[],
  testString: string
): RegexEvaluation | RegexError {
  if (!pattern.trim()) {
    return { ok: true, matches: [] };
  }

  try {
    const regex = new RegExp(pattern, flags.join(""));
    const matches: RegexMatchInfo[] = [];

    if (flags.includes("g")) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          index: match.index,
          end: match.index + match[0].length,
          match: match[0],
          groups: match.slice(1),
        });
        if (match[0].length === 0) {
          regex.lastIndex += 1;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          index: match.index,
          end: match.index + match[0].length,
          match: match[0],
          groups: match.slice(1),
        });
      }
    }

    return { ok: true, matches };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid regular expression.",
    };
  }
}

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function buildHighlightSegments(
  text: string,
  matches: RegexMatchInfo[]
): HighlightSegment[] {
  if (!text || matches.length === 0) {
    return [{ text, highlighted: false }];
  }

  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const match of sorted) {
    if (match.index < cursor) continue;
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), highlighted: false });
    }
    segments.push({
      text: text.slice(match.index, match.end),
      highlighted: true,
    });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false });
  }

  return segments;
}
