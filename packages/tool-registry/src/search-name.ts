import type { ToolSearchIndexEntry } from "./types"

function getAlternateSearchName(
  entry: ToolSearchIndexEntry,
  language: string,
  name: string
) {
  const alternateLocale =
    language === "zh-CN" ? "zh-TW" : language === "zh-TW" ? "zh-CN" : undefined
  const alternateName = alternateLocale && entry.locales[alternateLocale]?.name

  return alternateName === name ? undefined : alternateName
}

export { getAlternateSearchName }
