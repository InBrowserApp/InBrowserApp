import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  Minus,
  Plus,
} from "@workspace/ui/icons"
import type { Fit, Messages } from "../types"

export function Toolbar({
  m,
  page,
  total,
  rtl,
  setRtl,
  fit,
  setFit,
  zoom,
  go,
  thumbnails,
  setThumbnails,
}: {
  m: Messages
  page: number
  total: number
  rtl: boolean
  setRtl: (value: boolean) => void
  fit: Fit
  setFit: (fit: Fit) => void
  zoom: number
  go: (index: number) => void
  thumbnails: boolean
  setThumbnails: (value: boolean) => void
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
      <div className="flex items-center gap-1" dir={rtl ? "rtl" : "ltr"}>
        <DocumentIconButton
          label={m.previous}
          disabled={page === 0}
          onClick={() => go(page - 1)}
        >
          {rtl ? (
            <ChevronRight aria-hidden="true" />
          ) : (
            <ChevronLeft aria-hidden="true" />
          )}
        </DocumentIconButton>
        <DocumentNumberInput
          aria-label={m.page}
          className="w-20"
          value={page + 1}
          min={1}
          max={total}
          onCommit={(value) => go(value - 1)}
        />
        <span className="text-sm text-muted-foreground tabular-nums">
          {m.pageCount.replace("{total}", String(total))}
        </span>
        <DocumentIconButton
          label={m.next}
          disabled={page === total - 1}
          onClick={() => go(page + 1)}
        >
          {rtl ? (
            <ChevronLeft aria-hidden="true" />
          ) : (
            <ChevronRight aria-hidden="true" />
          )}
        </DocumentIconButton>
        <DocumentIconButton
          label={m.thumbnails}
          aria-expanded={thumbnails}
          onClick={() => setThumbnails(!thumbnails)}
        >
          <LayoutGrid aria-hidden="true" />
        </DocumentIconButton>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1">
          <DocumentIconButton
            label={m.zoomOut}
            disabled={zoom <= 25}
            onClick={() => setFit(Math.max(25, zoom - 25))}
          >
            <Minus aria-hidden="true" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m.zoom}
            className="w-16"
            value={zoom}
            min={25}
            max={400}
            onCommit={setFit}
          />
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            %
          </span>
          <DocumentIconButton
            label={m.zoomIn}
            disabled={zoom >= 400}
            onClick={() => setFit(Math.min(400, zoom + 25))}
          >
            <Plus aria-hidden="true" />
          </DocumentIconButton>
        </div>
        <DocumentIconButton
          label={m.fitPage}
          aria-pressed={fit === "page"}
          onClick={() => setFit("page")}
        >
          <Maximize2 aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton
          label={m.fitWidth}
          aria-pressed={fit === "width"}
          onClick={() => setFit("width")}
        >
          <ArrowLeftRight aria-hidden="true" />
        </DocumentIconButton>
      </div>
      <ToggleGroup
        className="max-w-full flex-wrap"
        type="single"
        value={rtl ? "rtl" : "ltr"}
        onValueChange={(value) => {
          if (value) setRtl(value === "rtl")
        }}
        variant="outline"
        size="sm"
        aria-label={m.direction}
      >
        <ToggleGroupItem value="ltr">{m.ltr}</ToggleGroupItem>
        <ToggleGroupItem value="rtl">{m.rtl}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
