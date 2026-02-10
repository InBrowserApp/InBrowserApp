import { describe, it, expect } from 'vitest'
import {
  durationPartsToMilliseconds,
  formatFraction,
  formatDurationLabel,
  formatIsoDuration,
  millisecondsToDurationParts,
  normalizeDurationParts,
  parseIsoDuration,
} from './duration'

describe('parseIsoDuration', () => {
  it('parses day and time components', () => {
    expect(parseIsoDuration('P1DT2H3M4.005S')).toEqual({
      sign: 1,
      parts: {
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        milliseconds: 5,
      },
    })
  })

  it('parses fractional seconds', () => {
    expect(parseIsoDuration('PT0.6S')).toEqual({
      sign: 1,
      parts: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 600,
      },
    })
  })

  it('supports signed durations', () => {
    expect(parseIsoDuration('-PT15M')).toEqual({
      sign: -1,
      parts: {
        days: 0,
        hours: 0,
        minutes: 15,
        seconds: 0,
        milliseconds: 0,
      },
    })
  })

  it('rejects empty durations', () => {
    expect(parseIsoDuration('P')).toBeNull()
  })

  it('returns null for blank and malformed ISO strings', () => {
    expect(parseIsoDuration('   ')).toBeNull()
    expect(parseIsoDuration('invalid')).toBeNull()
  })
})

describe('duration formatting', () => {
  it('formats ISO 8601 durations', () => {
    expect(formatIsoDuration({ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 })).toBe(
      'P1DT2H3M4.005S',
    )
  })

  it('formats zero durations', () => {
    expect(formatIsoDuration({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })).toBe(
      'PT0S',
    )
  })

  it('formats signed durations', () => {
    expect(
      formatIsoDuration({ days: 0, hours: 0, minutes: 1, seconds: 0, milliseconds: 0 }, -1),
    ).toBe('-PT1M')
  })

  it('formats labels consistently', () => {
    expect(
      formatDurationLabel({ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }),
    ).toBe('1d 02:03:04.005')
  })
})

describe('formatFraction', () => {
  it('trims trailing zeros', () => {
    expect(formatFraction(1, 3)).toBe('1')
    expect(formatFraction(1.5, 3)).toBe('1.5')
  })

  it('handles non-finite values', () => {
    expect(formatFraction(Number.NaN, 2)).toBe('')
    expect(formatFraction(Number.POSITIVE_INFINITY, 2)).toBe('')
  })
})

describe('duration math', () => {
  it('converts between milliseconds and parts', () => {
    const parts = millisecondsToDurationParts(90_061_005)
    expect(parts).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      milliseconds: 5,
    })
    expect(durationPartsToMilliseconds(parts)).toBe(90_061_005)
  })

  it('normalizes larger units', () => {
    expect(
      normalizeDurationParts({ days: 0, hours: 0, minutes: 61, seconds: 0, milliseconds: 0 }),
    ).toEqual({
      days: 0,
      hours: 1,
      minutes: 1,
      seconds: 0,
      milliseconds: 0,
    })
  })

  it('coerces non-finite duration parts to zero milliseconds', () => {
    expect(
      durationPartsToMilliseconds({
        days: Number.POSITIVE_INFINITY,
        hours: Number.NaN,
        minutes: 1,
        seconds: Number.NEGATIVE_INFINITY,
        milliseconds: 5,
      }),
    ).toBe(60_005)
  })
})
