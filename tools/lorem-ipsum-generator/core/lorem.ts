import {
  Faker,
  ar,
  base,
  de,
  en,
  es,
  fr,
  he,
  id_ID,
  it,
  ja,
  ko,
  nl,
  pl,
  pt_BR,
  ru,
  sv,
  th,
  tr,
  vi,
  zh_CN,
  zh_TW,
} from "@faker-js/faker"

const LOREM_IPSUM_MIN_COUNT = 1
const LOREM_IPSUM_MAX_COUNT = 100
const DEFAULT_LOREM_IPSUM_MODE = "paragraphs"
const DEFAULT_LOREM_IPSUM_LOCALE = "en"

const LOREM_IPSUM_MODES = ["words", "sentences", "paragraphs"] as const

const LOREM_IPSUM_FAKER_LOCALES = {
  en,
  zh_CN,
  zh_TW,
  ja,
  ko,
  it,
  de,
  fr,
  es,
  ru,
  pt_BR,
  ar,
  tr,
  nl,
  sv,
  pl,
  vi,
  th,
  id_ID,
  he,
} as const

type LoremIpsumMode = (typeof LOREM_IPSUM_MODES)[number]
type LoremIpsumLocale = keyof typeof LOREM_IPSUM_FAKER_LOCALES

const LOREM_IPSUM_LOCALE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "zh_CN", label: "简体中文" },
  { value: "zh_TW", label: "繁體中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "ru", label: "Русский" },
  { value: "pt_BR", label: "Português (Brasil)" },
  { value: "ar", label: "العربية" },
  { value: "tr", label: "Türkçe" },
  { value: "nl", label: "Nederlands" },
  { value: "sv", label: "Svenska" },
  { value: "pl", label: "Polski" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "th", label: "ไทย" },
  { value: "id_ID", label: "Bahasa Indonesia" },
  { value: "he", label: "עברית" },
] as const satisfies readonly {
  value: LoremIpsumLocale
  label: string
}[]

type GenerateLoremIpsumOptions = Readonly<{
  mode: LoremIpsumMode | string
  count: number | null | undefined
  locale: string
  seed: number
}>

function normalizeLoremCount(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return LOREM_IPSUM_MIN_COUNT
  }

  return Math.min(
    Math.max(Math.floor(value), LOREM_IPSUM_MIN_COUNT),
    LOREM_IPSUM_MAX_COUNT
  )
}

function normalizeLoremIpsumMode(value: string): LoremIpsumMode {
  return LOREM_IPSUM_MODES.includes(value as LoremIpsumMode)
    ? (value as LoremIpsumMode)
    : DEFAULT_LOREM_IPSUM_MODE
}

function resolveLoremIpsumLocale(value: string): LoremIpsumLocale {
  return Object.hasOwn(LOREM_IPSUM_FAKER_LOCALES, value)
    ? (value as LoremIpsumLocale)
    : DEFAULT_LOREM_IPSUM_LOCALE
}

function generateLoremIpsum({
  mode,
  count,
  locale,
  seed,
}: GenerateLoremIpsumOptions) {
  const resolvedMode = normalizeLoremIpsumMode(mode)
  const resolvedCount = normalizeLoremCount(count)
  const resolvedLocale = resolveLoremIpsumLocale(locale)

  const faker = new Faker({
    locale: [LOREM_IPSUM_FAKER_LOCALES[resolvedLocale], base, en],
  })

  faker.seed(seed)

  if (resolvedMode === "words") {
    return faker.lorem.words(resolvedCount)
  }

  if (resolvedMode === "sentences") {
    return faker.lorem.sentences(resolvedCount)
  }

  return faker.lorem.paragraphs(resolvedCount, "\n\n")
}

export {
  DEFAULT_LOREM_IPSUM_LOCALE,
  DEFAULT_LOREM_IPSUM_MODE,
  LOREM_IPSUM_LOCALE_OPTIONS,
  LOREM_IPSUM_MAX_COUNT,
  LOREM_IPSUM_MIN_COUNT,
  generateLoremIpsum,
  normalizeLoremCount,
  normalizeLoremIpsumMode,
  resolveLoremIpsumLocale,
}
export type { LoremIpsumLocale, LoremIpsumMode }
