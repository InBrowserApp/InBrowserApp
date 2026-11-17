import { useEffect, useId, useRef, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { createReader } from "../reader"
import type { Format, Info, Messages, Output } from "../types"

export function DataExport({
  file,
  info,
  start,
  size,
  messages: m,
  lang,
}: {
  file: File
  info: Info
  start: number
  size: number
  messages: Messages
  lang: string
}) {
  const id = useId()
  const [format, setFormat] = useState<Format>("csv")
  const [scope, setScope] = useState("page")
  const [progress, setProgress] = useState<number | null>(null)
  const [output, setOutput] = useState<Output | null>(null)
  const [error, setError] = useState(false)
  const reader = useRef<ReturnType<typeof createReader> | null>(null)
  useEffect(
    () => () => {
      reader.current?.dispose()
      reader.current = null
    },
    []
  )
  function reset() {
    reader.current?.dispose()
    reader.current = null
    setProgress(null)
    setOutput(null)
    setError(false)
  }
  const from = scope === "all" ? 0 : start
  const end = scope === "all" ? info.rows : Math.min(start + size, info.rows)
  const number = new Intl.NumberFormat(lang)
  async function prepare() {
    reset()
    const current = createReader()
    reader.current = current
    setProgress(0)
    try {
      await current.request<Info>({ type: "open", file })
      if (reader.current !== current) return
      const result = await current.request<Output>(
        { type: "export", start: from, end, format },
        setProgress
      )
      if (reader.current === current) setOutput(result)
    } catch {
      if (reader.current === current) setError(true)
    } finally {
      current.dispose()
      if (reader.current === current) {
        reader.current = null
        setProgress(null)
      }
    }
  }
  return (
    <details className="max-h-64 shrink-0 overflow-auto border-t p-3 text-sm">
      <summary className="cursor-pointer font-medium">{m.exportTitle}</summary>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label htmlFor={`${id}-format`} className="flex flex-col gap-1 text-xs">
          {m.format}
          <select
            id={`${id}-format`}
            name="format"
            value={format}
            className="h-8 rounded-md border bg-background px-2 text-foreground"
            onChange={(event) => {
              reset()
              setFormat(event.target.value as Format)
            }}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </label>
        <label htmlFor={`${id}-scope`} className="flex flex-col gap-1 text-xs">
          {m.scope}
          <select
            id={`${id}-scope`}
            name="scope"
            value={scope}
            className="h-8 rounded-md border bg-background px-2 text-foreground"
            onChange={(event) => {
              reset()
              setScope(event.target.value)
            }}
          >
            <option value="page">{m.currentPage}</option>
            <option value="all">{m.allRows}</option>
          </select>
        </label>
        {progress !== null ? (
          <Button variant="outline" onClick={reset}>
            <Spinner aria-hidden="true" />
            {m.cancel}
          </Button>
        ) : output ? (
          <DocumentDownload
            file={output.blob}
            filename={`${file.name.replace(/\.(parquet|parq)$/i, "")}.${format}`}
            label={m.download.replace("{format}", format.toUpperCase())}
          />
        ) : (
          <Button variant="outline" onClick={() => void prepare()}>
            {m.prepare}
          </Button>
        )}
      </div>
      <p role="status" className="mt-2 text-xs">
        {progress !== null
          ? m.exporting
              .replace("{done}", number.format(progress))
              .replace("{total}", number.format(end - from))
          : output
            ? m.exportReady.replace("{rows}", number.format(output.rows))
            : ""}
      </p>
      {error ? (
        <p role="alert" className="mt-2 text-destructive">
          {m.exportError}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">{m.exportNote}</p>
    </details>
  )
}
