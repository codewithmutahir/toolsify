const STORAGE_KEY = "toolsify_tool_usage";

export const PROMPT_INTERVAL = 5;

export type ToolUsageState = {
  totalMeaningfulUses: number;
  lastPromptedAtCount: number;
};

const DEFAULT_STATE: ToolUsageState = {
  totalMeaningfulUses: 0,
  lastPromptedAtCount: 0,
};

function readState(): ToolUsageState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<ToolUsageState>;
    return {
      totalMeaningfulUses: parsed.totalMeaningfulUses ?? 0,
      lastPromptedAtCount: parsed.lastPromptedAtCount ?? 0,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: ToolUsageState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function shouldShowPrompt(state: ToolUsageState): boolean {
  const { totalMeaningfulUses, lastPromptedAtCount } = state;
  if (totalMeaningfulUses < 1) return false;
  if (lastPromptedAtCount === 0) return true;
  return totalMeaningfulUses - lastPromptedAtCount >= PROMPT_INTERVAL;
}

export function recordMeaningfulUse(): {
  state: ToolUsageState;
  shouldPrompt: boolean;
} {
  const state = readState();
  const nextState: ToolUsageState = {
    ...state,
    totalMeaningfulUses: state.totalMeaningfulUses + 1,
  };
  writeState(nextState);

  return {
    state: nextState,
    shouldPrompt: shouldShowPrompt(nextState),
  };
}

export function markPromptShown(): ToolUsageState {
  const state = readState();
  const nextState: ToolUsageState = {
    ...state,
    lastPromptedAtCount: state.totalMeaningfulUses,
  };
  writeState(nextState);
  return nextState;
}
