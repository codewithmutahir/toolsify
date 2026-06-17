export type CronFieldMode = "every" | "specific" | "interval" | "range";

export interface CronFieldState {
  mode: CronFieldMode;
  specific: number;
  interval: number;
  rangeStart: number;
  rangeEnd: number;
}

export interface CronState {
  minute: CronFieldState;
  hour: CronFieldState;
  dayOfMonth: CronFieldState;
  month: CronFieldState;
  dayOfWeek: CronFieldState;
}

export const CRON_FIELD_META = [
  { key: "minute", label: "Minute", min: 0, max: 59 },
  { key: "hour", label: "Hour", min: 0, max: 23 },
  { key: "dayOfMonth", label: "Day of month", min: 1, max: 31 },
  { key: "month", label: "Month", min: 1, max: 12 },
  { key: "dayOfWeek", label: "Day of week", min: 0, max: 6 },
] as const;

export function defaultCronField(min: number): CronFieldState {
  return {
    mode: "every",
    specific: min,
    interval: 1,
    rangeStart: min,
    rangeEnd: min + 1,
  };
}

export function defaultCronState(): CronState {
  return {
    minute: defaultCronField(0),
    hour: defaultCronField(0),
    dayOfMonth: defaultCronField(1),
    month: defaultCronField(1),
    dayOfWeek: defaultCronField(0),
  };
}

export function fieldToCronPart(
  field: CronFieldState,
  min: number,
  max: number
): string {
  switch (field.mode) {
    case "every":
      return "*";
    case "specific":
      return String(clamp(field.specific, min, max));
    case "interval":
      return `*/${clamp(field.interval, 1, max)}`;
    case "range":
      return `${clamp(field.rangeStart, min, max)}-${clamp(field.rangeEnd, min, max)}`;
    default:
      return "*";
  }
}

export function cronStateToExpression(state: CronState): string {
  return CRON_FIELD_META.map((meta) =>
    fieldToCronPart(
      state[meta.key as keyof CronState],
      meta.min,
      meta.max
    )
  ).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseCronExpression(expression: string): {
  state: CronState | null;
  error: string | null;
} {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { state: null, error: "Cron expression must have exactly 5 fields." };
  }

  try {
    const state = defaultCronState();
    CRON_FIELD_META.forEach((meta, index) => {
      state[meta.key as keyof CronState] = parseCronPart(
        parts[index],
        meta.min,
        meta.max
      );
    });
    return { state, error: null };
  } catch (error) {
    return {
      state: null,
      error:
        error instanceof Error ? error.message : "Invalid cron expression.",
    };
  }
}

function parseCronPart(
  part: string,
  min: number,
  max: number
): CronFieldState {
  if (part === "*") {
    return { ...defaultCronField(min), mode: "every" };
  }
  if (part.startsWith("*/")) {
    const interval = Number(part.slice(2));
    if (Number.isNaN(interval)) throw new Error(`Invalid interval: ${part}`);
    return { ...defaultCronField(min), mode: "interval", interval };
  }
  if (part.includes("-")) {
    const [start, end] = part.split("-").map(Number);
    if ([start, end].some(Number.isNaN)) throw new Error(`Invalid range: ${part}`);
    return {
      ...defaultCronField(min),
      mode: "range",
      rangeStart: start,
      rangeEnd: end,
    };
  }

  const specific = Number(part);
  if (Number.isNaN(specific)) throw new Error(`Invalid value: ${part}`);
  return {
    ...defaultCronField(min),
    mode: "specific",
    specific: clamp(specific, min, max),
  };
}

function matchesCronField(value: number, part: string, min: number, max: number): boolean {
  if (part === "*") return true;
  if (part.startsWith("*/")) {
    const step = Number(part.slice(2));
    return value % step === 0;
  }
  if (part.includes(",")) {
    return part.split(",").some((item) => matchesCronField(value, item, min, max));
  }
  if (part.includes("-")) {
    const [start, end] = part.split("-").map(Number);
    return value >= start && value <= end;
  }
  const exact = Number(part);
  return value === exact;
}

export function describeCronExpression(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return "Enter a valid 5-field cron expression.";

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const segments: string[] = [];

  if (minute.startsWith("*/")) {
    segments.push(`Every ${minute.slice(2)} minutes`);
  } else if (minute !== "*") {
    segments.push(`At minute ${minute}`);
  }

  if (hour !== "*" && minute === "0" && hour !== "*/1") {
    const hourNum = Number(hour);
    if (!Number.isNaN(hourNum)) {
      const period = hourNum >= 12 ? "PM" : "AM";
      const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
      segments.push(`at ${displayHour}:00 ${period}`);
    }
  } else if (hour !== "*") {
    segments.push(`during hour ${hour}`);
  } else if (segments.length === 0) {
    segments.push("Every minute");
  }

  if (dayOfMonth !== "*") {
    segments.push(`on day ${dayOfMonth} of the month`);
  }
  if (month !== "*") {
    segments.push(`in month ${month}`);
  }
  if (dayOfWeek !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayNum = Number(dayOfWeek);
    if (!Number.isNaN(dayNum) && days[dayNum]) {
      segments.push(`every ${days[dayNum]}`);
    } else {
      segments.push(`on weekday ${dayOfWeek}`);
    }
  }

  if (segments.length === 0) return "Runs every minute.";
  return segments.join(", ") + ".";
}

export function getNextCronRuns(expression: string, count = 5): string[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minutePart, hourPart, dayPart, monthPart, dowPart] = parts;
  const results: string[] = [];
  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let guard = 0;
  while (results.length < count && guard < 525600) {
    guard += 1;
    const minute = cursor.getMinutes();
    const hour = cursor.getHours();
    const day = cursor.getDate();
    const month = cursor.getMonth() + 1;
    const dow = cursor.getDay();

    if (
      matchesCronField(minute, minutePart, 0, 59) &&
      matchesCronField(hour, hourPart, 0, 23) &&
      matchesCronField(day, dayPart, 1, 31) &&
      matchesCronField(month, monthPart, 1, 12) &&
      matchesCronField(dow, dowPart, 0, 6)
    ) {
      results.push(cursor.toLocaleString());
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}
