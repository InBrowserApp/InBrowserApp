import { describe, expect, test } from "vitest"

import {
  DEFAULT_CASE,
  DEFAULT_SEPARATOR,
  SLUG_CASES,
  SLUG_SEPARATORS,
  generateSlug,
  isSlugCase,
  isSlugSeparator,
} from "./slug"

describe("generateSlug", () => {
  test("converts basic text to a slug with defaults", () => {
    expect(generateSlug("Hello World Example")).toBe("hello-world-example")
  })

  test("returns empty string for empty input", () => {
    expect(generateSlug("")).toBe("")
  })

  test("returns empty string for whitespace-only input", () => {
    expect(generateSlug("   ")).toBe("")
  })

  test("strips leading and trailing whitespace before slugifying", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world")
  })

  test("uses hyphen separator by default", () => {
    expect(generateSlug("Hello World")).toBe("hello-world")
  })

  test("uses underscore separator", () => {
    expect(generateSlug("Hello World", "_")).toBe("hello_world")
  })

  test("uses dot separator", () => {
    expect(generateSlug("Hello World", ".")).toBe("hello.world")
  })

  test("lowercases by default", () => {
    expect(generateSlug("Hello WORLD")).toBe("hello-world")
  })

  test("preserves case when requested", () => {
    expect(generateSlug("Hello WORLD", "-", "preserve")).toBe("Hello-WORLD")
  })

  test("transliterates Chinese characters", () => {
    expect(generateSlug("你好世界")).toBe("ni-hao-shi-jie")
  })

  test("transliterates Cyrillic characters", () => {
    expect(generateSlug("Привет мир")).toBe("privet-mir")
  })

  test("transliterates Japanese characters", () => {
    const result = generateSlug("東京タワー")
    expect(result).toMatch(/^[a-z0-9-]+$/)
    expect(result.length).toBeGreaterThan(0)
  })

  test("transliterates Korean characters", () => {
    const result = generateSlug("서울 타워")
    expect(result).toMatch(/^[a-z0-9-]+$/)
    expect(result.length).toBeGreaterThan(0)
  })

  test("removes special characters", () => {
    expect(generateSlug("Product: iPhone 15 Pro!")).toBe(
      "product-iphone-15-pro"
    )
  })

  test("collapses consecutive separators", () => {
    expect(generateSlug("Hello   ---   World")).toBe("hello-world")
  })

  test("handles mixed scripts and separators", () => {
    expect(generateSlug("café & résumé", "_")).toBe("cafe_resume")
  })

  test("preserves case with underscore separator", () => {
    expect(generateSlug("My Blog Post", "_", "preserve")).toBe("My_Blog_Post")
  })
})

describe("isSlugSeparator", () => {
  test("returns true for valid separators", () => {
    expect(isSlugSeparator("-")).toBe(true)
    expect(isSlugSeparator("_")).toBe(true)
    expect(isSlugSeparator(".")).toBe(true)
  })

  test("returns false for invalid separators", () => {
    expect(isSlugSeparator(" ")).toBe(false)
    expect(isSlugSeparator("/")).toBe(false)
    expect(isSlugSeparator("")).toBe(false)
    expect(isSlugSeparator("--")).toBe(false)
  })
})

describe("isSlugCase", () => {
  test("returns true for valid cases", () => {
    expect(isSlugCase("lower")).toBe(true)
    expect(isSlugCase("preserve")).toBe(true)
  })

  test("returns false for invalid cases", () => {
    expect(isSlugCase("upper")).toBe(false)
    expect(isSlugCase("LOWER")).toBe(false)
    expect(isSlugCase("")).toBe(false)
  })
})

describe("constants", () => {
  test("DEFAULT_SEPARATOR is hyphen", () => {
    expect(DEFAULT_SEPARATOR).toBe("-")
  })

  test("DEFAULT_CASE is lower", () => {
    expect(DEFAULT_CASE).toBe("lower")
  })

  test("SLUG_SEPARATORS contains all valid separators", () => {
    expect(SLUG_SEPARATORS).toEqual(["-", "_", "."])
  })

  test("SLUG_CASES contains all valid cases", () => {
    expect(SLUG_CASES).toEqual(["lower", "preserve"])
  })
})
