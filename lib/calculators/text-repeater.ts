export function repeatText(
  text: string,
  count: number,
  separator: string
): string {
  if (count <= 0 || !text) return "";
  if (count === 1) return text;
  return Array(count).fill(text).join(separator);
}
