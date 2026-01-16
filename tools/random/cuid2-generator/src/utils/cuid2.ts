import { getConstants, init, isCuid } from '@paralleldrive/cuid2'

const { defaultLength, bigLength } = getConstants()

export const CUID2_DEFAULT_LENGTH = defaultLength
export const CUID2_MAX_LENGTH = bigLength
export const CUID2_MIN_LENGTH = 2
export const CUID2_MAX_COUNT = 100

export type Cuid2Generator = () => string

export function normalizeCuid2Length(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return CUID2_DEFAULT_LENGTH
  return Math.min(Math.max(Math.floor(value), CUID2_MIN_LENGTH), CUID2_MAX_LENGTH)
}

export function normalizeCuid2Count(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.min(Math.max(Math.floor(value), 1), CUID2_MAX_COUNT)
}

export function createCuid2Generator(length: number): Cuid2Generator {
  return init({ length: normalizeCuid2Length(length) })
}

export function isValidCuid2(value: string): boolean {
  return isCuid(value, { minLength: CUID2_MIN_LENGTH, maxLength: CUID2_MAX_LENGTH })
}
