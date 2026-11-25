import { describe, expect, it } from "vitest"

import { createSearchSuggestionSources } from "../packages/tool-registry/src/generate/search-suggestions"
import type { ToolSearchIndexEntry } from "../packages/tool-registry/src/types"

const entries: readonly ToolSearchIndexEntry[] = [
  {
    slug: "example",
    category: "text",
    icon: "file-text",
    tags: ["example"],
    locales: {
      en: { name: "Example", description: "English description" },
      de: { name: "Beispiel", description: "German description" },
      "zh-CN": { name: "简体示例", description: "简体说明" },
      "zh-TW": { name: "繁體範例", description: "繁體說明" },
    },
  },
  {
    slug: "english-only",
    category: "developer",
    icon: "code",
    tags: [],
    locales: { en: { name: "English only", description: "Fallback" } },
  },
]

describe("search suggestion modules", () => {
  it("emits standalone localized names with English fallback and no full metadata", () => {
    const sources = createSearchSuggestionSources(entries)
    const german = sources["search-suggestions.de.ts"]!

    expect(german).toContain('"name": "Beispiel"')
    expect(german).toContain('"name": "English only"')
    expect(german).toContain('"slug": "example"')
    expect(german).not.toMatch(/description|locales|tags|icon|import\(/)
    expect(sources["search-suggestions.en.ts"]).toContain('"name": "Example"')
  })

  it("ships the alternate Chinese title only in the paired locale modules", () => {
    const sources = createSearchSuggestionSources(entries)

    expect(sources["search-suggestions.zh-CN.ts"]).toContain(
      '"alternateName": "繁體範例"'
    )
    expect(sources["search-suggestions.zh-TW.ts"]).toContain(
      '"alternateName": "简体示例"'
    )
    expect(sources["search-suggestions.en.ts"]).not.toContain("alternateName")
  })

  it("uses dynamic imports per locale and provides an English fallback", () => {
    const source =
      createSearchSuggestionSources(entries)["search-suggestions.ts"]!

    expect(source).toContain('"de": () => import("./search-suggestions.de")')
    expect(source).toContain('"en": () => import("./search-suggestions.en")')
    expect(source).toContain("loaders[language] ?? loaders.en")
  })

  it("still emits a loadable English module for an empty registry", () => {
    const sources = createSearchSuggestionSources([])

    expect(sources["search-suggestions.en.ts"]).toContain("= []")
    expect(Object.keys(sources)).toHaveLength(2)
  })
})
