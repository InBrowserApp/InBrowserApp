import { useMemo } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Check, FileText } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import { usePdfPagePreviews } from "../client/use-pdf-page-previews"

import type { PagePreviewMap } from "../client/use-pdf-page-previews"
import type { PdfSplitterMessages } from "../client/types"

type PageGridProps = Readonly<{
  file: File | null
  messages: PdfSplitterMessages
  onTogglePage: (page: number, useRange: boolean) => void
  pageCount: number
  selectedPages: readonly number[]
}>

function PageGrid({
  file,
  messages,
  onTogglePage,
  pageCount,
  selectedPages,
}: PageGridProps) {
  const previews = usePdfPagePreviews(file, pageCount)
  const selectedPageSet = useMemo(() => new Set(selectedPages), [selectedPages])
  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, index) => index + 1),
    [pageCount]
  )

  return (
    <Card className="gap-0 bg-muted/15 py-0">
      <CardHeader className="border-b px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle>{messages.pageGridTitle}</CardTitle>
            <CardDescription>{messages.pageGridDescription}</CardDescription>
          </div>
          <Badge variant="secondary">
            {formatTemplate(messages.selectedSummary, {
              pageCount,
              selectedCount: selectedPages.length,
            })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid max-h-none grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3 overflow-visible pe-0 sm:max-h-[42rem] sm:overflow-auto sm:pe-1">
          {pages.map((page) => {
            const selected = selectedPageSet.has(page)

            return (
              <PageTile
                key={page}
                label={formatTemplate(messages.pageTileLabel, { page })}
                onTogglePage={onTogglePage}
                page={page}
                preview={previews[page]}
                selected={selected}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

type PageTileProps = Readonly<{
  label: string
  onTogglePage: (page: number, useRange: boolean) => void
  page: number
  preview: PagePreviewMap[number] | undefined
  selected: boolean
}>

function PageTile({
  label,
  onTogglePage,
  page,
  preview,
  selected,
}: PageTileProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        "group relative flex min-w-0 touch-manipulation flex-col rounded-lg p-1.5 text-start transition-colors hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      )}
      onClick={(event) => onTogglePage(page, event.shiftKey)}
      type="button"
    >
      <span
        className={cn(
          "relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-md border bg-background shadow-sm transition-colors",
          selected && "border-primary/70 ring-2 ring-primary/20"
        )}
      >
        {preview ? (
          <img
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            decoding="async"
            height={preview.height}
            loading="lazy"
            src={preview.src}
            width={preview.width}
          />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText />
          </span>
        )}

        <span className="absolute start-2 top-2 rounded-md bg-background/95 px-1.5 py-0.5 font-mono text-xs text-foreground shadow-sm ring-1 ring-border">
          {page}
        </span>

        {selected ? (
          <span className="absolute end-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Check />
          </span>
        ) : null}
      </span>
    </button>
  )
}

function formatTemplate(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(values, key) ? String(values[key]) : match
  )
}

export { PageGrid, formatTemplate }
