import { useCallback, useEffect, useState } from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"

import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { ChevronLeft, ChevronRight, LoaderCircle } from "@workspace/ui/icons"

import type { Messages } from "./client"
import { PageInput } from "./page-input"

type Preview = {
  pdf: PDFDocumentProxy
  render: (typeof import("./pdf-preview"))["renderPreview"]
}
type RenderResult = { page: number; canvas: HTMLCanvasElement | null }

export function PdfPreview({
  file,
  page,
  total,
  onPage,
  messages,
}: {
  file: File
  page: number
  total: number
  onPage: (page: number) => void
  messages: Messages
}) {
  const [preview, setPreview] = useState<Preview | "error" | null>(null)
  const [result, setResult] = useState<RenderResult | null>(null)

  const current = result?.page === page ? result : null
  const canvas = current?.canvas
  const error = preview === "error" || current?.canvas === null
  const mountCanvas = useCallback(
    (surface: HTMLDivElement | null) => {
      if (canvas) surface?.replaceChildren(canvas)
    },
    [canvas]
  )

  useEffect(() => {
    const lifetime = new AbortController()
    void import("./pdf-preview")
      .then(async ({ openPreview, renderPreview }) => {
        const pdf = await openPreview(file, lifetime.signal)
        if (!lifetime.signal.aborted) setPreview({ pdf, render: renderPreview })
      })
      .catch(() => {
        if (!lifetime.signal.aborted) setPreview("error")
      })
    return () => lifetime.abort()
  }, [file])

  useEffect(() => {
    if (!preview || preview === "error") return
    const lifetime = new AbortController()
    void preview.render(preview.pdf, page, lifetime.signal).then(
      (canvas) => {
        if (!lifetime.signal.aborted) setResult({ page, canvas })
      },
      () => {
        if (!lifetime.signal.aborted) setResult({ page, canvas: null })
      }
    )
    return () => lifetime.abort()
  }, [page, preview])

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 sm:px-5">
        <CardTitle>{messages.preview}</CardTitle>
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={messages.previousPage}
            title={messages.previousPage}
            disabled={page === 1}
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
          </Button>
          <PageInput
            label={messages.previewPage}
            value={page}
            total={total}
            onPage={onPage}
          />
          <span className="px-1 text-sm text-muted-foreground">
            {messages.pageCount.replace("{total}", String(total))}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={messages.nextPage}
            title={messages.nextPage}
            disabled={page === total}
            onClick={() => onPage(page + 1)}
          >
            <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <div className="grid min-h-56 place-items-center border-t bg-muted/45 p-4 sm:min-h-104 sm:p-5">
        {canvas ? (
          <div
            ref={mountCanvas}
            role="img"
            aria-label={messages.pageBookmark.replace("{page}", String(page))}
            className="flex w-full min-w-0 justify-center [&>canvas]:max-h-[30rem] [&>canvas]:max-w-full [&>canvas]:object-contain [&>canvas]:shadow-sm"
          />
        ) : (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            {error ? (
              messages.previewError
            ) : (
              <>
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                {messages.renderingPage}
              </>
            )}
          </p>
        )}
      </div>
    </Card>
  )
}
