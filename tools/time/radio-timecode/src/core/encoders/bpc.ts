import { getTimeParts } from '../time'
import { countBits, getPair, splitToPairs } from './utils'
import type { SecondSignal } from './types'

function buildBpcFrame(date: Date) {
  const parts = getTimeParts(date, 'Asia/Shanghai')
  const hour12 = parts.hour % 12
  const pm = parts.hour >= 12 ? 1 : 0

  const hourPairs = splitToPairs(hour12, 4)
  const minutePairs = splitToPairs(parts.minute, 6)
  const weekday = parts.weekday
  const weekdayPairs = splitToPairs(weekday, 4)
  const dayPairs = splitToPairs(parts.day, 6)
  const monthPairs = splitToPairs(parts.month, 4)
  const yearValue = parts.year % 100
  const yearHigh = (yearValue >> 6) & 1
  const yearPairs = splitToPairs(yearValue & 0x3f, 6)

  const hourPair0 = getPair(hourPairs, 0)
  const hourPair1 = getPair(hourPairs, 1)
  const minutePair0 = getPair(minutePairs, 0)
  const minutePair1 = getPair(minutePairs, 1)
  const minutePair2 = getPair(minutePairs, 2)
  const weekdayPair0 = getPair(weekdayPairs, 0)
  const weekdayPair1 = getPair(weekdayPairs, 1)
  const dayPair0 = getPair(dayPairs, 0)
  const dayPair1 = getPair(dayPairs, 1)
  const dayPair2 = getPair(dayPairs, 2)
  const monthPair0 = getPair(monthPairs, 0)
  const monthPair1 = getPair(monthPairs, 1)
  const yearPair0 = getPair(yearPairs, 0)
  const yearPair1 = getPair(yearPairs, 1)
  const yearPair2 = getPair(yearPairs, 2)

  const frame = {
    hourPairs,
    minutePairs,
    weekdayPairs,
    dayPairs,
    monthPairs,
    yearPairs,
    yearHigh,
    pm,
  }

  const valuesForParity1 = [
    Math.floor(parts.second / 20),
    0,
    hourPair0,
    hourPair1,
    minutePair0,
    minutePair1,
    minutePair2,
    weekdayPair0,
    weekdayPair1,
  ]
  const parity1Ones = valuesForParity1.reduce<number>((sum, value) => sum + countBits(value), 0)
  const parity1 = (parity1Ones % 2) as 0 | 1
  const p3 = (pm << 1) + parity1

  const valuesForParity2 = [
    dayPair0,
    dayPair1,
    dayPair2,
    monthPair0,
    monthPair1,
    yearPair0,
    yearPair1,
    yearPair2,
  ]
  const parity2Ones = valuesForParity2.reduce<number>((sum, value) => sum + countBits(value), 0)
  const parity2 = (parity2Ones % 2) as 0 | 1
  const p4 = (yearHigh << 1) + parity2

  return { frame, p3, p4, parts }
}

export function bpcSignalForSecond(date: Date): SecondSignal {
  const { frame, p3, p4, parts } = buildBpcFrame(date)
  const frameIndex = Math.floor(parts.second / 20)
  const frameSecond = parts.second % 20
  const values = [
    null,
    frameIndex,
    0,
    getPair(frame.hourPairs, 0),
    getPair(frame.hourPairs, 1),
    getPair(frame.minutePairs, 0),
    getPair(frame.minutePairs, 1),
    getPair(frame.minutePairs, 2),
    getPair(frame.weekdayPairs, 0),
    getPair(frame.weekdayPairs, 1),
    p3,
    getPair(frame.dayPairs, 0),
    getPair(frame.dayPairs, 1),
    getPair(frame.dayPairs, 2),
    getPair(frame.monthPairs, 0),
    getPair(frame.monthPairs, 1),
    getPair(frame.yearPairs, 0),
    getPair(frame.yearPairs, 1),
    getPair(frame.yearPairs, 2),
    p4,
  ]

  const value = values[frameSecond]
  if (value === null || value === undefined) {
    return { windows: [], symbol: 'P0' }
  }

  const duration = 0.1 * (value + 1)
  return {
    windows: [{ start: 0, end: duration }],
    symbol: String(value),
  }
}
