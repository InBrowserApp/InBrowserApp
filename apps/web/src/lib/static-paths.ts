import { toolSearchIndex, toolStaticPaths } from "@workspace/tool-registry"

import { DEFAULT_SITE_LANGUAGE, isSupportedSiteLanguage } from "./site"
import { createNonDefaultLanguageStaticPaths } from "./site"
import { countToolsByCategory } from "./tool-directory"

function getNonDefaultSiteStaticPaths() {
  return createNonDefaultLanguageStaticPaths().map(({ params }) => ({ params }))
}

function getDefaultToolStaticPaths() {
  return toolStaticPaths
    .filter((entry) => entry.language === DEFAULT_SITE_LANGUAGE)
    .map((entry) => ({
      params: {
        slug: entry.slug,
      },
    }))
}

function getNonDefaultToolStaticPaths() {
  return toolStaticPaths
    .filter(
      (entry) =>
        entry.language !== DEFAULT_SITE_LANGUAGE &&
        isSupportedSiteLanguage(entry.language)
    )
    .map((entry) => ({
      params: {
        lang: entry.language,
        slug: entry.slug,
      },
    }))
}

function getDefaultCategoryStaticPaths() {
  return countToolsByCategory(toolSearchIndex).map(({ category }) => ({
    params: { category },
  }))
}

function getNonDefaultCategoryStaticPaths() {
  return getNonDefaultSiteStaticPaths().flatMap(({ params }) =>
    getDefaultCategoryStaticPaths().map(({ params: { category } }) => ({
      params: { ...params, category },
    }))
  )
}

export {
  getDefaultCategoryStaticPaths,
  getDefaultToolStaticPaths,
  getNonDefaultCategoryStaticPaths,
  getNonDefaultSiteStaticPaths,
  getNonDefaultToolStaticPaths,
}
