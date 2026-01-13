export type DateTimeParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const fallbackTimeZones = [
  'UTC',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'America/Anchorage',
  'America/Argentina/Buenos_Aires',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Phoenix',
  'America/Sao_Paulo',
  'Asia/Bangkok',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Adelaide',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Paris',
  'Europe/Stockholm',
  'Pacific/Auckland',
]

const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>()

function getDateTimeFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = dateTimeFormatterCache.get(timeZone)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  })
  dateTimeFormatterCache.set(timeZone, formatter)
  return formatter
}

export function getSupportedTimeZones(): string[] {
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    try {
      const values = Intl.supportedValuesOf('timeZone')
      return [...values].sort()
    } catch {
      return [...fallbackTimeZones]
    }
  }

  return [...fallbackTimeZones]
}

export function isTimeZoneSupported(timeZone: string): boolean {
  try {
    getDateTimeFormatter(timeZone)
    return true
  } catch {
    return false
  }
}

export function parseDateTimeInput(value: string): DateTimeParts | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/)

  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4] ?? 0)
  const minute = Number(match[5] ?? 0)
  const second = Number(match[6] ?? 0)

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute ||
    date.getUTCSeconds() !== second
  ) {
    return null
  }

  return { year, month, day, hour, minute, second }
}

export function formatDateTimeParts(parts: DateTimeParts): string {
  const year = String(parts.year).padStart(4, '0')
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')
  const hour = String(parts.hour).padStart(2, '0')
  const minute = String(parts.minute).padStart(2, '0')
  const second = String(parts.second).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function getZonedParts(timestamp: number, timeZone: string): DateTimeParts {
  const formatter = getDateTimeFormatter(timeZone)
  const parts = formatter.formatToParts(new Date(timestamp))
  const map = new Map<string, string>()
  for (const part of parts) {
    if (part.type !== 'literal') {
      map.set(part.type, part.value)
    }
  }

  return {
    year: Number(map.get('year')),
    month: Number(map.get('month')),
    day: Number(map.get('day')),
    hour: Number(map.get('hour')),
    minute: Number(map.get('minute')),
    second: Number(map.get('second')),
  }
}

export function getTimeZoneOffsetMs(timestamp: number, timeZone: string): number {
  const parts = getZonedParts(timestamp, timeZone)
  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
  return asUTC - timestamp
}

export function formatInTimeZone(timestamp: number, timeZone: string): string {
  return formatDateTimeParts(getZonedParts(timestamp, timeZone))
}

export function toUtcTimestamp(parts: DateTimeParts, timeZone: string): number {
  const guess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
  const offset = getTimeZoneOffsetMs(guess, timeZone)
  let utc = guess - offset
  const offsetNext = getTimeZoneOffsetMs(utc, timeZone)
  if (offsetNext !== offset) {
    utc = guess - offsetNext
  }
  return utc
}

export function formatOffsetLabel(offsetMs: number): string {
  const totalMinutes = Math.round(offsetMs / 60000)
  const sign = totalMinutes >= 0 ? '+' : '-'
  const absMinutes = Math.abs(totalMinutes)
  const hours = Math.floor(absMinutes / 60)
  const minutes = absMinutes % 60
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
