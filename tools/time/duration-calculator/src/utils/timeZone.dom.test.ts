import { describe, it, expect } from 'vitest'
import {
  parseDateTimeInput,
  formatDateTimeParts,
  formatInTimeZone,
  toUtcTimestamp,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  getSupportedTimeZones,
  isTimeZoneSupported,
} from './timeZone'

describe('parseDateTimeInput', () => {
  it('parses full date time strings', () => {
    expect(parseDateTimeInput('2024-01-02 03:04:05')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 0,
    })
  })

  it('parses date-only strings', () => {
    expect(parseDateTimeInput('2024-01-02')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
  })

  it('parses fractional seconds', () => {
    expect(parseDateTimeInput('2024-01-02 03:04:05.6')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 600,
    })
  })

  it('rejects invalid dates', () => {
    expect(parseDateTimeInput('2024-02-30 10:00:00')).toBeNull()
  })
})

describe('formatDateTimeParts', () => {
  it('pads values consistently', () => {
    expect(
      formatDateTimeParts({
        year: 2024,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        millisecond: 6,
      }),
    ).toBe('2024-01-02 03:04:05.006')
  })
})

describe('time zone conversions', () => {
  it('includes UTC in supported time zones', () => {
    expect(getSupportedTimeZones()).toContain('UTC')
  })

  it('formats UTC timestamps in UTC', () => {
    expect(formatInTimeZone(0, 'UTC')).toBe('1970-01-01 00:00:00.000')
  })

  it('converts a UTC time to timestamp', () => {
    const utc = toUtcTimestamp(
      { year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
      'UTC',
    )
    expect(utc).toBe(0)
  })

  it('converts Asia/Shanghai to the expected UTC time', () => {
    const utc = toUtcTimestamp(
      { year: 2024, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
      'Asia/Shanghai',
    )
    expect(formatInTimeZone(utc, 'UTC')).toBe('2023-12-31 16:00:00.000')
  })

  it('formats offsets with sign and padding', () => {
    const offsetMs = getTimeZoneOffsetMs(Date.UTC(2024, 0, 1, 0, 0, 0), 'UTC')
    expect(formatOffsetLabel(offsetMs)).toBe('UTC+00:00')
    expect(formatOffsetLabel(-5.5 * 60 * 60 * 1000)).toBe('UTC-05:30')
  })
})

describe('isTimeZoneSupported', () => {
  it('returns true for known zones and false for invalid zones', () => {
    expect(isTimeZoneSupported('UTC')).toBe(true)
    expect(isTimeZoneSupported('Invalid/Zone')).toBe(false)
  })
})
