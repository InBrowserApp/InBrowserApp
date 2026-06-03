/**
 * Native (autonym) names for every language the UI may reference.
 *
 * This is the single source of truth for autonyms — both the language
 * switcher and the language-suggestion banner read from here, so the
 * names are never duplicated across message catalogs.
 */
const LANGUAGE_NATIVE_NAMES: Readonly<Record<string, string>> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "zh-HK": "繁體中文（香港）",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
  pt: "Português",
  ar: "العربية",
  hi: "हिन्दी",
  tr: "Türkçe",
  nl: "Nederlands",
  sv: "Svenska",
  pl: "Polski",
  vi: "Tiếng Việt",
  th: "ไทย",
  id: "Bahasa Indonesia",
  he: "עברית",
  ms: "Bahasa Melayu",
  no: "Norsk",
  fa: "فارسی",
  ur: "اردو",
}

function getLanguageNativeName(code: string): string {
  return LANGUAGE_NATIVE_NAMES[code] ?? code
}

export { LANGUAGE_NATIVE_NAMES, getLanguageNativeName }
