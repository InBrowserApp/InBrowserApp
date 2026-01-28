/* eslint-disable max-lines */
import {
  getDstStatusForUtcDay,
  getTimeParts,
  isDstAt,
  isLeapYear,
  willOffsetChangeWithinHour,
} from './time'

export type Window = { start: number; end: number }

export type SecondSignal = {
  windows: Window[]
  symbol: string
}

export type StationId = 'jjy-40' | 'jjy-60' | 'bpc' | 'dcf77' | 'msf' | 'wwvb'

const JJY_MARKERS = new Set([0, 9, 19, 29, 39, 49, 59])
const WWVB_MARKERS = new Set([0, 9, 19, 29, 39, 49, 59])

const MSF_MARKER_SEQUENCE = [0, 1, 1, 1, 1, 1, 1, 0]

function countBits(value: number) {
  return (value & 1) + ((value >> 1) & 1) + ((value >> 2) & 1) + ((value >> 3) & 1)
}

function evenParity(bits: Array<0 | 1>) {
  const ones = bits.reduce<number>((sum, bit) => sum + (bit === 1 ? 1 : 0), 0)
  return (ones % 2) as 0 | 1
}

function setWeightedBits(
  bits: Array<0 | 1 | 'M'>,
  mapping: Array<{ pos: number; weight: number }>,
  value: number,
) {
  let remaining = value
  for (const { pos, weight } of mapping) {
    if (remaining >= weight) {
      bits[pos] = 1
      remaining -= weight
    } else {
      bits[pos] = 0
    }
  }
}

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

function jjySignalForSecond(date: Date): SecondSignal {
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

function dcf77SignalForSecond(date: Date): SecondSignal {
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

function wwvbSignalForSecond(date: Date): SecondSignal {
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

function splitToPairs(value: number, totalBits: number) {
  const pairs: number[] = []
  for (let i = totalBits - 2; i >= 0; i -= 2) {
    pairs.push((value >> i) & 0b11)
  }
  return pairs
}

function getPair(pairs: number[], index: number) {
  return pairs[index] ?? 0
}

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

function bpcSignalForSecond(date: Date): SecondSignal {
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

function buildMSFBits(date: Date) {
  const target = new Date(date.getTime() + 60_000)
  const parts = getTimeParts(target, 'Europe/London')

  const year = parts.year % 100
  const yearTens = Math.floor(year / 10)
  const yearOnes = year % 10
  const monthTens = Math.floor(parts.month / 10)
  const monthOnes = parts.month % 10
  const dayTens = Math.floor(parts.day / 10)
  const dayOnes = parts.day % 10
  const hourTens = Math.floor(parts.hour / 10)
  const hourOnes = parts.hour % 10
  const minuteTens = Math.floor(parts.minute / 10)
  const minuteOnes = parts.minute % 10
  const weekday = parts.weekday

  const bitsA: Array<0 | 1> = Array.from({ length: 60 }, () => 0)
  const bitsB: Array<0 | 1> = Array.from({ length: 60 }, () => 0)

  const pushBcd = (start: number, digit: number, length: number) => {
    for (let i = 0; i < length; i += 1) {
      const bit = (digit >> (length - 1 - i)) & 1
      bitsA[start + i] = bit as 0 | 1
    }
  }

  pushBcd(17, yearTens, 4)
  pushBcd(21, yearOnes, 4)
  bitsA[25] = monthTens ? 1 : 0
  pushBcd(26, monthOnes, 4)
  pushBcd(30, dayTens, 2)
  pushBcd(32, dayOnes, 4)
  pushBcd(36, weekday, 3)
  pushBcd(39, hourTens, 2)
  pushBcd(41, hourOnes, 4)
  pushBcd(45, minuteTens, 3)
  pushBcd(48, minuteOnes, 4)

  for (let i = 0; i < MSF_MARKER_SEQUENCE.length; i += 1) {
    bitsA[52 + i] = MSF_MARKER_SEQUENCE[i] as 0 | 1
  }

  const isDst = isDstAt(target, 'Europe/London')
  const dstChange = willOffsetChangeWithinHour(target, 'Europe/London')
  bitsB[53] = dstChange ? 1 : 0
  bitsB[58] = isDst ? 1 : 0

  const parityYearBits = bitsA.slice(17, 25)
  const parityMonthDayBits = bitsA.slice(25, 36)
  const parityWeekBits = bitsA.slice(36, 39)
  const parityTimeBits = bitsA.slice(39, 52)

  bitsB[54] = parityYearBits.reduce<number>((sum, bit) => sum + bit, 0) % 2 === 0 ? 1 : 0
  bitsB[55] = parityMonthDayBits.reduce<number>((sum, bit) => sum + bit, 0) % 2 === 0 ? 1 : 0
  bitsB[56] = parityWeekBits.reduce<number>((sum, bit) => sum + bit, 0) % 2 === 0 ? 1 : 0
  bitsB[57] = parityTimeBits.reduce<number>((sum, bit) => sum + bit, 0) % 2 === 0 ? 1 : 0

  return { bitsA, bitsB, parts }
}

function msfSignalForSecond(date: Date): SecondSignal {
  const { bitsA, bitsB, parts } = buildMSFBits(date)
  const second = parts.second
  if (second === 0) {
    return { windows: [{ start: 0, end: 0.5 }], symbol: 'M' }
  }
  const windows: Window[] = [{ start: 0, end: 0.1 }]
  if (bitsA[second] === 1) windows.push({ start: 0.1, end: 0.2 })
  if (bitsB[second] === 1) windows.push({ start: 0.2, end: 0.3 })

  const symbol = `A${bitsA[second]}B${bitsB[second]}`
  return { windows, symbol }
}

export function getStationSignal(stationId: StationId, date: Date): SecondSignal {
  switch (stationId) {
    case 'jjy-40':
    case 'jjy-60':
      return jjySignalForSecond(date)
    case 'bpc':
      return bpcSignalForSecond(date)
    case 'dcf77':
      return dcf77SignalForSecond(date)
    case 'msf':
      return msfSignalForSecond(date)
    case 'wwvb':
      return wwvbSignalForSecond(date)
    default:
      return { windows: [], symbol: '-' }
  }
}
