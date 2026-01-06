import { describe, expect, it } from 'vitest'
import { calculateTextStats, formatTime } from './textStats'

describe('calculateTextStats', () => {
  it('handles empty string', () => {
    const stats = calculateTextStats('')
    expect(stats.characters).toBe(0)
    expect(stats.charactersNoSpaces).toBe(0)
    expect(stats.words).toBe(0)
    expect(stats.lines).toBe(0)
    expect(stats.paragraphs).toBe(0)
    expect(stats.sentences).toBe(0)
  })

  it('counts characters correctly', () => {
    const stats = calculateTextStats('Hello World')
    expect(stats.characters).toBe(11)
    expect(stats.charactersNoSpaces).toBe(10)
  })

  it('counts words correctly', () => {
    const stats = calculateTextStats('Hello World')
    expect(stats.words).toBe(2)
  })

  it('counts words with multiple spaces correctly', () => {
    const stats = calculateTextStats('Hello   World')
    expect(stats.words).toBe(2)
  })

  it('counts lines correctly', () => {
    const stats = calculateTextStats('Line 1\nLine 2\nLine 3')
    expect(stats.lines).toBe(3)
  })

  it('counts single line correctly', () => {
    const stats = calculateTextStats('Single line')
    expect(stats.lines).toBe(1)
  })

  it('counts paragraphs correctly', () => {
    const stats = calculateTextStats('Para 1\n\nPara 2\n\nPara 3')
    expect(stats.paragraphs).toBe(3)
  })

  it('counts single paragraph correctly', () => {
    const stats = calculateTextStats('Single paragraph with multiple lines\nstill same paragraph')
    expect(stats.paragraphs).toBe(1)
  })

  it('counts sentences correctly', () => {
    const stats = calculateTextStats('Hello. How are you? I am fine!')
    expect(stats.sentences).toBe(3)
  })

  it('counts single sentence without punctuation', () => {
    const stats = calculateTextStats('Hello World')
    expect(stats.sentences).toBe(1)
  })

  it('calculates reading time correctly', () => {
    // 200 words at 200 WPM = 1 minute
    const words = Array(200).fill('word').join(' ')
    const stats = calculateTextStats(words)
    expect(stats.readingTimeMinutes).toBe(1)
  })

  it('calculates speaking time correctly', () => {
    // 150 words at 150 WPM = 1 minute
    const words = Array(150).fill('word').join(' ')
    const stats = calculateTextStats(words)
    expect(stats.speakingTimeMinutes).toBe(1)
  })

  it('handles Windows line endings', () => {
    const stats = calculateTextStats('Line 1\r\nLine 2\r\nLine 3')
    expect(stats.lines).toBe(3)
  })

  it('handles old Mac line endings', () => {
    const stats = calculateTextStats('Line 1\rLine 2\rLine 3')
    expect(stats.lines).toBe(3)
  })
})

describe('formatTime', () => {
  it('formats zero correctly', () => {
    expect(formatTime(0)).toBe('0s')
  })

  it('formats seconds correctly', () => {
    expect(formatTime(0.5)).toBe('30s')
  })

  it('formats one minute correctly', () => {
    expect(formatTime(1)).toBe('1m')
  })

  it('formats minutes correctly', () => {
    expect(formatTime(2)).toBe('2m')
  })

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(2.5)).toBe('2m 30s')
  })

  it('formats large time correctly', () => {
    expect(formatTime(65)).toBe('65m')
  })
})
