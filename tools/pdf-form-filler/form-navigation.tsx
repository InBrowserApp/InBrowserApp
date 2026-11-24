import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "@workspace/ui/icons"
import type { Reader } from "@workspace/pdf-reader"
import type englishMessages from "./messages/en.json"

export function FormNavigation({
  reader,
  page,
  total,
  zoom,
  lang,
  messages: m,
}: {
  reader: Reader
  page: number
  total: number
  zoom: number
  lang: string
  messages: typeof englishMessages
}) {
  const numbers = new Intl.NumberFormat(lang)
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b px-2 py-1 sm:gap-x-4 sm:px-3">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <DocumentIconButton
          label={m.previous}
          disabled={page === 1}
          onClick={() => reader.page(page - 1)}
        >
          <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
        <DocumentNumberInput
          aria-label={m.page}
          className="w-12 sm:w-16"
          min={1}
          max={total}
          value={page}
          onCommit={reader.page}
        />
        <span className="text-sm text-muted-foreground tabular-nums">
          {m.pageCount.replace("{total}", numbers.format(total))}
        </span>
        <DocumentIconButton
          label={m.next}
          disabled={page === total}
          onClick={() => reader.page(page + 1)}
        >
          <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <DocumentIconButton
          label={m.zoomOut}
          disabled={zoom <= 25}
          onClick={() => reader.zoom(Math.max(25, zoom - 25))}
        >
          <Minus aria-hidden="true" />
        </DocumentIconButton>
        <span className="min-w-10 text-center text-sm tabular-nums">
          {new Intl.NumberFormat(lang, { style: "percent" }).format(zoom / 100)}
        </span>
        <DocumentIconButton
          label={m.zoomIn}
          disabled={zoom >= 400}
          onClick={() => reader.zoom(Math.min(400, zoom + 25))}
        >
          <Plus aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton
          label={m.fitWidth}
          onClick={() => reader.zoom("page-width")}
        >
          <ArrowLeftRight aria-hidden="true" />
        </DocumentIconButton>
      </div>
    </div>
  )
}
