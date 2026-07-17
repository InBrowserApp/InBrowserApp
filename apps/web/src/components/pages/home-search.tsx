import { useState } from "react"
import { navigate } from "astro:transitions/client"

import { localizePath } from "@/lib/site"
import { SearchCombobox } from "./tools-directory/search-combobox"

import type { SiteLanguage } from "@/lib/site"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"
import type { SearchComboboxMessages } from "./tools-directory/search-combobox"

type HomeSearchProps = Readonly<{
  entries: readonly SearchSuggestionEntry[]
  language: SiteLanguage
  categoryLabels: Readonly<Record<string, string>>
  messages: SearchComboboxMessages
}>

/**
 * Home hero search: the shared suggestions combobox, with Enter falling
 * back to the tools directory filtered by the typed query.
 */
function HomeSearch({
  categoryLabels,
  entries,
  language,
  messages,
}: HomeSearchProps) {
  const [query, setQuery] = useState("")

  return (
    <SearchCombobox
      entries={entries}
      language={language}
      query={query}
      onQueryChange={setQuery}
      onSubmitQuery={(submittedQuery) => {
        void navigate(
          `${localizePath("/tools", language)}?query=${encodeURIComponent(submittedQuery)}`
        )
      }}
      variant="hero"
      categoryLabels={categoryLabels}
      messages={messages}
    />
  )
}

export { HomeSearch }
