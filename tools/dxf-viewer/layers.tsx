import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import type { LayerInfo } from "dxf-viewer"

export function DrawingLayers({
  id,
  hidden,
  layers,
  onToggle,
}: {
  id: string
  hidden: boolean
  layers: LayerInfo[]
  onToggle: (name: string, visible: boolean) => void
}) {
  return (
    <div
      id={id}
      hidden={hidden}
      className="max-h-40 min-w-0 overflow-y-auto border-b p-2 md:max-h-[29rem] md:border-e md:border-b-0"
    >
      {layers.map((layer) => {
        const label = layer.displayName || layer.name
        return (
          <label
            key={layer.name}
            className="flex min-w-0 items-center gap-2 rounded py-1.5 ps-1 text-sm"
          >
            <Checkbox
              checked={layer.visible}
              aria-label={label}
              onCheckedChange={(value) => onToggle(layer.name, value === true)}
            />
            <span
              className="size-3 shrink-0 rounded-sm border"
              aria-hidden="true"
              style={{
                backgroundColor: `#${layer.color.toString(16).padStart(6, "0")}`,
              }}
            />
            <span dir="auto" className="min-w-0 break-all">
              {label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
