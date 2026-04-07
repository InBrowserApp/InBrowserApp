import type { SiteLanguage } from "./site"
import type { AlternateLink } from "./site"

import {
  SUPPORTED_SITE_LANGUAGES,
  getAlternateLinks,
  getCanonicalUrl,
} from "./site"

type PageSeo = Readonly<{
  title: string
  description: string
  canonicalUrl: string
  alternateLinks: readonly AlternateLink[]
}>

function createPageSeo(options: {
  title: string
  description: string
  pathname: string
  language: SiteLanguage
  availableLanguages?: readonly SiteLanguage[]
}) {
  return {
    alternateLinks: getAlternateLinks(
      options.pathname,
      options.availableLanguages ?? SUPPORTED_SITE_LANGUAGES
    ),
    canonicalUrl: getCanonicalUrl(options.pathname, options.language),
    description: options.description,
    title: options.title,
  } as const satisfies PageSeo
}

export { createPageSeo }
