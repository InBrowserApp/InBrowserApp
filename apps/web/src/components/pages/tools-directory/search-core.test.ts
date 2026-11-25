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
    expect(slugs(rankToolEntries(localized, "encoder", "zh-CN"))).toEqual([
      "encoder",
    ])
  })

  it("ignores separators and width but gives an exact title priority", () => {
    const hyphenated = {
      ...entries[1],
      slug: "hyphenated",
      name: "JSON-Formatter",
    }
    const choices = [hyphenated, entries[1]]

    expect(
      slugs(rankToolEntries(choices, "ＪＳＯＮ　Formatter", "en"))
    ).toEqual(["json-formatter", "hyphenated"])
    expect(
      buildSearchSuggestions([entries[1]], "jsonformatter", "en")[0]?.match
    ).toBe("JSON Formatter")
  })

  it("segments adjacent words and ranks their original order first", () => {
    const fromPdf = {
      ...entries[0],
      slug: "from-pdf",
      name: "PDF を画像に変換",
    }
    const toPdf = { ...entries[0], slug: "to-pdf", name: "画像を PDF に変換" }

    expect(slugs(rankToolEntries([fromPdf, toPdf], "画像PDF", "ja"))).toEqual([
      "to-pdf",
      "from-pdf",
    ])
  })

  it("matches alternate Chinese titles through both search entry points", () => {
    const localized = [
      {
        ...entries[0],
        name: "QR Code 產生器",
        alternateName: "二维码生成器",
      },
    ]

    expect(rankToolEntries(localized, "二维 码生成器", "zh-TW")).toEqual(
      localized
    )
    expect(
      buildSearchSuggestions(localized, "二维码生成器", "zh-TW")[0]?.entry
    ).toBe(localized[0])
  })
})

describe("directory suggestions", () => {
  it("keeps description-only matches in the directory", () => {
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

  it("highlights accents and compatibility characters in the displayed title", () => {
    const localized = [{ ...entries[0], name: "A ﬁchier de\u0301jà prêt" }]
    expect(
      buildSearchSuggestions(localized, "fichier deja", "fr")[0]
    ).toMatchObject({
      pre: "A ",
      match: "ﬁchier de\u0301jà",
      post: " prêt",
    })
  })

  it("allows one typo in longer words while keeping numbers distinct", () => {
    expect(
      buildSearchSuggestions(entries, "json formater", "en")[0]?.entry
    ).toBe(entries[1])
    expect(
      buildSearchSuggestions(entries, "json fromatter", "en")[0]?.entry
    ).toBe(entries[1])
    expect(
      buildSearchSuggestions(
        [{ ...entries[0], slug: "sha-256", name: "SHA-256" }],
        "sha257",
        "en"
      )
    ).toEqual([])
  })

  it("prefers a leading run of query words over ordered words later in a title", () => {
    const converter = { ...entries[0], name: "Image to PDF Converter" }
    const extractor = { ...entries[1], name: "Extract Images from PDF" }

    expect(
      buildSearchSuggestions([extractor, converter], "image pdf", "en")[0]
        ?.entry
    ).toBe(converter)
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
