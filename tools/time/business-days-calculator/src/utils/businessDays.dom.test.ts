import { describe, it, expect } from 'vitest'
import {
  addBusinessDays,
  countBusinessDays,
  isBusinessDay,
  normalizeWeekdayList,
  parseHolidayList,
  startOfLocalDay,
  toISODate,
} from './businessDays'

describe('normalizeWeekdayList', () => {
  it('filters, deduplicates, and sorts weekday indexes', () => {
    expect(normalizeWeekdayList([6, 1, 0, 1, 8, -1, 3])).toEqual([0, 1, 3, 6])
  })

  it('returns an empty array for empty input', () => {
    expect(normalizeWeekdayList([])).toEqual([])
  })

  it('ignores non-integer weekday values', () => {
    expect(normalizeWeekdayList([1.2, Number.NaN, Number.POSITIVE_INFINITY, 3])).toEqual([3])
  })
})

describe('startOfLocalDay', () => {
  it('normalizes to local midnight', () => {
    const date = new Date(2024, 0, 5, 15, 30, 45, 123)
    const normalized = startOfLocalDay(date)
    expect(normalized.getFullYear()).toBe(2024)
    expect(normalized.getMonth()).toBe(0)
    expect(normalized.getDate()).toBe(5)
    expect(normalized.getHours()).toBe(0)
    expect(normalized.getMinutes()).toBe(0)
    expect(normalized.getSeconds()).toBe(0)
  })
})

describe('toISODate', () => {
  it('formats date parts with zero padding', () => {
    const date = new Date(2024, 0, 5)
    expect(toISODate(date)).toBe('2024-01-05')
  })
})

describe('parseHolidayList', () => {
  it('parses valid ISO dates and reports invalid entries', () => {
    const result = parseHolidayList('2024-01-01\ninvalid\n2024-02-30\n2024-12-25')
    expect(Array.from(result.dates)).toEqual(['2024-01-01', '2024-12-25'])
    expect(result.invalid).toEqual(['invalid', '2024-02-30'])
  })

  it('ignores blank lines and de-duplicates dates', () => {
    const result = parseHolidayList('  \n2024-01-01\n2024-01-01\n')
    expect(Array.from(result.dates)).toEqual(['2024-01-01'])
    expect(result.invalid).toEqual([])
  })

  it('marks out-of-range month and day as invalid', () => {
    const result = parseHolidayList('2024-00-01\n2024-01-00')
    expect(Array.from(result.dates)).toEqual([])
    expect(result.invalid).toEqual(['2024-00-01', '2024-01-00'])
  })
})

describe('isBusinessDay', () => {
  it('returns false for weekend days and holidays', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set(['2024-01-01'])
    expect(isBusinessDay(new Date(2024, 0, 6), weekendDays, holidays)).toBe(false)
    expect(isBusinessDay(new Date(2024, 0, 1), weekendDays, holidays)).toBe(false)
  })

  it('returns true for weekday non-holidays', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set(['2024-01-01'])
    expect(isBusinessDay(new Date(2024, 0, 3), weekendDays, holidays)).toBe(true)
  })
})

describe('countBusinessDays', () => {
  it('counts business days with endpoints included', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set(['2024-01-01'])
    const result = countBusinessDays(new Date(2024, 0, 1), new Date(2024, 0, 7), {
      weekendDays,
      holidays,
      includeEndpoints: true,
    })
    expect(result).toEqual({
      businessDays: 4,
      totalDays: 7,
      weekendDays: 2,
      holidayDays: 1,
      isReversed: false,
    })
  })

  it('excludes endpoints when configured', () => {
    const weekendDays = new Set([0, 6])
    const result = countBusinessDays(new Date(2024, 0, 1), new Date(2024, 0, 7), {
      weekendDays,
      holidays: new Set(),
      includeEndpoints: false,
    })
    expect(result.totalDays).toBe(5)
    expect(result.weekendDays).toBe(1)
    expect(result.businessDays).toBe(4)
  })

  it('flags reversed ranges', () => {
    const weekendDays = new Set([0, 6])
    const result = countBusinessDays(new Date(2024, 0, 7), new Date(2024, 0, 1), {
      weekendDays,
      holidays: new Set(),
    })
    expect(result.isReversed).toBe(true)
    expect(result.totalDays).toBe(7)
  })
})

describe('addBusinessDays', () => {
  it('adds and subtracts business days with weekend skipping', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set<string>()

    const added = addBusinessDays(new Date(2024, 0, 5), 1, { weekendDays, holidays })
    const subtracted = addBusinessDays(new Date(2024, 0, 8), -1, { weekendDays, holidays })

    expect(added && toISODate(added)).toBe('2024-01-08')
    expect(subtracted && toISODate(subtracted)).toBe('2024-01-05')
  })

  it('counts the start date when includeStart is enabled', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set<string>()

    const added = addBusinessDays(new Date(2024, 0, 5), 1, {
      weekendDays,
      holidays,
      includeStart: true,
    })

    expect(added && toISODate(added)).toBe('2024-01-05')
  })

  it('returns null when all days are weekends', () => {
    const weekendDays = new Set([0, 1, 2, 3, 4, 5, 6])
    const holidays = new Set<string>()

    expect(addBusinessDays(new Date(2024, 0, 5), 3, { weekendDays, holidays })).toBeNull()
  })

  it('returns null when offset is not finite', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set<string>()

    expect(
      addBusinessDays(new Date(2024, 0, 5), Number.POSITIVE_INFINITY, { weekendDays, holidays }),
    ).toBeNull()
  })

  it('returns the normalized base date when offset is zero', () => {
    const weekendDays = new Set([0, 6])
    const holidays = new Set<string>()

    const result = addBusinessDays(new Date(2024, 0, 5, 9, 30), 0, { weekendDays, holidays })
    expect(result && toISODate(result)).toBe('2024-01-05')
    expect(result?.getHours()).toBe(0)
  })
})
