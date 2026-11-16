import { describe, expect, it } from "vitest"
import { countToolsByCategory, toDirectoryEntries } from "./tool-directory"
import type { ToolSearchIndexEntry } from "@workspace/tool-registry"

const entries: readonly ToolSearchIndexEntry[] = [
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
]

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
    expect(entries[0]?.locales.en?.name).toBe("PDF Merger")
  })

  it("keeps category counts consistent after locale projection", () => {
    expect(countToolsByCategory(toDirectoryEntries(entries, "en"))).toEqual(
      countToolsByCategory(entries)
    )
    expect(countToolsByCategory([])).toEqual([])
  })
})
