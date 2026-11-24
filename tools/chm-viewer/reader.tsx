import { useEffect, useId, useMemo, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { ChevronLeft, ChevronRight, List, Search } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Contents } from "./contents"
import { TopicFrame } from "./topic-frame"
import { filterTopics } from "./topics"

import type { Book } from "./book"
import type { Messages } from "./messages"
import type { Destination } from "./topics"

const wideReader = "(min-width: 48rem)"

export function Reader({
  book,
  lang,
  messages: m,
}: {
  book: Book
  lang: string
  messages: Messages
}) {
  const [history, setHistory] = useState({ entries: [book.home], index: 0 })
  const [contentsVisible, setContentsVisible] = useState(false)
  const [query, setQuery] = useState("")
  const contentsId = useId()
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const media = window.matchMedia(wideReader)
    const update = () => setContentsVisible(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const topic = history.entries[history.index]!
  const visibleTopics = useMemo(
    () => filterTopics(book.contents, book.topics, query, lang),
    [book, query, lang]
  )

  function navigate(destination: Destination) {
    setHistory((previous) => {
      const { entries, index } = previous
      const current = entries[index]!
      if (
        current.path === destination.path &&
        current.fragment === destination.fragment
      ) {
        return previous
      }
      return {
        entries: [...entries.slice(0, index + 1), destination],
        index: index + 1,
      }
    })
  }

  function move(offset: number) {
    setHistory(({ entries, index }) => ({ entries, index: index + offset }))
  }

  function closeContents() {
    setContentsVisible(false)
    toggle.current?.focus()
  }

  function select(destination: Destination) {
    navigate(destination)
    if (!window.matchMedia(wideReader).matches) closeContents()
  }

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-1.5">
        <Button
          ref={toggle}
          variant={contentsVisible ? "secondary" : "ghost"}
          size="sm"
          className="h-9 min-w-0"
          aria-expanded={contentsVisible}
          aria-controls={contentsId}
          onClick={() => setContentsVisible(!contentsVisible)}
        >
          <List data-icon="inline-start" aria-hidden="true" />
          <span className="truncate">{m.contents}</span>
        </Button>
        <div className="flex shrink-0 items-center gap-1">
          <DocumentIconButton
            label={m.back}
            disabled={history.index === 0}
            onClick={() => move(-1)}
          >
            <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.forward}
            disabled={history.index === history.entries.length - 1}
            onClick={() => move(1)}
          >
            <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
          </DocumentIconButton>
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <nav
          id={contentsId}
          aria-label={m.contents}
          hidden={!contentsVisible}
          className="min-h-0 w-full shrink-0 flex-col bg-muted/25 md:w-72 md:border-e [&:not([hidden])]:flex"
          onKeyDown={(event) => {
            if (event.key !== "Escape") return
            event.preventDefault()
            event.stopPropagation()
            closeContents()
          }}
        >
          <div className="relative shrink-0 p-3">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-6 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label={m.filterTopics}
              placeholder={m.filterTopics}
              className="bg-background ps-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="overflow-auto px-2 pt-1 pb-3">
            {visibleTopics.length > 0 ? (
              <Contents
                key={query.trim() ? "filtered" : "full"}
                topics={visibleTopics}
                current={topic}
                onSelect={select}
              />
            ) : (
              <p
                role="status"
                className="px-2 py-3 text-sm text-muted-foreground"
              >
                {m.noMatches}
              </p>
            )}
          </div>
        </nav>
        <div
          className={cn("min-w-0 flex-1", contentsVisible && "hidden md:block")}
        >
          <TopicFrame
            key={topic.path}
            book={book}
            topic={topic}
            messages={m}
            onNavigate={navigate}
          />
        </div>
      </div>
    </>
  )
}
