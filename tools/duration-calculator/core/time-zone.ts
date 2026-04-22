type DateTimeParts = Readonly<{
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}>

type TimeZoneOption = Readonly<{
  label: string
  value: string
}>

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

function getDateTimeFormatter(timeZone: string) {
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

function readSupportedTimeZones() {
  const supportedValuesOf =
    typeof Intl !== "undefined" && "supportedValuesOf" in Intl
      ? Intl.supportedValuesOf
      : undefined

  if (!supportedValuesOf) {
    return [...FALLBACK_TIME_ZONES]
  }

  try {
    return [...supportedValuesOf("timeZone")]
  } catch {
    return [...FALLBACK_TIME_ZONES]
  }
}

function isTimeZoneSupported(timeZone: string) {
  try {
    getDateTimeFormatter(timeZone)
    return true
  } catch {
    return false
  }
}

function getSupportedTimeZones() {
  const timeZones = new Set(readSupportedTimeZones())

  for (const timeZone of PREFERRED_TIME_ZONES) {
    if (!timeZones.has(timeZone) && isTimeZoneSupported(timeZone)) {
      timeZones.add(timeZone)
    }
  }

  const preferredAvailable = PREFERRED_TIME_ZONES.filter((timeZone) =>
    timeZones.has(timeZone)
  )
  const preferredSet = new Set<string>(preferredAvailable)
  const rest = [...timeZones]
    .filter((timeZone) => !preferredSet.has(timeZone))
    .sort()

  return [...preferredAvailable, ...rest]
}

function parseDateTimeInput(value: string): DateTimeParts | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,3}))?)?)?$/
  )

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4] ?? 0)
  const minute = Number(match[5] ?? 0)
  const second = Number(match[6] ?? 0)
  const millisecond = match[7] ? Number(match[7].padEnd(3, "0")) : 0

  const date = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
  )

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute ||
    date.getUTCSeconds() !== second ||
    date.getUTCMilliseconds() !== millisecond
  ) {
    return null
  }

  return { year, month, day, hour, minute, second, millisecond }
}

function formatDateTimeParts(parts: DateTimeParts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}.${String(parts.millisecond).padStart(3, "0")}`
}

function getZonedParts(timestamp: number, timeZone: string): DateTimeParts {
  const parts = getDateTimeFormatter(timeZone).formatToParts(
    new Date(timestamp)
  )
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
    millisecond: new Date(timestamp).getUTCMilliseconds(),
  }
}

function getTimeZoneOffsetMs(timestamp: number, timeZone: string) {
  const parts = getZonedParts(timestamp, timeZone)
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond
  )

  return asUtc - timestamp
}

function formatInTimeZone(timestamp: number, timeZone: string) {
  return formatDateTimeParts(getZonedParts(timestamp, timeZone))
}

function toUtcTimestamp(parts: DateTimeParts, timeZone: string) {
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
  let utc = guess - offset
  const nextOffset = getTimeZoneOffsetMs(utc, timeZone)

  if (nextOffset !== offset) {
    utc = guess - nextOffset
  }

  return utc
}

function formatOffsetLabel(offsetMs: number) {
  const totalMinutes = Math.round(offsetMs / 60_000)
  const sign = totalMinutes >= 0 ? "+" : "-"
  const absoluteMinutes = Math.abs(totalMinutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const minutes = absoluteMinutes % 60

  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function buildTimeZoneOptions(referenceTimestamp: number): TimeZoneOption[] {
  return getSupportedTimeZones().map((timeZone) => ({
    label: `${timeZone} (${formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp, timeZone))})`,
    value: timeZone,
  }))
}

export {
  buildTimeZoneOptions,
  formatInTimeZone,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
}
export type { TimeZoneOption }
