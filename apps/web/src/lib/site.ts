const SITE_URL = "https://inbrowser.app"
const DEFAULT_SITE_LANGUAGE = "en"
const SUPPORTED_SITE_LANGUAGES = [
  "en",
  "zh-CN",
  "zh-TW",
  "es",
  "fr",
  "de",
  "it",
  "ja",
  "ko",
  "ru",
  "pt",
  "ar",
  "hi",
  "tr",
  "nl",
  "sv",
  "pl",
  "vi",
  "th",
  "id",
  "he",
  "ms",
  "no",
] as const
const NON_DEFAULT_SITE_LANGUAGES = SUPPORTED_SITE_LANGUAGES.filter(
  (language) => language !== DEFAULT_SITE_LANGUAGE
) as readonly Exclude<(typeof SUPPORTED_SITE_LANGUAGES)[number], "en">[]
const RTL_SITE_LANGUAGES = ["ar", "he"] as const

function getSiteLanguageDirection(language: string): "ltr" | "rtl" {
  return (RTL_SITE_LANGUAGES as readonly string[]).includes(language)
    ? "rtl"
    : "ltr"
}

type SiteLanguage = (typeof SUPPORTED_SITE_LANGUAGES)[number]
type AlternateLink = Readonly<{
  hrefLang: string
  href: string
}>
type SiteLanguageOption = Readonly<{
  code: SiteLanguage
  href: string
  current: boolean
}>

function normalizePathname(pathname: string) {
  const normalized = pathname.trim().replace(/\/{2,}/g, "/")

  if (normalized === "" || normalized === "/") {
    return "/"
  }

  const withLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`

  return withLeadingSlash.replace(/\/$/, "")
}

function isSupportedSiteLanguage(language: string): language is SiteLanguage {
  return SUPPORTED_SITE_LANGUAGES.includes(language as SiteLanguage)
}

function isDefaultSiteLanguage(language: string) {
  return language === DEFAULT_SITE_LANGUAGE
}

function resolveSiteLanguage(language?: string) {
  return language && isSupportedSiteLanguage(language)
    ? language
    : DEFAULT_SITE_LANGUAGE
}

function resolveLocalizedAssetLanguage<TLanguage extends string>(
  requestedLanguage: string,
  availableLanguages: readonly TLanguage[],
  fallbackLanguage: TLanguage
) {
  if (availableLanguages.length === 0) {
    return fallbackLanguage
  }

  if (availableLanguages.includes(requestedLanguage as TLanguage)) {
    return requestedLanguage as TLanguage
  }

  if (availableLanguages.includes(fallbackLanguage)) {
    return fallbackLanguage
  }

  return availableLanguages[0]
}

function localizePath(pathname: string, language: SiteLanguage) {
  const normalized = normalizePathname(pathname)

  if (isDefaultSiteLanguage(language)) {
    return normalized
  }

  return normalized === "/" ? `/${language}` : `/${language}${normalized}`
}

function toAbsoluteUrl(pathname: string) {
  return new URL(normalizePathname(pathname), SITE_URL).toString()
}

function getCanonicalUrl(pathname: string, language: SiteLanguage) {
  return toAbsoluteUrl(localizePath(pathname, language))
}

function getAlternateLinks(
  pathname: string,
  languages: readonly SiteLanguage[] = SUPPORTED_SITE_LANGUAGES
) {
  const links = languages.map((language) => ({
    href: getCanonicalUrl(pathname, language),
    hrefLang: language,
  }))

  return [
    ...links,
    {
      href: getCanonicalUrl(pathname, DEFAULT_SITE_LANGUAGE),
      hrefLang: "x-default",
    },
  ] as const satisfies readonly AlternateLink[]
}

function createNonDefaultLanguageStaticPaths() {
  return NON_DEFAULT_SITE_LANGUAGES.map((language) => ({
    params: { lang: language },
    props: { language },
  }))
}

function createLanguageOptions(
  pathname: string,
  language: SiteLanguage,
  languages: readonly SiteLanguage[] = SUPPORTED_SITE_LANGUAGES
) {
  return languages.map((optionLanguage) => ({
    code: optionLanguage,
    current: optionLanguage === language,
    href: localizePath(pathname, optionLanguage),
  })) as readonly SiteLanguageOption[]
}

export {
  DEFAULT_SITE_LANGUAGE,
  SUPPORTED_SITE_LANGUAGES,
  createLanguageOptions,
  createNonDefaultLanguageStaticPaths,
  getAlternateLinks,
  getCanonicalUrl,
  getSiteLanguageDirection,
  isSupportedSiteLanguage,
  localizePath,
  resolveLocalizedAssetLanguage,
  resolveSiteLanguage,
}
export type { AlternateLink, SiteLanguage }
