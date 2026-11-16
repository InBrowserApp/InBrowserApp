import { readFileSync } from "node:fs"
import { describe, expect, test } from "vitest"
import { SUPPORTED_SITE_LANGUAGES } from "../apps/web/src/lib/site"
import { getCategoryLabel } from "../apps/web/src/lib/tool-directory"
import { toolSearchIndex } from "../packages/tool-registry/src/generated/search-index"

const categories = [...new Set(toolSearchIndex.map((entry) => entry.category))]

function loadCategoryLabels(language: string) {
  const file = new URL(
    `../apps/web/src/messages/${language}.json`,
    import.meta.url
  )
  const catalog = JSON.parse(readFileSync(file, "utf8")) as {
    tools: { categories: Record<string, string> }
  }

  return catalog.tools.categories
}

describe.each(SUPPORTED_SITE_LANGUAGES)(
  "tool category labels (%s)",
  (language) => {
    const labels = loadCategoryLabels(language)

    test.each(categories)("%s has a nonempty localized label", (category) => {
      expect(labels).toHaveProperty(category, expect.stringMatching(/\S/))
    })
  }
)

test.each([
  ["en", "Documents"],
  ["zh-CN", "文档"],
] as const)(
  "%s resolves document to its localized label",
  (language, label) => {
    const labels = loadCategoryLabels(language)

    expect(getCategoryLabel(labels, "document")).toBe(label)
  }
)
