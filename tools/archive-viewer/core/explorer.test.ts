import { describe, expect, test } from "vitest"

import { buildRowIndex, buildRows, getRowsForDirectory } from "./explorer"

import type { ArchiveEntry } from "./types"

const entries: ArchiveEntry[] = [
  {
    path: "docs/readme.txt",
    kind: "file",
    size: 10,
    compressedSize: 5,
    modifiedAt: null,
    extension: "txt",
  },
  {
    path: "docs/nested/guide.md",
    kind: "file",
    size: 20,
    compressedSize: 9,
    modifiedAt: null,
    extension: "md",
  },
  {
    path: "images/logo.png",
    kind: "file",
    size: 30,
    compressedSize: 12,
    modifiedAt: null,
    extension: "png",
  },
]

describe("archive explorer rows", () => {
  test("indexes rows by virtual directory", () => {
    const index = buildRowIndex(entries)

    expect(getRowsForDirectory(index, "").map((row) => row.path)).toEqual([
      "docs/",
      "images/",
    ])
    expect(getRowsForDirectory(index, "docs/").map((row) => row.path)).toEqual([
      "docs/nested/",
      "docs/readme.txt",
    ])
    expect(buildRows(entries, "images/").map((row) => row.path)).toEqual([
      "images/logo.png",
    ])
  })

  test("prefers actual directory metadata over synthetic parent rows", () => {
    const modifiedAt = new Date("2024-02-01T10:00:00.000Z")
    const index = buildRowIndex([
      entries[0]!,
      {
        path: "docs/",
        kind: "directory",
        size: 0,
        compressedSize: null,
        modifiedAt,
        extension: "",
      },
    ])

    expect(getRowsForDirectory(index, "")[0]?.modifiedAt).toEqual(modifiedAt)
  })

  test("sorts sibling files by name", () => {
    expect(
      getRowsForDirectory(
        buildRowIndex([
          {
            path: "z.txt",
            kind: "file",
            size: 1,
            compressedSize: null,
            modifiedAt: null,
            extension: "txt",
          },
          {
            path: "a.txt",
            kind: "file",
            size: 1,
            compressedSize: null,
            modifiedAt: null,
            extension: "txt",
          },
        ]),
        ""
      ).map((row) => row.path)
    ).toEqual(["a.txt", "z.txt"])
  })

  test("ignores empty entry paths and returns empty rows for missing folders", () => {
    const index = buildRowIndex([
      {
        path: "",
        kind: "file",
        size: 1,
        compressedSize: null,
        modifiedAt: null,
        extension: "",
      },
    ])

    expect(getRowsForDirectory(index, "")).toEqual([])
    expect(getRowsForDirectory(index, "missing")).toEqual([])
  })
})
