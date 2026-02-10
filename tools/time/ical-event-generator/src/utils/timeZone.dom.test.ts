import { describe, it, expect, vi, afterEach } from 'vitest'
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

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

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

  it('rejects empty and malformed dates', () => {
    expect(parseDateInput('   ')).toBeNull()
    expect(parseDateInput('20240102')).toBeNull()
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

  it('parses date-only input as midnight', () => {
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

  it('rejects empty and malformed date-times', () => {
    expect(parseDateTimeInput('')).toBeNull()
    expect(parseDateTimeInput('2024/01/02 10:00:00')).toBeNull()
  })

  it('rejects invalid hour, minute, and second values', () => {
    expect(parseDateTimeInput('2024-01-02 24:00:00')).toBeNull()
    expect(parseDateTimeInput('2024-01-02 10:60:00')).toBeNull()
    expect(parseDateTimeInput('2024-01-02 10:00:60')).toBeNull()
  })
})

describe('time zone helpers', () => {
  it('formats and resolves offsets for UTC', () => {
    expect(formatInTimeZone(0, 'UTC')).toBe('1970-01-01 00:00:00.000')
    expect(getTimeZoneOffsetMs(0, 'UTC')).toBe(0)
    expect(formatOffsetLabel(0)).toBe('UTC+00:00')
  })

  it('resolves supported time zones with preferred entries first', () => {
    const zones = getSupportedTimeZones()
    expect(zones.length).toBeGreaterThan(0)
    expect(zones).toContain('UTC')
    expect(isTimeZoneSupported('UTC')).toBe(true)
  })

  it('uses Intl.supportedValuesOf when available', () => {
    vi.spyOn(Intl, 'supportedValuesOf').mockReturnValue(['UTC', 'America/New_York'])

    const zones = getSupportedTimeZones()

    expect(zones[0]).toBe('UTC')
    expect(zones).toContain('America/New_York')
  })

  it('falls back when Intl.supportedValuesOf throws', () => {
    vi.spyOn(Intl, 'supportedValuesOf').mockImplementation(() => {
      throw new Error('boom')
    })

    const zones = getSupportedTimeZones()

    expect(zones).toContain('UTC')
  })

  it('falls back when Intl.supportedValuesOf is unavailable', () => {
    const nativeIntl = globalThis.Intl
    vi.stubGlobal('Intl', {
      DateTimeFormat: nativeIntl.DateTimeFormat,
    })

    const zones = getSupportedTimeZones()

    expect(zones).toContain('UTC')
  })

  it('skips preferred zones that are not actually supported', async () => {
    const nativeIntl = globalThis.Intl

    class MockDateTimeFormat extends nativeIntl.DateTimeFormat {
      constructor(locales?: string | string[], options?: Intl.DateTimeFormatOptions) {
        if (options?.timeZone === 'Etc/GMT') {
          throw new RangeError('Unsupported time zone')
        }
        super(locales, options)
      }
    }

    vi.stubGlobal('Intl', {
      DateTimeFormat: MockDateTimeFormat,
      supportedValuesOf: () => [],
    })

    vi.resetModules()
    const freshTimeZoneModule = await import('./timeZone')
    const zones = freshTimeZoneModule.getSupportedTimeZones()

    expect(zones).not.toContain('Etc/GMT')
    expect(zones).toContain('UTC')
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

  it('handles DST transitions when converting to UTC timestamps', () => {
    const timestamp = toUtcTimestamp(
      {
        year: 2024,
        month: 3,
        day: 10,
        hour: 2,
        minute: 30,
        second: 0,
        millisecond: 0,
      },
      'America/New_York',
    )

    expect(Number.isFinite(timestamp)).toBe(true)
    expect(formatInTimeZone(timestamp, 'America/New_York').startsWith('2024-03-10')).toBe(true)
  })
})
