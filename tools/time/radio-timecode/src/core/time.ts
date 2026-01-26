export type TimeParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  weekday: number
  dayOfYear: number
  offsetMinutes: number
  isDst: boolean
}

const MONTH_DAYS_COMMON = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDayOfYear(year: number, month: number, day: number) {
  const days = MONTH_DAYS_COMMON.slice()
  if (isLeapYear(year)) days[1] = 29
  let total = 0
  for (let i = 0; i < month - 1; i += 1) total += days[i] ?? 0
  return total + day
}

export function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const parts = formatter.formatToParts(date)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0')
  const year = get('year')
  const month = get('month')
  const day = get('day')
  const hour = get('hour')
  const minute = get('minute')
  const second = get('second')
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  return Math.round((asUtc - date.getTime()) / 60000)
}

export function getStandardOffsetMinutes(date: Date, timeZone: string) {
  const year = date.getUTCFullYear()
  const jan = new Date(Date.UTC(year, 0, 1, 0, 0, 0))
  const jul = new Date(Date.UTC(year, 6, 1, 0, 0, 0))
  const janOffset = getTimeZoneOffsetMinutes(jan, timeZone)
  const julOffset = getTimeZoneOffsetMinutes(jul, timeZone)
  return Math.min(janOffset, julOffset)
}

export function isDstAt(date: Date, timeZone: string) {
  const offset = getTimeZoneOffsetMinutes(date, timeZone)
  const standard = getStandardOffsetMinutes(date, timeZone)
  return offset !== standard
}

export function willOffsetChangeWithinHour(date: Date, timeZone: string) {
  const nowOffset = getTimeZoneOffsetMinutes(date, timeZone)
  const nextOffset = getTimeZoneOffsetMinutes(new Date(date.getTime() + 3_600_000), timeZone)
  return nowOffset !== nextOffset
}

export function getTimeParts(date: Date, timeZone: string): TimeParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const parts = formatter.formatToParts(date)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0')
  const year = get('year')
  const month = get('month')
  const day = get('day')
  const hour = get('hour')
  const minute = get('minute')
  const second = get('second')
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  const dayOfYear = getDayOfYear(year, month, day)
  const offsetMinutes = getTimeZoneOffsetMinutes(date, timeZone)
  const isDst = isDstAt(date, timeZone)
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday,
    dayOfYear,
    offsetMinutes,
    isDst,
  }
}

export function getDstStatusForUtcDay(date: Date, timeZone: string) {
  const utcYear = date.getUTCFullYear()
  const utcMonth = date.getUTCMonth()
  const utcDay = date.getUTCDate()
  const start = new Date(Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0))
  const end = new Date(Date.UTC(utcYear, utcMonth, utcDay + 1, 0, 0, 0))
  return {
    start: isDstAt(start, timeZone),
    end: isDstAt(end, timeZone),
  }
}
