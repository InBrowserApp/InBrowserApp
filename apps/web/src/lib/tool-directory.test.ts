import { describe, expect, it } from "vitest"
import { countToolsByCategory, toDirectoryEntries } from "./tool-directory"
import type { ToolSearchIndexEntry } from "@workspace/tool-registry"

const entries = [
  {
    slug: "pdf-merger",
    category: "pdf",
    icon: "file-text",
    tags: ["merge"],
    locales: {
      en: { name: "PDF Merger", description: "Merge PDF files." },
      "zh-CN": { name: "PDF 合并器", description: "合并 PDF 文件。" },
    },
  },
  {
    slug: "json-formatter",
    category: "json",
    icon: "braces",
    tags: ["format"],
    locales: {
      en: { name: "JSON Formatter", description: "Format JSON." },
    },
  },
] as const satisfies readonly ToolSearchIndexEntry[]

describe("directory data", () => {
  it("sends only display fields in the requested locale, with English fallback", () => {
    const localized = toDirectoryEntries(entries, "zh-CN")

    expect(localized).toEqual([
      {
        slug: "pdf-merger",
        category: "pdf",
        icon: "file-text",
        name: "PDF 合并器",
        description: "合并 PDF 文件。",
      },
      {
        slug: "json-formatter",
        category: "json",
        icon: "braces",
        name: "JSON Formatter",
        description: "Format JSON.",
      },
    ])
    expect(JSON.stringify(localized)).not.toMatch(/locales|tags|PDF Merger/)
    expect(entries[0].locales.en.name).toBe("PDF Merger")
  })

  it("keeps category counts consistent after locale projection", () => {
    expect(countToolsByCategory(toDirectoryEntries(entries, "en"))).toEqual(
      countToolsByCategory(entries)
    )
    expect(countToolsByCategory([])).toEqual([])
  })

  it("uses the first available locale when the requested locale and English are absent", () => {
    const localized = toDirectoryEntries(
      [
        {
          ...entries[0],
          locales: {
            de: { name: "PDF zusammenführen", description: "PDFs verbinden." },
          },
        },
      ],
      "ja"
    )

    expect(localized[0]).toMatchObject({
      name: "PDF zusammenführen",
      description: "PDFs verbinden.",
    })
  })

  it("keeps an entry discoverable by slug when no locale metadata is available", () => {
    const localized = toDirectoryEntries([{ ...entries[0], locales: {} }], "ja")

    expect(localized[0]).toMatchObject({
      slug: "pdf-merger",
      name: "pdf-merger",
      description: "",
    })
  })
})
