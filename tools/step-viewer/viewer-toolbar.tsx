import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Camera, Scan, Ruler, ZoomIn, ZoomOut } from "@workspace/ui/icons"
import type Messages from "./messages/en.json"
import type { View, Viewport } from "./viewport"

const views: View[] = ["isometric", "front", "top", "right"]

export function ViewerToolbar({
  messages: m,
  viewport,
  measuring,
  onMeasure,
  onSave,
}: {
  messages: typeof Messages
  viewport: Viewport
  measuring: boolean
  onMeasure: () => void
  onSave: () => void
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-3 py-2">
      <div className="flex flex-wrap items-center gap-1">
        <select
          aria-label={m.view}
          defaultValue=""
          className="me-1 h-9 max-w-full rounded-md border border-input bg-background px-2 text-sm"
          onChange={(event) => viewport.view(event.target.value as View)}
          onBlur={(event) => {
            event.currentTarget.value = ""
          }}
        >
          <option value="" disabled>
            {m.chooseView}
          </option>
          {views.map((view) => (
            <option key={view} value={view}>
              {m[view]}
            </option>
          ))}
        </select>
        <DocumentIconButton label={m.fit} onClick={viewport.fit}>
          <Scan aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton label={m.zoomIn} onClick={() => viewport.zoom(0.8)}>
          <ZoomIn aria-hidden="true" />
        </DocumentIconButton>
        <DocumentIconButton
          label={m.zoomOut}
          onClick={() => viewport.zoom(1.25)}
        >
          <ZoomOut aria-hidden="true" />
        </DocumentIconButton>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={measuring ? "secondary" : "outline"}
          aria-pressed={measuring}
          onClick={onMeasure}
        >
          <Ruler data-icon="inline-start" aria-hidden="true" />
          {m.measure}
        </Button>
        <Button onClick={onSave}>
          <Camera data-icon="inline-start" aria-hidden="true" />
          {m.save}
        </Button>
      </div>
    </div>
  )
}
