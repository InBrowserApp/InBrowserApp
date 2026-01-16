import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  CUID2_DEFAULT_LENGTH,
  CUID2_MAX_COUNT,
  CUID2_MAX_LENGTH,
  CUID2_MIN_LENGTH,
  createCuid2Generator,
  isValidCuid2,
  normalizeCuid2Count,
  normalizeCuid2Length,
} from './cuid2'

describe('cuid2 utils', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint32Array) => {
        buffer.fill(123456789)
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('normalizes length values', () => {
    expect(normalizeCuid2Length(Number.NaN)).toBe(CUID2_DEFAULT_LENGTH)
    expect(normalizeCuid2Length(CUID2_MIN_LENGTH - 1)).toBe(CUID2_MIN_LENGTH)
    expect(normalizeCuid2Length(CUID2_MAX_LENGTH + 5)).toBe(CUID2_MAX_LENGTH)
  })

  it('normalizes count values', () => {
    expect(normalizeCuid2Count(Number.NaN)).toBe(1)
    expect(normalizeCuid2Count(0)).toBe(1)
    expect(normalizeCuid2Count(CUID2_MAX_COUNT + 5)).toBe(CUID2_MAX_COUNT)
  })

  it('creates valid CUID2 values', () => {
    const generator = createCuid2Generator(12)
    const id = generator()

    expect(id).toHaveLength(12)
    expect(isValidCuid2(id)).toBe(true)
  })

  it('rejects invalid CUID2 values', () => {
    expect(isValidCuid2('123')).toBe(false)
  })
})
