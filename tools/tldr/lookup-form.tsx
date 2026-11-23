import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Languages, Monitor, Search } from "@workspace/ui/icons"

import { platformName, type Lookup } from "./core/lookup"
import { languageName } from "./language-names"
import type { Messages } from "./messages"

const selectClass =
  "h-9 w-full min-w-0 truncate rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"

export function LookupForm({
  query,
  os,
  locale,
  platforms,
  locales,
  names,
  hydrated,
  ready,
  messages,
  onQuery,
  onPreference,
  onSearch,
}: {
  query: string
  os: string
  locale: string
  platforms: readonly string[]
  locales: readonly string[]
  names: Intl.DisplayNames
  hydrated: boolean
  ready: boolean
  messages: Messages
  onQuery: (query: string) => void
  onPreference: (preference: Partial<Lookup>) => void
  onSearch: () => void
}) {
  return (
    <form
      role="search"
      method="get"
      data-astro-reload
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (ready) onSearch()
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
          disabled={!hydrated}
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          className="h-9 min-w-0 flex-[1_1_11rem]"
        />
        <Button size="lg" type="submit" disabled={!ready}>
          <Search data-icon="inline-start" aria-hidden="true" />
          {messages.search}
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,9rem),1fr))] gap-x-3 gap-y-2 sm:max-w-xl">
        <label className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
          <span className="flex items-start gap-1.5">
            <Monitor className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            {messages.platform}
          </span>
          <select
            name="os"
            value={os}
            disabled={!ready}
            className={selectClass}
            onChange={(event) => onPreference({ os: event.target.value })}
          >
            <option value="">{messages.automatic}</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platformName(platform, messages.common)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-xs font-medium text-muted-foreground">
          <span className="flex items-start gap-1.5">
            <Languages className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            {messages.pageLanguage}
          </span>
          <select
            name="lang"
            value={locale}
            disabled={!ready}
            className={selectClass}
            onChange={(event) => onPreference({ lang: event.target.value })}
          >
            <option value="">{messages.siteLanguage}</option>
            {locales.map((language) => (
              <option key={language} value={language}>
                {languageName(names, language)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  )
}
