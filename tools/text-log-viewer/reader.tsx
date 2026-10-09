import { useMemo, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import { Input } from "@workspace/ui/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  RotateCw,
} from "@workspace/ui/icons"
import { sectionHtml } from "./core/section-html"
import { ReaderFrame } from "./reader-frame"
import type { useReader, View } from "./use-reader"
import type { Messages } from "./types"
function format(value: string, fields: Record<string, number | string>) {
  return value.replace(/\{(\w+)\}/g, (_, key: string) => String(fields[key]))
}
export function Reader({
  view,
  busy,
  request,
  m,
}: {
  view: View
  busy: boolean
  request: ReturnType<typeof useReader>["request"]
  m: Messages
}) {
  const [query, setQuery] = useState("")
  const [searched, setSearched] = useState("")
  const [zoom, setZoom] = useState(100)
  const [wrap, setWrap] = useState(false)
  const { metadata, section } = view
  const match = query === searched ? view.match : undefined
  const html = useMemo(
    () => sectionHtml(section, view.match, m.continued),
    [section, view.match, m.continued]
  )
  const search = (direction: 1 | -1) => {
    if (!query) return
    setSearched(query)
    request({
      kind: "search",
      query,
      direction,
      from: match ? match.offset + direction : section.start,
    })
  }
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b px-2 py-1">
        <div className="flex items-center gap-1">
          <DocumentIconButton
            label={m.wrap}
            aria-pressed={wrap}
            onClick={() => setWrap(!wrap)}
          >
            <ArrowLeftRight aria-hidden="true" />
          </DocumentIconButton>
          <DocumentZoom value={zoom} onChange={setZoom} messages={m} />
          <DocumentIconButton
            label={m.resetZoom}
            disabled={zoom === 100}
            onClick={() => setZoom(100)}
          >
            <RotateCw aria-hidden="true" />
          </DocumentIconButton>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{m.line}</span>
          <DocumentNumberInput
            aria-label={m.line}
            className="w-24"
            value={view.target ?? section.rows[0]?.line ?? 1}
            min={1}
            max={Math.max(1, metadata.lines)}
            disabled={!metadata.lines}
            onCommit={(line) => request({ kind: "line", line })}
          />
        </div>
        <form
          className="flex min-w-48 flex-1 items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault()
            search(1)
          }}
        >
          <Input
            type="search"
            aria-label={m.find}
            title={m.findHelp}
            placeholder={m.find}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                search(event.shiftKey ? -1 : 1)
              }
            }}
            className="min-w-0 flex-1"
          />
          <DocumentIconButton
            type="button"
            label={m.previousMatch}
            disabled={!query || busy}
            onClick={() => search(-1)}
          >
            <ArrowUp aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            type="submit"
            label={m.nextMatch}
            disabled={!query || busy}
          >
            <ArrowDown aria-hidden="true" />
          </DocumentIconButton>
        </form>
      </div>
      {busy || match !== undefined ? (
        <p
          role="status"
          className="shrink-0 px-3 py-1 text-xs text-muted-foreground"
        >
          {busy
            ? m.searching
            : match
              ? `${format(m.match, { line: match.line })}${match.wrapped ? ` · ${m.wrapped}` : ""}`
              : m.noMatch}
        </p>
      ) : null}
      {metadata.lines ? (
        <ReaderFrame
          html={html}
          title={m.documentBody}
          zoom={zoom}
          wrap={wrap}
          target={view.target}
          revision={view.id}
          end={view.end}
          focus={view.match === undefined}
        />
      ) : (
        <p className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          {m.empty}
        </p>
      )}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-t px-2 py-1">
        <div className="flex items-center gap-0">
          <DocumentIconButton
            label={m.beginning}
            disabled={!metadata.lines}
            onClick={() => request({ kind: "section", index: 0 })}
          >
            <ChevronUp aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.previous}
            disabled={!section.index}
            onClick={() =>
              request({ kind: "section", index: section.index - 1 })
            }
          >
            <ChevronLeft aria-hidden="true" />
          </DocumentIconButton>
          <span className="px-1 text-xs tabular-nums">
            {format(m.section, {
              current: section.index + 1,
              total: metadata.sections,
            })}
          </span>
          <DocumentIconButton
            label={m.next}
            disabled={section.index + 1 === metadata.sections}
            onClick={() =>
              request({ kind: "section", index: section.index + 1 })
            }
          >
            <ChevronRight aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.end}
            disabled={!metadata.lines}
            onClick={() => request({ kind: "end" })}
          >
            <ChevronDown aria-hidden="true" />
          </DocumentIconButton>
        </div>
        <span className="px-1 text-xs text-muted-foreground tabular-nums">
          {format(m.lines, {
            first: metadata.lines ? (section.rows[0]?.line ?? 0) : 0,
            last: metadata.lines ? (section.rows.at(-1)?.line ?? 0) : 0,
            total: metadata.lines,
          })}
        </span>
      </div>
    </>
  )
}
