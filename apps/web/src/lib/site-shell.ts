import { createLanguageOptions, createPrimaryNavigation } from "./site"

import type { SiteMessageCatalog } from "./site-messages"
import type { SiteLanguage } from "./site"

type SiteShellSection = "home" | "tools"

function createSiteToolbarData(
  pathname: string,
  language: SiteLanguage,
  catalog: SiteMessageCatalog,
  current: SiteShellSection,
  availableLanguages?: readonly SiteLanguage[]
) {
  return {
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

export { createSiteToolbarData }
export type { SiteShellSection }
