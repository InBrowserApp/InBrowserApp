import { describe, expect, test } from "vitest"

import {
  formatBytes,
  formatDate,
  getFormatLabel,
  getKindLabel,
  summarizeEntries,
} from "./format"
import { guessMimeType, withGuessedMimeType } from "./mime"
import {
  extractExtension,
  normalizeArchivePath,
  normalizeDirectoryPath,
  safeDownloadName,
  sortEntries,
  splitPathSegments,
  stripSuffix,
  toDirectoryPath,
} from "./path"

import type { ArchiveEntry, ArchiveEntryKind } from "./types"

function entry(
  path: string,
  kind: ArchiveEntryKind = "file",
  size = 1
): ArchiveEntry {
  return {
    path,
    kind,
    size,
    compressedSize: null,
    modifiedAt: null,
    extension: extractExtension(path),
  }
}

describe("archive formatting helpers", () => {
  test("formats sizes, dates, formats, kinds, and entry summaries", () => {
    expect(formatBytes(Number.NaN)).toBe("0 B")
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(1024)).toBe("1 KB")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(1024 ** 5).replace(/,/g, "")).toBe("1024 TB")
    expect(formatDate(null)).toBe("-")
    expect(formatDate(new Date("2024-04-01T12:00:00.000Z"))).not.toBe("-")
    expect(getFormatLabel("zip")).toBe("ZIP")
    expect(getFormatLabel("tar")).toBe("TAR")
    expect(getFormatLabel("gz")).toBe("GZ")
    expect(getFormatLabel("tgz")).toBe("TGZ")
    expect(
      getKindLabel("symlink", {
        file: "File",
        directory: "Folder",
        symlink: "Symlink",
        other: "Other",
      })
    ).toBe("Symlink")

    expect(
      summarizeEntries([
        entry("docs/", "directory", 0),
        entry("docs/readme.txt", "file", 5),
        entry("docs/link", "symlink", 1),
        entry("docs/device", "other", 10),
      ])
    ).toEqual({
      entries: 4,
      files: 1,
      directories: 1,
      uncompressedSize: 5,
    })
  })
})

describe("archive path helpers", () => {
  test("normalizes, splits, and formats archive paths", () => {
    expect(normalizeArchivePath(" ./docs\\readme.md ")).toBe("docs/readme.md")
    expect(normalizeArchivePath("/docs/readme.md")).toBe("docs/readme.md")
    expect(normalizeArchivePath(".")).toBe("")
    expect(normalizeArchivePath("..")).toBe("")
    expect(splitPathSegments(" docs//nested /file.txt ")).toEqual([
      "docs",
      "nested",
      "file.txt",
    ])
    expect(toDirectoryPath([])).toBe("")
    expect(toDirectoryPath(["docs", "nested"])).toBe("docs/nested/")
    expect(normalizeDirectoryPath("docs/nested")).toBe("docs/nested/")
    expect(extractExtension("docs/readme.MD")).toBe("md")
    expect(extractExtension(".gitignore")).toBe("")
    expect(extractExtension("archive.")).toBe("")
    expect(stripSuffix("bundle.tar.gz", ".gz")).toBe("bundle.tar")
    expect(stripSuffix("bundle.tar", ".gz")).toBe("bundle.tar")
    expect(safeDownloadName("docs/readme.md")).toBe("readme.md")
    expect(safeDownloadName("/")).toBe("archive-entry.bin")
  })

  test("sorts directories before files and falls back to path order", () => {
    expect(
      sortEntries([
        entry("docs/readme.txt"),
        entry("docs/", "directory", 0),
        entry("z.txt"),
        entry("a.txt"),
      ]).map((item) => item.path)
    ).toEqual(["docs/", "a.txt", "docs/readme.txt", "z.txt"])
    expect(
      sortEntries([entry("docs/", "directory", 0), entry("a.txt")]).map(
        (item) => item.path
      )
    ).toEqual(["docs/", "a.txt"])
  })
})

describe("archive mime helpers", () => {
  test("guesses mime types and preserves already specific blob types", async () => {
    expect(guessMimeType("photo.png")).toBe("image/png")
    expect(guessMimeType("unknown.bin")).toBe("application/octet-stream")

    const textBlob = new Blob(["x"], { type: "text/plain" })
    expect(withGuessedMimeType(textBlob, "data.json")).toBe(textBlob)
    expect(withGuessedMimeType(new Blob(["{}"]), "data.json").type).toBe(
      "application/json"
    )
  })
})
