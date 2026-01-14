export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const weekdayOrder: WeekdayIndex[] = [0, 1, 2, 3, 4, 5, 6]

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

export function normalizeWeekdayList(values: Array<number>): WeekdayIndex[] {
  const unique = new Set<WeekdayIndex>()
  for (const value of values) {
    const numeric = Number(value)
    if (!Number.isInteger(numeric)) continue
    if (numeric < 0 || numeric > 6) continue
    unique.add(numeric as WeekdayIndex)
  }
  return Array.from(unique).sort((left, right) => left - right)
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime())
  next.setDate(next.getDate() + days)
  return next
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseHolidayList(input: string): {
  dates: Set<string>
  invalid: string[]
} {
  const dates = new Set<string>()
  const invalid: string[] = []
  const lines = input.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const match = isoDatePattern.exec(trimmed)
    if (!match) {
      invalid.push(trimmed)
      continue
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    if (!isValidDateParts(year, month, day)) {
      invalid.push(trimmed)
      continue
    }

    dates.add(`${match[1]}-${match[2]}-${match[3]}`)
  }

  return { dates, invalid }
}

export function isBusinessDay(
  date: Date,
  weekendDays: Set<number>,
  holidays: Set<string>,
): boolean {
  const dayIndex = date.getDay()
  if (weekendDays.has(dayIndex)) return false
  return !holidays.has(toISODate(date))
}

export type BusinessDayCountResult = {
  businessDays: number
  totalDays: number
  weekendDays: number
  holidayDays: number
  isReversed: boolean
}

export function countBusinessDays(
  start: Date,
  end: Date,
  options: {
    weekendDays: Set<number>
    holidays: Set<string>
    includeEndpoints?: boolean
  },
): BusinessDayCountResult {
  const includeEndpoints = options.includeEndpoints ?? true
  const normalizedStart = startOfLocalDay(start)
  const normalizedEnd = startOfLocalDay(end)

  let rangeStart = normalizedStart
  let rangeEnd = normalizedEnd
  let isReversed = false

  if (rangeStart.getTime() > rangeEnd.getTime()) {
    isReversed = true
    rangeStart = normalizedEnd
    rangeEnd = normalizedStart
  }

  let businessDays = 0
  let totalDays = 0
  let weekendDays = 0
  let holidayDays = 0

  let cursor = new Date(rangeStart.getTime())
  const endTime = rangeEnd.getTime()

  while (cursor.getTime() <= endTime) {
    const isStart = cursor.getTime() === rangeStart.getTime()
    const isEnd = cursor.getTime() === endTime

    if (!includeEndpoints && (isStart || isEnd)) {
      cursor = addDays(cursor, 1)
      continue
    }

    totalDays += 1
    const isWeekend = options.weekendDays.has(cursor.getDay())
    const isHoliday = options.holidays.has(toISODate(cursor))

    if (isWeekend) {
      weekendDays += 1
    } else if (isHoliday) {
      holidayDays += 1
    } else {
      businessDays += 1
    }

    cursor = addDays(cursor, 1)
  }

  return {
    businessDays,
    totalDays,
    weekendDays,
    holidayDays,
    isReversed,
  }
}

export function addBusinessDays(
  base: Date,
  offset: number,
  options: {
    weekendDays: Set<number>
    holidays: Set<string>
    includeStart?: boolean
  },
): Date | null {
  if (!Number.isFinite(offset)) return null
  if (options.weekendDays.size === 7) return null

  const normalizedBase = startOfLocalDay(base)
  if (offset === 0) return normalizedBase

  const includeStart = options.includeStart ?? false
  let remaining = Math.abs(offset)
  const direction = offset > 0 ? 1 : -1
  let cursor = new Date(normalizedBase.getTime())

  if (includeStart && isBusinessDay(cursor, options.weekendDays, options.holidays)) {
    remaining -= 1
    if (remaining === 0) return cursor
  }

  while (remaining > 0) {
    cursor = addDays(cursor, direction)
    if (isBusinessDay(cursor, options.weekendDays, options.holidays)) {
      remaining -= 1
    }
  }

  return cursor
}

function isValidDateParts(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false
  }
  if (month < 1 || month > 12) return false
  if (day < 1) return false

  const maxDay = new Date(year, month, 0).getDate()
  return day <= maxDay
}
