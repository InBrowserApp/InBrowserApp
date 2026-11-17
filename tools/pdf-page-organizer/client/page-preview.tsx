import { FileText, LoaderCircle } from "@workspace/ui/icons"

import type {
  PdfPageEntry,
  PdfPageOrganizerMessages,
  PdfPagePreview,
} from "./types"

function PagePreview({
  isRenderingPreviews,
  messages,
  page,
  preview,
  previewError,
}: Readonly<{
  isRenderingPreviews: boolean
  messages: PdfPageOrganizerMessages
  page: PdfPageEntry
  preview: PdfPagePreview | undefined
  previewError: string
}>) {
  if (!preview) {
    const label =
      previewError ||
      (isRenderingPreviews
        ? messages.renderingPreviewsLabel
        : messages.previewUnavailableLabel)

    return (
      <div className="flex h-full min-h-44 items-center justify-center rounded-md border border-dashed bg-muted/30 text-muted-foreground">
        <div className="flex flex-col items-center gap-2 px-3 text-center text-xs">
          {isRenderingPreviews && !previewError ? (
            <LoaderCircle
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <FileText aria-hidden="true" />
          )}
          <span>{label}</span>
        </div>
      </div>
    )
  }

  const sideways = page.rotation % 180 !== 0
  const width = sideways ? preview.height : preview.width
  const height = sideways ? preview.width : preview.height

  return (
    <div className="flex h-full min-h-44 items-center justify-center overflow-hidden rounded-md border bg-muted/30 p-3">
      <svg
        aria-label={`${messages.previewAltLabel} ${page.sourcePageNumber}`}
        className="size-full drop-shadow-sm"
        height={height}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <image
          height={preview.height}
          href={preview.dataUrl}
          transform={`translate(${width / 2} ${height / 2}) rotate(${page.rotation}) translate(${-preview.width / 2} ${-preview.height / 2})`}
          width={preview.width}
        />
      </svg>
    </div>
  )
}

export { PagePreview }
