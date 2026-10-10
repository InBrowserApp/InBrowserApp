import { useEffect, useRef, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { failureMessage } from "@workspace/cbz/errors"
import type { Messages } from "./types"

export function PdfExport({
  file,
  m,
}: {
  file: File
  m: Messages["pdfExport"]
}) {
  const controller = useRef<AbortController | null>(null)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [output, setOutput] = useState<{
    source: File
    pdf: Blob
    total: number
  } | null>(null)
  useEffect(() => () => controller.current?.abort(), [file])
  function cancel() {
    controller.current?.abort()
    setStatus("")
    setError("")
    setOutput(null)
  }
  async function prepare() {
    cancel()
    const active = new AbortController()
    controller.current = active
    setStatus(m.reading)
    try {
      const { preparePdf } = await import("@workspace/cbz/pdf")
      active.signal.throwIfAborted()
      const result = await preparePdf(file, active.signal, (progress) => {
        if (!active.signal.aborted)
          setStatus(
            progress.saving
              ? m.saving
              : m.converting
                  .replace("{page}", String(progress.page))
                  .replace("{total}", String(progress.total)) +
                  " " +
                  progress.name
          )
      })
      if (!active.signal.aborted)
        setOutput({ source: file, pdf: result.pdf, total: result.names.length })
    } catch (reason) {
      if (!active.signal.aborted) setError(failureMessage(reason, m))
    } finally {
      if (!active.signal.aborted) setStatus("")
    }
  }
  const current = output?.source === file ? output : null
  return (
    <details className="max-h-64 shrink-0 overflow-auto border-t p-3 text-sm">
      <summary className="cursor-pointer font-medium">{m.title}</summary>
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {current ? (
            <DocumentDownload
              file={current.pdf}
              filename={file.name.replace(/\.cbz$/i, ".pdf")}
              label={m.download}
            />
          ) : status ? (
            <Button variant="outline" onClick={cancel}>
              {m.cancel}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => void prepare()}>
              {m.action}
            </Button>
          )}
        </div>
        <p role="status" className="flex items-center gap-2 wrap-anywhere">
          {status ? <Spinner className="shrink-0" /> : null}
          {status ||
            (current ? m.ready.replace("{total}", String(current.total)) : "")}
        </p>
        {error ? (
          <p role="alert" className="wrap-anywhere text-destructive">
            {error}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">{m.note}</p>
      </div>
    </details>
  )
}
