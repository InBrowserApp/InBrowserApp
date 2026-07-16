import { toolSearchIndex } from "@workspace/tool-registry"
import { describe, expect, it } from "vitest"

import { SUPPORTED_SITE_LANGUAGES } from "./site"
import {
  getDefaultToolsDirectoryStaticPaths,
  getNonDefaultToolsDirectoryStaticPaths,
} from "./static-paths"
import { getPageCount } from "./tools-directory"

function getExpectedPageNumbers() {
  const pageCount = getPageCount(toolSearchIndex.length)

  return Array.from({ length: pageCount - 1 }, (_, index) => index + 2)
}

describe("tools directory static paths", () => {
  it("generates default-language pages two through the last page", () => {
    const expectedPages = getExpectedPageNumbers()
    const paths = getDefaultToolsDirectoryStaticPaths()

    expect(paths).toHaveLength(expectedPages.length)
    expect(paths.map(({ params }) => Number(params.page))).toEqual(
      expectedPages
    )
    expect(paths.map(({ props }) => props.pageNumber)).toEqual(expectedPages)
    expect(paths.some(({ params }) => params.page === "1")).toBe(false)
  })

  it("generates the same page range for every non-default language", () => {
    const expectedPages = getExpectedPageNumbers()
    const paths = getNonDefaultToolsDirectoryStaticPaths()
    const nonDefaultLanguageCount = SUPPORTED_SITE_LANGUAGES.length - 1

    expect(paths).toHaveLength(expectedPages.length * nonDefaultLanguageCount)
    expect(paths.some(({ params }) => params.page === "1")).toBe(false)

    for (const language of SUPPORTED_SITE_LANGUAGES.slice(1)) {
      const languagePaths = paths.filter(
        ({ params }) => params.lang === language
      )

      expect(languagePaths.map(({ params }) => Number(params.page))).toEqual(
        expectedPages
      )
      expect(
        languagePaths.every(({ props }) => props.language === language)
      ).toBe(true)
    }
  })
})
