import { describe, expect, test } from "vitest"

import {
  analyzeRegex,
  buildPreview,
  collectMatches,
  compileRegex,
  formatMatchesForExport,
  normalizeFlags,
  replaceMatches,
} from "./regex-tester-replacer"

describe("normalizeFlags", () => {
  test("deduplicates and orders supported flags", () => {
    expect(normalizeFlags(["y", "g", "x", "g", "i"])).toBe("giy")
    expect(normalizeFlags("migzg")).toBe("gim")
  })
})

describe("compileRegex", () => {
  test("returns a compiled regex for a valid pattern", () => {
    const result = compileRegex("#(\\d+)", ["g", "i"])

    expect(result.error).toBeNull()
    expect(result.normalizedFlags).toBe("gi")
    expect(result.regex?.source).toBe("#(\\d+)")
  })

  test("returns an error for an invalid pattern", () => {
    const result = compileRegex("(", ["g"])

    expect(result.regex).toBeNull()
    expect(result.error).toBeTruthy()
  })

  test("stringifies non-Error throws from the RegExp constructor", () => {
    const originalRegExp = globalThis.RegExp
    const fakeRegExp = function () {
      throw "boom"
    } as unknown as RegExpConstructor

    Object.defineProperty(globalThis, "RegExp", {
      configurable: true,
      value: fakeRegExp,
    })

    try {
      expect(compileRegex("abc", ["g"])).toEqual({
        error: "boom",
        normalizedFlags: "g",
        regex: null,
      })
    } finally {
      Object.defineProperty(globalThis, "RegExp", {
        configurable: true,
        value: originalRegExp,
      })
    }
  })

  test("returns no regex and no error for a blank pattern", () => {
    const result = compileRegex("   ", ["g"])

    expect(result.regex).toBeNull()
    expect(result.error).toBeNull()
  })
})

describe("collectMatches", () => {
  test("collects only the first match when the regex is not global", () => {
    const result = collectMatches("Order #123 and #456", /#(\d+)/, 10)

    expect(result.truncated).toBe(false)
    expect(result.matches).toEqual([
      {
        index: 6,
        end: 10,
        match: "#123",
        groups: ["123"],
        namedGroups: {},
      },
    ])
  })

  test("returns an empty collection when a non-global regex finds nothing", () => {
    const result = collectMatches("Order #123", /XYZ/, 10)

    expect(result).toEqual({
      matches: [],
      truncated: false,
    })
  })

  test("limits global matches and advances zero-length matches", () => {
    const result = collectMatches("ABC", /(?=.)/g, 2)

    expect(result.truncated).toBe(true)
    expect(result.matches).toEqual([
      {
        index: 0,
        end: 0,
        match: "",
        groups: [],
        namedGroups: {},
      },
      {
        index: 1,
        end: 1,
        match: "",
        groups: [],
        namedGroups: {},
      },
    ])
  })

  test("falls back when exec returns a sparse array-like match", () => {
    const regex = {
      exec: () => [] as unknown as RegExpExecArray,
      global: false,
      lastIndex: 0,
    } as unknown as RegExp

    expect(collectMatches("ABC", regex, 10)).toEqual({
      matches: [
        {
          end: 0,
          groups: [],
          index: 0,
          match: "",
          namedGroups: {},
        },
      ],
      truncated: false,
    })
  })
})

describe("buildPreview", () => {
  test("builds highlighted segments and truncates long previews", () => {
    const preview = buildPreview(
      "Order #123 and #456",
      [
        {
          index: 6,
          end: 10,
          match: "#123",
          groups: ["123"],
          namedGroups: {},
        },
        {
          index: 15,
          end: 19,
          match: "#456",
          groups: ["456"],
          namedGroups: {},
        },
      ],
      16
    )

    expect(preview.previewText).toBe("Order #123 and #")
    expect(preview.truncated).toBe(true)
    expect(preview.segments).toEqual([
      { text: "Order ", isMatch: false, matchIndex: null },
      { text: "#123", isMatch: true, matchIndex: 0 },
      { text: " and ", isMatch: false, matchIndex: null },
      { text: "#", isMatch: true, matchIndex: 1 },
    ])
  })

  test("skips zero-length and out-of-range matches", () => {
    const preview = buildPreview(
      "ABC",
      [
        {
          index: 0,
          end: 0,
          match: "",
          groups: [],
          namedGroups: {},
        },
        {
          index: 5,
          end: 6,
          match: "Z",
          groups: [],
          namedGroups: {},
        },
      ],
      3
    )

    expect(preview.segments).toEqual([
      { text: "ABC", isMatch: false, matchIndex: null },
    ])
  })

  test("does not add a leading plain segment when the first match starts at zero", () => {
    const preview = buildPreview(
      "ABC",
      [
        {
          index: 0,
          end: 2,
          match: "AB",
          groups: [],
          namedGroups: {},
        },
      ],
      3
    )

    expect(preview.segments).toEqual([
      { text: "AB", isMatch: true, matchIndex: 0 },
      { text: "C", isMatch: false, matchIndex: null },
    ])
  })

  test("skips match segments that would move backward", () => {
    const preview = buildPreview(
      "abcdef",
      [
        {
          index: 1,
          end: 4,
          match: "bcd",
          groups: [],
          namedGroups: {},
        },
        {
          index: 2,
          end: 3,
          match: "c",
          groups: [],
          namedGroups: {},
        },
      ],
      6
    )

    expect(preview.segments).toEqual([
      { text: "a", isMatch: false, matchIndex: null },
      { text: "bcd", isMatch: true, matchIndex: 0 },
      { text: "ef", isMatch: false, matchIndex: null },
    ])
  })
})

describe("replaceMatches", () => {
  test("uses JavaScript replacement semantics", () => {
    expect(
      replaceMatches("Order #123-ABC", /#(\d+)-([A-Z]+)/g, "ID:$1 Code:$2")
    ).toBe("Order ID:123 Code:ABC")
  })
})

describe("formatMatchesForExport", () => {
  test("serializes matches as a tab-separated report", () => {
    expect(
      formatMatchesForExport([
        {
          index: 6,
          end: 10,
          match: "#123",
          groups: ["123"],
          namedGroups: { order: "123" },
        },
      ])
    ).toBe(
      'match\tstart\tend\ttext\tgroups\tnamedGroups\n1\t6\t10\t"#123"\t["123"]\t{"order":"123"}'
    )
    expect(formatMatchesForExport([])).toBe("")
  })
})

describe("analyzeRegex", () => {
  test("returns counts, preview, and replacement output for valid input", () => {
    const result = analyzeRegex(
      "Order #123-ABC\nOrder #456-DEF",
      "#(\\d+)-(?<code>[A-Z]+)",
      ["g"],
      "ID:$1 / $<code>",
      { matchLimit: 10, previewLimit: 50 }
    )

    expect(result.error).toBeNull()
    expect(result.normalizedFlags).toBe("g")
    expect(result.summary).toEqual({
      matchCount: 2,
      groupCount: 4,
      zeroLengthCount: 0,
    })
    expect(result.matchesTruncated).toBe(false)
    expect(result.preview.segments.some((segment) => segment.isMatch)).toBe(
      true
    )
    expect(result.replacementOutput).toBe(
      "Order ID:123 / ABC\nOrder ID:456 / DEF"
    )
  })

  test("surfaces invalid patterns and blank text states", () => {
    expect(analyzeRegex("", "#(\\d+)", ["g"], "ID:$1")).toEqual({
      error: null,
      matches: [],
      matchesTruncated: false,
      normalizedFlags: "g",
      preview: {
        previewText: "",
        segments: [],
        truncated: false,
      },
      replacementOutput: "",
      summary: {
        matchCount: 0,
        groupCount: 0,
        zeroLengthCount: 0,
      },
    })

    expect(analyzeRegex("abc", "(", ["g"], "x").error).toBeTruthy()
  })

  test("tracks truncated zero-length matches", () => {
    const result = analyzeRegex("ABC", "(?=.)", ["g"], "-", {
      matchLimit: 2,
      previewLimit: 10,
    })

    expect(result.matchesTruncated).toBe(true)
    expect(result.summary.zeroLengthCount).toBe(2)
    expect(result.matches).toHaveLength(2)
  })
})
