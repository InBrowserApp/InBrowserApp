import { describe, expect, test } from "vitest"

import { decodeHtmlEntities, encodeHtmlEntities } from "./html-entity"

describe("encodeHtmlEntities", () => {
  test("encodes minimal HTML characters with named entities", () => {
    expect(encodeHtmlEntities("<div>", "named", "minimal")).toBe("&lt;div&gt;")
    expect(encodeHtmlEntities("&", "named", "minimal")).toBe("&amp;")
    expect(encodeHtmlEntities('"test"', "named", "minimal")).toBe(
      "&quot;test&quot;"
    )
    expect(encodeHtmlEntities("it's", "named", "minimal")).toBe("it&apos;s")
  })

  test("preserves safe text with minimal range", () => {
    expect(encodeHtmlEntities("Hello World", "named", "minimal")).toBe(
      "Hello World"
    )
    expect(encodeHtmlEntities("123", "named", "minimal")).toBe("123")
  })

  test("encodes non ASCII characters", () => {
    expect(encodeHtmlEntities("Hello 中文", "named", "non-ascii")).toBe(
      "Hello &#20013;&#25991;"
    )
    expect(encodeHtmlEntities("café", "named", "non-ascii")).toBe("caf&#233;")
  })

  test("uses named entities for supported symbols", () => {
    expect(encodeHtmlEntities("©", "named", "non-ascii")).toBe("&copy;")
    expect(encodeHtmlEntities("®", "named", "non-ascii")).toBe("&reg;")
    expect(encodeHtmlEntities("™", "named", "non-ascii")).toBe("&trade;")
    expect(encodeHtmlEntities("€", "named", "non-ascii")).toBe("&euro;")
  })

  test("encodes decimal entities", () => {
    expect(encodeHtmlEntities("<", "decimal", "minimal")).toBe("&#60;")
    expect(encodeHtmlEntities("中", "decimal", "non-ascii")).toBe("&#20013;")
    expect(encodeHtmlEntities("日本語", "decimal", "non-ascii")).toBe(
      "&#26085;&#26412;&#35486;"
    )
  })

  test("encodes hexadecimal entities", () => {
    expect(encodeHtmlEntities("<", "hex", "minimal")).toBe("&#x3C;")
    expect(encodeHtmlEntities("中", "hex", "non-ascii")).toBe("&#x4E2D;")
  })

  test("encodes non BMP code points correctly", () => {
    expect(encodeHtmlEntities("😀", "decimal", "non-ascii")).toBe("&#128512;")
    expect(encodeHtmlEntities("😀", "hex", "non-ascii")).toBe("&#x1F600;")
  })

  test("encodes all special characters when requested", () => {
    expect(encodeHtmlEntities("Hello!", "named", "all-special")).toBe(
      "Hello&#33;"
    )
    expect(encodeHtmlEntities("a@b.c", "decimal", "all-special")).toBe(
      "a&#64;b&#46;c"
    )
    expect(encodeHtmlEntities("Hello World 123", "named", "all-special")).toBe(
      "Hello World 123"
    )
  })

  test("handles empty strings", () => {
    expect(encodeHtmlEntities("", "named", "minimal")).toBe("")
  })
})

describe("decodeHtmlEntities", () => {
  test("decodes named entities", () => {
    expect(decodeHtmlEntities("&lt;")).toBe("<")
    expect(decodeHtmlEntities("&gt;")).toBe(">")
    expect(decodeHtmlEntities("&amp;")).toBe("&")
    expect(decodeHtmlEntities("&quot;")).toBe('"')
    expect(decodeHtmlEntities("&apos;")).toBe("'")
  })

  test("decodes symbol entities", () => {
    expect(decodeHtmlEntities("&copy;")).toBe("©")
    expect(decodeHtmlEntities("&reg;")).toBe("®")
    expect(decodeHtmlEntities("&trade;")).toBe("™")
    expect(decodeHtmlEntities("&euro;")).toBe("€")
    expect(decodeHtmlEntities("&nbsp;")).toBe("\u00A0")
  })

  test("preserves unknown named entities", () => {
    expect(decodeHtmlEntities("&unknown;")).toBe("&unknown;")
  })

  test("decodes decimal entities", () => {
    expect(decodeHtmlEntities("&#60;")).toBe("<")
    expect(decodeHtmlEntities("&#20013;")).toBe("中")
    expect(decodeHtmlEntities("&#128512;")).toBe("😀")
  })

  test("preserves out of range decimal entities", () => {
    expect(decodeHtmlEntities("&#1114112;")).toBe("&#1114112;")
  })

  test("decodes hexadecimal entities", () => {
    expect(decodeHtmlEntities("&#x3c;")).toBe("<")
    expect(decodeHtmlEntities("&#x3C;")).toBe("<")
    expect(decodeHtmlEntities("&#x4E2D;")).toBe("中")
    expect(decodeHtmlEntities("&#x1F600;")).toBe("😀")
  })

  test("preserves out of range hexadecimal entities", () => {
    expect(decodeHtmlEntities("&#x110000;")).toBe("&#x110000;")
  })

  test("handles mixed content", () => {
    expect(decodeHtmlEntities("&lt;div&gt;&#60;span&#x3E;")).toBe("<div><span>")
    expect(decodeHtmlEntities("Hello World")).toBe("Hello World")
    expect(decodeHtmlEntities("&lt;div class=&quot;test&quot;&gt;")).toBe(
      '<div class="test">'
    )
  })

  test("handles empty strings", () => {
    expect(decodeHtmlEntities("")).toBe("")
  })
})

describe("round trips", () => {
  test("decode encode returns original text", () => {
    const testCases = [
      "<div>",
      "Hello & World",
      '"quotes"',
      "it's ok",
      "Hello 中文",
      "日本語テスト",
      "Café © 2024",
      "Emoji 😀",
    ]

    for (const text of testCases) {
      expect(
        decodeHtmlEntities(encodeHtmlEntities(text, "named", "minimal"))
      ).toBe(text)
      expect(
        decodeHtmlEntities(encodeHtmlEntities(text, "decimal", "non-ascii"))
      ).toBe(text)
      expect(
        decodeHtmlEntities(encodeHtmlEntities(text, "hex", "all-special"))
      ).toBe(text)
    }
  })
})
