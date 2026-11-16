import { describe, expect, it } from "vitest"
import { toolSearchIndex } from "@workspace/tool-registry"
import {
  getDefaultCategoryStaticPaths,
  getNonDefaultCategoryStaticPaths,
} from "./static-paths"
import { SUPPORTED_SITE_LANGUAGES } from "./site"

describe("category static paths", () => {
  it("generates exactly the populated categories without duplicate paths", () => {
    const categories = [
      ...new Set(toolSearchIndex.map((entry) => entry.category)),
    ]
    const paths = getDefaultCategoryStaticPaths()

    expect(paths.map(({ params }) => params.category).sort()).toEqual(
      categories.sort()
    )
    expect(paths.length).toBe(categories.length)
  })

  it("generates every non-English category and language combination", () => {
    const categories = getDefaultCategoryStaticPaths()
    const paths = getNonDefaultCategoryStaticPaths()
    const uniquePaths = new Set(
      paths.map(({ params }) => `${params.lang}/${params.category}`)
    )

    expect(paths.length).toBe(
      categories.length * (SUPPORTED_SITE_LANGUAGES.length - 1)
    )
    expect(uniquePaths.size).toBe(paths.length)
    for (const language of SUPPORTED_SITE_LANGUAGES.filter(
      (lang) => lang !== "en"
    )) {
      for (const { params } of categories) {
        expect(uniquePaths.has(`${language}/${params.category}`)).toBe(true)
      }
    }
  })

  it("has localized names and descriptions for every emitted category", () => {
    const catalogs = import.meta.glob<{
      tools: { categories: Record<string, string> }
      categoryPages: {
        titleTemplate: string
        descriptions: Record<string, string>
      }
    }>("../messages/*.json", { eager: true, import: "default" })

    expect(Object.keys(catalogs)).toHaveLength(SUPPORTED_SITE_LANGUAGES.length)
    for (const catalog of Object.values(catalogs)) {
      expect(catalog.categoryPages.titleTemplate).toContain("{category}")
      for (const { params } of getDefaultCategoryStaticPaths()) {
        expect(catalog.tools.categories[params.category]?.trim()).toBeTruthy()
        expect(
          catalog.categoryPages.descriptions[params.category]?.trim()
        ).toBeTruthy()
      }
    }
  })
})
