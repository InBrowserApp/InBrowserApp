import { useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { useReader } from "../use-reader"
import { Pagination } from "./pagination"
import { DataTable, SchemaTable } from "./tables"
import { DataExport } from "./data-export"
import type { Messages } from "../types"

export function Viewer({
  file,
  messages: m,
  lang,
}: {
  file: File
  messages: Messages
  lang: string
}) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(50)
  const start = page * size
  const { info, rows, loading, error } = useReader(file, start, size)
  const number = new Intl.NumberFormat(lang)
  return (
    <>
      {info ? (
        <div className="shrink-0 space-y-1 border-b px-3 py-2 text-xs text-muted-foreground">
          <p className="text-foreground tabular-nums">
            {m.summary
              .replace("{rows}", number.format(info.rows))
              .replace("{columns}", number.format(info.columns.length))
              .replace("{groups}", number.format(info.groups))}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              {m.codecs}:{" "}
              <span translate="no">{info.codecs.join(", ") || m.none}</span>
            </span>
            {info.createdBy ? (
              <span className="min-w-0 truncate" title={info.createdBy}>
                {m.createdBy}: {info.createdBy}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      <Tabs
        defaultValue="data"
        dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
        className="min-h-0 flex-1 gap-0"
      >
        {info ? (
          <TabsList className="mx-3 my-2 shrink-0">
            <TabsTrigger value="data">{m.data}</TabsTrigger>
            <TabsTrigger value="schema">{m.schema}</TabsTrigger>
          </TabsList>
        ) : null}
        <TabsContent
          value="data"
          className="flex min-h-0 flex-1 flex-col"
          aria-busy={loading}
        >
          {loading ? (
            <p
              role="status"
              className="flex flex-1 items-center justify-center gap-2 p-6"
            >
              <Spinner aria-hidden="true" />
              {info ? m.reading : m.loading}
            </p>
          ) : error ? (
            <p role="alert" className="p-4 text-sm text-destructive">
              {m[error]}
            </p>
          ) : info?.rows === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">{m.empty}</p>
          ) : info ? (
            <DataTable
              key={`${page}-${size}`}
              info={info}
              rows={rows}
              start={start}
              messages={m}
              lang={lang}
            />
          ) : null}
          {info ? (
            <>
              <p
                role="status"
                className="shrink-0 px-3 py-1 text-xs text-muted-foreground tabular-nums"
              >
                {m.range
                  .replace("{start}", number.format(info.rows ? start + 1 : 0))
                  .replace(
                    "{end}",
                    number.format(Math.min(start + size, info.rows))
                  )
                  .replace("{total}", number.format(info.rows))}
              </p>
              <Pagination
                page={page}
                size={size}
                total={info.rows}
                busy={loading}
                onPage={setPage}
                onSize={(value) => {
                  setPage(0)
                  setSize(value)
                }}
                messages={m}
                lang={lang}
              />
            </>
          ) : null}
        </TabsContent>
        <TabsContent value="schema" className="flex min-h-0 flex-1 flex-col">
          {info ? <SchemaTable info={info} messages={m} /> : null}
        </TabsContent>
      </Tabs>
      {info ? (
        <DataExport
          key={`${page}-${size}`}
          file={file}
          info={info}
          start={start}
          size={size}
          messages={m}
          lang={lang}
        />
      ) : null}
    </>
  )
}
