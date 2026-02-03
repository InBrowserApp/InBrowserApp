import { describe, expect, it } from 'vitest'
import {
  formatDateTimeParts,
  formatInTimeZone,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from './timeZone'

describe('time zone utilities', () => {
  it('parses valid date-time inputs', () => {
    expect(parseDateTimeInput('2024-01-02 03:04:05.006')).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 6,
    })

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

  it('rejects invalid date-time inputs', () => {
    expect(parseDateTimeInput('')).toBeNull()
    expect(parseDateTimeInput('2024-13-01')).toBeNull()
  })

  it('formats date-time parts consistently', () => {
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

  it('formats offset labels', () => {
    expect(formatOffsetLabel(0)).toBe('UTC+00:00')
    expect(formatOffsetLabel(-5 * 60 * 60 * 1000)).toBe('UTC-05:00')
  })

  it('handles UTC conversions', () => {
    const timestamp = Date.UTC(2024, 0, 1, 0, 0, 0, 0)
    expect(getTimeZoneOffsetMs(timestamp, 'UTC')).toBe(0)
    expect(formatInTimeZone(timestamp, 'UTC')).toBe('2024-01-01 00:00:00.000')

    const parts = {
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }
    expect(toUtcTimestamp(parts, 'UTC')).toBe(timestamp)
  })

  it('reports supported time zones', () => {
    const zones = getSupportedTimeZones()
    expect(zones).toContain('UTC')
    expect(isTimeZoneSupported('UTC')).toBe(true)
    expect(isTimeZoneSupported('Invalid/Zone')).toBe(false)
  })
})
