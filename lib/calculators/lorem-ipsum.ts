const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

function generateSentence(): string {
  const length = 8 + Math.floor(Math.random() * 8);
  const words: string[] = [];
  for (let i = 0; i < length; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: sentenceCount }, generateSentence).join(" ");
}

export function generateLoremIpsum(
  paragraphCount: number,
  wrapHtml: boolean
): string {
  const count = Math.max(1, Math.min(20, Math.floor(paragraphCount)));
  const paragraphs = Array.from({ length: count }, generateParagraph);

  if (wrapHtml) {
    return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
  }
  return paragraphs.join("\n\n");
}
