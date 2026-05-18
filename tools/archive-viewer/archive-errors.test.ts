import { describe, expect, test } from "vitest"

import { resolveArchiveError } from "./archive-errors"
import { ArchiveError } from "./core/types"
import messagesCatalog from "./messages/en.json"

import type { ArchiveViewerMessages } from "./types"

const messages = {
  meta: {
    name: "Archive Viewer",
    description: "Inspect archive files.",
  },
  ...messagesCatalog,
} as const satisfies ArchiveViewerMessages

describe("archive error messages", () => {
  test("maps known archive errors to localized messages", () => {
    expect(
      resolveArchiveError(
        new ArchiveError("unsupported-format", "Unsupported"),
        messages
      )
    ).toBe(messages.unsupportedFormat)
    expect(
      resolveArchiveError(
        new ArchiveError("gzip-unsupported", "Unsupported"),
        messages
      )
    ).toBe(messages.gzipUnsupported)
  })

  test("preserves unexpected messages and falls back for unknown errors", () => {
    expect(resolveArchiveError(new Error("Broken archive"), messages)).toBe(
      "Broken archive"
    )
    expect(resolveArchiveError(null, messages)).toBe(messages.parseFailed)
  })
})
