import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
} from "react"

import { SectionHeading } from "@workspace/ui/components/app/section-heading"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"
import { ArrowRight, LayoutGrid, Search } from "@workspace/ui/icons"
import { localizePath } from "@/lib/site"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"

type ToolsDirectorySearchMessages = Readonly<{
  searchLabel: string
  searchPlaceholder: string
  searchHint: string
  resultsTitle: string
  resultsDescription: string
  resultCountSuffix: string
  clearSearchLabel: string
  cardMetaLabel: string
  emptyRegistryTitle: string
  emptyRegistryDescription: string
  emptySearchTitle: string
  emptySearchDescription: string
  openToolLabel: string
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

function formatResultCount(
  count: number,
  language: SiteLanguage,
  suffix: string
) {
  return `${new Intl.NumberFormat(language).format(count)} ${suffix}`
}

function ToolsDirectorySearch({
  entries,
  language,
  messages,
}: ToolsDirectorySearchProps) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
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
  const resultCountLabel = formatResultCount(
    rankedEntries.length,
    language,
    messages.resultCountSuffix
  )
  const isRegistryEmpty = entries.length === 0
  const isSearchEmpty = !isRegistryEmpty && rankedEntries.length === 0

  return (
    <ToolSurface
      className="space-y-6"
      aria-busy={query !== deferredQuery}
      aria-live="polite"
    >
      <SectionHeading
        eyebrow={messages.searchLabel}
        title={messages.resultsTitle}
        description={messages.resultsDescription}
        action={<Badge variant="secondary">{resultCountLabel}</Badge>}
      />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label={messages.searchLabel}
            className="h-11 pl-10 text-sm"
            placeholder={messages.searchPlaceholder}
            value={query}
            onChange={(event) => {
              const nextQuery = event.currentTarget.value

              startTransition(() => {
                setQuery(nextQuery)
              })
            }}
          />
        </div>

        {query ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              startTransition(() => {
                setQuery("")
              })
            }}
          >
            {messages.clearSearchLabel}
          </Button>
        ) : null}
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {messages.searchHint}
      </p>

      {isRegistryEmpty ? (
        <div className="rounded-[calc(var(--radius)*1.8)] border border-dashed border-border/80 bg-muted/30 p-6 sm:p-7">
          <div className="flex flex-col gap-3">
            <LayoutGrid className="size-5 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-heading text-2xl leading-tight tracking-[var(--tracking-display)]">
                {messages.emptyRegistryTitle}
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {messages.emptyRegistryDescription}
              </p>
            </div>
          </div>
        </div>
      ) : isSearchEmpty ? (
        <div className="rounded-[calc(var(--radius)*1.8)] border border-dashed border-border/80 bg-muted/30 p-6 sm:p-7">
          <div className="flex flex-col gap-3">
            <Search className="size-5 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-heading text-2xl leading-tight tracking-[var(--tracking-display)]">
                {messages.emptySearchTitle}
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {messages.emptySearchDescription}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {rankedEntries.map(({ entry }) => {
            const locale = resolveLocale(entry, language)

            return (
              <ToolSurface
                key={entry.slug}
                className="flex flex-col gap-5 border-dashed bg-background/70 shadow-none"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{entry.category}</Badge>
                  <Badge variant="outline">{entry.icon}</Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-2xl leading-tight tracking-[var(--tracking-display)]">
                    {locale.name}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {locale.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {entry.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                  <span className="font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
                    {messages.cardMetaLabel}
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <a href={localizePath(`/tools/${entry.slug}`, language)}>
                      {messages.openToolLabel}
                      <ArrowRight data-icon="inline-end" />
                    </a>
                  </Button>
                </div>
              </ToolSurface>
            )
          })}
        </div>
      )}
    </ToolSurface>
  )
}

export { ToolsDirectorySearch }
