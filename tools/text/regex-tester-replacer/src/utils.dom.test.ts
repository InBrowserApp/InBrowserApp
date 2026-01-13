import { describe, expect, it } from 'vitest'
import {
  buildHighlightSegments,
  collectMatches,
  compileRegex,
  normalizeFlags,
  replaceText,
} from './utils'

describe('normalizeFlags', () => {
  it('returns ordered, unique flags', () => {
    expect(normalizeFlags(['i', 'g', 'g', 'z'])).toBe('gi')
  })
})

describe('compileRegex', () => {
  it('returns a regex for valid patterns', () => {
    const { regex, error } = compileRegex('\\d+', 'gi')
    expect(error).toBeNull()
    expect(regex).toBeInstanceOf(RegExp)
    expect(regex?.flags).toContain('g')
    expect(regex?.flags).toContain('i')
  })

  it('returns an error for invalid patterns', () => {
    const { regex, error } = compileRegex('(', 'g')
    expect(regex).toBeNull()
    expect(error).toBeTruthy()
  })
})

describe('collectMatches', () => {
  it('collects a single match when not global', () => {
    const regex = new RegExp('#(\\d+)', '')
    const { matches, truncated } = collectMatches('Order #1 #2', regex, 10)
    expect(matches).toHaveLength(1)
    expect(truncated).toBe(false)
    expect(matches[0]?.groups).toEqual(['1'])
  })

  it('collects matches with truncation', () => {
    const regex = new RegExp('#(\\d+)', 'g')
    const { matches, truncated } = collectMatches('Order #1 #2 #3', regex, 2)
    expect(matches).toHaveLength(2)
    expect(truncated).toBe(true)
  })

  it('handles zero-length matches safely', () => {
    const regex = new RegExp('(?=\\d)', 'g')
    const { matches } = collectMatches('1', regex, 10)
    expect(matches).toHaveLength(1)
    expect(matches[0]?.match).toBe('')
    expect(matches[0]?.index).toBe(0)
  })
})

describe('replaceText', () => {
  it('applies replacements using capture groups', () => {
    const regex = new RegExp('#(\\d+)-(\\w+)', 'g')
    const result = replaceText('Order #12-ABC', regex, 'ID:$1 Code:$2')
    expect(result).toBe('Order ID:12 Code:ABC')
  })
})

describe('buildHighlightSegments', () => {
  it('builds segments that reconstruct the preview text', () => {
    const matches = [
      { index: 0, end: 5, match: 'Hello', groups: [], namedGroups: {} },
      { index: 6, end: 11, match: 'world', groups: [], namedGroups: {} },
    ]
    const { previewText, segments } = buildHighlightSegments('Hello world', matches, 50)
    expect(previewText).toBe('Hello world')
    expect(segments.map((segment) => segment.text).join('')).toBe(previewText)
    expect(segments.some((segment) => segment.isMatch)).toBe(true)
  })

  it('marks truncated previews', () => {
    const matches = [{ index: 0, end: 4, match: 'Test', groups: [], namedGroups: {} }]
    const result = buildHighlightSegments('Test message', matches, 4)
    expect(result.previewText).toBe('Test')
    expect(result.truncated).toBe(true)
  })
})
