import type { ToolSearchIndexEntry } from "./types"

function getAlternateSearchLocale(language: string) {
  if (language === "zh-CN") return "zh-TW"
  return language === "zh-TW" ? "zh-CN" : undefined
}

function getAlternateSearchName(
  entry: ToolSearchIndexEntry,
  language: string,
  name: string
) {
  const alternateLocale = getAlternateSearchLocale(language)
  const alternateName = alternateLocale && entry.locales[alternateLocale]?.name

  return alternateName === name ? undefined : alternateName
}

export { getAlternateSearchLocale, getAlternateSearchName }
