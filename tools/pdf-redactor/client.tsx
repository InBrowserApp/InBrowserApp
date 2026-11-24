import { useRef, useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card } from "@workspace/ui/components/ui/card"
import {
  Download,
  FileText,
  LoaderCircle,
  Lock,
  TriangleAlert,
  Upload,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { Preview } from "./preview"
import { Toolbar } from "./toolbar"
import { usePdf } from "./use-pdf"
import type { ReactNode } from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import type { Messages, Redactions, Region } from "./types"

type Props = { messages: Messages }

export default function PdfRedactor({ messages }: Props) {
  const picker = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const busy = progress > 0
  const pdf = usePdf(file)

  return (
    <div
      className="space-y-3"
      onDragOver={(event) => {
        event.preventDefault()
        if (!pdf || "error" in pdf) setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const next = event.dataTransfer.files[0]
        if ((!pdf || "error" in pdf) && next) setFile(next)
      }}
    >
      <input
        ref={picker}
        type="file"
        accept=".pdf,application/pdf"
        aria-label={messages.choosePdf}
        className="hidden"
        disabled={busy}
        onChange={(event) => {
          const next = event.currentTarget.files?.[0]
          if (next) setFile(next)
          event.currentTarget.value = ""
        }}
      />
      <Card
        className={cn(
          "gap-0 overflow-hidden py-0",
          dragging && "ring-2 ring-ring"
        )}
      >
        {pdf && "document" in pdf ? (
          <Editor
            document={pdf.document}
            name={pdf.file.name}
            messages={messages}
            onChange={() => picker.current?.click()}
            progress={progress}
            onProgress={setProgress}
          />
        ) : (
          <div className="p-4 sm:p-6">
            <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/35 p-5 text-center">
              <span className="rounded-xl border bg-background p-3 text-muted-foreground">
                <FileText className="size-6" aria-hidden="true" />
              </span>
              <p className="text-base font-medium">
                {file && !pdf ? messages.opening : messages.dropPdf}
              </p>
              <Button type="button" onClick={() => picker.current?.click()}>
                <Upload aria-hidden="true" />
                {messages.choosePdf}
              </Button>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" aria-hidden="true" />
                {messages.localOnly}
              </p>
            </div>
          </div>
        )}
      </Card>
      {pdf && "error" in pdf && <Problem>{messages.openError}</Problem>}
    </div>
  )
}

function Editor({
  document,
  name,
  messages,
  onChange,
  progress,
  onProgress,
}: Props & {
  document: PDFDocumentProxy
  name: string
  onChange: () => void
  progress: number
  onProgress: (page: number) => void
}) {
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState(false)
  const [redactions, setRedactions] = useState<Redactions>({})
  const [result, setResult] = useState<"downloaded" | "exportError">()
  const regions = redactions[page] ?? []
  const count = Object.values(redactions).reduce(
    (sum, marks) => sum + (marks?.length ?? 0),
    0
  )
  const busy = progress > 0
  const exportStatus = messages.exporting
    .replace("{page}", String(progress))
    .replace("{total}", String(document.numPages))

  function addRegion(region: Region) {
    setRedactions((current) => ({
      ...current,
      [page]: [...(current[page] ?? []), region],
    }))
    setResult(undefined)
  }

  function undo() {
    setRedactions((current) => ({
      ...current,
      [page]: current[page]?.slice(0, -1) ?? [],
    }))
    setResult(undefined)
  }

  async function download() {
    if (busy || !count) return
    onProgress(1)
    setResult(undefined)
    try {
      const { exportPdf } = await import("./export-pdf")
      const bytes = await exportPdf(document, redactions, onProgress)
      const url = URL.createObjectURL(
        new Blob([bytes.slice()], { type: "application/pdf" })
      )
      const link = window.document.createElement("a")
      link.href = url
      link.download = `${name.replace(/\.pdf$/i, "")}-redacted.pdf`
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
      setResult("downloaded")
    } catch {
      setResult("exportError")
    } finally {
      onProgress(0)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <FileText
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <bdi className="truncate" title={name}>
            {name}
          </bdi>
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={onChange}
        >
          <Upload aria-hidden="true" />
          {messages.changePdf}
        </Button>
      </div>
      <Toolbar
        messages={messages}
        page={page}
        total={document.numPages}
        zoom={zoom}
        pan={pan}
        canUndo={regions.length > 0}
        busy={busy}
        onPage={setPage}
        onZoom={setZoom}
        onPan={setPan}
        onUndo={undo}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-sm">
        <p className="text-muted-foreground">
          {pan ? messages.panHint : messages.drawingHint}
        </p>
        <p className="tabular-nums" role="status">
          {messages.redactions.replace("{count}", String(count))}
        </p>
      </div>
      <Preview
        key={page}
        document={document}
        page={page}
        zoom={zoom}
        pan={pan}
        regions={regions}
        busy={busy}
        messages={messages}
        onRegion={addRegion}
      />
      <div className="space-y-3 border-t px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-muted-foreground">
            {messages.exportNote}
          </p>
          <Button
            type="button"
            disabled={!count || busy}
            onClick={() => void download()}
          >
            {busy ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Download aria-hidden="true" />
            )}
            {busy ? exportStatus : messages.download}
          </Button>
        </div>
        {busy && (
          <p className="sr-only" role="status">
            {exportStatus}
          </p>
        )}
        {result === "downloaded" && (
          <p className="text-sm text-muted-foreground" role="status">
            {messages.downloaded}
          </p>
        )}
        {result === "exportError" && <Problem>{messages.exportError}</Problem>}
      </div>
    </>
  )
}

function Problem({ children }: { children: ReactNode }) {
  return (
    <Alert variant="destructive" role="alert">
      <TriangleAlert aria-hidden="true" />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
