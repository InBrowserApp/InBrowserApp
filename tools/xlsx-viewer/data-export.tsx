import { useEffect, useRef, useState } from "react"
import { WorksheetExportOptions } from "@workspace/ui/components/tool/worksheet-export-options"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { failure } from "@workspace/spreadsheet-export/errors"
import type { Options, Output } from "@workspace/spreadsheet-export/types"
import type { Messages, Reader } from "./types"

export function DataExport({
  reader,
  sheet,
  messages: m,
}: {
  reader: Reader
  sheet: number
  messages: Messages["dataExport"]
}) {
  const [options, setOptions] = useState<Options>({
    sheet,
    range: "",
    format: "csv",
    values: "formatted",
    firstRowHeader: true,
  })
  const controller = useRef<AbortController | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [output, setOutput] = useState<{ data: Output; blob: Blob } | null>(
    null
  )
  useEffect(() => () => controller.current?.abort(), [reader, sheet])
  function reset() {
    controller.current?.abort()
    setOutput(null)
    setError("")
    setBusy(false)
  }
  async function prepare() {
    reset()
    const active = new AbortController()
    controller.current = active
    setBusy(true)
    try {
      const session = await reader.exportSession()
      active.signal.throwIfAborted()
      const data = await session.export({ ...options, sheet }, active.signal)
      if (!active.signal.aborted)
        setOutput({ data, blob: new Blob([data.text], { type: data.mime }) })
    } catch (reason) {
      if (!active.signal.aborted)
        setError(failure(reason) === "resource" ? m.resource : m.error)
    } finally {
      if (!active.signal.aborted) setBusy(false)
    }
  }
  return (
    <details className="max-h-64 shrink-0 overflow-auto border-t p-3 text-sm">
      <summary className="cursor-pointer font-medium">{m.title}</summary>
      <div className="mt-3 space-y-3">
        <WorksheetExportOptions
          value={options}
          onChange={(value) => {
            reset()
            setOptions({ ...options, ...value })
          }}
          messages={m}
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          {output ? (
            <DocumentDownload
              file={output.blob}
              filename={output.data.filename}
              label={m.download}
            />
          ) : (
            <Button
              variant="outline"
              onClick={() => void prepare()}
              disabled={busy}
            >
              {busy ? <Spinner aria-hidden="true" /> : null}
              {busy ? m.converting : m.action}
            </Button>
          )}
        </div>
        {error ? (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        ) : null}
        <p role="status">
          {busy
            ? m.converting
            : output
              ? m.summary
                  .replace("{rows}", String(output.data.rows))
                  .replace("{columns}", String(output.data.columns))
              : ""}
        </p>
        {output?.data.empty ? <p>{m.empty}</p> : null}
        {output?.data.missingCached ? (
          <p>
            {m.missingCached.replace(
              "{count}",
              String(output.data.missingCached)
            )}
          </p>
        ) : null}
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>{m.formatNote}</p>
          <p>{m.valuesNote}</p>
          <p>{m.scopeNote}</p>
        </div>
      </div>
    </details>
  )
}
