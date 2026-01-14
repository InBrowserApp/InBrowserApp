import { describe, it, expect } from 'vitest'
import { analyzePassword, formatDuration, scoreFromEntropy } from './utils'

describe('scoreFromEntropy', () => {
  it('maps entropy ranges to scores', () => {
    expect(scoreFromEntropy(0)).toBe(0)
    expect(scoreFromEntropy(27.9)).toBe(0)
    expect(scoreFromEntropy(28)).toBe(1)
    expect(scoreFromEntropy(35)).toBe(1)
    expect(scoreFromEntropy(36)).toBe(2)
    expect(scoreFromEntropy(59)).toBe(2)
    expect(scoreFromEntropy(60)).toBe(3)
    expect(scoreFromEntropy(89)).toBe(3)
    expect(scoreFromEntropy(90)).toBe(4)
  })
})

describe('formatDuration', () => {
  it('handles non-finite and under-second durations', () => {
    const infinite = formatDuration(Number.POSITIVE_INFINITY)
    expect(infinite.unit).toBe('years')
    expect(infinite.isUnderSecond).toBe(false)

    const zero = formatDuration(0)
    expect(zero.isUnderSecond).toBe(true)
    expect(zero.unit).toBe('seconds')

    const under = formatDuration(0.5)
    expect(under.isUnderSecond).toBe(true)
    expect(under.unit).toBe('seconds')
  })

  it('rounds values based on magnitude', () => {
    const seconds = formatDuration(5)
    expect(seconds.unit).toBe('seconds')
    expect(seconds.value).toBe(5)

    const minutes = formatDuration(60 * 12)
    expect(minutes.unit).toBe('minutes')
    expect(minutes.value).toBe(12)

    const years = formatDuration(31557600 * 120)
    expect(years.unit).toBe('years')
    expect(years.value).toBe(120)
  })
})

describe('analyzePassword', () => {
  it('returns null for empty input', () => {
    expect(analyzePassword('')).toBeNull()
  })

  it('flags common, short, and sequential passwords', () => {
    const result = analyzePassword('123456')
    expect(result).not.toBeNull()
    expect(result!.warnings).toEqual(
      expect.arrayContaining(['common', 'short', 'singleClass', 'sequence']),
    )
    expect(result!.suggestions).toEqual(
      expect.arrayContaining(['avoid-common', 'use-longer', 'avoid-sequences']),
    )
  })

  it('adds length suggestions without short warnings for medium length', () => {
    const result = analyzePassword('Password!')
    expect(result).not.toBeNull()
    expect(result!.warnings).not.toContain('short')
    expect(result!.suggestions).toContain('use-longer')
    expect(result!.suggestions).toContain('add-numbers')
  })

  it('detects repeated patterns and avoids false sequences', () => {
    const result = analyzePassword('a1a1a1')
    expect(result).not.toBeNull()
    expect(result!.warnings).toContain('repeat')
    expect(result!.warnings).not.toContain('sequence')
    expect(result!.suggestions).toContain('avoid-repetition')
  })

  it('detects sequential letters', () => {
    const result = analyzePassword('abcd')
    expect(result).not.toBeNull()
    expect(result!.warnings).toContain('sequence')
  })

  it('detects repeating characters', () => {
    const result = analyzePassword('aaabbb')
    expect(result).not.toBeNull()
    expect(result!.warnings).toContain('repeat')
  })

  it('returns a strong score for varied long passwords', () => {
    const result = analyzePassword('Str0ng!Passw0rd-Example')
    expect(result).not.toBeNull()
    expect(result!.score).toBe(4)
    expect(result!.composition.symbol).toBeGreaterThan(0)
  })

  it('handles very long passwords with huge crack times', () => {
    const result = analyzePassword(`${'A'.repeat(400)}a1!`)
    expect(result).not.toBeNull()
    expect(result!.log10Guesses).toBeGreaterThan(318)
    expect(result!.crackTimes.offlineFast.unit).toBe('years')
  })
})
