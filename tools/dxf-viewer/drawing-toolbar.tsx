import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { ViewportFocusButton } from "@workspace/ui/components/tool/viewport-focus"
import { Button } from "@workspace/ui/components/ui/button"
import { Camera, Layers, Scan, ZoomIn, ZoomOut } from "@workspace/ui/icons"
import type { useWorkspaceFocus } from "@workspace/ui/lib/use-workspace-focus"
import type Messages from "./messages/en.json"

export function DrawingToolbar({
  messages: m,
  focus,
  onFit,
  onZoom,
  layersId,
  showLayers,
  onLayers,
  onSave,
}: {
  messages: typeof Messages
  focus: ReturnType<typeof useWorkspaceFocus>
  onFit: () => void
  onZoom: (factor: number) => void
  layersId: string
  showLayers: boolean
  onLayers?: () => void
  onSave: () => void
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b px-2 py-1.5">
      <DocumentIconButton label={m.fit} onClick={onFit}>
        <Scan aria-hidden="true" />
      </DocumentIconButton>
      <DocumentIconButton label={m.zoomIn} onClick={() => onZoom(0.8)}>
        <ZoomIn aria-hidden="true" />
      </DocumentIconButton>
      <DocumentIconButton label={m.zoomOut} onClick={() => onZoom(1.25)}>
        <ZoomOut aria-hidden="true" />
      </DocumentIconButton>
      {onLayers && (
        <Button
          size="sm"
          variant={showLayers ? "secondary" : "ghost"}
          aria-expanded={showLayers}
          aria-controls={layersId}
          onClick={onLayers}
        >
          <Layers data-icon="inline-start" aria-hidden="true" />
          {m.layers}
        </Button>
      )}
      <div className="ms-auto flex items-center gap-1">
        <Button size="sm" variant="outline" onClick={onSave}>
          <Camera data-icon="inline-start" aria-hidden="true" />
          {m.save}
        </Button>
        <ViewportFocusButton focus={focus} messages={m} />
      </div>
    </div>
  )
}
