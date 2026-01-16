import { describe, it, expect } from 'vitest'
import {
  parseDateInput,
  parseDateTimeInput,
  formatInTimeZone,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  toUtcTimestamp,
} from './timeZone'

describe('parseDateInput', () => {
  it('parses valid dates', () => {
    expect(parseDateInput('2024-01-02')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
  })

  it('rejects invalid dates', () => {
    expect(parseDateInput('2024-02-30')).toBeNull()
  })
})

describe('parseDateTimeInput', () => {
  it('parses valid date-times', () => {
    expect(parseDateTimeInput('2024-01-02 03:04:05.006')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 6,
    })
  })

  it('rejects invalid date-times', () => {
    expect(parseDateTimeInput('2024-02-30 10:00:00')).toBeNull()
  })
})

describe('time zone helpers', () => {
  it('formats and resolves offsets for UTC', () => {
    expect(formatInTimeZone(0, 'UTC')).toBe('1970-01-01 00:00:00.000')
    expect(getTimeZoneOffsetMs(0, 'UTC')).toBe(0)
    expect(formatOffsetLabel(0)).toBe('UTC+00:00')
  })

  it('resolves supported time zones', () => {
    const zones = getSupportedTimeZones()
    expect(zones.length).toBeGreaterThan(0)
    expect(zones).toContain('UTC')
    expect(isTimeZoneSupported('UTC')).toBe(true)
  })

  it('converts local parts to UTC timestamps', () => {
    const parts = {
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 6,
    }
    expect(toUtcTimestamp(parts, 'UTC')).toBe(Date.UTC(2024, 0, 2, 3, 4, 5, 6))
  })
})
