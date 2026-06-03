import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { ToolIcon } from "@workspace/ui/components/tool/tool-icon"
import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"
import { LayoutGrid, Search } from "@workspace/ui/icons"
import { localizePath } from "@/lib/site"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"

type ToolsDirectorySearchMessages = Readonly<{
  searchLabel: string
  searchPlaceholder: string
  resultCountSuffix: string
  clearSearchLabel: string
  emptyRegistryTitle: string
  emptyRegistryDescription: string
  emptySearchTitle: string
  emptySearchDescription: string
}>

type ToolsDirectorySearchProps = Readonly<{
  entries: readonly ToolSearchIndexEntry[]
  language: SiteLanguage
  messages: ToolsDirectorySearchMessages
}>

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ")
}

function readQueryFromLocation() {
  if (typeof window === "undefined") {
    return ""
  }

  return normalizeQuery(
    new URL(window.location.href).searchParams.get("query") ?? ""
  )
}

function resolveLocale(entry: ToolSearchIndexEntry, language: SiteLanguage) {
  return (
    entry.locales[language] ??
    entry.locales.en ??
    Object.values(entry.locales)[0] ?? {
      description: "",
      name: entry.slug,
    }
  )
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

  const locale = resolveLocale(entry, language)
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

function ToolsDirectorySearch({
  entries,
  language,
  messages,
}: ToolsDirectorySearchProps) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const composingRef = useRef(false)
  const syncQueryToUrl = useEffectEvent((nextQuery: string) => {
    if (typeof window === "undefined") {
      return
    }

    const url = new URL(window.location.href)

    if (nextQuery) {
      url.searchParams.set("query", nextQuery)
    } else {
      url.searchParams.delete("query")
    }

    window.history.replaceState(window.history.state, "", url)
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
    const syncFromLocation = () => {
      const nextQuery = readQueryFromLocation()

      setQuery((currentQuery) =>
        currentQuery === nextQuery ? currentQuery : nextQuery
      )
    }

    syncFromLocation()
    window.addEventListener("popstate", syncFromLocation)

    return () => {
      window.removeEventListener("popstate", syncFromLocation)
    }
  }, [])

  useEffect(() => {
    syncQueryToUrl(normalizeQuery(deferredQuery))
  }, [deferredQuery])

  const normalizedQuery = normalizeQuery(deferredQuery)
  const rankedEntries = entries
    .map((entry) => ({
      entry,
      score: getSearchScore(entry, normalizedQuery, language),
    }))
    .filter(({ score }) => normalizedQuery === "" || score >= 0)
    .sort((left, right) => {
      if (normalizedQuery === "") {
        return resolveLocale(left.entry, language).name.localeCompare(
          resolveLocale(right.entry, language).name,
          language
        )
      }

      return right.score - left.score
    })
  const resultCount = new Intl.NumberFormat(language).format(
    rankedEntries.length
  )
  const isRegistryEmpty = entries.length === 0
  const isSearchEmpty = !isRegistryEmpty && rankedEntries.length === 0

  return (
    <div
      className="space-y-6"
      aria-busy={query !== deferredQuery}
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            aria-label={messages.searchLabel}
            className="h-11 pl-10 text-base md:text-sm"
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
            onClick={() => {
              setQuery("")
            }}
          >
            {messages.clearSearchLabel}
          </Button>
        ) : null}
      </div>

      {!isRegistryEmpty && !isSearchEmpty ? (
        <p className="text-sm text-muted-foreground">
          {resultCount} {messages.resultCountSuffix}
        </p>
      ) : null}

      {isRegistryEmpty ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center">
          <LayoutGrid className="mx-auto size-6 text-muted-foreground" />
          <h3 className="mt-3 font-medium">{messages.emptyRegistryTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.emptyRegistryDescription}
          </p>
        </div>
      ) : isSearchEmpty ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center">
          <Search className="mx-auto size-6 text-muted-foreground" />
          <h3 className="mt-3 font-medium">{messages.emptySearchTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.emptySearchDescription}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rankedEntries.map(({ entry }) => {
            const locale = resolveLocale(entry, language)

            return (
              <a
                key={entry.slug}
                href={localizePath(`/tools/${entry.slug}`, language)}
                className="group block"
              >
                <ToolSurface className="flex h-full flex-col gap-3 transition-colors group-hover:border-foreground/20">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <h3 className="flex items-center gap-2 font-heading text-lg leading-tight tracking-[var(--tracking-display)]">
                      <ToolIcon
                        icon={entry.icon}
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span className="min-w-0 truncate">{locale.name}</span>
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {locale.description}
                    </p>
                  </div>
                </ToolSurface>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { ToolsDirectorySearch }
