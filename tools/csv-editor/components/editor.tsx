import { useMemo, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
} from "@workspace/ui/icons"
import { Grid } from "./grid"
import {
  columnLetter,
  editCell,
  filterRows,
  moveColumn,
  sortRows,
} from "../core/table"
import type { Filter, Sort } from "../core/table"
import { encodeCsv, serializeCsv, type CsvDocument } from "../core/csv"
import { message, type Messages } from "../messages"

const pageSize = 50

export function Editor({
  document: source,
  lang,
  messages: m,
}: {
  document: CsvDocument & { name: string }
  lang: string
  messages: Messages
}) {
  const [rows, setRows] = useState(source.rows)
  const [columnOrder, setColumnOrder] = useState(() => {
    const width = source.rows.reduce((max, row) => Math.max(max, row.length), 0)
    return Array.from({ length: width }, (_, index) => index)
  })
  const [hasHeader, setHasHeader] = useState(true)
  const [sort, setSort] = useState<Sort | null>(null)
  const [filter, setFilter] = useState<Filter>({ column: null, query: "" })
  const [page, setPage] = useState(0)
  const dir = document.documentElement.dir === "rtl" ? "rtl" : "ltr"
  const number = useMemo(() => new Intl.NumberFormat(lang), [lang])
  const firstRow = hasHeader ? 1 : 0
  const sorted = useMemo(
    () => sortRows(rows, firstRow, sort, lang),
    [rows, firstRow, sort, lang]
  )
  const matches = useMemo(
    () => filterRows(rows, sorted, filter, lang),
    [rows, sorted, filter, lang]
  )
  const pages = Math.max(1, Math.ceil(matches.length / pageSize))
  const currentPage = Math.min(page, pages - 1)
  const offset = currentPage * pageSize
  const filtered = Boolean(filter.query.trim())
  const labels = columnOrder.map((id, position) => {
    const fallback = message(m.columnName, { letter: columnLetter(position) })
    const name = (hasHeader && rows[0]?.[id]?.trim()) || fallback
    return { id, name, fallback }
  })
  const counts = new Map<string, number>()
  for (const { name } of labels) counts.set(name, (counts.get(name) ?? 0) + 1)
  const columns = labels.map(({ id, name, fallback }) => ({
    id,
    name: counts.get(name) === 1 ? name : `${fallback} · ${name}`,
  }))

  function changeFilter(next: Partial<Filter>) {
    setFilter((current) => ({ ...current, ...next }))
    setPage(0)
  }

  function download(indexes: number[]) {
    const { format } = source
    const records = (hasHeader ? [0, ...indexes] : indexes).map(
      (index) => rows[index]!
    )
    const text = serializeCsv(records, columnOrder, format)
    const blob = new Blob([encodeCsv(text, format)], {
      type:
        format.extension === "tsv" ? "text/tab-separated-values" : "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const base = source.name.replace(/\.(?:csv|tsv)$/i, "")
    link.download = `${base || format.extension}.${format.extension}`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-3 py-3 sm:px-4">
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-1">
          <div className="relative min-w-36 flex-1 sm:max-w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              dir="auto"
              aria-label={m.searchRows}
              placeholder={m.searchRows}
              value={filter.query}
              onChange={(event) =>
                changeFilter({ query: event.currentTarget.value })
              }
              className="ps-8 pe-8"
            />
            {filter.query && (
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                aria-label={m.clearFilter}
                title={m.clearFilter}
                className="absolute end-1 top-1/2 -translate-y-1/2"
                onClick={() => changeFilter({ query: "" })}
              >
                <X aria-hidden="true" />
              </Button>
            )}
          </div>
          <select
            aria-label={m.filterColumn}
            className="h-8 max-w-40 min-w-0 rounded-lg border bg-background px-2 text-sm outline-offset-2 outline-ring"
            value={filter.column ?? ""}
            onChange={(event) =>
              changeFilter({
                column:
                  event.currentTarget.value === ""
                    ? null
                    : Number(event.currentTarget.value),
              })
            }
          >
            <option value="">{m.allColumns}</option>
            {columns.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasHeader}
              className="size-4 accent-primary"
              onChange={(event) => {
                setHasHeader(event.currentTarget.checked)
                setPage(0)
              }}
            />
            {m.firstRowHeader}
          </label>
          <div className="isolate inline-flex">
            <Button
              className={filtered ? "rounded-e-none" : undefined}
              onClick={() => download(sorted)}
              title={m.downloadAll}
            >
              <Download aria-hidden="true" />
              {message(m.download, {
                format: source.format.extension.toUpperCase(),
              })}
            </Button>
            {filtered && (
              <DropdownMenu dir={dir} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-s-none border-s border-s-primary-foreground/25"
                    aria-label={m.downloadOptions}
                    title={m.downloadOptions}
                  >
                    <ChevronDown aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-max min-w-44 data-closed:animate-none"
                >
                  <DropdownMenuItem onSelect={() => download(sorted)}>
                    {m.downloadAll}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!matches.length}
                    onSelect={() => download(matches)}
                  >
                    {m.downloadMatches}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <div className="mx-3 overflow-hidden rounded-lg border sm:mx-4">
        <Grid
          dir={dir}
          rows={rows}
          columns={columns}
          pageRows={matches.slice(offset, offset + pageSize)}
          hasHeader={hasHeader}
          offset={offset}
          sort={sort}
          changeSort={(next) => {
            setSort(next)
            setPage(0)
          }}
          edit={(row, column, value) =>
            setRows((current) => editCell(current, row, column, value))
          }
          move={(from, to) =>
            setColumnOrder((current) => moveColumn(current, from, to))
          }
          messages={m}
          number={number}
          emptyMessage={filtered ? m.noMatches : m.headerOnly}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/25 px-2.5 py-2">
          <p role="status" className="text-xs text-muted-foreground">
            {message(m.rowCount, {
              shown: number.format(matches.length),
              total: number.format(sorted.length),
            })}
          </p>
          {pages > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Button
                size="icon-xs"
                variant="outline"
                aria-label={m.previousPage}
                title={m.previousPage}
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
              </Button>
              {message(m.pageCount, {
                current: number.format(currentPage + 1),
                total: number.format(pages),
              })}
              <Button
                size="icon-xs"
                variant="outline"
                aria-label={m.nextPage}
                title={m.nextPage}
                disabled={currentPage === pages - 1}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="px-3 py-3 text-xs text-muted-foreground sm:px-4">
        {m.editHelp}
      </p>
    </>
  )
}
