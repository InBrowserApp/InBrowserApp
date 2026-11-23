import { useEffect, useMemo, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"

import {
  catalogOptions,
  lookupHref,
  normalizeQuery,
  platformName,
  publicLanguage,
  readLookup,
  search,
  selectVariant,
  type Catalog,
  type Lookup,
} from "./core/lookup"
import { fetchCatalog, fetchPage } from "./core/source"
import { Result } from "./result"
import type english from "./messages/en.json"

export type Messages = typeof english

const initial = { q: "", os: "", lang: "" }
const selectClass =
  "min-w-0 rounded-md border border-input bg-background px-2.5 py-1.5 text-foreground"

function Status({
  pending,
  loading,
  failure,
  retry,
  onRetry,
}: {
  pending: boolean
  loading: string
  failure: string
  retry: string
  onRetry: () => void
}) {
  return pending ? (
    <p role="status" className="text-sm text-muted-foreground">
      {loading}
    </p>
  ) : (
    <div className="flex flex-wrap items-center gap-3">
      <p role="alert" className="text-sm text-muted-foreground">
        {failure}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        {retry}
      </Button>
    </div>
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
  const [markdown, setMarkdown] = useState<string | null>()
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

  const normalized = normalizeQuery(query)
  const submitted = normalizeQuery(lookup.q)
  const results = search(catalog?.commands ?? [], normalized)
  const selected = catalog?.commands.find(([name]) => name === submitted)
  const command = normalized === submitted ? selected : undefined
  const variant =
    selected && selectVariant(selected, lookup.os, lookup.lang || lang)
  const { q: name, os: platform, locale } = variant ?? {}
  const revision = catalog?.revision

  useEffect(() => {
    if (!name || !platform || !locale || !revision) return
    const controller = new AbortController()
    void fetchPage(
      revision,
      { q: name, os: platform, locale },
      controller.signal
    ).then(
      (value) => {
        if (!controller.signal.aborted) setMarkdown(value)
      },
      () => {
        if (!controller.signal.aborted) setMarkdown(null)
      }
    )
    return () => controller.abort()
  }, [name, platform, locale, revision, pageRetry])

  const options = useMemo(
    () => catalogOptions(catalog?.commands ?? []),
    [catalog]
  )
  const languages = useMemo(
    () => new Intl.DisplayNames([lang], { type: "language" }),
    [lang]
  )

  function navigate(next: Lookup) {
    window.location.assign(lookupHref(window.location.pathname, next))
  }
  function changePreference(preference: Partial<Lookup>) {
    const next = { ...lookup, ...preference }
    if (submitted && normalized === submitted) navigate(next)
    else setLookup(next)
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <form
        role="search"
        method="get"
        data-astro-reload
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const q = results[0]?.[0] === normalized ? normalized : query
          navigate({ ...lookup, q })
        }}
      >
        <div className="flex flex-wrap gap-2">
          <Input
            type="search"
            name="q"
            dir="ltr"
            aria-label={messages.search}
            placeholder={messages.placeholder}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-[1_1_12rem]"
            disabled={!catalog}
          />
          <Button type="submit" disabled={!catalog}>
            {messages.search}
          </Button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <label className="flex min-w-0 flex-wrap items-center gap-2">
            {messages.platform}
            <select
              name="os"
              value={lookup.os}
              className={selectClass}
              onChange={(event) => changePreference({ os: event.target.value })}
            >
              <option value="">{messages.automatic}</option>
              {options.os.map((os) => (
                <option value={os} key={os}>
                  {platformName(os, messages.common)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-wrap items-center gap-2">
            {messages.pageLanguage}
            <select
              name="lang"
              value={
                options.languages.find(
                  (item) => item.toLowerCase() === lookup.lang.toLowerCase()
                ) ?? ""
              }
              className={selectClass}
              onChange={(event) =>
                changePreference({ lang: event.target.value })
              }
            >
              <option value="">{messages.siteLanguage}</option>
              {options.languages.map((locale) => (
                <option value={locale} key={locale}>
                  {languages.of(locale)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      {!catalog && (
        <Status
          pending={catalog === undefined}
          loading={messages.loadingIndex}
          failure={messages.indexError}
          retry={messages.retry}
          onRetry={() => {
            setCatalog(undefined)
            retryCatalog((attempt) => attempt + 1)
          }}
        />
      )}

      {catalog && normalized && !results.length && (
        <p role="status" className="text-sm text-muted-foreground">
          {messages.noResults}
        </p>
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
                href={lookupHref(".", { ...lookup, q: name })}
                className="block px-4 py-2.5 hover:bg-muted/50"
              >
                <code dir="ltr" className="text-sm font-medium">
                  {name}
                </code>
              </a>
            </li>
          ))}
        </ul>
      )}

      {command && !variant && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <p>{messages.choosePlatform}</p>
          {Object.keys(command[1]).map((os) => (
            <a
              key={os}
              data-astro-reload
              href={lookupHref(".", {
                ...lookup,
                q: command[0],
                os: os === "osx" ? "macos" : os,
              })}
              className="underline underline-offset-4"
            >
              {platformName(os, messages.common)}
            </a>
          ))}
        </div>
      )}

      {command &&
        variant &&
        revision &&
        (markdown ? (
          <Result
            page={variant}
            revision={revision}
            markdown={markdown}
            link={lookupHref(
              window.location.origin + window.location.pathname,
              {
                q: variant.q,
                os: variant.os === "osx" ? "macos" : variant.os,
                lang: publicLanguage(variant.locale),
              }
            )}
            languages={languages}
            messages={messages}
          />
        ) : (
          <Status
            pending={markdown === undefined}
            loading={messages.loadingPage}
            failure={messages.pageError}
            retry={messages.retry}
            onRetry={() => {
              setMarkdown(undefined)
              retryPage((attempt) => attempt + 1)
            }}
          />
        ))}
    </div>
  )
}
