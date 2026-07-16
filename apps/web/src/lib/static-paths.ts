import { toolSearchIndex, toolStaticPaths } from "@workspace/tool-registry"

import { getPageCount } from "./tools-directory"
import {
  DEFAULT_SITE_LANGUAGE,
  createNonDefaultLanguageStaticPaths,
  isSupportedSiteLanguage,
} from "./site"

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

function getToolsDirectoryPageNumbers() {
  const pageCount = getPageCount(toolSearchIndex.length)

  return Array.from({ length: pageCount - 1 }, (_, index) => index + 2)
}

function getDefaultToolsDirectoryStaticPaths() {
  return getToolsDirectoryPageNumbers().map((pageNumber) => ({
    params: { page: String(pageNumber) },
    props: { pageNumber },
  }))
}

function getNonDefaultToolsDirectoryStaticPaths() {
  return createNonDefaultLanguageStaticPaths().flatMap(({ params, props }) =>
    getToolsDirectoryPageNumbers().map((pageNumber) => ({
      params: {
        lang: params.lang,
        page: String(pageNumber),
      },
      props: {
        language: props.language,
        pageNumber,
      },
    }))
  )
}

export {
  getDefaultToolStaticPaths,
  getDefaultToolsDirectoryStaticPaths,
  getNonDefaultSiteStaticPaths,
  getNonDefaultToolStaticPaths,
  getNonDefaultToolsDirectoryStaticPaths,
}
