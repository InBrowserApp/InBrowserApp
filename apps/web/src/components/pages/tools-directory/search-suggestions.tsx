import { cn } from "@workspace/ui/lib/utils"
import { formatSiteMessage } from "@/lib/site-messages"
import { getCategoryLabel } from "@/lib/tool-directory"

import type { ToolSearchSuggestion } from "./search-core"

type SearchSuggestionsMessages = Readonly<{
  suggestionsLabel: string
  suggestionsHint: string
  suggestionMatchCountOne: string
  suggestionMatchCount: string
  emptySearchTitle: string
  emptySearchDescription: string
}>

type SearchSuggestionsProps = Readonly<{
  suggestions: readonly ToolSearchSuggestion[]
  highlightedIndex: number
  listboxId: string
  categoryLabels: Readonly<Record<string, string>>
  messages: SearchSuggestionsMessages
  onPick: (suggestion: ToolSearchSuggestion) => void
  onHighlight: (index: number) => void
}>

function suggestionOptionId(listboxId: string, index: number) {
  return `${listboxId}-option-${index}`
}

function SearchSuggestions({
  categoryLabels,
  highlightedIndex,
  listboxId,
  messages,
  onHighlight,
  onPick,
  suggestions,
}: SearchSuggestionsProps) {
  const countTemplate =
    suggestions.length === 1
      ? messages.suggestionMatchCountOne
      : messages.suggestionMatchCount

  return (
    <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-10 rounded-xl border border-border bg-popover p-1.5 shadow-[0_10px_40px_color-mix(in_oklab,var(--foreground)_12%,transparent)]">
      {suggestions.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <p className="text-[13px] font-medium text-popover-foreground">
            {messages.emptySearchTitle}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {messages.emptySearchDescription}
          </p>
        </div>
      ) : (
        <>
          <ul
            role="listbox"
            id={listboxId}
            aria-label={messages.suggestionsLabel}
            className="m-0 flex list-none flex-col p-0"
          >
            {suggestions.map((suggestion, index) => {
              const isActive = index === highlightedIndex

              return (
                <li
                  key={suggestion.entry.slug}
                  role="option"
                  id={suggestionOptionId(listboxId, index)}
                  aria-selected={isActive}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    onPick(suggestion)
                  }}
                  onMouseEnter={() => {
                    onHighlight(index)
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-[9px]",
                    isActive && "bg-muted"
                  )}
                >
                  <span className="min-w-0 truncate text-sm text-popover-foreground">
                    {suggestion.pre}
                    <span
                      className={cn(
                        "rounded-[3px] font-semibold",
                        isActive ? "bg-border/70" : "bg-muted"
                      )}
                    >
                      {suggestion.match}
                    </span>
                    {suggestion.post}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground/80 uppercase">
                      {getCategoryLabel(
                        categoryLabels,
                        suggestion.entry.category
                      )}
                    </span>
                    {isActive ? (
                      <kbd
                        aria-hidden="true"
                        className="rounded-[5px] border border-border px-1 font-mono text-[10px] font-medium text-muted-foreground"
                      >
                        ↵
                      </kbd>
                    ) : null}
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-border/70 px-3 pt-2 pb-1 font-mono text-[11px] text-muted-foreground/80">
            <span>
              {formatSiteMessage(countTemplate, { count: suggestions.length })}
            </span>
            <span className="truncate">{messages.suggestionsHint}</span>
          </div>
        </>
      )}
    </div>
  )
}

export { SearchSuggestions, suggestionOptionId }
export type { SearchSuggestionsMessages }
