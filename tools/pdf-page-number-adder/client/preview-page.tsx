import {
  buildPageNumberLabel,
  resolvePageNumberCoordinates,
} from "../core/page-number-layout"

import type { PageNumberFormOptions, PdfPageNumberAdderMessages } from "./types"
import type { PdfPagePreview } from "./use-pdf-page-preview"

type PreviewPageProps = Readonly<{
  fontFamily: string
  isRenderingPreview: boolean
  messages: PdfPageNumberAdderMessages
  options: PageNumberFormOptions
  pageCount: number
  preview: PdfPagePreview | null
  selectedPageIndex: number
}>

const FALLBACK_PAGE_HEIGHT = 792
const FALLBACK_PAGE_WIDTH = 612

function PreviewPage({
  fontFamily,
  isRenderingPreview,
  messages,
  options,
  pageCount,
  preview,
  selectedPageIndex,
}: PreviewPageProps) {
  const label = buildPageNumberLabel(
    selectedPageIndex,
    pageCount || 12,
    options.startNumber,
    options.format
  )
  const pageHeight = preview?.pageHeight ?? FALLBACK_PAGE_HEIGHT
  const pageWidth = preview?.pageWidth ?? FALLBACK_PAGE_WIDTH
  const textWidth = estimateTextWidth(label, options.fontSize, fontFamily)
  const coordinates = resolvePageNumberCoordinates({
    fontSize: options.fontSize,
    marginX: options.marginX,
    marginY: options.marginY,
    pageHeight,
    pageWidth,
    position: options.position,
    textWidth,
  })
  const textY = pageHeight - coordinates.y

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-muted/30 p-3">
      <div
        className="relative overflow-hidden rounded-sm border border-border bg-white text-black shadow-lg"
        style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}
      >
        {preview ? (
          <img
            alt=""
            className="size-full object-cover"
            height={preview.height}
            src={preview.imageUrl}
            width={preview.width}
          />
        ) : (
          <FallbackPage
            isRenderingPreview={isRenderingPreview}
            messages={messages}
          />
        )}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        >
          <text
            fill="currentColor"
            fontFamily={fontFamily}
            fontSize={options.fontSize}
            x={coordinates.x}
            y={textY}
          >
            {label}
          </text>
        </svg>
      </div>
    </div>
  )
}

function FallbackPage({
  isRenderingPreview,
  messages,
}: Readonly<{
  isRenderingPreview: boolean
  messages: PdfPageNumberAdderMessages
}>) {
  return (
    <>
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200" />
      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-200" />
      {isRenderingPreview ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {messages.readingPdfTitle}
        </div>
      ) : null}
    </>
  )
}

function estimateTextWidth(
  label: string,
  fontSize: number,
  fontFamily: string
) {
  const averageGlyphWidth = fontFamily.includes("Times") ? 0.5 : 0.56

  return label.length * fontSize * averageGlyphWidth
}

export { PreviewPage }
