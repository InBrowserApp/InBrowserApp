import { useEffect, useId, useRef, useState } from "react"
import type { PageSize } from "@workspace/svg-pdf"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import type { PdfPageSizeLabels } from "@workspace/ui/components/tool/pdf-page-size-select"
import { Button } from "@workspace/ui/components/ui/button"
import { Eye, Maximize2 } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { DownloadToolbar } from "./download-toolbar"
import type { ExportFormat } from "./download-toolbar"
import { examples } from "./examples"
import { SourcePanel } from "./source-panel"
import type { FileMessages } from "./source-panel"

import type Messages from "./messages/en.json"

type Result = { source: string } & ({ svg: string } | { error: string })
type ExportState = { format: ExportFormat; failed?: boolean }
type ConverterMessages = FileMessages & PdfPageSizeLabels

export default function Client({
  messages: m,
  language,
  converter,
}: {
  messages: typeof Messages
  language?: string
  converter?: ConverterMessages
}) {
  const previewId = useId()
  const [source, setSource] = useState(converter ? "" : examples.flowchart)
  const [filename, setFilename] = useState("mermaid-diagram")
  const [pageSize, setPageSize] = useState<PageSize>("original")
  const [result, setResult] = useState<Result>()
  const [actualSize, setActualSize] = useState(false)
  const [exportState, setExportState] = useState<ExportState>()
  const sourceVersion = useRef(0)
  const current = result?.source === source ? result : undefined
  const svg = current && "svg" in current ? current.svg : undefined
  const error = current && "error" in current ? current.error : undefined
  const url = svg && `data:image/svg+xml,${encodeURIComponent(svg)}`
  const exporting = exportState?.failed ? undefined : exportState?.format

  useEffect(() => {
    if (!source.trim()) return

    let obsolete = false
    const timer = window.setTimeout(async () => {
      try {
        const { renderDiagram } = await import("./render")
        if (obsolete) return
        const svg = await renderDiagram(source)
        if (!obsolete) setResult({ source, svg })
      } catch (error) {
        if (!obsolete)
          setResult({
            source,
            error: error instanceof Error ? error.message : "",
          })
      }
    }, 250)

    return () => {
      obsolete = true
      window.clearTimeout(timer)
    }
  }, [source])

  async function save(format: ExportFormat) {
    if (!url || !svg) return
    const version = sourceVersion.current
    setExportState({ format })
    try {
      let blob: Blob
      if (format === "pdf") {
        const { createDiagramPdf } = await import("@workspace/svg-pdf")
        blob = await createDiagramPdf(svg, pageSize, language)
      } else {
        const { createPng } = await import("./render")
        blob = await createPng(url)
      }
      if (version !== sourceVersion.current) return
      downloadBlob(blob, `${filename}.${format}`)
      setExportState(undefined)
    } catch {
      if (version === sourceVersion.current)
        setExportState({ format, failed: true })
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SourcePanel
        messages={m}
        fileLabels={converter}
        source={source}
        onChange={(value, name) => {
          sourceVersion.current++
          setExportState(undefined)
          setSource(value)
          if (name !== undefined) setFilename(name)
        }}
      />

      <section
        aria-labelledby={previewId}
        className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
      >
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
          <h2 id={previewId} className="flex items-center gap-2 font-medium">
            <Eye aria-hidden="true" className="size-4 text-muted-foreground" />
            {m.preview}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <DocumentIconButton
              label={m.fit}
              disabled={!url}
              aria-pressed={!actualSize}
              className="aria-pressed:bg-accent"
              onClick={() => setActualSize(false)}
            >
              <Maximize2 aria-hidden="true" />
            </DocumentIconButton>
            <Button
              size="sm"
              variant="ghost"
              aria-label={m.actualSize}
              title={m.actualSize}
              disabled={!url}
              aria-pressed={actualSize}
              className="aria-pressed:bg-accent"
              onClick={() => setActualSize(true)}
            >
              1:1
            </Button>
          </div>
        </div>
        <div className="relative min-h-56 flex-1 bg-white text-zinc-700 sm:min-h-72 lg:min-h-96">
          {url ? (
            <div
              role="group"
              aria-labelledby={previewId}
              dir="ltr"
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keep the full-size preview keyboard-scrollable.
              tabIndex={actualSize ? 0 : undefined}
              className="absolute inset-0 overflow-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <div
                className={
                  actualSize
                    ? "flex min-h-full w-max min-w-full p-4"
                    : "size-full p-4"
                }
              >
                <img
                  src={url}
                  alt={m.preview}
                  className={
                    actualSize
                      ? "m-auto block h-auto w-auto max-w-none"
                      : "block size-full object-scale-down"
                  }
                />
              </div>
            </div>
          ) : (
            <div
              role="status"
              className="absolute inset-0 grid min-w-0 content-center p-4 text-center text-sm"
            >
              {error !== undefined ? (
                <>
                  <p className="font-medium text-red-800">{m.invalid}</p>
                  {error && (
                    <pre
                      dir="ltr"
                      className="mt-2 max-h-32 overflow-auto text-start text-xs break-words whitespace-pre-wrap"
                    >
                      {error}
                    </pre>
                  )}
                </>
              ) : source.trim() ? (
                m.loading
              ) : (
                m.empty
              )}
            </div>
          )}
        </div>
        <DownloadToolbar
          labels={m}
          sizes={converter}
          pageSize={pageSize}
          setPageSize={setPageSize}
          url={url}
          filename={filename}
          exporting={exporting}
          save={save}
        />
        {exportState?.failed && (
          <p
            role="status"
            className="border-t px-4 py-2 text-sm text-destructive"
          >
            {exportState.format === "pdf" ? m.pdfError : m.exportError}
          </p>
        )}
      </section>
    </div>
  )
}
