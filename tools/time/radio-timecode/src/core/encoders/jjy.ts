import { getTimeParts } from '../time'
import { evenParity, setWeightedBits } from './utils'
import type { SecondSignal } from './types'

const JJY_MARKERS = new Set([0, 9, 19, 29, 39, 49, 59])

function buildJJYBits(date: Date) {
  const parts = getTimeParts(date, 'Asia/Tokyo')
  const bits: Array<0 | 1 | 'M'> = Array.from({ length: 60 }, () => 0)
  for (const marker of JJY_MARKERS) bits[marker] = 'M'

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

  const hourBits = [12, 13, 15, 16, 17, 18]
  const minuteBits = [1, 2, 3, 5, 6, 7, 8]
  bits[36] = evenParity(hourBits.map((pos) => (bits[pos] === 1 ? 1 : 0)))
  bits[37] = evenParity(minuteBits.map((pos) => (bits[pos] === 1 ? 1 : 0)))

  bits[38] = 0
  bits[40] = 0

  setWeightedBits(
    bits,
    [
      { pos: 41, weight: 80 },
      { pos: 42, weight: 40 },
      { pos: 43, weight: 20 },
      { pos: 44, weight: 10 },
      { pos: 45, weight: 8 },
      { pos: 46, weight: 4 },
      { pos: 47, weight: 2 },
      { pos: 48, weight: 1 },
    ],
    parts.year % 100,
  )

  setWeightedBits(
    bits,
    [
      { pos: 50, weight: 4 },
      { pos: 51, weight: 2 },
      { pos: 52, weight: 1 },
    ],
    parts.weekday,
  )

  bits[53] = 0
  bits[54] = 0
  bits[55] = 0
  bits[56] = 0
  bits[57] = 0
  bits[58] = 0

  return { bits, parts }
}

export function jjySignalForSecond(date: Date): SecondSignal {
  const { bits, parts } = buildJJYBits(date)
  const second = parts.second
  const value = bits[second]
  if (value === 'M') {
    return { windows: [{ start: 0.2, end: 1 }], symbol: 'M' }
  }
  if (value === 1) {
    return { windows: [{ start: 0.5, end: 1 }], symbol: '1' }
  }
  return { windows: [{ start: 0.8, end: 1 }], symbol: '0' }
}
