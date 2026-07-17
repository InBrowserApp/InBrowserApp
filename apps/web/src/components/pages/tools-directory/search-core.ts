import { resolveEntryLocale } from "@/lib/tool-directory"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"

type DirectoryLocationState = Readonly<{
  query: string
  category: string | null
}>

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ")
}

function readDirectoryStateFromLocation(
  validCategories: ReadonlySet<string>
): DirectoryLocationState {
  if (typeof window === "undefined") {
    return { category: null, query: "" }
  }

  const params = new URL(window.location.href).searchParams
  const category = params.get("category")

  return {
    category: category && validCategories.has(category) ? category : null,
    query: normalizeQuery(params.get("query") ?? ""),
  }
}

function getSearchScore(
  entry: ToolSearchIndexEntry,
  query: string,
  language: SiteLanguage
) {
  const normalizedQuery = normalizeQuery(query).toLowerCase()

  if (!normalizedQuery) {
    return 0
  }

  const locale = resolveEntryLocale(entry, language)
  const tokens = normalizedQuery.split(" ")
  const searchableText = [locale.name, locale.description]
    .join(" ")
    .toLowerCase()

  if (!tokens.every((token) => searchableText.includes(token))) {
    return -1
  }

  let score = 0
  const normalizedName = locale.name.toLowerCase()
  const normalizedDescription = locale.description.toLowerCase()

  if (normalizedName === normalizedQuery) {
    score += 120
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    score += 60
  }

  if (normalizedName.includes(normalizedQuery)) {
    score += 30
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    score += 15
  }
  return score
}

/**
 * Filters entries by category, scores them against the query, and sorts
 * alphabetically when the query is empty or by relevance otherwise.
 */
function rankToolEntries(
  entries: readonly ToolSearchIndexEntry[],
  normalizedQuery: string,
  category: string | null,
  language: SiteLanguage
) {
  return entries
    .filter((entry) => category === null || entry.category === category)
    .map((entry) => ({
      entry,
      score: getSearchScore(entry, normalizedQuery, language),
    }))
    .filter(({ score }) => normalizedQuery === "" || score >= 0)
    .sort((left, right) => {
      if (normalizedQuery === "") {
        return resolveEntryLocale(left.entry, language).name.localeCompare(
          resolveEntryLocale(right.entry, language).name,
          language
        )
      }

      return right.score - left.score
    })
    .map(({ entry }) => entry)
}

export { normalizeQuery, rankToolEntries, readDirectoryStateFromLocation }
