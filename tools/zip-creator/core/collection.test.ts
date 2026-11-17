import { describe, expect, it } from "vitest"

import { addItems, indexItems, removeItems, zipFilename } from "./collection"

import type { ZipItem } from "../types"

const file = (path: string, content = "abc"): ZipItem => ({
  path,
  file: new File([content], path.split("/").pop()!),
})
const folder = (path: string): ZipItem => ({ path, file: null })

describe("ZIP contents", () => {
  it("infers parents, preserves empty folders and original file references", () => {
    const source = file("旅行/照片/一.txt")
    const { items, adjusted } = addItems(
      [],
      [source, folder("旅行/空"), folder("旅行")]
    )
    expect(items.map((item) => item.path)).toEqual([
      "旅行",
      "旅行/照片",
      "旅行/照片/一.txt",
      "旅行/空",
    ])
    expect(items[2]!.file).toBe(source.file)
    expect(adjusted).toBe(false)
  })

  it("keeps whole duplicate directory trees separate across additions", () => {
    const first = addItems(
      [],
      [file("Project/sub/a.txt"), folder("Project/empty")]
    )
    const second = addItems(first.items, [
      file("Project/sub/a.txt"),
      file("Project/sub/b.txt"),
      folder("Project/empty"),
    ])
    expect(second.adjusted).toBe(true)
    expect(second.items.map((item) => item.path)).toContain(
      "Project (2)/sub/b.txt"
    )
    expect(second.items.map((item) => item.path)).toContain("Project (2)/empty")
    expect(first.items).toHaveLength(4)
  })

  it("resolves extension, case, dotfile, file/folder and normalized-name collisions", () => {
    const { items, adjusted } = addItems(
      [],
      [
        file("Report.txt"),
        file("report.txt"),
        file("Report.txt"),
        file(".env"),
        file(".env"),
        file("a:b.txt"),
        file("a?b.txt"),
        file("Project"),
        folder("Project"),
        file("Project/readme"),
        folder("a:b"),
        file("a?b/c"),
        file("CON.txt"),
        file("..."),
        file("a\\b.txt"),
        file("a\u0000b"),
      ]
    )
    expect(adjusted).toBe(true)
    expect(items.map((item) => item.path)).toEqual([
      "Report.txt",
      "report (2).txt",
      "Report (3).txt",
      ".env",
      ".env (2)",
      "a_b.txt",
      "a_b (2).txt",
      "Project",
      "Project (2)",
      "Project (2)/readme",
      "a_b",
      "a_b (2)",
      "a_b (2)/c",
      "_CON.txt",
      "_",
      "a_b (3).txt",
      "a_b (3)",
    ])
    expect(new Set(items.map((item) => item.path.toLowerCase())).size).toBe(
      items.length
    )
  })

  it.each(["", "/absolute", "a/", "../escape", "a/../b", "a/./b", "a//b"])(
    "rejects unsafe relative path %s atomically",
    (path) => {
      const previous = [file("keep.txt")]
      expect(() => addItems(previous, [file("valid.txt"), file(path)])).toThrow(
        "Invalid relative path"
      )
      expect(previous).toHaveLength(1)
    }
  )

  it("indexes direct children folders first, counts original bytes and keeps unrelated prefixes", () => {
    const { items } = addItems(
      [],
      [file("z"), file("a/b"), folder("b"), file("a/a"), file("ab/c")]
    )
    const index = indexItems(items)
    expect(index.files).toBe(4)
    expect(index.folders).toBe(3)
    expect(index.bytes).toBe(12)
    expect(index.directories.get("")!.map((item) => item.path)).toEqual([
      "a",
      "ab",
      "b",
      "z",
    ])
    expect(index.directories.get("a")!.map((item) => item.path)).toEqual([
      "a/a",
      "a/b",
    ])
    expect(removeItems(items, "a").map((item) => item.path)).toEqual([
      "z",
      "b",
      "ab",
      "ab/c",
    ])
    expect(indexItems([]).directories.get("")).toEqual([])
  })

  it("handles more than a thousand entries without a quota", () => {
    const result = addItems(
      [],
      Array.from({ length: 1001 }, (_, i) => file(`folder/${i}.txt`))
    )
    expect(indexItems(result.items).files).toBe(1001)
  })
})

describe("download name", () => {
  it.each([
    ["archive", "archive.zip"],
    ["  Photos.ZIP  ", "Photos.zip"],
    ["旅行", "旅行.zip"],
    [".notes", ".notes.zip"],
  ])("names %s", (name, expected) => {
    expect(zipFilename(name)).toBe(expected)
  })
  it.each([
    "",
    " ",
    ".zip",
    "..",
    "foo.",
    "a/b",
    "a\\b",
    "CON",
    "a?b",
    "a\u0000b",
    "name .zip",
  ])("rejects %s", (name) => {
    expect(zipFilename(name)).toBeNull()
  })
})
