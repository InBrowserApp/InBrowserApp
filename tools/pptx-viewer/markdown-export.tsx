import { useEffect, useRef, useState } from "react"
import { failure } from "@workspace/pptx-markdown/errors"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import type { Messages } from "./types"

export function MarkdownExport({
  file,
  messages: m,
}: {
  file: File
  messages: Messages["markdown"]
}) {
  const controller = useRef<AbortController | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [output, setOutput] = useState<{ file: File; blob: Blob } | null>(null)
  useEffect(() => {
    setOutput(null)
    setError("")
    setBusy(false)
    return () => controller.current?.abort()
  }, [file])
  async function exportMarkdown() {
    controller.current?.abort()
    const active = new AbortController()
    controller.current = active
    setBusy(true)
    setError("")
    setOutput(null)
    try {
      const { exportDocument } = await import("@workspace/pptx-markdown")
      active.signal.throwIfAborted()
      const result = await exportDocument({ file }, m.labels, active.signal)
      if (active.signal.aborted) return
      if (result.error) throw new Error(result.error)
      setOutput({
        file,
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
        {output?.file === file ? (
          <DocumentDownload
            file={output.blob}
            filename={file.name.replace(/\.[^.]+$/, ".md")}
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
      {output?.file === file ? (
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
