import { describe, expect, test } from "vitest"

import { calculateTextStats, formatTime } from "./text-stats"

describe("calculateTextStats", () => {
  test("returns zeroed stats for an empty string", () => {
    expect(calculateTextStats("")).toEqual({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      sentences: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    })
  })

  test("counts words, lines, paragraphs, and punctuated sentences", () => {
    expect(
      calculateTextStats("Hello world!\nThis is a test.\n\nAnother paragraph?")
    ).toEqual({
      characters: 48,
      charactersNoSpaces: 40,
      words: 8,
      lines: 4,
      paragraphs: 2,
      sentences: 3,
      readingTimeMinutes: 0.04,
      speakingTimeMinutes: 0.05333333333333334,
    })
  })

  test("falls back to a single sentence for non-empty text without punctuation", () => {
    expect(calculateTextStats("A sentence without punctuation")).toMatchObject({
      words: 4,
      sentences: 1,
    })
  })

  test("normalizes repeated whitespace when counting words and paragraphs", () => {
    expect(calculateTextStats(" one   two \n\n three ")).toMatchObject({
      characters: 20,
      charactersNoSpaces: 11,
      words: 3,
      lines: 3,
      paragraphs: 2,
      sentences: 1,
    })
  })
})

describe("formatTime", () => {
  test("formats durations under a minute as seconds", () => {
    expect(formatTime(0.5)).toBe("30s")
  })

  test("formats exact minute values without seconds", () => {
    expect(formatTime(1)).toBe("1m")
  })

  test("formats minute values with remaining seconds", () => {
    expect(formatTime(1.5)).toBe("1m 30s")
  })
})
