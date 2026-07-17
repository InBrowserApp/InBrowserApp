import { DEFAULT_SITE_LANGUAGE, resolveLocalizedAssetLanguage } from "./site"

import type { SiteLanguage } from "./site"

type SiteMessageCatalog = Readonly<{
  site: Readonly<{
    name: string
    description: string
    languageLabel: string
    themeLabel: string
    themeLight: string
    themeDark: string
    themeSystem: string
    footerTagline: string
    footerGitHub: string
    navigation: Readonly<{
      home: string
      tools: string
    }>
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
    eyebrow: string
    primaryAction: string
    popularLabel: string
    featureNoUploadsTitle: string
    featureNoUploadsDescription: string
    featureNoServersTitle: string
    featureNoServersDescription: string
    featureOfflineTitle: string
    featureOfflineDescription: string
    categoriesTitle: string
    categoriesAction: string
    popularToolsTitle: string
    popularToolsAction: string
  }>
  tools: Readonly<{
    title: string
    searchLabel: string
    searchPlaceholder: string
    resultCountSuffix: string
    clearSearchLabel: string
    categoriesLabel: string
    categoryAll: string
    sortLabel: string
    emptyRegistryTitle: string
    emptyRegistryDescription: string
    emptySearchTitle: string
    emptySearchDescription: string
    categories: Readonly<Record<string, string>>
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

/**
 * Replaces `{placeholder}` tokens in a site message template with the
 * provided values. Unknown placeholders are left untouched.
 */
function formatSiteMessage(
  template: string,
  values: Readonly<Record<string, string | number>>
) {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token
  )
}

export { formatSiteMessage, loadSiteMessages }
