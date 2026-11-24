import { useState, type ReactNode } from "react"
import type Viewer from "bpmn-js/lib/NavigatedViewer"
import type { PageSize } from "@workspace/svg-pdf"
import {
  PdfPageSizeSelect,
  type PdfPageSizeLabels,
} from "@workspace/ui/components/tool/pdf-page-size-select"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, LoaderCircle } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import type Messages from "./messages/en.json"

type Format = "pdf" | "svg"

export function DiagramDownloads({
  filename,
  getViewer,
  language,
  messages: m,
  paperSizes,
  size,
  onSizeChange,
  children,
}: {
  filename: string
  getViewer: () => Viewer | undefined
  language: string
  messages: typeof Messages
  paperSizes?: PdfPageSizeLabels
  size: PageSize
  onSizeChange: (size: PageSize) => void
  children: ReactNode
}) {
  const [pending, setPending] = useState<Format | null>(null)
  const [error, setError] = useState<Format | null>(null)

  async function download(format: Format) {
    const viewer = getViewer()
    if (!viewer) return
    setError(null)
    setPending(format)

    try {
      const { svg } = await viewer.saveSVG()
      if (getViewer() !== viewer) return
      if (!svg) throw new Error("Empty SVG export")

      let blob: Blob
      if (format === "pdf") {
        const { createDiagramPdf } = await import("@workspace/svg-pdf")
        blob = await createDiagramPdf(svg, size, language)
      } else {
        blob = new Blob([svg], { type: "image/svg+xml" })
      }
      if (getViewer() !== viewer) return

      const stem = filename.replace(/\.(?:bpmn|xml)$/i, "") || "bpmn-diagram"
      downloadBlob(blob, `${stem}.${format}`)
    } catch {
      if (getViewer() === viewer) setError(format)
    } finally {
      if (getViewer() === viewer) setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
      {paperSizes && (
        <PdfPageSizeSelect
          labels={paperSizes}
          value={size}
          onChange={onSizeChange}
        />
      )}
      <Button
        type="button"
        size="sm"
        className="h-auto min-h-9 max-w-full whitespace-normal max-sm:min-h-10"
        onClick={() => void download("pdf")}
        disabled={Boolean(pending)}
        aria-busy={pending === "pdf" || undefined}
      >
        {pending === "pdf" ? (
          <LoaderCircle
            data-icon="inline-start"
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Download data-icon="inline-start" aria-hidden="true" />
        )}
        {pending === "pdf" ? m.creatingPdf : m.downloadPdf}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-auto min-h-9 max-w-full whitespace-normal max-sm:min-h-10"
        onClick={() => void download("svg")}
        disabled={Boolean(pending)}
        aria-label={m.downloadSvg}
      >
        <Download data-icon="inline-start" aria-hidden="true" />
        <span className="hidden sm:inline">{m.downloadSvg}</span>
        <span className="sm:hidden">SVG</span>
      </Button>
      <div className="ms-auto flex items-center gap-1">{children}</div>
      {error && (
        <p role="status" className="basis-full text-sm text-destructive">
          {error === "pdf" ? m.pdfError : m.exportError}
        </p>
      )}
    </div>
  )
}
