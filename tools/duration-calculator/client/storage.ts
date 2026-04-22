import { normalizeDurationParts } from "../core/duration"

import type { DurationParts } from "../core/duration"

const DEFAULT_BASE_TIME_ZONE = "UTC"
const DEFAULT_BASE_INPUT = "2024-01-01 12:00:00.000"
const DEFAULT_DURATION_ISO = "PT1H"
const DEFAULT_DURATION_PARTS: DurationParts = {
  days: 0,
  hours: 1,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
}
const STORAGE_KEYS = {
  baseInput: "tools:duration-calculator:base-input",
  baseTimeZone: "tools:duration-calculator:base-timezone",
  durationIso: "tools:duration-calculator:duration-iso",
  durationParts: "tools:duration-calculator:duration-parts",
} as const

function readStoredDurationParts() {
  const stored = window.localStorage.getItem(STORAGE_KEYS.durationParts)

  if (!stored) {
    return DEFAULT_DURATION_PARTS
  }

  try {
    const parsed = JSON.parse(stored) as Partial<DurationParts>

    return normalizeDurationParts({
      days: Number(parsed.days) || 0,
      hours: Number(parsed.hours) || 0,
      minutes: Number(parsed.minutes) || 0,
      seconds: Number(parsed.seconds) || 0,
      milliseconds: Number(parsed.milliseconds) || 0,
    })
  } catch {
    return DEFAULT_DURATION_PARTS
  }
}

function readStoredString(key: string, fallback: string) {
  const stored = window.localStorage.getItem(key)

  return stored && stored.trim() ? stored : fallback
}

export {
  DEFAULT_BASE_INPUT,
  DEFAULT_BASE_TIME_ZONE,
  DEFAULT_DURATION_ISO,
  DEFAULT_DURATION_PARTS,
  STORAGE_KEYS,
  readStoredDurationParts,
  readStoredString,
}
