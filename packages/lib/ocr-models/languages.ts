import catalog from "./catalog.json"

type Language = keyof typeof catalog.models
type Model = Readonly<{ name: string; locale?: string }>
type LanguageOption = Readonly<{
  code: Language
  label: string
  search: string
}>

const models: Record<Language, Model> = catalog.models
const localeDefaults: Readonly<Partial<Record<string, Language>>> = {
  ar: "ara",
  de: "deu",
  en: "eng",
  es: "spa",
  fr: "fra",
  he: "heb",
  hi: "hin",
  id: "ind",
  it: "ita",
  ja: "jpn",
  ko: "kor",
  ms: "msa",
  nl: "nld",
  no: "nor",
  pl: "pol",
  pt: "por",
  ru: "rus",
  sv: "swe",
  th: "tha",
  tr: "tur",
  vi: "vie",
  "zh-CN": "chi_sim",
  "zh-TW": "chi_tra",
}

function defaultLanguage(lang: string) {
  return localeDefaults[lang] ?? "eng"
}

function isChinese(language: Language) {
  return language.startsWith("chi_")
}

function foldLanguageQuery(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim()
}

function languageOptions(
  lang: string,
  messages: { verticalLanguage: string; historicalLanguage: string }
): LanguageOption[] {
  const localized = new Intl.DisplayNames(lang, {
    type: "language",
    fallback: "none",
    languageDisplay: "standard",
  })
  const collator = new Intl.Collator(lang)
  return (Object.keys(models) as Language[])
    .map((code) => {
      const model = models[code]
      const tag = model.locale ?? code
      const name = localized.of(tag)
      const base = name ?? model.name
      const label =
        name && code.endsWith("_vert")
          ? messages.verticalLanguage.replace("{language}", name)
          : name && code.endsWith("_old")
            ? messages.historicalLanguage.replace("{language}", name)
            : base
      const native =
        new Intl.DisplayNames(tag, {
          type: "language",
          fallback: "none",
          languageDisplay: "standard",
        }).of(tag) ?? ""
      const alias = code === "deu_latf" ? "frk" : ""
      return {
        code,
        label,
        search: foldLanguageQuery(
          `${label} ${native} ${code} ${model.name} ${alias}`
        ),
      }
    })
    .sort((a, b) => collator.compare(a.label, b.label))
}

export { defaultLanguage, foldLanguageQuery, isChinese, languageOptions }
export type { Language }
