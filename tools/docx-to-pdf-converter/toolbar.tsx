import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "@workspace/ui/icons"
import type { Reader, ReaderState } from "@workspace/pdf-reader"
import type { Messages } from "./types"

export function Toolbar({
  reader,
  state,
  m,
}: {
  reader: Reader
  state: ReaderState
  m: Messages
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
      <div className="flex items-center">
        <DocumentIconButton
          label={m.previous}
          disabled={state.page <= 1}
          onClick={() => reader.page(state.page - 1)}
        >
          <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
        <DocumentNumberInput
          aria-label={m.page}
          value={state.page}
          min={1}
          max={state.total}
          onCommit={reader.page}
          className="w-20"
        />
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
          {m.pageCount.replace("{total}", String(state.total))}
        </span>
        <DocumentIconButton
          label={m.next}
          disabled={state.page >= state.total}
          onClick={() => reader.page(state.page + 1)}
        >
          <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
      </div>
      <div className="flex items-center">
        <DocumentZoom value={state.zoom} onChange={reader.zoom} messages={m} />
        <DocumentIconButton
          label={m.fitWidth}
          onClick={() => reader.zoom("page-width")}
        >
          <ArrowLeftRight aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton
          label={m.fitPage}
          onClick={() => reader.zoom("page-fit")}
        >
          <Maximize2 aria-hidden="true" />
        </DocumentIconButton>
      </div>
    </div>
  )
}
