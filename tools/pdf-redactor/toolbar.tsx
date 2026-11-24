import { Button } from "@workspace/ui/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Hand,
  RectangleHorizontal,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "@workspace/ui/icons"

import type { Messages } from "./types"

type Props = {
  messages: Messages
  page: number
  total: number
  zoom: number
  pan: boolean
  canUndo: boolean
  busy: boolean
  onPage: (page: number) => void
  onZoom: (zoom: number) => void
  onPan: (pan: boolean) => void
  onUndo: () => void
}

export function Toolbar({
  messages,
  page,
  total,
  zoom,
  pan,
  canUndo,
  busy,
  onPage,
  onZoom,
  onPan,
  onUndo,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={pan ? "ghost" : "secondary"}
          aria-pressed={!pan}
          disabled={busy}
          onClick={() => onPan(false)}
        >
          <RectangleHorizontal aria-hidden="true" />
          {messages.draw}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={pan ? "secondary" : "ghost"}
          aria-pressed={pan}
          disabled={busy}
          onClick={() => onPan(true)}
        >
          <Hand aria-hidden="true" />
          {messages.pan}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          title={messages.undo}
          aria-label={messages.undo}
          disabled={!canUndo || busy}
          onClick={onUndo}
        >
          <Undo2 aria-hidden="true" className="rtl:-scale-x-100" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          title={messages.zoomOut}
          aria-label={messages.zoomOut}
          disabled={zoom <= 1 || busy}
          onClick={() => onZoom(zoom - 0.5)}
        >
          <ZoomOut aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          title={messages.fitPage}
          aria-label={messages.fitPage}
          disabled={zoom === 1 || busy}
          onClick={() => onZoom(1)}
        >
          {zoom === 1 ? messages.fitPage : `${zoom * 100}%`}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          title={messages.zoomIn}
          aria-label={messages.zoomIn}
          disabled={zoom >= 3 || busy}
          onClick={() => onZoom(zoom + 0.5)}
        >
          <ZoomIn aria-hidden="true" />
        </Button>
      </div>
      {total > 1 && (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            title={messages.previousPage}
            aria-label={messages.previousPage}
            disabled={page <= 1 || busy}
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="rtl:-scale-x-100" />
          </Button>
          <span className="text-sm tabular-nums" role="status">
            {messages.page
              .replace("{page}", String(page))
              .replace("{total}", String(total))}
          </span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            title={messages.nextPage}
            aria-label={messages.nextPage}
            disabled={page >= total || busy}
            onClick={() => onPage(page + 1)}
          >
            <ChevronRight aria-hidden="true" className="rtl:-scale-x-100" />
          </Button>
        </div>
      )}
    </div>
  )
}
