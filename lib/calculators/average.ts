export interface AverageResult {
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  count: number;
}

export function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseFloat(s))
    .filter((n) => !Number.isNaN(n));
}

export function calculateAverage(numbers: number[]): AverageResult | null {
  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  const mean = sum / numbers.length;

  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

  const freq = new Map<number, number>();
  for (const n of numbers) {
    freq.set(n, (freq.get(n) ?? 0) + 1);
  }
  const counts = Array.from(freq.values());
  const maxFreq = counts.length > 0 ? Math.max(...counts) : 0;
  const mode = Array.from(freq.entries())
    .filter(([, count]) => count === maxFreq)
    .map(([n]) => n);

  return {
    mean: Math.round(mean * 1000) / 1000,
    median: Math.round(median * 1000) / 1000,
    mode,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    count: numbers.length,
  };
}
