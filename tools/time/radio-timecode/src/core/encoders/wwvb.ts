import { getDstStatusForUtcDay, getTimeParts, isLeapYear } from '../time'
import { setWeightedBits } from './utils'
import type { SecondSignal } from './types'

const WWVB_MARKERS = new Set([0, 9, 19, 29, 39, 49, 59])

function buildWWVBBits(date: Date) {
  const parts = getTimeParts(date, 'UTC')
  const bits: Array<0 | 1 | 'M'> = Array.from({ length: 60 }, () => 0)
  for (const marker of WWVB_MARKERS) bits[marker] = 'M'

  setWeightedBits(
    bits,
    [
      { pos: 1, weight: 40 },
      { pos: 2, weight: 20 },
      { pos: 3, weight: 10 },
      { pos: 5, weight: 8 },
      { pos: 6, weight: 4 },
      { pos: 7, weight: 2 },
      { pos: 8, weight: 1 },
    ],
    parts.minute,
  )

  setWeightedBits(
    bits,
    [
      { pos: 12, weight: 20 },
      { pos: 13, weight: 10 },
      { pos: 15, weight: 8 },
      { pos: 16, weight: 4 },
      { pos: 17, weight: 2 },
      { pos: 18, weight: 1 },
    ],
    parts.hour,
  )

  setWeightedBits(
    bits,
    [
      { pos: 22, weight: 200 },
      { pos: 23, weight: 100 },
      { pos: 25, weight: 80 },
      { pos: 26, weight: 40 },
      { pos: 27, weight: 20 },
      { pos: 28, weight: 10 },
      { pos: 30, weight: 8 },
      { pos: 31, weight: 4 },
      { pos: 32, weight: 2 },
      { pos: 33, weight: 1 },
    ],
    parts.dayOfYear,
  )

  setWeightedBits(
    bits,
    [
      { pos: 45, weight: 80 },
      { pos: 46, weight: 40 },
      { pos: 47, weight: 20 },
      { pos: 48, weight: 10 },
      { pos: 50, weight: 8 },
      { pos: 51, weight: 4 },
      { pos: 52, weight: 2 },
      { pos: 53, weight: 1 },
    ],
    parts.year % 100,
  )

  bits[55] = isLeapYear(parts.year) ? 1 : 0
  bits[56] = 0

  const dstStatus = getDstStatusForUtcDay(date, 'America/Denver')
  bits[57] = dstStatus.end ? 1 : 0
  bits[58] = dstStatus.start ? 1 : 0

  return { bits, parts }
}

export function wwvbSignalForSecond(date: Date): SecondSignal {
  const { bits, parts } = buildWWVBBits(date)
  const second = parts.second
  const value = bits[second]
  if (value === 'M') {
    return { windows: [{ start: 0, end: 0.8 }], symbol: 'M' }
  }
  if (value === 1) {
    return { windows: [{ start: 0, end: 0.5 }], symbol: '1' }
  }
  return { windows: [{ start: 0, end: 0.2 }], symbol: '0' }
}
