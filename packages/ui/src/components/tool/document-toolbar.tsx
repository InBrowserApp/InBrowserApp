import { useId, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { Input } from "@workspace/ui/components/ui/input"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
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
  | "fit"
  | "search"
  | "find"
  | "previousMatch"
  | "nextMatch"
  | "searching"
  | "matches"
  | "noMatches"
  | "privacy",
  string
>

export function DocumentToolbar({
  messages: m,
  state,
  reader,
}: {
  messages: ToolbarMessages
  state: DocumentReaderState
  reader: DocumentControls
}) {
  const id = useId()
  const [query, setQuery] = useState("")
  return (
    <div className="flex flex-col gap-3 border-b p-3">
      <div className="flex flex-wrap items-end gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={m.previous}
          disabled={state.page <= 1}
          onClick={() => reader.page(state.page - 1)}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Button>
        <Field className="w-24">
          <FieldLabel htmlFor={`${id}-page`}>{m.page}</FieldLabel>
          <DocumentNumberInput
            id={`${id}-page`}
            min={1}
            max={state.total}
            value={state.page}
            onCommit={reader.page}
          />
        </Field>
        <span className="pb-2 text-sm text-muted-foreground">
          {m.pageCount.replace("{total}", String(state.total))}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label={m.next}
          disabled={state.page >= state.total}
          onClick={() => reader.page(state.page + 1)}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Button>
        <Field className="ms-auto w-24">
          <FieldLabel htmlFor={`${id}-zoom`}>{m.zoom}</FieldLabel>
          <DocumentNumberInput
            id={`${id}-zoom`}
            min={25}
            max={400}
            step={25}
            value={state.zoom}
            onCommit={reader.zoom}
          />
        </Field>
        <Button variant="outline" onClick={() => reader.zoom("page-width")}>
          {m.fit}
        </Button>
      </div>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          reader.find(query.trim())
        }}
      >
        <Field className="min-w-40 flex-1">
          <FieldLabel htmlFor={`${id}-search`}>{m.search}</FieldLabel>
          <Input
            id={`${id}-search`}
            type="search"
            maxLength={200}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (!event.target.value) reader.find("")
            }}
          />
        </Field>
        <Button type="submit" variant="outline" disabled={!query.trim()}>
          {m.find}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={m.previousMatch}
          disabled={!query.trim()}
          onClick={() => reader.find(query.trim(), true)}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={m.nextMatch}
          disabled={!query.trim()}
          onClick={() => reader.find(query.trim())}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Button>
      </form>
      <p role="status" className="text-xs text-muted-foreground">
        {state.searching
          ? m.searching
          : state.matches
            ? m.matches
                .replace("{current}", String(state.current))
                .replace("{total}", String(state.matches))
            : state.query
              ? m.noMatches
              : m.privacy}
      </p>
    </div>
  )
}
