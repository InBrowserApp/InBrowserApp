import type { RefObject } from "react"
import { RotateCw } from "@workspace/ui/icons"
import { rotatePoint, type WatermarkGeometry } from "../core/geometry"
import { CORNERS, cornerSigns } from "../core/transform"
import type { Messages, Options } from "../types"
import { useTransform } from "./use-transform"

export function TransformOverlay({
  canvas,
  geometry: g,
  options,
  messages: m,
  onChange,
  hintId,
}: {
  canvas: RefObject<HTMLCanvasElement | null>
  geometry: WatermarkGeometry
  options: Options
  messages: Messages
  onChange: (options: Options) => void
  hintId: string
}) {
  const events = useTransform(canvas, g, options, onChange)
  const top = rotatePoint({ x: 0, y: -g.height / 2 }, g.radians)
  return (
    <div
      className="pointer-events-none absolute inset-0"
      data-watermark-controls=""
    >
      <div
        className="absolute min-h-8 min-w-16"
        style={{
          left: `${(g.x / g.imageWidth) * 100}%`,
          top: `${(g.y / g.imageHeight) * 100}%`,
          width: `${(g.width / g.imageWidth) * 100}%`,
          height: `${(g.height / g.imageHeight) * 100}%`,
          transform: `translate(-50%, -50%) rotate(${options.rotation}deg)`,
        }}
      >
        <button
          type="button"
          aria-label={m.moveWatermark}
          aria-describedby={hintId}
          className="pointer-events-auto absolute inset-0 cursor-move touch-none border border-primary bg-transparent ring-1 ring-background select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          {...events("move")}
        />
        {CORNERS.map((corner) => {
          const signs = cornerSigns(corner)
          const angle =
            (((options.rotation + (signs.x === signs.y ? 45 : 135)) % 180) +
              180) %
            180
          return (
            <button
              key={corner}
              type="button"
              aria-label={m.resizeWatermark.replace("{corner}", m[corner])}
              aria-describedby={hintId}
              className="pointer-events-auto absolute flex size-6 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                left: signs.x < 0 ? "0%" : "100%",
                top: signs.y < 0 ? "0%" : "100%",
                cursor: [
                  "ew-resize",
                  "nwse-resize",
                  "ns-resize",
                  "nesw-resize",
                ][Math.round(angle / 45) % 4],
              }}
              {...events(corner)}
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-xs border border-primary bg-background ring-1 ring-background"
              />
            </button>
          )
        })}
      </div>
      <button
        type="button"
        aria-label={m.rotateWatermark}
        aria-describedby={hintId}
        className="pointer-events-auto absolute flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full border border-primary bg-background text-foreground ring-1 ring-background select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing"
        style={{
          left: `clamp(-12px, calc(${((g.x + top.x) / g.imageWidth) * 100}% + ${28 * Math.sin(g.radians)}px), calc(100% + 12px))`,
          top: `clamp(-12px, calc(${((g.y + top.y) / g.imageHeight) * 100}% - ${28 * Math.cos(g.radians)}px), calc(100% + 12px))`,
        }}
        {...events("rotate")}
      >
        <RotateCw aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  )
}
