import type { DateTimeParts } from './timeZone'

export const qrOptions = {
  errorCorrectionLevel: 'M' as const,
  width: 240,
  margin: 2,
  dark: '#000000FF',
  light: '#FFFFFFFF',
}

export function toLocalParts(timestamp: number): DateTimeParts {
  const date = new Date(timestamp)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
  }
}

export function toDateParts(parts: DateTimeParts): DateTimeParts {
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  }
}

export function startOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function addLocalDays(timestamp: number, days: number): number {
  const date = new Date(timestamp)
  date.setDate(date.getDate() + days)
  return date.getTime()
}

export function generateUid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${crypto.randomUUID()}@inbrowser.app`
  }
  const random = Math.random().toString(36).slice(2)
  return `${random}-${Date.now()}@inbrowser.app`
}
