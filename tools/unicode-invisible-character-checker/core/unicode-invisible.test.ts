import { describe, expect, test } from "vitest"

import {
  INVISIBLE_CATEGORIES,
  scanInvisibleCharacters,
} from "./unicode-invisible"

describe("scanInvisibleCharacters", () => {
  test("returns empty results for plain text", () => {
    expect(scanInvisibleCharacters("Plain text")).toEqual({
      matches: [],
      cleanedText: "Plain text",
      annotatedText: "Plain text",
      counts: {
        "zero-width": 0,
        "bidi-control": 0,
        "space-like": 0,
        format: 0,
      },
    })
  })

  test("detects invisible characters and reports code points", () => {
    const result = scanInvisibleCharacters("Hello\u200BWorld\u202E")

    expect(result.matches).toEqual([
      {
        index: 6,
        line: 1,
        column: 6,
        code: "U+200B",
        name: "ZERO WIDTH SPACE",
        category: "zero-width",
        token: "[[ZWSP]]",
      },
      {
        index: 12,
        line: 1,
        column: 12,
        code: "U+202E",
        name: "RIGHT-TO-LEFT OVERRIDE",
        category: "bidi-control",
        token: "[[RLO]]",
      },
    ])
    expect(result.cleanedText).toBe("HelloWorld")
    expect(result.annotatedText).toBe("Hello[[ZWSP]]World[[RLO]]")
    expect(result.counts).toEqual({
      "zero-width": 1,
      "bidi-control": 1,
      "space-like": 0,
      format: 0,
    })
  })

  test("tracks line and column positions across CRLF input", () => {
    const result = scanInvisibleCharacters(`A\u200B\r\nB\u202E`)

    expect(result.matches).toEqual([
      expect.objectContaining({
        line: 1,
        column: 2,
      }),
      expect.objectContaining({
        line: 2,
        column: 2,
      }),
    ])
    expect(result.cleanedText).toBe("A\r\nB")
    expect(result.annotatedText).toBe("A[[ZWSP]]\r\nB[[RLO]]")
  })

  test("respects disabled categories", () => {
    const result = scanInvisibleCharacters(
      "Price:\u00A0123\u202FUSD",
      new Set(["zero-width"])
    )

    expect(result.matches).toEqual([])
    expect(result.cleanedText).toBe("Price:\u00A0123\u202FUSD")
    expect(result.counts).toEqual({
      "zero-width": 0,
      "bidi-control": 0,
      "space-like": 0,
      format: 0,
    })
  })

  test("uses every category by default", () => {
    const result = scanInvisibleCharacters("A\u200BB\u00A0C\u00ADD\u202EE")

    expect(INVISIBLE_CATEGORIES).toEqual([
      "zero-width",
      "bidi-control",
      "space-like",
      "format",
    ])
    expect(result.counts).toEqual({
      "zero-width": 1,
      "bidi-control": 1,
      "space-like": 1,
      format: 1,
    })
  })
})
