import { getConstants, init, isCuid } from "@paralleldrive/cuid2"

const { defaultLength, bigLength } = getConstants()

const CUID2_DEFAULT_LENGTH = defaultLength
const CUID2_MAX_LENGTH = bigLength
const CUID2_MIN_LENGTH = 2
const CUID2_MAX_COUNT = 100
const CUID2_MIN_COUNT = 1

type Cuid2Generator = () => string

function normalizeCuid2Length(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return CUID2_DEFAULT_LENGTH
  }

  return Math.min(
    Math.max(Math.floor(value), CUID2_MIN_LENGTH),
    CUID2_MAX_LENGTH
  )
}

function normalizeCuid2Count(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return CUID2_MIN_COUNT
  }

  return Math.min(Math.max(Math.floor(value), CUID2_MIN_COUNT), CUID2_MAX_COUNT)
}

function createCuid2Generator(length: number): Cuid2Generator {
  return init({ length: normalizeCuid2Length(length) })
}

function generateCuid2Ids(count: number, length: number): string[] {
  const generator = createCuid2Generator(length)
  const normalizedCount = normalizeCuid2Count(count)

  return Array.from({ length: normalizedCount }, () => generator())
}

function isValidCuid2(value: string): boolean {
  return isCuid(value, {
    minLength: CUID2_MIN_LENGTH,
    maxLength: CUID2_MAX_LENGTH,
  })
}

export {
  CUID2_DEFAULT_LENGTH,
  CUID2_MAX_COUNT,
  CUID2_MAX_LENGTH,
  CUID2_MIN_LENGTH,
  createCuid2Generator,
  generateCuid2Ids,
  isValidCuid2,
  normalizeCuid2Count,
  normalizeCuid2Length,
}

export type { Cuid2Generator }
