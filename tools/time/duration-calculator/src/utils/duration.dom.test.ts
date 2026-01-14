import { describe, it, expect } from 'vitest'
import {
  durationPartsToMilliseconds,
  formatDurationLabel,
  formatFraction,
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

  it('parses comma fractional seconds', () => {
    expect(parseIsoDuration('PT1,2S')).toEqual({
      sign: 1,
      parts: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 1,
        milliseconds: 200,
      },
    })
  })

  it('rejects empty durations', () => {
    expect(parseIsoDuration('P')).toBeNull()
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

  it('formats day-only durations', () => {
    expect(formatIsoDuration({ days: 2, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })).toBe(
      'P2D',
    )
  })

  it('formats negative durations with a sign', () => {
    expect(
      formatIsoDuration({ days: 0, hours: 1, minutes: 0, seconds: 0, milliseconds: 0 }, -1),
    ).toBe('-PT1H')
  })

  it('formats labels consistently', () => {
    expect(
      formatDurationLabel({ days: 1, hours: 2, minutes: 3, seconds: 4, milliseconds: 5 }),
    ).toBe('1d 02:03:04.005')
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

  it('coerces non-finite parts to zero', () => {
    expect(
      durationPartsToMilliseconds({
        days: Number.POSITIVE_INFINITY,
        hours: Number.NaN,
        minutes: 1,
        seconds: 0,
        milliseconds: 0,
      }),
    ).toBe(60_000)
  })

  it('returns zero parts for negative milliseconds', () => {
    expect(millisecondsToDurationParts(-100)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    })
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
})

describe('formatFraction', () => {
  it('trims trailing zeros', () => {
    expect(formatFraction(1.5, 2)).toBe('1.5')
    expect(formatFraction(1.25, 3)).toBe('1.25')
  })

  it('returns empty string for non-finite input', () => {
    expect(formatFraction(Number.NaN, 2)).toBe('')
  })
})
