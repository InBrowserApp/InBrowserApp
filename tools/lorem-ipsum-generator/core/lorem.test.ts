import { describe, expect, test } from "vitest"

import {
  DEFAULT_LOREM_IPSUM_LOCALE,
  DEFAULT_LOREM_IPSUM_MODE,
  LOREM_IPSUM_LOCALE_OPTIONS,
  LOREM_IPSUM_MAX_COUNT,
  generateLoremIpsum,
  normalizeLoremCount,
  normalizeLoremIpsumMode,
  resolveLoremIpsumLocale,
} from "./lorem"

describe("lorem", () => {
  test("normalizes count into the supported range", () => {
    expect(normalizeLoremCount(undefined)).toBe(1)
    expect(normalizeLoremCount(Number.POSITIVE_INFINITY)).toBe(1)
    expect(normalizeLoremCount(0)).toBe(1)
    expect(normalizeLoremCount(3.8)).toBe(3)
    expect(normalizeLoremCount(LOREM_IPSUM_MAX_COUNT + 50)).toBe(
      LOREM_IPSUM_MAX_COUNT
    )
  })

  test("normalizes mode and locale fallbacks", () => {
    expect(normalizeLoremIpsumMode("words")).toBe("words")
    expect(normalizeLoremIpsumMode("invalid")).toBe(DEFAULT_LOREM_IPSUM_MODE)
    expect(resolveLoremIpsumLocale("ja")).toBe("ja")
    expect(resolveLoremIpsumLocale("zh_CN")).toBe(DEFAULT_LOREM_IPSUM_LOCALE)
    expect(resolveLoremIpsumLocale("invalid")).toBe(DEFAULT_LOREM_IPSUM_LOCALE)
  })

  test("exports only lorem-capable locale options with native labels", () => {
    expect(LOREM_IPSUM_LOCALE_OPTIONS).toContainEqual({
      value: "pt_BR",
      label: "Português (Brasil)",
    })
    expect(
      LOREM_IPSUM_LOCALE_OPTIONS.map((option) => option.value)
    ).not.toContain("zh_CN")
  })

  test("generates deterministic words and sentences for a fixed seed", () => {
    const words = generateLoremIpsum({
      mode: "words",
      count: 5,
      locale: "en",
      seed: 42,
    })
    const sameWords = generateLoremIpsum({
      mode: "words",
      count: 5,
      locale: "en",
      seed: 42,
    })
    const sentences = generateLoremIpsum({
      mode: "sentences",
      count: 2,
      locale: "fr",
      seed: 42,
    })

    expect(words).toBe(sameWords)
    expect(words.split(/\s+/u)).toHaveLength(5)
    expect(sentences).toMatch(/[.!?]/u)
  })

  test("generates paragraphs and falls back for invalid inputs", () => {
    const paragraphs = generateLoremIpsum({
      mode: "paragraphs",
      count: 2,
      locale: "ja",
      seed: 7,
    })
    const fallback = generateLoremIpsum({
      mode: "invalid",
      count: 0,
      locale: "invalid",
      seed: 9,
    })

    expect(paragraphs.split("\n\n")).toHaveLength(2)
    expect(fallback.split("\n\n")).toHaveLength(1)
  })
})
