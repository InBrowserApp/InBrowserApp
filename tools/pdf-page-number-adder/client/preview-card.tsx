import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"

import { buildPageNumberLabel } from "../core/page-number-layout"
import { formatMessage } from "./utils"

import type { PageNumberPosition } from "../core/types"
import type { PageNumberFormOptions, PdfPageNumberAdderMessages } from "./types"

type PreviewCardProps = Readonly<{
  messages: PdfPageNumberAdderMessages
  options: PageNumberFormOptions
  pageCount: number
  selectedPageCount: number
}>

const positionClassNames: Record<PageNumberPosition, string> = {
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "right-6 bottom-6",
  "top-center": "top-6 left-1/2 -translate-x-1/2",
  "top-left": "top-6 left-6",
  "top-right": "top-6 right-6",
}

function PreviewCard({
  messages,
  options,
  pageCount,
  selectedPageCount,
}: PreviewCardProps) {
  const sampleTotal = pageCount || 12
  const label = buildPageNumberLabel(
    0,
    sampleTotal,
    options.startNumber,
    options.format
  )
  const fontSize = Math.min(24, Math.max(10, options.fontSize))
  const fontFamily =
    options.fontFamily === "serif"
      ? '"Times New Roman", Times, serif'
      : "Helvetica, Arial, sans-serif"
  const selectedPagesLabel = pageCount
    ? selectedPageCount === pageCount
      ? messages.allPagesSelected
      : formatMessage(messages.selectedPagesCount, {
          count: selectedPageCount,
        })
    : messages.previewSamplePage

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="mx-auto w-full max-w-72">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border bg-white text-black shadow-lg">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-200" />
            <span
              className={cn(
                "absolute max-w-[70%] truncate text-center leading-none",
                positionClassNames[options.position]
              )}
              style={{ fontFamily, fontSize }}
            >
              {label}
            </span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {selectedPagesLabel}
        </p>
      </CardContent>
    </Card>
  )
}

export { PreviewCard }
