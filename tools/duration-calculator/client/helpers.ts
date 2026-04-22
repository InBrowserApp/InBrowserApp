import { formatInTimeZone, isTimeZoneSupported } from "../core/time-zone"

import type { ResultSnapshot } from "./types"
import type { DurationParts } from "../core/duration"

function getDefaultTimeZone(fallback: string) {
  const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone

  return isTimeZoneSupported(resolved) ? resolved : fallback
}

function areDurationPartsEqual(left: DurationParts, right: DurationParts) {
  return (
    left.days === right.days &&
    left.hours === right.hours &&
    left.minutes === right.minutes &&
    left.seconds === right.seconds &&
    left.milliseconds === right.milliseconds
  )
}

function parseNonNegativeInteger(value: number | string) {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(value || "0", 10)

  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 0
}

function createResultSnapshot(
  timestamp: number | null,
  timeZone: string
): ResultSnapshot | null {
  if (timestamp === null) {
    return null
  }

  return {
    dateTime: formatInTimeZone(timestamp, timeZone),
    iso8601: new Date(timestamp).toISOString(),
    unixMilliseconds: String(timestamp),
    unixSeconds: String(Math.floor(timestamp / 1_000)),
  }
}

export {
  areDurationPartsEqual,
  createResultSnapshot,
  getDefaultTimeZone,
  parseNonNegativeInteger,
}
