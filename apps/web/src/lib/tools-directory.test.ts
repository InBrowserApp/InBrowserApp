import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import { describe, expect, it } from "vitest"

import {
  createLocalizedToolEntries,
  getLocalizedToolsPagePath,
  getPageCount,
  getPaginationItems,
  getToolsPagePath,
  paginateToolEntries,
  type ToolDirectoryEntry,
} from "./tools-directory"

function createSearchEntry(
  slug: string,
  locales: ToolSearchIndexEntry["locales"]
): ToolSearchIndexEntry {
  return {
    category: "developer",
    icon: `${slug}-icon`,
    locales,
    slug,
    tags: [],
  }
}

function createDirectoryEntries(count: number): ToolDirectoryEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    description: `Description ${index + 1}`,
    icon: "tool-icon",
    name: `Tool ${index + 1}`,
    slug: `tool-${index + 1}`,
  }))
}

describe("createLocalizedToolEntries", () => {
  it("returns only the flat fields needed by the directory", () => {
    const entries = createLocalizedToolEntries(
      [
        createSearchEntry("alpha", {
          en: { description: "English description", name: "Alpha" },
          "zh-CN": { description: "中文描述", name: "阿尔法" },
        }),
      ],
      "zh-CN"
    )

    expect(entries).toEqual([
      {
        description: "中文描述",
        icon: "alpha-icon",
        name: "阿尔法",
        slug: "alpha",
      },
    ])
    expect(Object.keys(entries[0])).toEqual([
      "description",
      "icon",
      "name",
      "slug",
    ])
  })

  it("falls back to English and then the first available locale", () => {
    const entries = createLocalizedToolEntries(
      [
        createSearchEntry("english-fallback", {
          en: { description: "English", name: "English fallback" },
        }),
        createSearchEntry("available-fallback", {
          de: { description: "Deutsch", name: "Verfuegbar" },
        }),
      ],
      "zh-CN"
    )

    expect(entries.map(({ name }) => name)).toEqual([
      "Verfuegbar",
      "English fallback",
    ])
  })

  it("keeps page membership stable by sorting on canonical English names", () => {
    const source = [
      createSearchEntry("beta", {
        en: { description: "B", name: "Beta" },
        "zh-CN": { description: "B", name: "阿尔法" },
      }),
      createSearchEntry("alpha", {
        en: { description: "A", name: "Alpha" },
        "zh-CN": { description: "A", name: "祖鲁" },
      }),
    ]

    const englishSlugs = createLocalizedToolEntries(source, "en").map(
      ({ slug }) => slug
    )
    const chineseSlugs = createLocalizedToolEntries(source, "zh-CN").map(
      ({ slug }) => slug
    )

    expect(englishSlugs).toEqual(["alpha", "beta"])
    expect(chineseSlugs).toEqual(englishSlugs)
  })
})

describe("directory page boundaries", () => {
  it("calculates at least one page", () => {
    expect(getPageCount(0)).toBe(1)
    expect(getPageCount(24)).toBe(1)
    expect(getPageCount(25)).toBe(2)
    expect(getPageCount(49)).toBe(3)
  })

  it("slices entries and reports one-based result boundaries", () => {
    const entries = createDirectoryEntries(49)

    expect(paginateToolEntries(entries, 1)).toMatchObject({
      end: 24,
      pageCount: 3,
      pageNumber: 1,
      start: 1,
      total: 49,
    })
    expect(paginateToolEntries(entries, 2)).toMatchObject({
      end: 48,
      pageNumber: 2,
      start: 25,
    })
    expect(paginateToolEntries(entries, 3)).toMatchObject({
      end: 49,
      entries: [entries[48]],
      pageNumber: 3,
      start: 49,
    })
  })

  it("reports empty boundaries for an empty first page", () => {
    expect(paginateToolEntries([], 1)).toMatchObject({
      end: 0,
      entries: [],
      pageCount: 1,
      start: 0,
      total: 0,
    })
  })

  it("rejects invalid totals, sizes, and requested pages", () => {
    expect(() => getPageCount(-1)).toThrow(RangeError)
    expect(() => getPageCount(1.5)).toThrow(RangeError)
    expect(() => getPageCount(1, 0)).toThrow(RangeError)
    expect(() => getPageCount(1, 1.5)).toThrow(RangeError)

    const entries = createDirectoryEntries(25)
    expect(() => paginateToolEntries(entries, 0)).toThrow(RangeError)
    expect(() => paginateToolEntries(entries, 1.5)).toThrow(RangeError)
    expect(() => paginateToolEntries(entries, 3)).toThrow(RangeError)
  })
})

describe("directory pagination links", () => {
  it("keeps page one canonical and emits trailing slashes for localized URLs", () => {
    expect(getToolsPagePath(1)).toBe("/tools")
    expect(getToolsPagePath(3)).toBe("/tools/page/3")
    expect(getLocalizedToolsPagePath("/tools", 1)).toBe("/tools/")
    expect(getLocalizedToolsPagePath("/zh-CN/tools/", 3)).toBe(
      "/zh-CN/tools/page/3/"
    )
  })

  it("rejects invalid page numbers in paths", () => {
    expect(() => getToolsPagePath(0)).toThrow(RangeError)
    expect(() => getToolsPagePath(1.5)).toThrow(RangeError)
    expect(() => getLocalizedToolsPagePath("/tools", -1)).toThrow(RangeError)
  })

  it("shows every page for short ranges and ellipses for long ranges", () => {
    expect(getPaginationItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(getPaginationItems(1, 10)).toEqual([1, 2, 3, null, 10])
    expect(getPaginationItems(5, 10)).toEqual([1, null, 4, 5, 6, null, 10])
    expect(getPaginationItems(10, 10)).toEqual([1, null, 8, 9, 10])
  })

  it("rejects impossible pagination states", () => {
    expect(() => getPaginationItems(0, 10)).toThrow(RangeError)
    expect(() => getPaginationItems(11, 10)).toThrow(RangeError)
    expect(() => getPaginationItems(1, 0)).toThrow(RangeError)
    expect(() => getPaginationItems(1.5, 10)).toThrow(RangeError)
  })
})
