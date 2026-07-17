import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Search } from "@workspace/ui/icons"
import { countToolsByCategory } from "@/lib/tool-directory"
import { CategoryChips, CategorySidebar } from "./category-nav"
import {
  normalizeQuery,
  rankToolEntries,
  readDirectoryStateFromLocation,
} from "./search-core"
import { DirectoryEmptyState, ToolList } from "./tool-list"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"

type ToolsDirectorySearchMessages = Readonly<{
  searchLabel: string
  searchPlaceholder: string
  resultCountSuffix: string
  clearSearchLabel: string
  categoriesLabel: string
  categoryAll: string
  sortLabel: string
  emptyRegistryTitle: string
  emptyRegistryDescription: string
  emptySearchTitle: string
  emptySearchDescription: string
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
  const inputRef = useRef<HTMLInputElement>(null)
  const composingRef = useRef(false)

  const categoryCounts = useMemo(() => countToolsByCategory(entries), [entries])
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

  /**
   * Keep the uncontrolled input in sync with React state for
   * programmatic updates (clear button, popstate, etc.) but only
   * when the user is NOT mid-IME-composition.
   */
  useEffect(() => {
    if (inputRef.current && !composingRef.current) {
      inputRef.current.value = query
    }
  }, [query])

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

  /** ⌘K / Ctrl+K focuses the directory search input. */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return
      }

      event.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

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
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              aria-label={messages.searchLabel}
              className="h-10 ps-9.5 text-base md:text-sm"
              placeholder={messages.searchPlaceholder}
              defaultValue={query}
              onCompositionStart={() => {
                composingRef.current = true
              }}
              onCompositionEnd={(event) => {
                composingRef.current = false
                setQuery(event.currentTarget.value)
              }}
              onChange={(event) => {
                if (composingRef.current) {
                  return
                }

                setQuery(event.currentTarget.value)
              }}
            />
          </div>

          {query ? (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => {
                setQuery("")
              }}
            >
              {messages.clearSearchLabel}
            </Button>
          ) : (
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
