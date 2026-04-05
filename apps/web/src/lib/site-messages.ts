import { DEFAULT_SITE_LANGUAGE, resolveLocalizedAssetLanguage } from "./site"

import type { SiteLanguage } from "./site"

type SiteMessageCatalog = Readonly<{
  site: Readonly<{
    name: string
    description: string
    languageLabel: string
    tagline: string
    currentStatus: string
    footerNote: string
    footerStatusLabel: string
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
    primaryAction: string
    secondaryAction: string
    toolCountLabel: string
    toolCountDetail: string
    searchCountLabel: string
    searchCountDetail: string
    languageCountLabel: string
    languageCountDetail: string
    principlesEyebrow: string
    principlesTitle: string
    principlesDescription: string
    registryTitle: string
    registryDescription: string
    localeTitle: string
    localeDescription: string
    shellTitle: string
    shellDescription: string
    contentEyebrow: string
    contentTitle: string
    contentDescription: string
    sidebarTitle: string
    sidebarDescription: string
  }>
  tools: Readonly<{
    eyebrow: string
    title: string
    description: string
    searchLabel: string
    searchPlaceholder: string
    searchHint: string
    registryCountLabel: string
    searchIndexLabel: string
    languageCountLabel: string
    resultsTitle: string
    resultsDescription: string
    resultCountSuffix: string
    clearSearchLabel: string
    cardMetaLabel: string
    emptyRegistryTitle: string
    emptyRegistryDescription: string
    emptySearchTitle: string
    emptySearchDescription: string
    openToolLabel: string
    contentEyebrow: string
    contentTitle: string
    contentDescription: string
    sidebarTitle: string
    sidebarDescription: string
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
