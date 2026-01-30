import { getTimeParts, willOffsetChangeWithinHour } from '../time'
import { evenParity, setWeightedBits } from './utils'
import type { SecondSignal } from './types'

function buildDCF77Bits(date: Date) {
  const target = new Date(date.getTime() + 60_000)
  const parts = getTimeParts(target, 'Europe/Berlin')
  const bits: Array<0 | 1 | 'M'> = Array.from({ length: 60 }, () => 0)

  const dstChange = willOffsetChangeWithinHour(target, 'Europe/Berlin')
  const isDst = parts.isDst

  bits[15] = 0
  bits[16] = dstChange ? 1 : 0
  bits[17] = isDst ? 0 : 1
  bits[18] = isDst ? 1 : 0
  bits[19] = 0
  bits[20] = 1

  setWeightedBits(
    bits,
    [
      { pos: 21, weight: 40 },
      { pos: 22, weight: 20 },
      { pos: 23, weight: 10 },
      { pos: 24, weight: 8 },
      { pos: 25, weight: 4 },
      { pos: 26, weight: 2 },
      { pos: 27, weight: 1 },
    ],
    parts.minute,
  )

  setWeightedBits(
    bits,
    [
      { pos: 29, weight: 20 },
      { pos: 30, weight: 10 },
      { pos: 31, weight: 8 },
      { pos: 32, weight: 4 },
      { pos: 33, weight: 2 },
      { pos: 34, weight: 1 },
    ],
    parts.hour,
  )

  setWeightedBits(
    bits,
    [
      { pos: 36, weight: 20 },
      { pos: 37, weight: 10 },
      { pos: 38, weight: 8 },
      { pos: 39, weight: 4 },
      { pos: 40, weight: 2 },
      { pos: 41, weight: 1 },
    ],
    parts.day,
  )

  setWeightedBits(
    bits,
    [
      { pos: 42, weight: 4 },
      { pos: 43, weight: 2 },
      { pos: 44, weight: 1 },
    ],
    parts.weekday === 0 ? 7 : parts.weekday,
  )

  setWeightedBits(
    bits,
    [
      { pos: 45, weight: 10 },
      { pos: 46, weight: 8 },
      { pos: 47, weight: 4 },
      { pos: 48, weight: 2 },
      { pos: 49, weight: 1 },
    ],
    parts.month,
  )

  setWeightedBits(
    bits,
    [
      { pos: 50, weight: 80 },
      { pos: 51, weight: 40 },
      { pos: 52, weight: 20 },
      { pos: 53, weight: 10 },
      { pos: 54, weight: 8 },
      { pos: 55, weight: 4 },
      { pos: 56, weight: 2 },
      { pos: 57, weight: 1 },
    ],
    parts.year % 100,
  )

  const minuteParity = evenParity(
    [21, 22, 23, 24, 25, 26, 27].map((pos) => (bits[pos] === 1 ? 1 : 0)),
  )
  bits[28] = minuteParity

  const hourParity = evenParity([29, 30, 31, 32, 33, 34].map((pos) => (bits[pos] === 1 ? 1 : 0)))
  bits[35] = hourParity

  const dateParity = evenParity(
    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].map(
      (pos) => (bits[pos] === 1 ? 1 : 0),
    ),
  )
  bits[58] = dateParity

  bits[59] = 'M'

  return { bits, parts }
}

export function dcf77SignalForSecond(date: Date): SecondSignal {
  const { bits, parts } = buildDCF77Bits(date)
  const second = parts.second
  const value = bits[second]
  if (value === 'M') {
    return { windows: [], symbol: 'M' }
  }
  if (value === 1) {
    return { windows: [{ start: 0, end: 0.2 }], symbol: '1' }
  }
  return { windows: [{ start: 0, end: 0.1 }], symbol: '0' }
}
