import { useEffect, useMemo, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Monitor, Search, Terminal } from "@workspace/ui/icons"

import {
  catalogOptions,
  lookupHref,
  normalizeQuery,
  platformName,
  preferredLocale,
  publicLanguage,
  publicPlatform,
  readLookup,
  search,
  selectVariant,
  type Catalog,
  type Lookup,
} from "./core/lookup"
import { fetchCatalog, fetchPage, sourceLink } from "./core/source"
import { languageName } from "./language-names"
import { LoadError, Loading } from "./lookup-feedback"
import { LookupForm } from "./lookup-form"
import { Result } from "./result"
import { SourceButton } from "./source-button"
import type { Messages } from "./messages"

const initial = { q: "", os: "", lang: "" }
const starterCommands = ["git-commit", "tar", "curl"]

type PageState = Readonly<{ key: string; markdown: string | null }>

function Match({ name, query }: { name: string; query: string }) {
  const start = name.indexOf(query)
  const end = start + query.length
  return (
    <code dir="ltr" className="text-sm font-medium">
      {name.slice(0, start)}
      <mark className="rounded-sm bg-amber-100 text-amber-950 dark:bg-amber-400/20 dark:text-amber-100">
        {name.slice(start, end)}
      </mark>
      {name.slice(end)}
    </code>
  )
}

export default function TldrClient({
  lang,
  messages,
}: {
  lang: string
  messages: Messages
}) {
  const [lookup, setLookup] = useState<Lookup>(initial)
  const [query, setQuery] = useState("")
  const [catalog, setCatalog] = useState<Catalog | null>()
  const [catalogRetry, retryCatalog] = useState(0)
  const [page, setPage] = useState<PageState>()
  const [pageRetry, retryPage] = useState(0)

  useEffect(() => {
    const saved = readLookup(new URLSearchParams(window.location.search))
    setLookup(saved)
    setQuery(saved.q)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void fetchCatalog(controller.signal).then(
      (value) => {
        if (!controller.signal.aborted) setCatalog(value)
      },
      () => {
        if (!controller.signal.aborted) setCatalog(null)
      }
    )
    return () => controller.abort()
  }, [catalogRetry])

  const names = useMemo(
    () => new Intl.DisplayNames([lang], { type: "language" }),
    [lang]
  )
  const options = useMemo(() => {
    const { os, languages } = catalogOptions(catalog?.commands ?? [])
    const collator = new Intl.Collator(lang)
    languages.sort((a, b) =>
      collator.compare(languageName(names, a), languageName(names, b))
    )
    return { os, languages }
  }, [catalog, lang, names])
  const os = options.os.includes(lookup.os) ? lookup.os : ""
  const explicitLanguage =
    options.languages.find(
      (language) => language.toLowerCase() === preferredLocale(lookup.lang)
    ) ?? ""
  const preferences = { ...lookup, os, lang: explicitLanguage }
  const language = explicitLanguage || lang
  const normalized = normalizeQuery(query)
  const submitted = normalizeQuery(lookup.q)
  const results = search(catalog?.commands ?? [], normalized)
  const selected = catalog?.commands.find(([name]) => name === submitted)
  const command = normalized === submitted ? selected : undefined
  const variant = command && selectVariant(command, os, language)
  const { q: name, os: platform, locale } = variant ?? {}
  const revision = catalog?.revision
  const key = [revision, platform, locale, name].join("/")
  const markdown = page?.key === key ? page.markdown : undefined

  useEffect(() => {
    if (!name || !platform || !locale || !revision) return
    const controller = new AbortController()
    void fetchPage(
      revision,
      { q: name, os: platform, locale },
      controller.signal
    ).then(
      (value) => {
        if (!controller.signal.aborted) setPage({ key, markdown: value })
      },
      () => {
        if (!controller.signal.aborted) setPage({ key, markdown: null })
      }
    )
    return () => controller.abort()
  }, [key, name, platform, locale, revision, pageRetry])

  function navigate(next: Lookup) {
    window.location.assign(lookupHref(window.location.pathname, next))
  }
  function changePreference(preference: Partial<Lookup>) {
    const next = { ...preferences, ...preference }
    if (submitted && normalized === submitted) navigate(next)
    else setLookup(next)
  }

  const starters = starterCommands.filter((starter) =>
    catalog?.commands.some(([name]) => name === starter)
  )

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <LookupForm
        query={query}
        os={os}
        locale={explicitLanguage}
        platforms={options.os}
        locales={options.languages}
        names={names}
        hydrated={lookup !== initial}
        ready={!!catalog}
        messages={messages}
        onQuery={setQuery}
        onPreference={changePreference}
        onSearch={() => {
          const q = results[0]?.[0] === normalized ? normalized : query
          navigate({ ...preferences, q })
        }}
      />

      {catalog === undefined && (
        <Loading label={messages.loadingIndex} query={lookup.q} />
      )}
      {catalog === null && (
        <LoadError
          message={messages.indexError}
          retry={messages.retry}
          onRetry={() => {
            setCatalog(undefined)
            retryCatalog((attempt) => attempt + 1)
          }}
        />
      )}

      {!normalized && starters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="me-1 text-sm text-muted-foreground">
            {messages.tryCommands}
          </p>
          {starters.map((starter) => (
            <Button key={starter} variant="outline" size="sm" asChild>
              <a
                data-astro-reload
                href={lookupHref(".", { ...preferences, q: starter })}
              >
                <Terminal data-icon="inline-start" aria-hidden="true" />
                <code dir="ltr">{starter.replaceAll("-", " ")}</code>
              </a>
            </Button>
          ))}
        </div>
      )}

      {catalog && normalized && !results.length && (
        <div
          className="flex items-start gap-2 rounded-lg border p-3 text-sm text-muted-foreground"
          role="status"
        >
          <Search className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {messages.noResults}
        </div>
      )}

      {!command && results.length > 0 && (
        <ul
          aria-label={messages.results}
          className="divide-y rounded-lg border"
        >
          {results.map(([name]) => (
            <li key={name}>
              <a
                data-astro-reload
                data-astro-prefetch="false"
                aria-label={name}
                href={lookupHref(".", { ...preferences, q: name })}
                className="flex items-center gap-2 px-4 py-2.5 wrap-anywhere hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              >
                <Terminal
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <Match name={name} query={normalized} />
              </a>
            </li>
          ))}
        </ul>
      )}

      {command && !variant && (
        <div className="grid gap-3 rounded-lg border p-3 text-sm">
          <p>{messages.choosePlatform}</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(command[1]).map((os) => (
              <Button key={os} variant="outline" size="sm" asChild>
                <a
                  data-astro-reload
                  href={lookupHref(".", {
                    ...preferences,
                    q: command[0],
                    os: publicPlatform(os),
                  })}
                >
                  <Monitor data-icon="inline-start" aria-hidden="true" />
                  {platformName(os, messages.common)}
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}

      {variant && revision && (
        <>
          {markdown === undefined && (
            <Loading label={messages.loadingPage} query={query} />
          )}
          {markdown === null && (
            <LoadError
              message={messages.pageError}
              retry={messages.retry}
              action={
                <SourceButton
                  href={sourceLink(revision, variant)}
                  label={messages.source}
                />
              }
              onRetry={() => {
                setPage(undefined)
                retryPage((attempt) => attempt + 1)
              }}
            />
          )}
          {markdown && (
            <Result
              page={variant}
              revision={revision}
              markdown={markdown}
              link={lookupHref(
                window.location.origin + window.location.pathname,
                {
                  q: variant.q,
                  os: publicPlatform(variant.os),
                  lang: publicLanguage(variant.locale),
                }
              )}
              names={names}
              fallback={
                (!!os && os !== publicPlatform(variant.os)) ||
                preferredLocale(language) !==
                  publicLanguage(variant.locale).toLowerCase()
              }
              messages={messages}
            />
          )}
        </>
      )}
    </div>
  )
}
