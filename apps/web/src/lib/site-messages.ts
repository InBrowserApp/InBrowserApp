import { DEFAULT_SITE_LANGUAGE, resolveLocalizedAssetLanguage } from "./site"

import type { SiteLanguage } from "./site"

type SiteMessageCatalog = Readonly<{
  site: Readonly<{
    name: string
    description: string
    languageLabel: string
    navigation: Readonly<{
      home: string
      tools: string
    }>
    languages: Readonly<Record<string, string>>
  }>
  metadata: Readonly<{
    homeTitle: string
    homeDescription: string
    toolsTitle: string
    toolsDescription: string
    toolTitleSuffix: string
  }>
  home: Readonly<{
    title: string
    description: string
    primaryAction: string
  }>
  tools: Readonly<{
    title: string
    description: string
    searchLabel: string
    searchPlaceholder: string
    resultCountSuffix: string
    clearSearchLabel: string
    emptyRegistryTitle: string
    emptyRegistryDescription: string
    emptySearchTitle: string
    emptySearchDescription: string
    openToolLabel: string
  }>
}>

const siteMessageModules = import.meta.glob("../messages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, SiteMessageCatalog>

function getSiteMessageModuleKey(language: string) {
  return `../messages/${language}.json`
}

function loadSiteMessages(language: SiteLanguage) {
  const availableLanguages = Object.keys(siteMessageModules).map((key) =>
    key.replace("../messages/", "").replace(".json", "")
  )
  const resolvedLanguage = resolveLocalizedAssetLanguage(
    language,
    availableLanguages,
    DEFAULT_SITE_LANGUAGE
  )
  const catalog =
    siteMessageModules[getSiteMessageModuleKey(resolvedLanguage)] ??
    siteMessageModules[getSiteMessageModuleKey(DEFAULT_SITE_LANGUAGE)]

  if (!catalog) {
    throw new Error("Missing site message catalog for the default language.")
  }

  return {
    catalog,
    language: resolvedLanguage,
  }
}

export { loadSiteMessages }
export type { SiteMessageCatalog }
