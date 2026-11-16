import { useDeferredValue, useEffect, useMemo, useState } from "react"

import { CategoryChips, CategorySidebar } from "./category-nav"
import { normalizeQuery, readDirectoryQueryFromLocation } from "./search-core"
import { rankToolEntries } from "./search-core"
import { SearchCombobox } from "./search-combobox"
import { DirectoryEmptyState, ToolList } from "./tool-list"

import type {
  DirectoryToolEntry,
  ToolCategoryCount,
} from "@/lib/tool-directory"
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
  entries: readonly DirectoryToolEntry[]
  categoryCounts: readonly ToolCategoryCount[]
  category?: string
  language: SiteLanguage
  messages: ToolsDirectorySearchMessages
}>

function ToolsDirectorySearch({
  entries,
  categoryCounts,
  category,
  language,
  messages,
}: ToolsDirectorySearchProps) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)

  const formatCount = useMemo(() => {
    const numberFormat = new Intl.NumberFormat(language)

    return (count: number) => numberFormat.format(count)
  }, [language])

  useEffect(() => {
    const syncQueryFromLocation = () => {
      setQuery(readDirectoryQueryFromLocation())
    }

    syncQueryFromLocation()
    window.addEventListener("popstate", syncQueryFromLocation)

    return () => {
      window.removeEventListener("popstate", syncQueryFromLocation)
    }
  }, [])

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)

    const url = new URL(window.location.href)
    const normalized = normalizeQuery(nextQuery)

    if (normalized) {
      url.searchParams.set("query", normalized)
    } else {
      url.searchParams.delete("query")
    }

    window.history.replaceState(window.history.state, "", url)
  }

  const normalizedQuery = normalizeQuery(deferredQuery)
  const rankedEntries = rankToolEntries(entries, normalizedQuery, language)
  const isRegistryEmpty = entries.length === 0
  const isSearchEmpty = !isRegistryEmpty && rankedEntries.length === 0
  const categoryNavProps = {
    allLabel: messages.categoryAll,
    categoriesLabel: messages.categoriesLabel,
    counts: categoryCounts,
    formatCount,
    labels: messages.categoryLabels,
    language,
    selected: category ?? null,
    totalCount: categoryCounts.reduce((total, entry) => total + entry.count, 0),
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
            entries={entries}
            language={language}
            query={query}
            onQueryChange={handleQueryChange}
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
