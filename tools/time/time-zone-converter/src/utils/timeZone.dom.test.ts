import { describe, it, expect } from 'vitest'
import {
  parseDateTimeInput,
  formatInTimeZone,
  toUtcTimestamp,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  getSupportedTimeZones,
} from './timeZone'

describe('parseDateTimeInput', () => {
  it('parses valid date time strings', () => {
    expect(parseDateTimeInput('2024-01-02 03:04:05')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
    })
  })

  it('rejects invalid dates', () => {
    expect(parseDateTimeInput('2024-02-30 10:00:00')).toBeNull()
  })
})

describe('time zone conversions', () => {
  it('includes UTC in supported time zones', () => {
    expect(getSupportedTimeZones()).toContain('UTC')
  })

  it('formats UTC timestamps in UTC', () => {
    expect(formatInTimeZone(0, 'UTC')).toBe('1970-01-01 00:00:00')
  })

  it('converts a UTC time to timestamp', () => {
    const utc = toUtcTimestamp(
      { year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      'UTC',
    )
    expect(utc).toBe(0)
  })

  it('converts Asia/Shanghai to the expected UTC time', () => {
    const utc = toUtcTimestamp(
      { year: 2024, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
      'Asia/Shanghai',
    )
    expect(formatInTimeZone(utc, 'UTC')).toBe('2023-12-31 16:00:00')
  })

  it('formats offsets with sign and padding', () => {
    const offsetMs = getTimeZoneOffsetMs(Date.UTC(2024, 0, 1, 0, 0, 0), 'UTC')
    expect(formatOffsetLabel(offsetMs)).toBe('UTC+00:00')
  })
})
