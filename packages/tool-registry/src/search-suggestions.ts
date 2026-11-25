import { loadToolSearchSuggestions as loadLocale } from "./generated/search-suggestions"
import { getAlternateSearchLocale } from "./search-name"

async function loadToolSearchSuggestions(language: string) {
  const primary = loadLocale(language)
  const alternateLocale = getAlternateSearchLocale(language)
  if (!alternateLocale) return primary

  // A failed optional index should still leave localized suggestions available.
  const [entries, alternateEntries] = await Promise.all([
    primary,
    loadLocale(alternateLocale).catch(() => []),
  ])
  const alternateNames = new Map(
    alternateEntries.map(({ slug, name }) => [slug, name])
  )

  return entries.map((entry) => {
    const alternateName = alternateNames.get(entry.slug)
    return alternateName && alternateName !== entry.name
      ? { ...entry, alternateName }
      : entry
  })
}

export { loadToolSearchSuggestions }
