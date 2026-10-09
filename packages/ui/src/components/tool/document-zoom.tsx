import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Minus, Plus } from "@workspace/ui/icons"

export function DocumentZoom({
  value,
  onChange,
  messages: m,
}: {
  value: number
  onChange: (value: number) => void
  messages: Record<"zoom" | "zoomIn" | "zoomOut", string>
}) {
  return (
    <div className="flex items-center gap-0 sm:gap-1">
      <DocumentIconButton
        label={m.zoomOut}
        disabled={value <= 25}
        onClick={() => onChange(Math.max(25, value - 25))}
      >
        <Minus aria-hidden="true" />
      </DocumentIconButton>
      <DocumentNumberInput
        aria-label={m.zoom}
        className="w-20"
        value={value}
        min={25}
        max={400}
        step={1}
        onCommit={onChange}
      />
      <span aria-hidden="true" className="text-sm text-muted-foreground">
        %
      </span>
      <DocumentIconButton
        label={m.zoomIn}
        disabled={value >= 400}
        onClick={() => onChange(Math.min(400, value + 25))}
      >
        <Plus aria-hidden="true" />
      </DocumentIconButton>
    </div>
  )
}
