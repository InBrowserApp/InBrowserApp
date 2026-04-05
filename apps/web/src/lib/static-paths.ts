import { toolStaticPaths } from "@workspace/tool-registry"

import { DEFAULT_SITE_LANGUAGE, isSupportedSiteLanguage } from "./site"
import { createNonDefaultLanguageStaticPaths } from "./site"

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

export {
  getDefaultToolStaticPaths,
  getNonDefaultSiteStaticPaths,
  getNonDefaultToolStaticPaths,
}
