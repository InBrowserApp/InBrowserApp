import { describe, expect, test, vi } from "vitest"

import { calculateTextStats, formatTime } from "./text-stats"

async function importModuleWithoutSegmenter() {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "Intl")

  try {
    Object.defineProperty(globalThis, "Intl", {
      configurable: true,
      value: {},
    })
    vi.resetModules()

    return await import("./text-stats")
  } finally {
    vi.resetModules()

    if (originalDescriptor) {
      Object.defineProperty(globalThis, "Intl", originalDescriptor)
    }
  }
}

describe("calculateTextStats", () => {
  test("returns zeroed stats for an empty string", () => {
    expect(calculateTextStats("")).toEqual({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      uniqueWords: 0,
      lines: 0,
      paragraphs: 0,
      sentences: 0,
      averageWordLength: 0,
      averageSentenceWords: 0,
      lexicalDiversity: 0,
      longestSentenceWords: 0,
      longestParagraphWords: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      topTerms: [],
    })
  })

  test("builds a richer draft profile instead of just raw counts", () => {
    const stats = calculateTextStats(
      "Write fast. Edit later.\n\nWrite better drafts."
    )

    expect(stats).toMatchObject({
      words: 7,
      uniqueWords: 6,
      lines: 3,
      paragraphs: 2,
      sentences: 3,
      longestSentenceWords: 3,
      longestParagraphWords: 4,
      topTerms: [{ term: "write", count: 2 }],
    })
    expect(stats.averageWordLength).toBeCloseTo(5, 5)
    expect(stats.averageSentenceWords).toBeCloseTo(7 / 3, 5)
    expect(stats.lexicalDiversity).toBeCloseTo(6 / 7, 5)
  })

  test("falls back to a single sentence for non-empty text without punctuation", () => {
    const stats = calculateTextStats("A sentence without punctuation")

    expect(stats).toMatchObject({
      words: 4,
      sentences: 1,
      averageSentenceWords: 4,
      longestSentenceWords: 4,
    })
  })

  test("tracks repeated vocabulary for revision passes", () => {
    expect(
      calculateTextStats("Signal signal noise. Signal keeps showing up.")
    ).toMatchObject({
      words: 7,
      uniqueWords: 5,
      topTerms: [{ term: "signal", count: 3 }],
    })
  })

  test("sorts repeated terms by frequency and then alphabetically", () => {
    expect(
      calculateTextStats(
        "Gamma gamma gamma. Beta beta. Alpha alpha. Delta delta."
      ).topTerms
    ).toEqual([
      { term: "gamma", count: 3 },
      { term: "alpha", count: 2 },
      { term: "beta", count: 2 },
      { term: "delta", count: 2 },
    ])
  })

  test("falls back gracefully when Intl.Segmenter is unavailable", async () => {
    const fallbackModule = await importModuleWithoutSegmenter()
    const stats = fallbackModule.calculateTextStats(
      "Cafe cafe. Numbers 123.\n\nCafe again."
    )

    expect(stats).toMatchObject({
      characters: 36,
      charactersNoSpaces: 30,
      words: 6,
      uniqueWords: 4,
      sentences: 3,
      paragraphs: 2,
      longestSentenceWords: 2,
      longestParagraphWords: 4,
      topTerms: [{ term: "cafe", count: 3 }],
    })
  })

  test("returns empty fallback token lists for symbol-only text", async () => {
    const fallbackModule = await importModuleWithoutSegmenter()
    const stats = fallbackModule.calculateTextStats("!!!")

    expect(stats).toMatchObject({
      words: 0,
      sentences: 0,
      topTerms: [],
    })
  })
})

describe("formatTime", () => {
  test("formats empty durations as zero seconds", () => {
    expect(formatTime(0)).toBe("0s")
  })

  test("formats durations under a minute as seconds", () => {
    expect(formatTime(0.1)).toBe("6s")
  })

  test("formats exact minute values without seconds", () => {
    expect(formatTime(1)).toBe("1m")
  })

  test("formats minute values with remaining seconds", () => {
    expect(formatTime(1.5)).toBe("1m 30s")
  })
})
