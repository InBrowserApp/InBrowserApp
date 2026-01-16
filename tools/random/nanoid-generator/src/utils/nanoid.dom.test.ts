import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { generateNanoid, getAlphabetMetrics } from './nanoid'

describe('nanoid utils', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint8Array) => {
        for (let i = 0; i < buffer.length; i += 1) {
          buffer[i] = i
        }
        return buffer
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports alphabet metrics', () => {
    const metrics = getAlphabetMetrics('aabc😀😀')

    expect(metrics.uniqueCount).toBe(4)
    expect(metrics.duplicates).toHaveLength(2)
    expect(metrics.duplicates).toEqual(expect.arrayContaining(['a', '😀']))
  })

  it('throws for invalid sizes', () => {
    expect(() => generateNanoid('abc', 0)).toThrow(RangeError)
    expect(() => generateNanoid('abc', Number.NaN)).toThrow(RangeError)
  })

  it('throws for duplicate alphabet characters', () => {
    expect(() => generateNanoid('aabc', 4)).toThrow(RangeError)
  })

  it('throws for too-short alphabets', () => {
    expect(() => generateNanoid('a', 4)).toThrow(RangeError)
  })

  it('generates IDs from the provided alphabet', () => {
    const id = generateNanoid('abc', 10)

    expect(id).toHaveLength(10)
    expect(id).toMatch(/^[abc]+$/)
  })
})
