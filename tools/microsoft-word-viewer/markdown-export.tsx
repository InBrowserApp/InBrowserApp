import { useEffect, useRef, useState } from "react"
import { failure } from "@workspace/docx-markdown/errors"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import type { Messages, Reader } from "./types"

export function MarkdownExport({
  reader,
  filename,
  messages: m,
}: {
  reader: Reader
  filename: string
  messages: Messages["markdown"]
}) {
  const controller = useRef<AbortController | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [output, setOutput] = useState<{ reader: Reader; blob: Blob } | null>(
    null
  )
  useEffect(() => {
    setOutput(null)
    setError("")
    setBusy(false)
    return () => controller.current?.abort()
  }, [reader])
  async function exportMarkdown() {
    controller.current?.abort()
    const active = new AbortController()
    controller.current = active
    setBusy(true)
    setError("")
    setOutput(null)
    try {
      const result = await reader.exportMarkdown(m.labels, active.signal)
      if (active.signal.aborted) return
      if (result.error) throw new Error(result.error)
      setOutput({
        reader,
        blob: new Blob([result.text], { type: "text/markdown;charset=utf-8" }),
      })
    } catch (reason) {
      if (!active.signal.aborted)
        setError(failure(reason) === "resource" ? m.resource : m.error)
    } finally {
      if (!active.signal.aborted) setBusy(false)
    }
  }
  return (
    <div className="shrink-0 space-y-2 border-b p-2">
      <div className="flex flex-wrap justify-end gap-2">
        {output?.reader === reader ? (
          <DocumentDownload
            file={output.blob}
            filename={filename.replace(/\.[^.]+$/, ".md")}
            label={m.download}
          />
        ) : (
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => void exportMarkdown()}
          >
            {busy ? <Spinner aria-hidden="true" /> : null}
            {busy ? m.converting : m.export}
          </Button>
        )}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {output?.reader === reader ? (
        <p className="max-h-20 overflow-auto text-xs text-muted-foreground">
          {m.note}
        </p>
      ) : null}
      <span role="status" className="sr-only">
        {busy ? m.converting : ""}
      </span>
    </div>
  )
}
