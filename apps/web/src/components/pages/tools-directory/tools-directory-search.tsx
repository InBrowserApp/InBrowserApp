import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react"

import { countToolsByCategory, toSuggestionEntries } from "@/lib/tool-directory"
import { CategoryChips, CategorySidebar } from "./category-nav"
import { normalizeQuery, readDirectoryStateFromLocation } from "./search-core"
import { rankToolEntries } from "./search-core"
import { SearchCombobox } from "./search-combobox"
import { DirectoryEmptyState, ToolList } from "./tool-list"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"
import type { SearchComboboxMessages } from "./search-combobox"

type ToolsDirectorySearchMessages = SearchComboboxMessages &
  Readonly<{
    resultCountSuffix: string
    categoriesLabel: string
    categoryAll: string
    sortLabel: string
    emptyRegistryTitle: string
    emptyRegistryDescription: string
    categoryLabels: Readonly<Record<string, string>>
  }>

type ToolsDirectorySearchProps = Readonly<{
  entries: readonly ToolSearchIndexEntry[]
  language: SiteLanguage
  messages: ToolsDirectorySearchMessages
}>

function ToolsDirectorySearch({
  entries,
  language,
  messages,
}: ToolsDirectorySearchProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)

  const categoryCounts = useMemo(() => countToolsByCategory(entries), [entries])
  const suggestionEntries = useMemo(
    () => toSuggestionEntries(entries, language),
    [entries, language]
  )
  const validCategories = useMemo(
    () => new Set(categoryCounts.map(({ category: value }) => value)),
    [categoryCounts]
  )
  const formatCount = useMemo(() => {
    const numberFormat = new Intl.NumberFormat(language)

    return (count: number) => numberFormat.format(count)
  }, [language])

  const syncStateToUrl = useEffectEvent(
    (nextQuery: string, nextCategory: string | null) => {
      if (typeof window === "undefined") {
        return
      }

      const url = new URL(window.location.href)

      if (nextQuery) {
        url.searchParams.set("query", nextQuery)
      } else {
        url.searchParams.delete("query")
      }

      if (nextCategory) {
        url.searchParams.set("category", nextCategory)
      } else {
        url.searchParams.delete("category")
      }

      window.history.replaceState(window.history.state, "", url)
    }
  )
  const syncStateFromLocation = useEffectEvent(() => {
    const next = readDirectoryStateFromLocation(validCategories)

    setQuery((currentQuery) =>
      currentQuery === next.query ? currentQuery : next.query
    )
    setCategory((currentCategory) =>
      currentCategory === next.category ? currentCategory : next.category
    )
  })

  useEffect(() => {
    syncStateFromLocation()

    const handlePopState = () => {
      syncStateFromLocation()
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  useEffect(() => {
    syncStateToUrl(normalizeQuery(deferredQuery), category)
  }, [deferredQuery, category])

  const normalizedQuery = normalizeQuery(deferredQuery)
  const rankedEntries = rankToolEntries(
    entries,
    normalizedQuery,
    category,
    language
  )
  const isRegistryEmpty = entries.length === 0
  const isSearchEmpty = !isRegistryEmpty && rankedEntries.length === 0
  const categoryNavProps = {
    allLabel: messages.categoryAll,
    categoriesLabel: messages.categoriesLabel,
    counts: categoryCounts,
    formatCount,
    labels: messages.categoryLabels,
    onSelect: setCategory,
    selected: category,
    totalCount: entries.length,
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <CategorySidebar {...categoryNavProps} />

      <div
        className="flex min-w-0 flex-col gap-4"
        aria-busy={query !== deferredQuery}
        aria-live="polite"
      >
        <CategoryChips {...categoryNavProps} />

        <div className="flex items-center gap-3">
          <SearchCombobox
            entries={suggestionEntries}
            language={language}
            query={query}
            onQueryChange={setQuery}
            categoryLabels={messages.categoryLabels}
            messages={messages}
          />

          {query ? null : (
            <span
              aria-hidden="true"
              className="shrink-0 text-[13px] text-muted-foreground"
            >
              {messages.sortLabel}
            </span>
          )}
        </div>

        {normalizedQuery !== "" && !isRegistryEmpty && !isSearchEmpty ? (
          <p className="text-sm text-muted-foreground">
            {formatCount(rankedEntries.length)} {messages.resultCountSuffix}
          </p>
        ) : null}

        {isRegistryEmpty ? (
          <DirectoryEmptyState
            icon="registry"
            title={messages.emptyRegistryTitle}
            description={messages.emptyRegistryDescription}
          />
        ) : isSearchEmpty ? (
          <DirectoryEmptyState
            icon="search"
            title={messages.emptySearchTitle}
            description={messages.emptySearchDescription}
          />
        ) : (
          <ToolList
            entries={rankedEntries}
            language={language}
            categoryLabels={messages.categoryLabels}
          />
        )}
      </div>
    </div>
  )
}

export { ToolsDirectorySearch }
