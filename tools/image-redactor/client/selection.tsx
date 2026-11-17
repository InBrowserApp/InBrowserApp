import {
  center,
  normalizeRotation,
  resizeRegion,
  rotate,
} from "../core/geometry"
import type { Messages, Region } from "../types"
import type { Editor } from "./use-editor"

export function Selection({
  region,
  scale,
  editor,
  messages,
}: {
  region: Region
  scale: number
  editor: Editor
  messages: Messages
}) {
  const size = 16 / scale
  const gap = 28 / scale
  function keyDown(event: React.KeyboardEvent, mode: "rotate" | "resize") {
    if (
      !event.key.startsWith("Arrow") &&
      event.key !== "Enter" &&
      event.key !== " "
    )
      return
    event.preventDefault()
    event.stopPropagation()
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1
    if (mode === "rotate")
      editor.updateSelected({
        rotation: normalizeRotation(
          region.rotation + delta * (event.shiftKey ? 15 : 1)
        ),
      })
    else {
      const step = delta * (event.shiftKey ? 10 : 1)
      const corner = rotate(
        {
          x: region.x + region.width + step,
          y: region.y + region.height + step,
        },
        center(region),
        region.rotation
      )
      const next = resizeRegion(region, corner)
      editor.commit(editor.regions.map((r) => (r.id === next.id ? next : r)))
    }
  }
  return (
    <g
      transform={`translate(${region.x + region.width / 2} ${region.y + region.height / 2}) rotate(${region.rotation}) translate(${-region.width / 2} ${-region.height / 2})`}
      fill="none"
      stroke="#2563eb"
      strokeWidth={1.5 / scale}
    >
      <rect
        x={0}
        y={0}
        width={region.width}
        height={region.height}
        stroke="white"
        strokeWidth={3 / scale}
        pointerEvents="none"
      />
      <rect
        x={0}
        y={0}
        width={region.width}
        height={region.height}
        strokeDasharray={`${5 / scale} ${3 / scale}`}
        pointerEvents="none"
      />
      <line
        x1={region.width / 2}
        y1={0}
        x2={region.width / 2}
        y2={-gap}
        pointerEvents="none"
      />
      {(["resize", "rotate"] as const).map((mode) => (
        <foreignObject
          key={mode}
          x={(mode === "resize" ? region.width : region.width / 2) - size}
          y={(mode === "resize" ? region.height : -gap) - size}
          width={size * 2}
          height={size * 2}
        >
          <button
            type="button"
            data-handle={mode}
            aria-label={
              mode === "resize" ? messages.resizeHandle : messages.rotateHandle
            }
            className="grid size-full place-items-center rounded-sm focus-visible:outline-2 focus-visible:outline-blue-600"
            style={{ cursor: mode === "resize" ? "nwse-resize" : "grab" }}
            onKeyDown={(event) => keyDown(event, mode)}
          >
            <span
              style={{
                width: 12 / scale,
                height: 12 / scale,
                borderWidth: 2 / scale,
              }}
              className="rounded-full border-blue-600 bg-white shadow-sm"
            />
          </button>
        </foreignObject>
      ))}
    </g>
  )
}
