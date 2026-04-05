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
    eyebrow: string
    title: string
    description: string
    statusTitle: string
    statusDescription: string
    registryTitle: string
    registryDescription: string
    contentTitle: string
    contentDescription: string
    contentHeading: string
  }>
  tools: Readonly<{
    eyebrow: string
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
    metricsTitle: string
    contentHeading: string
    registryCountLabel: string
    searchIndexLabel: string
    languageCountLabel: string
    loadingModelDescription: string
  }>
  tool: Readonly<{
    eyebrow: string
    detailsTitle: string
    contentTitle: string
    categoryLabel: string
    groupLabel: string
    tagsLabel: string
    featuresLabel: string
    messageLanguageLabel: string
    contentLanguageLabel: string
    clientStatusLabel: string
    clientMissing: string
    contentMissing: string
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
