import {
  createLanguageOptions,
  createPrimaryNavigation,
  localizePath,
} from "./site"

import type { SiteMessageCatalog } from "./site-messages"
import type { SiteLanguage } from "./site"

type SiteChromeSection = "home" | "tools"

function createSiteChromeData(
  pathname: string,
  language: SiteLanguage,
  catalog: SiteMessageCatalog,
  current: SiteChromeSection,
  availableLanguages?: readonly SiteLanguage[]
) {
  return {
    brandHref: localizePath("/", language),
    brandName: catalog.site.name,
    brandTagline: catalog.site.tagline,
    currentStatus: catalog.site.currentStatus,
    footerNote: catalog.site.footerNote,
    footerStatusLabel: catalog.site.footerStatusLabel,
    languageLabel: catalog.site.languageLabel,
    languageOptions: createLanguageOptions(
      pathname,
      language,
      catalog.site.languages,
      availableLanguages
    ),
    navigation: createPrimaryNavigation(
      language,
      catalog.site.navigation,
      current
    ),
  }
}

export { createSiteChromeData }
export type { SiteChromeSection }
