import { describe, expect, it } from "vitest"

import { buildSearchSuggestions, rankToolEntries } from "./search-core"
import type { DirectoryToolEntry } from "@/lib/tool-directory"

const entries = [
  {
    slug: "json",
    category: "json",
    icon: "braces",
    name: "JSON",
    description: "Serialize values.",
  },
  {
    slug: "json-formatter",
    category: "json",
    icon: "braces",
    name: "JSON Formatter",
    description: "Indent files.",
  },
  {
    slug: "encoder",
    category: "text",
    icon: "wrench",
    name: "Encoder",
    description: "Encode JSON values.",
  },
] as const satisfies readonly DirectoryToolEntry[]

const slugs = (results: readonly DirectoryToolEntry[]) =>
  results.map((entry) => entry.slug)

describe("localized directory search", () => {
  it("ranks an exact name before name prefixes and description matches", () => {
    expect(slugs(rankToolEntries(entries, "JSON", "en"))).toEqual([
      "json",
      "json-formatter",
      "encoder",
    ])
  })

  it("requires every query token while matching across names and descriptions", () => {
    expect(slugs(rankToolEntries(entries, "encoder values", "en"))).toEqual([
      "encoder",
    ])
    expect(rankToolEntries(entries, "json missing", "en")).toEqual([])
  })

  it("sorts unfiltered entries alphabetically", () => {
    expect(slugs(rankToolEntries(entries, "", "en"))).toEqual([
      "encoder",
      "json",
      "json-formatter",
    ])
  })

  it("matches the localized name and description", () => {
    const localized = [
      { ...entries[2], name: "编码工具", description: "处理 JSON 文本。" },
    ]

    expect(slugs(rankToolEntries(localized, "编码", "zh-CN"))).toEqual([
      "encoder",
    ])
    expect(slugs(rankToolEntries(localized, "文本", "zh-CN"))).toEqual([
      "encoder",
    ])
    expect(rankToolEntries(localized, "encode", "zh-CN")).toEqual([])
  })
})

describe("directory suggestions", () => {
  it("matches only names and preserves the highlighted display text", () => {
    expect(
      buildSearchSuggestions(entries, "json", "en").map(
        ({ entry }) => entry.slug
      )
    ).toEqual(["json", "json-formatter"])
    expect(buildSearchSuggestions(entries, "values", "en")).toEqual([])
    expect(buildSearchSuggestions(entries, "formatter", "en")[0]).toMatchObject(
      {
        entry: entries[1],
        pre: "JSON ",
        match: "Formatter",
        post: "",
      }
    )
  })

  it("limits suggestions to eight entries in alphabetical order for equal scores", () => {
    const matches = Array.from({ length: 10 }, (_, index) => ({
      ...entries[0],
      slug: "json-" + index,
      name: "JSON " + index,
    })).reverse()

    expect(
      buildSearchSuggestions(matches, "json", "en").map(
        ({ entry }) => entry.slug
      )
    ).toEqual(Array.from({ length: 8 }, (_, index) => "json-" + index))
  })
})
