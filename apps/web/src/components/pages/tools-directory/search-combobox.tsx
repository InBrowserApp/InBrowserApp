import { useEffect, useRef, useState } from "react"
import { navigate } from "astro:transitions/client"

import { Input } from "@workspace/ui/components/ui/input"
import { Search, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { localizePath } from "@/lib/site"
import { buildSearchSuggestions, normalizeQuery } from "./search-core"
import { SearchSuggestions, suggestionOptionId } from "./search-suggestions"

import type { ToolSearchIndexEntry } from "@workspace/tool-registry"
import type { SiteLanguage } from "@/lib/site"
import type { ToolSearchSuggestion } from "./search-core"
import type { SearchSuggestionsMessages } from "./search-suggestions"

type SearchComboboxMessages = SearchSuggestionsMessages &
  Readonly<{
    searchLabel: string
    searchPlaceholder: string
    clearSearchLabel: string
  }>

type SearchComboboxProps = Readonly<{
  entries: readonly ToolSearchIndexEntry[]
  language: SiteLanguage
  query: string
  onQueryChange: (query: string) => void
  categoryLabels: Readonly<Record<string, string>>
  messages: SearchComboboxMessages
}>

const LISTBOX_ID = "tools-search-suggestions"

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable)
  )
}

function SearchCombobox({
  categoryLabels,
  entries,
  language,
  messages,
  onQueryChange,
  query,
}: SearchComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const composingRef = useRef(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [shortcutHint, setShortcutHint] = useState("⌘K")

  const suggestions = buildSearchSuggestions(entries, query, language)
  const hasQuery = query.length > 0
  const isOpen = isFocused && normalizeQuery(query) !== "" && !isDismissed

  const setQuery = (nextQuery: string) => {
    setIsDismissed(false)
    setHighlightedIndex(0)
    onQueryChange(nextQuery)
  }

  const openSuggestion = (suggestion: ToolSearchSuggestion) => {
    void navigate(localizePath(`/tools/${suggestion.entry.slug}`, language))
  }

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

  /** ⌘K / Ctrl+K / bare `/` focus the search input from anywhere. */
  useEffect(() => {
    if (!/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setShortcutHint("Ctrl K")
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"
      const isSlash =
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isEditableTarget(event.target)

      if (!isShortcut && !isSlash) {
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

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    // Ignore keys that operate the IME candidate window (e.g. Enter
    // confirming a CJK composition must not open a suggestion).
    if (composingRef.current || event.nativeEvent.isComposing) {
      return
    }

    if (event.key === "Escape") {
      setIsDismissed(true)
      return
    }

    if (!isOpen || suggestions.length === 0) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlightedIndex((index) =>
        Math.min(index + 1, suggestions.length - 1)
      )
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlightedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      const suggestion =
        suggestions[Math.min(highlightedIndex, suggestions.length - 1)]

      if (suggestion) {
        event.preventDefault()
        openSuggestion(suggestion)
      }
    }
  }

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        role="combobox"
        aria-label={messages.searchLabel}
        aria-expanded={isOpen}
        aria-controls={LISTBOX_ID}
        aria-autocomplete="list"
        aria-activedescendant={
          isOpen && suggestions.length > 0
            ? suggestionOptionId(
                LISTBOX_ID,
                Math.min(highlightedIndex, suggestions.length - 1)
              )
            : undefined
        }
        className={cn(
          "h-10 ps-9.5 text-base md:text-sm",
          hasQuery ? "pe-10" : "pe-3 sm:pe-12"
        )}
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
        onKeyDown={handleInputKeyDown}
        onFocus={() => {
          setIsFocused(true)
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
      />

      {hasQuery ? (
        <button
          type="button"
          aria-label={messages.clearSearchLabel}
          onMouseDown={(event) => {
            event.preventDefault()
            setQuery("")
            inputRef.current?.focus()
          }}
          className="absolute end-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-[7px] bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
        >
          <X className="size-3" strokeWidth={2.5} />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute end-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:inline-flex"
        >
          {shortcutHint}
        </kbd>
      )}

      {isOpen ? (
        <SearchSuggestions
          suggestions={suggestions}
          highlightedIndex={Math.min(
            highlightedIndex,
            Math.max(suggestions.length - 1, 0)
          )}
          listboxId={LISTBOX_ID}
          categoryLabels={categoryLabels}
          messages={messages}
          onPick={openSuggestion}
          onHighlight={setHighlightedIndex}
        />
      ) : null}
    </div>
  )
}

export { SearchCombobox }
export type { SearchComboboxMessages }
