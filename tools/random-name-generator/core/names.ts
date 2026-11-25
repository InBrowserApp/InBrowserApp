const localeLoaders = {
  ar: () => import("@faker-js/faker/locale/ar"),
  de: () => import("@faker-js/faker/locale/de"),
  "en-GB": () => import("@faker-js/faker/locale/en_GB"),
  "en-IN": () => import("@faker-js/faker/locale/en_IN"),
  "en-US": () => import("@faker-js/faker/locale/en_US"),
  es: () => import("@faker-js/faker/locale/es"),
  "es-MX": () => import("@faker-js/faker/locale/es_MX"),
  fr: () => import("@faker-js/faker/locale/fr"),
  he: () => import("@faker-js/faker/locale/he"),
  id: () => import("@faker-js/faker/locale/id_ID"),
  it: () => import("@faker-js/faker/locale/it"),
  ja: () => import("@faker-js/faker/locale/ja"),
  ko: () => import("@faker-js/faker/locale/ko"),
  nb: () => import("@faker-js/faker/locale/nb_NO"),
  nl: () => import("@faker-js/faker/locale/nl"),
  pl: () => import("@faker-js/faker/locale/pl"),
  "pt-BR": () => import("@faker-js/faker/locale/pt_BR"),
  "pt-PT": () => import("@faker-js/faker/locale/pt_PT"),
  ru: () => import("@faker-js/faker/locale/ru"),
  sv: () => import("@faker-js/faker/locale/sv"),
  th: () => import("@faker-js/faker/locale/th"),
  tr: () => import("@faker-js/faker/locale/tr"),
  vi: () => import("@faker-js/faker/locale/vi"),
  "zh-Hans": () => import("@faker-js/faker/locale/zh_CN"),
  "zh-Hant": () => import("@faker-js/faker/locale/zh_TW"),
}

const nameMethods = {
  full: "fullName",
  given: "firstName",
  family: "lastName",
} as const

export type NameLocale = keyof typeof localeLoaders
export type NameType = keyof typeof nameMethods

const siteLocaleDefaults: Readonly<Partial<Record<string, NameLocale>>> = {
  hi: "en-IN",
  no: "nb",
  pt: "pt-PT",
  "zh-CN": "zh-Hans",
  "zh-TW": "zh-Hant",
}

export const NAME_LOCALES = Object.keys(localeLoaders) as NameLocale[]
export const NAME_TYPES = Object.keys(nameMethods) as NameType[]
export const MAX_NAMES = 1000

export function getDefaultNameLocale(lang: string): NameLocale {
  return (
    siteLocaleDefaults[lang] ??
    NAME_LOCALES.find((locale) => locale === lang) ??
    "en-US"
  )
}

export async function generateNames(
  locale: NameLocale,
  type: NameType,
  count: number
) {
  const { faker } = await localeLoaders[locale]()
  return Array.from({ length: count }, () => faker.person[nameMethods[type]]())
}
