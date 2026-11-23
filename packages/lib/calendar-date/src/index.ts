export const MIN_ISO_DATE = "0001-01-01"
export const MAX_ISO_DATE = "9999-12-31"

const millisecondsPerDay = 86_400_000
const minTimestamp = Date.parse(MIN_ISO_DATE)
const maxTimestamp = Date.parse(MAX_ISO_DATE)

export const MAX_CALENDAR_DAY_OFFSET =
  (maxTimestamp - minTimestamp) / millisecondsPerDay

export function toLocalISODate(date: Date) {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10)
}

/** Date-only values use UTC midnight so local clock changes cannot move a day. */
export function parseISODateInput(value: string) {
  const normalized = value.trim()
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(normalized) ||
    normalized < MIN_ISO_DATE ||
    normalized > MAX_ISO_DATE
  ) {
    return null
  }

  const date = new Date(`${normalized}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && toISODate(date) === normalized
    ? date
    : null
}

export function calendarDayDifference(start: Date, end: Date) {
  return Math.abs(end.getTime() - start.getTime()) / millisecondsPerDay
}

export function shiftCalendarDays(date: Date, days: number) {
  if (!Number.isSafeInteger(days)) return null

  const timestamp = date.getTime() + days * millisecondsPerDay
  return timestamp >= minTimestamp && timestamp <= maxTimestamp
    ? new Date(timestamp)
    : null
}
