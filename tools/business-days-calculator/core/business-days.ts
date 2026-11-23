import {
  parseISODateInput as parseCalendarDate,
  toISODate as toCalendarISODate,
  toLocalISODate as toISODate,
} from "@workspace/calendar-date"

export { toISODate }

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type BusinessDayCountResult = Readonly<{
  businessDays: number
  totalDays: number
  weekendDays: number
  holidayDays: number
  isReversed: boolean
}>

export const weekdayOrder: WeekdayIndex[] = [0, 1, 2, 3, 4, 5, 6]

export function normalizeWeekdayList(values: ReadonlyArray<number>) {
  const unique = new Set<WeekdayIndex>()

  for (const value of values) {
    if (!Number.isInteger(value) || value < 0 || value > 6) {
      continue
    }

    unique.add(value as WeekdayIndex)
  }

  return Array.from(unique).sort((left, right) => left - right)
}

export function startOfLocalDay(date: Date) {
  const next = new Date(date.getTime())
  next.setHours(0, 0, 0, 0)
  return next
}

export function addDays(date: Date, days: number) {
  const next = new Date(date.getTime())

  next.setDate(next.getDate() + days)

  return next
}

export function parseISODateInput(value: string) {
  const date = parseCalendarDate(value)
  return date ? new Date(`${toCalendarISODate(date)}T00:00:00`) : null
}

export function parseHolidayList(input: string) {
  const dates = new Set<string>()
  const invalid: string[] = []

  for (const rawLine of input.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line) {
      continue
    }

    const parsed = parseISODateInput(line)

    if (!parsed) {
      invalid.push(line)
      continue
    }

    dates.add(toISODate(parsed))
  }

  return { dates, invalid }
}

export function isBusinessDay(
  date: Date,
  weekendDays: ReadonlySet<number>,
  holidays: ReadonlySet<string>
) {
  if (weekendDays.has(date.getDay())) {
    return false
  }

  return !holidays.has(toISODate(date))
}

export function countBusinessDays(
  start: Date,
  end: Date,
  options: Readonly<{
    weekendDays: ReadonlySet<number>
    holidays: ReadonlySet<string>
    includeEndpoints?: boolean
  }>
): BusinessDayCountResult {
  const includeEndpoints = options.includeEndpoints ?? true
  const normalizedStart = startOfLocalDay(start)
  const normalizedEnd = startOfLocalDay(end)
  let rangeStart = normalizedStart
  let rangeEnd = normalizedEnd
  let isReversed = false

  if (rangeStart.getTime() > rangeEnd.getTime()) {
    rangeStart = normalizedEnd
    rangeEnd = normalizedStart
    isReversed = true
  }

  let businessDays = 0
  let totalDays = 0
  let weekendDays = 0
  let holidayDays = 0

  for (
    let cursor = new Date(rangeStart.getTime());
    cursor.getTime() <= rangeEnd.getTime();
    cursor = addDays(cursor, 1)
  ) {
    const isStart = cursor.getTime() === rangeStart.getTime()
    const isEnd = cursor.getTime() === rangeEnd.getTime()

    if (!includeEndpoints && (isStart || isEnd)) {
      continue
    }

    totalDays += 1

    if (options.weekendDays.has(cursor.getDay())) {
      weekendDays += 1
      continue
    }

    if (options.holidays.has(toISODate(cursor))) {
      holidayDays += 1
      continue
    }

    businessDays += 1
  }

  return {
    businessDays,
    totalDays,
    weekendDays,
    holidayDays,
    isReversed,
  }
}

export function shiftBusinessDays(
  baseDate: Date,
  offset: number,
  options: Readonly<{
    weekendDays: ReadonlySet<number>
    holidays: ReadonlySet<string>
    includeStart?: boolean
  }>
) {
  if (!Number.isFinite(offset)) {
    return null
  }

  if (options.weekendDays.size === 7) {
    return null
  }

  const normalizedBase = startOfLocalDay(baseDate)

  if (offset === 0) {
    return normalizedBase
  }

  const includeStart = options.includeStart ?? false
  const direction = offset > 0 ? 1 : -1
  let remaining = Math.abs(Math.trunc(offset))
  let cursor = new Date(normalizedBase.getTime())

  if (
    includeStart &&
    isBusinessDay(cursor, options.weekendDays, options.holidays)
  ) {
    remaining -= 1

    if (remaining === 0) {
      return cursor
    }
  }

  while (remaining > 0) {
    cursor = addDays(cursor, direction)

    if (isBusinessDay(cursor, options.weekendDays, options.holidays)) {
      remaining -= 1
    }
  }

  return cursor
}
