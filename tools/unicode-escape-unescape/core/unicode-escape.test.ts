import { describe, expect, test } from "vitest"

import {
  ESCAPE_FORMATS,
  escapeAllUnicode,
  escapeUnicode,
  unescapeUnicode,
  type EscapeFormat,
} from "./unicode-escape"

// --- escapeUnicode ---

describe("escapeUnicode", () => {
  describe("js format (\\uXXXX)", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "js")).toBe("\\u4F60\\u597D")
      expect(escapeUnicode("café", "js")).toBe("caf\\u00E9")
      expect(escapeUnicode("Hello 世界", "js")).toBe("Hello \\u4E16\\u754C")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "js")).toBe("Hello World")
      expect(escapeUnicode("abc123", "js")).toBe("abc123")
      expect(escapeUnicode("!@#$%^&*()", "js")).toBe("!@#$%^&*()")
    })

    test("escapes control characters", () => {
      expect(escapeUnicode("\n", "js")).toBe("\\u000A")
      expect(escapeUnicode("\t", "js")).toBe("\\u0009")
      expect(escapeUnicode("\r", "js")).toBe("\\u000D")
    })

    test("handles surrogate pairs for supplementary characters", () => {
      expect(escapeUnicode("😀", "js")).toBe("\\uD83D\\uDE00")
      expect(escapeUnicode("𝕳", "js")).toBe("\\uD835\\uDD73")
    })

    test("handles empty string", () => {
      expect(escapeUnicode("", "js")).toBe("")
    })
  })

  describe("es6 format (\\u{XXXXX})", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "es6")).toBe("\\u{4F60}\\u{597D}")
      expect(escapeUnicode("café", "es6")).toBe("caf\\u{00E9}")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "es6")).toBe("Hello World")
    })

    test("handles supplementary characters without surrogate pairs", () => {
      expect(escapeUnicode("😀", "es6")).toBe("\\u{1F600}")
      expect(escapeUnicode("𝕳", "es6")).toBe("\\u{1D573}")
    })
  })

  describe("html-hex format (&#xXXXX;)", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "html-hex")).toBe("&#x4F60;&#x597D;")
      expect(escapeUnicode("café", "html-hex")).toBe("caf&#x00E9;")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "html-hex")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "html-hex")).toBe("&#x1F600;")
    })
  })

  describe("html-dec format (&#DDDD;)", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "html-dec")).toBe("&#20320;&#22909;")
      expect(escapeUnicode("café", "html-dec")).toBe("caf&#233;")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "html-dec")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "html-dec")).toBe("&#128512;")
    })
  })

  describe("unicode format (U+XXXX)", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "unicode")).toBe("U+4F60U+597D")
      expect(escapeUnicode("café", "unicode")).toBe("cafU+00E9")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "unicode")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "unicode")).toBe("U+1F600")
    })
  })

  describe("utf8-hex format (\\xXX)", () => {
    test("escapes non-ASCII characters as UTF-8 bytes", () => {
      expect(escapeUnicode("你好", "utf8-hex")).toBe(
        "\\xE4\\xBD\\xA0\\xE5\\xA5\\xBD"
      )
      expect(escapeUnicode("café", "utf8-hex")).toBe("caf\\xC3\\xA9")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "utf8-hex")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "utf8-hex")).toBe("\\xF0\\x9F\\x98\\x80")
    })

    test("escapes control characters", () => {
      expect(escapeUnicode("\n", "utf8-hex")).toBe("\\x0A")
      expect(escapeUnicode("\t", "utf8-hex")).toBe("\\x09")
    })
  })

  describe("url format (%XX)", () => {
    test("escapes non-ASCII characters as URL encoding", () => {
      expect(escapeUnicode("你好", "url")).toBe("%E4%BD%A0%E5%A5%BD")
      expect(escapeUnicode("café", "url")).toBe("caf%C3%A9")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "url")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "url")).toBe("%F0%9F%98%80")
    })

    test("escapes control characters", () => {
      expect(escapeUnicode("\n", "url")).toBe("%0A")
      expect(escapeUnicode("\t", "url")).toBe("%09")
    })
  })

  describe("python-u format (\\UXXXXXXXX)", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "python-u")).toBe("\\U00004F60\\U0000597D")
      expect(escapeUnicode("café", "python-u")).toBe("caf\\U000000E9")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "python-u")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "python-u")).toBe("\\U0001F600")
    })
  })

  describe("hex-literal format (0xXXXX)", () => {
    test("escapes non-ASCII characters", () => {
      expect(escapeUnicode("你好", "hex-literal")).toBe("0x4F600x597D")
      expect(escapeUnicode("café", "hex-literal")).toBe("caf0x00E9")
    })

    test("preserves ASCII printable characters", () => {
      expect(escapeUnicode("Hello World", "hex-literal")).toBe("Hello World")
    })

    test("handles supplementary characters", () => {
      expect(escapeUnicode("😀", "hex-literal")).toBe("0x1F600")
    })
  })
})

// --- escapeAllUnicode ---

describe("escapeAllUnicode", () => {
  describe("js format", () => {
    test("escapes all characters including ASCII", () => {
      expect(escapeAllUnicode("Hello", "js")).toBe(
        "\\u0048\\u0065\\u006C\\u006C\\u006F"
      )
      expect(escapeAllUnicode("abc", "js")).toBe("\\u0061\\u0062\\u0063")
    })

    test("escapes non-ASCII characters", () => {
      expect(escapeAllUnicode("你好", "js")).toBe("\\u4F60\\u597D")
    })

    test("handles surrogate pairs", () => {
      expect(escapeAllUnicode("😀", "js")).toBe("\\uD83D\\uDE00")
    })

    test("handles empty string", () => {
      expect(escapeAllUnicode("", "js")).toBe("")
    })
  })

  describe("es6 format", () => {
    test("escapes all characters including ASCII", () => {
      expect(escapeAllUnicode("Hi", "es6")).toBe("\\u{0048}\\u{0069}")
    })

    test("handles supplementary characters", () => {
      expect(escapeAllUnicode("😀", "es6")).toBe("\\u{1F600}")
    })
  })

  describe("html-hex format", () => {
    test("escapes all characters including ASCII", () => {
      expect(escapeAllUnicode("Hi", "html-hex")).toBe("&#x0048;&#x0069;")
    })
  })

  describe("html-dec format", () => {
    test("escapes all characters including ASCII", () => {
      expect(escapeAllUnicode("Hi", "html-dec")).toBe("&#72;&#105;")
    })
  })

  describe("unicode format", () => {
    test("escapes all characters including ASCII", () => {
      expect(escapeAllUnicode("Hi", "unicode")).toBe("U+0048U+0069")
    })
  })

  describe("utf8-hex format", () => {
    test("escapes all characters as UTF-8 bytes", () => {
      expect(escapeAllUnicode("Hi", "utf8-hex")).toBe("\\x48\\x69")
      expect(escapeAllUnicode("你", "utf8-hex")).toBe("\\xE4\\xBD\\xA0")
    })
  })

  describe("url format", () => {
    test("escapes all characters as URL encoding", () => {
      expect(escapeAllUnicode("Hi", "url")).toBe("%48%69")
      expect(escapeAllUnicode("你", "url")).toBe("%E4%BD%A0")
    })
  })

  describe("python-u format", () => {
    test("escapes all characters", () => {
      expect(escapeAllUnicode("Hi", "python-u")).toBe("\\U00000048\\U00000069")
    })
  })

  describe("hex-literal format", () => {
    test("escapes all characters", () => {
      expect(escapeAllUnicode("Hi", "hex-literal")).toBe("0x00480x0069")
    })
  })
})

// --- unescapeUnicode ---

describe("unescapeUnicode", () => {
  describe("js format decoding", () => {
    test("decodes \\uXXXX escapes", () => {
      expect(unescapeUnicode("\\u4F60\\u597D")).toBe("你好")
      expect(unescapeUnicode("caf\\u00E9")).toBe("café")
      expect(unescapeUnicode("Hello \\u4E16\\u754C")).toBe("Hello 世界")
    })

    test("decodes surrogate pairs", () => {
      expect(unescapeUnicode("\\uD83D\\uDE00")).toBe("😀")
      expect(unescapeUnicode("\\uD835\\uDD73")).toBe("𝕳")
    })

    test("keeps high surrogates without matching low surrogate", () => {
      expect(unescapeUnicode("\\uD83D\\u0041")).toBe("\ud83dA")
    })

    test("preserves regular text", () => {
      expect(unescapeUnicode("Hello World")).toBe("Hello World")
    })

    test("handles mixed escaped and unescaped text", () => {
      expect(unescapeUnicode("Hello \\u4E16\\u754C World")).toBe(
        "Hello 世界 World"
      )
    })
  })

  describe("es6 format decoding", () => {
    test("decodes \\u{XXXXX} escapes", () => {
      expect(unescapeUnicode("\\u{4F60}\\u{597D}")).toBe("你好")
      expect(unescapeUnicode("caf\\u{E9}")).toBe("café")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("\\u{1F600}")).toBe("😀")
      expect(unescapeUnicode("\\u{1D573}")).toBe("𝕳")
    })
  })

  describe("html-hex format decoding", () => {
    test("decodes &#xXXXX; escapes", () => {
      expect(unescapeUnicode("&#x4F60;&#x597D;")).toBe("你好")
      expect(unescapeUnicode("caf&#xE9;")).toBe("café")
    })

    test("handles case-insensitive hex", () => {
      expect(unescapeUnicode("&#x4f60;&#X597D;")).toBe("你好")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("&#x1F600;")).toBe("😀")
    })
  })

  describe("html-dec format decoding", () => {
    test("decodes &#DDDD; escapes", () => {
      expect(unescapeUnicode("&#20320;&#22909;")).toBe("你好")
      expect(unescapeUnicode("caf&#233;")).toBe("café")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("&#128512;")).toBe("😀")
    })
  })

  describe("unicode notation decoding", () => {
    test("decodes U+XXXX notation", () => {
      expect(unescapeUnicode("U+4F60 U+597D")).toBe("你 好")
      expect(unescapeUnicode("U+4F60U+597D")).toBe("你好")
      expect(unescapeUnicode("cafU+00E9")).toBe("café")
    })

    test("handles case-insensitive", () => {
      expect(unescapeUnicode("u+4f60 u+597d")).toBe("你 好")
      expect(unescapeUnicode("u+4f60u+597d")).toBe("你好")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("U+1F600")).toBe("😀")
    })
  })

  describe("utf8-hex format decoding", () => {
    test("decodes \\xXX byte sequences", () => {
      expect(unescapeUnicode("\\xE4\\xBD\\xA0\\xE5\\xA5\\xBD")).toBe("你好")
      expect(unescapeUnicode("caf\\xC3\\xA9")).toBe("café")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("\\xF0\\x9F\\x98\\x80")).toBe("😀")
    })

    test("handles mixed escaped and unescaped", () => {
      expect(unescapeUnicode("Hello \\xE4\\xB8\\x96")).toBe("Hello 世")
    })
  })

  describe("url format decoding", () => {
    test("decodes %XX byte sequences", () => {
      expect(unescapeUnicode("%E4%BD%A0%E5%A5%BD")).toBe("你好")
      expect(unescapeUnicode("caf%C3%A9")).toBe("café")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("%F0%9F%98%80")).toBe("😀")
    })

    test("handles mixed escaped and unescaped", () => {
      expect(unescapeUnicode("Hello%20World")).toBe("Hello World")
    })
  })

  describe("python-u format decoding", () => {
    test("decodes \\UXXXXXXXX escapes", () => {
      expect(unescapeUnicode("\\U00004F60\\U0000597D")).toBe("你好")
      expect(unescapeUnicode("caf\\U000000E9")).toBe("café")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("\\U0001F600")).toBe("😀")
    })
  })

  describe("hex-literal format decoding", () => {
    test("decodes 0xXXXX literals", () => {
      expect(unescapeUnicode("0x4F60 0x597D")).toBe("你 好")
      expect(unescapeUnicode("caf0x00E9")).toBe("café")
    })

    test("handles case-insensitive hex digits", () => {
      expect(unescapeUnicode("0x4f60 0x597D")).toBe("你 好")
      expect(unescapeUnicode("0x4F60 0x597d")).toBe("你 好")
    })

    test("decodes supplementary characters", () => {
      expect(unescapeUnicode("0x1F600")).toBe("😀")
    })
  })

  describe("mixed format decoding", () => {
    test("decodes multiple formats in same string", () => {
      expect(unescapeUnicode("\\u4F60 &#x597D; &#20320; U+597D")).toBe(
        "你 好 你 好"
      )
    })

    test("handles complex mixed content", () => {
      expect(unescapeUnicode("Hello \\u4E16\\u754C &#x0021; %E4%BD%A0")).toBe(
        "Hello 世界 ! 你"
      )
    })
  })

  describe("edge cases", () => {
    test("handles empty string", () => {
      expect(unescapeUnicode("")).toBe("")
    })

    test("preserves invalid escape sequences", () => {
      expect(unescapeUnicode("\\uGGGG")).toBe("\\uGGGG")
      expect(unescapeUnicode("&#xGGGG;")).toBe("&#xGGGG;")
    })

    test("handles incomplete sequences gracefully", () => {
      expect(unescapeUnicode("\\u4F")).toBe("\\u4F")
      const result = unescapeUnicode("%E4%BD")
      expect(result.length).toBeGreaterThan(0)
    })

    test("rejects code points beyond valid Unicode range", () => {
      expect(unescapeUnicode("\\u{110000}")).toBe("\\u{110000}")
      expect(unescapeUnicode("&#x110000;")).toBe("&#x110000;")
      expect(unescapeUnicode("&#1114112;")).toBe("&#1114112;")
      expect(unescapeUnicode("U+110000")).toBe("U+110000")
      expect(unescapeUnicode("\\U00110000")).toBe("\\U00110000")
      expect(unescapeUnicode("0x110000")).toBe("0x110000")
    })
  })
})

// --- Round-trip ---

describe("round-trip encoding/decoding", () => {
  const testStrings = [
    "Hello World",
    "你好世界",
    "café",
    "日本語",
    "Привет",
    "مرحبا",
    "😀😃😄",
    "Mixed 混合 text 123",
    "!@#$%^&*()",
    "\n\t\r",
  ]

  const roundTrippableFormats: EscapeFormat[] = [
    "js",
    "es6",
    "html-hex",
    "html-dec",
    "utf8-hex",
    "url",
    "python-u",
  ]

  describe("escapeUnicode round-trip", () => {
    for (const format of roundTrippableFormats) {
      test(`unescape(escape(text, '${format}')) returns original`, () => {
        for (const text of testStrings) {
          expect(unescapeUnicode(escapeUnicode(text, format))).toBe(text)
        }
      })
    }
  })

  describe("escapeAllUnicode round-trip", () => {
    for (const format of roundTrippableFormats) {
      test(`unescape(escapeAll(text, '${format}')) returns original`, () => {
        for (const text of testStrings) {
          expect(unescapeUnicode(escapeAllUnicode(text, format))).toBe(text)
        }
      })
    }
  })
})

// --- Special characters ---

describe("special characters and edge cases", () => {
  test("handles zero-width characters", () => {
    const zwj = "\u200D"
    expect(escapeUnicode(zwj, "js")).toBe("\\u200D")
    expect(unescapeUnicode("\\u200D")).toBe(zwj)
  })

  test("handles combining characters", () => {
    const text = "e\u0301"
    expect(escapeUnicode(text, "js")).toBe("e\\u0301")
    expect(unescapeUnicode("e\\u0301")).toBe(text)
  })

  test("handles right-to-left marks", () => {
    const rtl = "\u200F"
    expect(escapeUnicode(rtl, "js")).toBe("\\u200F")
    expect(unescapeUnicode("\\u200F")).toBe(rtl)
  })

  test("handles emoji with skin tone modifiers", () => {
    const emoji = "👋🏽"
    const escaped = escapeUnicode(emoji, "js")
    expect(unescapeUnicode(escaped)).toBe(emoji)
  })

  test("handles multiple consecutive supplementary characters", () => {
    const emojis = "😀😃😄😁"
    const escaped = escapeUnicode(emojis, "js")
    expect(unescapeUnicode(escaped)).toBe(emojis)
  })

  test("handles BMP boundary characters", () => {
    const text = "\uFFFF"
    expect(escapeUnicode(text, "js")).toBe("\\uFFFF")
    expect(unescapeUnicode("\\uFFFF")).toBe(text)
  })

  test("handles null character", () => {
    const text = "\u0000"
    expect(escapeUnicode(text, "js")).toBe("\\u0000")
    expect(unescapeUnicode("\\u0000")).toBe(text)
  })
})

// --- ESCAPE_FORMATS constant ---

describe("ESCAPE_FORMATS", () => {
  test("contains all defined format values", () => {
    const values = ESCAPE_FORMATS.map((f) => f.value)
    expect(values).toContain("js")
    expect(values).toContain("es6")
    expect(values).toContain("html-hex")
    expect(values).toContain("html-dec")
    expect(values).toContain("unicode")
    expect(values).toContain("utf8-hex")
    expect(values).toContain("url")
    expect(values).toContain("python-u")
    expect(values).toContain("hex-literal")
    expect(values).toHaveLength(9)
  })

  test("each format has label and example", () => {
    for (const format of ESCAPE_FORMATS) {
      expect(format.label).toBeTruthy()
      expect(format.example).toBeTruthy()
    }
  })
})
