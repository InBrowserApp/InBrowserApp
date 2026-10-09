import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import {
  BookOpen,
  Code,
  List,
  ArrowLeftRight,
  RotateCw,
} from "@workspace/ui/icons"
import type { Ref } from "react"
import type { MarkdownPreviewerMessages } from "../types"

export function ReaderToolbar({
  m,
  reading,
  onReading,
  outline,
  onOutline,
  outlineId,
  outlineButton,
  zoom,
  onZoom,
  wide,
  onWide,
}: {
  m: MarkdownPreviewerMessages
  reading: boolean
  onReading: (value: boolean) => void
  outline: boolean
  onOutline: () => void
  outlineId: string
  outlineButton: Ref<HTMLButtonElement>
  zoom: number
  onZoom: (value: number) => void
  wide: boolean
  onWide: () => void
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-b px-3 py-1">
      <div className="flex items-center gap-1">
        <ToggleGroup
          type="single"
          value={reading ? "read" : "edit"}
          size="sm"
          variant="outline"
          aria-label={m.mode}
          onValueChange={(value) => {
            if (value) onReading(value === "read")
          }}
        >
          <ToggleGroupItem value="read">
            <BookOpen data-icon="inline-start" />
            {m.read}
          </ToggleGroupItem>
          <ToggleGroupItem value="edit">
            <Code data-icon="inline-start" />
            {m.edit}
          </ToggleGroupItem>
        </ToggleGroup>
        <DocumentIconButton
          ref={outlineButton}
          label={m.showOutlineLabel}
          aria-expanded={outline}
          aria-controls={outline ? outlineId : undefined}
          onClick={onOutline}
        >
          <List aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton label={m.wide} aria-pressed={wide} onClick={onWide}>
          <ArrowLeftRight aria-hidden="true" />
        </DocumentIconButton>
      </div>
      <div className="flex items-center gap-0">
        <DocumentZoom value={zoom} onChange={onZoom} messages={m} />
        <DocumentIconButton
          label={m.resetZoom}
          disabled={zoom === 100}
          onClick={() => onZoom(100)}
        >
          <RotateCw aria-hidden="true" />
        </DocumentIconButton>
      </div>
    </div>
  )
}
