import {
  Faker,
  ar,
  base,
  de,
  en,
  fr,
  he,
  it,
  ja,
  ko,
  nl,
  pl,
  pt_BR,
  ru,
  tr,
  vi,
} from "@faker-js/faker"

const LOREM_IPSUM_MIN_COUNT = 1
const LOREM_IPSUM_MAX_COUNT = 100
const DEFAULT_LOREM_IPSUM_MODE = "paragraphs"
const DEFAULT_LOREM_IPSUM_LOCALE = "en"

const LOREM_IPSUM_MODES = ["words", "sentences", "paragraphs"] as const

const LOREM_IPSUM_FAKER_LOCALES = {
  en,
  ja,
  ko,
  it,
  de,
  fr,
  ru,
  pt_BR,
  ar,
  tr,
  nl,
  pl,
  vi,
  he,
} as const

type LoremIpsumMode = (typeof LOREM_IPSUM_MODES)[number]
type LoremIpsumLocale = keyof typeof LOREM_IPSUM_FAKER_LOCALES

const LOREM_IPSUM_LOCALE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "ru", label: "Русский" },
  { value: "pt_BR", label: "Português (Brasil)" },
  { value: "ar", label: "العربية" },
  { value: "tr", label: "Türkçe" },
  { value: "nl", label: "Nederlands" },
  { value: "pl", label: "Polski" },
  { value: "vi", label: "Tiếng Việt" },
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
