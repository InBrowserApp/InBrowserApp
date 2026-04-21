import { describe, expect, test } from "vitest"

import {
  decodeDataUri,
  deriveDecodedFileName,
  getPreviewKind,
  parseDataUri,
  parseDataUriPreview,
} from "./data-uri"

describe("parseDataUri", () => {
  test("parses base64 data with an explicit media type", () => {
    expect(parseDataUri("data:text/plain;base64,SGVsbG8=")).toEqual({
      mimeType: "text/plain",
      mediaType: "text/plain",
      isBase64: true,
      data: "SGVsbG8=",
    })
  })

  test("defaults to text/plain;charset=US-ASCII when metadata is omitted", () => {
    expect(parseDataUri("data:,Hello%20world")).toEqual({
      mimeType: "text/plain;charset=US-ASCII",
      mediaType: "text/plain",
      isBase64: false,
      data: "Hello%20world",
    })
  })

  test("accepts base64 without an explicit media type", () => {
    expect(parseDataUri("data:;base64,SGVsbG8=")).toEqual({
      mimeType: "text/plain;charset=US-ASCII",
      mediaType: "text/plain",
      isBase64: true,
      data: "SGVsbG8=",
    })
  })

  test("accepts the short data:base64 form", () => {
    expect(parseDataUri("data:base64,SGVsbG8=")).toEqual({
      mimeType: "text/plain;charset=US-ASCII",
      mediaType: "text/plain",
      isBase64: true,
      data: "SGVsbG8=",
    })
  })

  test("keeps an explicit charset without injecting the default", () => {
    expect(parseDataUri("data:;charset=utf-8,hello")).toEqual({
      mimeType: "text/plain;charset=utf-8",
      mediaType: "text/plain",
      isBase64: false,
      data: "hello",
    })
  })

  test("throws for malformed values", () => {
    expect(() => parseDataUri("https://example.com")).toThrow()
    expect(() => parseDataUri("data:text/plain;base64")).toThrow()
  })
})

describe("decodeDataUri", () => {
  test("decodes percent-encoded text", () => {
    const parsed = parseDataUri("data:,Hello%20world")
    expect(new TextDecoder().decode(decodeDataUri(parsed))).toBe("Hello world")
  })

  test("preserves percent-encoded raw bytes for non-base64 payloads", () => {
    const parsed = parseDataUri("data:application/octet-stream,%FF%00A")
    expect(Array.from(decodeDataUri(parsed))).toEqual([255, 0, 65])
  })

  test("decodes base64 with whitespace", () => {
    const parsed = parseDataUri("data:text/plain;base64,SGV s\nbG8=")
    expect(new TextDecoder().decode(decodeDataUri(parsed))).toBe("Hello")
  })
})

describe("getPreviewKind", () => {
  test("classifies common previewable media types", () => {
    expect(getPreviewKind("image/png")).toBe("image")
    expect(getPreviewKind("audio/mpeg")).toBe("audio")
    expect(getPreviewKind("video/mp4")).toBe("video")
    expect(getPreviewKind("application/json")).toBe("text")
    expect(getPreviewKind("application/octet-stream")).toBeNull()
  })
})

describe("parseDataUriPreview", () => {
  test("returns empty state for blank input", () => {
    expect(parseDataUriPreview("   ")).toEqual({ state: "empty" })
  })

  test("returns invalid state for malformed input", () => {
    expect(parseDataUriPreview("not a data uri")).toEqual({
      state: "invalid-data-uri",
    })
  })

  test("returns decoded text preview and truncation flag", () => {
    const preview = parseDataUriPreview(
      `data:text/plain,${encodeURIComponent("a".repeat(2001))}`
    )

    expect(preview.state).toBe("decoded")
    if (preview.state !== "decoded") {
      throw new Error("Expected decoded preview")
    }

    expect(preview.previewKind).toBe("text")
    expect(preview.isPreviewTruncated).toBe(true)
    expect(preview.textPreview.length).toBe(2003)
  })

  test("uses the declared charset for text previews", () => {
    const preview = parseDataUriPreview(
      "data:text/plain;charset=iso-8859-1,%E9"
    )

    expect(preview.state).toBe("decoded")
    if (preview.state !== "decoded") {
      throw new Error("Expected decoded preview")
    }

    expect(preview.textPreview).toBe("é")
  })
})

describe("deriveDecodedFileName", () => {
  test("returns a mapped extension for common media types", () => {
    expect(deriveDecodedFileName("image/svg+xml;charset=utf-8")).toBe(
      "data.svg"
    )
    expect(deriveDecodedFileName("application/json")).toBe("data.json")
    expect(deriveDecodedFileName("audio/mpeg")).toBe("data.mp3")
  })

  test("maps structured syntax suffixes and fallback subtypes", () => {
    expect(deriveDecodedFileName("application/vnd.api+json")).toBe("data.json")
    expect(deriveDecodedFileName("application/rss+xml")).toBe("data.xml")
    expect(deriveDecodedFileName("application/x-custom")).toBe("data.custom")
  })

  test("falls back to data.bin when the type is unknown", () => {
    expect(deriveDecodedFileName("")).toBe("data.bin")
  })
})
