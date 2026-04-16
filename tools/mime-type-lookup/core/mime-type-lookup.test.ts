import { describe, expect, test } from "vitest"

import {
  MIME_TYPE_CATEGORIES,
  createMimeTypeEntries,
  filterMimeTypeEntries,
  getMimeTypeCategory,
  isMimeTypeCategory,
  normalizeMimeTypeQuery,
  type MimeTypeEntry,
} from "./mime-type-lookup"

const fixtureDatabase = {
  "application/json": {
    extensions: ["json"],
    source: "iana",
    compressible: true,
    charset: "UTF-8",
  },
  "image/png": {
    extensions: ["png"],
    source: "iana",
    compressible: false,
  },
  "message/example": {
    source: "iana",
  },
  "unknown/example": {
    extensions: ["unknown"],
  },
  "text/plain": {
    extensions: ["txt", "text"],
    source: "iana",
    compressible: true,
    charset: "UTF-8",
  },
} as const

const fixtureEntries = createMimeTypeEntries(fixtureDatabase)

describe("normalizeMimeTypeQuery", () => {
  test("trims whitespace and lowercases the query", () => {
    expect(normalizeMimeTypeQuery("  JSON  ")).toBe("json")
  })
})

describe("isMimeTypeCategory", () => {
  test("accepts known categories and rejects unknown ones", () => {
    expect(isMimeTypeCategory("text")).toBe(true)
    expect(isMimeTypeCategory("unknown")).toBe(false)
  })
})

describe("getMimeTypeCategory", () => {
  test("returns the category from the MIME type", () => {
    expect(getMimeTypeCategory("image/png")).toBe("image")
  })

  test("falls back to unknown for unsupported categories", () => {
    expect(getMimeTypeCategory("example/custom")).toBe("unknown")
  })
})

describe("createMimeTypeEntries", () => {
  test("creates sorted entries with derived categories", () => {
    expect(fixtureEntries).toEqual([
      {
        mimeType: "application/json",
        category: "application",
        extensions: ["json"],
        source: "iana",
        compressible: true,
        charset: "UTF-8",
      },
      {
        mimeType: "image/png",
        category: "image",
        extensions: ["png"],
        source: "iana",
        compressible: false,
        charset: undefined,
      },
      {
        mimeType: "message/example",
        category: "message",
        extensions: [],
        source: "iana",
        compressible: undefined,
        charset: undefined,
      },
      {
        mimeType: "text/plain",
        category: "text",
        extensions: ["txt", "text"],
        source: "iana",
        compressible: true,
        charset: "UTF-8",
      },
      {
        mimeType: "unknown/example",
        category: "unknown",
        extensions: ["unknown"],
        source: undefined,
        charset: undefined,
        compressible: undefined,
      },
    ] satisfies readonly MimeTypeEntry[])
  })

  test("exports the supported category list", () => {
    expect(MIME_TYPE_CATEGORIES).toEqual([
      "application",
      "audio",
      "font",
      "image",
      "message",
      "model",
      "multipart",
      "text",
      "video",
    ])
  })
})

describe("filterMimeTypeEntries", () => {
  test("returns every entry when the search query is blank", () => {
    expect(filterMimeTypeEntries(fixtureEntries, "   ", "all")).toEqual(
      fixtureEntries
    )
  })

  test("filters by category", () => {
    expect(
      filterMimeTypeEntries(fixtureEntries, "", "application").map(
        (entry) => entry.mimeType
      )
    ).toEqual(["application/json"])
  })

  test("matches MIME types by type, extension, source, and charset", () => {
    expect(
      filterMimeTypeEntries(fixtureEntries, "plain", "all").map(
        (entry) => entry.mimeType
      )
    ).toEqual(["text/plain"])
    expect(
      filterMimeTypeEntries(fixtureEntries, "png", "all").map(
        (entry) => entry.mimeType
      )
    ).toEqual(["image/png"])
    expect(
      filterMimeTypeEntries(fixtureEntries, "iana", "all").map(
        (entry) => entry.mimeType
      )
    ).toEqual([
      "application/json",
      "image/png",
      "message/example",
      "text/plain",
    ])
    expect(
      filterMimeTypeEntries(fixtureEntries, "utf-8", "all").map(
        (entry) => entry.mimeType
      )
    ).toEqual(["application/json", "text/plain"])
  })

  test("applies the search after the active category filter", () => {
    expect(
      filterMimeTypeEntries(fixtureEntries, "json", "text").map(
        (entry) => entry.mimeType
      )
    ).toEqual([])
  })
})
