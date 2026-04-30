import { normalizeWeekdayList } from "../core/business-days"

const STORAGE_KEYS = {
  startDate: "tools:business-days-calculator:start-date",
  endDate: "tools:business-days-calculator:end-date",
  baseDate: "tools:business-days-calculator:base-date",
  dayOffset: "tools:business-days-calculator:day-offset",
  includeEndpoints: "tools:business-days-calculator:include-endpoints",
  includeStart: "tools:business-days-calculator:include-start",
  weekdayMode: "tools:business-days-calculator:weekday-mode",
  weekendDays: "tools:business-days-calculator:weekend-days",
  holidayInput: "tools:business-days-calculator:holiday-input",
} as const

function readStoredString(key: string, fallback: string) {
  const value = window.localStorage.getItem(key)

  return value ?? fallback
}

function readStoredBoolean(key: string, fallback: boolean) {
  const value = window.localStorage.getItem(key)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return fallback
}

function readStoredWeekdayMode(fallback: "weekend" | "working") {
  const value = window.localStorage.getItem(STORAGE_KEYS.weekdayMode)

  return value === "working" ? "working" : fallback
}

function readStoredWeekendDays(fallback: ReadonlyArray<number>) {
  const value = window.localStorage.getItem(STORAGE_KEYS.weekendDays)

  if (!value) {
    return normalizeWeekdayList([...fallback])
  }

  try {
    const parsed = JSON.parse(value)

    return Array.isArray(parsed)
      ? normalizeWeekdayList(parsed.map((entry) => Number(entry)))
      : normalizeWeekdayList([...fallback])
  } catch {
    return normalizeWeekdayList([...fallback])
  }
}

export {
  STORAGE_KEYS,
  readStoredBoolean,
  readStoredString,
  readStoredWeekdayMode,
  readStoredWeekendDays,
}
