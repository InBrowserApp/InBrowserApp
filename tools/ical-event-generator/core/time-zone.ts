import type { DateOnlyParts, DateTimeParts } from "./ics"

const FALLBACK_TIME_ZONES = [
  "UTC",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "America/Anchorage",
  "America/Argentina/Buenos_Aires",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Phoenix",
  "America/Sao_Paulo",
  "Asia/Bangkok",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Adelaide",
  "Australia/Sydney",
  "Europe/Amsterdam",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Moscow",
  "Europe/Paris",
  "Europe/Stockholm",
  "Pacific/Auckland",
] as const

const PREFERRED_TIME_ZONES = ["UTC", "Etc/UTC", "GMT", "Etc/GMT"] as const

const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>()

function getDateTimeFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = dateTimeFormatterCache.get(timeZone)

  if (cached) {
    return cached
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  })

  dateTimeFormatterCache.set(timeZone, formatter)

  return formatter
}

function getSupportedTimeZones(): string[] {
  let values: string[]

  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    try {
      values = [...Intl.supportedValuesOf("timeZone")]
    } catch {
      values = [...FALLBACK_TIME_ZONES]
    }
  } else {
    values = [...FALLBACK_TIME_ZONES]
  }

  const available = new Set<string>(values)
  const preferred = PREFERRED_TIME_ZONES.filter((timeZone) => {
    if (available.has(timeZone)) {
      return true
    }

    if (isTimeZoneSupported(timeZone)) {
      available.add(timeZone)
      return true
    }

    return false
  })
  const preferredSet = new Set<string>(preferred)
  const rest = [...available].filter((timeZone) => !preferredSet.has(timeZone))

  return [...preferred, ...rest.sort()]
}

function isTimeZoneSupported(timeZone: string): boolean {
  try {
    getDateTimeFormatter(timeZone)
    return true
  } catch {
    return false
  }
}

function parseDateInput(value: string): DateOnlyParts | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return { year, month, day }
}

function parseTimeInput(
  value: string
): Pick<DateTimeParts, "hour" | "minute"> | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const match = trimmed.match(/^(\d{2}):(\d{2})$/)

  if (!match) {
    return null
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null
  }

  return { hour, minute }
}

function combineDateAndTime(date: string, time: string): DateTimeParts | null {
  const dateParts = parseDateInput(date)
  const timeParts = parseTimeInput(time)

  if (!dateParts || !timeParts) {
    return null
  }

  return {
    ...dateParts,
    ...timeParts,
    second: 0,
    millisecond: 0,
  }
}

function getInputValueParts(timestampMs: number, timeZone?: string) {
  if (!timeZone) {
    const date = new Date(timestampMs)

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    }
  }

  const parts = getZonedParts(timestampMs, timeZone)

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  }
}

function toDateInputValue(timestampMs: number, timeZone?: string): string {
  const parts = getInputValueParts(timestampMs, timeZone)
  const year = String(parts.year).padStart(4, "0")
  const month = String(parts.month).padStart(2, "0")
  const day = String(parts.day).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function toTimeInputValue(timestampMs: number, timeZone?: string): string {
  const parts = getInputValueParts(timestampMs, timeZone)
  const hour = String(parts.hour).padStart(2, "0")
  const minute = String(parts.minute).padStart(2, "0")

  return `${hour}:${minute}`
}

function addDays(parts: DateOnlyParts, days: number): DateOnlyParts {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  date.setUTCDate(date.getUTCDate() + days)

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

function getZonedParts(timestampMs: number, timeZone: string): DateTimeParts {
  const formatter = getDateTimeFormatter(timeZone)
  const parts = formatter.formatToParts(new Date(timestampMs))
  const values = new Map<string, string>()

  for (const part of parts) {
    if (part.type !== "literal") {
      values.set(part.type, part.value)
    }
  }

  return {
    year: Number(values.get("year")),
    month: Number(values.get("month")),
    day: Number(values.get("day")),
    hour: Number(values.get("hour")),
    minute: Number(values.get("minute")),
    second: Number(values.get("second")),
    millisecond: new Date(timestampMs).getUTCMilliseconds(),
  }
}

function getTimeZoneOffsetMs(timestampMs: number, timeZone: string): number {
  const parts = getZonedParts(timestampMs, timeZone)
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond
  )

  return asUtc - timestampMs
}

function toUtcTimestamp(parts: DateTimeParts, timeZone: string): number {
  const guess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond
  )
  const offset = getTimeZoneOffsetMs(guess, timeZone)
  let utcTimestamp = guess - offset
  const adjustedOffset = getTimeZoneOffsetMs(utcTimestamp, timeZone)

  if (adjustedOffset !== offset) {
    utcTimestamp = guess - adjustedOffset
  }

  return utcTimestamp
}

function formatOffsetLabel(offsetMs: number): string {
  const totalMinutes = Math.round(offsetMs / 60_000)
  const sign = totalMinutes >= 0 ? "+" : "-"
  const absoluteMinutes = Math.abs(totalMinutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const minutes = absoluteMinutes % 60

  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export {
  addDays,
  combineDateAndTime,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateInput,
  parseTimeInput,
  toDateInputValue,
  toTimeInputValue,
  toUtcTimestamp,
}
