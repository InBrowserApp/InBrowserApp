import { describe, it, expect, vi } from 'vitest'
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

describe('parseDateTimeInput', () => {
  it('parses valid date time strings', () => {
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

  it('parses date-only values with zeroed time parts', () => {
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

  it('rejects invalid dates', () => {
    expect(parseDateTimeInput('2024-02-30 10:00:00')).toBeNull()
  })

  it('rejects blank and malformed values', () => {
    expect(parseDateTimeInput('   ')).toBeNull()
    expect(parseDateTimeInput('2024/01/02 03:04:05')).toBeNull()
  })
})

describe('time zone conversions', () => {
  it('includes UTC in supported time zones', () => {
    expect(getSupportedTimeZones()).toContain('UTC')
  })

  it('falls back when Intl.supportedValuesOf throws', () => {
    if (!('supportedValuesOf' in Intl)) {
      expect(getSupportedTimeZones()).toContain('UTC')
      return
    }

    const spy = vi.spyOn(Intl, 'supportedValuesOf').mockImplementation(() => {
      throw new Error('unsupported')
    })

    expect(getSupportedTimeZones()).toContain('Africa/Cairo')

    spy.mockRestore()
  })

  it('falls back when Intl.supportedValuesOf is unavailable', () => {
    const descriptor = Object.getOwnPropertyDescriptor(Intl, 'supportedValuesOf')
    if (!descriptor || !descriptor.configurable) {
      expect(getSupportedTimeZones()).toContain('UTC')
      return
    }

    Object.defineProperty(Intl, 'supportedValuesOf', {
      configurable: true,
      value: undefined,
    })

    try {
      const timeZones = getSupportedTimeZones()
      expect(timeZones[0]).toBe('UTC')
      expect(timeZones).toContain('Europe/London')
    } finally {
      Object.defineProperty(Intl, 'supportedValuesOf', descriptor)
    }
  })

  it('falls back when Intl.supportedValuesOf is missing from Intl', () => {
    const descriptor = Object.getOwnPropertyDescriptor(Intl, 'supportedValuesOf')
    if (!descriptor || !descriptor.configurable) {
      expect(getSupportedTimeZones()).toContain('UTC')
      return
    }

    delete (Intl as { supportedValuesOf?: unknown }).supportedValuesOf

    try {
      const timeZones = getSupportedTimeZones()
      expect(timeZones[0]).toBe('UTC')
      expect(timeZones).toContain('Europe/Berlin')
    } finally {
      Object.defineProperty(Intl, 'supportedValuesOf', descriptor)
    }
  })

  it('skips preferred time zones that are not actually supported', async () => {
    if (!('supportedValuesOf' in Intl)) {
      expect(getSupportedTimeZones()).toContain('UTC')
      return
    }

    const realDateTimeFormat = Intl.DateTimeFormat
    const supportedValuesSpy = vi.spyOn(Intl, 'supportedValuesOf').mockReturnValue(['UTC'])
    const dateTimeFormatSpy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(((
      locales?: Intl.LocalesArgument,
      options?: Intl.DateTimeFormatOptions,
    ) => {
      const timeZone = options?.timeZone
      if (timeZone && ['Etc/UTC', 'GMT', 'Etc/GMT'].includes(timeZone)) {
        throw new RangeError('unsupported')
      }
      return new realDateTimeFormat(locales, options)
    }) as unknown as typeof Intl.DateTimeFormat)

    try {
      vi.resetModules()
      const isolated = await import('./timeZone')
      const timeZones = isolated.getSupportedTimeZones()
      expect(timeZones).toContain('UTC')
      expect(timeZones).not.toContain('Etc/GMT')
    } finally {
      supportedValuesSpy.mockRestore()
      dateTimeFormatSpy.mockRestore()
    }
  })

  it('formats UTC timestamps in UTC', () => {
    expect(formatInTimeZone(0, 'UTC')).toBe('1970-01-01 00:00:00.000')
  })

  it('formats date time parts', () => {
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

  it('reports unsupported time zones', () => {
    expect(isTimeZoneSupported('Mars/Phobos')).toBe(false)
  })

  it('converts a UTC time to timestamp', () => {
    const utc = toUtcTimestamp(
      { year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
      'UTC',
    )
    expect(utc).toBe(0)
  })

  it('handles DST gap normalization when converting to UTC', () => {
    const utc = toUtcTimestamp(
      { year: 2024, month: 3, day: 10, hour: 2, minute: 30, second: 0, millisecond: 0 },
      'America/New_York',
    )

    expect(utc).toBe(Date.UTC(2024, 2, 10, 6, 30, 0, 0))
  })

  it('converts Asia/Shanghai to the expected UTC time', () => {
    const utc = toUtcTimestamp(
      { year: 2024, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
      'Asia/Shanghai',
    )
    expect(formatInTimeZone(utc, 'UTC')).toBe('2023-12-31 16:00:00.000')
  })

  it('formats offsets with sign and padding', () => {
    const zeroOffset = getTimeZoneOffsetMs(Date.UTC(2024, 0, 1, 0, 0, 0), 'UTC')
    expect(formatOffsetLabel(zeroOffset)).toBe('UTC+00:00')
    expect(formatOffsetLabel(-90 * 60 * 1000)).toBe('UTC-01:30')
  })
})
