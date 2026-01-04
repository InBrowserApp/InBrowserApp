import { describe, it, expect } from 'vitest'
import figlet from 'figlet'
import standard from 'figlet/importable-fonts/Standard.js'
import { fontNames, generateAsciiArt } from './fonts'

// Parse Standard font for testing
figlet.parseFont('Standard', standard)

describe('fontNames', () => {
  it('is an array', () => {
    expect(Array.isArray(fontNames)).toBe(true)
  })

  it('contains standard figlet fonts', () => {
    expect(fontNames).toContain('Standard')
    expect(fontNames).toContain('Banner')
    expect(fontNames).toContain('Big')
    expect(fontNames).toContain('Doom')
    expect(fontNames).toContain('Slant')
    expect(fontNames).toContain('Small')
  })

  it('is sorted alphabetically', () => {
    const sorted = [...fontNames].sort()
    expect(fontNames).toEqual(sorted)
  })

  it('has no empty strings', () => {
    expect(fontNames.every((name) => name.length > 0)).toBe(true)
  })

  it('has many fonts available', () => {
    expect(fontNames.length).toBeGreaterThan(100)
  })
})

describe('generateAsciiArt', () => {
  it('returns empty string for empty input', async () => {
    expect(await generateAsciiArt('', 'Standard')).toBe('')
  })

  it('returns empty string for whitespace-only input', async () => {
    expect(await generateAsciiArt('   ', 'Standard')).toBe('')
    expect(await generateAsciiArt('\n\t', 'Standard')).toBe('')
  })

  it('generates ASCII art for simple text', async () => {
    const result = await generateAsciiArt('Hi', 'Standard')
    expect(result).toContain('_')
    expect(result).toContain('|')
    expect(result.length).toBeGreaterThan(10)
  })

  it('generates multi-line output', async () => {
    const result = await generateAsciiArt('A', 'Standard')
    const lines = result.split('\n')
    expect(lines.length).toBeGreaterThan(1)
  })

  it('generates different output for different text', async () => {
    const result1 = await generateAsciiArt('A', 'Standard')
    const result2 = await generateAsciiArt('B', 'Standard')
    expect(result1).not.toBe(result2)
  })

  it('handles special characters', async () => {
    const result = await generateAsciiArt('!@#', 'Standard')
    expect(result.length).toBeGreaterThan(0)
  })

  it('throws error for non-existent font', async () => {
    await expect(generateAsciiArt('Test', 'NonExistentFont123')).rejects.toThrow('Font not found')
  })
})

describe('figlet library integration', () => {
  it('produces consistent output for same input', async () => {
    const result1 = await generateAsciiArt('Test', 'Standard')
    const result2 = await generateAsciiArt('Test', 'Standard')
    expect(result1).toBe(result2)
  })

  it('Standard font produces recognizable ASCII art', async () => {
    const result = await generateAsciiArt('HI', 'Standard')
    // Standard font has specific patterns
    expect(result).toMatch(/[_|\\\/]/)
  })
})
