import { useCallback, useEffect, useId, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "@workspace/ui/icons"
export type DocumentReaderState = {
  page: number
  total: number
  zoom: number
  current: number
  matches: number
  searching: boolean
  query: string
}
export type DocumentControls = {
  page: (page: number) => void
  zoom: (scale: number | "page-width") => void
  find: (query: string, previous?: boolean) => void
}
type ToolbarMessages = Record<
  | "previous"
  | "page"
  | "pageCount"
  | "next"
  | "zoom"
  | "zoomIn"
  | "zoomOut"
  | "fit"
  | "search"
  | "closeSearch"
  | "find"
  | "previousMatch"
  | "nextMatch"
  | "searching"
  | "matches"
  | "noMatches",
  string
>

export function DocumentToolbar({
  messages: m,
  state,
  reader,
  actions,
}: {
  messages: ToolbarMessages
  state: DocumentReaderState
  reader: DocumentControls
  actions?: ReactNode
}) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery("")
    reader.find("")
    toggle.current?.focus()
  }, [reader])
  useEffect(() => {
    if (open) search.current?.focus()
  }, [open])
  useEffect(() => {
    const workspace = root.current!.closest("[data-document-workspace]")!
    function onKey(event: Event) {
      const e = event as KeyboardEvent
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault()
        setOpen(true)
        search.current?.focus()
      } else if (e.key === "Escape" && !e.defaultPrevented && open) {
        e.preventDefault()
        closeSearch()
      }
    }
    workspace.addEventListener("keydown", onKey)
    return () => workspace.removeEventListener("keydown", onKey)
  }, [open, closeSearch])
  const status = state.searching
    ? m.searching
    : state.matches
      ? m.matches
          .replace("{current}", String(state.current))
          .replace("{total}", String(state.matches))
      : state.query
        ? m.noMatches
        : ""
  return (
    <div ref={root} className="shrink-0 border-b p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <DocumentIconButton
            label={m.previous}
            disabled={state.page <= 1}
            onClick={() => reader.page(state.page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m.page}
            className="w-16"
            min={1}
            max={state.total}
            value={state.page}
            onCommit={reader.page}
          />
          <span className="text-sm text-muted-foreground tabular-nums">
            {m.pageCount.replace("{total}", String(state.total))}
          </span>
          <DocumentIconButton
            label={m.next}
            disabled={state.page >= state.total}
            onClick={() => reader.page(state.page + 1)}
          >
            <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
          </DocumentIconButton>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <DocumentZoom
            value={state.zoom}
            onChange={reader.zoom}
            messages={m}
          />
          <DocumentIconButton
            label={m.fit}
            onClick={() => reader.zoom("page-width")}
          >
            <ArrowLeftRight aria-hidden="true" />
          </DocumentIconButton>
          {actions}
          <DocumentIconButton
            ref={toggle}
            label={m.search}
            aria-expanded={open}
            aria-controls={`${id}-search-panel`}
            onClick={() => (open ? closeSearch() : setOpen(true))}
          >
            <Search aria-hidden="true" />
          </DocumentIconButton>
        </div>
      </div>
      {open ? (
        <form
          id={`${id}-search-panel`}
          className="mt-2 flex flex-wrap items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault()
            reader.find(query.trim())
          }}
        >
          <Input
            ref={search}
            aria-label={m.search}
            type="search"
            className="min-w-32 flex-1"
            maxLength={200}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (!event.target.value) reader.find("")
            }}
          />
          <Button type="submit" variant="outline" disabled={!query.trim()}>
            {m.find}
          </Button>
          <DocumentIconButton
            type="button"
            label={m.previousMatch}
            disabled={!query.trim()}
            onClick={() => reader.find(query.trim(), true)}
          >
            <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
          </DocumentIconButton>
          <DocumentIconButton
            type="button"
            label={m.nextMatch}
            disabled={!query.trim()}
            onClick={() => reader.find(query.trim())}
          >
            <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
          </DocumentIconButton>
          <DocumentIconButton
            type="button"
            label={m.closeSearch}
            onClick={closeSearch}
          >
            <X aria-hidden="true" />
          </DocumentIconButton>
          <p role="status" className="basis-full text-xs text-muted-foreground">
            {status}
          </p>
        </form>
      ) : null}
    </div>
  )
}
