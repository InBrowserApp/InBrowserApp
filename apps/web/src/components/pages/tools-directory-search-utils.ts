import type { MouseEvent } from "react"
import type { SiteLanguage } from "@/lib/site"
import type { ToolDirectoryEntry } from "@/lib/tools-directory"

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ")
}

function readLocationState(fallbackPage: number) {
  if (typeof window === "undefined") {
    return { pageNumber: fallbackPage, query: "" }
  }

  const url = new URL(window.location.href)
  const query = normalizeQuery(url.searchParams.get("query") ?? "")
  const requestedPage = Number(url.searchParams.get("page"))

  return {
    pageNumber:
      query && Number.isInteger(requestedPage) && requestedPage > 1
        ? requestedPage
        : query
          ? 1
          : fallbackPage,
    query,
  }
}

function rankEntries(
  entries: readonly ToolDirectoryEntry[],
  query: string,
  language: SiteLanguage
) {
  if (!query) {
    return entries
  }

  const normalizedQuery = query.toLocaleLowerCase(language)
  const tokens = normalizedQuery.split(" ")

  return entries
    .map((entry) => {
      const name = entry.name.toLocaleLowerCase(language)
      const description = entry.description.toLocaleLowerCase(language)
      const searchableText = `${name} ${description}`

      if (!tokens.every((token) => searchableText.includes(token))) {
        return { entry, score: -1 }
      }

      const score =
        (name === normalizedQuery ? 120 : 0) +
        (name.startsWith(normalizedQuery) ? 60 : 0) +
        (name.includes(normalizedQuery) ? 30 : 0) +
        (description.includes(normalizedQuery) ? 15 : 0)

      return { entry, score }
    })
    .filter(({ score }) => score >= 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.entry.name.localeCompare(right.entry.name, language)
    )
    .map(({ entry }) => entry)
}

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  )
}

export { isPlainLeftClick, normalizeQuery, rankEntries, readLocationState }
