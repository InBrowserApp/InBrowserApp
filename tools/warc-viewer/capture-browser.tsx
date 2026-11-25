import { useId, useMemo, useState } from "react"
import { FileText, Globe, List, Search } from "@workspace/ui/icons"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { isHtml } from "./archive"
import type { Capture } from "./archive"
import type { Messages } from "./client"
import { indexResources, previewCapture } from "./preview"

const pageSize = 60

function HeaderList({
  title,
  rows,
}: {
  title: string
  rows: [string, string][]
}) {
  if (!rows.length) return null
  return (
    <section className="grid gap-2">
      <h3 className="font-medium">{title}</h3>
      <dl dir="ltr" className="divide-y rounded-lg border font-mono text-xs">
        {rows.map(([name, value], index) => (
          <div
            key={index}
            className="grid gap-1 px-3 py-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
          >
            <dt className="wrap-anywhere text-muted-foreground">{name}</dt>
            <dd className="wrap-anywhere">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function CaptureBrowser({
  captures,
  messages: m,
  lang,
}: {
  captures: Capture[]
  messages: Messages
  lang: string
}) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      captures.findIndex(
        (record) => record.body?.length && isHtml(record.contentType)
      )
    )
  )
  const record = captures[selected]!
  const resources = useMemo(() => indexResources(captures), [captures])
  const preview = useMemo(() => {
    if (record.body?.length && isHtml(record.contentType)) {
      return previewCapture(
        { ...record, body: record.body },
        resources,
        m.noPreview
      )
    }
    return undefined
  }, [m.noPreview, record, resources])
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return captures
      .map((record, index) => ({ record, index }))
      .filter(
        ({ record }) =>
          record.url.toLowerCase().includes(needle) ||
          record.type.includes(needle)
      )
  }, [captures, query])
  const number = new Intl.NumberFormat(lang)
  const heading = useId()
  return (
    <div className="grid min-h-0 min-w-0 flex-1 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,2fr)]">
      <aside
        aria-labelledby={heading}
        className="flex min-h-0 min-w-0 flex-col gap-2 border-b p-3 lg:border-e lg:border-b-0"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 id={heading} className="text-sm font-semibold">
            {m.records}
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {number.format(rows.length)}
          </span>
        </div>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label={m.search}
            placeholder={m.search}
            className="ps-8"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(0)
            }}
          />
        </div>
        {rows.length ? (
          <ul className="max-h-36 min-h-0 space-y-1 overflow-y-auto p-1 lg:max-h-[31rem]">
            {rows
              .slice(page * pageSize, (page + 1) * pageSize)
              .map(({ record: row, index }) => (
                <li key={index}>
                  <Button
                    variant={index === selected ? "secondary" : "ghost"}
                    aria-current={index === selected || undefined}
                    className="h-auto min-h-11 w-full justify-start gap-2 px-2 py-1.5 text-start"
                    onClick={() => setSelected(index)}
                  >
                    {isHtml(row.contentType) && row.body?.length ? (
                      <Globe aria-hidden="true" />
                    ) : (
                      <FileText aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span
                        dir="auto"
                        className="block truncate"
                        title={row.url}
                      >
                        {row.url || row.type}
                      </span>
                      <span
                        dir="ltr"
                        className="block truncate text-start text-xs font-normal text-muted-foreground"
                      >
                        {[row.type, row.date].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </Button>
                </li>
              ))}
          </ul>
        ) : (
          <p role="status" className="px-1 py-2 text-sm text-muted-foreground">
            {m.noMatches}
          </p>
        )}
        {rows.length > pageSize ? (
          <select
            aria-label={m.records}
            className="w-full rounded-md border bg-background px-2 py-1 text-sm"
            value={page}
            onChange={(event) => setPage(Number(event.target.value))}
          >
            {Array.from(
              { length: Math.ceil(rows.length / pageSize) },
              (_, index) => (
                <option key={index} value={index}>
                  {number.format(index * pageSize + 1)}–
                  {number.format(Math.min((index + 1) * pageSize, rows.length))}
                </option>
              )
            )}
          </select>
        ) : null}
      </aside>
      <Tabs
        key={selected}
        defaultValue={preview ? "preview" : "details"}
        className="min-h-0 min-w-0 gap-0"
      >
        <div className="border-b p-3">
          <TabsList>
            {preview ? (
              <TabsTrigger value="preview">
                <Globe aria-hidden="true" />
                {m.preview}
              </TabsTrigger>
            ) : null}
            <TabsTrigger value="details">
              <List aria-hidden="true" />
              {m.details}
            </TabsTrigger>
          </TabsList>
        </div>
        {preview ? (
          <TabsContent
            value="preview"
            className="flex min-h-0 flex-col data-[state=inactive]:hidden"
          >
            <iframe
              title={preview.title || m.preview}
              srcDoc={preview.html}
              sandbox=""
              className="h-[min(50vh,30rem)] min-h-56 w-full flex-1 bg-white group-data-[focus=true]/workspace:h-auto"
            />
            {preview.notes.local || preview.notes.remote ? (
              <p className="border-t px-3 py-2 text-xs text-muted-foreground">
                {m.missing}
              </p>
            ) : null}
          </TabsContent>
        ) : null}
        <TabsContent
          value="details"
          className="max-h-[33rem] space-y-4 overflow-auto p-4"
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              [m.url, record.url],
              [m.date, record.date],
              [m.type, record.type],
              [m.httpStatus, record.status],
            ].map(([label, value]) =>
              value ? (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd
                    dir="ltr"
                    className="text-start font-medium wrap-anywhere"
                  >
                    {value}
                  </dd>
                </div>
              ) : null
            )}
          </dl>
          {!preview ? (
            <p className="text-muted-foreground">{m.noPreview}</p>
          ) : null}
          <HeaderList title={m.warcHeaders} rows={record.headers} />
          <HeaderList title={m.httpHeaders} rows={record.httpHeaders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
