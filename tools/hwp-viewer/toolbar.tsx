import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Square,
} from "@workspace/ui/icons"
import type { Messages } from "./types"

export function Toolbar({
  page,
  total,
  zoom,
  onPage,
  onZoom,
  onFit,
  onRotate,
  messages: m,
}: {
  page: number
  total: number
  zoom: number
  onPage: (page: number) => void
  onZoom: (zoom: number) => void
  onFit: (fit: "width" | "page") => void
  onRotate: () => void
  messages: Messages
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-b p-2">
      <div className="flex items-center gap-0 sm:gap-1">
        <DocumentIconButton
          label={m.previous}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
        <DocumentNumberInput
          aria-label={m.page}
          className="w-20"
          min={1}
          max={total}
          value={page}
          onCommit={onPage}
        />
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
          {m.pageCount.replace("{total}", String(total))}
        </span>
        <DocumentIconButton
          label={m.next}
          disabled={page >= total}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
      </div>
      <div className="flex flex-wrap items-center gap-0 sm:gap-1">
        <DocumentZoom value={zoom} onChange={onZoom} messages={m} />
        <DocumentIconButton label={m.fit} onClick={() => onFit("width")}>
          <ArrowLeftRight aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton label={m.fitPage} onClick={() => onFit("page")}>
          <Square aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton label={m.rotate} onClick={onRotate}>
          <RotateCw aria-hidden="true" />
        </DocumentIconButton>
      </div>
    </div>
  )
}
