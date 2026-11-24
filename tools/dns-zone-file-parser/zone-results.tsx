/* oxlint-disable jsx-a11y/no-interactive-element-to-noninteractive-role -- Keep native table semantics when narrow screens lay rows out as grids. */
import { useId } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Search, TriangleAlert } from "@workspace/ui/icons"

import type { Note, ZoneRecord } from "./core/zone"
import type english from "./messages/en.json"

const COLUMNS = ["name", "type", "data", "ttl", "class"] as const

export function ZoneResults({
  records,
  notes,
  messages,
  language,
  query,
  onQueryChange,
}: {
  records: ZoneRecord[]
  notes: Note[]
  messages: typeof english
  language: string
  query: string
  onQueryChange: (value: string) => void
}) {
  const id = useId()
  const filter = query.trim().toLowerCase()
  const visible = records.filter(({ name, type, data }) =>
    [name, type, data].some((value) => value.toLowerCase().includes(filter))
  )
  const format = new Intl.NumberFormat(language)
  const count = messages.count
    .replace("{shown}", format.format(visible.length))
    .replace("{total}", format.format(records.length))

  return (
    <Card>
      <CardContent className="grid min-w-0 gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">{messages.records}</h2>
            <p className="text-sm text-muted-foreground">{count}</p>
          </div>
          <ToolCopyButton
            value={visible.length ? JSON.stringify(visible, null, 2) : ""}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
          />
        </div>
        {notes.length > 0 && (
          <details
            className="rounded-md border bg-muted/30 p-3"
            open={!records.length}
          >
            <summary className="cursor-pointer text-sm font-medium">
              <TriangleAlert
                className="me-1.5 inline size-4 align-text-bottom"
                aria-hidden="true"
              />
              {messages.issues.replace("{count}", format.format(notes.length))}
            </summary>
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto text-sm">
              {notes.map(({ line, code, directive }) => (
                <li key={`${line}-${code}`} className="break-words">
                  <span className="font-medium">
                    {messages.line.replace("{line}", format.format(line))}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {messages[code].replace("{directive}", directive ?? "")}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
        {records.length > 0 && (
          <div className="grid max-w-sm gap-1.5">
            <label className="text-sm font-medium" htmlFor={id}>
              {messages.search}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-2.5 top-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id={id}
                value={query}
                placeholder={messages.searchPlaceholder}
                className="ps-8"
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </div>
          </div>
        )}
        {visible.length > 0 ? (
          <div className="overflow-hidden rounded-md border">
            <table
              role="table"
              className="block w-full border-collapse text-sm md:table"
              aria-label={messages.records}
            >
              <thead
                role="rowgroup"
                className="sr-only bg-muted/50 text-start text-xs font-medium md:not-sr-only md:table-header-group"
              >
                <tr role="row">
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      role="columnheader"
                      className="px-3 py-2.5 text-start"
                    >
                      {messages[column]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup" className="block md:table-row-group">
                {visible.map((record) => (
                  <tr
                    key={record.line}
                    role="row"
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 border-t p-3 align-top first:border-t-0 md:table-row md:p-0 md:first:border-t"
                  >
                    <td
                      role="cell"
                      className="min-w-0 font-mono wrap-anywhere md:px-3 md:py-2.5"
                    >
                      <bdi dir="ltr">{record.name}</bdi>
                    </td>
                    <td role="cell" className="font-mono md:px-3 md:py-2.5">
                      <bdi className="rounded bg-muted px-1.5 py-0.5 text-xs md:bg-transparent md:p-0 md:text-sm">
                        {record.type}
                      </bdi>
                    </td>
                    <td
                      role="cell"
                      className="col-span-full min-w-0 wrap-anywhere md:w-1/2 md:px-3 md:py-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="block text-xs text-muted-foreground md:hidden"
                      >
                        {messages.data}
                      </span>
                      <bdi dir="ltr" className="font-mono">
                        {record.data}
                      </bdi>
                    </td>
                    <td
                      role="cell"
                      className="tabular-nums md:px-3 md:py-2.5 md:whitespace-nowrap"
                    >
                      <span
                        aria-hidden="true"
                        className="block text-xs text-muted-foreground md:hidden"
                      >
                        {messages.ttl}
                      </span>
                      {record.ttl === null ? "—" : format.format(record.ttl)}
                    </td>
                    <td role="cell" className="md:px-3 md:py-2.5">
                      <span
                        aria-hidden="true"
                        className="block text-xs text-muted-foreground md:hidden"
                      >
                        {messages.class}
                      </span>
                      <bdi className="font-mono">{record.class}</bdi>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {records.length ? messages.noMatches : messages.noRecords}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
