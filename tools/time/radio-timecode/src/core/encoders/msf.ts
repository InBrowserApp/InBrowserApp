import { getTimeParts, isDstAt, willOffsetChangeWithinHour } from '../time'
import type { SecondSignal, Window } from './types'

const MSF_MARKER_SEQUENCE = [0, 1, 1, 1, 1, 1, 1, 0]

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

export function msfSignalForSecond(date: Date): SecondSignal {
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
