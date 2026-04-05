import { DEFAULT_SITE_LANGUAGE, resolveLocalizedAssetLanguage } from "./site"

import type { SiteLanguage } from "./site"
import type { AstroComponentFactory } from "astro/runtime/server/index.js"

type SitePageId = "home" | "tools"
type LocalizedContentModule = {
  default: AstroComponentFactory
}

const siteContentModules = import.meta.glob("../content/site/**/*.mdx")

function getSiteContentModuleKey(pageId: SitePageId, language: string) {
  return `../content/site/${pageId}/${language}.mdx`
}

async function loadSitePageContent(pageId: SitePageId, language: SiteLanguage) {
  const pagePrefix = `../content/site/${pageId}/`
  const availableLanguages = Object.keys(siteContentModules)
    .filter((key) => key.startsWith(pagePrefix))
    .map((key) => key.replace(pagePrefix, "").replace(".mdx", ""))
  const resolvedLanguage = resolveLocalizedAssetLanguage(
    language,
    availableLanguages,
    DEFAULT_SITE_LANGUAGE
  )
  const requestedModule =
    siteContentModules[getSiteContentModuleKey(pageId, resolvedLanguage)]

  if (!requestedModule) {
    return {
      Content: null as AstroComponentFactory | null,
      language: resolvedLanguage,
    }
  }

  const loadedModule = (await requestedModule()) as LocalizedContentModule

  return {
    Content: loadedModule.default,
    language: resolvedLanguage,
  }
}

export { loadSitePageContent }
export type { SitePageId }
