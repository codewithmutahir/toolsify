export type ToolHistoryEntry = {
  slug: string;
  usedAt: number;
};

export type ToolRequestEntry = {
  id: string;
  title: string;
  description: string;
  category?: string;
  createdAt: number;
};

type UserToolData = {
  favorites: string[];
  history: ToolHistoryEntry[];
  requests: ToolRequestEntry[];
};

const STORAGE_PREFIX = "toolsify_user_data";
const MAX_HISTORY = 20;

const DEFAULT_DATA: UserToolData = {
  favorites: [],
  history: [],
  requests: [],
};

function getStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}_${userId}`;
}

function readData(userId: string): UserToolData {
  if (typeof window === "undefined") return DEFAULT_DATA;

  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return DEFAULT_DATA;

    const parsed = JSON.parse(raw) as Partial<UserToolData>;
    return {
      favorites: parsed.favorites ?? [],
      history: parsed.history ?? [],
      requests: parsed.requests ?? [],
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function writeData(userId: string, data: UserToolData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
}

export function getFavorites(userId: string): string[] {
  return readData(userId).favorites;
}

export function isFavorite(userId: string, slug: string): boolean {
  return getFavorites(userId).includes(slug);
}

export function toggleFavorite(userId: string, slug: string): boolean {
  const data = readData(userId);
  const isCurrentlyFavorite = data.favorites.includes(slug);

  data.favorites = isCurrentlyFavorite
    ? data.favorites.filter((item) => item !== slug)
    : [...data.favorites, slug];

  writeData(userId, data);
  return !isCurrentlyFavorite;
}

export function recordToolHistory(userId: string, slug: string) {
  const data = readData(userId);
  const withoutDuplicate = data.history.filter((entry) => entry.slug !== slug);
  const nextHistory = [{ slug, usedAt: Date.now() }, ...withoutDuplicate].slice(
    0,
    MAX_HISTORY
  );

  writeData(userId, { ...data, history: nextHistory });
}

export function getToolHistory(userId: string): ToolHistoryEntry[] {
  return readData(userId).history;
}

export function submitToolRequest(
  userId: string,
  request: Omit<ToolRequestEntry, "id" | "createdAt">
): ToolRequestEntry {
  const data = readData(userId);
  const entry: ToolRequestEntry = {
    ...request,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  writeData(userId, {
    ...data,
    requests: [entry, ...data.requests],
  });

  return entry;
}

export function getToolRequests(userId: string): ToolRequestEntry[] {
  return readData(userId).requests;
}
