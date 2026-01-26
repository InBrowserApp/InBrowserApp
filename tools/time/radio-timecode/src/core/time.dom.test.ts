import { describe, expect, it } from 'vitest'
import {
  getDayOfYear,
  getDstStatusForUtcDay,
  getTimeParts,
  getTimeZoneOffsetMinutes,
  isDstAt,
  isLeapYear,
} from './time'

describe('time helpers', () => {
  it('detects leap years and day-of-year', () => {
    expect(isLeapYear(2024)).toBe(true)
    expect(isLeapYear(2100)).toBe(false)
    expect(getDayOfYear(2024, 2, 29)).toBe(60)
  })

  it('reads UTC time parts', () => {
    const date = new Date(Date.UTC(2024, 0, 1, 12, 34, 56))
    const parts = getTimeParts(date, 'UTC')
    expect(parts.year).toBe(2024)
    expect(parts.month).toBe(1)
    expect(parts.day).toBe(1)
    expect(parts.hour).toBe(12)
    expect(parts.minute).toBe(34)
    expect(parts.second).toBe(56)
    expect(parts.dayOfYear).toBe(1)
    expect(getTimeZoneOffsetMinutes(date, 'UTC')).toBe(0)
  })

  it('identifies DST in London', () => {
    const winter = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    const summer = new Date(Date.UTC(2024, 6, 15, 12, 0, 0))
    expect(isDstAt(winter, 'Europe/London')).toBe(false)
    expect(isDstAt(summer, 'Europe/London')).toBe(true)
  })

  it('computes DST status for a UTC day', () => {
    const date = new Date(Date.UTC(2024, 5, 1, 0, 0, 0))
    const status = getDstStatusForUtcDay(date, 'America/Denver')
    expect(typeof status.start).toBe('boolean')
    expect(typeof status.end).toBe('boolean')
  })
})
