import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bpcSignalForSecond } from './bpc'
import { dcf77SignalForSecond } from './dcf77'
import { msfSignalForSecond } from './msf'
import { wwvbSignalForSecond } from './wwvb'

const timeMocks = vi.hoisted(() => ({
  getTimeParts: vi.fn(),
  willOffsetChangeWithinHour: vi.fn(),
  isDstAt: vi.fn(),
  getDstStatusForUtcDay: vi.fn(),
  isLeapYear: vi.fn(),
}))

vi.mock('../time', () => ({
  getTimeParts: (...args: unknown[]) => timeMocks.getTimeParts(...args),
  willOffsetChangeWithinHour: (...args: unknown[]) => timeMocks.willOffsetChangeWithinHour(...args),
  isDstAt: (...args: unknown[]) => timeMocks.isDstAt(...args),
  getDstStatusForUtcDay: (...args: unknown[]) => timeMocks.getDstStatusForUtcDay(...args),
  isLeapYear: (...args: unknown[]) => timeMocks.isLeapYear(...args),
}))

const makeParts = (overrides: Partial<ReturnType<typeof defaultParts>> = {}) => ({
  ...defaultParts(),
  ...overrides,
})

function defaultParts() {
  return {
    year: 2024,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    weekday: 1,
    dayOfYear: 1,
    offsetMinutes: 0,
    isDst: false,
  }
}

describe('radio timecode encoder branch coverage', () => {
  beforeEach(() => {
    timeMocks.getTimeParts.mockReset()
    timeMocks.willOffsetChangeWithinHour.mockReset()
    timeMocks.isDstAt.mockReset()
    timeMocks.getDstStatusForUtcDay.mockReset()
    timeMocks.isLeapYear.mockReset()

    timeMocks.willOffsetChangeWithinHour.mockReturnValue(false)
    timeMocks.isDstAt.mockReturnValue(false)
    timeMocks.getDstStatusForUtcDay.mockReturnValue({ start: false, end: false })
    timeMocks.isLeapYear.mockReturnValue(false)
  })

  it('uses PM bit paths in BPC frames', () => {
    timeMocks.getTimeParts.mockReturnValue(
      makeParts({
        hour: 13,
        second: 10,
      }),
    )

    const signal = bpcSignalForSecond(new Date(Date.UTC(2024, 0, 1, 13, 0, 10)))

    expect(['2', '3']).toContain(signal.symbol)
  })

  it('covers DCF77 DST-change and Sunday weekday branches', () => {
    timeMocks.willOffsetChangeWithinHour.mockReturnValue(true)

    timeMocks.getTimeParts.mockReturnValue(
      makeParts({
        second: 16,
        weekday: 0,
        isDst: false,
      }),
    )
    expect(dcf77SignalForSecond(new Date()).symbol).toBe('1')

    timeMocks.getTimeParts.mockReturnValue(
      makeParts({
        second: 18,
        weekday: 0,
        isDst: true,
      }),
    )
    expect(dcf77SignalForSecond(new Date()).symbol).toBe('1')
  })

  it('covers MSF month/dst/parity and secondary window branches', () => {
    timeMocks.willOffsetChangeWithinHour.mockReturnValue(true)
    timeMocks.isDstAt.mockReturnValue(true)

    timeMocks.getTimeParts.mockReturnValue(
      makeParts({
        year: 2001,
        month: 11,
        day: 10,
        hour: 11,
        minute: 11,
        weekday: 3,
        second: 53,
      }),
    )
    expect(msfSignalForSecond(new Date()).windows).toHaveLength(3)

    timeMocks.getTimeParts.mockReturnValue(
      makeParts({
        year: 2001,
        month: 11,
        day: 10,
        hour: 11,
        minute: 11,
        weekday: 3,
        second: 59,
      }),
    )
    const noExtraA = msfSignalForSecond(new Date())
    expect(noExtraA.symbol).toBe('A0B0')
    expect(noExtraA.windows).toEqual([{ start: 0, end: 0.1 }])
  })

  it('covers WWVB leap-year and DST status flags', () => {
    timeMocks.getDstStatusForUtcDay.mockReturnValue({ start: true, end: true })
    timeMocks.isLeapYear.mockReturnValue(true)

    timeMocks.getTimeParts.mockReturnValue(makeParts({ second: 55 }))
    expect(wwvbSignalForSecond(new Date()).symbol).toBe('1')

    timeMocks.getTimeParts.mockReturnValue(makeParts({ second: 57 }))
    expect(wwvbSignalForSecond(new Date()).symbol).toBe('1')

    timeMocks.getTimeParts.mockReturnValue(makeParts({ second: 58 }))
    expect(wwvbSignalForSecond(new Date()).symbol).toBe('1')

    timeMocks.isLeapYear.mockReturnValue(false)
    timeMocks.getTimeParts.mockReturnValue(makeParts({ year: 2023, second: 55 }))
    expect(wwvbSignalForSecond(new Date()).symbol).toBe('0')
  })
})
