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

  it('rejects malformed date-time patterns', () => {
    expect(parseDateTimeInput('2024/01/02 03:04:05')).toBeNull()
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

  it('adjusts DST transitions when converting local time to UTC', () => {
    const parts = {
      year: 2024,
      month: 3,
      day: 10,
      hour: 2,
      minute: 30,
      second: 0,
      millisecond: 0,
    }

    const guess = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
    )
    const firstOffset = getTimeZoneOffsetMs(guess, 'America/New_York')
    const firstUtc = guess - firstOffset
    const secondOffset = getTimeZoneOffsetMs(firstUtc, 'America/New_York')

    expect(secondOffset).not.toBe(firstOffset)

    const timestamp = toUtcTimestamp(parts, 'America/New_York')
    expect(timestamp).toBe(guess - secondOffset)
    expect(formatInTimeZone(timestamp, 'America/New_York')).toContain('2024-03-10')
  })

  it('falls back when supportedValuesOf throws or is unavailable', () => {
    const originalSupportedValuesOf = Object.getOwnPropertyDescriptor(Intl, 'supportedValuesOf')
    const originalDateTimeFormat = Intl.DateTimeFormat

    Object.defineProperty(Intl, 'supportedValuesOf', {
      configurable: true,
      value: () => {
        throw new Error('unsupported')
      },
    })

    Object.defineProperty(Intl, 'DateTimeFormat', {
      configurable: true,
      value: function DateTimeFormatThrows() {
        throw new RangeError('unsupported timezone')
      },
    })

    const fromThrow = getSupportedTimeZones()
    expect(fromThrow).toContain('UTC')

    Object.defineProperty(Intl, 'supportedValuesOf', {
      configurable: true,
      value: undefined,
    })

    const fromMissing = getSupportedTimeZones()
    expect(fromMissing).toContain('UTC')

    if (originalSupportedValuesOf) {
      Object.defineProperty(Intl, 'supportedValuesOf', originalSupportedValuesOf)
    } else {
      Reflect.deleteProperty(Intl, 'supportedValuesOf')
    }
    Object.defineProperty(Intl, 'DateTimeFormat', {
      configurable: true,
      value: originalDateTimeFormat,
    })
  })
})
