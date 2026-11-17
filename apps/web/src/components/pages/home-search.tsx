import { useRef, useState } from "react"
import { loadToolSearchSuggestions } from "@workspace/tool-registry/search-suggestions"

import { localizePath } from "@/lib/site"
import { SearchCombobox } from "./tools-directory/search-combobox"

import type { SiteLanguage } from "@/lib/site"
import type { SearchSuggestionEntry } from "@/lib/tool-directory"
import type { SearchComboboxMessages } from "./tools-directory/search-combobox"

type HomeSearchProps = Readonly<{
  language: SiteLanguage
  categoryLabels: Readonly<Record<string, string>>
  messages: SearchComboboxMessages
}>

/**
 * Home hero search: the shared suggestions combobox, with Enter falling
 * back to the tools directory filtered by the typed query.
 */
function HomeSearch({ categoryLabels, language, messages }: HomeSearchProps) {
  const [query, setQuery] = useState("")
  const [entries, setEntries] = useState<
    readonly SearchSuggestionEntry[] | null
  >(null)
  const loadingRef = useRef(false)

  async function loadEntries() {
    if (entries !== null || loadingRef.current) return

    loadingRef.current = true
    try {
      setEntries(await loadToolSearchSuggestions(language))
    } catch {
      // Enter still opens the directory; refocusing retries the suggestions.
    } finally {
      loadingRef.current = false
    }
  }

  return (
    <SearchCombobox
      entries={entries ?? []}
      suggestionsReady={entries !== null}
      onFocus={() => void loadEntries()}
      language={language}
      query={query}
      onQueryChange={setQuery}
      onSubmitQuery={(submittedQuery) => {
        window.location.assign(
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
