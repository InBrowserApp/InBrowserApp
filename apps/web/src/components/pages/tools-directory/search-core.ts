import { resolveEntryLocale } from "@/lib/tool-directory"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"

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

type ToolSearchSuggestion = Readonly<{
  entry: SearchSuggestionEntry
  pre: string
  match: string
  post: string
}>

/** Suggestion rows shown in the search dropdown (per design spec). */
const SUGGESTION_LIMIT = 8

function getSuggestionScore(loweredName: string, normalizedQuery: string) {
  const index = loweredName.indexOf(normalizedQuery)

  if (index === 0) {
    return 100
  }

  if (index > 0) {
    return 50
  }

  const tokens = normalizedQuery.split(" ")

  return tokens.every((token) => loweredName.includes(token)) ? 10 : -1
}

function splitSuggestionName(name: string, normalizedQuery: string) {
  const loweredName = name.toLowerCase()
  let index = loweredName.indexOf(normalizedQuery)
  let length = normalizedQuery.length

  if (index < 0) {
    const firstToken = normalizedQuery.split(" ")[0] ?? ""

    index = firstToken ? loweredName.indexOf(firstToken) : -1
    length = firstToken.length
  }

  if (index < 0) {
    return { match: "", post: "", pre: name }
  }

  return {
    match: name.slice(index, index + length),
    post: name.slice(index + length),
    pre: name.slice(0, index),
  }
}

/**
 * Name-only dropdown suggestions: name prefix > name contains > all
 * tokens included, ties alphabetical, capped at SUGGESTION_LIMIT.
 */
function buildSearchSuggestions(
  entries: readonly SearchSuggestionEntry[],
  query: string,
  language: SiteLanguage
): readonly ToolSearchSuggestion[] {
  const normalizedQuery = normalizeQuery(query).toLowerCase()

  if (!normalizedQuery) {
    return []
  }

  return entries
    .map((entry) => ({
      entry,
      score: getSuggestionScore(entry.name.toLowerCase(), normalizedQuery),
    }))
    .filter(({ score }) => score >= 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.entry.name.localeCompare(right.entry.name, language)
    )
    .slice(0, SUGGESTION_LIMIT)
    .map(({ entry }) => ({
      entry,
      ...splitSuggestionName(entry.name, normalizedQuery),
    }))
}

export {
  buildSearchSuggestions,
  normalizeQuery,
  rankToolEntries,
  readDirectoryStateFromLocation,
}
export type { ToolSearchSuggestion }
