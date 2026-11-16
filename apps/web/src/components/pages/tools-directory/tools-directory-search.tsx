import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"

import {
  readDirectoryRows,
  scrollActiveCategory,
  updateDirectoryRows,
} from "./directory-dom"
import {
  normalizeQuery,
  readDirectoryQueryFromLocation,
  rankToolEntries,
} from "./search-core"
import { SearchCombobox } from "./search-combobox"

import type { SiteLanguage } from "@/lib/site"
import type { SearchComboboxMessages } from "./search-combobox"

type ToolsDirectorySearchProps = Readonly<{
  language: SiteLanguage
  messages: SearchComboboxMessages &
    Readonly<{
      resultCountSuffix: string
      emptyRegistryTitle: string
      categoryLabels: Readonly<Record<string, string>>
    }>
}>

function ToolsDirectorySearch({
  language,
  messages,
}: ToolsDirectorySearchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<ReturnType<typeof readDirectoryRows> | null>(
    null
  )
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = normalizeQuery(deferredQuery)
  const rankedRows = useMemo(
    () => rankToolEntries(rows ?? [], normalizedQuery, language),
    [rows, normalizedQuery, language]
  )

  useEffect(() => {
    const root = containerRef.current!.closest<HTMLElement>(
      "[data-tools-directory]"
    )!
    setRows(readDirectoryRows(root))
    scrollActiveCategory(root)

    const syncQueryFromLocation = () => {
      setQuery(readDirectoryQueryFromLocation())
    }
    syncQueryFromLocation()
    window.addEventListener("popstate", syncQueryFromLocation)
    return () => window.removeEventListener("popstate", syncQueryFromLocation)
  }, [])

  useEffect(() => {
    // The first render has not read the static list yet.
    if (rows === null) return
    const root = containerRef.current!.closest<HTMLElement>(
      "[data-tools-directory]"
    )!
    updateDirectoryRows(root, rows, rankedRows)
  }, [rows, rankedRows])

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

  const count = new Intl.NumberFormat(language).format(rankedRows.length)
  const isEmpty = rankedRows.length === 0

  return (
    <div ref={containerRef} className="flex min-w-0 flex-col gap-4">
      <SearchCombobox
        entries={rows ?? []}
        language={language}
        query={query}
        onQueryChange={handleQueryChange}
        categoryLabels={messages.categoryLabels}
        messages={messages}
      />
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-busy={query !== deferredQuery}
        className={
          normalizedQuery !== "" && !isEmpty
            ? "text-sm text-muted-foreground"
            : "sr-only"
        }
      >
        {rows === null
          ? ""
          : rows.length === 0
            ? messages.emptyRegistryTitle
            : rankedRows.length === 0
              ? messages.emptySearchTitle
              : `${count} ${messages.resultCountSuffix}`}
      </p>
    </div>
  )
}

export { ToolsDirectorySearch }
