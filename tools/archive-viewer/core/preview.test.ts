import { describe, expect, test } from "vitest"

import {
  isImageEntry,
  isPdfEntry,
  isTextEntry,
  resolveTextPreviewLanguage,
} from "./preview"

import type { ArchiveEntry } from "./types"

function entry(extension: string): ArchiveEntry {
  return {
    path: `file.${extension}`,
    kind: "file",
    size: 1,
    compressedSize: null,
    modifiedAt: null,
    extension,
  }
}

describe("archive preview helpers", () => {
  test("detects text and image entries by extension and mime", () => {
    expect(
      isTextEntry(
        entry("json"),
        new Blob(["{}"], { type: "application/octet-stream" })
      )
    ).toBe(true)
    expect(
      isTextEntry(entry("bin"), new Blob(["{}"], { type: "application/json" }))
    ).toBe(true)
    expect(
      isTextEntry(
        entry("bin"),
        new Blob(["<x />"], { type: "application/xml" })
      )
    ).toBe(true)
    expect(
      isTextEntry(entry("bin"), new Blob(["x"], { type: "application/yaml" }))
    ).toBe(true)
    expect(
      isTextEntry(entry("bin"), new Blob(["x"], { type: "application/toml" }))
    ).toBe(true)
    expect(
      isTextEntry(entry("bin"), new Blob(["x"], { type: "text/plain" }))
    ).toBe(true)
    expect(
      isTextEntry(
        entry("bin"),
        new Blob(["x"], { type: "application/octet-stream" })
      )
    ).toBe(false)
    expect(
      isImageEntry(
        entry("png"),
        new Blob(["x"], { type: "application/octet-stream" })
      )
    ).toBe(true)
    expect(
      isImageEntry(entry("bin"), new Blob(["x"], { type: "image/png" }))
    ).toBe(true)
    expect(
      isImageEntry(
        entry("bin"),
        new Blob(["x"], { type: "application/octet-stream" })
      )
    ).toBe(false)
    expect(
      isPdfEntry(
        entry("pdf"),
        new Blob(["%PDF"], { type: "application/octet-stream" })
      )
    ).toBe(true)
    expect(
      isPdfEntry(entry("bin"), new Blob(["%PDF"], { type: "application/pdf" }))
    ).toBe(true)
    expect(
      isPdfEntry(
        entry("bin"),
        new Blob(["x"], { type: "application/octet-stream" })
      )
    ).toBe(false)
  })

  test("resolves highlight languages", () => {
    expect(resolveTextPreviewLanguage(entry("ts"), new Blob([""]))).toBe(
      "typescript"
    )
    expect(
      resolveTextPreviewLanguage(
        entry("bin"),
        new Blob([""], { type: "application/json" })
      )
    ).toBe("json")
    expect(
      resolveTextPreviewLanguage(
        entry("bin"),
        new Blob([""], { type: "text/html" })
      )
    ).toBe("xml")
    expect(
      resolveTextPreviewLanguage(
        entry("bin"),
        new Blob([""], { type: "application/yaml" })
      )
    ).toBe("yaml")
    expect(
      resolveTextPreviewLanguage(
        entry("bin"),
        new Blob([""], { type: "text/javascript" })
      )
    ).toBe("javascript")
    expect(
      resolveTextPreviewLanguage(
        entry("bin"),
        new Blob([""], { type: "text/typescript" })
      )
    ).toBe("typescript")
    expect(
      resolveTextPreviewLanguage(
        entry("bin"),
        new Blob([""], { type: "text/css" })
      )
    ).toBe("css")
    expect(resolveTextPreviewLanguage(entry("bin"), new Blob([""]))).toBe(
      "plaintext"
    )
  })
})
