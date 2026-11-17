import { useCallback, useDeferredValue, useMemo, useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@workspace/ui/components/ui/empty"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from "@workspace/ui/components/ui/table"
import { formatTime, selectEntries } from "../core/analysis"
import { Filters, DEFAULT_FILTERS, type FiltersState } from "./filters"
import { Legend } from "./timing"
import { RequestRow } from "./request-row"
import { Details } from "./details"
import type { Capture, Entry, Messages } from "../types"

const PAGE_SIZE = 50

export function Requests({
  capture,
  messages: m,
  lang,
}: {
  capture: Capture
  messages: Messages
  lang: string
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const deferredSearch = useDeferredValue(filters.search)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Entry | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const inspect = useCallback((entry: Entry, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setSelected(entry)
  }, [])
  const entries = useMemo(
    () =>
      selectEntries(
        capture.entries,
        deferredSearch,
        filters.status,
        filters.sort
      ),
    [capture.entries, deferredSearch, filters.status, filters.sort]
  )
  const pages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages - 1)
  const count = new Intl.NumberFormat(lang)
  function changeFilters(next: FiltersState) {
    setFilters(next)
    setPage(0)
  }

  return (
    <>
      <ToolPanelCard className="min-w-0">
        <CardHeader className="border-b pb-4">
          <CardTitle>{m.waterfall}</CardTitle>
          <CardDescription>{m.waterfallHint}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <Filters
            value={filters}
            onChange={changeFilters}
            messages={m}
            lang={lang}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-xs text-muted-foreground">
              {m.matching}:{" "}
              <span className="tabular-nums">
                {count.format(entries.length)} /{" "}
                {count.format(capture.entries.length)}
              </span>
            </p>
            <Legend messages={m} />
          </div>
          {entries.length ? (
            <Table className="table-fixed sm:min-w-[850px]">
              <caption className="sr-only">{m.waterfallHint}</caption>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-16 sm:table-cell">
                    {m.method}
                  </TableHead>
                  <TableHead className="w-[55%] sm:w-[30%]">{m.url}</TableHead>
                  <TableHead className="hidden w-16 sm:table-cell">
                    {m.status}
                  </TableHead>
                  <TableHead className="hidden w-24 sm:table-cell">
                    {m.size}
                  </TableHead>
                  <TableHead className="hidden w-24 sm:table-cell">
                    {m.time}
                  </TableHead>
                  <TableHead className="w-[45%] sm:w-[30%]">
                    <span>{m.waterfall}</span>
                    <div
                      className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground"
                      dir="ltr"
                    >
                      <span>{formatTime(0, lang, m.unknown)}</span>
                      <span>{formatTime(capture.span, lang, m.unknown)}</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries
                  .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
                  .map((entry) => (
                    <RequestRow
                      key={entry.id}
                      entry={entry}
                      capture={capture}
                      lang={lang}
                      messages={m}
                      onInspect={inspect}
                    />
                  ))}
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>
                  {capture.entries.length ? m.noMatches : m.emptyCapture}
                </EmptyTitle>
                <EmptyDescription>
                  {capture.entries.length
                    ? m.noMatchesHint
                    : m.importDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ToolPanelCardContent>
        {pages > 1 ? (
          <ToolPanelCardFooter className="flex flex-wrap justify-between gap-2 border-t py-3">
            <p className="text-xs text-muted-foreground">
              {m.page} {count.format(currentPage + 1)} / {count.format(pages)}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                {m.previous}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage + 1 === pages}
                onClick={() => setPage(currentPage + 1)}
              >
                {m.next}
              </Button>
            </div>
          </ToolPanelCardFooter>
        ) : null}
      </ToolPanelCard>
      {selected ? (
        <Details
          key={selected.id}
          entry={selected}
          capture={capture}
          messages={m}
          lang={lang}
          onClose={() => setSelected(null)}
          onRestoreFocus={() => triggerRef.current?.focus()}
        />
      ) : null}
    </>
  )
}
