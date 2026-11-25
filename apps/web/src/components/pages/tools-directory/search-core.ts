import {
  normalizeQuery,
  prepareSearchQuery,
  prepareSearchText,
  splitSuggestionName,
} from "./search-text"

import type { SiteLanguage } from "@/lib/site"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"
import type { SearchQuery, SearchText } from "./search-text"

function readDirectoryQueryFromLocation() {
  if (typeof window === "undefined") {
    return ""
  }

  const params = new URL(window.location.href).searchParams

  return normalizeQuery(params.get("query") ?? "")
}

enum SearchScore {
  None,
  Typo,
  DescriptionTerms,
  DescriptionPhrase,
  AliasTerms,
  AliasPhrase,
  NameTerms,
  NameOrderedTerms,
  NameContains,
  NamePrefix,
  AliasExact,
  NameFoldedExact,
  NameExact,
}

function getNameScore(name: SearchText, query: SearchQuery) {
  if (name.normalized === query.normalized) {
    return SearchScore.NameExact
  }

  if (name.compact === query.compact) {
    return SearchScore.NameFoldedExact
  }

  if (name.compact.startsWith(query.compact)) {
    return SearchScore.NamePrefix
  }

  if (name.compact.includes(query.compact)) {
    return SearchScore.NameContains
  }

  // Preserve direction for searches like "pdf image" versus "image pdf".
  let nextIndex = 0
  const orderedTerms = query.terms.every((term) => {
    const index = name.compact.indexOf(term, nextIndex)

    nextIndex = index + term.length
    return index >= 0
  })

  if (orderedTerms) {
    return SearchScore.NameOrderedTerms
  }

  return query.terms.every((term) => name.compact.includes(term))
    ? SearchScore.NameTerms
    : SearchScore.None
}

function isOneEditAway(term: string, word: string) {
  if (Math.abs(term.length - word.length) > 1) {
    return false
  }

  let index = 0
  while (index < term.length && term[index] === word[index]) {
    index++
  }

  if (term.length !== word.length) {
    const [shorter, longer] =
      term.length < word.length ? [term, word] : [word, term]
    return shorter.slice(index) === longer.slice(index + 1)
  }

  return (
    term.slice(index + 1) === word.slice(index + 1) ||
    (term[index] === word[index + 1] &&
      term[index + 1] === word[index] &&
      term.slice(index + 2) === word.slice(index + 2))
  )
}

function hasTypoMatch(
  names: readonly SearchText[],
  missingTerms: readonly string[]
) {
  const [term] = missingTerms

  // Limit typo correction to one longer alphabetic term. File formats and
  // identifiers with numbers should only match what the user typed.
  return (
    missingTerms.length === 1 &&
    term !== undefined &&
    /^[a-z]{5,}$/.test(term) &&
    names.some(({ folded }) =>
      folded
        .split(" ")
        .some((word) => /^[a-z]+$/.test(word) && isOneEditAway(term, word))
    )
  )
}

type SearchEntry = Pick<
  SearchSuggestionEntry,
  "name" | "slug" | "alternateName"
> & {
  description?: string
}

function indexEntry(
  { name, slug, alternateName, description }: SearchEntry,
  language: SiteLanguage
) {
  return {
    language,
    name: prepareSearchText(name, language),
    aliases: (alternateName ? [slug, alternateName] : [slug]).map((alias) =>
      prepareSearchText(alias, language)
    ),
    description: description
      ? prepareSearchText(description, language).folded
      : "",
  }
}

const indexedEntries = new WeakMap<SearchEntry, ReturnType<typeof indexEntry>>()

function getSearchScore(
  entry: SearchEntry,
  query: SearchQuery,
  language: SiteLanguage,
  searchDescription: boolean
) {
  let indexed = indexedEntries.get(entry)
  if (indexed?.language !== language) {
    indexed = indexEntry(entry, language)
    indexedEntries.set(entry, indexed)
  }
  const { name, aliases, description } = indexed

  const nameScore = getNameScore(name, query)
  if (nameScore >= SearchScore.NameFoldedExact) return nameScore

  const aliasScore = Math.max(
    ...aliases.map((alias) => getNameScore(alias, query))
  )
  if (aliasScore >= SearchScore.NameFoldedExact) return SearchScore.AliasExact
  if (nameScore > SearchScore.None) return nameScore
  if (aliasScore >= SearchScore.NameContains) return SearchScore.AliasPhrase

  const names = [name, ...aliases]
  const missingTerms = query.terms.filter(
    (term) => !names.some(({ compact }) => compact.includes(term))
  )
  if (missingTerms.length === 0) return SearchScore.AliasTerms

  if (searchDescription) {
    if (description.includes(query.folded)) return SearchScore.DescriptionPhrase
    if (missingTerms.every((term) => description.includes(term))) {
      return SearchScore.DescriptionTerms
    }
  }

  return hasTypoMatch(names, missingTerms) ? SearchScore.Typo : SearchScore.None
}

function findRankedMatches<Entry extends SearchEntry>(
  entries: readonly Entry[],
  query: SearchQuery,
  language: SiteLanguage,
  searchDescription: boolean
) {
  if (query.terms.length === 0) return []

  return entries
    .map((entry) => ({
      entry,
      score: getSearchScore(entry, query, language, searchDescription),
    }))
    .filter(({ score }) => score > SearchScore.None)
}

function rankToolEntries<Entry extends SearchEntry>(
  entries: readonly Entry[],
  query: string,
  language: SiteLanguage
) {
  const prepared = prepareSearchQuery(query, language)
  if (prepared.normalized === "") {
    const { compare } = new Intl.Collator(language)
    return [...entries].sort((left, right) => compare(left.name, right.name))
  }

  return findRankedMatches(entries, prepared, language, true)
    .sort((left, right) => right.score - left.score)
    .map(({ entry }) => entry)
}

type ToolSearchSuggestion = Readonly<{
  entry: SearchSuggestionEntry
  pre: string
  match: string
  post: string
}>

const SUGGESTION_LIMIT = 8

function buildSearchSuggestions(
  entries: readonly SearchSuggestionEntry[],
  query: string,
  language: SiteLanguage
): readonly ToolSearchSuggestion[] {
  const prepared = prepareSearchQuery(query, language)
  const { compare } = new Intl.Collator(language)

  return findRankedMatches(entries, prepared, language, false)
    .sort(
      (left, right) =>
        right.score - left.score || compare(left.entry.name, right.entry.name)
    )
    .slice(0, SUGGESTION_LIMIT)
    .map(({ entry }) => ({
      entry,
      ...splitSuggestionName(entry.name, prepared, language),
    }))
}

export {
  buildSearchSuggestions,
  normalizeQuery,
  rankToolEntries,
  readDirectoryQueryFromLocation,
}
export type { ToolSearchSuggestion }
